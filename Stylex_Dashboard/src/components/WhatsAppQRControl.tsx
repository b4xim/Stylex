import React, { useState, useEffect } from 'react';
import { WhatsAppIcon } from '../utils/whatsapp';

interface WhatsAppQRControlProps {
  isConnected: boolean;
  connectedPhone?: string;
  onToggleConnected: (connected: boolean) => void;
  disabled?: boolean;
}

export const WhatsAppQRControl: React.FC<WhatsAppQRControlProps> = ({
  isConnected,
  connectedPhone = '+91 96561 11149',
  onToggleConnected,
  disabled = false,
}) => {
  const [countdown, setCountdown] = useState(30);

  // Auto-refresh countdown for QR pairing token
  useEffect(() => {
    if (isConnected) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  const handleRefreshQR = () => {
    setCountdown(30);
  };

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
                  isConnected
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                {isConnected ? 'Online & Linked' : 'Awaiting QR Scan'}
              </span>
            </div>
            <span className="text-xs text-[#424844] dark:text-[#a0aca4] mt-0.5">
              Automated reservation passes, instant chat dispatch & session pairing
            </span>
          </div>
        </div>
      </div>

      {isConnected ? (
        /* PRODUCTION CONNECTED STATE */
        <div className="p-4 rounded-xl bg-[#f0f5f1] dark:bg-[#1a2520] border border-[#c2c8c2]/30 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              ✓
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase text-[#727973] dark:text-[#a0aca4] font-bold tracking-wider">
                Connected Salon WhatsApp
              </span>
              <span className="text-sm font-semibold text-[#112e20] dark:text-white">
                {connectedPhone} <span className="font-normal text-xs text-[#727973] dark:text-[#88998f]">(StyleX Tirur Desk)</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800/40">
              Session Active
            </span>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onToggleConnected(false)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                disabled
                  ? 'border-neutral-200 dark:border-white/10 text-neutral-400 dark:text-neutral-500 cursor-not-allowed opacity-60'
                  : 'border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer'
              }`}
            >
              Unlink Device
            </button>
          </div>
        </div>
      ) : (
        /* PRODUCTION QR CODE PAIRING STATE */
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-5 sm:p-6 rounded-xl bg-[#f0f5f1]/60 dark:bg-[#1a2520]/60 border border-[#c2c8c2]/40 dark:border-white/10">
          {/* QR Code Presentation Box */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="bg-white p-4 rounded-2xl shadow-md border border-[#c2c8c2]/40 relative">
              {/* High-Resolution Vector QR Code */}
              <div className="w-48 h-48 sm:w-52 sm:h-52 relative flex items-center justify-center bg-white">
                <svg
                  className="w-full h-full text-[#112e20]"
                  viewBox="0 0 120 120"
                  fill="currentColor"
                  shapeRendering="crispEdges"
                >
                  {/* Top-Left Finder Square */}
                  <rect x="10" y="10" width="28" height="28" fill="#112e20" rx="3" />
                  <rect x="14" y="14" width="20" height="20" fill="white" rx="2" />
                  <rect x="18" y="18" width="12" height="12" fill="#112e20" rx="1.5" />

                  {/* Top-Right Finder Square */}
                  <rect x="82" y="10" width="28" height="28" fill="#112e20" rx="3" />
                  <rect x="86" y="14" width="20" height="20" fill="white" rx="2" />
                  <rect x="90" y="18" width="12" height="12" fill="#112e20" rx="1.5" />

                  {/* Bottom-Left Finder Square */}
                  <rect x="10" y="82" width="28" height="28" fill="#112e20" rx="3" />
                  <rect x="14" y="86" width="20" height="20" fill="white" rx="2" />
                  <rect x="18" y="90" width="12" height="12" fill="#112e20" rx="1.5" />

                  {/* Data Blocks Pattern */}
                  <rect x="42" y="12" width="4" height="4" />
                  <rect x="50" y="12" width="8" height="4" />
                  <rect x="62" y="12" width="4" height="4" />
                  <rect x="74" y="12" width="4" height="4" />

                  <rect x="42" y="20" width="8" height="4" />
                  <rect x="54" y="20" width="4" height="4" />
                  <rect x="66" y="20" width="8" height="4" />

                  <rect x="42" y="28" width="4" height="4" />
                  <rect x="50" y="28" width="8" height="4" />
                  <rect x="70" y="28" width="4" height="4" />

                  <rect x="12" y="42" width="8" height="4" />
                  <rect x="24" y="42" width="4" height="4" />
                  <rect x="32" y="42" width="8" height="4" />
                  <rect x="44" y="42" width="8" height="4" />
                  <rect x="56" y="42" width="12" height="4" />
                  <rect x="72" y="42" width="8" height="4" />
                  <rect x="84" y="42" width="4" height="4" />
                  <rect x="92" y="42" width="8" height="4" />
                  <rect x="104" y="42" width="4" height="4" />

                  <rect x="12" y="50" width="4" height="4" />
                  <rect x="20" y="50" width="8" height="4" />
                  <rect x="32" y="50" width="4" height="4" />
                  <rect x="40" y="50" width="4" height="4" />
                  <rect x="76" y="50" width="8" height="4" />
                  <rect x="88" y="50" width="4" height="4" />
                  <rect x="100" y="50" width="8" height="4" />

                  <rect x="12" y="58" width="8" height="4" />
                  <rect x="24" y="58" width="4" height="4" />
                  <rect x="36" y="58" width="8" height="4" />
                  <rect x="76" y="58" width="4" height="4" />
                  <rect x="84" y="58" width="12" height="4" />
                  <rect x="100" y="58" width="4" height="4" />

                  <rect x="12" y="66" width="4" height="4" />
                  <rect x="24" y="66" width="8" height="4" />
                  <rect x="36" y="66" width="4" height="4" />
                  <rect x="76" y="66" width="8" height="4" />
                  <rect x="92" y="66" width="4" height="4" />
                  <rect x="104" y="66" width="4" height="4" />

                  <rect x="12" y="74" width="8" height="4" />
                  <rect x="28" y="74" width="4" height="4" />
                  <rect x="40" y="74" width="8" height="4" />
                  <rect x="52" y="74" width="4" height="4" />
                  <rect x="64" y="74" width="8" height="4" />
                  <rect x="76" y="74" width="4" height="4" />
                  <rect x="88" y="74" width="8" height="4" />
                  <rect x="100" y="74" width="8" height="4" />

                  <rect x="44" y="82" width="4" height="4" />
                  <rect x="56" y="82" width="8" height="4" />
                  <rect x="68" y="82" width="4" height="4" />
                  <rect x="80" y="82" width="8" height="4" />
                  <rect x="96" y="82" width="4" height="4" />
                  <rect x="104" y="82" width="4" height="4" />

                  <rect x="44" y="90" width="8" height="4" />
                  <rect x="56" y="90" width="4" height="4" />
                  <rect x="68" y="90" width="8" height="4" />
                  <rect x="84" y="90" width="4" height="4" />
                  <rect x="92" y="90" width="8" height="4" />
                  <rect x="104" y="90" width="4" height="4" />

                  <rect x="44" y="98" width="4" height="4" />
                  <rect x="52" y="98" width="8" height="4" />
                  <rect x="64" y="98" width="4" height="4" />
                  <rect x="72" y="98" width="8" height="4" />
                  <rect x="88" y="98" width="4" height="4" />
                  <rect x="100" y="98" width="8" height="4" />

                  <rect x="44" y="106" width="8" height="4" />
                  <rect x="60" y="106" width="4" height="4" />
                  <rect x="68" y="106" width="8" height="4" />
                  <rect x="80" y="106" width="4" height="4" />
                  <rect x="92" y="106" width="16" height="4" />
                </svg>

                {/* WhatsApp Emblem Center Badge */}
                <div className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <WhatsAppIcon className="w-6 h-6 fill-current" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#727973] dark:text-[#a0aca4]">
              <span>Refreshes in {countdown}s</span>
              <span>•</span>
              <button
                type="button"
                onClick={handleRefreshQR}
                className="text-[#112e20] dark:text-emerald-400 font-semibold hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-[13px]">refresh</span>
                <span>Refresh QR</span>
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
                Scan this QR code using the official StyleX salon phone to authorize automated booking confirmations.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#112e20] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Open <strong>WhatsApp</strong> on the salon phone (<span className="text-[#112e20] dark:text-white font-medium">{connectedPhone}</span>)
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
                  Point camera at this screen to pair. Session will persist across server reboots.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
