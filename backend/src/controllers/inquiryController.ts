import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

const INQUIRIES_KEY = 'concierge_inquiries';

export class InquiryController {
  public static async listInquiries(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await prisma.salonSetting.findUnique({
        where: { key: INQUIRIES_KEY },
      });

      let inquiries: any[] = [];
      if (record?.value) {
        try {
          const parsed = JSON.parse(record.value);
          if (Array.isArray(parsed)) {
            inquiries = parsed;
          }
        } catch {}
      }

      res.status(200).json({ success: true, data: inquiries });
    } catch (error) {
      next(error);
    }
  }

  public static async createInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { clientName, phone, serviceRequested, preferredDate, message } = req.body;

      if (!clientName || !phone || !message) {
        throw new AppError('Full name, phone number, and message are required', 400);
      }

      const record = await prisma.salonSetting.findUnique({
        where: { key: INQUIRIES_KEY },
      });

      let inquiries: any[] = [];
      if (record?.value) {
        try {
          const parsed = JSON.parse(record.value);
          if (Array.isArray(parsed)) {
            inquiries = parsed;
          }
        } catch {}
      }

      const newInquiry = {
        id: 'inq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        clientName: String(clientName).trim(),
        clientTier: 'Guest',
        phone: String(phone).trim(),
        serviceRequested: serviceRequested || 'General Inquiry',
        preferredDate:
          preferredDate ||
          new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        message: String(message).trim(),
        status: 'Unread',
        timeAgo: 'Just now',
        createdAt: new Date().toISOString(),
      };

      const updated = [newInquiry, ...inquiries];

      await prisma.salonSetting.upsert({
        where: { key: INQUIRIES_KEY },
        update: { value: JSON.stringify(updated) },
        create: { key: INQUIRIES_KEY, value: JSON.stringify(updated) },
      });

      res.status(201).json({ success: true, data: newInquiry });
    } catch (error) {
      next(error);
    }
  }

  public static async updateInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      const record = await prisma.salonSetting.findUnique({
        where: { key: INQUIRIES_KEY },
      });

      let inquiries: any[] = [];
      if (record?.value) {
        try {
          const parsed = JSON.parse(record.value);
          if (Array.isArray(parsed)) {
            inquiries = parsed;
          }
        } catch {}
      }

      const updated = inquiries.map((inq) =>
        inq.id === id ? { ...inq, ...(status ? { status } : {}) } : inq
      );

      await prisma.salonSetting.upsert({
        where: { key: INQUIRIES_KEY },
        update: { value: JSON.stringify(updated) },
        create: { key: INQUIRIES_KEY, value: JSON.stringify(updated) },
      });

      res.status(200).json({ success: true, message: 'Inquiry updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;

      const record = await prisma.salonSetting.findUnique({
        where: { key: INQUIRIES_KEY },
      });

      let inquiries: any[] = [];
      if (record?.value) {
        try {
          const parsed = JSON.parse(record.value);
          if (Array.isArray(parsed)) {
            inquiries = parsed;
          }
        } catch {}
      }

      const updated = inquiries.filter((inq) => inq.id !== id);

      await prisma.salonSetting.upsert({
        where: { key: INQUIRIES_KEY },
        update: { value: JSON.stringify(updated) },
        create: { key: INQUIRIES_KEY, value: JSON.stringify(updated) },
      });

      res.status(200).json({ success: true, message: 'Inquiry deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
