import {
  Appointment,
  DaySchedule,
  BlackoutDate,
  ServiceItem,
  PromoCode,
  CarouselBanner,
  ReelItem,
  PortfolioWork,
  Stylist,
  VIPClient,
  ConciergeInquiry,
  SalonSettings,
  StylistLeave,
  UserAccount,
  SystemRole,
} from './types';

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

export const LOGO_URL = "/logo.png";
export const LOGO_TXT_URL = "/logo_txt.png";
export const X_LOGO_URL = "/x_logo.png";

export const PROMO_BANNER_URL = "/images/photos/smoothening.jpg";

export const STYLIST_AVATARS = {
  niya: "https://images.unsplash.com/photo-1595956553066-fe24a8c33395?auto=format&fit=crop&w=400&q=80",
  abhirami: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  saneesh: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  sunita: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  vismaya: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  neha: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
};

export const getRelativeDateStr = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    time: "10:30 AM",
    durationMin: 45,
    clientName: "Athira P",
    clientPhone: "+91 98470 23145",
    clientEmail: "athira.p@gmail.com",
    clientInitials: "AP",
    clientTier: "VIP Platinum",
    serviceName: "Layer Cut & Blowout Styling",
    station: "Styling Station Chair 1",
    stylistName: "Niya",
    stylistAvatar: STYLIST_AVATARS.niya,
    status: "IN_PROGRESS",
    dateStr: getRelativeDateStr(0),
    notes: "Special thanks to Niya; requested soft face-framing layer cut with airy blowout."
  },
  {
    id: "apt-2",
    time: "11:30 AM",
    durationMin: 60,
    clientName: "Ruby Khan",
    clientPhone: "+91 94461 88203",
    clientEmail: "ruby.khan@outlook.com",
    clientInitials: "RK",
    clientTier: "VIP Gold",
    serviceName: "Hair Spa & Relaxing Pedicure",
    station: "Zen Spa & Pedicure Lounge",
    stylistName: "Sunita",
    stylistAvatar: STYLIST_AVATARS.sunita,
    status: "BOOKED",
    dateStr: getRelativeDateStr(0),
    notes: "Loves Sunita's work; requested deep relaxing scalp pressure and eyebrow styling."
  },
  {
    id: "apt-3",
    time: "02:00 PM",
    durationMin: 60,
    clientName: "Shalima Shamsudeen",
    clientPhone: "+91 97455 12098",
    clientEmail: "shalima.s@gmail.com",
    clientInitials: "SS",
    clientTier: "VIP Gold",
    serviceName: "Signature X Glow & HydraFacial",
    station: "Aesthetic Skin Clinic Suite",
    stylistName: "Abhirami",
    stylistAvatar: STYLIST_AVATARS.abhirami,
    status: "BOOKED",
    dateStr: getRelativeDateStr(0),
    notes: "Welcomed by manager Abhirami; requested hydrating soothing serums."
  },
  {
    id: "apt-4",
    time: "04:30 PM",
    durationMin: 60,
    clientName: "Benazir TP",
    clientPhone: "+91 95678 34912",
    clientInitials: "BT",
    clientTier: "New Guest",
    serviceName: "Luxury Spa Manicure & Pedicure",
    station: "Nail Atelier Suite",
    stylistName: "Vismaya",
    stylistAvatar: STYLIST_AVATARS.vismaya,
    status: "BOOKED",
    dateStr: getRelativeDateStr(0),
    notes: "First time at StyleX Tirur; attentive nail and foot reflexology requested."
  },
  {
    id: "apt-5",
    time: "11:00 AM",
    durationMin: 45,
    clientName: "Dr. Rahul Menon",
    clientPhone: "+91 98950 44211",
    clientEmail: "dr.rahul.menon@kims.health",
    clientInitials: "RM",
    clientTier: "VIP Member",
    serviceName: "Men's Precision Cut & Beard Sculpting",
    station: "Master Barber Chair 1",
    stylistName: "Saneesh",
    stylistAvatar: STYLIST_AVATARS.saneesh,
    status: "BOOKED",
    dateStr: getRelativeDateStr(1),
    notes: "Beard alignment with cooling mint oil head massage."
  },
  {
    id: "apt-6",
    time: "02:30 PM",
    durationMin: 120,
    clientName: "Afna Fathima",
    clientPhone: "+91 96331 55904",
    clientInitials: "AF",
    clientTier: "VIP Platinum",
    serviceName: "French Balayage & Brazilian Botox",
    station: "Master Color Suite",
    stylistName: "Niya",
    stylistAvatar: STYLIST_AVATARS.niya,
    status: "BOOKED",
    dateStr: getRelativeDateStr(1),
    notes: "Manager Abhirami coordinated customized tone; seamless caramel balayage."
  },
  {
    id: "apt-9",
    time: "05:00 PM",
    durationMin: 90,
    clientName: "Ananya Krishna",
    clientPhone: "+91 98471 90223",
    clientInitials: "AK",
    clientTier: "VIP Gold",
    serviceName: "Gents Hair Texture (Botox / Keratin)",
    station: "Master Color Suite",
    stylistName: "Niya",
    stylistAvatar: STYLIST_AVATARS.niya,
    status: "BOOKED",
    dateStr: getRelativeDateStr(1),
    notes: "Deep conditioning with heat seal realignment."
  },
  {
    id: "apt-8",
    time: "12:15 PM",
    durationMin: 45,
    clientName: "Kavya Nair",
    clientPhone: "+91 98462 19044",
    clientInitials: "KN",
    clientTier: "New Guest",
    serviceName: "Signature Facial Ritual",
    station: "Zen Spa & Pedicure Lounge",
    stylistName: "Sunita",
    stylistAvatar: STYLIST_AVATARS.sunita,
    status: "BOOKED",
    dateStr: getRelativeDateStr(2),
    notes: "Herbal steam and face lymphatic massage."
  },
  {
    id: "apt-10",
    time: "03:30 PM",
    durationMin: 45,
    clientName: "Faisal Rahman",
    clientPhone: "+91 97450 67123",
    clientInitials: "FR",
    clientTier: "VIP Member",
    serviceName: "Men's Precision Cut & Beard Sculpting",
    station: "Master Barber Chair 2",
    stylistName: "Saneesh",
    stylistAvatar: STYLIST_AVATARS.saneesh,
    status: "BOOKED",
    dateStr: getRelativeDateStr(2),
    notes: "Regular client; prefers matte wax styling."
  },
  {
    id: "apt-11",
    time: "04:00 PM",
    durationMin: 60,
    clientName: "Meera Nambiar",
    clientPhone: "+91 96562 33419",
    clientInitials: "MN",
    clientTier: "VIP Platinum",
    serviceName: "Signature X Glow & HydraFacial",
    station: "Aesthetic Skin Clinic Suite",
    stylistName: "Abhirami",
    stylistAvatar: STYLIST_AVATARS.abhirami,
    status: "BOOKED",
    dateStr: getRelativeDateStr(3),
    notes: "Bridal prep skincare ritual."
  },
  {
    id: "apt-7",
    time: "09:00 AM",
    durationMin: 35,
    clientName: "Mohammed Fayis",
    clientPhone: "+91 97440 88124",
    clientInitials: "MF",
    clientTier: "VIP Member",
    serviceName: "Gents Hair Cut & Beard Styling",
    station: "Master Barber Chair 2",
    stylistName: "Saneesh",
    stylistAvatar: STYLIST_AVATARS.saneesh,
    status: "COMPLETED",
    dateStr: getRelativeDateStr(-1),
    notes: "Morning walk-in service completed smoothly."
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  // Gents
  {
    id: "svc-gents-1",
    name: "Gents Hair Cut & Beard Styling",
    category: "hair",
    durationMin: 35,
    description: "Precision adult cut, beard trimming, razor detailing, and hot towel finish.",
    showOnWebsite: true
  },
  {
    id: "svc-gents-2",
    name: "Gents Hair Spa & Anti-Dandruff Care",
    category: "hair",
    durationMin: 45,
    description: "Therapeutic L'Oreal scalp scrub, deep conditioning steam, and relaxing neck massage.",
    showOnWebsite: true
  },
  {
    id: "svc-gents-3",
    name: "Gents Hair Texture (Botox / Keratin)",
    category: "hair",
    durationMin: 90,
    description: "Frizz-free smoothening, botox, keratin, and nano plastia thermal realignment.",
    showOnWebsite: true
  },
  {
    id: "svc-gents-4",
    name: "Gents Global INOA & Majirel Color",
    category: "hair",
    durationMin: 45,
    description: "Ammonia-free INOA coverage, grey camouflage, and streak highlights.",
    showOnWebsite: true
  },
  {
    id: "svc-gents-5",
    name: "Gents Signature X Glow & HydraFacial",
    category: "skin",
    durationMin: 60,
    description: "Clinical vortex deep cleansing, 24K gold infusion, and instant brightening glow.",
    showOnWebsite: true
  },
  {
    id: "svc-gents-6",
    name: "Gents Pre-Grooming Wedding Package",
    category: "groom",
    durationMin: 120,
    description: "Whitening Miracle facial, de-tan, hair spa, precision cut, beard styling, and pedicure.",
    showOnWebsite: true
  },

  // Ladies
  {
    id: "svc-ladies-1",
    name: "Ladies Hair Cut & Blowout Styling",
    category: "hair",
    durationMin: 45,
    description: "Bespoke layer cuts, bob cuts, curtain bangs, wash, and thermal blowout.",
    showOnWebsite: true
  },
  {
    id: "svc-ladies-2",
    name: "Ladies Balayage & Artistic Highlights",
    category: "hair",
    durationMin: 150,
    description: "Freehand French balayage, ombre melting, and gloss toner seal with Olaplex bond care.",
    showOnWebsite: true
  },
  {
    id: "svc-ladies-3",
    name: "Ladies Keratin & Brazilian Botox",
    category: "hair",
    durationMin: 120,
    description: "Intensive cuticle repair, diamond gloss smoothing, and long-lasting frizz protection.",
    showOnWebsite: true
  },
  {
    id: "svc-ladies-4",
    name: "Ladies Hair Spa & Intensive Therapy",
    category: "hair",
    durationMin: 60,
    description: "Targeted anti-dandruff therapy, deep scalp scrub, and nourishing oil massage.",
    showOnWebsite: true
  },
  {
    id: "svc-ladies-5",
    name: "Ladies Signature X Glow & HydraFacial MD",
    category: "skin",
    durationMin: 60,
    description: "HydraFacial vortex exfoliation, 24K gold facial, and luminous bridal glow.",
    showOnWebsite: true
  },
  {
    id: "svc-ladies-6",
    name: "Ladies Spa Manicure & Pedicure Lounge",
    category: "spa",
    durationMin: 60,
    description: "Exfoliating foot soak, nail shaping, gel polish, and soothing reflexology massage.",
    showOnWebsite: true
  },
  {
    id: "svc-ladies-7",
    name: "Ladies Pre-Bridal Luxury Package",
    category: "bridal",
    durationMin: 180,
    description: "Bridal facial with de-tan, full body waxing, advanced mani-pedi, and hair spa ritual.",
    showOnWebsite: true
  }
];

