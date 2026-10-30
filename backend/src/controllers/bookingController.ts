import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../config/db';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';
import { SlotService } from '../services/slotService';
import { WhatsAppService } from '../services/whatsappService';
import { EmailService } from '../services/emailService';

const CANONICAL_BOOKING_HEADINGS: Record<
  string,
  { name: string; category: string; gender: string; durationMins: number; price: number; description: string }
> = {
  // Gents Headings
  'gents-cut-styling': { name: 'Hair Cut / Styling', category: 'Hair & Styling', gender: 'gents', durationMins: 35, price: 250, description: 'Hair Cut, Beard Styling & Shaving' },
  'gents-hair-spa': { name: 'Hair Spa / Treatment', category: 'Hair Spa', gender: 'gents', durationMins: 45, price: 700, description: 'Hair Spa & Dandruff Treatment' },
  'gents-hair-texture': { name: 'Hair Texture', category: 'Hair & Styling', gender: 'gents', durationMins: 90, price: 3000, description: 'Smoothening, Botox & Keratin' },
  'gents-hair-color': { name: 'Hair Color', category: 'Hair & Styling', gender: 'gents', durationMins: 45, price: 600, description: 'Global, Highlights & Beard Color' },
  'gents-skin-care': { name: 'Skin Care', category: 'Facial & Glow', gender: 'gents', durationMins: 60, price: 1000, description: 'Clean Up, Facials & Hydra Facial' },
  'gents-de-tan': { name: 'De-Tan', category: 'Facial & Glow', gender: 'gents', durationMins: 30, price: 500, description: 'Face & Neck, Arms & Body De-Tan' },
  'gents-pedi-mani': { name: 'Pedicure & Manicure', category: 'Spa & Wellness', gender: 'gents', durationMins: 45, price: 800, description: 'Basic & Spa Pedicure / Manicure' },
  'gents-pre-grooming': { name: 'Pre-Grooming Packages', category: 'Bridal & Groom', gender: 'gents', durationMins: 120, price: 3500, description: 'Groom Make Up & Comprehensive Grooming' },

  // Ladies Headings
  'ladies-cut-styling': { name: 'Hair Cut / Styling', category: 'Hair & Styling', gender: 'ladies', durationMins: 45, price: 450, description: 'Change Over, Layer, Bob & Split Ends' },
  'ladies-hair-spa': { name: 'Hair Spa Treatment', category: 'Hair Spa', gender: 'ladies', durationMins: 60, price: 1000, description: 'L\'Oreal, Organic & Deep Conditioning' },
  'ladies-hair-treatment': { name: 'Hair Treatment', category: 'Hair & Styling', gender: 'ladies', durationMins: 120, price: 3500, description: 'Botox, Keratin & Nanoplastia' },
  'ladies-hair-color': { name: 'Hair Color & Colouring', category: 'Hair & Styling', gender: 'ladies', durationMins: 90, price: 2000, description: 'Global, Balayage, Highlights & Touch Up' },
  'ladies-skin-care': { name: 'Skin Care', category: 'Facial & Glow', gender: 'ladies', durationMins: 60, price: 1200, description: 'Clean Up, Facials & Hydra Facial' },
  'ladies-tan-wax': { name: 'Tan Removal & Waxing', category: 'Facial & Glow', gender: 'ladies', durationMins: 45, price: 600, description: 'Rica Waxing, Honey Wax & De-Tan' },
  'ladies-nails-mani-pedi': { name: 'Nails, Manicure & Pedicure', category: 'Spa & Wellness', gender: 'ladies', durationMins: 60, price: 1000, description: 'Gel Nails, Nail Art, Spa Pedicure & Manicure' },
  'ladies-pre-bridal': { name: 'Pre-Bridal Packages', category: 'Bridal & Groom', gender: 'ladies', durationMins: 180, price: 6000, description: 'Bridal Glow, Pampering & Wedding Packages' },
};

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
        serviceName,
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

      // Ensure any canonical heading from the catalog is auto-upserted in the database
      for (const sid of requestedIds) {
        const canonical = CANONICAL_BOOKING_HEADINGS[sid];
        if (canonical) {
          try {
            await prisma.service.upsert({
              where: { id: sid },
              update: {
                name: canonical.name,
                category: canonical.category,
                gender: canonical.gender,
                durationMins: canonical.durationMins,
                price: canonical.price,
                description: canonical.description,
                isActive: true,
              },
              create: {
                id: sid,
                name: canonical.name,
                category: canonical.category,
                gender: canonical.gender,
                durationMins: canonical.durationMins,
                price: canonical.price,
                description: canonical.description,
                isActive: true,
              },
            });
          } catch (e) {
            console.warn(`Could not auto-upsert canonical service ${sid}:`, e);
          }
        }
      }

      let matchedServices = await prisma.service.findMany({
        where: {
          OR: requestedIds.map((sid) => ({ id: sid })),
        },
      });

      // If no exact IDs matched, resolve using requested serviceName or canonical heading
      if (matchedServices.length === 0) {
        const targetSid = serviceId || requestedIds[0] || 'signature-service';
        const targetName = serviceName || (CANONICAL_BOOKING_HEADINGS[targetSid]?.name) || 'Signature Salon Ritual';

        let fallback = await prisma.service.findFirst({
          where: {
            OR: [
              { id: targetSid },
              { name: { equals: targetName, mode: 'insensitive' } },
              { name: { contains: targetName, mode: 'insensitive' } },
            ],
          },
        });

        if (!fallback) {
          try {
            fallback = await prisma.service.create({
              data: {
                id: targetSid,
                name: targetName,
                category: gender === 'ladies' ? 'Ladies Salon' : 'Gents Salon',
                gender: gender || 'unisex',
                durationMins: 45,
                price: 250,
                description: targetName,
                isActive: true,
              },
            });
          } catch {
            fallback = await prisma.service.findUnique({ where: { id: targetSid } });
          }
        }

        if (fallback) {
          matchedServices = [fallback];
        }
      }

      const primaryService = matchedServices[0];
      const hasMultipleServices = matchedServices.length > 1;
      const combinedServiceName = serviceName || matchedServices.map((s) => s.name).join(' + ');

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
        const secCanonical = CANONICAL_BOOKING_HEADINGS[secondaryServiceId];
        if (secCanonical) {
          try {
            secondaryService = await prisma.service.upsert({
              where: { id: secondaryServiceId },
              update: { name: secCanonical.name },
              create: {
                id: secondaryServiceId,
                name: secCanonical.name,
                category: secCanonical.category,
                gender: secCanonical.gender,
                durationMins: secCanonical.durationMins,
                price: secCanonical.price,
                description: secCanonical.description,
                isActive: true,
              },
            });
          } catch {
            secondaryService = await prisma.service.findUnique({ where: { id: secondaryServiceId } });
          }
        } else {
          secondaryService = await prisma.service.findFirst({
            where: {
              OR: [
                { id: secondaryServiceId },
                { name: { contains: secondaryServiceId, mode: 'insensitive' } },
              ],
            },
          });
        }
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
            notes: notes && notes.includes('[Selected Service')
              ? notes
              : (notes ? `${notes}\n[Selected Service: ${combinedServiceName || primaryService.name}]` : `[Selected Service: ${combinedServiceName || primaryService.name}]`),
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
      const cleanPhoneDigits = (result.guestPhone || result.customer.phone || customerPhone || '').replace(/[^0-9]/g, '');
      const fullPhone = `+91${cleanPhoneDigits.slice(-10)}`;
      const rawAppUrl = env.APP_URL || '';
      const clientPortalUrl = (!rawAppUrl || rawAppUrl.includes('localhost:5000') || rawAppUrl.includes('127.0.0.1'))
        ? 'https://stylexsalon.in'
        : rawAppUrl.replace(/\/+$/, '');
      const manageUrl = `${clientPortalUrl}/?manage=${result.managementToken || result.bookingRef}`;

      const confirmedServiceName = combinedServiceName || result.service.name;

      WhatsAppService.sendBookingConfirmation({
        bookingRef: result.bookingRef,
        customerName: result.customer.name,
        customerPhone: fullPhone,
        serviceName: confirmedServiceName,
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
          serviceName: confirmedServiceName,
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
        `Hello StyleX, I have booked appointment ${result.bookingRef} for ${confirmedServiceName} on ${result.date} at ${result.timeSlot}.\n\nManage or Reschedule link: ${manageUrl}`
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

      const existing = await prisma.booking.findUnique({
        where: { id },
        include: {
          customer: true,
          service: true,
          stylist: true,
        },
      });

      if (!existing) {
        throw new AppError('Booking not found', 404);
      }

      const isCancellation = status === 'CANCELLED' && existing.status !== 'CANCELLED';

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

      // ONLY send cancellation notification if status actually transitioned to CANCELLED
      if (isCancellation) {
        const cleanPhoneDigits = (updated.guestPhone || updated.customer.phone || '').replace(/[^0-9]/g, '');
        const fullPhone = `+91${cleanPhoneDigits.slice(-10)}`;
        const serviceDisplayName = (() => {
          if (updated.notes) {
            const m = updated.notes.match(/\[Selected Services?: ([^\]\n]+)\]/);
            if (m && m[1]) return m[1].trim();
          }
          return updated.service.name;
        })();

        WhatsAppService.sendBookingCancelled({
          customerName: updated.guestName || updated.customer.name,
          customerPhone: fullPhone,
          bookingRef: updated.bookingRef,
          serviceName: serviceDisplayName,
          date: updated.date,
          timeSlot: updated.timeSlot,
          cancelledBySalon: true,
          reason: notes || 'Cancelled by salon reception',
        }).catch((e) => console.error('WhatsApp salon cancellation error:', e));

        const clientEmail = updated.guestEmail || updated.customer.email;
        if (clientEmail) {
          EmailService.sendBookingCancelled({
            toEmail: clientEmail,
            customerName: updated.guestName || updated.customer.name,
            bookingRef: updated.bookingRef,
            serviceName: serviceDisplayName,
            date: updated.date,
            timeSlot: updated.timeSlot,
          }).catch((e) => console.error('Email cancellation error:', e));
        }
      }

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
   * Admin: Update booking details (date, time, stylist, status, notes)
   * Strictly enforces that WhatsApp notifications are ONLY sent for:
   * 1. Time Change
   * 2. Date Change
   * 3. Cancellation
   * Changes to stylist, service menu type, notes, or payment do NOT send notifications.
   */
  public static async updateBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { date, timeSlot, stylistId, serviceId, status, notes, paymentStatus } = req.body;

      const existing = await prisma.booking.findUnique({
        where: { id },
        include: { customer: true, service: true, stylist: true },
      });

      if (!existing) {
        throw new AppError('Booking not found', 404);
      }

      // 1. Normalize date if provided
      let normalizedDate = existing.date;
      if (date && typeof date === 'string' && date.trim() !== '') {
        const dStr = date.trim();
        if (dStr.toLowerCase() === 'today') {
          normalizedDate = new Date().toISOString().split('T')[0];
        } else {
          const parsedD = new Date(dStr);
          if (!isNaN(parsedD.getTime()) && !/^\d{4}-\d{2}-\d{2}$/.test(dStr)) {
            const y = parsedD.getFullYear();
            const m = String(parsedD.getMonth() + 1).padStart(2, '0');
            const d = String(parsedD.getDate()).padStart(2, '0');
            normalizedDate = `${y}-${m}-${d}`;
          } else {
            normalizedDate = dStr;
          }
        }
      }

      // 2. Normalize timeSlot if provided
      const normalizedTimeSlot = timeSlot && typeof timeSlot === 'string' && timeSlot.trim() !== ''
        ? timeSlot.trim()
        : existing.timeSlot;

      // 3. Strict trigger checks per requirement:
      // ONLY send WhatsApp notification for:
      // 1) Time Change
      // 2) Date Change
      // 3) Cancellation
      // Do NOT send messages for changing stylist, service menu type, notes, payment, etc.
      const isDateChanged = normalizedDate !== existing.date;
      const isTimeChanged = normalizedTimeSlot.toLowerCase() !== existing.timeSlot.trim().toLowerCase();
      const isCancellation = status === 'CANCELLED' && existing.status !== 'CANCELLED';

      let targetStylistId = existing.stylistId;
      if (stylistId !== undefined) {
        targetStylistId = stylistId || null;
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: {
          date: normalizedDate,
          timeSlot: normalizedTimeSlot,
          ...(stylistId !== undefined ? { stylistId: targetStylistId } : {}),
          ...(serviceId !== undefined ? { serviceId } : {}),
          ...(status ? { status } : {}),
          ...(paymentStatus ? { paymentStatus } : {}),
          ...(notes !== undefined ? { notes } : {}),
        },
        include: { customer: true, service: true, stylist: true },
      });

      const cleanPhoneDigits = (updated.guestPhone || updated.customer.phone || '').replace(/[^0-9]/g, '');
      const fullPhone = `+91${cleanPhoneDigits.slice(-10)}`;
      const clientEmail = updated.guestEmail || updated.customer.email;

      const serviceDisplayName = (() => {
        if (updated.notes) {
          const m = updated.notes.match(/\[Selected Services?: ([^\]\n]+)\]/);
          if (m && m[1]) return m[1].trim();
        }
        return updated.service.name;
      })();

      if (isCancellation) {
        // 3. Cancellation: Send cancellation WhatsApp notification
        WhatsAppService.sendBookingCancelled({
          customerName: updated.guestName || updated.customer.name,
          customerPhone: fullPhone,
          bookingRef: updated.bookingRef,
          serviceName: serviceDisplayName,
          date: updated.date,
          timeSlot: updated.timeSlot,
          cancelledBySalon: true,
          reason: notes || 'Cancelled by salon reception',
        }).catch((e) => console.error('WhatsApp salon cancellation error:', e));

        if (clientEmail) {
          EmailService.sendBookingCancelled({
            toEmail: clientEmail,
            customerName: updated.guestName || updated.customer.name,
            bookingRef: updated.bookingRef,
            serviceName: serviceDisplayName,
            date: updated.date,
            timeSlot: updated.timeSlot,
          }).catch((e) => console.error('Email cancellation error:', e));
        }
      } else if ((isDateChanged || isTimeChanged) && updated.status !== 'CANCELLED') {
        // 1. Time Change or 2. Date Change: Send reschedule notification
        const rawAppUrl = env.APP_URL || '';
        const clientPortalUrl = (!rawAppUrl || rawAppUrl.includes('localhost:5000') || rawAppUrl.includes('127.0.0.1'))
          ? 'https://stylexsalon.in'
          : rawAppUrl.replace(/\/+$/, '');
        const manageUrl = `${clientPortalUrl}/?manage=${updated.managementToken || updated.bookingRef}`;

        WhatsAppService.sendBookingRescheduled({
          bookingRef: updated.bookingRef,
          customerName: updated.guestName || updated.customer.name,
          customerPhone: fullPhone,
          serviceName: serviceDisplayName,
          date: updated.date,
          timeSlot: updated.timeSlot,
          total: updated.total,
          stylistName: updated.stylist?.name,
          manageUrl,
          updatedBySalon: true,
        }).catch((e) => console.error('WhatsApp salon update error:', e));

        if (clientEmail) {
          EmailService.sendBookingRescheduled({
            toEmail: clientEmail,
            customerName: updated.guestName || updated.customer.name,
            bookingRef: updated.bookingRef,
            serviceName: serviceDisplayName,
            date: updated.date,
            timeSlot: updated.timeSlot,
            total: updated.total,
            stylistName: updated.stylist?.name,
            manageUrl,
          }).catch((e) => console.error('Email reschedule notification error:', e));
        }
      }
      // If ONLY stylist changed, service changed, notes changed, etc. -> NO notification sent!

      res.status(200).json({
        success: true,
        message: 'Booking updated successfully',
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
            name: (() => {
              if (booking.notes) {
                const m = booking.notes.match(/\[Selected Services?: ([^\]\n]+)\]/);
                if (m && m[1]) return m[1].trim();
              }
              return booking.service.name;
            })(),
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
          serviceName: (() => {
            if (b.notes) {
              const m = b.notes.match(/\[Selected Services?: ([^\]\n]+)\]/);
              if (m && m[1]) return m[1].trim();
            }
            return b.service.name;
          })(),
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
      const cleanPhoneDigits = (updated.guestPhone || updated.customer.phone || '').replace(/[^0-9]/g, '');
      const fullPhone = `+91${cleanPhoneDigits.slice(-10)}`;

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
        updatedBySalon: true,
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
      const cleanPhoneDigits = (booking.guestPhone || booking.customer.phone || '').replace(/[^0-9]/g, '');
      const fullPhone = `+91${cleanPhoneDigits.slice(-10)}`;
      const serviceDisplayName = (() => {
        if (booking.notes) {
          const m = booking.notes.match(/\[Selected Services?: ([^\]\n]+)\]/);
          if (m && m[1]) return m[1].trim();
        }
        return booking.service.name;
      })();

      WhatsAppService.sendBookingCancelled({
        customerName: booking.guestName || booking.customer.name,
        customerPhone: fullPhone,
        bookingRef: booking.bookingRef,
        serviceName: serviceDisplayName,
        date: booking.date,
        timeSlot: booking.timeSlot,
        cancelledBySalon: false,
        reason: cancelNote,
      }).catch((e) => console.error('WhatsApp cancellation error:', e));

      const clientEmail = booking.guestEmail || booking.customer.email;
      if (clientEmail) {
        EmailService.sendBookingCancelled({
          toEmail: clientEmail,
          customerName: booking.guestName || booking.customer.name,
          bookingRef: booking.bookingRef,
          serviceName: serviceDisplayName,
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
