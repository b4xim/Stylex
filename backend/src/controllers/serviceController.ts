import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

export class ServiceController {
  public static async listServices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gender, category, includeInactive } = req.query;

      const whereClause: any = {};
      if (includeInactive !== 'true') {
        whereClause.isActive = true;
      }
      if (gender && typeof gender === 'string' && gender !== 'all') {
        whereClause.gender = { in: [gender, 'unisex'] };
      }
      if (category && typeof category === 'string' && category !== 'all') {
        whereClause.category = category;
      }

      const services = await prisma.service.findMany({
        where: whereClause,
        orderBy: [{ category: 'asc' }, { orderIndex: 'asc' }, { name: 'asc' }],
      });

      res.status(200).json({
        success: true,
        data: services,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getServiceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const service = await prisma.service.findUnique({ where: { id } });

      if (!service) {
        throw new AppError('Service not found', 404);
      }

      res.status(200).json({ success: true, data: service });
    } catch (error) {
      next(error);
    }
  }

  public static async createService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        id,
        name,
        category,
        gender = 'unisex',
        durationMins,
        price,
        originalPrice,
        description,
        benefits,
        isPopular = false,
        isTrending = false,
      } = req.body;

      if (!name || !category || !durationMins || price === undefined) {
        throw new AppError('Name, category, duration, and price are required', 400);
      }

      const slugId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const existing = await prisma.service.findUnique({ where: { id: slugId } });
      if (existing) {
        throw new AppError(`A service with ID/slug "${slugId}" already exists`, 409);
      }

      const service = await prisma.service.create({
        data: {
          id: slugId,
          name,
          category,
          gender,
          durationMins: parseInt(durationMins, 10),
          price: parseFloat(price),
          originalPrice: originalPrice ? parseFloat(originalPrice) : null,
          description,
          benefits: typeof benefits === 'string' ? benefits : JSON.stringify(benefits || []),
          isPopular: Boolean(isPopular),
          isTrending: Boolean(isTrending),
          isActive: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Service created successfully',
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = { ...req.body };

      if (data.price !== undefined) data.price = parseFloat(data.price);
      if (data.originalPrice !== undefined) data.originalPrice = data.originalPrice ? parseFloat(data.originalPrice) : null;
      if (data.durationMins !== undefined) data.durationMins = parseInt(data.durationMins, 10);
      if (data.benefits && typeof data.benefits !== 'string') data.benefits = JSON.stringify(data.benefits);

      const updated = await prisma.service.update({
        where: { id },
        data,
      });

      res.status(200).json({
        success: true,
        message: 'Service updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      // Soft-delete by setting isActive to false
      await prisma.service.update({
        where: { id },
        data: { isActive: false },
      });

      res.status(200).json({
        success: true,
        message: 'Service deactivated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
