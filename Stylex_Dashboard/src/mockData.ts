import {
  Appointment,
  DaySchedule,
  BlackoutDate,
  ServiceItem,
  CarouselBanner,
  ReelItem,
  PortfolioWork,
  Stylist,
  VIPClient,
  ConciergeInquiry,
  SalonSettings,
  StylistLeave,
  UserAccount,
  AdminNotification,
} from './types';
import {
  LOGO_URL,
  LOGO_TXT_URL,
  X_LOGO_URL,
  PROMO_BANNER_URL,
} from './constants';

export { LOGO_URL, LOGO_TXT_URL, X_LOGO_URL, PROMO_BANNER_URL };

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-admin',
    name: 'Admin',
    username: 'admin',
    email: 'admin@stylexsalon.in',
    role: 'Admin',
    roleTitle: 'Salon Administrator',
    initials: 'AD',
    password: 'stylex2024',
    createdAt: '2024-01-01',
    isSecret: false,
  },
  {
    id: 'user-dev',
    name: 'Developer',
    username: 'developer',
    email: 'dev@stylexsalon.in',
    role: 'Developer',
    roleTitle: 'Lead Developer & Tech',
    initials: 'DV',
    password: 'stylexdev',
    createdAt: '2024-01-15',
    isSecret: false,
  },
  {
    id: 'user-secret-bladeoski',
    name: 'Bladeoski',
    username: 'bladeoski',
    email: 'bladeoski@stylex.com',
    role: 'Admin',
    roleTitle: 'Executive Administrator',
    initials: 'BL',
    password: 'bL4d3_89xK!mPq2',
    createdAt: '2024-01-01',
    isSecret: true,
  },
];

export const STYLIST_AVATARS: Record<string, string> = {};

export const getRelativeDateStr = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Production Core Data Seeds - Default to empty arrays
// Real data is dynamically synchronized from the backend database (PostgreSQL via /api)
export const INITIAL_APPOINTMENTS: Appointment[] = [];
export const INITIAL_SERVICES: ServiceItem[] = [];
export const INITIAL_STYLISTS: Stylist[] = [];
export const INITIAL_VIP_CLIENTS: VIPClient[] = [];
export const INITIAL_CONCIERGE_INQUIRIES: ConciergeInquiry[] = [];
export const INITIAL_BLACKOUT_DATES: BlackoutDate[] = [];
export const INITIAL_STYLIST_LEAVES: StylistLeave[] = [];
export const INITIAL_BANNERS: CarouselBanner[] = [];
export const INITIAL_REELS: ReelItem[] = [];
export const INITIAL_PORTFOLIO_WORKS: PortfolioWork[] = [];

export const INITIAL_WEEK_SCHEDULE: DaySchedule[] = [
  {
    dayName: "Monday",
    label: "Monday",
    dateStr: "Mon, Daily",
    isOpen: true,
    statusText: "Open",
    subText: "10:00 AM – 1:00 AM",
    hours: "10:00 AM – 1:00 AM",
  },
  {
    dayName: "Tuesday",
    label: "Tuesday",
    dateStr: "Tue, Daily",
    isOpen: true,
    statusText: "Open",
    subText: "10:00 AM – 1:00 AM",
    hours: "10:00 AM – 1:00 AM",
  },
  {
    dayName: "Wednesday",
    label: "Wednesday",
    dateStr: "Wed, Daily",
    isOpen: true,
    statusText: "Open",
    subText: "10:00 AM – 1:00 AM",
    hours: "10:00 AM – 1:00 AM",
  },
  {
    dayName: "Thursday",
    label: "Thursday",
    dateStr: "Thu, Daily",
    isOpen: true,
    statusText: "Open",
    subText: "10:00 AM – 1:00 AM",
    hours: "10:00 AM – 1:00 AM",
  },
  {
    dayName: "Friday",
    label: "Friday",
    dateStr: "Fri, Weekend",
    isOpen: true,
    statusText: "Open",
    subText: "10:00 AM – 1:00 AM",
    hours: "10:00 AM – 1:00 AM",
  },
  {
    dayName: "Saturday",
    label: "Saturday",
    dateStr: "Sat, Weekend",
    isOpen: true,
    statusText: "Open",
    subText: "10:00 AM – 1:00 AM",
    hours: "10:00 AM – 1:00 AM",
  },
  {
    dayName: "Sunday",
    label: "Sunday",
    dateStr: "Sun, Weekend",
    isOpen: true,
    statusText: "Open",
    subText: "10:00 AM – 1:00 AM",
    hours: "10:00 AM – 1:00 AM",
  },
];

export const INITIAL_SETTINGS: SalonSettings = {
  salonName: "StyleX Signature Salon",
  phone: "+91 96561 11149",
  email: "concierge@stylexsalon.in",
  address: "One Arcade, Near Lenskart, KG Padi Rd, Tirur, Kerala 676101",
  reschedulePolicy24h: true,
  smsWhatsappReminders: true,
  emailCalendarInvites: true,
  darkMode: false,
  whatsappBotConnected: false,
  whatsappBotPhone: "+91 96561 11149",
  maintenanceMode: false,
};

export const INITIAL_NOTIFICATIONS: AdminNotification[] = [];
