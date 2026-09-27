import { Router } from 'express';
import { ServiceController } from '../controllers/serviceController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public
router.get('/', ServiceController.listServices);
router.get('/:id', ServiceController.getServiceById);

// Admin protected
router.post('/', authenticateToken, ServiceController.createService);
router.put('/:id', authenticateToken, ServiceController.updateService);
router.delete('/:id', authenticateToken, ServiceController.deleteService);

export default router;
