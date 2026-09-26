import { SalonDetails, ServiceItem, PromoSlide, ReelItem, ReviewItem } from '../types.ts';

export const SALON_DATA: SalonDetails = {
  brandName: 'STYLEX',
  subBrand: 'SIGNATURE SALON',
  flagshipLocation: 'TIRUR FLAGSHIP',
  phoneDisplay: '+91 96561 11149',
  phoneNumberClean: '+919656111149',
  whatsappNumber: '919656111149',
  addressLine1: 'One Arcade, Near Lenskart',
  addressLine2: 'KG Padi Rd',
  landmark: 'Near Lenskart, KG Padi Road',
  city: 'Tirur, Malappuram, Kerala',
  pincode: '676101',
  hours: 'Open Daily: 10:00 AM – 1:00 AM',
  hoursDetail: 'Monday through Sunday without break',
  instagramHandle: '@stylex.signature.salon.tirur',
  instagramUrl: 'https://www.instagram.com/stylex.signature.salon.tirur/',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=StyleX+Signature+Salon+One+Arcade+Near+Lenskart+KG+Padi+Rd+Tirur',
};

export const LOGO_URL = '/logo.png';

export const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNgs_B92B-QkOZ0Rqa8nUGRCii9E7hnJIHyniGxaHponOpzfc741ASEPipkTKxZa9SqGddWAm6efBy9V5wVZQEgi8yOxzrYuEp5_UQnE0SijguIJwtvtIvObo_RRdKS6Jm85wZPiKo7XeLj3PxoJk_Cuvl220hn9LHXUePDjXW8wxybdTVdutgAjhp_UpBzQilncoR8Yr1KGfY8Xev-xUmeTaLZUt0cGPV1_EVpaLZ';

export const TIME_SLOTS = [
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
  '12:00 AM'
];

export const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'promo-1',
    title: 'Signature Hair Spa & Anti-Dandruff Ritual',
    subtitle: 'Seasonal Limited Privilege at StyleX Tirur Flagship',
    tag: 'Limited Privilege',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc52MBbTkUI1t61AB7vAKuSfCibl5IWOaC9N4kneZwjsJWo9t_GuI4xU1e3BcCOW9NMd7PVTSB3VKpOk1vaaBBw6q2VfcBvLWyxym848HfMVPHzPeQcJaOpYqFATSIXYXh3QEsMHFH90oDCA-wMC8n_pf5V_GNQ-hYHvUcyOmlNlq6FKnG3MfCfuED3Ht1NRDddWSrhud1fkq2pP0pjW-_bRUcOCJQiFvHyzLApeNZToSoo6Gg3lLpFA',
    offerText: 'Comprehensive Hair Spa Intensive with Targeted Anti-Dandruff Scalp Treatment',
    primaryService: 'Hair Spa Intensive',
    primaryPrice: 'Complimentary Consultation',
    secondaryService: 'Anti Dandruff Treatment',
    secondaryPrice: 'Included',
  },
  {
    id: 'promo-2',
    title: 'French Balayage & Master Color Suite',
    subtitle: 'Artisan Freehand Dimension with Olaplex Bond Protection',
    tag: 'Color Curation',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBi2NQZI8Ox9PgosQJUe7V6vnlutLlVFiKtwF3ph_kYIHMif1V2SSLMQOZR5STQC7LVxoMjneYFd5Gsf-p_iOdL6LntlR6aRyON66dszLchgZqeGAB8i7Qa5095MzssXj54SzBeF087q8YRECvWMSW8cCTSQqYyAZRmpHk-qDyjVT6LACqQ92gCVuF9AnM7Y8AKJfgro-SJcz94_F_gZdq_OJotFzAaXoeJ0r3ryhD6M-wtmpJefYW3Q',
    offerText: 'Special Atelier Package • Includes Gloss Toner, Bond Builder & Thermal Blowout',
    primaryService: 'Balayage & Glaze Suite',
    primaryPrice: 'Signature Curation',
    secondaryService: 'Gloss Toner Seal',
    secondaryPrice: 'Included',
  },
  {
    id: 'promo-3',
    title: 'Royal Muhurtham & Reception Bridal Atelier',
    subtitle: 'Private VIP Bridal Suite Session with HD Waterproof Makeup',
    tag: 'Exclusive Atelier',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XVbc9Bzp69rsOp8b2K0EXyCd81fPV8Gqc0VLSsajN_t7wUJdDtks74DkpEV0hjc2S52BuOsK_jzxx2P9P6CbR2HOrhXmTXnQylrmkv8L4VUTHKyBIYjEAiLbW_c5TRkbGDvVXjfiJ1ZrWqy16CUqxNdB7pfumWX0S3CLgEBsAO5H9tZfC_bF4SAuFIoP5NlE1NZsqYP1ELAP-JDRP9E3mctbNrk5UsVFIVpqXjWLJLuNq2tI-pG1xTPDhc',
    offerText: 'Includes HD airbrush makeup, couture hair architecture, saree draping & VIP touch-up kit',
    primaryService: 'Couture Bridal Session',
    primaryPrice: 'Bespoke Package',
    secondaryService: 'VIP Suite Access',
    secondaryPrice: 'Included',
  }
];

