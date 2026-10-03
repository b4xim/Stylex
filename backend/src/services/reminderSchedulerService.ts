import { prisma } from '../config/db';
import { WhatsAppService } from './whatsappService';
import { env } from '../config/env';

/**
 * Parses time strings such as "10:00 AM", "04:30 PM", or "14:00" into total minutes from midnight
 */
function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return null;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const ampm = match[3]?.toUpperCase();
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

/**
 * Returns the current date in ISO YYYY-MM-DD and total minutes from midnight in Asia/Kolkata (IST)
 */
function getISTDateAndMinutes(): { dateStr: string; minutes: number } {
  const now = new Date();
  const istFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = istFormatter.formatToParts(now);
  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || '00';

  const dateStr = `${getPart('year')}-${getPart('month')}-${getPart('day')}`;
  const hours = parseInt(getPart('hour'), 10);
  const minutes = parseInt(getPart('minute'), 10);

  return { dateStr, minutes: hours * 60 + minutes };
}

export class ReminderSchedulerService {
  private static timer: NodeJS.Timeout | null = null;
  private static isRunning = false;

  /**
   * Starts the recurring reminder scheduler (checks every 5 minutes)
   */
  public static start(): void {
    if (this.timer) return;

    console.log('⏰ [Reminder Scheduler] Initializing automated 1-hour appointment reminder service...');

    // Run first check after a brief 15-second grace period
    setTimeout(() => {
      this.checkAndDispatchReminders();
    }, 15000);

    // Schedule regular polling every 5 minutes
    this.timer = setInterval(() => {
      this.checkAndDispatchReminders();
    }, 5 * 60 * 1000);
  }

  public static stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Checks for bookings happening in the next ~60 minutes and dispatches WhatsApp reminders
   */
  public static async checkAndDispatchReminders(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      // 1. Check if salon reminders are enabled in settings
      const reminderSetting = await prisma.salonSetting.findUnique({
        where: { key: 'smsWhatsappReminders' },
      });
      if (reminderSetting && (reminderSetting.value === 'false' || reminderSetting.value === '0')) {
        return; // Reminders toggled off by admin
      }

      // 2. Get current IST time
      const { dateStr, minutes: currentMinutes } = getISTDateAndMinutes();

      // 3. Find confirmed bookings for today that haven't received a reminder yet
      const bookings = await prisma.booking.findMany({
        where: {
          date: dateStr,
          status: 'CONFIRMED',
          reminderSent: false,
        },
        include: {
          customer: true,
          service: true,
          stylist: true,
        },
      });

      if (bookings.length === 0) return;

      const rawAppUrl = env.APP_URL || '';
      const clientBaseUrl = (!rawAppUrl || rawAppUrl.includes('localhost:5000') || rawAppUrl.includes('127.0.0.1'))
        ? 'https://stylexsalon.in'
        : rawAppUrl.replace(/\/+$/, '');

      for (const booking of bookings) {
        const slotMinutes = parseTimeToMinutes(booking.timeSlot);
        if (slotMinutes === null) continue;

        const diffMinutes = slotMinutes - currentMinutes;

        // Trigger reminder if the appointment is between 45 and 75 minutes away (centered at ~1 hour)
        if (diffMinutes >= 45 && diffMinutes <= 75) {
          const rawPhone = booking.guestPhone?.replace(/[^0-9]/g, '') || booking.customer.phone.replace(/[^0-9]/g, '');
          const customerPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
          const manageUrl = `${clientBaseUrl}/?manage=${booking.managementToken || booking.bookingRef}`;

          console.log(`📲 [Reminder Scheduler] Dispatching 1-hour reminder for ${booking.bookingRef} to ${customerPhone} (Slot: ${booking.timeSlot})`);

          const result = await WhatsAppService.sendBookingReminder({
            bookingRef: booking.bookingRef,
            customerName: booking.guestName || booking.customer.name,
            customerPhone,
            serviceName: booking.service.name,
            date: booking.date,
            timeSlot: booking.timeSlot,
            total: booking.total,
            stylistName: booking.stylist?.name,
            manageUrl,
          });

          // Mark reminder as sent regardless of delivery success so we don't spam on transient errors
          await prisma.booking.update({
            where: { id: booking.id },
            data: { reminderSent: true },
          });

          if (result.success) {
            console.log(`✅ [Reminder Scheduler] Reminder sent successfully for ${booking.bookingRef}`);
          }
        }
      }
    } catch (error: any) {
      console.error('❌ [Reminder Scheduler] Error processing booking reminders:', error?.message || error);
    } finally {
      this.isRunning = false;
    }
  }
}
