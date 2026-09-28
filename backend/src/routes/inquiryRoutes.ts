import { Router } from 'express';
import { InquiryController } from '../controllers/inquiryController';
import { optionalAuthenticateToken } from '../middleware/auth';

const router = Router();

// Public: website visitors can submit concierge inquiries
router.post('/', InquiryController.createInquiry);

// Dashboard/Admin: list, update status, delete inquiries
router.get('/', optionalAuthenticateToken, InquiryController.listInquiries);
router.put('/:id', optionalAuthenticateToken, InquiryController.updateInquiry);
router.delete('/:id', optionalAuthenticateToken, InquiryController.deleteInquiry);

export default router;
