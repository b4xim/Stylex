import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/login', AuthController.login);
router.get('/me', authenticateToken, AuthController.getMe);
router.post('/change-password', authenticateToken, AuthController.updatePassword);
router.get('/users', authenticateToken, AuthController.listUsers);
router.delete('/users/:id', authenticateToken, AuthController.deleteUser);

export default router;
