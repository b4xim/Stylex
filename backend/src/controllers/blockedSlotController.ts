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
      const { date, timeSlot, timeSlots, stylistId, reason, id } = req.body;

      const slots: string[] = Array.isArray(timeSlots) && timeSlots.length > 0 
        ? timeSlots 
        : timeSlot ? [timeSlot] : [];

      if (!date || slots.length === 0) {
        throw new AppError('Date and time slot(s) are required', 400);
      }

      const slotReason = id ? `${reason || 'Administrative slot hold'} [${id}]` : (reason || 'Administrative slot hold');
      const createdBy = req.user?.name || 'Admin';

      const createdList = [];
      for (const s of slots) {
        const existing = await prisma.blockedSlot.findFirst({
          where: {
            date,
            timeSlot: s,
            stylistId: stylistId || null,
          },
        });

        if (!existing) {
          const blocked = await prisma.blockedSlot.create({
            data: {
              date,
              timeSlot: s,
              stylistId: stylistId || null,
              reason: slotReason,
              createdBy,
            },
          });
          createdList.push(blocked);
        } else {
          createdList.push(existing);
        }
      }

      res.status(201).json({
        success: true,
        message: `Blocked ${createdList.length} slot(s) on ${date}`,
        data: createdList,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async unblockSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;

      const deleted = await prisma.blockedSlot.deleteMany({
        where: {
          OR: [
            { id },
            { reason: { contains: `[${id}]` } },
          ],
        },
      });

      res.status(200).json({
        success: true,
        message: 'Slot(s) unblocked successfully',
        count: deleted.count,
      });
    } catch (error) {
      next(error);
    }
  }
}
