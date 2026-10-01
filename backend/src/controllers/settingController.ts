import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { WhatsAppService } from '../services/whatsappService';
import { DEFAULT_WEEK_SCHEDULE } from '../services/slotService';

export class SettingController {
  public static async getSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const records = await prisma.salonSetting.findMany();
      const settingsMap: Record<string, any> = {};

      records.forEach((r) => {
        try {
          settingsMap[r.key] = JSON.parse(r.value);
        } catch {
          settingsMap[r.key] = r.value;
        }
      });

      // Default fallbacks if empty
      if (!settingsMap.whatsappNumber) settingsMap.whatsappNumber = '919747864111';
      if (!settingsMap.whatsappQrUrl) {
        settingsMap.whatsappQrUrl = WhatsAppService.generateWhatsAppQrCodeUrl(settingsMap.whatsappNumber);
      }
      if (typeof settingsMap.maintenanceMode === 'undefined') {
        settingsMap.maintenanceMode = false;
      } else if (settingsMap.maintenanceMode === 'true') {
        settingsMap.maintenanceMode = true;
      } else if (settingsMap.maintenanceMode === 'false') {
        settingsMap.maintenanceMode = false;
      }

      if (typeof settingsMap.bookingEngineActive === 'undefined') {
        settingsMap.bookingEngineActive = true;
      } else if (settingsMap.bookingEngineActive === 'true' || settingsMap.bookingEngineActive === true) {
        settingsMap.bookingEngineActive = true;
      } else if (settingsMap.bookingEngineActive === 'false' || settingsMap.bookingEngineActive === false) {
        settingsMap.bookingEngineActive = false;
      }

      if (!settingsMap.weekSchedule || !Array.isArray(settingsMap.weekSchedule) || settingsMap.weekSchedule.length === 0) {
        settingsMap.weekSchedule = DEFAULT_WEEK_SCHEDULE;
      }

      if (!settingsMap.storeNotice || typeof settingsMap.storeNotice !== 'object') {
        settingsMap.storeNotice = {
          isActive: false,
          title: 'Special Notice',
          message: '',
          badge: 'Announcement',
          buttonText: 'Got It',
        };
      }

      res.status(200).json({ success: true, data: settingsMap });
    } catch (error) {
      next(error);
    }
  }

  public static async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updates = req.body; // e.g. { salonName: 'StyleX', whatsappNumber: '919747864111', ... }

      const promises = Object.entries(updates).map(async ([key, val]) => {
        const strVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
        return prisma.salonSetting.upsert({
          where: { key },
          update: { value: strVal },
          create: { key, value: strVal },
        });
      });

      await Promise.all(promises);

      res.status(200).json({ success: true, message: 'Settings saved successfully' });
    } catch (error) {
      next(error);
    }
  }

  public static async getWhatsAppQr(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone, message } = req.query;
      const targetPhone = typeof phone === 'string' ? phone : undefined;
      const targetMessage = typeof message === 'string' ? message : undefined;

      const qrUrl = WhatsAppService.generateWhatsAppQrCodeUrl(targetPhone, targetMessage);
      res.status(200).json({ success: true, qrUrl });
    } catch (error) {
      next(error);
    }
  }
}