export const INITIAL_WEEK_SCHEDULE: DaySchedule[] = [
  {
    dayName: "Monday",
    label: "Monday",
    dateStr: "Mon, Daily",
    isOpen: true,
    statusText: "Open",
    subText: "10:00 AM – 1:00 AM",
    hours: "10:00 AM – 1:00 AM"
  },
  {
    dayName: "Tuesday",
    label: "Tuesday",
    dateStr: "Tue, Daily",
    isOpen: true,
    statusText: "Open",
    subText: "10:00 AM – 1:00 AM",
    hours: "10:00 AM – 1:00 AM"
  },
  {
    dayName: "Wednesday",
    label: "Wednesday",
    dateStr: "Wed, Daily",
    isOpen: true,
    statusText: "Open",
    subText: "10:00 AM – 1:00 AM",
    hours: "10:00 AM – 1:00 AM"
  },
  {
    dayName: "Thursday",
    label: "Today",
    dateStr: "Thu, Daily",
    isOpen: true,
    statusText: "Open",
    subText: "10:00 AM – 1:00 AM",
    hours: "10:00 AM – 1:00 AM"
  },
  {
    dayName: "Friday",
    label: "Tomorrow",
    dateStr: "Fri, Weekend",
    isOpen: true,
    statusText: "Open",
    subText: "10:00 AM – 1:00 AM",
    hours: "10:00 AM – 1:00 AM"
  },
  {
    dayName: "Saturday",
    label: "Saturday",
    dateStr: "Sat, Weekend",
    isOpen: true,
    statusText: "Open",
    subText: "10:00 AM – 1:00 AM",
    hours: "10:00 AM – 1:00 AM"
  },
  {
    dayName: "Sunday",
    label: "Sunday",
    dateStr: "Sun, Weekend",
    isOpen: true,
    statusText: "Open",
    subText: "10:00 AM – 1:00 AM",
    hours: "10:00 AM – 1:00 AM"
  }
];

