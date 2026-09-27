import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting StyleX Signature Salon database seeding...');

  // 1. Seed Admin User
  // 1. Seed Accounts (Admin, Developer, and Secret Account Bladeoski)
  const usersToSeed = [
    {
      username: 'admin',
      email: 'admin@stylexsalon.in',
      name: 'Admin',
      password: 'stylex2024',
      role: 'ADMIN',
      isSecret: false,
    },
    {
      username: 'developer',
      email: 'dev@stylexsalon.in',
      name: 'Developer',
      password: 'stylexdev',
      role: 'DEVELOPER',
      isSecret: false,
    },
    {
      username: 'bladeoski',
      email: 'bladeoski@stylex.com',
      name: 'Bladeoski',
      password: process.env.BLADEOSKI_SEED_PASSWORD || 'bL4d3_89xK!mPq2',
      role: 'ADMIN',
      isSecret: true, // Must NEVER be displayed in any public or administrative listing
    },
  ];

  for (const u of usersToSeed) {
    const hash = await bcrypt.hash(u.password, 10);
    await prisma.adminUser.upsert({
      where: { email: u.email },
      update: {
        username: u.username,
        passwordHash: hash,
        role: u.role,
        isSecret: u.isSecret,
        isActive: true,
      },
      create: {
        username: u.username,
        email: u.email,
        name: u.name,
        passwordHash: hash,
        role: u.role,
        isSecret: u.isSecret,
        isActive: true,
      },
    });
    console.log(`✅ User seeded: ${u.username} (${u.role}) ${u.isSecret ? '[SECRET]' : ''}`);
  }

  // 2. Seed Salon Settings
  const settings = [
    { key: 'brandName', value: 'StyleX' },
    { key: 'subBrand', value: 'SIGNATURE SALON' },
    { key: 'flagshipLocation', value: 'TIRUR OUTLET' },
    { key: 'phoneDisplay', value: '+91 96561 11149' },
    { key: 'phoneNumberClean', value: '+919656111149' },
    { key: 'whatsappNumber', value: '919656111149' },
    { key: 'addressLine1', value: 'One Arcade, Near Lenskart' },
    { key: 'addressLine2', value: 'KG Padi Rd' },
    { key: 'city', value: 'Tirur, Malappuram, Kerala' },
    { key: 'pincode', value: '676101' },
    { key: 'hours', value: 'Open Daily: 10:00 AM – 1:00 AM' },
    { key: 'instagramHandle', value: '@stylex.signature.salon.tirur' },
    { key: 'instagramUrl', value: 'https://www.instagram.com/stylex.signature.salon.tirur/' },
    {
      key: 'whatsappQrUrl',
      value: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fwa.me%2F919656111149%3Ftext%3DHi%20StyleX%2C%20I%20would%20like%20to%20enquire%20about%20appointment%20availability.&format=png',
    },
  ];

  for (const s of settings) {
    await prisma.salonSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log(`✅ Salon settings seeded`);

  // 3. Seed Stylists / Artisans
  const stylists = [
    {
      id: 'niya-mathew',
      name: 'Niya Mathew',
      role: 'Master Hair Artisan',
      gender: 'female',
      specialty: 'French Balayage & Creative Coloring',
      bio: 'L\'Oréal Professionnel Certified color specialist with over 9 years designing signature tones for high-profile clients.',
      imageUrl: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=600',
      rating: 4.95,
      experience: '9+ Years',
      orderIndex: 1,
    },
    {
      id: 'saneesh-kumar',
      name: 'Saneesh Kumar',
      role: 'Senior Barber & Sculptor',
      gender: 'male',
      specialty: 'Precision Fades, Beard Architecture & Hot Towel Shaves',
      bio: 'Acclaimed barber master celebrated for meticulous razor detailing, custom facial hair contouring, and classic English shaves.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      rating: 4.9,
      experience: '8+ Years',
      orderIndex: 2,
    },
    {
      id: 'abhirami-p',
      name: 'Abhirami P',
      role: 'Bridal & Aesthetics Director',
      gender: 'female',
      specialty: 'Bridal Makeovers, HD Glow & Keratin Architecture',
      bio: 'Leading bridal stylist in Malappuram specializing in long-lasting bridal beauty, glass skin facials, and anti-frizz ceremonies.',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      rating: 4.98,
      experience: '11+ Years',
      orderIndex: 3,
    },
    {
      id: 'rahul-raj',
      name: 'Rahul Raj',
      role: 'Creative Stylist & Texture Specialist',
      gender: 'male',
      specialty: 'Nano Plastia, Botox & Modern Layering',
      bio: 'Expert in modern styling, hair restructuring, and scalp therapy treatments.',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
      rating: 4.88,
      experience: '7+ Years',
      orderIndex: 4,
    },
  ];

  for (const st of stylists) {
    await prisma.stylist.upsert({
      where: { id: st.id },
      update: st,
      create: st,
    });
  }
  console.log(`✅ ${stylists.length} Stylists seeded`);

  // 4. Seed Services
  const services = [
    {
      id: 'gents-haircut-style',
      name: 'Haircut & Styling',
      category: 'Hair & Styling',
      gender: 'gents',
      durationMins: 30,
      price: 180,
      originalPrice: 220,
      description: 'Precision scissor and clipper cut tailored to facial structure with styling.',
      isPopular: true,
      isTrending: true,
      orderIndex: 1,
    },
    {
      id: 'gents-beard-styling',
      name: 'Beard Design & Shave',
      category: 'Beard & Shave',
      gender: 'gents',
      durationMins: 30,
      price: 120,
      originalPrice: 150,
      description: 'Razor sharp contouring, hot towel preparation, and conditioning oils.',
      isPopular: true,
      orderIndex: 2,
    },
    {
      id: 'gents-hair-spa',
      name: 'Hair Spa Intensive',
      category: 'Hair & Styling',
      gender: 'gents',
      durationMins: 45,
      price: 600,
      originalPrice: 800,
      description: 'Deep conditioning treatment to restore moisture and shine to tired hair.',
      orderIndex: 3,
    },
    {
      id: 'gents-hydra-facial',
      name: 'Hydra Facial Korean Glow',
      category: 'Skin & Facial',
      gender: 'gents',
      durationMins: 60,
      price: 1800,
      originalPrice: 2200,
      description: 'Advanced non-invasive deep cleansing, extraction, and antioxidant hydration.',
      isTrending: true,
      orderIndex: 4,
    },
    {
      id: 'ladies-signature-cut',
      name: 'Signature Cut & Blowdry',
      category: 'Hair & Styling',
      gender: 'ladies',
      durationMins: 45,
      price: 650,
      originalPrice: 750,
      description: 'Customized consultation, precision sectioning cut, and luxury salon blowout.',
      isPopular: true,
      orderIndex: 5,
    },
    {
      id: 'ladies-french-balayage',
      name: 'French Balayage & Gloss',
      category: 'Color & Highlights',
      gender: 'ladies',
      durationMins: 150,
      price: 4500,
      originalPrice: 5500,
      description: 'Freehand dimensional contouring with ammonia-free gloss and Olaplex protection.',
      isPopular: true,
      isTrending: true,
      orderIndex: 6,
    },
    {
      id: 'ladies-keratin-therapy',
      name: 'Keratin & Botox Restructuring',
      category: 'Hair Treatments',
      gender: 'ladies',
      durationMins: 180,
      price: 4000,
      originalPrice: 4800,
      description: 'Formaldehyde-free intensive smoothing ceremony that eliminates frizz for up to 5 months.',
      orderIndex: 7,
    },
    {
      id: 'bridal-signature-package',
      name: 'Royal Bridal Signature Suite',
      category: 'Bridal & Groom Packages',
      gender: 'ladies',
      durationMins: 240,
      price: 12000,
      originalPrice: 15000,
      description: 'All-inclusive pre-wedding skin brightening, HD airbrush makeup, and hair design.',
      isPopular: true,
      orderIndex: 8,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }
  console.log(`✅ ${services.length} Services seeded`);

  // 5. Seed Carousel Banners
  const banners = [
    {
      id: 'banner-hair-spa',
      title: 'Signature Hair Spa & Anti-Dandruff Ritual',
      subtitle: 'Seasonal Limited Privilege at StyleX Tirur Flagship',
      badge: 'Limited Privilege',
      ctaText: 'Book Ritual',
      link: '#booking-engine',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc52MBbTkUI1t61AB7vAKuSfCibl5IWOaC9N4kneZwjsJWo9t_GuI4xU1e3BcCOW9NMd7PVTSB3VKpOk1vaaBBw6q2VfcBvLWyxym848HfMVPHzPeQcJaOpYqFATSIXYXh3QEsMHFH90oDCA-wMC8n_pf5V_GNQ-hYHvUcyOmlNlq6FKnG3MfCfuED3Ht1NRDddWSrhud1fkq2pP0pjW-_bRUcOCJQiFvHyzLApeNZToSoo6Gg3lLpFA',
      orderIndex: 1,
      isActive: true,
    },
    {
      id: 'banner-balayage',
      title: 'French Balayage & Master Color Suite',
      subtitle: 'Artisan Freehand Dimension with Olaplex Bond Protection',
      badge: 'Artisan Special',
      ctaText: 'Reserve Slot',
      link: '#booking-engine',
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1600',
      orderIndex: 2,
      isActive: true,
    },
  ];

  for (const b of banners) {
    await prisma.carouselBanner.upsert({
      where: { id: b.id },
      update: b,
      create: b,
    });
  }
  console.log(`✅ ${banners.length} Carousel Banners seeded`);

  // 6. Seed Reels
  const reels = [
    {
      id: 'reel-smoothening',
      title: 'Glass Hair Keratin Transformation',
      tag: 'Hair Smoothening',
      category: 'Treatment',
      imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      instagramUrl: 'https://www.instagram.com/reel/C8q7_8_xVfK/',
      audioTrack: 'StyleX Original Acoustic Ritual',
      stylistHandle: '@niya_stylex',
      description: 'Watch the complete step-by-step formaldehyde-free smoothing transformation live in our salon.',
      orderIndex: 1,
      isActive: true,
    },
    {
      id: 'reel-fade',
      title: 'Low Drop Fade & Hot Towel Shave',
      tag: 'Gents Sculpting',
      category: 'Barbering',
      imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      instagramUrl: 'https://www.instagram.com/reel/C9X192_xLpM/',
      audioTrack: 'Midnight Lo-Fi Beats',
      stylistHandle: '@saneesh_barber',
      description: 'Surgical skin taper fade finished with razor lineup and sandalwood beard nourishment.',
      orderIndex: 2,
      isActive: true,
    },
  ];

  for (const r of reels) {
    await prisma.reelItem.upsert({
      where: { id: r.id },
      update: r,
      create: r,
    });
  }
  console.log(`✅ ${reels.length} Reels seeded`);

  // 7. Seed Portfolio Transformation Photos
  const photos = [
    {
      id: 'photo-bridal',
      title: 'Traditional Muslim Bridal Elegance',
      category: 'Bridal Makeover',
      artisan: 'Abhirami P',
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
      description: 'Luminous HD makeup with gold eyeshadow contouring and traditional veil setting.',
      orderIndex: 1,
      isActive: true,
    },
    {
      id: 'photo-balayage',
      title: 'Caramel Hazelnut Balayage',
      category: 'Color & Highlights',
      artisan: 'Niya Mathew',
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
      description: 'Sun-kissed dimensional highlights with seamless transition from deep root.',
      orderIndex: 2,
      isActive: true,
    },
    {
      id: 'photo-beard',
      title: 'Royal Beard Sculpt & Fade',
      category: 'Gents Grooming',
      artisan: 'Saneesh Kumar',
      imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=800',
      description: 'Sharp razor detailing paired with medium temple fade and hot towel massage.',
      orderIndex: 3,
      isActive: true,
    },
  ];

  for (const p of photos) {
    await prisma.portfolioWork.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }
  console.log(`✅ ${photos.length} Transformation photos seeded`);

  console.log('\n🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
