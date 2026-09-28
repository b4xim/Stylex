import React, { useEffect } from 'react';
import { SALON_DATA } from '../data/salonData.ts';

interface BookingPausedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingPausedModal: React.FC<BookingPausedModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const whatsappMessage = encodeURIComponent(
    'Hello StyleX Signature Salon Tirur, I would like to book an appointment.'
  );
  const whatsappUrl = `https://wa.me/${SALON_DATA.whatsappNumber}?text=${whatsappMessage}`;
  const callUrl = `tel:${SALON_DATA.phoneNumberClean}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-paused-title"
    >
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#0b241b] via-[#061c14] to-[#04140f] text-white rounded-3xl shadow-2xl border border-[#1d4c3c]/80 overflow-hidden animate-in zoom-in-95 duration-250 p-6 sm:p-8 text-center pb-[max(1.75rem,env(safe-area-inset-bottom))]">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#fe753c]/20 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#25D366]/15 blur-2xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-[#caead5]/70 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer select-none focus:outline-none"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fe753c]/15 border border-[#fe753c]/35 text-[#fe753c] text-[11px] font-bold uppercase tracking-wider mb-4 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fe753c] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fe753c]"></span>
          </span>
          <span>Online Booking Paused</span>
        </div>

        {/* Hero Visual Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#fe753c]/20 to-[#caead5]/10 border border-[#fe753c]/30 flex items-center justify-center mx-auto mb-4 text-[#fe753c] shadow-lg shadow-[#fe753c]/10">
          <span className="material-symbols-outlined text-[34px] sm:text-[42px]">
            pause_circle
          </span>
        </div>

        {/* Headlines */}
        <h3
          id="booking-paused-title"
          className="font-display-hero text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5 leading-tight"
        >
          Booking Paused
        </h3>
        <p className="text-base sm:text-lg font-medium text-[#fe753c] mb-3">
          Will be back soon!
        </p>

        {/* Reassuring Salon Copy */}
        <p className="text-xs sm:text-sm text-[#caead5]/85 leading-relaxed mb-6 max-w-sm mx-auto">
          Our online scheduling engine is temporarily paused for salon appointment reconciliation.
          Our master stylists and Tirur front desk are open and ready to assist you directly via{' '}
          <strong className="text-white font-semibold">WhatsApp</strong> or{' '}
          <strong className="text-white font-semibold">Phone Call</strong>.
        </p>

        {/* Action Buttons Stack (Optimized for both Desktop & Mobile touch targets) */}
        <div className="space-y-3 w-full">
          {/* WhatsApp Direct Action */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[52px] px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] text-white font-semibold text-sm sm:text-base flex items-center justify-between shadow-lg shadow-[#25D366]/20 transition-all select-none cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 fill-current text-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.392-10.416c-4.415 0-8 3.585-8 8 0 1.411.367 2.736 1.007 3.886l-1.07 3.91 4.01-1.052c1.109.605 2.377.946 3.725.946 4.415 0 8-3.585 8-8s-3.585-8-8-8z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="leading-tight">Chat on WhatsApp</div>
                <div className="text-[11px] text-white/80 font-normal">
                  Instant Reply • {SALON_DATA.phoneDisplay}
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-white/90 group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </a>

          {/* Call Salon Direct Action */}
          <a
            href={callUrl}
            className="w-full min-h-[52px] px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-[0.98] border border-white/15 text-white font-semibold text-sm sm:text-base flex items-center justify-between transition-all select-none cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#caead5]">
                <span className="material-symbols-outlined text-[20px]">call</span>
              </div>
              <div className="text-left">
                <div className="leading-tight">Call Front Desk</div>
                <div className="text-[11px] text-[#caead5]/75 font-normal">
                  {SALON_DATA.phoneDisplay} • Direct Line
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-[#caead5]/80 group-hover:translate-x-0.5 transition-transform">
              phone_forwarded
            </span>
          </a>
        </div>

        {/* Salon Location & Hours Strip */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#caead5]/70">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#fe753c]">
              schedule
            </span>
            <span>10:00 AM – 1:00 AM</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#fe753c]">
              location_on
            </span>
            <span>Tirur Outlet</span>
          </span>
        </div>

        {/* Secondary Dismiss Button */}
        <button
          onClick={onClose}
          type="button"
          className="mt-4 text-xs font-semibold text-[#caead5]/70 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-white/5 inline-block"
        >
          Continue Browsing Salon Menu
        </button>
      </div>
    </div>
  );
};