export const INITIAL_BLACKOUT_DATES: BlackoutDate[] = [
  {
    id: "bo-1",
    month: "NOV",
    day: "14",
    title: "VIP Private Bridal Suite Buyout",
    timeRange: "10:00 AM – 3:00 PM",
    description: "Private bridal party makeover; public bookings reserved for main salon."
  },
  {
    id: "bo-2",
    month: "DEC",
    day: "01",
    title: "Artisan Masterclass & Equipment Calibration",
    timeRange: "8:00 AM – 10:00 AM",
    description: "Morning staff training session. Public doors open at 10:00 AM as scheduled."
  }
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    id: "promo-1",
    code: "STYLEXTIRUR",
    discount: "Complimentary Hair Spa Add-on",
    totalUses: "84 / 150 uses",
    isActive: true,
    colorScheme: "green"
  },
  {
    id: "promo-2",
    code: "BRIDALGLOW",
    discount: "Complimentary HydraFacial Trial with Pre-Bridal Suite",
    totalUses: "26 uses",
    isActive: true,
    colorScheme: "yellow"
  },
  {
    id: "promo-3",
    code: "HAIRSPAFEST",
    discount: "Complimentary Scalp Scrub Add-on",
    totalUses: "112 / 200 uses",
    isActive: true,
    colorScheme: "orange"
  }
];

