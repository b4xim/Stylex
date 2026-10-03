import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode';
import path from 'path';
import fs from 'fs';

export interface WhatsAppNotificationPayload {
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

export interface WhatsAppBotStatus {
  connected: boolean;
  qrImage: string | null;
  phoneNumber: string | null;
  pushname: string | null;
  status: 'INITIALIZING' | 'AWAITING_SCAN' | 'AUTHENTICATED' | 'CONNECTED' | 'DISCONNECTED';
  statusMessage?: string;
  lastUpdated: string;
}

/**
 * Removes stale Chromium lock files left behind by previous Docker containers or crashes
 */
function cleanChromiumLocks(dir: string): void {
  if (!fs.existsSync(dir)) return;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        cleanChromiumLocks(fullPath);
      } else if (
        entry.name.startsWith('Singleton') ||
        entry.name.endsWith('.lock') ||
        entry.name === 'lockfile'
      ) {
        try {
          fs.rmSync(fullPath, { force: true });
          console.log(`🧹 [WhatsApp Bot] Cleared stale Chromium profile lock: ${entry.name}`);
        } catch {}
      }
    }
  } catch (err) {
    console.warn('⚠️ [WhatsApp Bot] Warning inspecting lock files:', err);
  }
}

export class WhatsAppBotService {
  private static client: any = null;
  private static qrDataUrl: string | null = null;
  private static isClientConnected = false;
  private static clientInfo: any = null;
  private static currentStatus: WhatsAppBotStatus['status'] = 'DISCONNECTED';
  private static statusMessage: string = 'Offline';
  private static isInitializing = false;

