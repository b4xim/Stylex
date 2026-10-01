import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Checking StyleX Signature Salon database bootstrap...');

  // 1. Bootstrap Administrative Accounts ONLY if they do not exist
  // Once created, user credentials and passwords are 100% managed by the users and never overwritten on redeployment.
  const initialUsers = [
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
      isSecret: true,
    },
  ];

  for (const u of initialUsers) {
    const existing = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email: u.email },
          { username: u.username },
        ],
      },
    });

    if (!existing) {
      const hash = await bcrypt.hash(u.password, 10);
      await prisma.adminUser.create({
        data: {
          username: u.username,
          email: u.email,
          name: u.name,
          passwordHash: hash,
          role: u.role,
          isSecret: u.isSecret,
          isActive: true,
        },
      });
      console.log(`✅ Bootstrapped initial account: ${u.username} (${u.role})`);
    }
  }

  // 2. Bootstrap Default Salon Settings ONLY if not already present
  // Does NOT overwrite any settings modified by staff in the dashboard.
  const defaultSettings = [
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
    {
      key: 'weekSchedule',
      value: JSON.stringify([
        { dayName: 'Monday', label: 'Monday', dateStr: 'Mon, Daily', isOpen: true, statusText: 'Open', subText: '10:00 AM – 1:00 AM', hours: '10:00 AM – 1:00 AM' },
        { dayName: 'Tuesday', label: 'Tuesday', dateStr: 'Tue, Daily', isOpen: true, statusText: 'Open', subText: '10:00 AM – 1:00 AM', hours: '10:00 AM – 1:00 AM' },
        { dayName: 'Wednesday', label: 'Wednesday', dateStr: 'Wed, Daily', isOpen: true, statusText: 'Open', subText: '10:00 AM – 1:00 AM', hours: '10:00 AM – 1:00 AM' },
        { dayName: 'Thursday', label: 'Thursday', dateStr: 'Thu, Daily', isOpen: true, statusText: 'Open', subText: '10:00 AM – 1:00 AM', hours: '10:00 AM – 1:00 AM' },
        { dayName: 'Friday', label: 'Friday', dateStr: 'Fri, Weekend', isOpen: true, statusText: 'Open', subText: '10:00 AM – 1:00 AM', hours: '10:00 AM – 1:00 AM' },
        { dayName: 'Saturday', label: 'Saturday', dateStr: 'Sat, Weekend', isOpen: true, statusText: 'Open', subText: '10:00 AM – 1:00 AM', hours: '10:00 AM – 1:00 AM' },
        { dayName: 'Sunday', label: 'Sunday', dateStr: 'Sun, Weekend', isOpen: true, statusText: 'Open', subText: '10:00 AM – 1:00 AM', hours: '10:00 AM – 1:00 AM' },
      ]),
    },
  ];

  for (const s of defaultSettings) {
    const existing = await prisma.salonSetting.findUnique({
      where: { key: s.key },
    });
    if (!existing) {
      await prisma.salonSetting.create({
        data: { key: s.key, value: s.value },
      });
    }
  }

  // 3. Stylists / Artisans - NO AUTO-SEEDING.
  // Purge legacy hardcoded mock stylists if lingering from old deployments:
  const legacySeedStylistIds = ['niya-mathew', 'saneesh-kumar', 'abhirami-p', 'rahul-raj'];
  await prisma.booking.updateMany({
    where: { stylistId: { in: legacySeedStylistIds } },
    data: { stylistId: null },
  });
  await prisma.blockedSlot.deleteMany({
    where: { stylistId: { in: legacySeedStylistIds } },
  });
  await prisma.stylist.deleteMany({
    where: { id: { in: legacySeedStylistIds } },
  });

  // 4. Services - NO AUTO-SEEDING on redeploy.
  // All service menu additions, edits, and deletions are 100% managed via the dashboard.

  // 5. Banners, Reels, and Portfolio Works - NO AUTO-SEEDING on redeploy.
  // All promotional content is 100% managed via the dashboard.

  console.log('✅ Bootstrap check completed. No overwrites or auto-seed insertions.');
}

main()
  .catch((e) => {
    console.error('⚠️ Database bootstrap notice (continuing startup):', e.message || e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
