import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

export class PromotionController {
  // ================= CAROUSEL BANNERS =================
  public static async listBanners(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { includeInactive } = req.query;
      const banners = await prisma.carouselBanner.findMany({
        where: includeInactive === 'true' ? {} : { isActive: true },
        orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
      });
      res.status(200).json({ success: true, data: banners });
    } catch (error) {
      next(error);
    }
  }

  public static async createBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, subtitle, badge, ctaText, link, imageUrl, orderIndex = 0 } = req.body;
      if (!title || !imageUrl) {
        throw new AppError('Title and Image URL are required', 400);
      }

      const banner = await prisma.carouselBanner.create({
        data: {
          title,
          subtitle,
          badge,
          ctaText,
          link,
          imageUrl,
          orderIndex: parseInt(orderIndex, 10),
          isActive: true,
        },
      });
      res.status(201).json({ success: true, message: 'Banner created', data: banner });
    } catch (error) {
      next(error);
    }
  }

  public static async updateBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updated = await prisma.carouselBanner.update({
        where: { id },
        data: req.body,
      });
      res.status(200).json({ success: true, message: 'Banner updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await prisma.carouselBanner.delete({ where: { id } });
      res.status(200).json({ success: true, message: 'Banner deleted' });
    } catch (error) {
      next(error);
    }
  }

  // ================= REELS =================
  public static async listReels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { includeInactive } = req.query;
      const reels = await prisma.reelItem.findMany({
        where: includeInactive === 'true' ? {} : { isActive: true },
        orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
      });
      res.status(200).json({ success: true, data: reels });
    } catch (error) {
      next(error);
    }
  }

  public static async createReel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        title,
        tag = 'Styling',
        category = 'Hair',
        imageUrl,
        videoUrl,
        instagramUrl,
        audioTrack,
        stylistHandle,
        description,
        orderIndex = 0,
      } = req.body;

      if (!title || !imageUrl) {
        throw new AppError('Title and cover image URL are required', 400);
      }

      const reel = await prisma.reelItem.create({
        data: {
          title,
          tag,
          category,
          imageUrl,
          videoUrl,
          instagramUrl,
          audioTrack,
          stylistHandle,
          description,
          orderIndex: parseInt(orderIndex, 10),
          isActive: true,
        },
      });
      res.status(201).json({ success: true, message: 'Reel uploaded successfully', data: reel });
    } catch (error) {
      next(error);
    }
  }

  public static async updateReel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updated = await prisma.reelItem.update({
        where: { id },
        data: req.body,
      });
      res.status(200).json({ success: true, message: 'Reel updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteReel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await prisma.reelItem.delete({ where: { id } });
      res.status(200).json({ success: true, message: 'Reel deleted' });
    } catch (error) {
      next(error);
    }
  }

  // ================= PORTFOLIO WORKS (TRANSFORMATION PHOTOS) =================
  public static async listPortfolioWorks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { includeInactive } = req.query;
      const works = await prisma.portfolioWork.findMany({
        where: includeInactive === 'true' ? {} : { isActive: true },
        orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
      });
      res.status(200).json({ success: true, data: works });
    } catch (error) {
      next(error);
    }
  }

  public static async createPortfolioWork(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, category, artisan, imageUrl, description, orderIndex = 0 } = req.body;
      if (!title || !imageUrl || !category || !artisan) {
        throw new AppError('Title, category, artisan name, and image URL are required', 400);
      }

      const work = await prisma.portfolioWork.create({
        data: {
          title,
          category,
          artisan,
          imageUrl,
          description,
          orderIndex: parseInt(orderIndex, 10),
          isActive: true,
        },
      });
      res.status(201).json({ success: true, message: 'Transformation photo created', data: work });
    } catch (error) {
      next(error);
    }
  }

  public static async updatePortfolioWork(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updated = await prisma.portfolioWork.update({
        where: { id },
        data: req.body,
      });
      res.status(200).json({ success: true, message: 'Photo updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  public static async deletePortfolioWork(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await prisma.portfolioWork.delete({ where: { id } });
      res.status(200).json({ success: true, message: 'Photo deleted' });
    } catch (error) {
      next(error);
    }
  }
}