  /**
   * Initializes the WhatsApp Web Bot with persistent session storage
   */
  public static async initialize(): Promise<void> {
    if (this.client || this.isInitializing) {
      return;
    }

    this.isInitializing = true;
    this.currentStatus = 'INITIALIZING';
    this.statusMessage = 'Launching headless browser...';

    try {
      const authDir = path.resolve(process.cwd(), 'whatsapp-auth');
      if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
      } else {
        // Clear any orphaned lock files from prior containers
        cleanChromiumLocks(authDir);
      }

      console.log('🤖 [WhatsApp Bot] Initializing self-hosted WhatsApp gateway...');

      const puppeteerOptions: any = {
        headless: true,
        dumpio: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      };

      const possibleChromiumPaths = [
        process.env.PUPPETEER_EXECUTABLE_PATH,
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
      ].filter(Boolean) as string[];

      for (const p of possibleChromiumPaths) {
        if (fs.existsSync(p)) {
          puppeteerOptions.executablePath = p;
          console.log(`🔍 [WhatsApp Bot] Using detected browser binary: ${p}`);
          break;
        }
      }

      this.statusMessage = 'Starting WhatsApp Web client...';

      this.client = new Client({
        authStrategy: new LocalAuth({
          dataPath: authDir,
        }),
        webVersionCache: {
          type: 'remote',
          remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
        },
        puppeteer: puppeteerOptions,
      });

      // Event: QR Code received for unlinked session
      this.client.on('qr', async (qr: string) => {
        try {
          this.qrDataUrl = await qrcode.toDataURL(qr, {
            margin: 2,
            width: 320,
            color: {
              dark: '#112e20',
              light: '#ffffff',
            },
          });
          this.isClientConnected = false;
          this.currentStatus = 'AWAITING_SCAN';
          this.statusMessage = 'QR code generated. Awaiting salon phone scan in dashboard.';
          console.log('📲 [WhatsApp Bot] New QR code generated. Awaiting salon phone scan in dashboard.');
        } catch (qrErr: any) {
          console.error('❌ [WhatsApp Bot] Error rendering QR code to data URL:', qrErr);
          this.statusMessage = `Failed to render QR: ${qrErr?.message || qrErr}`;
        }
      });

      // Event: Authenticated successfully
      this.client.on('authenticated', () => {
        this.currentStatus = 'AUTHENTICATED';
        this.statusMessage = 'Session authenticated. Loading salon desk...';
        console.log('🔐 [WhatsApp Bot] Session authenticated successfully.');
      });

      // Event: Ready to send and receive messages
      this.client.on('ready', () => {
        this.isClientConnected = true;
        this.qrDataUrl = null;
        this.clientInfo = this.client.info;
        this.currentStatus = 'CONNECTED';
        this.statusMessage = `Connected as +${this.clientInfo?.wid?.user || 'Unknown'} (${this.clientInfo?.pushname || 'Salon Desk'})`;
        console.log(`✅ [WhatsApp Bot] Ready! Connected as: +${this.clientInfo?.wid?.user || 'Unknown'} (${this.clientInfo?.pushname || 'Salon Desk'})`);
      });

      // Event: Disconnected or logged out from phone
      this.client.on('disconnected', (reason: string) => {
        console.warn('⚠️ [WhatsApp Bot] Disconnected from WhatsApp Web:', reason);
        this.isClientConnected = false;
        this.qrDataUrl = null;
        this.clientInfo = null;
        this.currentStatus = 'DISCONNECTED';
        this.statusMessage = `Disconnected: ${reason}`;
        
        // Re-initialize to generate a fresh QR code
        setTimeout(() => {
          this.reinitialize();
        }, 5000);
      });

      await this.client.initialize();
    } catch (error: any) {
      console.warn('⚠️ [WhatsApp Bot] Initialization deferred (Chromium or dependency unavailable):', error.message || error);
      this.currentStatus = 'DISCONNECTED';
      this.statusMessage = `Initialization error: ${error.message || error}`;
    } finally {
      this.isInitializing = false;
    }
  }

  public static async reinitialize(): Promise<void> {
    try {
      this.statusMessage = 'Restarting WhatsApp gateway...';
      if (this.client) {
        await this.client.destroy().catch(() => {});
        this.client = null;
      }
      this.isInitializing = false;
      await this.initialize();
    } catch (e: any) {
      console.error('❌ [WhatsApp Bot] Re-initialization error:', e);
      this.statusMessage = `Re-initialization error: ${e?.message || e}`;
    }
  }

  /**
   * Returns live gateway status for Admin Dashboard pairing
   */
  public static getStatus(): WhatsAppBotStatus {
    return {
      connected: this.isClientConnected,
      qrImage: this.qrDataUrl,
      phoneNumber: this.clientInfo?.wid?.user || null,
      pushname: this.clientInfo?.pushname || null,
      status: this.currentStatus,
      statusMessage: this.statusMessage,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Unlinks the current device session and regenerates a fresh QR code
   */
  public static async disconnectBot(): Promise<boolean> {
    try {
      if (this.client) {
        if (this.isClientConnected) {
          await this.client.logout().catch(() => {});
        }
        await this.client.destroy().catch(() => {});
        this.client = null;
      }
      this.isClientConnected = false;
      this.qrDataUrl = null;
      this.clientInfo = null;
      this.currentStatus = 'DISCONNECTED';

      // Clear local auth tokens if any
      const authDir = path.resolve(process.cwd(), 'whatsapp-auth');
      if (fs.existsSync(authDir)) {
        try {
          fs.rmSync(authDir, { recursive: true, force: true });
        } catch {}
      }

      // Reinitialize to produce new QR code
      setTimeout(() => {
        this.initialize();
      }, 1000);

      return true;
    } catch (err) {
      console.error('❌ [WhatsApp Bot] Disconnect error:', err);
      return false;
    }
  }

  public static isConnected(): boolean {
    return this.isClientConnected;
  }

  /**
   * Formats Indian mobile numbers to WhatsApp JID (e.g. 919876543210@c.us)
   */
  private static formatChatId(phone: string): string {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.length === 10) {
      clean = `91${clean}`;
    } else if (clean.length === 11 && clean.startsWith('0')) {
      clean = `91${clean.slice(1)}`;
    }
    return `${clean}@c.us`;
  }

  /**
   * Sends automated booking confirmation pass to client
   */
  public static async sendBookingConfirmation(
    payload: WhatsAppNotificationPayload
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isClientConnected || !this.client) {
      return { success: false, error: 'WhatsApp bot is not connected' };
    }

    try {
      const chatId = this.formatChatId(payload.customerPhone);
      const text =
        `✨ *StyleX Signature Salon — Appointment Pass* ✨\n\n` +
        `──────────\n\n` +
        `🔖 Booking Reference: *${payload.bookingRef}*\n\n` +
        `👤 *Guest Name:* ${payload.customerName}\n` +
        `💇 *Service:* ${payload.serviceName}\n` +
        `📅 *Date:* ${payload.date}\n` +
        `⏰ *Time Slot:* ${payload.timeSlot} IST\n` +
        `${payload.stylistName ? `✂️ *Stylist:* ${payload.stylistName}\n` : ''}\n` +
        (payload.manageUrl ? `📲 *Self-Service Pass (Reschedule / Cancel):*\n${payload.manageUrl}\n\n` : '') +
        `📍 *Salon Address:*\nOne Arcade, Near Lenskart, KG Padi Rd, Tirur\n` +
        `🗺️ *Google Maps:* https://maps.google.com/?q=StyleX+Salon+Tirur\n\n` +
        `──────────\n\n` +
        `• _To adjust or enquire, reply directly to this message or call +91 96561 11149._\n\n` +
        `_Thank you for choosing StyleX Tirur!_`;

      const msg = await this.client.sendMessage(chatId, text);
      return { success: true, messageId: msg?.id?._serialized || `WA_${Date.now()}` };
    } catch (err: any) {
      console.error('❌ [WhatsApp Bot] Failed to send booking confirmation:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Sends automated reschedule update notification
   */
  public static async sendBookingRescheduled(
    payload: WhatsAppNotificationPayload
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isClientConnected || !this.client) {
      return { success: false, error: 'WhatsApp bot is not connected' };
    }

    try {
      const chatId = this.formatChatId(payload.customerPhone);
      const text =
        `🔄 *StyleX Signature Salon — Appointment Rescheduled* 🔄\n\n` +
        `──────────\n\n` +
        `🔖 Booking Reference: *${payload.bookingRef}*\n\n` +
        `Dear *${payload.customerName}*,\n` +
        `Your appointment has been updated to your requested schedule:\n\n` +
        `💇 *Service:* ${payload.serviceName}\n` +
        `📅 *New Date:* ${payload.date}\n` +
        `⏰ *New Time Slot:* ${payload.timeSlot} IST\n` +
        `${payload.stylistName ? `✂️ *Stylist:* ${payload.stylistName}\n` : ''}` +
        (payload.manageUrl ? `\n📲 *View or Adjust Online:*\n${payload.manageUrl}\n` : '') +
        `\n📍 *Salon Address:* One Arcade, Near Lenskart, KG Padi Rd, Tirur\n` +
        `📞 *Reception Helpline:* +91 96561 11149\n\n` +
        `We look forward to seeing you at StyleX!`;

      const msg = await this.client.sendMessage(chatId, text);
      return { success: true, messageId: msg?.id?._serialized || `WA_${Date.now()}` };
    } catch (err: any) {
      console.error('❌ [WhatsApp Bot] Failed to send reschedule notice:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Sends automated cancellation confirmation
   */
  public static async sendBookingCancelled(
    payload: { customerPhone: string; customerName: string; bookingRef: string; serviceName: string; date: string; timeSlot: string }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isClientConnected || !this.client) {
      return { success: false, error: 'WhatsApp bot is not connected' };
    }

    try {
      const chatId = this.formatChatId(payload.customerPhone);
      const text =
        `❌ *StyleX Signature Salon — Appointment Cancelled*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `🔖 Reference: *${payload.bookingRef}*\n\n` +
        `Dear *${payload.customerName}*,\n` +
        `Your appointment for *${payload.serviceName}* on ${payload.date} at ${payload.timeSlot} has been cancelled.\n\n` +
        `If you would like to book a future session at any time, please visit:\n` +
        `https://stylexsalon.in/booking\n\n` +
        `📞 *Salon Helpline:* +91 96561 11149`;

      const msg = await this.client.sendMessage(chatId, text);
      return { success: true, messageId: msg?.id?._serialized || `WA_${Date.now()}` };
    } catch (err: any) {
      console.error('❌ [WhatsApp Bot] Failed to send cancellation notice:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Sends test verification message to any mobile number
   */
  public static async sendTestMessage(
    testPhone: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isClientConnected || !this.client) {
      return { success: false, error: 'WhatsApp bot is not connected. Scan QR code first.' };
    }

    try {
      const chatId = this.formatChatId(testPhone);
      const text =
        `✨ *StyleX Signature Salon — Test Gateway Verification* ✨\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `This is a test notification from the official StyleX automated assistant.\n\n` +
        `⏱️ Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST\n` +
        `📱 Connected Salon Desk: +${this.clientInfo?.wid?.user || 'Active'}\n\n` +
        `Automated customer booking passes are active and operating correctly.`;

      const msg = await this.client.sendMessage(chatId, text);
      return { success: true, messageId: msg?.id?._serialized };
    } catch (err: any) {
      console.error('❌ [WhatsApp Bot] Test message error:', err);
      return { success: false, error: err.message };
    }
  }
}
