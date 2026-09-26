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
    title: 'Pre-Bridal Packages & Bridal Makeover',
    subtitle: 'Private VIP Bridal Suite Session with HD Bridal Styling',
    tag: 'Bridal Packages',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XVbc9Bzp69rsOp8b2K0EXyCd81fPV8Gqc0VLSsajN_t7wUJdDtks74DkpEV0hjc2S52BuOsK_jzxx2P9P6CbR2HOrhXmTXnQylrmkv8L4VUTHKyBIYjEAiLbW_c5TRkbGDvVXjfiJ1ZrWqy16CUqxNdB7pfumWX0S3CLgEBsAO5H9tZfC_bF4SAuFIoP5NlE1NZsqYP1ELAP-JDRP9E3mctbNrk5UsVFIVpqXjWLJLuNq2tI-pG1xTPDhc',
    offerText: 'Includes bridal facial, hair spa, full body waxing, pedicure, manicure & threading',
    primaryService: 'Pre-Bridal Package',
    primaryPrice: 'Complimentary Consultation',
    secondaryService: 'Bridal Updo & Styling',
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
    categoryLabel: 'Gents',
    duration: 35,
    durationLabel: '30-40 mins',
    price: 250,
    startingPrice: 250,
    gender: 'gents',
    tagline: 'Hair Cut, Beard Styling & Shaving',
    description: 'Hair cut, beard styling, beard shaving & trim, and premium hot towel shaving.',
    features: ['Hair Cut (Adults)', 'Kids Hair Cut', 'Beard Styling', 'Beard Shaving / Trim', 'Premium Shaving Hot Towel', 'Head/Shoulder (Hot Oil)', 'Head/Shoulder (Cool Oil)']
  },
  {
    id: 'gents-hair-spa',
    name: 'Hair Spa / Treatment',
    category: 'hair',
    categoryLabel: 'Gents',
    duration: 45,
    durationLabel: '45 mins',
    price: 700,
    startingPrice: 700,
    gender: 'gents',
    tagline: 'Hair Spa & Dandruff Treatment',
    description: 'Basic & advanced hair spa, dandruff treatments, and L\'Oreal hair spa.',
    features: ['Basic Hair Spa', 'Advanced Hair Spa', 'Premium Hair Spa', 'L\'Oreal Hair Spa', 'Dandruff Treatment', 'Advanced Dandruff Treatment', 'Dandruff Treatment with Hair Spa']
  },
  {
    id: 'gents-hair-texture',
    name: 'Hair Texture',
    category: 'hair',
    categoryLabel: 'Gents',
    duration: 90,
    durationLabel: '90 mins',
    price: 3000,
    startingPrice: 3000,
    gender: 'gents',
    tagline: 'Smoothening, Botox & Keratin',
    description: 'Professional smoothening, botox, keratin, and nano plastia treatments.',
    features: ['Smoothening', 'Botox', 'Keratin', 'Nano Plastia']
  },
  {
    id: 'gents-hair-color',
    name: 'Hair Color',
    category: 'hair',
    categoryLabel: 'Gents',
    duration: 60,
    durationLabel: '45-60 mins',
    price: 400,
    startingPrice: 400,
    gender: 'gents',
    tagline: 'Global INOA, Majirel & Highlights',
    description: 'Ammonia-free INOA, Majirel, basic colouring, highlights per streak, and henna.',
    features: ['Global (INOA) – Ammonia Free', 'Global (Majirel)', 'Basic Colouring', 'Highlights (Per Streak)', 'Henna (Normal)', 'Henna (Black)', 'Pre Lightening', 'Crazy Colours']
  },
  {
    id: 'gents-skin-care',
    name: 'Skin Care',
    category: 'skin',
    categoryLabel: 'Gents',
    duration: 60,
    durationLabel: '45-60 mins',
    price: 500,
    startingPrice: 500,
    gender: 'gents',
    tagline: 'Clean Up, Facials & Hydra Facial',
    description: 'Clean up, peel & mask, fruit facial, 24K gold facial, signature X glow, and hydra facial.',
    features: ['Hydra Facial', 'Hydra Korean', 'Signature X Glow', '24K Gold Facial', 'Pearl Facial', 'Fruit Facial', 'Clean Up Advance', 'Clean Up', 'Peel & Mask']
  },
  {
    id: 'gents-detan',
    name: 'De-Tan',
    category: 'skin',
    categoryLabel: 'Gents',
    duration: 30,
    durationLabel: '30 mins',
    price: 400,
    startingPrice: 400,
    gender: 'gents',
    tagline: 'Basic & Advanced De-Tan',
    description: 'De-tan treatments for face, neck front & back, full hand, underarms, and full leg.',
    features: ['Basic De-Tan', 'Advanced De-Tan', 'Neck Front & Back', 'Full Hand', 'Underarms', 'Full Back', 'Full Leg']
  },
  {
    id: 'gents-manicure-pedicure',
    name: 'Pedicure & Manicure',
    category: 'spa',
    categoryLabel: 'Gents',
    duration: 45,
    durationLabel: '45 mins',
    price: 500,
    startingPrice: 500,
    gender: 'gents',
    tagline: 'Classic, Spa & Advanced',
    description: 'Classic, spa, and advanced treatments for hands and feet.',
    features: ['Classic Manicure', 'Spa Manicure', 'Advanced Manicure', 'Classic Pedicure', 'Spa Pedicure', 'Advanced Pedicure']
  },
  {
    id: 'gents-groom-packages',
    name: 'Pre-Grooming Packages',
    category: 'groom',
    categoryLabel: 'Gents',
    duration: 120,
    durationLabel: '120-180 mins',
    price: 4500,
    startingPrice: 4500,
    gender: 'gents',
    tagline: 'Basic & Premium Grooming Packages',
    description: 'Comprehensive wedding grooming packages including facial, de-tan, hair spa, haircut, and beard styling.',
    features: ['Basic Package', 'Premium Package', 'Groom Make Up', 'Whitening Skin Miracle Facial', 'Groom Facial', 'Basic Hair Setting', 'Advanced Hair Setting', 'Advanced Pedicure + Manicure']
  },

  // Ladies Headings
  {
    id: 'ladies-cut-styling',
    name: 'Hair Cut / Styling',
    category: 'hair',
    categoryLabel: 'Ladies',
    duration: 45,
    durationLabel: '40-50 mins',
    price: 300,
    startingPrice: 300,
    gender: 'ladies',
    tagline: 'Layer Cut, Bob & Styling',
    description: 'Layer cuts, bob cuts, wash & blow dry, ironing, tongs, and bridal updo.',
    features: ['Advanced Layer Cut', 'Layer Cut', 'Bob Cut', 'Long Bob', 'Pixie Cut', 'Cut & Bangs', 'Basic Hair Cut (S.U.V)', 'Wash & Blow Dry (Advanced)', 'Ironing', 'Bridal Updo']
  },
  {
    id: 'ladies-hair-spa',
    name: 'Hair Spa Treatment',
    category: 'hair',
    categoryLabel: 'Ladies',
    duration: 60,
    durationLabel: '60 mins',
    price: 1000,
    startingPrice: 1000,
    gender: 'ladies',
    tagline: 'Hair Spa & Scalp Scrub',
    description: 'Basic, advanced, and premium hair spa treatments, dandruff treatment, and scalp scrub.',
    features: ['Hair Spa (Advanced)', 'Hair Spa (Basic)', 'Premium Spa', 'Dandruff Treatment (Advanced)', 'Scalp Scrub Only', 'Head & Shoulder (Hot/Cool/Oil Massage)']
  },
  {
    id: 'ladies-hair-texture',
    name: 'Hair Treatment',
    category: 'hair',
    categoryLabel: 'Ladies',
    duration: 120,
    durationLabel: '120-180 mins',
    price: 2500,
    startingPrice: 2500,
    gender: 'ladies',
    tagline: 'Smoothening, Keratin & Botox',
    description: 'Smoothening, keratin treatment, nano plastia, and Brazilian botox.',
    features: ['Keratin Treatment', 'Brazilian Botox', 'Brazilian Botox (Ear to Ear)', 'M K Botox', 'Nano Plastia', 'Smoothening', 'Smoothening - Root Touch-up']
  },
  {
    id: 'ladies-hair-color',
    name: 'Hair Color & Colouring',
    category: 'hair',
    categoryLabel: 'Ladies',
    duration: 90,
    durationLabel: '90-150 mins',
    price: 799,
    startingPrice: 799,
    gender: 'ladies',
    tagline: 'Balayage, Highlights & Global Color',
    description: 'Root touch-up, global color, highlights, balayage, and ombre colour melting.',
    features: ['Balayage', 'Colour Melting - Ombre', 'Full Head Highlights', 'Half Head Highlights', 'Global Fashion Color', 'Global (Without Ammonia)', 'Root Touch-up - Full Head', 'Root Touch-up - Ear to Ear', 'Henna Application']
  },
  {
    id: 'ladies-skin-care',
    name: 'Skin Care',
    category: 'skin',
    categoryLabel: 'Ladies',
    duration: 60,
    durationLabel: '60 mins',
    price: 500,
    startingPrice: 500,
    gender: 'ladies',
    tagline: 'Clean Up, Facials & Hydra Facial',
    description: 'Clean up, peel & mask, fruit facial, 24K gold facial, bridal facial, and hydra facial.',
    features: ['Hydra Facial', 'Hydra Korean', 'Signature X Glow', '24K Gold Facial', 'Bridal Facial', 'Pearl Facial', 'Fruit Facial', 'Skin Glow', 'Clean Up Advance', 'Peel & Mask']
  },
  {
    id: 'ladies-tan-removal',
    name: 'Tan Removal & Waxing',
    category: 'skin',
    categoryLabel: 'Ladies',
    duration: 45,
    durationLabel: '30-60 mins',
    price: 400,
    startingPrice: 400,
    gender: 'ladies',
    tagline: 'Face & Body De-Tan, Waxing',
    description: 'Face de-tan, bleach, body de-tan, and waxing services.',
    features: ['Face De-Tan', 'Face Bleach', 'Neck (Front & Back)', 'Full Hand De-Tan', 'Full Leg De-Tan', 'Full Arms Waxing', 'Full Legs Waxing', 'Full Body Waxing']
  },
  {
    id: 'ladies-nails-pedicure',
    name: 'Nails, Manicure & Pedicure',
    category: 'spa',
    categoryLabel: 'Ladies',
    duration: 60,
    durationLabel: '45-60 mins',
    price: 500,
    startingPrice: 500,
    gender: 'ladies',
    tagline: 'Extensions, Gel Polish, Manicure & Pedicure',
    description: 'Gel nail polish, acrylic nail extensions, nail art, and spa manicure & pedicure.',
    features: ['Acrylic Nail Extensions with Gel Polish', 'Nail Extensions - with Gel Polish', 'Gel Nail Polish - 10 finger', 'France Gel Nail Polish - 10 finger', 'Cat Eyes - Gel Polish', 'Nail Art', 'Spa Pedicure', 'Spa Manicure']
  },
  {
    id: 'ladies-bridal-packages',
    name: 'Pre-Bridal Packages',
    category: 'bridal',
    categoryLabel: 'Ladies',
    duration: 180,
    durationLabel: '180-240 mins',
    price: 6000,
    startingPrice: 6000,
    gender: 'ladies',
    tagline: 'Basic & Premium Bridal Packages',
    description: 'All-inclusive pre-wedding bridal pampering: facial, full body waxing, de-tan, pedicure, manicure, and hair spa.',
    features: ['Basic Package', 'Premium Package', 'Bridal Facial with De Tan', 'Whitening Skin Miracle', 'Full Body Waxing', 'Full Arms & Legs Waxing', 'Advanced Pedicure and Manicure', 'Hair Spa (Advanced)', 'Threading']
  }
];

