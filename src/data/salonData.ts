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
    offerText: 'Hair Spa ₹599 (was ₹1,000) • Anti-Dandruff Treatment ₹999 (was ₹2,000)',
    primaryService: 'Hair Spa Intensive',
    primaryPrice: '₹599',
    secondaryService: 'Anti Dandruff Treatment',
    secondaryPrice: '₹999',
  },
  {
    id: 'promo-2',
    title: 'French Balayage & Master Color Suite',
    subtitle: 'Artisan Freehand Dimension with Olaplex Bond Protection',
    tag: 'Color Curation',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBi2NQZI8Ox9PgosQJUe7V6vnlutLlVFiKtwF3ph_kYIHMif1V2SSLMQOZR5STQC7LVxoMjneYFd5Gsf-p_iOdL6LntlR6aRyON66dszLchgZqeGAB8i7Qa5095MzssXj54SzBeF087q8YRECvWMSW8cCTSQqYyAZRmpHk-qDyjVT6LACqQ92gCVuF9AnM7Y8AKJfgro-SJcz94_F_gZdq_OJotFzAaXoeJ0r3ryhD6M-wtmpJefYW3Q',
    offerText: 'Special Atelier Price starting at ₹5,999 • Includes Gloss Toner & Thermal Blowout',
    primaryService: 'Balayage & Glaze Suite',
    primaryPrice: '₹5,999',
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
    primaryPrice: '₹16,999',
    secondaryService: 'VIP Suite Access',
    secondaryPrice: 'Included',
  }
];

