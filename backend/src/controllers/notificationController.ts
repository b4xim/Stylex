import { Request, Response, NextFunction } from 'express';
import { WhatsAppBotService } from '../services/whatsappBotService';
import { EmailService } from '../services/emailService';
import { env } from '../config/env';

export class NotificationController {
  /**
   * GET /api/notifications/whatsapp/status
   */
  public static async getWhatsAppStatus(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = WhatsAppBotService.getStatus();
      res.status(200).json({ success: true, data: status });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/notifications/whatsapp/test
   */
  public static async sendWhatsAppTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone } = req.body;
      if (!phone) {
        res.status(400).json({ success: false, message: 'Phone number is required for test' });
        return;
      }

      const result = await WhatsAppBotService.sendTestMessage(String(phone));
      if (result.success) {
        res.status(200).json({ success: true, message: 'Test message sent successfully!', messageId: result.messageId });
      } else {
        res.status(400).json({ success: false, message: result.error || 'Failed to send test message' });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/notifications/whatsapp/disconnect
   */
  public static async disconnectWhatsApp(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const success = await WhatsAppBotService.disconnectBot();
      res.status(200).json({ success, message: success ? 'Device unlinked. Fresh QR code generated.' : 'Failed to unlink device' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/notifications/whatsapp/restart
   */
  public static async restartWhatsApp(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await WhatsAppBotService.reinitialize();
      res.status(200).json({ success: true, message: 'WhatsApp gateway re-initialized.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/notifications/email/status
   */
  public static async getEmailStatus(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isConfigured = EmailService.isConfigured();
      res.status(200).json({
        success: true,
        data: {
          configured: isConfigured,
          smtpUser: env.SMTP_USER ? env.SMTP_USER.replace(/(.{2})(.*)(@.*)/, '$1***$3') : null,
          smtpHost: env.SMTP_HOST,
          smtpPort: env.SMTP_PORT,
          fromAddress: env.SMTP_FROM,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/notifications/email/test
   */
  public static async sendEmailTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ success: false, message: 'Destination email is required for test' });
        return;
      }

      const result = await EmailService.sendTestEmail(String(email));
      if (result.success) {
        res.status(200).json({ success: true, message: 'Test email dispatched successfully!', messageId: result.messageId });
      } else {
        res.status(400).json({ success: false, message: result.error || 'Failed to send test email' });
      }
    } catch (error) {
      next(error);
    }
  }
}
