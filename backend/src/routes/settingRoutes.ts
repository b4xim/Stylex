import { Router } from 'express';
import { SettingController } from '../controllers/settingController';
import { optionalAuthenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', SettingController.getSettings);
router.get('/whatsapp-qr', SettingController.getWhatsAppQr);
router.put('/', optionalAuthenticateToken, SettingController.updateSettings);

export default router;
