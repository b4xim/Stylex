import { Router } from 'express';
import { ServiceController } from '../controllers/serviceController';
import { optionalAuthenticateToken } from '../middleware/auth';

const router = Router();

// Public
router.get('/', ServiceController.listServices);
router.get('/:id', ServiceController.getServiceById);

// Admin / Dashboard management
router.post('/', optionalAuthenticateToken, ServiceController.createService);
router.put('/:id', optionalAuthenticateToken, ServiceController.updateService);
router.delete('/:id', optionalAuthenticateToken, ServiceController.deleteService);

export default router;
