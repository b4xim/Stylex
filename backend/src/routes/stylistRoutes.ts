import { Router } from 'express';
import { StylistController } from '../controllers/stylistController';
import { optionalAuthenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', StylistController.listStylists);
router.post('/', optionalAuthenticateToken, StylistController.createStylist);
router.put('/:id', optionalAuthenticateToken, StylistController.updateStylist);
router.delete('/:id', optionalAuthenticateToken, StylistController.deleteStylist);

export default router;
