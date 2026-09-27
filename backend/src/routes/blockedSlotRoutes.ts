import { Router } from 'express';
import { BlockedSlotController } from '../controllers/blockedSlotController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', BlockedSlotController.listBlockedSlots);
router.post('/', authenticateToken, BlockedSlotController.blockSlot);
router.delete('/:id', authenticateToken, BlockedSlotController.unblockSlot);

export default router;
