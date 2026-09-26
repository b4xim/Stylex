# StyleX Signature Salon — WhatsApp & Email Integration Guide
**Document Purpose:** Engineering guide for developing automated WhatsApp and Email notifications, Admin Dashboard QR code pairing, and session persistence.

---

## 1. Overview & Notification Strategy

When a customer confirms an appointment on the StyleX website:
1. **Database Entry:** Appointment is committed to PostgreSQL (ACID locked).
2. **Email Notification (100% Free):** Automated HTML appointment pass dispatched to the guest's email.
3. **WhatsApp Notification (100% Free via Self-Hosted Bot):** Salon phone automated bot dispatches a WhatsApp message containing their booking reference, stylist, time, and salon map link.
4. **Admin Dashboard Control:** Managers can link/unlink the salon WhatsApp via a live QR code on the admin portal.

---

## 2. Automated Email Integration (Resend or Gmail SMTP)

### Option A: Gmail SMTP with `nodemailer` (100% Free, Up to 500 emails/day)
Best if the salon already has a dedicated Google / Gmail account (e.g. `stylextirur@gmail.com`).

#### Installation
```bash
npm install nodemailer
```

#### Backend Implementation (`services/emailService.js`)
```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,       // e.g., stylextirur@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD // 16-character Google App Password
  }
});

export async function sendBookingEmail(booking) {
  const mailOptions = {
    from: '"StyleX Signature Salon" <stylextirur@gmail.com>',
    to: booking.email,
    subject: `Your StyleX Appointment Pass (Ref: ${booking.bookingRef})`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #071a14; color: #ffffff; padding: 30px; border-radius: 16px;">
        <h2 style="color: #fe753c; margin-top: 0;">StyleX Signature Salon Pass</h2>
        <p>Dear Guest,</p>
        <p>Your appointment has been reserved at our Tirur Flagship salon.</p>
        
        <div style="background: #0f2d22; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p><strong>Booking Reference:</strong> ${booking.bookingRef}</p>
          <p><strong>Service:</strong> ${booking.serviceName}</p>
          <p><strong>Date & Time:</strong> ${booking.date} at ${booking.time}</p>
          <p><strong>Preferred Stylist:</strong> ${booking.stylist || 'Assigned on arrival'}</p>
          <p><strong>Location:</strong> One Arcade, Near Lenskart, KG Padi Rd, Tirur</p>
        </div>

        <p style="font-size: 13px; color: #9eb6aa;">Zero prepayment required. Payment upon completion at desk.</p>
        <p style="font-size: 13px; color: #9eb6aa;">Need to reschedule? Call +91 96561 11149 or reply to this email.</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}
```

---

## 3. WhatsApp Bot & Admin QR Code Pairing (`whatsapp-web.js`)

This method turns the official salon mobile number into an automated booking assistant with **zero per-message fees** and **no Meta API approval wait times**.

### Key Concept: How QR Pairing Works in Admin Dashboard
1. The backend initializes `whatsapp-web.js`.
2. When disconnected, it receives raw QR data and converts it into a `base64` image (`qrcode.toDataURL(qr)`).
3. The Admin Dashboard calls `GET /api/admin/whatsapp/status` and displays the QR image.
4. The manager opens WhatsApp on the salon phone > **Linked Devices** > scans the screen.
5. The backend triggers the `ready` event, and saves session tokens to `./whatsapp-auth` on the OCI disk.
6. **Subsequent server restarts do NOT require scanning again!**

---

### Backend Implementation (`services/whatsappService.js`)

