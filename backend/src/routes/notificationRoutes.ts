import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { optionalAuthenticateToken } from '../middleware/auth';

const router = Router();

// WhatsApp Gateway
router.get('/whatsapp/status', optionalAuthenticateToken, NotificationController.getWhatsAppStatus);
router.post('/whatsapp/test', optionalAuthenticateToken, NotificationController.sendWhatsAppTest);
router.post('/whatsapp/disconnect', optionalAuthenticateToken, NotificationController.disconnectWhatsApp);

// Email Gateway
router.get('/email/status', optionalAuthenticateToken, NotificationController.getEmailStatus);
router.post('/email/test', optionalAuthenticateToken, NotificationController.sendEmailTest);

export default router;
