export interface ServiceItem {
  id: string;
  name: string;
  category: 'color' | 'spa' | 'cut' | 'smoothing' | 'styling';
  categoryLabel: string;
  duration: number; // in minutes
  durationLabel: string;
  price: number;
  description: string;
  features: string[];
  isFeatured?: boolean;
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
  views: string;
  imageUrl: string;
  audioTrack: string;
  stylistHandle: string;
  category: string;
  description?: string;
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
  category: 'all' | 'color' | 'spa' | 'cut';
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
}
