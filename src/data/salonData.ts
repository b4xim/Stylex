import { ServiceItem, PromoSlide, ReelItem, ReviewItem } from '../types.ts';

export const LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQray7kzbGRiOvZ36918_WO1FXVw_t3_uKVCMarsbQn0sRhHNNgyOpx0IYrIYEElwtwR6eFurt7wUhls89tXXh8eom2kmllEWQosR7IEiZgus5IbulSq5CyYEXwvJUW2YJ20VGasDQ9TiuEwCQx1rhpAr9pwEaPxN1rrQiN5zOmLEKkXfrDNFWOGcikHQ84MNg2MUyFsUXcLCCoD7qoWOTt2ix8sx2umR38nk3xxHs1-Oqk5KEaOeFGJNIkGcrnDTU96A';

export const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNgs_B92B-QkOZ0Rqa8nUGRCii9E7hnJIHyniGxaHponOpzfc741ASEPipkTKxZa9SqGddWAm6efBy9V5wVZQEgi8yOxzrYuEp5_UQnE0SijguIJwtvtIvObo_RRdKS6Jm85wZPiKo7XeLj3PxoJk_Cuvl220hn9LHXUePDjXW8wxybdTVdutgAjhp_UpBzQilncoR8Yr1KGfY8Xev-xUmeTaLZUt0cGPV1_EVpaLZ';

