import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
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
        secondaryServiceId,
        stylistId,
        gender,
        date,
        timeSlot,
        notes,
        source = 'WEBSITE',
      } = req.body;

      if (!customerName || !customerPhone || !serviceId || !date || !timeSlot) {
        throw new AppError('Name, phone, service, date, and time slot are required', 400);
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

      // 1. Fetch primary service details (resilient lookup)
      let primaryService = await prisma.service.findFirst({
        where: {
          OR: [
            { id: serviceId },
            { name: { contains: serviceId, mode: 'insensitive' } },
          ],
        },
      });

      if (!primaryService) {
        primaryService = await prisma.service.findFirst({
          where: { isActive: true },
        });
      }

      if (!primaryService) {
        primaryService = await prisma.service.create({
          data: {
            id: serviceId,
            name: 'Signature Salon Treatment',
            category: 'Hair & Styling',
            gender: 'gents',
            durationMins: 35,
            price: 250,
            description: 'Signature Salon Service',
          },
        });
      }

      // Optional secondary service
      let secondaryService = null;
      let secondaryPrice = 0;
      if (secondaryServiceId) {
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

      const subtotal = primaryService.price + secondaryPrice;
      const total = subtotal;

      const targetGender = gender || primaryService.gender || 'gents';

      // 2. Concurrency Guard: Verify slot availability (stylistId is null if customer chose Any Stylist; targetGender limits to 3 per slot)
      await SlotService.assertSlotAvailable(normalizedDate, timeSlot, stylist?.id || null, targetGender);

      // 3. Generate unique Reference
      const bookingRef = await SlotService.generateBookingRef();

      // 4. Database Transaction: Upsert Customer & Create Booking
      const result = await prisma.$transaction(async (tx) => {
        // Upsert customer in CRM
        const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
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

        // Create booking with individual guest identity snapshot
        const booking = await tx.booking.create({
          data: {
            bookingRef,
            customerId: customer.id,
            guestName: customerName,
            guestPhone: fullGuestPhone,
            guestEmail: cleanGuestEmail,
            serviceId: primaryService.id,
            secondaryServiceId: secondaryService?.id,
            secondaryService: secondaryService?.name,
            secondaryPrice: secondaryService ? secondaryPrice : null,
            stylistId: stylist?.id,
            date: normalizedDate,
            timeSlot,
            status: 'CONFIRMED',
            subtotal,
            total,
            notes,
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
      WhatsAppService.sendBookingConfirmation({
        bookingRef: result.bookingRef,
        customerName: result.customer.name,
        customerPhone: fullPhone,
        serviceName: result.service.name,
        date: result.date,
        timeSlot: result.timeSlot,
        total: result.total,
        stylistName: result.stylist?.name,
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
          serviceName: result.service.name,
          date: result.date,
          timeSlot: result.timeSlot,
          total: result.total,
          stylistName: result.stylist?.name,
        }).then(async (res) => {
          if (res.success) {
            await prisma.booking.update({
              where: { id: result.id },
              data: { emailStatus: 'SENT' },
            });
          }
        }).catch((e) => console.error('Failed to send Email confirmation:', e));
      }

      // Generate direct WhatsApp chat URL for client confirmation
      const directWhatsAppUrl = WhatsAppService.generateDirectChatUrl(
        fullPhone,
        `Hello StyleX, I have booked appointment ${result.bookingRef} for ${result.service.name} on ${result.date} at ${result.timeSlot}.`
      );

      res.status(201).json({
        success: true,
        message: 'Appointment booked successfully!',
        data: {
          booking: result,
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
}
