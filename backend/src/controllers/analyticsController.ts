import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AnalyticsService } from '../services/analyticsService';
import { AuthUser } from '../middleware/auth';

function verifyDeveloperAuth(req: Request): AuthUser | null {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  // Support token passed via query param (e.g. for iframe embedding)
  if (!token && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    // Check if role is Developer or email is developer@stylexsalon.in
    const isDev =
      decoded.role === 'Developer' ||
      decoded.role?.toLowerCase() === 'developer' ||
      decoded.email?.startsWith('developer') ||
      (decoded as any).username === 'developer';

    if (!isDev) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export class AnalyticsController {
  /**
   * GET /api/analytics/report
   * Serves the self-contained GoAccess HTML dashboard (Protected: Developer Only)
   */
  public static async getReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = verifyDeveloperAuth(req);
      if (!user) {
        res.status(403).send(`
          <!DOCTYPE html>
          <html>
          <head><title>Access Denied • Developer Role Required</title></head>
          <body style="background:#0b1812; color:#fff; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; text-align:center;">
            <div style="background:#11281e; border:1px solid #1e4534; padding:32px; border-radius:16px; max-width:420px;">
              <h2 style="color:#fe753c; margin-top:0;">🔒 Developer Role Required</h2>
              <p style="color:#a1c4b3; font-size:14px; line-height:1.5;">This site analytics telemetry dashboard is restricted to developers. Please sign in with developer credentials.</p>
            </div>
          </body>
          </html>
        `);
        return;
      }

      const html = await AnalyticsService.getReportHtml();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      // Set permissive frame options so it renders seamlessly inside the authenticated dashboard iframe
      res.removeHeader('X-Frame-Options');
      res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://dashboard.stylexsalon.in http://localhost:*");
      res.send(html);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analytics/summary
   * Returns fast KPI overview JSON (Protected: Developer Only)
   */
  public static async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = verifyDeveloperAuth(req);
      if (!user) {
        res.status(403).json({
          success: false,
          message: 'Access restricted to Developer role only.',
        });
        return;
      }

      const summary = await AnalyticsService.getSummary();
      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/analytics/refresh
   * Triggers an on-demand GoAccess log parse and report generation (Protected: Developer Only)
   */
  public static async refreshReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = verifyDeveloperAuth(req);
      if (!user) {
        res.status(403).json({
          success: false,
          message: 'Access restricted to Developer role only.',
        });
        return;
      }

      const result = await AnalyticsService.generateReport();
      res.status(200).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