export const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'promo-1',
    title: 'Signature Hair Spa & Anti-Dandruff Ritual',
    subtitle: 'Seasonal Limited Privilege at StyleX Atelier',
    tag: 'Limited Time Privilege',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc52MBbTkUI1t61AB7vAKuSfCibl5IWOaC9N4kneZwjsJWo9t_GuI4xU1e3BcCOW9NMd7PVTSB3VKpOk1vaaBBw6q2VfcBvLWyxym848HfMVPHzPeQcJaOpYqFATSIXYXh3QEsMHFH90oDCA-wMC8n_pf5V_GNQ-hYHvUcyOmlNlq6FKnG3MfCfuED3Ht1NRDddWSrhud1fkq2pP0pjW-_bRUcOCJQiFvHyzLApeNZToSoo6Gg3lLpFA',
    offerText: 'Hair Spa Rs. 599 (was 1000) • Anti-Dandruff Treatment Rs. 999 (was 2000)',
    primaryService: 'Hair Spa Intensive',
    primaryPrice: 'Rs 599',
    secondaryService: 'Anti Dandruff Treatment',
    secondaryPrice: 'Rs 999',
  },
  {
    id: 'promo-2',
    title: 'Nordic Gloss Balayage & Glaze Special',
    subtitle: 'Complimentary Ozone Scalp Exfoliation with Master Colorist',
    tag: 'Color Curation',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBi2NQZI8Ox9PgosQJUe7V6vnlutLlVFiKtwF3ph_kYIHMif1V2SSLMQOZR5STQC7LVxoMjneYFd5Gsf-p_iOdL6LntlR6aRyON66dszLchgZqeGAB8i7Qa5095MzssXj54SzBeF087q8YRECvWMSW8cCTSQqYyAZRmpHk-qDyjVT6LACqQ92gCVuF9AnM7Y8AKJfgro-SJcz94_F_gZdq_OJotFzAaXoeJ0r3ryhD6M-wtmpJefYW3Q',
    offerText: 'Save 20% on any full-dimension French Balayage & Botanical Olaplex infusion',
    primaryService: 'Balayage & Glaze Suite',
    primaryPrice: '$280',
    secondaryService: 'Ozone Treatment',
    secondaryPrice: 'Complimentary',
  },
  {
    id: 'promo-3',
    title: 'Bridal & Red Carpet Architectural Styling',
    subtitle: 'Private Champagne Suite & Trial Session Inclusion',
    tag: 'Exclusive Privilege',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XVbc9Bzp69rsOp8b2K0EXyCd81fPV8Gqc0VLSsajN_t7wUJdDtks74DkpEV0hjc2S52BuOsK_jzxx2P9P6CbR2HOrhXmTXnQylrmkv8L4VUTHKyBIYjEAiLbW_c5TRkbGDvVXjfiJ1ZrWqy16CUqxNdB7pfumWX0S3CLgEBsAO5H9tZfC_bF4SAuFIoP5NlE1NZsqYP1ELAP-JDRP9E3mctbNrk5UsVFIVpqXjWLJLuNq2tI-pG1xTPDhc',
    offerText: 'Includes silhouette trial, luxury veil fitting & bridal party concierge pass',
    primaryService: 'Couture Bridal Session',
    primaryPrice: '$320',
    secondaryService: 'Trial Session',
    secondaryPrice: 'Included',
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'couture-haircut',
    name: 'Couture Haircut',
    category: 'cut',
    categoryLabel: 'Architectural Cut',
    duration: 75,
    durationLabel: '75 min',
    price: 180,
    description: 'Precision architectural hair sculpture customized for individual bone structure, texture flow, and effortless movement.',
    features: ['Scalp diagnosis & botanical hydro-rinse', 'Custom bone-structure framing dry-cut', 'Velvet thermal texture blowout finish']
  },
  {
    id: 'nordic-balayage',
    name: 'Nordic Gloss Balayage & Tonal Glaze',
    category: 'color',
    categoryLabel: 'Bespoke Color',
    duration: 120,
    durationLabel: '120 min',
    price: 340,
    description: 'Hand-painted French balayage blending custom ash, honey, or mocha dimensions. Sealed with acid-balanced shine glaze.',
    features: ['Scalp barrier defense & Olaplex infusion', 'Post-color gloss tone sealer', 'Micro-fiber hydration veil']
  },
  {
    id: 'cellular-scalp-spa',
    name: 'Botanical Cellular Scalp Spa & Steam',
    category: 'spa',
    categoryLabel: 'Restorative Ritual',
    duration: 90,
    durationLabel: '90 min',
    price: 240,
    description: 'Sensory immersion featuring certified biodynamic clay exfoliation, targeted ozone micro-mist infusion, and jade comb cranial stimulation.',
    features: ['Trichological microscope diagnostics', 'Warm herbal hydro-rinse cascade', 'Ozone micro-steam & jade comb massage'],
    isFeatured: true
  },
  {
    id: 'dry-editorial-cut',
    name: 'Dry Editorial Sculpture & Blowout',
    category: 'cut',
    categoryLabel: 'Architectural Cut',
    duration: 75,
    durationLabel: '75 min',
    price: 195,
    description: 'Customized bone-structure framing dry-cut technique perfected for natural movement and effortless home maintenance.',
    features: ['Deep scalp cleansing massage', 'Velvet thermal texture finish', 'Take-home botanical maintenance ritual']
  },
  {
    id: 'silk-press-keratin',
    name: 'Couture Silk Press & Keratin Glaze',
    category: 'smoothing',
    categoryLabel: 'Botanical Smoothing',
    duration: 80,
    durationLabel: '80 min',
    price: 210,
    description: 'Ultra-sleek thermal realignment with bio-lipid protective infusion for weightless mirror shine and complete humidity immunity.',
    features: ['Heat-activated phytokeratin shield', 'Anti-frizz diamond vapor press', 'Split-end cuticle seal therapy']
  },
  {
    id: 'hd-gloss-finish',
    name: 'High-Definition Gloss & Velvet Finish',
    category: 'color',
    categoryLabel: 'Color & Gloss',
    duration: 60,
    durationLabel: '60 min',
    price: 155,
    description: 'Translucent color-refresh gloss therapy that enriches tone, seals split cuticles, and restores diamond luminosity.',
    features: ['Acidic clear or custom-tint glaze', 'Botanical shine lock infusion', 'Protective UV color shield']
  },
  {
    id: 'bespoke-bridal',
    name: 'Bespoke Bridal & Red Carpet Styling',
    category: 'styling',
    categoryLabel: 'Couture Styling',
    duration: 105,
    durationLabel: '105 min',
    price: 320,
    description: 'High-fashion architectural updo or glamorous Hollywood waves tailored with bespoke hair ornamentation consultation.',
    features: ['Trial session and silhouette mapping', 'Veil & couture accessory placement', 'Private suite & champagne hospitality']
  },
  {
    id: 'hair-spa-promo',
    name: 'Revitalizing Hair Spa Treatment',
    category: 'spa',
    categoryLabel: 'Limited Promotion',
    duration: 60,
    durationLabel: '60 min',
    price: 75,
    description: 'Intense moisture bath infused with essential argan and jojoba botanicals, designed to replenish dry cuticles and infuse elasticity.',
    features: ['Steam hydration pod immersion', 'Aromatherapeutic head & neck massage', 'Anti-breakage gloss seal']
  },
  {
    id: 'anti-dandruff-ritual',
    name: 'Therapeutic Anti-Dandruff Scalp Detox',
    category: 'spa',
    categoryLabel: 'Clinical Scalp Care',
    duration: 70,
    durationLabel: '70 min',
    price: 95,
    description: 'Targeted botanical zinc & tea-tree antimicrobial micro-peel that soothes flaking, eliminates dry irritation, and balances sebum.',
    features: ['Purifying zinc & botanical tea-tree peel', 'Ultrasonic scalp oscillation', 'Soothing calendula serum mist']
  }
];

