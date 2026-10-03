export type NavTab = 
  | 'overview'
  | 'appointments'
  | 'schedule-control'
  | 'artisans-and-stylists'
  | 'service-menu'
  | 'promotions'
  | 'clients-and-vip'
  | 'concierge-desk'
  | 'atelier-settings'
  | 'site-analytics';

export type AppointmentStatus = 'BOOKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string;
  time: string;
  durationMin: number;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientInitials: string;
  clientTier?: 'VIP Platinum' | 'VIP Gold' | 'VIP Member' | 'New Guest' | 'Standard';
  serviceName: string;
  station: string;
  stylistName: string;
  stylistAvatar: string;
  status: AppointmentStatus;
  dateStr: string; // e.g. "2024-10-24"
  notes?: string;
  bookingRef?: string;
  managementToken?: string;
}

export interface DaySchedule {
  dayName: string;
  label: string; // "Today", "Tomorrow", "Weekend", etc.
  dateStr: string; // "Thu, Oct 24"
  isOpen: boolean;
  statusText: string; // "Open", "Blackout", "Closed"
  subText: string;
  hours: string;
}

export interface BlackoutDate {
  id: string;
  month: string;
  day: string;
  title?: string;
  timeRange: string;
  description?: string;
  dateStr?: string;
  blockType?: 'FULL_DAY' | 'TIME_SLOTS';
  slots?: string[];
  station?: string;
  createdAt?: string;
}

export type ServiceCategory = 'hair' | 'skin' | 'spa' | 'groom' | 'bridal';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  durationMin: number;
  description: string;
  showOnWebsite: boolean;
  gender?: 'gents' | 'ladies' | 'both' | 'unisex';
}

export interface PromoCode {
  id: string;
  code: string;
  discount: string;
  totalUses: string;
  isActive: boolean;
  colorScheme: 'green' | 'yellow' | 'orange';
}

export interface CarouselBanner {
  id: string;
  title: string;
  tag?: string;
  validity: string;
  imageUrl: string;
  isActive: boolean;
}

export interface ReelItem {
  id: string;
  title: string;
  tag: string;
  views?: string;
  imageUrl: string;
  audioTrack?: string;
  stylistHandle?: string;
  category: string;
  description?: string;
  instagramUrl?: string;
  videoUrl?: string;
  isActive?: boolean;
}

export interface PortfolioWork {
  id: string;
  title: string;
  category: string;
  artisan: string;
  imageUrl: string;
  description?: string;
  isActive?: boolean;
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  avatar: string;
  station: string;
  specialty?: string;
  appointmentsCount: number;
  rating: number;
  reviewsCount: number;
  bio?: string;
  isAvailableToday: boolean;
  gender?: string;
}

export type LeaveDuration = 'FULL_DAY' | 'FIRST_HALF' | 'SECOND_HALF';

export interface StylistLeave {
  id: string;
  stylistId: string;
  stylistName: string;
  date: string; // "YYYY-MM-DD" e.g. "2024-10-28"
  duration: LeaveDuration; // 'FULL_DAY' | 'FIRST_HALF' (Morning) | 'SECOND_HALF' (Afternoon/Evening)
  reason?: string;
  createdAt: string;
}

export interface VIPClient {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  tier?: string;
  preferredStylist?: string;
  totalVisits: number;
  favoriteRitual?: string;
  notes?: string;
  lastVisit: string;
  spent?: string;
  favArtisan?: string;
  visits?: number;
}

export interface ConciergeInquiry {
  id: string;
  clientName: string;
  clientTier?: string;
  phone: string;
  serviceRequested: string;
  preferredDate: string;
  message: string;
  status: 'Unread' | 'In Progress' | 'Resolved';
  timeAgo: string;
}

export interface SalonSettings {
  salonName: string;
  phone: string;
  email: string;
  address: string;
  reschedulePolicy24h: boolean;
  smsWhatsappReminders: boolean;
  emailCalendarInvites: boolean;
  darkMode?: boolean;
  whatsappBotConnected?: boolean;
  whatsappBotPhone?: string;
  maintenanceMode?: boolean;
}

export type SystemRole = 'Admin' | 'Developer' | 'Manager' | 'Staff' | 'Normal User';

export interface UserAccount {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: SystemRole;
  roleTitle: string;
  initials: string;
  password: string;
  createdAt: string;
  isSecret?: boolean;
}

export interface AdminNotification {
  id: string;
  type: 'booking' | 'concierge' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  linkTab?: NavTab;
  createdAt: number;
}

export interface StoreNotice {
  isActive: boolean;
  title: string;
  message: string;
  badge?: string;
  buttonText?: string;
  updatedAt?: string;
}
