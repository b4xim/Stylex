import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { prisma } from '../config/db';

export interface EmailBookingPayload {
  toEmail: string;
  customerName: string;
  bookingRef: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  total?: number;
  stylistName?: string;
  manageUrl?: string;
}

/**
 * Normalizes management link so it always points to the public salon domain
 */
function normalizeManageUrl(rawUrl?: string): string {
  if (!rawUrl) return 'https://stylexsalon.in/';
  return rawUrl.replace(/https?:\/\/(localhost:5000|127\.0\.0\.1:5000)/g, 'https://stylexsalon.in');
}

/**
 * Generates an RFC 5545 compliant iCalendar (.ics) event string
 */
function generateICS(payload: {
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  stylistName?: string;
  manageUrl?: string;
}): string {
  // Parse YYYY-MM-DD
  const dateMatch = payload.date.match(/(\d{4})-(\d{2})-(\d{2})/);
  let year = '2026';
  let month = '10';
  let day = '04';
  if (dateMatch) {
    [, year, month, day] = dateMatch;
  }

  // Parse start hour and minute (supports "10:00 AM", "02:30 PM", "14:00")
  let startHour = 10;
  let startMin = 0;
  const timeMatch = payload.timeSlot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (timeMatch) {
    let h = parseInt(timeMatch[1], 10);
    const m = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3]?.toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    startHour = h;
    startMin = m;
  }

  let endHour = startHour + 1;
  let endMin = startMin;
  if (endHour >= 24) endHour = 23;

  const pad = (n: number) => String(n).padStart(2, '0');
  const dtStart = `${year}${month}${day}T${pad(startHour)}${pad(startMin)}00`;
  const dtEnd = `${year}${month}${day}T${pad(endHour)}${pad(endMin)}00`;
  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `booking-${payload.bookingRef}-${Date.now()}@stylexsalon.in`;

  const descriptionLines = [
    `StyleX Signature Salon Appointment`,
    `Service: ${payload.serviceName}`,
    `Booking Ref: ${payload.bookingRef}`,
    payload.stylistName ? `Artisan: ${payload.stylistName}` : '',
    `Location: One Arcade, Tirur, Kerala 676101`,
    payload.manageUrl ? `Manage / Reschedule: ${payload.manageUrl}` : '',
  ].filter(Boolean);

  const icsLines = [
    'BEGIN:VCALENDAR',
    'PRODID:-//StyleX Signature Salon//Booking Engine//EN',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART;TZID=Asia/Kolkata:${dtStart}`,
    `DTEND;TZID=Asia/Kolkata:${dtEnd}`,
    `SUMMARY:StyleX Signature Salon: ${payload.serviceName}`,
    `DESCRIPTION:${descriptionLines.join('\\n')}`,
    'LOCATION:StyleX Signature Salon, One Arcade, Tirur, Kerala 676101',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'ORGANIZER;CN="StyleX Signature Salon":mailto:stylexsignaturesalon@gmail.com',
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${payload.customerName}:mailto:${payload.customerEmail}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: StyleX Appointment in 1 hour',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return icsLines.join('\r\n');
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
      const manageUrl = normalizeManageUrl(payload.manageUrl);
      const icsContent = generateICS({
        bookingRef: payload.bookingRef,
        customerName: payload.customerName,
        customerEmail: payload.toEmail,
        serviceName: payload.serviceName,
        date: payload.date,
        timeSlot: payload.timeSlot,
        stylistName: payload.stylistName,
        manageUrl,
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light dark">
          <meta name="supported-color-schemes" content="light dark">
          <style>
            :root { color-scheme: light dark; supported-color-schemes: light dark; }
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f7faf8; margin: 0; padding: 24px; color: #112e20; }
            .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #dbe5e0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
            .header { background: #071a14; background-image: linear-gradient(135deg, #071a14 0%, #112e20 100%); color: #ffffff !important; padding: 32px 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; color: #ffffff !important; }
            .header h1 span { color: #ffffff !important; }
            .badge { display: inline-block; background: rgba(254, 117, 60, 0.2); color: #fe753c !important; border: 1px solid #fe753c; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-bottom: 12px; text-transform: uppercase; }
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
            <div class="header" style="background-color: #071a14; background-image: linear-gradient(135deg, #071a14 0%, #112e20 100%); color: #ffffff; padding: 32px 24px; text-align: center;">
              <div class="badge" style="display: inline-block; background-color: rgba(254, 117, 60, 0.2); color: #fe753c; border: 1px solid #fe753c; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-bottom: 12px; text-transform: uppercase;">Appointment Voucher</div>
              <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px; color: #ffffff !important; font-weight: bold; text-align: center;"><span style="color: #ffffff !important;">StyleX Signature Salon</span></h1>
              <p style="margin: 6px 0 0 0; color: #a6d0be !important; font-size: 13px;">Tirur Outlet • Kerala</p>
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
                  <td class="label">Selected Service</td>
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
              </table>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${manageUrl}" style="background-color: #fe753c; color: #ffffff; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">Manage or Reschedule Booking</a>
              </div>
              <p style="font-size: 13px; color: #555;">An interactive calendar invite (<strong>invite.ics</strong>) is attached. Tap <em>Add to Calendar</em> to sync your appointment.</p>
              <p style="font-size: 13px; color: #555;">Please arrive 10 minutes prior to your appointment time. For any schedule adjustments, please contact our front desk at <strong>+91 96561 11149</strong>.</p>
            </div>
            <div class="footer">
              <p style="margin: 0;">StyleX Signature Salon, One Arcade, Tirur, Kerala 676101</p>
              <p style="margin: 4px 0 0 0;">WhatsApp: +91 96561 11149 • stylexsignaturesalon@gmail.com</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const textFallback = `Dear ${payload.customerName},\n\n` +
        `Your appointment at StyleX Signature Salon is confirmed!\n\n` +
        `Booking Ref: ${payload.bookingRef}\n` +
        `Selected Service: ${payload.serviceName}\n` +
        `Date: ${payload.date}\n` +
        `Time Slot: ${payload.timeSlot}\n` +
        (payload.stylistName ? `Artisan: ${payload.stylistName}\n` : '') +
        `\nManage or Reschedule: ${manageUrl}\n\n` +
        `StyleX Signature Salon, One Arcade, Tirur, Kerala 676101\n` +
        `WhatsApp: +91 96561 11149 • stylexsignaturesalon@gmail.com\n`;

      // Check if calendar invite attachments are enabled in settings
      const calendarSetting = await prisma.salonSetting.findUnique({
        where: { key: 'emailCalendarInvites' },
      });
      const attachCalendar = !calendarSetting || (calendarSetting.value !== 'false' && (calendarSetting.value as any) !== false);

      const fromAddress = env.SMTP_FROM || '"StyleX Signature Salon" <stylexsignaturesalon@gmail.com>';

      const mailOptions: any = {
        from: fromAddress,
        to: payload.toEmail,
        replyTo: 'stylexsignaturesalon@gmail.com',
        subject: `Appointment Confirmed: ${payload.bookingRef} at StyleX Signature Salon`,
        text: textFallback,
        html: htmlContent,
        headers: {
          'X-Mailer': 'StyleX Signature Salon Gateway',
          'X-Entity-Ref-ID': payload.bookingRef,
        },
      };

      if (attachCalendar) {
        mailOptions.attachments = [
          {
            filename: 'invite.ics',
            content: icsContent,
            contentType: 'text/calendar; charset=utf-8; method=REQUEST',
          },
        ];
        mailOptions.icalEvent = {
          filename: 'invite.ics',
          method: 'REQUEST',
          content: icsContent,
        };
      }

      const info = await transporter.sendMail(mailOptions);

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
      const manageUrl = normalizeManageUrl(payload.manageUrl);
      const icsContent = generateICS({
        bookingRef: payload.bookingRef,
        customerName: payload.customerName,
        customerEmail: payload.toEmail,
        serviceName: payload.serviceName,
        date: payload.date,
        timeSlot: payload.timeSlot,
        stylistName: payload.stylistName,
        manageUrl,
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light dark">
          <meta name="supported-color-schemes" content="light dark">
          <style>
            :root { color-scheme: light dark; supported-color-schemes: light dark; }
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f7faf8; margin: 0; padding: 24px; color: #112e20; }
            .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #dbe5e0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
            .header { background: #071a14; background-image: linear-gradient(135deg, #071a14 0%, #112e20 100%); color: #ffffff !important; padding: 32px 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; color: #ffffff !important; }
            .header h1 span { color: #ffffff !important; }
            .badge { display: inline-block; background: rgba(254, 117, 60, 0.2); color: #fe753c !important; border: 1px solid #fe753c; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-bottom: 12px; text-transform: uppercase; }
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
            <div class="header" style="background-color: #071a14; background-image: linear-gradient(135deg, #071a14 0%, #112e20 100%); color: #ffffff; padding: 32px 24px; text-align: center;">
              <div class="badge" style="display: inline-block; background-color: rgba(254, 117, 60, 0.2); color: #fe753c; border: 1px solid #fe753c; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-bottom: 12px; text-transform: uppercase;">Appointment Updated</div>
              <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px; color: #ffffff !important; font-weight: bold; text-align: center;"><span style="color: #ffffff !important;">StyleX Signature Salon</span></h1>
              <p style="margin: 6px 0 0 0; color: #a6d0be !important; font-size: 13px;">Tirur Outlet • Kerala</p>
            </div>
            <div class="content">
              <p>Dear <strong>${payload.customerName}</strong>,</p>
              <p>Your appointment schedule has been successfully updated:</p>
              <div class="ref-box">
                <div class="ref-title">Booking Confirmation Code</div>
                <div class="ref-number">${payload.bookingRef}</div>
              </div>
              <table class="details-table">
                <tr>
                  <td class="label">Selected Service</td>
                  <td class="value">${payload.serviceName}</td>
                </tr>
                <tr>
                  <td class="label">New Date</td>
                  <td class="value">${payload.date}</td>
                </tr>
                <tr>
                  <td class="label">New Time Slot</td>
                  <td class="value">${payload.timeSlot}</td>
                </tr>
                ${payload.stylistName ? `
                <tr>
                  <td class="label">Artisan / Stylist</td>
                  <td class="value">${payload.stylistName}</td>
                </tr>
                ` : ''}
              </table>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${manageUrl}" style="background-color: #fe753c; color: #ffffff; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">Manage Appointment</a>
              </div>
              <p style="font-size: 13px; color: #555;">Updated calendar invite (<strong>invite.ics</strong>) is attached.</p>
            </div>
            <div class="footer">
              <p style="margin: 0;">StyleX Signature Salon, One Arcade, Tirur, Kerala 676101</p>
              <p style="margin: 4px 0 0 0;">WhatsApp: +91 96561 11149 • stylexsignaturesalon@gmail.com</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const textFallback = `Dear ${payload.customerName},\n\n` +
        `Your appointment at StyleX Signature Salon has been updated.\n\n` +
        `Booking Ref: ${payload.bookingRef}\n` +
        `Service: ${payload.serviceName}\n` +
        `New Date: ${payload.date}\n` +
        `New Time Slot: ${payload.timeSlot}\n` +
        (payload.stylistName ? `Artisan: ${payload.stylistName}\n` : '') +
        `\nManage Appointment: ${manageUrl}\n\n` +
        `StyleX Signature Salon, One Arcade, Tirur, Kerala 676101\n` +
        `WhatsApp: +91 96561 11149 • stylexsignaturesalon@gmail.com\n`;

      // Check if calendar invite attachments are enabled in settings
      const calendarSetting = await prisma.salonSetting.findUnique({
        where: { key: 'emailCalendarInvites' },
      });
      const attachCalendar = !calendarSetting || (calendarSetting.value !== 'false' && (calendarSetting.value as any) !== false);

      const fromAddress = env.SMTP_FROM || '"StyleX Signature Salon" <stylexsignaturesalon@gmail.com>';

      const mailOptions: any = {
        from: fromAddress,
        to: payload.toEmail,
        replyTo: 'stylexsignaturesalon@gmail.com',
        subject: `Appointment Rescheduled: ${payload.bookingRef} - StyleX Signature Salon`,
        text: textFallback,
        html: htmlContent,
        headers: {
          'X-Mailer': 'StyleX Signature Salon Gateway',
          'X-Entity-Ref-ID': payload.bookingRef,
        },
      };

      if (attachCalendar) {
        mailOptions.attachments = [
          {
            filename: 'invite.ics',
            content: icsContent,
            contentType: 'text/calendar; charset=utf-8; method=REQUEST',
          },
        ];
        mailOptions.icalEvent = {
          filename: 'invite.ics',
          method: 'REQUEST',
          content: icsContent,
        };
      }

      const info = await transporter.sendMail(mailOptions);

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
      const fromAddress = env.SMTP_FROM || '"StyleX Signature Salon" <stylexsignaturesalon@gmail.com>';

      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #dbe5e0; border-radius: 16px;">
          <h2 style="color: #991b1b; margin-top:0;">Appointment Cancelled</h2>
          <p>Dear <strong>${payload.customerName}</strong>,</p>
          <p>Your appointment <strong>${payload.bookingRef}</strong> for <strong>${payload.serviceName}</strong> on ${payload.date} at ${payload.timeSlot} has been cancelled.</p>
          <p>If you'd like to book another session at any time, please visit <a href="https://stylexsalon.in/">stylexsalon.in</a>.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color:#777; font-size:12px; margin:0;">StyleX Signature Salon • One Arcade, Tirur, Kerala 676101</p>
          <p style="color:#777; font-size:12px; margin:4px 0 0 0;">WhatsApp: +91 96561 11149 • stylexsignaturesalon@gmail.com</p>
        </div>
      `;

      const textFallback = `Dear ${payload.customerName},\n\n` +
        `Your appointment ${payload.bookingRef} for ${payload.serviceName} on ${payload.date} at ${payload.timeSlot} has been cancelled.\n\n` +
        `Book another session anytime at https://stylexsalon.in/\n\n` +
        `StyleX Signature Salon, One Arcade, Tirur, Kerala 676101\n` +
        `WhatsApp: +91 96561 11149 • stylexsignaturesalon@gmail.com\n`;

      const info = await transporter.sendMail({
        from: fromAddress,
        to: payload.toEmail,
        replyTo: 'stylexsignaturesalon@gmail.com',
        subject: `Appointment Cancelled: ${payload.bookingRef} - StyleX Signature Salon`,
        text: textFallback,
        html: htmlContent,
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
      const fromAddress = env.SMTP_FROM || '"StyleX Signature Salon" <stylexsignaturesalon@gmail.com>';

      const info = await transporter.sendMail({
        from: fromAddress,
        to: toEmail,
        replyTo: 'stylexsignaturesalon@gmail.com',
        subject: '✨ StyleX Signature Salon — Email Dispatch Test',
        text: `StyleX Email Notification System Online\n\nThis is a verification email from your StyleX Signature Salon backend.\nConnected via ${env.SMTP_HOST}:${env.SMTP_PORT}\nSender: ${env.SMTP_USER}\n\nSupport: stylexsignaturesalon@gmail.com`,
        html: `
          <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #dbe5e0; border-radius: 16px; background:#fff;">
            <h2 style="color: #112e20; margin-top:0;">StyleX Email Notification System Online</h2>
            <p>This is a verification email from your StyleX Signature Salon backend.</p>
            <div style="background:#f0f5f1; padding:16px; border-radius:10px; margin:16px 0;">
              <p style="margin:0; font-size:13px; color:#185341;"><strong>Status:</strong> Connected via ${env.SMTP_HOST}:${env.SMTP_PORT}</p>
              <p style="margin:4px 0 0 0; font-size:13px; color:#185341;"><strong>Sender Account:</strong> ${env.SMTP_USER}</p>
            </div>
            <p style="font-size:12px; color:#777;">Automated client passes, calendar invites, and reschedule notifications will be dispatched from this account.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
            <p style="font-size:11px; color:#999; margin:0;">StyleX Signature Salon, One Arcade, Tirur • stylexsignaturesalon@gmail.com</p>
          </div>
        `,
      });
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