export const INITIAL_BANNERS: CarouselBanner[] = [
  {
    id: "ban-1",
    title: "Signature Hair Spa & Anti-Dandruff Ritual",
    tag: "Limited Privilege",
    validity: "Open Daily • 10:00 AM – 1:00 AM",
    imageUrl: "/images/photos/smoothening.jpg",
    isActive: true
  },
  {
    id: "ban-2",
    title: "French Balayage & Brazilian Botox Suite",
    tag: "Color Curation",
    validity: "StyleX Tirur Outlet Exclusive",
    imageUrl: "/images/photos/coloring.jpg",
    isActive: true
  },
  {
    id: "ban-3",
    title: "Pre-Bridal Luxury & Wedding Makeover",
    tag: "Bridal Packages",
    validity: "Private VIP Suite Reservations",
    imageUrl: "/images/photos/bridal.jpg",
    isActive: true
  }
];

export const INITIAL_STYLISTS: Stylist[] = [
  {
    id: "stylist-1",
    name: "Niya",
    role: "Senior Stylist & Hair Care Specialist",
    avatar: STYLIST_AVATARS.niya,
    station: "Styling Station Chair 1",
    appointmentsCount: 6,
    rating: 5.0,
    reviewsCount: 164,
    isAvailableToday: true,
    gender: "ladies",
  },
  {
    id: "stylist-2",
    name: "Abhirami",
    role: "Salon Manager & Client Care Lead",
    avatar: STYLIST_AVATARS.abhirami,
    station: "Executive Consultation Desk",
    appointmentsCount: 5,
    rating: 5.0,
    reviewsCount: 182,
    isAvailableToday: true,
    gender: "both",
  },
  {
    id: "stylist-3",
    name: "Saneesh",
    role: "Master Barber & Men's Grooming Lead",
    avatar: STYLIST_AVATARS.saneesh,
    station: "Master Barber Chair 1",
    appointmentsCount: 7,
    rating: 4.9,
    reviewsCount: 140,
    isAvailableToday: true,
    gender: "gents",
  },
  {
    id: "stylist-4",
    name: "Sunita",
    role: "Senior Spa & Pedicure Specialist",
    avatar: STYLIST_AVATARS.sunita,
    station: "Zen Spa & Pedicure Lounge",
    appointmentsCount: 4,
    rating: 5.0,
    reviewsCount: 118,
    isAvailableToday: true,
    gender: "ladies",
  },
  {
    id: "stylist-5",
    name: "Vismaya",
    role: "Nail Artisan & Foot Care Specialist",
    avatar: STYLIST_AVATARS.vismaya,
    station: "Nail Atelier Suite",
    appointmentsCount: 5,
    rating: 4.9,
    reviewsCount: 96,
    isAvailableToday: true,
    gender: "ladies",
  },
  {
    id: "stylist-6",
    name: "Neha",
    role: "Senior Hair & Texture Artisan",
    avatar: STYLIST_AVATARS.neha,
    station: "Styling Station Chair 2",
    appointmentsCount: 4,
    rating: 4.9,
    reviewsCount: 88,
    isAvailableToday: true,
    gender: "both",
  }
];

