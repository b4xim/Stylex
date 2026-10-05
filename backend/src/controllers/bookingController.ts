import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../config/db';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';
import { SlotService } from '../services/slotService';
import { WhatsAppService } from '../services/whatsappService';
import { EmailService } from '../services/emailService';

export class BookingController {
  /**
   * Public: Query available time slots for a given date
   */
  public static async getAvailableSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { date, stylistId, gender } = req.query;

      if (!date || typeof date !== 'string') {
        throw new AppError('Date query parameter (YYYY-MM-DD) is required', 400);
      }

      const slots = await SlotService.getSlotsForDate(
        date,
        typeof stylistId === 'string' ? stylistId : undefined,
        typeof gender === 'string' ? gender : undefined
      );

      res.status(200).json({
        success: true,
        data: slots,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public: Create a new appointment booking
   * Automatically executes CRM capture, slot concurrency lock, and triggers WhatsApp/Email notifications
   */
  public static async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        customerName,
        customerPhone,
        countryCode = '+91',
        customerEmail,
        serviceId,
        serviceIds,
        secondaryServiceId,
        stylistId,
        gender,
        date,
        timeSlot,
        notes,
        source = 'WEBSITE',
      } = req.body;

      if (!customerName || !customerPhone || (!serviceId && (!Array.isArray(serviceIds) || serviceIds.length === 0)) || !date || !timeSlot) {
        throw new AppError('Name, phone, service, date, and time slot are required', 400);
      }

      // Enforce booking engine status when booking is submitted from client website
      if (source === 'WEBSITE') {
        const engineSetting = await prisma.salonSetting.findUnique({
          where: { key: 'bookingEngineActive' },
        });
        if (engineSetting && (engineSetting.value === 'false' || (engineSetting.value as any) === false)) {
          throw new AppError('Online booking is currently paused. Please contact our salon front desk via Call or WhatsApp directly.', 403);
        }
      }

      // Normalize date to standard ISO YYYY-MM-DD
      let normalizedDate = String(date).trim();
      if (normalizedDate.toLowerCase() === 'today') {
        normalizedDate = new Date().toISOString().split('T')[0];
      } else {
        const parsedD = new Date(normalizedDate);
        if (!isNaN(parsedD.getTime()) && !/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
          const y = parsedD.getFullYear();
          const m = String(parsedD.getMonth() + 1).padStart(2, '0');
          const d = String(parsedD.getDate()).padStart(2, '0');
          normalizedDate = `${y}-${m}-${d}`;
        }
      }

      // Clean stylistId (ignore 'Any Stylist', 'Any Master Artisan')
      let cleanStylistId: string | undefined = undefined;
      if (stylistId && typeof stylistId === 'string') {
        const lower = stylistId.toLowerCase();
        if (!lower.includes('any') && !lower.includes('master artisan')) {
          cleanStylistId = stylistId;
        }
      }

      // 1. Resolve selected services (support single serviceId or multiple serviceIds array)
      const requestedIds: string[] = Array.isArray(serviceIds) && serviceIds.length > 0
        ? serviceIds.map(String)
        : [serviceId, secondaryServiceId].filter(Boolean).map(String);

      let matchedServices = await prisma.service.findMany({
        where: {
          OR: requestedIds.map((sid) => ({ id: sid })),
        },
      });

      // If no exact IDs matched, try searching by name or fallback
      if (matchedServices.length === 0) {
        let fallback = await prisma.service.findFirst({
          where: {
            OR: [
              { id: serviceId || (requestedIds[0] || 'default') },
              { name: { contains: serviceId || requestedIds[0] || '', mode: 'insensitive' } },
            ],
          },
        });
        if (!fallback) {
          fallback = await prisma.service.findFirst({ where: { isActive: true } });
        }
        if (!fallback) {
          fallback = await prisma.service.create({
            data: {
              id: serviceId || 'signature-treatment',
              name: 'Signature Salon Treatment',
              category: 'Hair & Styling',
              gender: 'gents',
              durationMins: 35,
              price: 250,
              description: 'Signature Salon Service',
            },
          });
        }
        matchedServices = [fallback];
      }

      const primaryService = matchedServices[0];
      const hasMultipleServices = matchedServices.length > 1;
      const combinedServiceName = matchedServices.map((s) => s.name).join(' + ');

      // Secondary service & combo details
      let secondaryService = null;
      let secondaryPrice = 0;
      let secondaryName: string | null = null;
      if (hasMultipleServices) {
        secondaryService = matchedServices[1];
        const secondaryGroup = matchedServices.slice(1);
        secondaryName = secondaryGroup.map((s) => s.name).join(' + ');
        secondaryPrice = secondaryGroup.reduce((sum, s) => sum + s.price, 0);
      } else if (secondaryServiceId) {
        secondaryService = await prisma.service.findFirst({
          where: {
            OR: [
              { id: secondaryServiceId },
              { name: { contains: secondaryServiceId, mode: 'insensitive' } },
            ],
          },
        });
        if (secondaryService) {
          secondaryPrice = secondaryService.price;
          secondaryName = secondaryService.name;
        }
      }

      // Optional stylist lookup
      let stylist = null;
      if (cleanStylistId) {
        stylist = await prisma.stylist.findFirst({
          where: {
            OR: [
              { id: cleanStylistId },
              { name: { contains: cleanStylistId, mode: 'insensitive' } },
            ],
          },
        });
      }

      const subtotal = matchedServices.reduce((sum, s) => sum + s.price, 0) + (secondaryService && !hasMultipleServices ? secondaryPrice : 0);
      const total = subtotal;

      const targetGender = gender || primaryService.gender || 'gents';

      // 2. Concurrency Guard: Verify slot availability (stylistId is null if customer chose Any Stylist; targetGender limits to 3 per slot)
      await SlotService.assertSlotAvailable(normalizedDate, timeSlot, stylist?.id || null, targetGender);

      // 3. Generate unique Reference
      const bookingRef = await SlotService.generateBookingRef();

      // 4. Database Transaction: Upsert Customer & Create Booking
      const result = await prisma.$transaction(async (tx) => {
        // Upsert customer in CRM by normalized mobile number
        const rawDigits = customerPhone.replace(/[^0-9]/g, '');
        let cleanPhone = rawDigits;
        if (countryCode === '+91' || countryCode === '91') {
          if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
            cleanPhone = cleanPhone.slice(2);
          } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
            cleanPhone = cleanPhone.slice(1);
          }
        }
        const fullGuestPhone = `${countryCode} ${cleanPhone}`;
        const cleanGuestEmail = customerEmail ? customerEmail.trim().toLowerCase() : null;

        const customer = await tx.customer.upsert({
          where: {
            countryCode_phone: {
              countryCode,
              phone: cleanPhone,
            },
          },
          update: {
            totalVisits: { increment: 1 },
            totalSpent: { increment: total },
          },
          create: {
            name: customerName,
            phone: cleanPhone,
            countryCode,
            email: cleanGuestEmail,
            totalVisits: 1,
            totalSpent: total,
          },
        });

        // 3b. Generate unguessable management token for client self-service
        const managementToken = crypto.randomBytes(16).toString('hex');

        // Create booking with individual guest identity snapshot
        const booking = await tx.booking.create({
          data: {
            bookingRef,
            managementToken,
            customerId: customer.id,
            guestName: customerName,
            guestPhone: fullGuestPhone,
            guestEmail: cleanGuestEmail,
            serviceId: primaryService.id,
            secondaryServiceId: secondaryService?.id,
            secondaryService: secondaryName || secondaryService?.name,
            secondaryPrice: secondaryService ? secondaryPrice : null,
            stylistId: stylist?.id,
            date: normalizedDate,
            timeSlot,
            status: 'CONFIRMED',
            subtotal,
            total,
            notes: hasMultipleServices && (!notes || !notes.includes(combinedServiceName))
              ? (notes ? `${notes}\n[Selected Services: ${combinedServiceName}]` : `[Selected Services: ${combinedServiceName}]`)
              : notes,
            source,
            paymentStatus: 'PENDING',
          },
          include: {
            customer: true,
            service: true,
            stylist: true,
          },
        });

        return booking;
      });

      // 5. Trigger Asynchronous Notifications (Non-blocking)
      const fullPhone = `${countryCode}${customerPhone.replace(/[^0-9]/g, '')}`;
      const rawAppUrl = env.APP_URL || '';
      const clientPortalUrl = (!rawAppUrl || rawAppUrl.includes('localhost:5000') || rawAppUrl.includes('127.0.0.1'))
        ? 'https://stylexsalon.in'
        : rawAppUrl.replace(/\/+$/, '');
      const manageUrl = `${clientPortalUrl}/?manage=${result.managementToken || result.bookingRef}`;

      WhatsAppService.sendBookingConfirmation({
        bookingRef: result.bookingRef,
        customerName: result.customer.name,
        customerPhone: fullPhone,
        serviceName: combinedServiceName || result.service.name,
        date: result.date,
        timeSlot: result.timeSlot,
        total: result.total,
        stylistName: result.stylist?.name,
        manageUrl,
      }).then(async (res) => {
        if (res.success) {
          await prisma.booking.update({
            where: { id: result.id },
            data: { whatsappStatus: 'SENT' },
          });
        }
      }).catch((e) => console.error('Failed to send WhatsApp confirmation:', e));

      if (result.customer.email) {
        EmailService.sendBookingConfirmation({
          toEmail: result.customer.email,
          customerName: result.customer.name,
          bookingRef: result.bookingRef,
          serviceName: combinedServiceName || result.service.name,
          date: result.date,
          timeSlot: result.timeSlot,
          total: result.total,
          stylistName: result.stylist?.name,
          manageUrl,
        }).then(async (res) => {
          if (res.success) {
            await prisma.booking.update({
              where: { id: result.id },
              data: { emailStatus: 'SENT' },
            });
          }
        }).catch((e) => console.error('Failed to send Email confirmation:', e));
      }

      // Generate direct WhatsApp chat URL for client confirmation (includes self-service link)
      const directWhatsAppUrl = WhatsAppService.generateDirectChatUrl(
        fullPhone,
        `Hello StyleX, I have booked appointment ${result.bookingRef} for ${combinedServiceName || result.service.name} on ${result.date} at ${result.timeSlot}.\n\nManage or Reschedule link: ${manageUrl}`
      );

      res.status(201).json({
        success: true,
        message: 'Appointment booked successfully!',
        data: {
          booking: result,
          managementToken: result.managementToken || result.bookingRef,
          manageUrl,
          directWhatsAppUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: List bookings with filters (date, status, search)
   */
  public static async listBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { date, status, search, limit = '100', offset = '0' } = req.query;

      const whereClause: any = {};

      if (date && typeof date === 'string') {
        whereClause.date = date;
      }

      if (status && typeof status === 'string' && status !== 'ALL') {
        whereClause.status = status;
      }

      if (search && typeof search === 'string') {
        whereClause.OR = [
          { bookingRef: { contains: search, mode: 'insensitive' } },
          { customer: { name: { contains: search, mode: 'insensitive' } } },
          { customer: { phone: { contains: search } } },
          { guestName: { contains: search, mode: 'insensitive' } },
          { guestPhone: { contains: search } },
        ];
      }

      const [bookings, totalCount] = await Promise.all([
        prisma.booking.findMany({
          where: whereClause,
          include: {
            customer: true,
            service: true,
            stylist: true,
          },
          orderBy: [{ date: 'desc' }, { timeSlot: 'asc' }],
          take: parseInt(limit as string, 10),
          skip: parseInt(offset as string, 10),
        }),
        prisma.booking.count({ where: whereClause }),
      ]);

      res.status(200).json({
        success: true,
        data: bookings,
        total: totalCount,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Update booking status (e.g. COMPLETED, CANCELLED)
   */
  public static async updateBookingStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status, paymentStatus, notes } = req.body;

      const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
      if (status && !validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: {
          ...(status ? { status } : {}),
          ...(paymentStatus ? { paymentStatus } : {}),
          ...(notes !== undefined ? { notes } : {}),
        },
        include: {
          customer: true,
          service: true,
          stylist: true,
        },
      });

      res.status(200).json({
        success: true,
        message: `Booking updated to ${status || 'new state'}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Resend WhatsApp notification voucher
   */
  public static async resendWhatsApp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: { customer: true, service: true, stylist: true },
      });

      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      const fullPhone = `${booking.customer.countryCode}${booking.customer.phone}`;
      const result = await WhatsAppService.sendBookingConfirmation({
        bookingRef: booking.bookingRef,
        customerName: booking.customer.name,
        customerPhone: fullPhone,
        serviceName: booking.service.name,
        date: booking.date,
        timeSlot: booking.timeSlot,
        total: booking.total,
        stylistName: booking.stylist?.name,
      });

      await prisma.booking.update({
        where: { id },
        data: { whatsappStatus: result.success ? 'SENT' : 'FAILED' },
      });

      res.status(200).json({
        success: result.success,
        message: result.success ? 'WhatsApp notification sent!' : 'Failed to send WhatsApp message',
        error: result.error,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Permanently delete a booking record
   */
  public static async deleteBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;

      const booking = await prisma.booking.findUnique({ where: { id } });
      if (!booking) {
        res.status(404).json({ success: false, message: 'Booking not found' });
        return;
      }

      await prisma.booking.delete({ where: { id } });

      res.status(200).json({
        success: true,
        message: 'Booking permanently deleted',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public: Retrieve a booking for client self-service via token or ref
   */
  public static async getBookingByToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = String(req.params.token || '').trim();
      if (!token) {
        throw new AppError('Booking management token or reference is required', 400);
      }

      const booking = await prisma.booking.findFirst({
        where: {
          OR: [
            { managementToken: token },
            { bookingRef: { equals: token, mode: 'insensitive' as const } },
            { id: token },
          ],
        },
        include: {
          customer: true,
          service: true,
          stylist: true,
        },
      });

      if (!booking) {
        throw new AppError('Reservation pass not found. Please verify the link or reference number.', 404);
      }

      // Calculate hours until appointment
      let canModify = true;
      let hoursUntilAppointment = 999;
      try {
        const timeMatch = booking.timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (timeMatch) {
          let h = parseInt(timeMatch[1], 10);
          const m = parseInt(timeMatch[2], 10);
          const mer = timeMatch[3].toUpperCase();
          if (mer === 'PM' && h < 12) h += 12;
          if (mer === 'AM' && h === 12) h = 0;
          const aptDate = new Date(`${booking.date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
          hoursUntilAppointment = (aptDate.getTime() - Date.now()) / (1000 * 60 * 60);
        }
      } catch {}

      // Check if 2-hour cutoff policy is enabled in settings
      const cutoffSetting = await prisma.salonSetting.findUnique({
        where: { key: 'reschedulePolicy24h' },
      });
      const isCutoffEnforced = !cutoffSetting || (cutoffSetting.value !== 'false' && (cutoffSetting.value as any) !== false);

      if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED' || (isCutoffEnforced && hoursUntilAppointment < 2)) {
        canModify = false;
      }

      res.status(200).json({
        success: true,
        data: {
          id: booking.id,
          bookingRef: booking.bookingRef,
          managementToken: booking.managementToken || booking.bookingRef,
          customerName: booking.guestName || booking.customer.name,
          customerPhone: booking.guestPhone || booking.customer.phone,
          customerEmail: booking.guestEmail || booking.customer.email,
          service: {
            id: booking.service.id,
            name: booking.service.name,
            duration: booking.service.durationMins,
            price: booking.service.price,
            category: booking.service.category,
            gender: booking.service.gender,
          },
          stylist: booking.stylist ? {
            id: booking.stylist.id,
            name: booking.stylist.name,
            avatarUrl: booking.stylist.imageUrl,
          } : null,
          secondaryService: booking.secondaryService,
          secondaryPrice: booking.secondaryPrice,
          date: booking.date,
          timeSlot: booking.timeSlot,
          status: booking.status,
          total: booking.total,
          notes: booking.notes,
          canModify,
          hoursUntilAppointment: Math.round(hoursUntilAppointment * 10) / 10,
          createdAt: booking.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public: Look up active upcoming bookings by mobile number
   */
  public static async lookupBookingsByPhone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone } = req.body;
      if (!phone || typeof phone !== 'string') {
        throw new AppError('Mobile number is required to search reservations', 400);
      }

      const digits = phone.replace(/[^0-9]/g, '');
      const last10 = digits.length >= 10 ? digits.slice(-10) : digits;

      if (last10.length < 7) {
        throw new AppError('Please enter a valid mobile number with at least 7 digits', 400);
      }

      const bookings = await prisma.booking.findMany({
        where: {
          OR: [
            { guestPhone: { contains: last10 } },
            { customer: { phone: { contains: last10 } } },
          ],
          status: { in: ['CONFIRMED', 'PENDING'] },
        },
        include: {
          service: true,
          stylist: true,
        },
        orderBy: [
          { date: 'asc' },
          { timeSlot: 'asc' },
        ],
        take: 10,
      });

      res.status(200).json({
        success: true,
        data: bookings.map((b) => ({
          id: b.id,
          bookingRef: b.bookingRef,
          managementToken: b.managementToken || b.bookingRef,
          customerName: b.guestName,
          serviceName: b.service.name,
          stylistName: b.stylist?.name || 'Any Stylist',
          date: b.date,
          timeSlot: b.timeSlot,
          status: b.status,
          total: b.total,
        })),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public: Reschedule an existing appointment
   */
  public static async rescheduleBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = String(req.params.token || '').trim();
      const { date, timeSlot, stylistId } = req.body;

      if (!token || !date || !timeSlot) {
        throw new AppError('Date and time slot are required to reschedule', 400);
      }

      const booking = await prisma.booking.findFirst({
        where: {
          OR: [
            { managementToken: token },
            { bookingRef: { equals: token, mode: 'insensitive' as const } },
            { id: token },
          ],
        },
        include: {
          customer: true,
          service: true,
          stylist: true,
        },
      });

      if (!booking) {
        throw new AppError('Reservation pass not found', 404);
      }

      if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
        throw new AppError(`Cannot reschedule an appointment that is already ${booking.status.toLowerCase()}`, 400);
      }

      // Check cutoff rule if enabled (2 hours before current appointment)
      const cutoffSetting = await prisma.salonSetting.findUnique({
        where: { key: 'reschedulePolicy24h' },
      });
      const isCutoffEnforced = !cutoffSetting || (cutoffSetting.value !== 'false' && (cutoffSetting.value as any) !== false);

      if (isCutoffEnforced) {
        const timeMatch = booking.timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (timeMatch) {
          let h = parseInt(timeMatch[1], 10);
          const m = parseInt(timeMatch[2], 10);
          const mer = timeMatch[3].toUpperCase();
          if (mer === 'PM' && h < 12) h += 12;
          if (mer === 'AM' && h === 12) h = 0;
          const aptDate = new Date(`${booking.date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
          const hoursUntil = (aptDate.getTime() - Date.now()) / (1000 * 60 * 60);
          if (hoursUntil < 2) {
            throw new AppError('Appointments within 2 hours cannot be rescheduled online. Please contact our salon front desk at +91 96561 11149.', 403);
          }
        }
      }

      // Normalize target date
      const normalizedDate = String(date).trim();
      const targetGender = booking.service.gender || 'gents';

      // Verify availability of target slot
      const targetStylistId = stylistId || booking.stylistId || null;
      await SlotService.assertSlotAvailable(normalizedDate, timeSlot, targetStylistId, targetGender);

      // Perform update
      const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          date: normalizedDate,
          timeSlot,
          stylistId: targetStylistId,
          reminderSent: false,
          notes: booking.notes ? `${booking.notes} (Rescheduled from ${booking.date} ${booking.timeSlot})` : `Rescheduled from ${booking.date} ${booking.timeSlot}`,
        },
        include: {
          customer: true,
          service: true,
          stylist: true,
        },
      });

      // Dispatch async notifications
      const rawAppUrl = env.APP_URL || '';
      const clientPortalUrl = (!rawAppUrl || rawAppUrl.includes('localhost:5000') || rawAppUrl.includes('127.0.0.1'))
        ? 'https://stylexsalon.in'
        : rawAppUrl.replace(/\/+$/, '');
      const manageUrl = `${clientPortalUrl}/?manage=${updated.managementToken || updated.bookingRef}`;
      const fullPhone = booking.guestPhone?.replace(/[^0-9]/g, '') || `91${booking.customer.phone}`;

      WhatsAppService.sendBookingRescheduled({
        bookingRef: updated.bookingRef,
        customerName: updated.guestName || updated.customer.name,
        customerPhone: fullPhone,
        serviceName: updated.service.name,
        date: updated.date,
        timeSlot: updated.timeSlot,
        total: updated.total,
        stylistName: updated.stylist?.name,
        manageUrl,
      }).catch((e) => console.error('WhatsApp reschedule notification error:', e));

      const clientEmail = updated.guestEmail || updated.customer.email;
      if (clientEmail) {
        EmailService.sendBookingRescheduled({
          toEmail: clientEmail,
          customerName: updated.guestName || updated.customer.name,
          bookingRef: updated.bookingRef,
          serviceName: updated.service.name,
          date: updated.date,
          timeSlot: updated.timeSlot,
          total: updated.total,
          stylistName: updated.stylist?.name,
          manageUrl,
        }).catch((e) => console.error('Email reschedule notification error:', e));
      }

      res.status(200).json({
        success: true,
        message: 'Your appointment has been successfully rescheduled!',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public: Cancel an appointment
   */
  public static async cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = String(req.params.token || '').trim();
      const { reason } = req.body;

      if (!token) {
        throw new AppError('Reservation token or reference is required', 400);
      }

      const booking = await prisma.booking.findFirst({
        where: {
          OR: [
            { managementToken: token },
            { bookingRef: { equals: token, mode: 'insensitive' as const } },
            { id: token },
          ],
        },
        include: {
          customer: true,
          service: true,
          stylist: true,
        },
      });

      if (!booking) {
        throw new AppError('Reservation pass not found', 404);
      }

      if (booking.status === 'CANCELLED') {
        res.status(200).json({
          success: true,
          message: 'Appointment is already cancelled.',
          data: booking,
        });
        return;
      }

      // Check cutoff rule (2 hours before current appointment)
      // Check cutoff rule if enabled (2 hours before current appointment)
      const cutoffSetting = await prisma.salonSetting.findUnique({
        where: { key: 'reschedulePolicy24h' },
      });
      const isCutoffEnforced = !cutoffSetting || (cutoffSetting.value !== 'false' && (cutoffSetting.value as any) !== false);

      if (isCutoffEnforced) {
        const timeMatch = booking.timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (timeMatch) {
          let h = parseInt(timeMatch[1], 10);
          const m = parseInt(timeMatch[2], 10);
          const mer = timeMatch[3].toUpperCase();
          if (mer === 'PM' && h < 12) h += 12;
          if (mer === 'AM' && h === 12) h = 0;
          const aptDate = new Date(`${booking.date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
          const hoursUntil = (aptDate.getTime() - Date.now()) / (1000 * 60 * 60);
          if (hoursUntil < 2) {
            throw new AppError('Appointments within 2 hours cannot be cancelled online. Please call our salon directly at +91 96561 11149.', 403);
          }
        }
      }

      const cancelNote = reason ? `Cancelled by client: ${reason}` : 'Cancelled by client online';
      const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: 'CANCELLED',
          notes: booking.notes ? `${booking.notes} | ${cancelNote}` : cancelNote,
        },
        include: {
          customer: true,
          service: true,
          stylist: true,
        },
      });

      // Dispatch async notifications
      const fullPhone = booking.guestPhone?.replace(/[^0-9]/g, '') || `91${booking.customer.phone}`;
      WhatsAppService.sendBookingCancelled({
        customerName: booking.guestName || booking.customer.name,
        customerPhone: fullPhone,
        bookingRef: booking.bookingRef,
        serviceName: booking.service.name,
        date: booking.date,
        timeSlot: booking.timeSlot,
      }).catch((e) => console.error('WhatsApp cancellation error:', e));

      const clientEmail = booking.guestEmail || booking.customer.email;
      if (clientEmail) {
        EmailService.sendBookingCancelled({
          toEmail: clientEmail,
          customerName: booking.guestName || booking.customer.name,
          bookingRef: booking.bookingRef,
          serviceName: booking.service.name,
          date: booking.date,
          timeSlot: booking.timeSlot,
        }).catch((e) => console.error('Email cancellation error:', e));
      }

      res.status(200).json({
        success: true,
        message: 'Your appointment has been cancelled. Time slot has been freed.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