// Curated Signature Menu Services for the Showcase Menu
export const SERVICES: ServiceItem[] = [
  // Gents Signature Menu Items
  {
    id: 'gents-service-1',
    category: 'hair',
    categoryLabel: 'Hair Cut / Styling',
    name: 'Hair Cut & Beard Styling',
    tagline: 'Hair Cut, Beard Styling & Shaving',
    duration: 35,
    durationLabel: '35 mins',
    price: 250,
    startingPrice: 250,
    featured: true,
    isFeatured: true,
    badge: 'Popular',
    gender: 'gents',
    description: 'Professional haircuts for adults and kids, precision beard styling, beard shaving/trim, and premium hot towel shaving.',
    features: ['Hair Cut (Adults)', 'Kids Hair Cut', 'Beard Styling', 'Beard Shaving / Trim', 'Premium Shaving Hot Towel', 'Head/Shoulder (Hot Oil)', 'Head/Shoulder (Cool Oil)']
  },
  {
    id: 'gents-service-2',
    category: 'hair',
    categoryLabel: 'Hair Spa / Treatment',
    name: 'Hair Spa & Dandruff Treatment',
    tagline: 'Deep Scalp Care & Treatment',
    duration: 45,
    durationLabel: '45 mins',
    price: 1000,
    startingPrice: 1000,
    badge: 'Therapy',
    gender: 'gents',
    description: 'Targeted anti-dandruff treatment, basic & advanced hair spa, and L\'Oreal hair spa for complete scalp wellness.',
    features: ['Basic Hair Spa', 'Advanced Hair Spa', 'Premium Hair Spa', 'L\'Oreal Hair Spa', 'Dandruff Treatment', 'Advanced Dandruff Treatment', 'Dandruff Treatment with Hair Spa', 'Advanced Dandruff Treatment with Hair Spa']
  },
  {
    id: 'gents-service-3',
    category: 'hair',
    categoryLabel: 'Hair Texture',
    name: 'Hair Texture (Botox / Keratin / Smoothening)',
    tagline: 'Smoothening, Botox, Keratin & Nano Plastia',
    duration: 90,
    durationLabel: '90 mins',
    price: 3000,
    startingPrice: 3000,
    gender: 'gents',
    description: 'Professional texture treatments including smoothening, botox, keratin, and nano plastia.',
    features: ['Smoothening', 'Botox', 'Keratin', 'Nano Plastia']
  },
  {
    id: 'gents-service-4',
    category: 'hair',
    categoryLabel: 'Hair Color',
    name: 'Hair Color & Highlights',
    tagline: 'Ammonia-Free INOA, Majirel & Highlights',
    duration: 45,
    durationLabel: '45 mins',
    price: 850,
    startingPrice: 850,
    gender: 'gents',
    description: 'Global INOA ammonia-free coloring, Majirel, basic colouring, streaks highlights, and natural henna.',
    features: ['Global (INOA) – Ammonia Free', 'Global (Majirel)', 'Basic Colouring', 'Highlights (Per Streak)', 'Henna (Normal)', 'Henna (Black)', 'Pre Lightening', 'Crazy Colours']
  },
  {
    id: 'gents-service-5',
    category: 'skin',
    categoryLabel: 'Skin Care',
    name: 'Signature X Glow & Hydra Facial',
    tagline: 'Facials & Rejuvenating Care',
    duration: 60,
    durationLabel: '60 mins',
    price: 2650,
    startingPrice: 2650,
    featured: true,
    badge: 'Skin Clinic',
    gender: 'gents',
    description: 'Deep cleansing facials, signature X glow, hydra facial, 24K gold facial, clean up advance, and fruit facial.',
    features: ['Hydra Facial', 'Hydra Korean', 'Signature X Glow', '24K Gold Facial', 'Pearl Facial', 'Fruit Facial', 'Skin Glow', 'Clean Up Advance', 'Clean Up', 'Peel & Mask']
  },
  {
    id: 'gents-service-6',
    category: 'groom',
    categoryLabel: 'Pre-Grooming Packages',
    name: 'Pre-Grooming Packages',
    tagline: 'Basic & Premium Grooming Packages',
    duration: 120,
    durationLabel: '120 mins',
    price: 4500,
    startingPrice: 4500,
    featured: true,
    badge: 'Groom',
    gender: 'gents',
    description: 'Complete pre-grooming rituals including Whitening Skin Miracle Facial, Groom Facial, Face & Neck De-Tan, Hair Spa, Hair Cut, and Beard Styling.',
    features: ['Basic Package', 'Premium Package', 'Groom Make Up', 'Whitening Skin Miracle Facial', 'Groom Facial', 'Basic Hair Setting', 'Advanced Hair Setting', 'Face & Neck De-Tan', 'Advanced Pedicure + Manicure']
  },

  // Ladies Signature Menu Items
  {
    id: 'ladies-service-1',
    category: 'hair',
    categoryLabel: 'Hair Cut / Styling',
    name: 'Hair Cut & Styling',
    tagline: 'Layer Cut, Bob & Styling',
    duration: 45,
    durationLabel: '45 mins',
    price: 900,
    startingPrice: 900,
    featured: true,
    isFeatured: true,
    badge: 'Signature',
    gender: 'ladies',
    description: 'Precision haircut and styling tailored to your look, with wash & blow dry, bob cuts, layer cuts, and bridal updo.',
    features: ['Advanced Layer Cut', 'Layer Cut', 'Bob Cut', 'Long Bob', 'Pixie Cut', 'Cut & Bangs', 'Basic Hair Cut (S.U.V)', 'Wash & Blow Dry (Advanced)', 'Ironing', 'Tongs', 'Bridal Updo']
  },
  {
    id: 'ladies-service-2',
    category: 'hair',
    categoryLabel: 'Colouring',
    name: 'Balayage & Hair Colouring',
    tagline: 'Balayage, Ombre & Highlights',
    duration: 150,
    durationLabel: '2.5 hrs',
    price: 4499,
    startingPrice: 4499,
    featured: true,
    badge: 'Trending',
    gender: 'ladies',
    description: 'Artistic balayage, ombre colour melting, full head highlights, global fashion color, and root touch-up.',
    features: ['Balayage', 'Colour Melting - Ombre', 'Full Head Highlights', 'Half Head Highlights', 'Global Fashion Color', 'Global (Without Ammonia)', 'Root Touch-up - Full Head', 'Root Touch-up - Ear to Ear', 'Henna Application']
  },
  {
    id: 'ladies-service-3',
    category: 'hair',
    categoryLabel: 'Hair Treatment',
    name: 'Keratin Treatment & Brazilian Botox',
    tagline: 'Keratin, Botox & Smoothening',
    duration: 120,
    durationLabel: '2 hrs',
    price: 6000,
    startingPrice: 6000,
    featured: true,
    badge: 'Bestseller',
    gender: 'ladies',
    description: 'Intensive keratin treatment, Brazilian botox, smoothening, and nano plastia restoring hair health and shine.',
    features: ['Keratin Treatment', 'Brazilian Botox', 'Brazilian Botox (Ear to Ear)', 'M K Botox', 'Nano Plastia', 'Smoothening', 'Smoothening - Root Touch-up', 'Soothening']
  },
  {
    id: 'ladies-service-4',
    category: 'hair',
    categoryLabel: 'Hair Spa Treatment',
    name: 'Hair Spa Treatment & Dandruff Care',
    tagline: 'Nourishing Spa & Scalp Therapy',
    duration: 60,
    durationLabel: '60 mins',
    price: 1500,
    startingPrice: 1500,
    gender: 'ladies',
    description: 'Hydrating hair spa (basic & advanced), premium spa, dandruff treatment (advanced), and scalp scrub.',
    features: ['Hair Spa (Advanced)', 'Hair Spa (Basic)', 'Premium Spa', 'Dandruff Treatment (Advanced)', 'Scalp Scrub Only', 'Head & Shoulder (Hot/Cool/Oil Massage)']
  },
  {
    id: 'ladies-service-5',
    category: 'skin',
    categoryLabel: 'Skin Care',
    name: 'Signature X Glow & Hydra Facial',
    tagline: 'Facials & Rejuvenating Care',
    duration: 60,
    durationLabel: '60 mins',
    price: 5000,
    startingPrice: 5000,
    featured: true,
    badge: 'Skin Clinic',
    gender: 'ladies',
    description: 'Hydra facial deep cleansing, 24K gold facial, bridal facial, signature X glow, and clean up advance.',
    features: ['Hydra Facial', 'Hydra Korean', 'Signature X Glow', '24K Gold Facial', 'Bridal Facial', 'Pearl Facial', 'Fruit Facial', 'Skin Glow', 'Clean Up Advance', 'Peel & Mask']
  },
  {
    id: 'ladies-service-6',
    category: 'spa',
    categoryLabel: 'Nails, Manicure & Pedicure',
    name: 'Nails & Pedicure / Manicure',
    tagline: 'Nail Extensions, Gel Polish & Spa Care',
    duration: 60,
    durationLabel: '60 mins',
    price: 3000,
    startingPrice: 3000,
    gender: 'ladies',
    description: 'Acrylic nail extensions with gel polish, 10-finger gel polish, nail art, and spa pedicure & manicure.',
    features: ['Acrylic Nail Extensions with Gel Polish', 'Nail Extensions - with Gel Polish', 'Gel Nail Polish - 10 finger', 'France Gel Nail Polish - 10 finger', 'Cat Eyes - Gel Polish', 'Nail Art', 'Spa Pedicure', 'Spa Manicure']
  },
  {
    id: 'ladies-service-7',
    category: 'bridal',
    categoryLabel: 'Pre-Bridal Packages',
    name: 'Pre-Bridal Packages',
    tagline: 'Basic & Premium Bridal Packages',
    duration: 180,
    durationLabel: '3 hrs',
    price: 6000,
    startingPrice: 6000,
    featured: true,
    badge: 'Bridal',
    gender: 'ladies',
    description: 'All-inclusive pre-wedding bridal packages: Bridal Facial with De Tan, Full Body Waxing, Advanced Pedicure and Manicure, Full Leg & Hand De Tan, and Hair Spa.',
    features: ['Basic Package', 'Premium Package', 'Bridal Facial with De Tan', 'Whitening Skin Miracle', 'Full Body Waxing', 'Full Arms & Legs Waxing', 'Advanced Pedicure and Manicure', 'Hair Spa (Advanced)', 'Threading']
  }
];

