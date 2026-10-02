import axios from 'axios';
import { env } from '../config/env';

export interface BookingNotificationPayload {
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  total: number;
  stylistName?: string;
  manageUrl?: string;
}

export class WhatsAppService {
  /**
   * Generates a direct WhatsApp click-to-chat URL with pre-filled message
   */
  public static generateDirectChatUrl(phone: string, text: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }

  /**
   * Generates a QR Code image URL for instant WhatsApp booking / chat
   */
  public static generateWhatsAppQrCodeUrl(phone?: string, defaultMessage?: string): string {
    const targetPhone = phone || env.SALON_WHATSAPP_NUMBER;
    const msg = defaultMessage || 'Hi StyleX, I would like to enquire about appointment availability.';
    const chatUrl = this.generateDirectChatUrl(targetPhone, msg);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(chatUrl)}&format=png`;
  }

  /**
   * Sends an automated booking confirmation via Meta WhatsApp Cloud API
   */
  public static async sendBookingConfirmation(
    payload: BookingNotificationPayload
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const token = env.WHATSAPP_API_TOKEN;
    const phoneId = env.WHATSAPP_PHONE_NUMBER_ID;

    // If Cloud API credentials are not set, return simulated success for development
    if (!token || !phoneId) {
      console.log('ℹ️ [WhatsApp Service] Meta Cloud API credentials not configured. Notification logged locally:');
      console.log(`To: ${payload.customerPhone} | Ref: ${payload.bookingRef} | Service: ${payload.serviceName} | Time: ${payload.timeSlot}`);
      return { success: true, messageId: `SIMULATED_${Date.now()}` };
    }

    try {
      const cleanPhone = payload.customerPhone.replace(/[^0-9]/g, '');
      const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;

      const response = await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: `✨ *StyleX Signature Salon Appointment Confirmed!*\n\n` +
              `Dear *${payload.customerName}*,\n` +
              `Your reservation at StyleX Tirur Flagship has been confirmed.\n\n` +
              `🔖 *Booking Ref:* ${payload.bookingRef}\n` +
              `💇 *Service:* ${payload.serviceName}\n` +
              `📅 *Date:* ${payload.date}\n` +
              `⏰ *Time Slot:* ${payload.timeSlot}\n` +
              `${payload.stylistName ? `👤 *Stylist:* ${payload.stylistName}\n` : ''}` +
              `💰 *Estimated Total:* ₹${payload.total.toLocaleString('en-IN')}\n\n` +
              (payload.manageUrl ? `📲 *Manage or Reschedule:* ${payload.manageUrl}\n\n` : '') +
              `📍 *Location:* StyleX Flagship, City Center, Tirur, Malappuram\n` +
              `📞 *Salon Helpline:* +91 96561 11149\n\n` +
              `We look forward to giving you an exceptional luxury grooming experience!`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const messageId = response.data?.messages?.[0]?.id;
      return { success: true, messageId };
    } catch (error: any) {
      console.error('❌ WhatsApp Cloud API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  /**
   * Sends an automated reschedule notification via Meta WhatsApp Cloud API
   */
  public static async sendBookingRescheduled(
    payload: BookingNotificationPayload
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const token = env.WHATSAPP_API_TOKEN;
    const phoneId = env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneId) {
      console.log(`ℹ️ [WhatsApp Service] Reschedule notification logged for ${payload.customerPhone} (Ref: ${payload.bookingRef} -> ${payload.date} ${payload.timeSlot})`);
      return { success: true, messageId: `SIMULATED_RESCHEDULE_${Date.now()}` };
    }

    try {
      const cleanPhone = payload.customerPhone.replace(/[^0-9]/g, '');
      const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;

      const response = await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: `🔄 *StyleX Appointment Rescheduled!*\n\n` +
              `Dear *${payload.customerName}*,\n` +
              `Your reservation has been successfully updated.\n\n` +
              `🔖 *Booking Ref:* ${payload.bookingRef}\n` +
              `💇 *Service:* ${payload.serviceName}\n` +
              `📅 *New Date:* ${payload.date}\n` +
              `⏰ *New Time:* ${payload.timeSlot}\n` +
              `${payload.stylistName ? `👤 *Stylist:* ${payload.stylistName}\n` : ''}\n` +
              (payload.manageUrl ? `📲 *View / Manage:* ${payload.manageUrl}\n\n` : '') +
              `📍 *Location:* StyleX Flagship, One Arcade, Tirur\n` +
              `📞 *Salon Helpline:* +91 96561 11149`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, messageId: response.data?.messages?.[0]?.id };
    } catch (error: any) {
      console.error('❌ WhatsApp Reschedule Error:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Sends an automated cancellation notification via Meta WhatsApp Cloud API
   */
  public static async sendBookingCancelled(
    payload: { customerName: string; customerPhone: string; bookingRef: string; serviceName: string; date: string; timeSlot: string }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const token = env.WHATSAPP_API_TOKEN;
    const phoneId = env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneId) {
      console.log(`ℹ️ [WhatsApp Service] Cancellation notification logged for ${payload.customerPhone} (Ref: ${payload.bookingRef})`);
      return { success: true, messageId: `SIMULATED_CANCEL_${Date.now()}` };
    }

    try {
      const cleanPhone = payload.customerPhone.replace(/[^0-9]/g, '');
      const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;

      const response = await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: `❌ *StyleX Appointment Cancelled*\n\n` +
              `Dear *${payload.customerName}*,\n` +
              `Your reservation (${payload.bookingRef}) for *${payload.serviceName}* on ${payload.date} at ${payload.timeSlot} has been cancelled.\n\n` +
              `If you wish to book a new appointment in the future, visit us at: https://stylexsalon.in/booking\n\n` +
              `We hope to welcome you soon!\n` +
              `StyleX Signature Salon Tirur • +91 96561 11149`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, messageId: response.data?.messages?.[0]?.id };
    } catch (error: any) {
      console.error('❌ WhatsApp Cancellation Error:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }
}