export const SERVICES: ServiceItem[] = [
  // Gents Exclusive Services
  {
    id: 'gents-cut-1',
    category: 'hair',
    categoryLabel: 'Gents Hair & Grooming',
    name: 'Master Fade & Precision Styling',
    tagline: 'Tailored Facial Architecture Cut',
    duration: 35,
    durationLabel: '35 mins',
    price: 499,
    startingPrice: 499,
    featured: true,
    isFeatured: true,
    badge: 'Popular',
    gender: 'gents',
    description: 'Consultation, head anatomy mapping, skin/drop fade or scissor work, organic clarifying hair wash, and matte clay styling.',
    features: ['Head Anatomy Mapping', 'Drop/Skin Fade or Scissor Cut', 'Clarifying Wash', 'Matte Clay Finish']
  },
  {
    id: 'groom-1',
    category: 'groom',
    categoryLabel: 'Groom Atelier',
    name: 'The Maharaja Executive Groom Ritual',
    tagline: 'Master Beard, Hair, & Skin Transformation',
    duration: 90,
    durationLabel: '90 mins',
    price: 2499,
    startingPrice: 2499,
    featured: true,
    badge: 'Gentlemen',
    gender: 'gents',
    description: 'Signature hair styling, straight-razor hot towel artisanal beard sculpting, herbal face polish, eye de-puffing treatment, and shoulder massage.',
    features: ['Artisanal Haircut & Wash', 'Hot Towel Razor Beard Shave', 'Energizing Face Polish', 'Neck & Shoulder Release']
  },
  {
    id: 'gents-beard-1',
    category: 'groom',
    categoryLabel: 'Beard Atelier',
    name: 'Artisanal Beard Sculpt & Hot Towel Shave',
    tagline: 'Royal Razor Edging & Steam Nourishment',
    duration: 30,
    durationLabel: '30 mins',
    price: 399,
    startingPrice: 399,
    badge: 'Essential',
    gender: 'gents',
    description: 'Multi-step hot towel steam treatment, pre-shave botanical oils, single-blade razor line sculpting, and cold soothing compress.',
    features: ['Hot Towel Steam Compress', 'Pre-Shave Botanical Oil', 'Straight-Razor Edging', 'Aftershave Balm']
  },
  {
    id: 'gents-spa-1',
    category: 'hair',
    categoryLabel: 'Scalp Wellness',
    name: "Men's Anti-Dandruff Scalp Detox & Spa",
    tagline: 'Deep Pore Follicle Clarification',
    duration: 45,
    durationLabel: '45 mins',
    price: 899,
    startingPrice: 899,
    badge: 'Therapy',
    gender: 'gents',
    description: 'Salicylic scalp exfoliation, tea tree antifungal mask, ozone steam bath, and tension-release neck massage.',
    features: ['Scalp Follicle Exfoliation', 'Tea Tree Therapy', 'Ozone Steam', 'Acupressure Neck Massage']
  },
  {
    id: 'gents-color-1',
    category: 'hair',
    categoryLabel: 'Color & Camouflage',
    name: 'Executive Hair Color & Beard Grey Blending',
    tagline: 'Natural Subtle Youth Restoration',
    duration: 45,
    durationLabel: '45 mins',
    price: 999,
    startingPrice: 999,
    gender: 'gents',
    description: 'Ammonia-free demi-permanent color creating a natural peppered look without brassy undertones. Includes beard tone harmonization.',
    features: ['Ammonia-Free Formula', 'Natural Matte Toning', 'Beard Blend', 'Color-Seal Wash']
  },
  {
    id: 'gents-keratin-1',
    category: 'hair',
    categoryLabel: 'Texture Management',
    name: "Men's Texture Taming & Keratin Smoothening",
    tagline: 'Manageable Natural Flow',
    duration: 90,
    durationLabel: '90 mins',
    price: 2499,
    startingPrice: 2499,
    gender: 'gents',
    description: 'Targeted volume reduction and anti-frizz smoothing maintaining natural movement and style versatility.',
    features: ['Protein Cuticle Seal', 'Frizz Elimination', 'Thermal Protection', 'Long-lasting 3+ Months']
  },

  // Ladies Exclusive Services
  {
    id: 'hair-1',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    name: 'Signature Precision Cut & Runway Blowout',
    tagline: 'Face-Sculpting Editorial Cut',
    duration: 45,
    durationLabel: '45 mins',
    price: 799,
    startingPrice: 799,
    featured: true,
    isFeatured: true,
    badge: 'Signature',
    gender: 'ladies',
    description: 'Bespoke consultation, clarifying botanical hair wash, scalp acupressure massage, precision texture sculpting, and runway blowout finish.',
    features: ['Bespoke Consultation', 'Botanical Scalp Wash', 'Textured Cut', 'Thermal Blowout']
  },
  {
    id: 'hair-2',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    name: 'Keratin Silk Infusion & Cysteine Smoothing',
    tagline: 'Frizz-Free High Gloss Therapy',
    duration: 165,
    durationLabel: '2.5 - 3 hrs',
    price: 4499,
    startingPrice: 4499,
    featured: true,
    isFeatured: true,
    badge: 'Popular',
    gender: 'ladies',
    description: 'Formaldehyde-free intensive keratin protein infusion restoring damaged cuticles with brilliant mirror-like gloss and smooth manageable texture.',
    features: ['Pre-treatment Detox', 'Keratin/Cysteine Infusion', 'Cryo-Seal Ironing', 'Aftercare Guidance']
  },
  {
    id: 'hair-3',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    name: 'Hair Botox Deep Fiber Revival',
    tagline: 'Age-Reversing Moisture Restoration',
    duration: 120,
    durationLabel: '2 hrs',
    price: 3999,
    startingPrice: 3999,
    gender: 'ladies',
    description: 'Intense anti-aging hydration with caviar oil, collagen, and amino acids to plump hollow hair strands and eliminate split ends without straightening volume.',
    features: ['Collagen Reconstruction', 'Caviar Oil Serum', 'Deep Steam Infusion', 'Soft Velvet Finish']
  },
  {
    id: 'hair-4',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    name: 'French Balayage & Master Color',
    tagline: 'Dimensional Sun-Kissed Blend',
    duration: 210,
    durationLabel: '3.5 hrs',
    price: 5999,
    startingPrice: 5999,
    featured: true,
    badge: 'Couture',
    gender: 'ladies',
    description: 'Freehand artisan hair painting tailored to skin undertones with Plex bond-builder protection and luxury gloss toner.',
    features: ['Color Harmony Analysis', 'Artisan Freehand Balayage', 'Olaplex Bond Protection', 'Gloss Toner Seal']
  },
  {
    id: 'bridal-1',
    category: 'bridal',
    categoryLabel: 'Bridal Atelier',
    name: 'Royal Muhurtham & Reception Bridal Atelier',
    tagline: 'Complete Haute Couture Bridal Styling',
    duration: 270,
    durationLabel: '4 - 5 hrs',
    price: 16999,
    startingPrice: 16999,
    featured: true,
    isFeatured: true,
    badge: 'Flagship Atelier',
    gender: 'ladies',
    description: 'Comprehensive bridal journey in our private VIP Bridal Suite. High-definition waterproof makeup, artisan hairdo, saree draping, jewel setting, and personal touch-up kit.',
    features: ['HD Waterproof Airbrush Makeup', 'Couture Hair Architecture', 'Precision Saree Draping', 'VIP Private Suite Access']
  },
  {
    id: 'skin-2',
    category: 'skin',
    categoryLabel: 'Advanced Skin',
    name: '24K Royal Gold Glow Ritual',
    tagline: 'Luxury Imperial Radiance Treatment',
    duration: 75,
    durationLabel: '75 mins',
    price: 4199,
    startingPrice: 4199,
    featured: true,
    badge: 'Royal Sanctuary',
    gender: 'ladies',
    description: 'Infused with genuine 24-karat gold leaf flakes and saffron nectar to stimulate cellular collagen synthesis and impart a radiant luminous bridal glow.',
    features: ['Gold Peeling Gommage', '24K Micronized Serum', 'Cooling Gold Peel-off Mask', 'Jade Stone Sculpting']
  },
  {
    id: 'skin-3',
    category: 'skin',
    categoryLabel: 'Advanced Skin',
    name: 'Korean Glass Skin Meso-Glow',
    tagline: 'Pore-Refining Dewy Radiance',
    duration: 60,
    durationLabel: '60 mins',
    price: 3799,
    startingPrice: 3799,
    gender: 'ladies',
    description: 'Non-invasive peptide nano-needling infusing brightening botanical actives and niacinamide for that coveted translucent porcelain finish.',
    features: ['Enzyme Deep Cleanse', 'Nano-Infusion Peptides', 'Collagen Sheet Wrap', 'Dewy Finish Moisture Lock']
  },

  // Unisex Services (Available for both Gents & Ladies)
  {
    id: 'hair-5',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    name: 'Moroccan Argan Scalp Spa & Detox',
    tagline: 'Therapeutic Follicle Wellness',
    duration: 60,
    durationLabel: '60 mins',
    price: 1899,
    startingPrice: 1899,
    gender: 'both',
    description: 'Exfoliating scalp scrub, pure organic Moroccan argan oil bath, warm ozone steam, and upper-back neck tension release massage.',
    features: ['Exfoliating Scalp Scrub', 'Organic Argan Warm Pack', 'Ozone Steam', 'Stress-Relief Massage']
  },
  {
    id: 'skin-1',
    category: 'skin',
    categoryLabel: 'Advanced Skin',
    name: 'Medical-Grade HydraFacial MD',
    tagline: 'Vortex Deep Cleansing & Plumping',
    duration: 60,
    durationLabel: '60 mins',
    price: 3499,
    startingPrice: 3499,
    featured: true,
    badge: 'Bestseller',
    gender: 'both',
    description: 'Patented 4-step vortex technology: deep exfoliation, gentle vacuum suction for blackheads, hyaluronic hydration bathe, and LED phototherapy.',
    features: ['Vortex Extraction', 'GlySal Acid Peel', 'Hyaluronic Antioxidant Infusion', 'LED Light Therapy']
  },
  {
    id: 'skin-4',
    category: 'skin',
    categoryLabel: 'Advanced Skin',
    name: 'D-Tan & Charcoal Oxy-Detox',
    tagline: 'Instant Sun Damage Reversal',
    duration: 45,
    durationLabel: '45 mins',
    price: 1599,
    startingPrice: 1599,
    gender: 'both',
    description: 'Formulated to counteract tropical sun exposure: active bamboo charcoal magnetic mask, milk enzyme tan lift, and chilled rosewater splash.',
    features: ['Enzyme D-Tan Scrub', 'Activated Charcoal Peel', 'Pure Oxygen Mist', 'Vitamin C Sun Shield']
  },
  {
    id: 'spa-1',
    category: 'spa',
    categoryLabel: 'VIP Combos',
    name: 'Emerald Sanctuary Full Body Revival',
    tagline: 'Full Body Scrub, Wrap, & Reflexology',
    duration: 120,
    durationLabel: '120 mins',
    price: 5499,
    startingPrice: 5499,
    gender: 'both',
    description: 'The ultimate weekend indulgence: dead sea salt mineral polish, botanical clay envelopment, luxury reflexology, and scalp relaxation therapy.',
    features: ['Mineral Salt Polish', 'Botanical Clay Wrap', 'Foot Reflexology', 'Warm Herbal Tea Service']
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

