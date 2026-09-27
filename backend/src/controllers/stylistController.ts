import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

export class StylistController {
  public static async listStylists(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gender, includeInactive } = req.query;

      const whereClause: any = {};
      if (includeInactive !== 'true') {
        whereClause.isActive = true;
      }
      if (gender && typeof gender === 'string' && gender !== 'all') {
        whereClause.gender = { in: [gender, 'any'] };
      }

      const stylists = await prisma.stylist.findMany({
        where: whereClause,
        orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }],
      });

      res.status(200).json({
        success: true,
        data: stylists,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createStylist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, name, role, gender = 'any', specialty, bio, imageUrl, rating = 4.9, experience } = req.body;

      if (!name || !role || !specialty || !imageUrl) {
        throw new AppError('Name, role, specialty, and imageUrl are required', 400);
      }

      const slugId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const stylist = await prisma.stylist.create({
        data: {
          id: slugId,
          name,
          role,
          gender,
          specialty,
          bio,
          imageUrl,
          rating: parseFloat(rating),
          experience,
          isActive: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Artisan created successfully',
        data: stylist,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateStylist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = { ...req.body };
      if (data.rating !== undefined) data.rating = parseFloat(data.rating);

      const updated = await prisma.stylist.update({
        where: { id },
        data,
      });

      res.status(200).json({
        success: true,
        message: 'Artisan updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteStylist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await prisma.stylist.update({
        where: { id },
        data: { isActive: false },
      });

      res.status(200).json({
        success: true,
        message: 'Stylist deactivated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
