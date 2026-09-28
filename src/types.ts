export interface SalonDetails {
  brandName: string;
  subBrand: string;
  flagshipLocation: string;
  phoneDisplay: string;
  phoneNumberClean: string;
  whatsappNumber: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  pincode: string;
  hours: string;
  hoursDetail: string;
  instagramHandle: string;
  instagramUrl: string;
  mapsUrl: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'hair' | 'skin' | 'bridal' | 'groom' | 'spa';
  categoryLabel: string;
  duration: number; // in minutes
  durationLabel: string;
  price: number;
  startingPrice?: number;
  tagline?: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
  featured?: boolean;
  badge?: string;
  gender?: 'gents' | 'ladies' | 'both';
}

export interface MasterArtisan {
  id: string;
  name: string;
  role: string;
  experience: string;
  specialty: string;
  bio: string;
  gender?: 'gents' | 'ladies' | 'both';
}

export interface PromoSlide {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  offerText: string;
  primaryService: string;
  primaryPrice: string;
  secondaryService?: string;
  secondaryPrice?: string;
}

export interface ReelItem {
  id: string;
  title: string;
  tag: string;
  views?: string;
  imageUrl: string;
  audioTrack: string;
  stylistHandle: string;
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


export interface ReviewItem {
  id: string;
  author: string;
  initials: string;
  role: string;
  rating: number;
  quote: string;
  highlightText: string;
  tag: string;
  artisan: string;
  category: 'all' | 'hair' | 'skin' | 'bridal' | 'spa' | 'color' | 'cut';
}

export interface BookingState {
  serviceId: string;
  serviceName: string;
  price: number;
  duration: number;
  date: string;
  dayOfMonth: number;
  time: string;
  stylist: string;
  notes: string;
  beverage: string;
  gender?: 'gents' | 'ladies';
  phoneCountryCode?: string;
  phone?: string;
  email?: string;
  customerName?: string;
  bookingRef?: string;
}

