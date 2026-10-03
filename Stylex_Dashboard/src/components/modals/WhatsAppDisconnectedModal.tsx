import React, { useEffect } from 'react';
import { WhatsAppIcon } from '../../utils/whatsapp';

interface WhatsAppDisconnectedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToSettings: () => void;
}

export const WhatsAppDisconnectedModal: React.FC<WhatsAppDisconnectedModalProps> = ({
  isOpen,
  onClose,
  onGoToSettings,
}) => {
  // Allow ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#14221b] border border-amber-500/30 dark:border-amber-500/20 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button ("X") */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header Icon & Status Pill */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <WhatsAppIcon className="w-6 h-6 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Gateway Offline
            </span>
            <h3 className="text-lg font-bold text-[#112e20] dark:text-white tracking-tight mt-0.5">
              WhatsApp Disconnected
            </h3>
          </div>
        </div>

        {/* Body Text */}
        <div className="space-y-2.5 text-sm text-[#424844] dark:text-neutral-300 leading-relaxed mb-6">
          <p>
            Your salon’s automated WhatsApp session is currently disconnected.
          </p>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              warning
            </span>
            <span>
              Instant booking passes, reschedule notices, and <strong>1-hour reminders</strong> will pause until the device is re-linked.
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Please open Settings and scan the pairing QR code using WhatsApp on the salon phone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-1/3 py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors cursor-pointer text-center"
          >
            Dismiss
          </button>

          <button
            type="button"
            onClick={onGoToSettings}
            className="w-full sm:w-2/3 py-2.5 px-4 rounded-xl bg-[#112e20] hover:bg-[#1a4430] dark:bg-[#25D366] dark:hover:bg-[#20ba5a] text-white dark:text-[#072412] text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
            <span>Scan QR in Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
