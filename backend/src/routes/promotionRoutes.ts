import { Router } from 'express';
import { PromotionController } from '../controllers/promotionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Carousel Banners
router.get('/banners', PromotionController.listBanners);
router.post('/banners', authenticateToken, PromotionController.createBanner);
router.put('/banners/:id', authenticateToken, PromotionController.updateBanner);
router.delete('/banners/:id', authenticateToken, PromotionController.deleteBanner);

// Reels
router.get('/reels', PromotionController.listReels);
router.post('/reels', authenticateToken, PromotionController.createReel);
router.put('/reels/:id', authenticateToken, PromotionController.updateReel);
router.delete('/reels/:id', authenticateToken, PromotionController.deleteReel);

// Portfolio Photos
router.get('/photos', PromotionController.listPortfolioWorks);
router.post('/photos', authenticateToken, PromotionController.createPortfolioWork);
router.put('/photos/:id', authenticateToken, PromotionController.updatePortfolioWork);
router.delete('/photos/:id', authenticateToken, PromotionController.deletePortfolioWork);

export default router;