export const REELS: ReelItem[] = [
  {
    id: 'reel-1',
    title: 'Golden Balayage & Bounce',
    tag: '@sarah_couture',
    views: '24.5k views',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WFuMHYWlxC3RMgx8F_NlOfakvGdJXwptrApfhozV-9cMtF253R3OTTgeHOxW7gV67e3czvdTmHn5MQt4cP3enYjY3rqmrdm_KpnpZSFcW37nWMh7RdW1W6bqdS4MFVh8ahyAGGLLgcDgajIsPL1tdAMTLmxLcaF4Ohp8jAXO5yMzXoO_R5f9oNYP4L7R-TRMT8ZhuFN_Vo2dtu3fYTbNkqgITUqT5hsiQZRDFwovPd3VewMvqDD9WSluZD',
    audioTrack: 'Atelier Acoustic Soundscape',
    stylistHandle: 'Artisan Elena V.',
    category: 'Color Transformation',
    description: 'Watch how soft babylights and honey balayage create luminous dimensional bounce that moves naturally under ambient lighting.'
  },
  {
    id: 'reel-2',
    title: 'Botanical Scalp Spa & Mist Ritual',
    tag: 'Deep Restoration & Head Spa',
    views: '18.2k views',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WUsLrN6rrb7JVBsgZE9sXx_FRbdIaLuX-DI9HT8ljezhICMVTBx_oQnUXciTgWQi26piRw-EubqjlG7WFNCszmxLDi5YsbZFfunHYxbR-Ak36pIIChV-Dp7k3vxsfSLGlV1FutUJB0acQrRGuZUG86dmaiGtEVSBKw9QLuqbUgowq3-dmsngXy99mHkESEL-860dXX132Jr0GAI34BLTPnioHmmFDaoPCSuMjZA4Tk1958jBmG_uoWWjw',
    audioTrack: 'Serene Rainfall & Mist',
    stylistHandle: 'Artisan Marcus T.',
    category: 'Scalp Ritual',
    description: 'Indulge in certified biodynamic clay exfoliation paired with an ozone micro-mist cascade to unclog follicular pores.'
  },
  {
    id: 'reel-3',
    title: 'Couture Velvet Blowout',
    tag: 'Silky High-Volume Finish',
    views: '31.9k views',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XVbc9Bzp69rsOp8b2K0EXyCd81fPV8Gqc0VLSsajN_t7wUJdDtks74DkpEV0hjc2S52BuOsK_jzxx2P9P6CbR2HOrhXmTXnQylrmkv8L4VUTHKyBIYjEAiLbW_c5TRkbGDvVXjfiJ1ZrWqy16CUqxNdB7pfumWX0S3CLgEBsAO5H9tZfC_bF4SAuFIoP5NlE1NZsqYP1ELAP-JDRP9E3mctbNrk5UsVFIVpqXjWLJLuNq2tI-pG1xTPDhc',
    audioTrack: 'Signature Luxe Glow',
    stylistHandle: 'Artisan Chloe S.',
    category: 'Styling',
    description: 'Weightless, humidity-shielded thermal blowout delivering runway gloss and 72-hour memory retention.'
  },
  {
    id: 'reel-4',
    title: 'Fresh Copper Gloss Balayage',
    tag: '@glossandglow_hair',
    views: '42.1k views',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBi2NQZI8Ox9PgosQJUe7V6vnlutLlVFiKtwF3ph_kYIHMif1V2SSLMQOZR5STQC7LVxoMjneYFd5Gsf-p_iOdL6LntlR6aRyON66dszLchgZqeGAB8i7Qa5095MzssXj54SzBeF087q8YRECvWMSW8cCTSQqYyAZRmpHk-qDyjVT6LACqQ92gCVuF9AnM7Y8AKJfgro-SJcz94_F_gZdq_OJotFzAaXoeJ0r3ryhD6M-wtmpJefYW3Q',
    audioTrack: 'Warm Amber Acoustic',
    stylistHandle: 'Artisan Elena V.',
    category: 'Gloss & Color',
    description: 'Vibrant autumn copper glazed with acidic shine seal for rich tone depth without hair cuticle stress.'
  },
  {
    id: 'reel-5',
    title: 'Precision Dry Sculpting & Framing',
    tag: 'Master Stylist Cut',
    views: '28.7k views',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVTa1LSxCFaQ3uRRwVDiXjXe-7AHtHBABYSiKlwI87uuib9OPr6cXSEsstXBJwRXyg9iE6dk0ih4j_JmlwRek32R2E5fx3jvloESsl5-V8jUSyzC_uRttx5h7vlnbxr-1IgDEyEocWJtqvhRIaJ3MWm_5Rs-NGD2liOkajzyJiHzc4f0b6bOXaAZeoo6lQRUrrAjgE9Gr6mafqB4ALY-iSbPNw0BKTF0UHueUXhHw-z8AMLCzmMwwLdQ',
    audioTrack: 'Atelier Studio Acoustics',
    stylistHandle: 'Master Artisan David R.',
    category: 'Architectural Cut',
    description: 'Dry shears carved along natural hair fall vectors to frame cheekbones and chin contour with zero harsh lines.'
  },
  {
    id: 'reel-6',
    title: 'Luminous Dimension & Wave',
    tag: '@luminous_sanctuary',
    views: '19.4k views',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WFuMHYWlxC3RMgx8F_NlOfakvGdJXwptrApfhozV-9cMtF253R3OTTgeHOxW7gV67e3czvdTmHn5MQt4cP3enYjY3rqmrdm_KpnpZSFcW37nWMh7RdW1W6bqdS4MFVh8ahyAGGLLgcDgajIsPL1tdAMTLmxLcaF4Ohp8jAXO5yMzXoO_R5f9oNYP4L7R-TRMT8ZhuFN_Vo2dtu3fYTbNkqgITUqT5hsiQZRDFwovPd3VewMvqDD9WSluZD',
    audioTrack: 'Salon Luxe Acoustic',
    stylistHandle: 'Artisan Sarah P.',
    category: 'Color & Waves',
    description: 'Seamless balayage transition styled into sculpted Hollywood waves with diamond luster.'
  }
];

