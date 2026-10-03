import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';

const router = Router();

// Developer Only Endpoints
router.get('/report', AnalyticsController.getReport);
router.get('/summary', AnalyticsController.getSummary);
router.post('/refresh', AnalyticsController.refreshReport);

export default router;