// Booking Headings for the Booking Dropdown (Only Headings as requested)
export const BOOKING_HEADINGS: ServiceItem[] = [
  // Gents Headings
  {
    id: 'gents-cut-styling',
    name: 'Hair Cut / Styling',
    category: 'hair',
    categoryLabel: 'Gents Atelier',
    duration: 35,
    durationLabel: '30-40 mins',
    price: 250,
    startingPrice: 250,
    gender: 'gents',
    tagline: 'Precision Adult & Kids Cuts, Beard Alignment',
    description: 'Master haircut, beard shaping, head anatomy mapping, and hot towel finish.',
    features: ['Hair Cut (Adults)', 'Beard Styling', 'Hot Towel Razor Shave', 'Kids Hair Cut']
  },
  {
    id: 'gents-hair-spa',
    name: 'Hair Spa / Treatment',
    category: 'hair',
    categoryLabel: 'Gents Atelier',
    duration: 45,
    durationLabel: '45 mins',
    price: 700,
    startingPrice: 700,
    gender: 'gents',
    tagline: 'Deep Scalp Wellness & Anti-Dandruff Detox',
    description: 'Targeted anti-dandruff therapy, soothing botanical massage, and clarifying hair spa.',
    features: ['Basic Hair Spa', 'Advanced Hair Spa', 'Dandruff Treatment with Spa', 'Premium Hair Spa']
  },
  {
    id: 'gents-hair-texture',
    name: 'Hair Texture',
    category: 'hair',
    categoryLabel: 'Gents Atelier',
    duration: 90,
    durationLabel: '90 mins',
    price: 3000,
    startingPrice: 3000,
    gender: 'gents',
    tagline: 'Keratin, Botox & Smoothening Systems',
    description: 'Professional protein realignment, frizz elimination, and sleek manageable texture.',
    features: ['Smoothening System', 'Botox Treatment', 'Keratin Silk Infusion', 'Nano Plastia']
  },
  {
    id: 'gents-hair-color',
    name: 'Hair Color',
    category: 'hair',
    categoryLabel: 'Gents Atelier',
    duration: 60,
    durationLabel: '45-60 mins',
    price: 400,
    startingPrice: 400,
    gender: 'gents',
    tagline: 'Ammonia-Free INOA, Highlights & Grey Blending',
    description: 'Customized natural grey camouflage, fashion highlights, and rich ammonia-free tones.',
    features: ['Global INOA Ammonia-Free', 'Basic Colouring', 'Highlights Per Streak', 'Henna Color Therapy']
  },
  {
    id: 'gents-skin-care',
    name: 'Skin Care',
    category: 'skin',
    categoryLabel: 'Gents Atelier',
    duration: 60,
    durationLabel: '45-60 mins',
    price: 500,
    startingPrice: 500,
    gender: 'gents',
    tagline: 'Hydra Facial, 24K Gold & Signature Glow',
    description: 'Deep vortex pore extraction, revitalizing face polishes, and medical-grade skin rejuvenation.',
    features: ['Peel & Mask Detox', 'Deep Clean Up', 'Signature X Glow', 'Hydra Facial Rejuvenation']
  },
  {
    id: 'gents-detan',
    name: 'De-Tan',
    category: 'skin',
    categoryLabel: 'Gents Atelier',
    duration: 30,
    durationLabel: '30 mins',
    price: 400,
    startingPrice: 400,
    gender: 'gents',
    tagline: 'Instant Sun Damage & Pigmentation Reversal',
    description: 'Active milk enzyme and charcoal tan reversal for face, neck, and body.',
    features: ['Basic Face De-Tan', 'Advanced De-Tan Therapy', 'Neck Front & Back', 'Full Hand / Body De-Tan']
  },
  {
    id: 'gents-manicure-pedicure',
    name: 'Pedicure & Manicure',
    category: 'spa',
    categoryLabel: 'Gents Atelier',
    duration: 45,
    durationLabel: '45 mins',
    price: 500,
    startingPrice: 500,
    gender: 'gents',
    tagline: 'Classic & Spa Grooming for Hands & Feet',
    description: 'Exfoliating foot soak, cuticle refinement, callous removal, and tension-release massage.',
    features: ['Classic Manicure', 'Classic Pedicure', 'Spa Pedicure', 'Advanced Foot Care Ritual']
  },
  {
    id: 'gents-groom-packages',
    name: 'Groom Makeover & Packages',
    category: 'groom',
    categoryLabel: 'Gents Atelier',
    duration: 120,
    durationLabel: '120-180 mins',
    price: 4500,
    startingPrice: 4500,
    gender: 'gents',
    tagline: 'Royal Pre-Grooming Transformations',
    description: 'Comprehensive wedding rituals with miracle facial, tan removal, hair spa, and artisanal beard architecture.',
    features: ['Pre-Grooming Basic Package', 'Pre-Grooming Premium Package', 'Groom HD Make Up', 'VIP Dressing Suite']
  },

  // Ladies Headings
  {
    id: 'ladies-cut-styling',
    name: 'Hair Cut / Styling',
    category: 'hair',
    categoryLabel: 'Ladies Atelier',
    duration: 45,
    durationLabel: '40-50 mins',
    price: 300,
    startingPrice: 300,
    gender: 'ladies',
    tagline: 'Layer, Bob, Pixie Cuts & Thermal Blowouts',
    description: 'Couture face-sculpting cuts, bangs, volume blowouts, tongs, and bridal updos.',
    features: ['Layer Cut / Advanced Layer', 'Long Bob / Bob Cut', 'Wash & Blow Dry', 'Bridal Updo & Styling']
  },
  {
    id: 'ladies-hair-spa',
    name: 'Hair Spa / Treatment',
    category: 'hair',
    categoryLabel: 'Ladies Atelier',
    duration: 60,
    durationLabel: '60 mins',
    price: 1000,
    startingPrice: 1000,
    gender: 'ladies',
    tagline: 'Hydrating Masques & Scalp Restoration',
    description: 'Intense steam nourishment, scalp scrub exfoliation, anti-dandruff care, and head & shoulder massage.',
    features: ['Hair Spa (Basic)', 'Hair Spa (Advanced)', 'Premium Nourishing Spa', 'Advanced Scalp Restoration']
  },
  {
    id: 'ladies-hair-texture',
    name: 'Hair Texture',
    category: 'hair',
    categoryLabel: 'Ladies Atelier',
    duration: 120,
    durationLabel: '120-180 mins',
    price: 2500,
    startingPrice: 2500,
    gender: 'ladies',
    tagline: 'Keratin, Brazilian Botox & Nano Plastia',
    description: 'Permanent & semi-permanent smoothing systems delivering mirror glass shine and zero humidity frizz.',
    features: ['Keratin Smoothing Treatment', 'Brazilian Botox Therapy', 'Nano Plastia System', 'Silk Glaze Realignment']
  },
  {
    id: 'ladies-hair-color',
    name: 'Hair Color',
    category: 'hair',
    categoryLabel: 'Ladies Atelier',
    duration: 90,
    durationLabel: '90-150 mins',
    price: 799,
    startingPrice: 799,
    gender: 'ladies',
    tagline: 'Balayage, Ombre, Highlights & Global Fashion',
    description: 'Freehand artisan balayage, high-definition foil highlights, and ammonia-free global shades.',
    features: ['Root Touch-up', 'Global Ammonia-Free Color', 'French Balayage', 'Full Head Highlights']
  },
  {
    id: 'ladies-skin-care',
    name: 'Skin Care',
    category: 'skin',
    categoryLabel: 'Ladies Atelier',
    duration: 60,
    durationLabel: '60 mins',
    price: 500,
    startingPrice: 500,
    gender: 'ladies',
    tagline: 'HydraFacial, 24K Gold & Bridal Glow',
    description: 'Clinical skin rejuvenation, vortex blackhead extraction, brightening cocktails, and firming masks.',
    features: ['Peel & Mask / Clean Up', 'Signature X Glow', 'Bridal Radiance Facial', 'HydraFacial MD Rejuvenation']
  },
  {
    id: 'ladies-tan-removal',
    name: 'Tan Removal & Waxing',
    category: 'skin',
    categoryLabel: 'Ladies Atelier',
    duration: 45,
    durationLabel: '30-60 mins',
    price: 400,
    startingPrice: 400,
    gender: 'ladies',
    tagline: 'Face & Body De-Tan, Gentle Botanical Waxing',
    description: 'Instant sun tan reversal and hygienic full body silk waxing for silky smooth radiance.',
    features: ['Face De-Tan & Bleach', 'Full Hand / Leg De-Tan', 'Full Arms & Legs Waxing', 'Hygienic Full Body Waxing']
  },
  {
    id: 'ladies-nails-pedicure',
    name: 'Nails, Pedicure & Manicure',
    category: 'spa',
    categoryLabel: 'Ladies Atelier',
    duration: 60,
    durationLabel: '45-60 mins',
    price: 500,
    startingPrice: 500,
    gender: 'ladies',
    tagline: 'Acrylic Extensions, Gel Polish & Spa Pedicures',
    description: 'Artistic extensions, high-gloss gel colours, dead sea salt foot soaks, and soothing nail rituals.',
    features: ['Gel Polish (10 Fingers)', 'Acrylic Nail Extensions', 'Spa Manicure Ritual', 'Luxury Spa Pedicure']
  },
  {
    id: 'ladies-bridal-packages',
    name: 'Pre-Bridal Packages',
    category: 'bridal',
    categoryLabel: 'Ladies Atelier',
    duration: 180,
    durationLabel: '180-240 mins',
    price: 6000,
    startingPrice: 6000,
    gender: 'ladies',
    tagline: 'Signature VIP Bridal Sanctuary Suites',
    description: 'All-inclusive pre-wedding bridal pampering: facial, full body waxing & de-tan, spa pedicure, manicure, and hair spa.',
    features: ['Pre-Bridal Basic Package', 'Pre-Bridal Premium Package', 'Private Suite Access', 'Full Body Transformation']
  }
];