export const PORTFOLIO_WORKS = [
  {
    id: 'port-1',
    title: 'Chestnut Bronze Dimensional Balayage',
    category: 'Color Artistry',
    artisan: 'Elena Rostova',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UL46Nokb_3g440zJVm3ujYD8Jxr_VtZAZ_PcjmmdXEglpx6Py_gT5HokSqorYP4hMgCeF_l5skEWyVtBtWHiBiT_0L9uhA_oRkc6VSptLllVXkTZfKlJdoSSlfsKmCjNj5POMAYKJ7J0izpc86mtuCRNtMJFMXRC1W-4fOGiMPhFNOBS9BcqSF5S-1F7L5B24eT8zUjknxpMtlnqac-36i6Y_xH4MOY2o9FaLs25wU17RfeuYq3F7LrsBL'
  },
  {
    id: 'port-2',
    title: 'Sculptured Parisian Modern Bob',
    category: 'Architectural Cut',
    artisan: 'Marcus Vance',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1X7w-Suy073o1_3Iid1bmpZ5kvPOjwopM5gwF5NR0NmejMQLK20Lc25lZKb0ac1-hxejOTNZO1t4hfhLnKTJGF1tO4-Gav8tdxNLEsgoBsK_BQAPewiU415XePk9CxK-eXorFdr924q7VM7T8yle_0-HJQBHemS3kcMMohIcpOsnVVdjVhsez_ttCH4YM7HKrwgiTkQohDQjm7gy1D6vBNMNsvhU8VwvL7J4LyY8DBK6GPtW8I3089q6YO7'
  },
  {
    id: 'port-3',
    title: 'Copper Spice Velvet Glaze & Fringe',
    category: 'Tone & Gloss',
    artisan: 'Chloe Solis',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1VHqMLaPkCB2ok709TdSRuzYEyv1i6cyzyr5HYD0GCSGYJw3Lt5VXGoYa928cd-DK35rF--xMeMdbNzCVGR7oWcPWsgnlYjZqL-FuwkzOSM0g3UcXbykjBovLrrflE1dQpG5Ni6BWfHflQJw2cXE6LBpgyEV9ToztIke_LhTVIDtbvlYPgdsl_ygiznJJ0A6Z8t1WVZPZ_ecmDfGvYQKCRcjd9FK3vQf9_HY_qMJJgkVBB0FGePagh_qjw'
  },
  {
    id: 'port-4',
    title: 'Editorial Ash Blonde Melt',
    category: 'High Fashion Bleach & Tone',
    artisan: 'Elena Rostova',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WBtFG-0bwyDXOgHDTU6BaZjhMuf_lxWATRUztXXm4P8nCrfI-LGM7eh4DPe1_LQ4XD4dxhO7sVnvsYmb9mDh6kA4O0Uv-lMx5-jnWGFy-dBkAFH73dnfz1ldidAPLLGR3u-Gy02fz_v37n2lOcKXM8ntCmVp1TWOv9NC08y3naXBp_O3B8JdjCJkPgDTrId9m-sz0k6Dpuv30Q7wu_Qb9gm1iKrXkWnP20rNTYlBJ-fV_NL-Kc9YbISVOr'
  },
  {
    id: 'port-5',
    title: 'Red Carpet Silk Waves & Highlights',
    category: 'Gala Editorial',
    artisan: 'David Reynolds',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqJl4D-dVIDw4nJwn1oFECP2c2oQPpO7BqWpi-_pniKgfQNP5o5eaMO-tZ2A8JIKavh1PqXKVTcEOa4GLMU2tJjEU0y2v4KNzSke6NX_VRiESPWr8C15p9wOa-dR9czWP1yxIYp_qSXzjbdRds_ySGudzyUWzqNWON81w17KGYNUjDE92D0t6Pmmwgk9ro3H76jzrVut-DYYM9QZIYrhPIq4_ZXBqajpytsANI7ckaaL2QUwSOQ1Leaw'
  }
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Camille Vance',
    initials: 'CV',
    role: 'Frequent Guest',
    rating: 5.0,
    quote: 'The bespoke French balayage revitalized my hair while keeping integrity silk-soft. The private suite allowed me to take calls serenely.',
    highlightText: '6 Mos Dimensional Tone',
    tag: 'Frequent Guest',
    artisan: 'Elena V.',
    category: 'color'
  },
  {
    id: 'rev-2',
    author: 'Dr. Julian M.',
    initials: 'JM',
    role: 'Clinical Reviewer',
    rating: 5.0,
    quote: 'As a dermatologist, I loved the Cellular Scalp Spa & micro-mist. Deeply restorative, balancing micro-circulation without stripping lipids.',
    highlightText: 'Balanced Scalp Barrier',
    tag: 'Clinical Review',
    artisan: 'Marcus T.',
    category: 'spa'
  },
  {
    id: 'rev-3',
    author: 'Sienna M.',
    initials: 'SM',
    role: 'Verified Guest',
    rating: 5.0,
    quote: 'Precision dry sculpting that actually grows out seamlessly over months. No salon rush, immaculate valet, and personalized artisan care.',
    highlightText: 'Weightless Geometric Volume',
    tag: 'Verified',
    artisan: 'Chloe S.',
    category: 'cut'
  }
];

