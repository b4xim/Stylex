import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

// Standard operational hourly slots for StyleX Salon (10:00 AM – 1:00 AM, 1-Hour intervals)
export const SALON_DAILY_SLOTS = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
  '09:00 PM',
  '10:00 PM',
  '11:00 PM',
  '12:00 AM',
];

export interface SlotCapacityConfig {
  defaultGents: number;
  defaultLadies: number;
  slotOverrides?: Record<string, { gents?: number; ladies?: number }>;
}

export const DEFAULT_SLOT_CAPACITY_CONFIG: SlotCapacityConfig = {
  defaultGents: 3,
  defaultLadies: 3,
  slotOverrides: {},
};

export interface SlotAvailability {
  timeSlot: string;
  isAvailable: boolean;
  bookedCount: number;
  maxCapacity: number;
  status: 'available' | 'filling_fast' | 'full';
  reason?: string;
}

export const isPastSlotInIST = (dateStr: string, slotStr: string): boolean => {
  try {
    const salonNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const [yStr, mStr, dStr] = dateStr.split('-');
    const year = parseInt(yStr, 10);
    const month = parseInt(mStr, 10) - 1;
    const day = parseInt(dStr, 10);

    const currentSalonDay = new Date(salonNow.getFullYear(), salonNow.getMonth(), salonNow.getDate()).getTime();
    const targetDay = new Date(year, month, day).getTime();

    if (targetDay < currentSalonDay) return true;
    if (targetDay > currentSalonDay) return false;

    const match = slotStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return false;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridian = match[3].toUpperCase();

    if (meridian === 'AM' && hours === 12) {
      hours = 24;
    } else if (meridian === 'PM' && hours < 12) {
      hours += 12;
    }

    const slotTimestamp = new Date(
      salonNow.getFullYear(),
      salonNow.getMonth(),
      salonNow.getDate(),
      hours,
      minutes,
      0,
      0
    ).getTime();

    return salonNow.getTime() >= slotTimestamp;
  } catch {
    return false;
  }
};

export const DEFAULT_WEEK_SCHEDULE = [
  { dayName: "Monday", label: "Monday", dateStr: "Mon, Daily", isOpen: true, statusText: "Open", subText: "10:00 AM – 1:00 AM", hours: "10:00 AM – 1:00 AM" },
  { dayName: "Tuesday", label: "Tuesday", dateStr: "Tue, Daily", isOpen: true, statusText: "Open", subText: "10:00 AM – 1:00 AM", hours: "10:00 AM – 1:00 AM" },
  { dayName: "Wednesday", label: "Wednesday", dateStr: "Wed, Daily", isOpen: true, statusText: "Open", subText: "10:00 AM – 1:00 AM", hours: "10:00 AM – 1:00 AM" },
  { dayName: "Thursday", label: "Thursday", dateStr: "Thu, Daily", isOpen: true, statusText: "Open", subText: "10:00 AM – 1:00 AM", hours: "10:00 AM – 1:00 AM" },
  { dayName: "Friday", label: "Friday", dateStr: "Fri, Weekend", isOpen: true, statusText: "Open", subText: "10:00 AM – 1:00 AM", hours: "10:00 AM – 1:00 AM" },
  { dayName: "Saturday", label: "Saturday", dateStr: "Sat, Weekend", isOpen: true, statusText: "Open", subText: "10:00 AM – 1:00 AM", hours: "10:00 AM – 1:00 AM" },
  { dayName: "Sunday", label: "Sunday", dateStr: "Sun, Weekend", isOpen: true, statusText: "Open", subText: "10:00 AM – 1:00 AM", hours: "10:00 AM – 1:00 AM" },
];

export const parseHourToValue = (timeStr: string): number | null => {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = match[2] ? parseInt(match[2], 10) : 0;
  const meridian = (match[3] || '').toUpperCase();

  if (meridian === 'AM') {
    if (hour === 12) hour = 24; // 12 AM midnight = 24.0
    else if (hour === 1) hour = 25; // 1 AM next day = 25.0
    else if (hour < 6) hour += 24;
  } else if (meridian === 'PM') {
    if (hour < 12) hour += 12;
  }

  return hour + minute / 60;
};

