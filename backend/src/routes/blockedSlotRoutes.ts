import { Router } from 'express';
import { BlockedSlotController } from '../controllers/blockedSlotController';
import { optionalAuthenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', BlockedSlotController.listBlockedSlots);
router.post('/', optionalAuthenticateToken, BlockedSlotController.blockSlot);
router.delete('/:id', optionalAuthenticateToken, BlockedSlotController.unblockSlot);

export default router;
