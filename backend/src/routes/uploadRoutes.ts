import { Router } from 'express';
import { UploadController } from '../controllers/uploadController';
import { uploadMedia } from '../middleware/upload';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/banner', authenticateToken, uploadMedia.single('file'), UploadController.uploadFile);
router.post('/reel', authenticateToken, uploadMedia.single('file'), UploadController.uploadFile);
router.post('/photo', authenticateToken, uploadMedia.single('file'), UploadController.uploadFile);
router.post('/general', authenticateToken, uploadMedia.single('file'), UploadController.uploadFile);

export default router;
