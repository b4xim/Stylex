import nodemailer from 'nodemailer';
import { env } from '../config/env';

export interface EmailBookingPayload {
  toEmail: string;
  customerName: string;
  bookingRef: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  total: number;
  stylistName?: string;
  manageUrl?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  private static getTransporter(): nodemailer.Transporter | null {
    if (!this.transporter && env.SMTP_USER && env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    }
    return this.transporter;
  }

  public static async sendBookingConfirmation(
    payload: EmailBookingPayload
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const transporter = this.getTransporter();

    if (!transporter) {
      console.log('ℹ️ [Email Service] SMTP credentials not set. Email logged locally:');
      console.log(`To: ${payload.toEmail} | Ref: ${payload.bookingRef} | Service: ${payload.serviceName}`);
      return { success: true, messageId: `LOCAL_SIMULATED_${Date.now()}` };
    }

    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f7faf8; margin: 0; padding: 24px; color: #112e20; }
            .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #dbe5e0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
            .header { background: linear-gradient(135deg, #071a14 0%, #112e20 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
            .badge { display: inline-block; background: rgba(254, 117, 60, 0.2); color: #fe753c; border: 1px solid #fe753c; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-bottom: 12px; text-transform: uppercase; }
            .content { padding: 28px 24px; }
            .ref-box { background: #f0f5f1; border-left: 4px solid #fe753c; padding: 14px 18px; border-radius: 0 10px 10px 0; margin-bottom: 24px; }
            .ref-title { font-size: 11px; text-transform: uppercase; color: #727973; font-weight: bold; }
            .ref-number { font-size: 20px; font-weight: bold; color: #112e20; margin-top: 4px; }
            .details-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            .details-table td { padding: 10px 0; border-bottom: 1px solid #eef3f0; font-size: 14px; }
            .details-table td.label { color: #727973; width: 40%; }
            .details-table td.value { font-weight: 600; color: #112e20; text-align: right; }
            .footer { background: #fbf9f5; padding: 20px 24px; text-align: center; font-size: 12px; color: #727973; border-top: 1px solid #e7e5e0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="badge">Appointment Voucher</div>
              <h1>StyleX Signature Salon</h1>
              <p style="margin: 6px 0 0 0; color: #a6d0be; font-size: 13px;">Tirur Flagship • Kerala</p>
            </div>
            <div class="content">
              <p>Dear <strong>${payload.customerName}</strong>,</p>
              <p>Your appointment has been confirmed. Below are your booking reservation details:</p>
              <div class="ref-box">
                <div class="ref-title">Booking Confirmation Code</div>
                <div class="ref-number">${payload.bookingRef}</div>
              </div>
              <table class="details-table">
                <tr>
                  <td class="label">Selected Ritual</td>
                  <td class="value">${payload.serviceName}</td>
                </tr>
                <tr>
                  <td class="label">Date</td>
                  <td class="value">${payload.date}</td>
                </tr>
                <tr>
                  <td class="label">Time Slot</td>
                  <td class="value">${payload.timeSlot}</td>
                </tr>
                ${payload.stylistName ? `
                <tr>
                  <td class="label">Artisan / Stylist</td>
                  <td class="value">${payload.stylistName}</td>
                </tr>
                ` : ''}
                <tr>
                  <td class="label">Estimated Amount</td>
                  <td class="value">₹${payload.total.toLocaleString('en-IN')}</td>
                </tr>
              </table>
              ${payload.manageUrl ? `
              <div style="text-align: center; margin: 24px 0;">
                <a href="${payload.manageUrl}" style="background-color: #fe753c; color: #ffffff; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">Manage or Reschedule Booking</a>
              </div>` : ''}
              <p style="font-size: 13px; color: #555;">Please arrive 10 minutes prior to your appointment time. For any schedule adjustments, please contact our front desk at <strong>+91 96561 11149</strong>.</p>
            </div>
            <div class="footer">
              <p style="margin: 0;">StyleX Flagship Salon, One Arcade, Tirur, Kerala 676101</p>
              <p style="margin: 4px 0 0 0;">WhatsApp: +91 96561 11149 • appointments@stylextirur.com</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const info = await transporter.sendMail({
        from: env.SMTP_FROM,
        to: payload.toEmail,
        subject: `Appointment Confirmed: ${payload.bookingRef} at StyleX Signature Salon`,
        html: htmlContent,
      });

      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('❌ Email Sending Error:', error.message);
      return { success: false, error: error.message };
    }
  }

  public static async sendBookingRescheduled(
    payload: EmailBookingPayload
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const transporter = this.getTransporter();
    if (!transporter) {
      console.log(`ℹ️ [Email Service] Reschedule email simulated for ${payload.toEmail} (${payload.bookingRef})`);
      return { success: true, messageId: `SIMULATED_RESCHEDULE_${Date.now()}` };
    }

    try {
      const info = await transporter.sendMail({
        from: env.SMTP_FROM,
        to: payload.toEmail,
        subject: `Appointment Rescheduled: ${payload.bookingRef} - StyleX Signature Salon`,
        html: `
          <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #dbe5e0; border-radius: 16px;">
            <h2 style="color: #112e20;">Your StyleX Appointment Has Been Rescheduled</h2>
            <p>Dear <strong>${payload.customerName}</strong>,</p>
            <p>Your appointment has been successfully updated to the new date and time below:</p>
            <ul>
              <li><strong>Booking Ref:</strong> ${payload.bookingRef}</li>
              <li><strong>Service:</strong> ${payload.serviceName}</li>
              <li><strong>New Date:</strong> ${payload.date}</li>
              <li><strong>New Time Slot:</strong> ${payload.timeSlot}</li>
              ${payload.stylistName ? `<li><strong>Stylist:</strong> ${payload.stylistName}</li>` : ''}
            </ul>
            ${payload.manageUrl ? `<p><a href="${payload.manageUrl}" style="display:inline-block; background:#fe753c; color:#fff; padding:10px 20px; border-radius:20px; text-decoration:none; font-weight:bold;">View or Manage Appointment</a></p>` : ''}
            <p style="color:#777; font-size:12px;">StyleX Signature Salon • One Arcade, Tirur • +91 96561 11149</p>
          </div>
        `,
      });
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  public static async sendBookingCancelled(
    payload: { toEmail: string; customerName: string; bookingRef: string; serviceName: string; date: string; timeSlot: string }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const transporter = this.getTransporter();
    if (!transporter) {
      console.log(`ℹ️ [Email Service] Cancellation email simulated for ${payload.toEmail} (${payload.bookingRef})`);
      return { success: true, messageId: `SIMULATED_CANCEL_${Date.now()}` };
    }

    try {
      const info = await transporter.sendMail({
        from: env.SMTP_FROM,
        to: payload.toEmail,
        subject: `Appointment Cancelled: ${payload.bookingRef} - StyleX Signature Salon`,
        html: `
          <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #dbe5e0; border-radius: 16px;">
            <h2 style="color: #991b1b;">Appointment Cancelled</h2>
            <p>Dear <strong>${payload.customerName}</strong>,</p>
            <p>Your appointment <strong>${payload.bookingRef}</strong> for <strong>${payload.serviceName}</strong> on ${payload.date} at ${payload.timeSlot} has been cancelled.</p>
            <p>If you'd like to book another session at any time, please visit <a href="https://stylexsalon.in/booking">stylexsalon.in/booking</a>.</p>
            <p style="color:#777; font-size:12px;">StyleX Signature Salon • One Arcade, Tirur • +91 96561 11149</p>
          </div>
        `,
      });
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  public static isConfigured(): boolean {
    return Boolean(env.SMTP_USER && env.SMTP_PASS);
  }

  public static async sendTestEmail(
    toEmail: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const transporter = this.getTransporter();
    if (!transporter) {
      return {
        success: false,
        error: 'SMTP credentials are not configured. Please set SMTP_USER and SMTP_PASS in backend .env.',
      };
    }

    try {
      const info = await transporter.sendMail({
        from: env.SMTP_FROM,
        to: toEmail,
        subject: '✨ StyleX Signature Salon — Email Dispatch Test',
        html: `
          <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #dbe5e0; border-radius: 16px; background:#fff;">
            <h2 style="color: #112e20; margin-top:0;">StyleX Email Notification System Online</h2>
            <p>This is a verification email from your StyleX Signature Salon backend.</p>
            <div style="background:#f0f5f1; padding:16px; border-radius:10px; margin:16px 0;">
              <p style="margin:0; font-size:13px; color:#185341;"><strong>Status:</strong> Connected via ${env.SMTP_HOST}:${env.SMTP_PORT}</p>
              <p style="margin:4px 0 0 0; font-size:13px; color:#185341;"><strong>Sender Account:</strong> ${env.SMTP_USER}</p>
            </div>
            <p style="font-size:12px; color:#777;">Automated client passes, reschedule notifications, and cancellations will be dispatched from this account.</p>
          </div>
        `,
      });
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

