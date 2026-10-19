// StyleX Signature Salon - Canonical Booking Headings
// Mirrors the exact booking services catalog from the client-side booking engine (src/data/salonData.ts)

export interface BookingHeadingItem {
  id: string;
  name: string;
  category: 'hair' | 'skin' | 'spa' | 'groom' | 'bridal';
  categoryLabel: string;
  duration: number;
  durationLabel: string;
  price: number;
  startingPrice: number;
  gender: 'gents' | 'ladies';
  tagline: string;
  description: string;
  features?: string[];
}

export const BOOKING_HEADINGS: BookingHeadingItem[] = [
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

export const matchesStylistGender = (stylistGender: string | undefined, targetGender: 'gents' | 'ladies'): boolean => {
  const g = (stylistGender || 'both').toLowerCase();
  if (g === 'both' || g === 'any' || g === 'unisex') return true;
  if (targetGender === 'gents') return g === 'gents' || g === 'male';
  if (targetGender === 'ladies') return g === 'ladies' || g === 'female';
  return true;
};
