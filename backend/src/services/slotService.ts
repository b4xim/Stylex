import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

// Standard operational slots for StyleX Salon (10:00 AM – 1:00 AM)
export const SALON_DAILY_SLOTS = [
  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM',
  '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM',
  '09:00 PM', '09:30 PM',
  '10:00 PM', '10:30 PM',
  '11:00 PM', '11:30 PM',
  '12:00 AM',
];

export interface SlotAvailability {
  timeSlot: string;
  isAvailable: boolean;
  bookedCount: number;
  maxCapacity: number;
  status: 'available' | 'filling_fast' | 'full';
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
    stylistId?: string,
    gender?: string
  ): Promise<SlotAvailability[]> {
    let resolvedStylistId = stylistId;
    if (stylistId) {
      const foundStylist = await prisma.stylist.findFirst({
        where: {
          OR: [
            { id: stylistId },
            { name: { equals: stylistId, mode: 'insensitive' } },
          ],
        },
      });
      if (foundStylist) {
        resolvedStylistId = foundStylist.id;
      }
    }

    // 1. Fetch active bookings for this date including their service department
    const bookings = await prisma.booking.findMany({
      where: {
        date,
        status: { in: ['CONFIRMED', 'PENDING'] },
        ...(resolvedStylistId ? { stylistId: resolvedStylistId } : {}),
      },
      select: {
        timeSlot: true,
        stylistId: true,
        service: {
          select: {
            gender: true,
          },
        },
      },
    });

    // 2. Fetch blocked slots for this date
    const blockedSlots = await prisma.blockedSlot.findMany({
      where: {
        date,
        OR: [
          { stylistId: null }, // Global salon block
          ...(resolvedStylistId ? [{ stylistId: resolvedStylistId }] : []),
        ],
      },
      select: {
        timeSlot: true,
        reason: true,
      },
    });

    const normalizedGender = gender
      ? (gender.toLowerCase().includes('ladi') || gender.toLowerCase().includes('female') ? 'ladies' : 'gents')
      : undefined;

    // Count bookings per slot separated by Gents and Ladies departments (Max 3 per slot each)
    const gentsSlotCounts = new Map<string, number>();
    const ladiesSlotCounts = new Map<string, number>();

    for (const b of bookings) {
      const g = (b.service?.gender || 'gents').toLowerCase();
      if (g.includes('ladi') || g.includes('female')) {
        ladiesSlotCounts.set(b.timeSlot, (ladiesSlotCounts.get(b.timeSlot) || 0) + 1);
      } else {
        gentsSlotCounts.set(b.timeSlot, (gentsSlotCounts.get(b.timeSlot) || 0) + 1);
      }
    }

    const blockedSlotMap = new Map(blockedSlots.map((b) => [b.timeSlot, b.reason || 'Blocked by Admin']));
    const allDayBlocked = blockedSlotMap.has('ALL_DAY');

    return SALON_DAILY_SLOTS.map((slot) => {
      const gentsCount = gentsSlotCounts.get(slot) || 0;
      const ladiesCount = ladiesSlotCounts.get(slot) || 0;
      const bookedCount =
        normalizedGender === 'ladies'
          ? ladiesCount
          : normalizedGender === 'gents'
          ? gentsCount
          : Math.max(gentsCount, ladiesCount);

      if (allDayBlocked) {
        return {
          timeSlot: slot,
          isAvailable: false,
          bookedCount,
          maxCapacity: 3,
          status: 'full',
          reason: blockedSlotMap.get('ALL_DAY') || 'Salon closed for the day',
        };
      }

      if (blockedSlotMap.has(slot)) {
        return {
          timeSlot: slot,
          isAvailable: false,
          bookedCount,
          maxCapacity: 3,
          status: 'full',
          reason: blockedSlotMap.get(slot),
        };
      }

      // If a specific stylist is requested, check if booked
      if (stylistId) {
        const isStylistBooked = bookings.some((b) => b.timeSlot === slot && b.stylistId === stylistId);
        if (isStylistBooked) {
          return {
            timeSlot: slot,
            isAvailable: false,
            bookedCount: 3,
            maxCapacity: 3,
            status: 'full',
            reason: 'Stylist already reserved for this slot',
          };
        }
      }

      // Max 3 bookings per timeslot for Gents, 3 bookings for Ladies
      let isFull = false;
      let reason: string | undefined = undefined;

      if (normalizedGender === 'ladies') {
        if (ladiesCount >= 3) {
          isFull = true;
          reason = 'Ladies section is fully booked for this time slot (3/3)';
        }
      } else if (normalizedGender === 'gents') {
        if (gentsCount >= 3) {
          isFull = true;
          reason = 'Gents section is fully booked for this time slot (3/3)';
        }
      } else {
        // If gender not specified, full only if both departments are full (3 gents + 3 ladies)
        if (gentsCount >= 3 && ladiesCount >= 3) {
          isFull = true;
          reason = 'All sections fully booked for this time slot';
        }
      }

      if (isFull) {
        return {
          timeSlot: slot,
          isAvailable: false,
          bookedCount,
          maxCapacity: 3,
          status: 'full',
          reason,
        };
      }

      if (bookedCount === 2) {
        return {
          timeSlot: slot,
          isAvailable: true,
          bookedCount,
          maxCapacity: 3,
          status: 'filling_fast',
          reason: '2 of 3 spots reserved (Filling fast)',
        };
      }

      return {
        timeSlot: slot,
        isAvailable: true,
        bookedCount,
        maxCapacity: 3,
        status: 'available',
      };
    });
  }

  /**
   * Concurrency Guard: Atomically verify and lock a time slot within a transaction
   * Enforces 3 bookings max per slot for Gents and 3 bookings max per slot for Ladies
   */
  public static async assertSlotAvailable(
    date: string,
    timeSlot: string,
    stylistId?: string | null,
    gender?: string | null
  ): Promise<void> {
    let resolvedStylistId = stylistId;
    if (stylistId) {
      const foundStylist = await prisma.stylist.findFirst({
        where: {
          OR: [
            { id: stylistId },
            { name: { equals: stylistId, mode: 'insensitive' } },
          ],
        },
      });
      if (foundStylist) {
        resolvedStylistId = foundStylist.id;
      }
    }

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
              ...(resolvedStylistId ? [{ stylistId: resolvedStylistId }] : []),
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

    // 2. Check for conflicting booking for specific stylist
    if (resolvedStylistId) {
      const conflicting = await prisma.booking.findFirst({
        where: {
          date,
          timeSlot,
          status: { in: ['CONFIRMED', 'PENDING'] },
          stylistId: resolvedStylistId,
        },
      });

      if (conflicting) {
        throw new AppError(
          `The requested slot ${timeSlot} on ${date} is already reserved for this stylist. Please select another stylist or an adjacent time.`,
          409
        );
      }
    }

    // 3. Department capacity check (Max 3 bookings per slot for Gents, 3 for Ladies)
    const normalizedGender = (gender || 'gents').toLowerCase();
    const isLadies = normalizedGender.includes('ladi') || normalizedGender.includes('female');
    const targetDepartment = isLadies ? 'ladies' : 'gents';
    const departmentLabel = isLadies ? 'Ladies Section' : 'Gents Section';

    const departmentBookingsCount = await prisma.booking.count({
      where: {
        date,
        timeSlot,
        status: { in: ['CONFIRMED', 'PENDING'] },
        service: {
          gender: { contains: targetDepartment, mode: 'insensitive' },
        },
      },
    });

    if (departmentBookingsCount >= 3) {
      throw new AppError(
        `The ${departmentLabel} has reached its maximum capacity of 3 concurrent appointments for ${timeSlot} on ${date}. Please select an adjacent time slot.`,
        409
      );
    }
  }
}