// Curated Signature Menu Services for the Showcase Menu
export const SERVICES: ServiceItem[] = [
  // Gents Signature Menu Items
  {
    id: 'gents-service-1',
    category: 'hair',
    categoryLabel: 'Hair Cut / Styling',
    name: 'Hair Cut (Adults) & Beard Styling',
    tagline: 'Precision Barber Architecture',
    duration: 35,
    durationLabel: '35 mins',
    price: 250,
    startingPrice: 250,
    featured: true,
    isFeatured: true,
    badge: 'Popular',
    gender: 'gents',
    description: 'Consultation, head anatomy mapping, skin/drop fade or scissor work, organic clarifying hair wash, and hot towel beard sculpting.',
    features: ['Hair Cut (Adults)', 'Beard Styling', 'Hot Towel Razor Shave', 'Kids Hair Cut']
  },
  {
    id: 'gents-service-2',
    category: 'hair',
    categoryLabel: 'Hair Spa / Treatment',
    name: 'Advanced Dandruff Treatment & Hair Spa',
    tagline: 'Deep Follicle Clarification & Relief',
    duration: 45,
    durationLabel: '45 mins',
    price: 1000,
    startingPrice: 1000,
    badge: 'Therapy',
    gender: 'gents',
    description: 'Targeted anti-dandruff scalp scrub, active botanical exfoliation, ozone steam bath, and tension-release neck massage.',
    features: ['Advanced Hair Spa', 'Dandruff Treatment', 'Spa with Dandruff Treatment', 'Premium Hair Spa']
  },
  {
    id: 'gents-service-3',
    category: 'hair',
    categoryLabel: 'Hair Texture',
    name: 'Hair Texture (Botox / Keratin / Smoothening)',
    tagline: 'Discipline, Shine & Frizz Elimination',
    duration: 90,
    durationLabel: '90 mins',
    price: 3000,
    startingPrice: 3000,
    gender: 'gents',
    tagline_alt: 'Formaldehyde-Free Systems',
    description: 'Targeted volume reduction, protein cuticle repair, and long-lasting frizz smoothing maintaining masculine flow.',
    features: ['Smoothening System', 'Botox Treatment', 'Keratin Silk Infusion', 'Nano Plastia']
  },
  {
    id: 'gents-service-4',
    category: 'hair',
    categoryLabel: 'Hair Color',
    name: 'Global Color (INOA) & Grey Blending',
    tagline: 'Ammonia-Free Natural Toning',
    duration: 45,
    durationLabel: '45 mins',
    price: 850,
    startingPrice: 850,
    gender: 'gents',
    description: 'Ammonia-free luxury color with natural matte finish and beard tone harmonization without brassiness.',
    features: ['Global (INOA) Ammonia Free', 'Highlights Per Streak', 'Henna Color Therapy', 'Beard Grey Camouflage']
  },
  {
    id: 'gents-service-5',
    category: 'skin',
    categoryLabel: 'Skin Care',
    name: 'Signature X Glow & Hydra Facial',
    tagline: 'Vortex Deep Cleansing & Polish',
    duration: 60,
    durationLabel: '60 mins',
    price: 2650,
    startingPrice: 2650,
    featured: true,
    badge: 'Skin Clinic',
    gender: 'gents',
    description: 'Vortex pore extraction, activated dead skin peel, pure oxygen mist, and high-potency antioxidant serum infusion.',
    features: ['Signature X Glow', 'Hydra Facial Rejuvenation', '24K Gold Facial', 'Deep Clean Up']
  },
  {
    id: 'gents-service-6',
    category: 'groom',
    categoryLabel: 'Groom Makeover',
    name: 'The Maharaja Pre-Grooming Executive Package',
    tagline: 'Complete Head-to-Toe Wedding Transformation',
    duration: 120,
    durationLabel: '120 mins',
    price: 4500,
    startingPrice: 4500,
    featured: true,
    badge: 'Gentlemen',
    gender: 'gents',
    description: 'Whitening skin miracle facial, face & neck de-tan, basic hair spa, signature haircut, and artisanal beard sculpting.',
    features: ['Skin Miracle Facial', 'Face & Neck De-Tan', 'Basic Hair Spa & Cut', 'Artisanal Beard Architecture']
  },

  // Ladies Signature Menu Items
  {
    id: 'ladies-service-1',
    category: 'hair',
    categoryLabel: 'Hair Cut / Styling',
    name: 'Advanced Layer Cut & Wash Blowout',
    tagline: 'Face-Sculpting Movement Cut',
    duration: 45,
    durationLabel: '45 mins',
    price: 900,
    startingPrice: 900,
    featured: true,
    isFeatured: true,
    badge: 'Signature',
    gender: 'ladies',
    description: 'Bespoke consultation, clarifying botanical hair wash, movement texture sculpting, and runway thermal blowout finish.',
    features: ['Advanced Layer Cut', 'Bob / Long Bob Cut', 'Wash & Blow Dry', 'Bridal Updo & Styling']
  },
  {
    id: 'ladies-service-2',
    category: 'hair',
    categoryLabel: 'Hair Color',
    name: 'Artisanal Dimensional Balayage & Ombre',
    tagline: 'Seamless Sun-Kissed Blend',
    duration: 150,
    durationLabel: '2.5 hrs',
    price: 4499,
    startingPrice: 4499,
    featured: true,
    badge: 'Trending',
    gender: 'ladies',
    description: 'Freehand artisan hair painting tailored to skin undertones with bond-builder protection and luxury gloss toner seal.',
    features: ['Balayage Suite', 'Colour Melting Ombre', 'Full Head Highlights', 'Global Fashion Color']
  },
  {
    id: 'ladies-service-3',
    category: 'hair',
    categoryLabel: 'Hair Texture',
    name: 'Keratin Treatment & Brazilian Botox',
    tagline: 'Frizz-Free High Gloss Therapy',
    duration: 120,
    durationLabel: '2 hrs',
    price: 6000,
    startingPrice: 6000,
    featured: true,
    badge: 'Bestseller',
    gender: 'ladies',
    description: 'Formaldehyde-free intensive keratin protein infusion restoring damaged cuticles with brilliant mirror-like gloss and smooth manageable texture.',
    features: ['Keratin Treatment', 'Brazilian Botox Therapy', 'Nano Plastia System', 'Silk Glaze Smoothening']
  },
  {
    id: 'ladies-service-4',
    category: 'hair',
    categoryLabel: 'Hair Spa / Treatment',
    name: 'Advanced Hair Spa & Scalp Therapy',
    tagline: 'Deep Moisture & Dandruff Restoration',
    duration: 60,
    durationLabel: '60 mins',
    price: 1500,
    startingPrice: 1500,
    gender: 'ladies',
    description: 'Hydrating deep-conditioning hair masque, steam infusion, scalp exfoliation, and tension-release head & shoulder massage.',
    features: ['Hair Spa (Advanced)', 'Premium Nourishing Spa', 'Dandruff Scalp Therapy', 'Head & Shoulder Massage']
  },
  {
    id: 'ladies-service-5',
    category: 'skin',
    categoryLabel: 'Skin Care',
    name: 'Medical HydraFacial MD & Signature Glow',
    tagline: 'Vortex Deep Cleansing & Plumping',
    duration: 60,
    durationLabel: '60 mins',
    price: 5000,
    startingPrice: 5000,
    featured: true,
    badge: 'Skin Clinic',
    gender: 'ladies',
    description: 'Patented 4-step vortex technology: deep exfoliation, gentle vacuum suction for blackheads, hyaluronic hydration bathe, and LED phototherapy.',
    features: ['HydraFacial MD Rejuvenation', 'Signature X Glow', '24K Gold Facial', 'Bridal Radiance Facial']
  },
  {
    id: 'ladies-service-6',
    category: 'spa',
    categoryLabel: 'Nails & Pedicure',
    name: 'Acrylic Nail Extensions & Gel Polish Suite',
    tagline: 'Custom Nail Art & Spa Pedicure',
    duration: 60,
    durationLabel: '60 mins',
    price: 3000,
    startingPrice: 3000,
    gender: 'ladies',
    description: 'Acrylic nail extensions, long-lasting high-gloss gel polish, cuticle therapy, dead sea salt foot soak, and reflexology.',
    features: ['Acrylic Extensions with Gel', 'Gel Polish (10 Fingers)', 'Luxury Spa Pedicure', 'Spa Manicure Ritual']
  },
  {
    id: 'ladies-service-7',
    category: 'bridal',
    categoryLabel: 'Pre-Bridal Packages',
    name: 'Royal Muhurtham Pre-Bridal Luxury Package',
    tagline: 'Private VIP Bridal Suite Sanctuary',
    duration: 180,
    durationLabel: '3 hrs',
    price: 6000,
    startingPrice: 6000,
    featured: true,
    badge: 'Exclusive Bridal',
    gender: 'ladies',
    description: 'Whitening skin miracle facial, full body waxing, face & body de-tan, classic pedicure, manicure, and basic hair spa in our private bridal suite.',
    features: ['Pre-Bridal Basic Package', 'Pre-Bridal Premium Package', 'Full Body Waxing & De-Tan', 'Private VIP Suite Access']
  }
];

