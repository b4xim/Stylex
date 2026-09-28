import { Router } from 'express';
import { CustomerController } from '../controllers/customerController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, CustomerController.listCustomers);
router.get('/export/csv', authenticateToken, CustomerController.exportCustomersCsv);
router.get('/:id', authenticateToken, CustomerController.getCustomerDetails);
router.delete('/:id', authenticateToken, CustomerController.deleteCustomer);

export default router;
