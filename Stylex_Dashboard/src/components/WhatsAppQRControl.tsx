import React, { useState, useEffect } from 'react';
import { WhatsAppIcon } from '../utils/whatsapp';
import { DashboardApi } from '../services/api';

interface WhatsAppQRControlProps {
  isConnected: boolean;
  connectedPhone?: string;
  onToggleConnected: (connected: boolean) => void;
  disabled?: boolean;
}

interface BotStatusState {
  connected: boolean;
  qrImage: string | null;
  phoneNumber: string | null;
  pushname: string | null;
  status: string;
}

export const WhatsAppQRControl: React.FC<WhatsAppQRControlProps> = ({
  isConnected: propConnected,
  connectedPhone = '+91 96561 11149',
  onToggleConnected,
  disabled = false,
}) => {
  const [botStatus, setBotStatus] = useState<BotStatusState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [testPhone, setTestPhone] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testFeedback, setTestFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUnlinking, setIsUnlinking] = useState(false);

  const fetchBotStatus = async () => {
    try {
      const data = await DashboardApi.getWhatsAppBotStatus();
      if (data) {
        setBotStatus(data);
        if (typeof data.connected === 'boolean' && data.connected !== propConnected) {
          onToggleConnected(data.connected);
        }
      }
    } catch {
      // In offline or local fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBotStatus();
    // Poll live status every 4s to catch QR refresh and instantaneous scan events
    const interval = setInterval(fetchBotStatus, 4000);
    return () => clearInterval(interval);
  }, [propConnected]);

  const handleSendTestMessage = async () => {
    if (!testPhone.trim()) return;
    setIsSendingTest(true);
    setTestFeedback(null);
    try {
      const res = await DashboardApi.sendWhatsAppTest(testPhone.trim());
      if (res?.success) {
        setTestFeedback({ type: 'success', text: '✅ Test message dispatched via linked salon WhatsApp!' });
        setTestPhone('');
      } else {
        setTestFeedback({ type: 'error', text: res?.message || '❌ Failed to send test message' });
      }
    } catch (err: any) {
      setTestFeedback({ type: 'error', text: err?.message || '❌ Failed to communicate with WhatsApp gateway' });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleUnlink = async () => {
    if (!window.confirm('Are you sure you want to unlink this WhatsApp device? Automated booking dispatch will pause until re-scanned.')) {
      return;
    }
    setIsUnlinking(true);
    try {
      await DashboardApi.disconnectWhatsApp();
      onToggleConnected(false);
      await fetchBotStatus();
    } catch (e) {
      console.error('Error disconnecting WhatsApp:', e);
    } finally {
      setIsUnlinking(false);
    }
  };

  const isActuallyConnected = Boolean(botStatus?.connected || propConnected);
  const displayPhone = botStatus?.phoneNumber ? `+${botStatus.phoneNumber}` : connectedPhone;
  const displayName = botStatus?.pushname ? `(${botStatus.pushname})` : '(StyleX Tirur Desk)';

  return (
    <section className="bg-white dark:bg-[#15201a] rounded-xl p-6 shadow-sm flex flex-col gap-5 border border-[#c2c8c2]/30 dark:border-white/10 transition-colors">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#c2c8c2]/30 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#25D366]/15 dark:bg-[#25D366]/20 text-[#128C7E] dark:text-[#25D366] flex items-center justify-center shrink-0">
            <WhatsAppIcon className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base text-[#112e20] dark:text-white font-semibold">
                WhatsApp Bot Gateway
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                  isActuallyConnected
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActuallyConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                {isActuallyConnected ? 'Online & Linked' : 'Awaiting QR Scan'}
              </span>
            </div>
            <span className="text-xs text-[#424844] dark:text-[#a0aca4] mt-0.5">
              Automated booking pass dispatch, reschedule receipts & salon desk bot
            </span>
          </div>
        </div>

        {/* Diagnostic Refresh Button */}
        <button
          type="button"
          onClick={fetchBotStatus}
          disabled={isLoading}
          className="self-start sm:self-center px-3 py-1.5 rounded-lg border border-stone-200 dark:border-white/10 hover:bg-stone-50 dark:hover:bg-white/5 text-stone-600 dark:text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className={`material-symbols-outlined text-[15px] ${isLoading ? 'animate-spin' : ''}`}>
            sync
          </span>
          <span>Check Status</span>
        </button>
      </div>

      {isActuallyConnected ? (
        /* ========================================================================= */
        /* PRODUCTION CONNECTED STATE */
        /* ========================================================================= */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#f0f5f1] dark:bg-[#1a2520] border border-[#c2c8c2]/30 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                ✓
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase text-[#727973] dark:text-[#a0aca4] font-bold tracking-wider">
                  Active Linked WhatsApp
                </span>
                <span className="text-sm font-semibold text-[#112e20] dark:text-white">
                  {displayPhone} <span className="font-normal text-xs text-[#727973] dark:text-[#88998f]">{displayName}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800/40">
                Session Active &amp; Ready
              </span>
              <button
                type="button"
                disabled={disabled || isUnlinking}
                onClick={handleUnlink}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                  disabled || isUnlinking
                    ? 'border-neutral-200 dark:border-white/10 text-neutral-400 dark:text-neutral-500 cursor-not-allowed opacity-60'
                    : 'border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer'
                }`}
              >
                {isUnlinking ? 'Unlinking...' : 'Unlink Device'}
              </button>
            </div>
          </div>

          {/* Verification / Test Sender */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#121c16] border border-stone-200 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#112e20] dark:text-stone-200 uppercase tracking-wider block">
                Send Test Verification Message
              </label>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                Tests outbound delivery to any mobile
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="tel"
                placeholder="Enter 10-digit mobile (e.g. 9656111149)"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                disabled={isSendingTest}
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#f0f5f1] dark:bg-white/5 border border-stone-300 dark:border-white/10 text-sm text-[#112e20] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#112e20] dark:focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleSendTestMessage}
                disabled={isSendingTest || !testPhone.trim()}
                className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                <span>{isSendingTest ? 'Sending...' : 'Send Test WhatsApp'}</span>
              </button>
            </div>
            {testFeedback && (
              <p
                className={`text-xs font-medium pt-1 ${
                  testFeedback.type === 'success'
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-rose-700 dark:text-rose-400'
                }`}
              >
                {testFeedback.text}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* PRODUCTION QR CODE PAIRING STATE */
        /* ========================================================================= */
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-5 sm:p-6 rounded-xl bg-[#f0f5f1]/60 dark:bg-[#1a2520]/60 border border-[#c2c8c2]/40 dark:border-white/10">
          {/* QR Code Presentation Box */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="bg-white p-3.5 rounded-2xl shadow-md border border-[#c2c8c2]/40 relative">
              <div className="w-48 h-48 sm:w-56 sm:h-56 relative flex items-center justify-center bg-white rounded-xl overflow-hidden">
                {botStatus?.qrImage ? (
                  <img
                    src={botStatus.qrImage}
                    alt="WhatsApp Web Pairing QR Code"
                    className="w-full h-full object-contain animate-fadeIn"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <span className="material-symbols-outlined text-3xl text-emerald-700 animate-spin">
                      progress_activity
                    </span>
                    <span className="text-xs text-stone-600 font-medium">
                      Generating salon WhatsApp QR code...
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#727973] dark:text-[#a0aca4]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Sync Active
              </span>
              <span>•</span>
              <button
                type="button"
                onClick={fetchBotStatus}
                className="text-[#112e20] dark:text-emerald-400 font-semibold hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-[13px]">refresh</span>
                <span>Refresh Now</span>
              </button>
            </div>
          </div>

          {/* Pairing Instructions */}
          <div className="flex flex-col gap-4 text-xs text-[#424844] dark:text-[#a0aca4]">
            <div>
              <h3 className="text-sm font-semibold text-[#112e20] dark:text-white">
                Pair Salon Phone with WhatsApp Gateway
              </h3>
              <p className="mt-1 leading-relaxed">
                Scan this QR code using the official StyleX salon phone to authorize automated customer booking confirmations.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#112e20] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Open <strong>WhatsApp</strong> on the official salon phone
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#112e20] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Tap <strong>Settings</strong> (or <strong>⋮ Menu</strong> on Android) &gt; <strong>Linked Devices</strong> &gt; <strong>Link a Device</strong>
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#112e20] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Point camera at this screen to pair. Session will persist permanently across server restarts.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11.5px] leading-relaxed">
              💡 <strong>100% Free &amp; Instant:</strong> Dispatches automated WhatsApp passes directly from your own phone number without per-message Meta fees.
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
