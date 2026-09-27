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
              `📍 *Location:* StyleX Flagship, City Center, Tirur, Malappuram\n` +
              `📞 *Salon Helpline:* +91 97478 64111\n\n` +
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
}
