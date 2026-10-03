import { Router } from 'express';
import authRoutes from './authRoutes';
import bookingRoutes from './bookingRoutes';
import serviceRoutes from './serviceRoutes';
import stylistRoutes from './stylistRoutes';
import blockedSlotRoutes from './blockedSlotRoutes';
import promotionRoutes from './promotionRoutes';
import customerRoutes from './customerRoutes';
import settingRoutes from './settingRoutes';
import uploadRoutes from './uploadRoutes';
import inquiryRoutes from './inquiryRoutes';
import notificationRoutes from './notificationRoutes';
import analyticsRoutes from './analyticsRoutes';

const router = Router();

// Health Check
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'StyleX Flagship Salon API',
    timestamp: new Date().toISOString(),
  });
});

// Mounted sub-routers
router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/services', serviceRoutes);
router.use('/stylists', stylistRoutes);
router.use('/blocked-slots', blockedSlotRoutes);
router.use('/promotions', promotionRoutes);
router.use('/customers', customerRoutes);
router.use('/settings', settingRoutes);
router.use('/upload', uploadRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