export const REELS: ReelItem[] = [
  {
    id: 'reel-1',
    title: 'Signature Keratin Silk Infusion & Mirror Gloss',
    tag: '@stylex.signature.salon.tirur',
    views: '38.4k views',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WFuMHYWlxC3RMgx8F_NlOfakvGdJXwptrApfhozV-9cMtF253R3OTTgeHOxW7gV67e3czvdTmHn5MQt4cP3enYjY3rqmrdm_KpnpZSFcW37nWMh7RdW1W6bqdS4MFVh8ahyAGGLLgcDgajIsPL1tdAMTLmxLcaF4Ohp8jAXO5yMzXoO_R5f9oNYP4L7R-TRMT8ZhuFN_Vo2dtu3fYTbNkqgITUqT5hsiQZRDFwovPd3VewMvqDD9WSluZD',
    audioTrack: 'StyleX Atelier Ambient Soundscape',
    stylistHandle: 'Senior Stylist • Tirur',
    category: 'Hair Artistry',
    description: 'Frizz-free mirror shine therapy delivered at our Tirur flagship styling station.'
  },
  {
    id: 'reel-2',
    title: 'Moroccan Argan Scalp Spa & Ozone Mist',
    tag: 'Deep Scalp Wellness',
    views: '29.1k views',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WUsLrN6rrb7JVBsgZE9sXx_FRbdIaLuX-DI9HT8ljezhICMVTBx_oQnUXciTgWQi26piRw-EubqjlG7WFNCszmxLDi5YsbZFfunHYxbR-Ak36pIIChV-Dp7k3vxsfSLGlV1FutUJB0acQrRGuZUG86dmaiGtEVSBKw9QLuqbUgowq3-dmsngXy99mHkESEL-860dXX132Jr0GAI34BLTPnioHmmFDaoPCSuMjZA4Tk1958jBmG_uoWWjw',
    audioTrack: 'Serene Sanctuary Rain & Mist',
    stylistHandle: 'Trichology Specialist',
    category: 'Scalp Ritual',
    description: 'Therapeutic organic argan oil infusion with soothing acupressure head massage.'
  },
  {
    id: 'reel-3',
    title: 'Couture Precision Cut & Velvet Blowout',
    tag: 'Tirur Flagship',
    views: '45.2k views',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XVbc9Bzp69rsOp8b2K0EXyCd81fPV8Gqc0VLSsajN_t7wUJdDtks74DkpEV0hjc2S52BuOsK_jzxx2P9P6CbR2HOrhXmTXnQylrmkv8L4VUTHKyBIYjEAiLbW_c5TRkbGDvVXjfiJ1ZrWqy16CUqxNdB7pfumWX0S3CLgEBsAO5H9tZfC_bF4SAuFIoP5NlE1NZsqYP1ELAP-JDRP9E3mctbNrk5UsVFIVpqXjWLJLuNq2tI-pG1xTPDhc',
    audioTrack: 'Signature Luxe Beats',
    stylistHandle: 'Creative Director',
    category: 'Precision Cut',
    description: 'Architectural layers tailored to facial structure with flawless lightweight bounce.'
  },
  {
    id: 'reel-4',
    title: 'French Balayage & Honey Caramel Dimension',
    tag: 'Color Atelier',
    views: '51.8k views',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBi2NQZI8Ox9PgosQJUe7V6vnlutLlVFiKtwF3ph_kYIHMif1V2SSLMQOZR5STQC7LVxoMjneYFd5Gsf-p_iOdL6LntlR6aRyON66dszLchgZqeGAB8i7Qa5095MzssXj54SzBeF087q8YRECvWMSW8cCTSQqYyAZRmpHk-qDyjVT6LACqQ92gCVuF9AnM7Y8AKJfgro-SJcz94_F_gZdq_OJotFzAaXoeJ0r3ryhD6M-wtmpJefYW3Q',
    audioTrack: 'Warm Acoustic Harmony',
    stylistHandle: 'Master Colorist',
    category: 'Balayage & Color',
    description: 'Freehand sun-kissed painting protected by Olaplex bond repair for lasting radiance.'
  },
  {
    id: 'reel-5',
    title: 'VIP Bridal Suite Hairdo & Saree Draping',
    tag: 'Bridal Sanctuary',
    views: '62.0k views',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVTa1LSxCFaQ3uRRwVDiXjXe-7AHtHBABYSiKlwI87uuib9OPr6cXSEsstXBJwRXyg9iE6dk0ih4j_JmlwRek32R2E5fx3jvloESsl5-V8jUSyzC_uRttx5h7vlnbxr-1IgDEyEocWJtqvhRIaJ3MWm_5Rs-NGD2liOkajzyJiHzc4f0b6bOXaAZeoo6lQRUrrAjgE9Gr6mafqB4ALY-iSbPNw0BKTF0UHueUXhHw-z8AMLCzmMwwLdQ',
    audioTrack: 'Traditional Royal Melodies',
    stylistHandle: 'Bridal Artisan Team',
    category: 'Bridal Atelier',
    description: 'Complete high-definition waterproof bridal look and precision silk saree draping in our private suite.'
  },
  {
    id: 'reel-6',
    title: 'Medical HydraFacial MD & Glow Reveal',
    tag: 'Skin Clinic',
    views: '33.9k views',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WFuMHYWlxC3RMgx8F_NlOfakvGdJXwptrApfhozV-9cMtF253R3OTTgeHOxW7gV67e3czvdTmHn5MQt4cP3enYjY3rqmrdm_KpnpZSFcW37nWMh7RdW1W6bqdS4MFVh8ahyAGGLLgcDgajIsPL1tdAMTLmxLcaF4Ohp8jAXO5yMzXoO_R5f9oNYP4L7R-TRMT8ZhuFN_Vo2dtu3fYTbNkqgITUqT5hsiQZRDFwovPd3VewMvqDD9WSluZD',
    audioTrack: 'Deep Serenity Waves',
    stylistHandle: 'Aesthetic Skin Lead',
    category: 'Advanced Skin',
    description: '4-step vortex deep cleanse with hyaluronic plumping and instant porcelain clarity.'
  }
];

