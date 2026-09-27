import { Router } from 'express';
import { SettingController } from '../controllers/settingController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', SettingController.getSettings);
router.get('/whatsapp-qr', SettingController.getWhatsAppQr);
router.put('/', authenticateToken, SettingController.updateSettings);

export default router;
