import { Router } from 'express';
import { StylistController } from '../controllers/stylistController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', StylistController.listStylists);
router.post('/', authenticateToken, StylistController.createStylist);
router.put('/:id', authenticateToken, StylistController.updateStylist);
router.delete('/:id', authenticateToken, StylistController.deleteStylist);

export default router;