export const PORTFOLIO_WORKS = [
  {
    id: 'port-1',
    title: 'Honey Caramel Dimensional Balayage',
    category: 'Hair Artistry',
    artisan: 'Senior Color Director',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UL46Nokb_3g440zJVm3ujYD8Jxr_VtZAZ_PcjmmdXEglpx6Py_gT5HokSqorYP4hMgCeF_l5skEWyVtBtWHiBiT_0L9uhA_oRkc6VSptLllVXkTZfKlJdoSSlfsKmCjNj5POMAYKJ7J0izpc86mtuCRNtMJFMXRC1W-4fOGiMPhFNOBS9BcqSF5S-1F7L5B24eT8zUjknxpMtlnqac-36i6Y_xH4MOY2o9FaLs25wU17RfeuYq3F7LrsBL'
  },
  {
    id: 'port-2',
    title: 'Sculptured Modern Texture Bob',
    category: 'Precision Cut',
    artisan: 'Master Stylist',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1X7w-Suy073o1_3Iid1bmpZ5kvPOjwopM5gwF5NR0NmejMQLK20Lc25lZKb0ac1-hxejOTNZO1t4hfhLnKTJGF1tO4-Gav8tdxNLEsgoBsK_BQAPewiU415XePk9CxK-eXorFdr924q7VM7T8yle_0-HJQBHemS3kcMMohIcpOsnVVdjVhsez_ttCH4YM7HKrwgiTkQohDQjm7gy1D6vBNMNsvhU8VwvL7J4LyY8DBK6GPtW8I3089q6YO7'
  },
  {
    id: 'port-3',
    title: 'Keratin Gloss & Cuticle Realignment',
    category: 'Smoothing Therapy',
    artisan: 'Texture Specialist',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1VHqMLaPkCB2ok709TdSRuzYEyv1i6cyzyr5HYD0GCSGYJw3Lt5VXGoYa928cd-DK35rF--xMeMdbNzCVGR7oWcPWsgnlYjZqL-FuwkzOSM0g3UcXbykjBovLrrflE1dQpG5Ni6BWfHflQJw2cXE6LBpgyEV9ToztIke_LhTVIDtbvlYPgdsl_ygiznJJ0A6Z8t1WVZPZ_ecmDfGvYQKCRcjd9FK3vQf9_HY_qMJJgkVBB0FGePagh_qjw'
  },
  {
    id: 'port-4',
    title: 'Royal Bridal Muhurtham Styling',
    category: 'Bridal Atelier',
    artisan: 'Lead Bridal Artisan',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WBtFG-0bwyDXOgHDTU6BaZjhMuf_lxWATRUztXXm4P8nCrfI-LGM7eh4DPe1_LQ4XD4dxhO7sVnvsYmb9mDh6kA4O0Uv-lMx5-jnWGFy-dBkAFH73dnfz1ldidAPLLGR3u-Gy02fz_v37n2lOcKXM8ntCmVp1TWOv9NC08y3naXBp_O3B8JdjCJkPgDTrId9m-sz0k6Dpuv30Q7wu_Qb9gm1iKrXkWnP20rNTYlBJ-fV_NL-Kc9YbISVOr'
  },
  {
    id: 'port-5',
    title: 'Groom Executive Beard & Hair Sculpt',
    category: 'Gentlemen Styling',
    artisan: 'Executive Groom Master',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqJl4D-dVIDw4nJwn1oFECP2c2oQPpO7BqWpi-_pniKgfQNP5o5eaMO-tZ2A8JIKavh1PqXKVTcEOa4GLMU2tJjEU0y2v4KNzSke6NX_VRiESPWr8C15p9wOa-dR9czWP1yxIYp_qSXzjbdRds_ySGudzyUWzqNWON81w17KGYNUjDE92D0t6Pmmwgk9ro3H76jzrVut-DYYM9QZIYrhPIq4_ZXBqajpytsANI7ckaaL2QUwSOQ1Leaw'
  }
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Fathima R.',
    initials: 'FR',
    role: 'Tirur Resident',
    rating: 5.0,
    quote: 'Finally a world-class luxury salon right in Tirur! The Keratin Silk treatment and hair spa were sensational. The ambiance at One Arcade is truly opulent.',
    highlightText: 'Frizz-Free Silk Smoothness',
    tag: 'Verified Guest',
    artisan: 'Senior Stylist',
    category: 'hair'
  },
  {
    id: 'rev-2',
    author: 'Dr. Rahul Menon',
    initials: 'RM',
    role: 'Medical Professional',
    rating: 5.0,
    quote: 'The HydraFacial MD and Moroccan Scalp Spa are top-notch. Cleanliness, private consultation suites, and the fact that they stay open until 1:00 AM is a game changer.',
    highlightText: 'Deep Scalp Detox & Glow',
    tag: 'Regular Guest',
    artisan: 'Skin Specialist',
    category: 'skin'
  },
  {
    id: 'rev-3',
    author: 'Anjali Nair',
    initials: 'AN',
    role: 'Bridal Guest',
    rating: 5.0,
    quote: 'Booked my wedding reception makeup and hair styling here. The VIP Bridal Suite made me and my family feel like royalty. Flawless HD makeup that lasted all night.',
    highlightText: 'Flawless HD Airbrush',
    tag: 'VIP Bridal',
    artisan: 'Lead Bridal Artisan',
    category: 'bridal'
  }
];

