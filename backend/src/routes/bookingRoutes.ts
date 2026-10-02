import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { optionalAuthenticateToken } from '../middleware/auth';

const router = Router();

// Public & Client Self-Service endpoints
router.get('/slots', BookingController.getAvailableSlots);
router.post('/', BookingController.createBooking);
router.get('/manage/:token', BookingController.getBookingByToken);
router.post('/lookup', BookingController.lookupBookingsByPhone);
router.patch('/manage/:token/reschedule', BookingController.rescheduleBooking);
router.patch('/manage/:token/cancel', BookingController.cancelBooking);

// Dashboard endpoints (resilient auth)
router.get('/', optionalAuthenticateToken, BookingController.listBookings);
router.patch('/:id/status', optionalAuthenticateToken, BookingController.updateBookingStatus);
router.delete('/:id', optionalAuthenticateToken, BookingController.deleteBooking);
router.post('/:id/resend-whatsapp', optionalAuthenticateToken, BookingController.resendWhatsApp);

export default router;