export const MASTER_ARTISANS = [
  {
    id: 'artisan-elena',
    name: 'Elena Rostova',
    role: 'Master Color Director',
    experience: '12+ Years Haute Coiffure',
    specialty: 'Balayage & Dimensional Tone',
    bio: 'Trained at Vidal Sassoon London and L’Oréal Paris Haute Academy. Known for effortless sun-kissed dimensions that grow out seamlessly.'
  },
  {
    id: 'artisan-marcus',
    name: 'Dr. Marcus Vance',
    role: 'Head Scalp Trichologist',
    experience: '10+ Years Scalp Science',
    specialty: 'Microscopic Diagnostics & Head Spa',
    bio: 'Specializing in biodynamic restorative scalp rituals, follicular regeneration, and therapeutic ozone micro-mist treatments.'
  },
  {
    id: 'artisan-chloe',
    name: 'Chloe Solis',
    role: 'Lead Architectural Sculptor',
    experience: '9+ Years Dry Cut Mastery',
    specialty: 'Dry Precision Cutting & Editorial Flow',
    bio: 'Pioneered dry sculpting for organic texture. Tailors each silhouette to bone structure and natural lifestyle routine.'
  },
  {
    id: 'artisan-david',
    name: 'David Reynolds',
    role: 'Bridal & Gala Stylist',
    experience: '14+ Years Red Carpet Curation',
    specialty: 'Architectural Updos & Silk Waves',
    bio: 'Frequent stylist for international fashion weeks and bespoke bridal parties, with an eye for refined structural balance.'
  }
];