export const MASTER_ARTISANS: MasterArtisan[] = [
  // Gents Stylists & Grooming Leads
  {
    id: 'artisan-gents-lead',
    name: "Master Barber & Men's Grooming Lead",
    role: "Men's Grooming Director",
    experience: "11+ Years Men's Atelier",
    specialty: 'Fade Architecture, Beard Sculpting & Texturizing',
    bio: 'Renowned for razor-sharp fades, classic pompadours, and bespoke beard alignment tailored to masculine jawline structure.',
    gender: 'gents'
  },
  {
    id: 'artisan-gents-stylist',
    name: "Senior Men's Stylist & Colorist",
    role: "Senior Men's Specialist",
    experience: "8+ Years Men's Haircare",
    specialty: 'Precision Scissor Cuts, Grey Blending & Scalp Therapy',
    bio: 'Specialist in natural matte grey camouflage, curly hair texturizing, and anti-hairfall scalp therapies.',
    gender: 'gents'
  },
  // Ladies Stylists & Bridal Leads
  {
    id: 'artisan-director',
    name: 'Master Stylist & Creative Director',
    role: 'Creative Director',
    experience: '12+ Years Haute Coiffure',
    specialty: 'Precision Layering, French Balayage & Keratin',
    bio: 'Trained in premier international academies. Specializes in tailored face-sculpting haircuts and seamless multidimensional hair color.',
    gender: 'ladies'
  },
  {
    id: 'artisan-color',
    name: 'Senior Hair Artisan',
    role: 'Senior Hair Specialist',
    experience: '8+ Years Texture & Smoothing',
    specialty: 'Hair Botox, Cysteine & Gloss Treatments',
    bio: 'Expert in frizz-free cuticle repair and rejuvenating thermal smoothing treatments.',
    gender: 'ladies'
  },
  {
    id: 'artisan-bridal',
    name: 'Executive Bridal Artist',
    role: 'Bridal Atelier Lead',
    experience: '10+ Years Wedding Artistry',
    specialty: 'HD Airbrush Makeup & Couture Saree Architecture',
    bio: 'Specialist in bespoke wedding looks, couture hairstyles, and precision draping in our private VIP suites.',
    gender: 'ladies'
  },
  // Unisex Advanced Aesthetician
  {
    id: 'artisan-skin',
    name: 'Lead Aesthetician',
    role: 'Advanced Skin Specialist',
    experience: '9+ Years Clinical Aesthetics',
    specialty: 'HydraFacial MD & Deep Cleansing Rituals',
    bio: 'Certified in clinical vortex exfoliation, meso-glow infusions, and customized botanical skin therapies.',
    gender: 'both'
  }
];

