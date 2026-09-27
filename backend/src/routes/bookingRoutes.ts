import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public endpoints
router.get('/slots', BookingController.getAvailableSlots);
router.post('/', BookingController.createBooking);

// Protected Admin endpoints
router.get('/', authenticateToken, BookingController.listBookings);
router.patch('/:id/status', authenticateToken, BookingController.updateBookingStatus);
router.post('/:id/resend-whatsapp', authenticateToken, BookingController.resendWhatsApp);

export default router;