export const INITIAL_VIP_CLIENTS: VIPClient[] = [
  {
    id: "client-1",
    name: "Athira P",
    initials: "AP",
    phone: "+91 98470 23145",
    email: "athira.p@gmail.com",
    preferredStylist: "Niya",
    totalVisits: 14,
    favoriteRitual: "Layer Cut & Blowout Styling",
    notes: "Special thanks to Niya; appreciates smart advice and comfortable atmosphere.",
    lastVisit: "1 week ago"
  },
  {
    id: "client-2",
    name: "Ruby Khan",
    initials: "RK",
    phone: "+91 94461 88203",
    email: "ruby.khan@outlook.com",
    preferredStylist: "Sunita",
    totalVisits: 12,
    favoriteRitual: "Hair Spa & Relaxing Pedicure",
    notes: "Hardworking specialist Sunita is requested every visit. Loves relaxing head massage.",
    lastVisit: "3 weeks ago"
  },
  {
    id: "client-3",
    name: "Shalima Shamsudeen",
    initials: "SS",
    phone: "+91 97455 12098",
    email: "shalima.s@gmail.com",
    preferredStylist: "Abhirami",
    totalVisits: 18,
    favoriteRitual: "Signature X Glow & HydraFacial",
    notes: "Commends warm and welcoming hospitality from Abhirami, Niya, and Neha.",
    lastVisit: "2 weeks ago"
  },
  {
    id: "client-4",
    name: "Benazir TP",
    initials: "BT",
    phone: "+91 95678 34912",
    email: "benazir.tp@gmail.com",
    preferredStylist: "Vismaya",
    totalVisits: 8,
    favoriteRitual: "Luxury Spa Manicure & Pedicure",
    notes: "Praised Abhirami and Vismaya for attentive, professional manicure & pedicure care.",
    lastVisit: "1 month ago"
  },
  {
    id: "client-5",
    name: "Dr. Rahul Menon",
    initials: "RM",
    phone: "+91 98950 44211",
    email: "rahul.menon@kims.health",
    preferredStylist: "Saneesh",
    totalVisits: 11,
    favoriteRitual: "Men's Precision Cut & Beard Sculpting",
    notes: "Usually books late evening slots post-8:00 PM; prefers mint oil cooling massage.",
    lastVisit: "2 weeks ago"
  },
  {
    id: "client-6",
    name: "Afna Fathima",
    initials: "AF",
    phone: "+91 96331 55904",
    email: "afna.fathima@gmail.com",
    preferredStylist: "Saneesh",
    totalVisits: 15,
    favoriteRitual: "French Balayage & Brazilian Botox",
    notes: "Praises hairdresser Saneesh and manager Abhirami for incredible transformation care.",
    lastVisit: "10 days ago"
  }
];