```javascript
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode';

let qrDataUrl = null;
let isConnected = false;
let clientInfo = null;

// Persistent session stored on OCI disk
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './whatsapp-auth' // Stored in persistent volume
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  }
});

// Event: QR Code received for unlinked session
client.on('qr', async (qr) => {
  console.log('[WhatsApp] QR code generated');
  qrDataUrl = await qrcode.toDataURL(qr);
  isConnected = false;
});

// Event: Successfully authenticated
client.on('authenticated', () => {
  console.log('[WhatsApp] Authenticated successfully');
});

// Event: Client ready to send/receive messages
client.on('ready', () => {
  console.log('[WhatsApp] Client is ready!');
  isConnected = true;
  qrDataUrl = null;
  clientInfo = client.info;
});

// Event: Disconnected or logged out from phone
client.on('disconnected', (reason) => {
  console.log('[WhatsApp] Disconnected:', reason);
  isConnected = false;
  qrDataUrl = null;
  clientInfo = null;
  client.initialize(); // Re-initialize to generate a fresh QR
});

client.initialize();

// Getter functions for API controller
export function getWhatsAppStatus() {
  return {
    connected: isConnected,
    qrImage: qrDataUrl,
    phoneNumber: clientInfo?.wid?.user || null,
    pushname: clientInfo?.pushname || null
  };
}

// Send automated booking pass
export async function sendBookingWhatsApp(booking) {
  if (!isConnected) {
    console.warn('[WhatsApp] Cannot send message: Bot is disconnected');
    return false;
  }

  // Sanitize phone number (strip spaces, dashes, ensure country code)
  const cleanPhone = booking.phone.replace(/\D/g, '');
  const countryCode = booking.phoneCountryCode?.replace(/\+/g, '') || '91';
  const fullPhone = cleanPhone.startsWith(countryCode) ? cleanPhone : `${countryCode}${cleanPhone}`;
  const chatId = `${fullPhone}@c.us`;

  const messageText = `✨ *StyleX Signature Salon — Booking Pass* ✨
━━━━━━━━━━━━━━━━━━━━
Booking Reference: *${booking.bookingRef}*

👤 *Guest Details:* ${booking.phoneCountryCode} ${booking.phone}
💇 *Service:* ${booking.serviceName}
🗓️ *Date:* ${booking.date}
⏰ *Time:* ${booking.time} IST
✂️ *Stylist:* ${booking.stylist || 'Any Available Master Stylist'}

📍 *Salon Address:*
One Arcade, Near Lenskart, KG Padi Rd, Tirur
🗺️ *Google Maps:* https://maps.google.com/?q=StyleX+Salon+Tirur

━━━━━━━━━━━━━━━━━━━━
• _Zero prepayment required. Settle at desk upon completion._
• _To reschedule or cancel, reply directly to this message or call +91 96561 11149._

_Thank you for choosing StyleX Tirur!_`;

  try {
    await client.sendMessage(chatId, messageText);
    console.log(`[WhatsApp] Booking pass sent to ${chatId}`);
    return true;
  } catch (error) {
    console.error(`[WhatsApp] Failed to send message to ${chatId}:`, error);
    return false;
  }
}
```

---

### Backend API Endpoints (`routes/adminWhatsApp.js`)

```javascript
import express from 'express';
import { getWhatsAppStatus, sendBookingWhatsApp } from '../services/whatsappService.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/whatsapp/status
router.get('/status', requireAdminAuth, (req, res) => {
  res.json(getWhatsAppStatus());
});

// POST /api/admin/whatsapp/test
router.post('/test', requireAdminAuth, async (req, res) => {
  const { testPhone } = req.body;
  const success = await sendBookingWhatsApp({
    bookingRef: 'SX-TEST',
    phone: testPhone,
    phoneCountryCode: '+91',
    serviceName: 'Test Appointment Check',
    date: 'Today',
    time: 'Now',
    stylist: 'System Verification'
  });
  res.json({ success });
});

export default router;
```

---

## 4. Admin Dashboard React Component (`WhatsAppControl.tsx`)

Place this component in the Admin Portal under **Settings > WhatsApp Gateway**:

