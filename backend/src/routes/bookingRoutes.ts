import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { optionalAuthenticateToken } from '../middleware/auth';

const router = Router();

// Public & Dashboard endpoints
router.get('/slots', BookingController.getAvailableSlots);
router.post('/', BookingController.createBooking);

// Dashboard endpoints (resilient auth)
router.get('/', optionalAuthenticateToken, BookingController.listBookings);
router.patch('/:id/status', optionalAuthenticateToken, BookingController.updateBookingStatus);
router.delete('/:id', optionalAuthenticateToken, BookingController.deleteBooking);
router.post('/:id/resend-whatsapp', optionalAuthenticateToken, BookingController.resendWhatsApp);

export default router;
