import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class BlockedSlotController {
  public static async listBlockedSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { date, startDate, endDate, stylistId } = req.query;

      const whereClause: any = {};
      if (date && typeof date === 'string') {
        whereClause.date = date;
      } else if (startDate && endDate) {
        whereClause.date = {
          gte: String(startDate),
          lte: String(endDate),
        };
      }

      if (stylistId && typeof stylistId === 'string') {
        whereClause.OR = [
          { stylistId: null },
          { stylistId },
        ];
      }

      const blockedSlots = await prisma.blockedSlot.findMany({
        where: whereClause,
        include: { stylist: true },
        orderBy: [{ date: 'asc' }, { timeSlot: 'asc' }],
      });

      res.status(200).json({
        success: true,
        data: blockedSlots,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async blockSlot(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { date, timeSlot, stylistId, reason } = req.body;

      if (!date || !timeSlot) {
        throw new AppError('Date and time slot are required', 400);
      }

      const existing = await prisma.blockedSlot.findFirst({
        where: {
          date,
          timeSlot,
          stylistId: stylistId || null,
        },
      });

      if (existing) {
        throw new AppError('This slot is already blocked', 409);
      }

      const blocked = await prisma.blockedSlot.create({
        data: {
          date,
          timeSlot,
          stylistId: stylistId || null,
          reason: reason || 'Administrative slot hold',
          createdBy: req.user?.name || 'Admin',
        },
      });

      res.status(201).json({
        success: true,
        message: `Slot ${timeSlot} on ${date} blocked successfully`,
        data: blocked,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async unblockSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;

      await prisma.blockedSlot.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: 'Slot unblocked successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
