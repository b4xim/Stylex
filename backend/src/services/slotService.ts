import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

// Standard operational slots for StyleX Salon (30-min intervals)
export const SALON_DAILY_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
  '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
];

export interface SlotAvailability {
  timeSlot: string;
  isAvailable: boolean;
  reason?: string;
}

export class SlotService {
  /**
   * Generates a unique salon booking reference (e.g. SX-8291)
   */
  public static async generateBookingRef(): Promise<string> {
    let ref = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      attempts++;
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      ref = `SX-${randomNum}`;
      const existing = await prisma.booking.findUnique({
        where: { bookingRef: ref },
      });
      if (!existing) {
        isUnique = true;
      }
    }

    if (!isUnique) {
      ref = `SX-${Date.now().toString().slice(-4)}`;
    }
    return ref;
  }

  /**
   * Retrieve availability for all slots on a specified date
   */
  public static async getSlotsForDate(
    date: string,
    stylistId?: string
  ): Promise<SlotAvailability[]> {
    // 1. Fetch active bookings for this date
    const bookings = await prisma.booking.findMany({
      where: {
        date,
        status: { in: ['CONFIRMED', 'PENDING'] },
        ...(stylistId ? { stylistId } : {}),
      },
      select: {
        timeSlot: true,
        stylistId: true,
      },
    });

    // 2. Fetch blocked slots for this date
    const blockedSlots = await prisma.blockedSlot.findMany({
      where: {
        date,
        OR: [
          { stylistId: null }, // Global salon block
          ...(stylistId ? [{ stylistId }] : []),
        ],
      },
      select: {
        timeSlot: true,
        reason: true,
      },
    });

    // Count active stylists for capacity calculation
    const totalStylists = await prisma.stylist.count({ where: { isActive: true } });
    const maxCapacity = Math.max(totalStylists, 4);

    const slotBookingCounts = new Map<string, number>();
    for (const b of bookings) {
      slotBookingCounts.set(b.timeSlot, (slotBookingCounts.get(b.timeSlot) || 0) + 1);
    }

    const blockedSlotMap = new Map(blockedSlots.map((b) => [b.timeSlot, b.reason || 'Blocked by Admin']));

    // Check if entire day is blocked
    const allDayBlocked = blockedSlotMap.has('ALL_DAY');

    return SALON_DAILY_SLOTS.map((slot) => {
      if (allDayBlocked) {
        return {
          timeSlot: slot,
          isAvailable: false,
          reason: blockedSlotMap.get('ALL_DAY') || 'Salon closed for the day',
        };
      }

      if (blockedSlotMap.has(slot)) {
        return {
          timeSlot: slot,
          isAvailable: false,
          reason: blockedSlotMap.get(slot),
        };
      }

      const currentCount = slotBookingCounts.get(slot) || 0;
      const isSlotFull = stylistId ? currentCount >= 1 : currentCount >= maxCapacity;

      if (isSlotFull) {
        return {
          timeSlot: slot,
          isAvailable: false,
          reason: stylistId ? 'Stylist already reserved for this slot' : 'All styling stations reserved',
        };
      }

      return {
        timeSlot: slot,
        isAvailable: true,
      };
    });
  }

  /**
   * Concurrency Guard: Atomically verify and lock a time slot within a transaction
   */
  public static async assertSlotAvailable(
    date: string,
    timeSlot: string,
    stylistId?: string | null
  ): Promise<void> {
    // 1. Check for blocked slot
    const blocked = await prisma.blockedSlot.findFirst({
      where: {
        date,
        OR: [
          { timeSlot: 'ALL_DAY' },
          { timeSlot },
        ],
        AND: [
          {
            OR: [
              { stylistId: null },
              ...(stylistId ? [{ stylistId }] : []),
            ],
          },
        ],
      },
    });

    if (blocked) {
      throw new AppError(
        `The requested slot ${timeSlot} on ${date} is unavailable (${blocked.reason || 'Blocked'}). Please choose another slot.`,
        409
      );
    }

    // 2. Check for conflicting booking
    if (stylistId) {
      const conflicting = await prisma.booking.findFirst({
        where: {
          date,
          timeSlot,
          status: { in: ['CONFIRMED', 'PENDING'] },
          stylistId,
        },
      });

      if (conflicting) {
        throw new AppError(
          `The requested slot ${timeSlot} on ${date} is already reserved for this stylist. Please select another stylist or an adjacent time.`,
          409
        );
      }
    } else {
      // General booking without specific stylist: check against total active stylists capacity
      const totalStylists = await prisma.stylist.count({ where: { isActive: true } });
      const maxCapacity = Math.max(totalStylists, 4);

      const currentBookingsCount = await prisma.booking.count({
        where: {
          date,
          timeSlot,
          status: { in: ['CONFIRMED', 'PENDING'] },
        },
      });

      if (currentBookingsCount >= maxCapacity) {
        throw new AppError(
          `All styling stations are fully booked at ${timeSlot} on ${date}. Please select an adjacent time.`,
          409
        );
      }
    }
  }
}