export const INITIAL_CONCIERGE_INQUIRIES: ConciergeInquiry[] = [
  {
    id: "inq-1",
    clientName: "Fatima Zahra",
    phone: "+91 98471 22990",
    serviceRequested: "VIP Bridal Suite Booking for 5 Guests",
    preferredDate: "Next Saturday (Full Afternoon)",
    message: "Seeking private suite reservation for our family wedding group. Requires HydraFacial, hair spa, and bridal styling with Abhirami coordinating.",
    status: "Unread",
    timeAgo: "15m ago"
  },
  {
    id: "inq-2",
    clientName: "Shameer K",
    phone: "+91 97450 88123",
    serviceRequested: "Late Night Haircut & Beard Grooming",
    preferredDate: "Tonight (11:30 PM)",
    message: "Arriving from Calicut Airport around 11:15 PM. Can Saneesh take an express haircut and beard styling session before 1:00 AM closing?",
    status: "Unread",
    timeAgo: "45m ago"
  },
  {
    id: "inq-3",
    clientName: "Anjali Nair",
    phone: "+91 96330 44556",
    serviceRequested: "Brazilian Botox & Hair Smoothening",
    preferredDate: "Sunday @ 2:00 PM",
    message: "Had frizzy hair concerns from previous treatments elsewhere. Recommended by Athira P to consult Niya regarding Keratin or Brazilian Botox.",
    status: "In Progress",
    timeAgo: "2h ago"
  }
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

export const INITIAL_STYLIST_LEAVES: StylistLeave[] = [
  {
    id: "leave-1",
    stylistId: "stylist-1",
    stylistName: "Niya",
    date: "2024-10-28",
    duration: "FULL_DAY",
    reason: "Advanced Masterclass & L'Oreal Paris Academy Training",
    createdAt: "2024-10-24"
  },
  {
    id: "leave-2",
    stylistId: "stylist-4",
    stylistName: "Sunita",
    date: "2024-10-29",
    duration: "FIRST_HALF",
    reason: "Personal morning appointment (Returns after 4:30 PM)",
    createdAt: "2024-10-24"
  },
  {
    id: "leave-3",
    stylistId: "stylist-3",
    stylistName: "Saneesh",
    date: "2024-11-02",
    duration: "SECOND_HALF",
    reason: "Family function (Available morning 10 AM – 4:30 PM)",
    createdAt: "2024-10-24"
  }
];

export const INITIAL_REELS: ReelItem[] = [
  {
    id: 'reel-smoothening',
    title: 'Hair Smoothening & Gloss',
    tag: 'Smoothening',
    views: '42.5k views',
    imageUrl: '/videos/thumbnails/smoothening.jpg',
    audioTrack: 'Original Audio • StyleX',
    stylistHandle: 'Texture Specialist • Tirur',
    category: 'Hair Texture',
    description: 'Silky, frizz-free hair smoothening with lasting radiant shine.',
    instagramUrl: 'https://www.instagram.com/p/Ddltn-BNrSL/',
    videoUrl: '/videos/reels/Smoothening.mp4',
    isActive: true
  },
  {
    id: 'reel-bridal',
    title: 'Bridal Makeover & Styling',
    tag: 'Bridal Makeover',
    views: '68.2k views',
    imageUrl: '/videos/thumbnails/bridal.jpg',
    audioTrack: 'Traditional Melodies',
    stylistHandle: 'Bridal Team • Tirur',
    category: 'Bridal & Makeup',
    description: 'Complete bridal makeover with luminous HD makeup and saree draping.',
    instagramUrl: 'https://www.instagram.com/p/Ddd36yCozBQ/',
    videoUrl: '/videos/reels/Bridal.mp4',
    isActive: true
  },
  {
    id: 'reel-kids',
    title: 'Kids Hair Cut & Makeover',
    tag: 'Kids Makeover',
    views: '31.4k views',
    imageUrl: '/videos/thumbnails/kids.jpg',
    audioTrack: 'Playful Beats • StyleX',
    stylistHandle: 'Styling Specialist • Tirur',
    category: 'Kids Hair Cut',
    description: 'Fun, gentle, and stylish haircut session crafted for the little ones.',
    instagramUrl: 'https://www.instagram.com/p/DdRPZOJIOEm/',
    videoUrl: '/videos/reels/Kids.mp4',
    isActive: true
  },
  {
    id: 'reel-coloring',
    title: 'Hair Coloring & Highlights',
    tag: 'Hair Coloring',
    views: '54.1k views',
    imageUrl: '/videos/thumbnails/Coloring.jpg',
    audioTrack: 'Acoustic Harmony',
    stylistHandle: 'Color Specialist • Tirur',
    category: 'Hair Color',
    description: 'Vibrant hair coloring and seamless highlights with deep conditioning gloss.',
    instagramUrl: 'https://www.instagram.com/p/DcV6tyAyCaK/',
    videoUrl: '/videos/reels/coloring.mp4',
    isActive: true
  }
];

export const INITIAL_PORTFOLIO_WORKS: PortfolioWork[] = [
  {
    id: 'port-1',
    title: 'Hair Smoothening & Gloss Transformation',
    category: 'Smoothening',
    artisan: 'Texture Specialist',
    imageUrl: '/images/photos/smoothening.jpg',
    description: 'Silky, reflective glaze with advanced thermal bonding treatment.',
    isActive: true
  },
  {
    id: 'port-2',
    title: 'Bridal Makeover & Styling',
    category: 'Bridal Makeover',
    artisan: 'Lead Bridal Stylist',
    imageUrl: '/images/photos/bridal.jpg',
    description: 'Royal bridal look with waterproof HD base and traditional hair updo.',
    isActive: true
  },
  {
    id: 'port-3',
    title: 'Kids Hair Cut & Makeover',
    category: 'Kids Hair Cut',
    artisan: 'Styling Specialist',
    imageUrl: '/images/photos/kids.jpg',
    description: 'Precision scissor and clipper blend tailored for kids with zero fuss.',
    isActive: true
  },
  {
    id: 'port-4',
    title: 'Hair Coloring & Highlights',
    category: 'Hair Coloring',
    artisan: 'Color Specialist',
    imageUrl: '/images/photos/coloring.jpg',
    description: 'Dimensional balayage highlights with warm caramel tones and gloss.',
    isActive: true
  },
  {
    id: 'port-5',
    title: 'Layered Cut & Blowout Styling',
    category: 'Hair Styling',
    artisan: 'Senior Hair Stylist',
    imageUrl: '/images/photos/5.jpg',
    description: 'Face framing textured butterfly layers with high-volume salon blowout.',
    isActive: true
  }
];

