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
        const normalizedGender = gender.toLowerCase();
        const genderOptions = [normalizedGender, 'any', 'both', 'unisex'];
        if (normalizedGender === 'gents') genderOptions.push('male');
        if (normalizedGender === 'ladies') genderOptions.push('female');
        whereClause.gender = { in: genderOptions };
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
      const { id, name, role, gender = 'both', specialty, bio, imageUrl, rating = 4.9, experience } = req.body;

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

      const existing = await prisma.stylist.findFirst({
        where: { OR: [{ id }, { name: { equals: id, mode: 'insensitive' } }] },
      });

      if (!existing) {
        // If not found in DB yet (e.g. from mock), create it
        const newStylist = await prisma.stylist.create({
          data: {
            id,
            name: data.name || id,
            role: data.role || 'Senior Stylist',
            gender: data.gender || 'both',
            specialty: data.specialty || 'Hair & Styling',
            imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6',
            rating: data.rating || 4.9,
            isActive: data.isActive ?? true,
          },
        });
        res.status(200).json({ success: true, message: 'Artisan saved successfully', data: newStylist });
        return;
      }

      const updated = await prisma.stylist.update({
        where: { id: existing.id },
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

      // 1. Unlink any existing bookings so foreign key constraint doesn't prevent deletion
      await prisma.booking.updateMany({
        where: { stylistId: id },
        data: { stylistId: null },
      });

      // 2. Delete any blocked slots
      await prisma.blockedSlot.deleteMany({
        where: { stylistId: id },
      });

      // 3. Permanently remove the stylist from the database
      await prisma.stylist.deleteMany({
        where: {
          OR: [
            { id },
            { name: { equals: id, mode: 'insensitive' } },
          ],
        },
      });

      res.status(200).json({
        success: true,
        message: 'Stylist removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