export const REELS: ReelItem[] = [
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
    videoUrl: '/videos/reels/Smoothening.mp4'
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
    videoUrl: '/videos/reels/Bridal.mp4'
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
    videoUrl: '/videos/reels/Kids.mp4'
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
    videoUrl: '/videos/reels/coloring.mp4'
  }
];

export const PORTFOLIO_WORKS = [
  {
    id: 'port-1',
    title: 'Hair Smoothening & Gloss Transformation',
    category: 'Smoothening',
    artisan: 'Texture Specialist',
    imageUrl: '/images/photos/smoothening.jpg'
  },
  {
    id: 'port-2',
    title: 'Bridal Makeover & Styling',
    category: 'Bridal Makeover',
    artisan: 'Lead Bridal Stylist',
    imageUrl: '/images/photos/bridal.jpg'
  },
  {
    id: 'port-3',
    title: 'Kids Hair Cut & Makeover',
    category: 'Kids Hair Cut',
    artisan: 'Styling Specialist',
    imageUrl: '/images/photos/kids.jpg'
  },
  {
    id: 'port-4',
    title: 'Hair Coloring & Highlights',
    category: 'Hair Coloring',
    artisan: 'Color Specialist',
    imageUrl: '/images/photos/coloring.jpg'
  },
  {
    id: 'port-5',
    title: 'Layered Cut & Blowout Styling',
    category: 'Hair Styling',
    artisan: 'Senior Hair Stylist',
    imageUrl: '/images/photos/5.jpg'
  }
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-google-1',
    author: 'Athira P',
    initials: 'AP',
    role: 'Google Review',
    rating: 5.0,
    quote: 'The service was excellent, and the parlour had a pleasant atmosphere. The staff were friendly, polite, and professional. Special thanks to Niya for providing such wonderful service and making me feel comfortable and confident. She is very professional and smart. Highly recommending! I’m very happy with the results and the overall experience. This is definitely one of the best beauty parlours I’ve visited, and I will certainly return!',
    highlightText: 'Pleasant Atmosphere & Attentive Service',
    tag: 'Google Review',
    artisan: 'Niya',
    category: 'cut'
  },
  {
    id: 'rev-google-2',
    author: 'Ruby Khan',
    initials: 'RK',
    role: 'Google Review',
    rating: 5.0,
    quote: 'Sunita was great, she is so hardworking and her work is so good! I am very satisfied—great pedicure and hair spa was so relaxing, eyebrow also.',
    highlightText: 'Relaxing Hair Spa & Pedicure',
    tag: 'Google Review',
    artisan: 'Sunita',
    category: 'spa'
  },
  {
    id: 'rev-google-3',
    author: 'Shalima Shamsudeen',
    initials: 'SS',
    role: 'Local Guide',
    rating: 5.0,
    quote: 'Awesome experience at StyleX! The staffs are warm and welcoming. Abhirami, Niya, and Neha are the best.',
    highlightText: 'Warm & Welcoming Hospitality',
    tag: 'Local Guide',
    artisan: 'Abhirami, Niya & Neha',
    category: 'cut'
  },
  {
    id: 'rev-google-4',
    author: 'Benazir TP',
    initials: 'BT',
    role: 'Google Review',
    rating: 5.0,
    quote: 'I had a wonderful experience at Salon Style X. The service provided by Abhirami was excellent, and Vismaya did a great job with my manicure and pedicure. Both were very professional, attentive, and made the experience really pleasant. Highly recommended!',
    highlightText: 'Professional Manicure & Pedicure',
    tag: 'Google Review',
    artisan: 'Abhirami & Vismaya',
    category: 'spa'
  },
  {
    id: 'rev-google-5',
    author: 'Hiba Rafeeque',
    initials: 'HR',
    role: 'Google Review',
    rating: 5.0,
    quote: 'Had a really great experience at this salon! The service was excellent, the staff were very friendly and professional, and I absolutely loved the final result. Everything was done with great care and attention to detail, and also worth the price for all services. A really heartfelt thanks especially to Abhirami—she is sweet and her hospitality is amazing! Thank you for your services.',
    highlightText: 'Attention to Detail & Great Value',
    tag: 'Google Review',
    artisan: 'Abhirami',
    category: 'cut'
  },
  {
    id: 'rev-google-6',
    author: 'Afna Fathima',
    initials: 'AF',
    role: 'Google Review',
    rating: 5.0,
    quote: 'Abhirami was my manager, and the service was amazing. My hairdresser was Saneesh and he was incredible.',
    highlightText: 'Incredible Hairdressing & Manager Care',
    tag: 'Google Review',
    artisan: 'Abhirami & Saneesh',
    category: 'cut'
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