export const parseOperatingHoursRange = (hoursStr: string): { startHour: number; endHour: number } | null => {
  if (!hoursStr) return null;
  const parts = hoursStr.split(/[–—\-]|(?:\s+to\s+)/i);
  if (parts.length < 2) return null;
  const startHour = parseHourToValue(parts[0]);
  const endHour = parseHourToValue(parts[1]);
  if (startHour === null || endHour === null) return null;
  return { startHour, endHour };
};

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
   * Reads slot capacity configuration from salonSetting (with fallback to 3 gents & 3 ladies)
   */
  public static async getSlotCapacityConfig(): Promise<SlotCapacityConfig> {
    try {
      const record = await prisma.salonSetting.findUnique({
        where: { key: 'slotCapacityConfig' },
      });
      if (record && record.value) {
        const parsed = JSON.parse(record.value);
        return {
          defaultGents: typeof parsed.defaultGents === 'number' && parsed.defaultGents >= 0 ? parsed.defaultGents : 3,
          defaultLadies: typeof parsed.defaultLadies === 'number' && parsed.defaultLadies >= 0 ? parsed.defaultLadies : 3,
          slotOverrides: typeof parsed.slotOverrides === 'object' && parsed.slotOverrides !== null ? parsed.slotOverrides : {},
        };
      }
    } catch (err) {
      console.error('Error reading slotCapacityConfig:', err);
    }
    return DEFAULT_SLOT_CAPACITY_CONFIG;
  }

  /**
   * Helper to resolve Gents & Ladies capacity for a given time slot
   */
  public static getCapacityForSlot(
    config: SlotCapacityConfig,
    timeSlot: string
  ): { gents: number; ladies: number } {
    const override = config.slotOverrides?.[timeSlot];
    const gents = (override && typeof override.gents === 'number' && override.gents >= 0)
      ? override.gents
      : config.defaultGents;
    const ladies = (override && typeof override.ladies === 'number' && override.ladies >= 0)
      ? override.ladies
      : config.defaultLadies;
    return { gents, ladies };
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

    // 0. Check weekly working hours & day closure from salon settings
    let targetDayName = '';
    try {
      const [yStr, mStr, dStr] = date.split('-');
      const dObj = new Date(parseInt(yStr, 10), parseInt(mStr, 10) - 1, parseInt(dStr, 10));
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      targetDayName = dayNames[dObj.getDay()] || '';
    } catch {}

    let weekSchedule: any[] = DEFAULT_WEEK_SCHEDULE;
    try {
      const scheduleRecord = await prisma.salonSetting.findUnique({
        where: { key: 'weekSchedule' },
      });
      if (scheduleRecord && scheduleRecord.value) {
        const parsed = JSON.parse(scheduleRecord.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          weekSchedule = parsed;
        }
      }
    } catch {}

    const dayConfig = targetDayName
      ? weekSchedule.find((d: any) => d.dayName && d.dayName.toLowerCase() === targetDayName.toLowerCase())
      : null;

    // Load dynamic slot capacity configuration
    const capacityConfig = await SlotService.getSlotCapacityConfig();

    // If day is closed in schedule, all slots are completely blocked
    if (dayConfig && (dayConfig.isOpen === false || dayConfig.isOpen === 'false')) {
      return SALON_DAILY_SLOTS.map((slot) => {
        const { gents: slotGents, ladies: slotLadies } = SlotService.getCapacityForSlot(capacityConfig, slot);
        const slotMax = gender?.toLowerCase().includes('ladi') || gender?.toLowerCase().includes('female')
          ? slotLadies
          : slotGents;
        return {
          timeSlot: slot,
          isAvailable: false,
          bookedCount: 0,
          maxCapacity: slotMax,
          status: 'full',
          reason: `Salon closed on ${targetDayName}s according to weekly working hours`,
        };
      });
    }

    const operatingRange = dayConfig?.hours ? parseOperatingHoursRange(dayConfig.hours) : null;

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

    // Count bookings per slot separated by Gents and Ladies departments
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
      const { gents: slotMaxGents, ladies: slotMaxLadies } = SlotService.getCapacityForSlot(capacityConfig, slot);
      const targetMaxCapacity =
        normalizedGender === 'ladies'
          ? slotMaxLadies
          : normalizedGender === 'gents'
          ? slotMaxGents
          : Math.max(slotMaxGents, slotMaxLadies);

      const gentsCount = gentsSlotCounts.get(slot) || 0;
      const ladiesCount = ladiesSlotCounts.get(slot) || 0;
      const bookedCount =
        normalizedGender === 'ladies'
          ? ladiesCount
          : normalizedGender === 'gents'
          ? gentsCount
          : Math.max(gentsCount, ladiesCount);

      if (isPastSlotInIST(date, slot)) {
        return {
          timeSlot: slot,
          isAvailable: false,
          bookedCount,
          maxCapacity: targetMaxCapacity,
          status: 'full',
          reason: 'Time slot has passed',
        };
      }

      // Check if slot falls outside weekly operating hours
      if (operatingRange) {
        const slotVal = parseHourToValue(slot);
        if (slotVal !== null && (slotVal < operatingRange.startHour || slotVal >= operatingRange.endHour)) {
          return {
            timeSlot: slot,
            isAvailable: false,
            bookedCount,
            maxCapacity: targetMaxCapacity,
            status: 'full',
            reason: `Outside operational hours (${dayConfig?.hours})`,
          };
        }
      }

      if (allDayBlocked) {
        return {
          timeSlot: slot,
          isAvailable: false,
          bookedCount,
          maxCapacity: targetMaxCapacity,
          status: 'full',
          reason: blockedSlotMap.get('ALL_DAY') || 'Salon closed for the day',
        };
      }

      if (blockedSlotMap.has(slot)) {
        return {
          timeSlot: slot,
          isAvailable: false,
          bookedCount,
          maxCapacity: targetMaxCapacity,
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
            bookedCount: targetMaxCapacity,
            maxCapacity: targetMaxCapacity,
            status: 'full',
            reason: 'Stylist already reserved for this slot',
          };
        }
      }

      // Dynamic capacity check per timeslot per gender
      let isFull = false;
      let reason: string | undefined = undefined;

      if (normalizedGender === 'ladies') {
        if (ladiesCount >= slotMaxLadies) {
          isFull = true;
          reason = `Ladies section is fully booked for this time slot (${ladiesCount}/${slotMaxLadies})`;
        }
      } else if (normalizedGender === 'gents') {
        if (gentsCount >= slotMaxGents) {
          isFull = true;
          reason = `Gents section is fully booked for this time slot (${gentsCount}/${slotMaxGents})`;
        }
      } else {
        // If gender not specified, full only if both departments reached capacity
        if (gentsCount >= slotMaxGents && ladiesCount >= slotMaxLadies) {
          isFull = true;
          reason = 'All sections fully booked for this time slot';
        }
      }

      if (isFull) {
        return {
          timeSlot: slot,
          isAvailable: false,
          bookedCount,
          maxCapacity: targetMaxCapacity,
          status: 'full',
          reason,
        };
      }

      if (targetMaxCapacity > 1 && bookedCount >= targetMaxCapacity - 1 && bookedCount < targetMaxCapacity) {
        return {
          timeSlot: slot,
          isAvailable: true,
          bookedCount,
          maxCapacity: targetMaxCapacity,
          status: 'filling_fast',
          reason: `${bookedCount} of ${targetMaxCapacity} spots reserved (Filling fast)`,
        };
      }

      return {
        timeSlot: slot,
        isAvailable: true,
        bookedCount,
        maxCapacity: targetMaxCapacity,
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

    // 0. Check if slot has already passed
    if (isPastSlotInIST(date, timeSlot)) {
      throw new AppError(
        `The requested time slot ${timeSlot} on ${date} has already passed. Please select an upcoming slot.`,
        400
      );
    }

    // 0.1 Check weekly schedule closure & operating hours
    try {
      const [yStr, mStr, dStr] = date.split('-');
      const dObj = new Date(parseInt(yStr, 10), parseInt(mStr, 10) - 1, parseInt(dStr, 10));
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetDayName = dayNames[dObj.getDay()] || '';

      const scheduleRecord = await prisma.salonSetting.findUnique({
        where: { key: 'weekSchedule' },
      });
      let weekSchedule: any[] = DEFAULT_WEEK_SCHEDULE;
      if (scheduleRecord && scheduleRecord.value) {
        const parsed = JSON.parse(scheduleRecord.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          weekSchedule = parsed;
        }
      }

      const dayConfig = targetDayName
        ? weekSchedule.find((d: any) => d.dayName && d.dayName.toLowerCase() === targetDayName.toLowerCase())
        : null;

      if (dayConfig && (dayConfig.isOpen === false || dayConfig.isOpen === 'false')) {
        throw new AppError(
          `The salon is closed on ${targetDayName}s according to weekly schedule. Please choose an alternative date.`,
          409
        );
      }

      if (dayConfig?.hours) {
        const range = parseOperatingHoursRange(dayConfig.hours);
        if (range) {
          const slotVal = parseHourToValue(timeSlot);
          if (slotVal !== null && (slotVal < range.startHour || slotVal >= range.endHour)) {
            throw new AppError(
              `The requested slot ${timeSlot} on ${date} is outside salon operating hours (${dayConfig.hours}) for ${targetDayName}. Please select an available slot.`,
              409
            );
          }
        }
      }
    } catch (e: any) {
      if (e instanceof AppError) throw e;
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

    // 3. Department capacity check (Configurable per slot & per gender)
    const normalizedGender = (gender || 'gents').toLowerCase();
    const isLadies = normalizedGender.includes('ladi') || normalizedGender.includes('female');
    const targetDepartment = isLadies ? 'ladies' : 'gents';
    const departmentLabel = isLadies ? 'Ladies Section' : 'Gents Section';

    const capacityConfig = await SlotService.getSlotCapacityConfig();
    const { gents: slotMaxGents, ladies: slotMaxLadies } = SlotService.getCapacityForSlot(capacityConfig, timeSlot);
    const maxAllowed = isLadies ? slotMaxLadies : slotMaxGents;

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

    if (departmentBookingsCount >= maxAllowed) {
      throw new AppError(
        `The ${departmentLabel} has reached its maximum capacity of ${maxAllowed} concurrent appointments for ${timeSlot} on ${date}. Please select an adjacent time slot.`,
        409
      );
    }
  }
}