```tsx
import React, { useState, useEffect } from 'react';

interface WhatsAppStatus {
  connected: boolean;
  qrImage: string | null;
  phoneNumber: string | null;
  pushname: string | null;
}

export const WhatsAppControl: React.FC = () => {
  const [status, setStatus] = useState<WhatsAppStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [testPhone, setTestPhone] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/admin/whatsapp/status', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error('Failed to load status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Poll status every 4 seconds to detect when QR scan completes
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSendTest = async () => {
    if (!testPhone) return;
    setTestResult('Sending...');
    const res = await fetch('/api/admin/whatsapp/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ testPhone })
    });
    const result = await res.json();
    setTestResult(result.success ? '✅ Test message sent!' : '❌ Failed to send');
  };

  if (loading) {
    return <div className="p-6 text-gray-400">Loading WhatsApp gateway status...</div>;
  }

  return (
    <div className="bg-[#071a14] border border-[#1d5644] rounded-2xl p-6 max-w-2xl text-white space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-lg font-bold text-white">WhatsApp Bot Gateway</h2>
          <p className="text-xs text-[#9eb6aa]">Automated booking dispatch via salon phone</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
          status?.connected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
        }`}>
          <span className={`w-2 h-2 rounded-full ${status?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          {status?.connected ? 'Online & Linked' : 'Action Required'}
        </span>
      </div>

      {status?.connected ? (
        /* CONNECTED STATE */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0e372b] border border-[#276451] flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-[#9eb6aa] font-bold">Connected Number</p>
              <p className="text-base font-semibold text-white">+{status.phoneNumber} ({status.pushname || 'Salon Desk'})</p>
            </div>
            <span className="text-emerald-400 text-2xl font-bold">✓</span>
          </div>

          {/* Test Sender */}
          <div className="pt-2 space-y-2">
            <label className="text-xs text-[#9eb6aa] font-bold uppercase">Send Test Verification Message</label>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="Enter 10-digit mobile"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#0f2d22] border border-white/15 text-white text-sm focus:outline-none focus:border-[#fe753c] w-full"
              />
              <button
                onClick={handleSendTest}
                className="px-5 py-2 bg-[#fe753c] hover:bg-[#e0622a] font-semibold text-sm rounded-xl cursor-pointer transition-colors whitespace-nowrap"
              >
                Send Test
              </button>
            </div>
            {testResult && <p className="text-xs font-medium pt-1 text-[#caead5]">{testResult}</p>}
          </div>
        </div>
      ) : (
        /* DISCONNECTED / SCAN QR STATE */
        <div className="text-center space-y-4 py-2">
          <p className="text-sm text-[#d4ebe1]">
            To enable automated WhatsApp confirmations, link the salon phone by scanning the QR code below:
          </p>

          <div className="bg-white p-4 rounded-2xl inline-block shadow-xl">
            {status?.qrImage ? (
              <img src={status.qrImage} alt="WhatsApp Pairing QR" className="w-56 h-56 mx-auto" />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-gray-500 text-sm">
                Generating session QR...
              </div>
            )}
          </div>

          <div className="text-xs text-[#9eb6aa] space-y-1">
            <p>1. Open WhatsApp on the salon phone</p>
            <p>2. Tap <strong>Settings</strong> &gt; <strong>Linked Devices</strong> &gt; <strong>Link a Device</strong></p>
            <p>3. Point phone camera at the QR code above</p>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 5. Docker & OCI Deployment Specifics

Because `whatsapp-web.js` launches a headless Chromium instance, Docker requires specific system dependencies installed in the Node.js container:

### `Dockerfile` snippet for Backend
```dockerfile
FROM node:20-slim

# Install Chromium dependencies for headless WhatsApp Web
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4000
CMD ["node", "server.js"]
```

### Volume Persistence in `docker-compose.yml`
Ensure the `./whatsapp-auth` folder is mapped as a volume so credentials survive server reboots:

```yaml
services:
  backend:
    build: ./backend
    restart: always
    volumes:
      - ./whatsapp-auth:/app/whatsapp-auth # Session persists here!
    environment:
      - PORT=4000
      - DATABASE_URL=postgresql://...
```

---

## 6. Security & Anti-Ban Best Practices
1. **Transaction Notifications Only:** Only send automated messages to guests who **explicitly booked an appointment** seconds ago. Never use this library for cold promotional blasts to avoid WhatsApp rate limits.
2. **Rate Limiting:** If 5 bookings come in simultaneously, introduce a random 2–4 second delay between consecutive outbound messages.
3. **Session Backup:** The `./whatsapp-auth` directory should be included in the daily OCI backup cron alongside the PostgreSQL database.
