import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';

export class UploadController {
  public static async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      // Determine subfolder
      let folder = 'general';
      if (req.originalUrl.includes('banner')) folder = 'banners';
      else if (req.originalUrl.includes('reel')) folder = 'reels';
      else if (req.originalUrl.includes('photo') || req.originalUrl.includes('portfolio')) folder = 'photos';

      const fileUrl = `${env.APP_URL}/uploads/${folder}/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          url: fileUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
