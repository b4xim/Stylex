import { Router } from 'express';
import { PromotionController } from '../controllers/promotionController';
import { optionalAuthenticateToken } from '../middleware/auth';

const router = Router();

// Carousel Banners
router.get('/banners', PromotionController.listBanners);
router.post('/banners', optionalAuthenticateToken, PromotionController.createBanner);
router.put('/banners/:id', optionalAuthenticateToken, PromotionController.updateBanner);
router.delete('/banners/:id', optionalAuthenticateToken, PromotionController.deleteBanner);

// Reels
router.get('/reels', PromotionController.listReels);
router.post('/reels', optionalAuthenticateToken, PromotionController.createReel);
router.put('/reels/:id', optionalAuthenticateToken, PromotionController.updateReel);
router.delete('/reels/:id', optionalAuthenticateToken, PromotionController.deleteReel);

// Portfolio Photos
router.get('/photos', PromotionController.listPortfolioWorks);
router.post('/photos', optionalAuthenticateToken, PromotionController.createPortfolioWork);
router.put('/photos/:id', optionalAuthenticateToken, PromotionController.updatePortfolioWork);
router.delete('/photos/:id', optionalAuthenticateToken, PromotionController.deletePortfolioWork);

export default router;
