import React, { useState } from 'react';
import { BookingState } from '../types.ts';

interface BookingModalProps {
  booking: BookingState | null;
  onClose: () => void;
  onManageBooking?: (token: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ booking, onClose, onManageBooking }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!booking) return null;

  const bookingCode = booking.bookingRef || `SX-${Math.floor(1000 + Math.random() * 9000)}-TIRUR`;

  const handleDoneClick = () => {
    if (isCompleting) return;
    setIsCompleting(true);
    // Allow the modern green animation & draw checkmark to stay for 2.6 seconds before closing
    setTimeout(() => {
      onClose();
      setIsCompleting(false);
    }, 2600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className={`w-full max-w-lg rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 relative flex flex-col max-h-[92dvh] sm:max-h-[88vh] ${
          isCompleting
            ? 'bg-gradient-to-b from-[#0b3829] via-[#052b1e] to-[#021a12] border-2 border-emerald-400/80 shadow-[0_0_70px_rgba(16,185,129,0.55)] scale-[1.01]'
            : 'bg-[#071a14] border border-[#276451] text-white'
        }`}
      >
        {/* Full-Screen Green Tick Animated Overlay when 'Done' is clicked */}
        {isCompleting ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center animate-fade-in relative overflow-hidden select-none min-h-[380px] sm:min-h-[440px]">
            {/* Ambient Background Glow and Ripples */}
            <div className="absolute w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute w-28 h-28 rounded-full border border-emerald-400/40 animate-ripple pointer-events-none" />
            <div className="absolute w-28 h-28 rounded-full border border-emerald-300/30 animate-ripple delay-300 pointer-events-none" />

            {/* Pulsing Animated Check Badge */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-300 shadow-[0_0_40px_rgba(52,211,153,0.7)] flex items-center justify-center animate-check-bounce mb-5 relative z-10">
              <svg 
                className="w-11 h-11 sm:w-14 sm:h-14 text-[#062419]" 
                viewBox="0 0 48 48" 
                fill="none"
              >
                <path
                  d="M13 25L21.5 33.5L35 15.5"
                  stroke="currentColor"
                  strokeWidth="4.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-check-stroke"
                />
              </svg>
            </div>

            {/* Celebratory Text */}
            <div className="space-y-2 relative z-10 animate-fade-in">
              <span className="text-emerald-300 text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] font-label-caps block">
                Reservation Confirmed
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-display-hero tracking-tight">
                All Set! See You Soon
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xs mx-auto">
                Your luxury appointment pass has been secured.
              </p>
            </div>

            {/* Booking Code Pill */}
            <div className="mt-5 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs font-mono font-semibold tracking-wider relative z-10 shadow-xs">
              Ref: {bookingCode}
            </div>

            {/* Salon Signature Footer Tag */}
            <div className="mt-6 flex items-center gap-1.5 text-[11px] text-emerald-300/70 relative z-10">
              <span className="material-symbols-outlined text-[15px] text-emerald-400">spa</span>
              <span>StyleX Signature Salon • Tirur Outlet</span>
            </div>

            {/* Elegant completion progress bar */}
            <div className="w-36 h-1 bg-emerald-950/80 rounded-full mt-4 overflow-hidden border border-emerald-500/20 relative z-10">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-200 rounded-full transition-all duration-[2600ms] ease-out"
                style={{ width: isCompleting ? '100%' : '0%' }}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0e372b] to-[#164234] p-4 sm:p-5 text-center space-y-1.5 border-b border-[#276451] relative shrink-0">
              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close Modal"
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>

              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fe753c] text-white flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-[24px]">check</span>
              </div>
              <span className="text-[#fe753c] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] font-label-caps block">
                Reservation Secured • {booking.gender === 'gents' ? 'Gents Section' : 'Ladies Section'}
              </span>
              <h3 className="text-lg sm:text-[22px] font-bold text-white font-display-hero leading-tight">
                StyleX Signature Salon Pass
              </h3>
              <p className="text-[11px] sm:text-[12px] text-[#aeceba]">
                Booking Reference: <span className="font-mono font-bold text-white tracking-wide">{bookingCode}</span>
              </p>
            </div>

            {/* Scrollable Pass Details Body (optimized for mobile height) */}
            <div className="p-4 sm:p-5 space-y-3.5 sm:space-y-4 overflow-y-auto overscroll-contain flex-1">
              {/* Service & Artisan */}
              <div className="bg-[#0f2d22] border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#9eb6aa]">Service</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#18392d] text-[#fe753c] font-semibold border border-[#fe753c]/30">
                      {booking.gender === 'gents' ? 'Gents Section' : 'Ladies Section'}
                    </span>
                  </div>
                  <h4 className="text-[16px] sm:text-[17px] font-semibold text-white font-display-hero mt-1 leading-snug">
                    {booking.serviceName}
                  </h4>
                </div>

                <div className="flex justify-between items-center text-[12px] pt-1.5 border-t border-white/10 text-[#d4ebe1]">
                  {booking.stylist && !booking.stylist.toLowerCase().includes('any') ? (
                    <span className="flex items-center gap-1 truncate mr-2">
                      <span className="material-symbols-outlined text-[15px] text-[#fe753c] shrink-0">person</span>
                      <span className="truncate">Stylist: {booking.stylist}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#aeceba]">Any Available Master Artisan</span>
                  )}
                  <span className="flex items-center gap-1 shrink-0 ml-auto">
                    <span className="material-symbols-outlined text-[15px] text-[#fe753c]">timelapse</span>
                    {booking.duration} min
                  </span>
                </div>
              </div>

              {/* Schedule & Location Pass Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="bg-[#0f2d22] border border-white/10 rounded-xl sm:rounded-2xl p-3 space-y-0.5">
                  <p className="text-[9.5px] uppercase font-bold tracking-wider text-[#9eb6aa]">Date & Time</p>
                  <p className="text-[12.5px] sm:text-[13px] font-semibold text-white truncate">{booking.date}</p>
                  <p className="text-[11.5px] text-[#fe753c] font-medium">{booking.time} IST</p>
                </div>

                <div className="bg-[#0f2d22] border border-white/10 rounded-xl sm:rounded-2xl p-3 space-y-0.5">
                  <p className="text-[9.5px] uppercase font-bold tracking-wider text-[#9eb6aa]">Location</p>
                  <p className="text-[12.5px] sm:text-[13px] font-semibold text-white truncate">One Arcade, Tirur</p>
                  <p className="text-[11.5px] text-[#caead5] font-medium truncate">Near Lenskart, KG Padi</p>
                </div>
              </div>

              {/* Guest Contact Details */}
              {(booking.customerName || booking.phone || booking.email) && (
                <div className="bg-[#0f2d22] border border-white/10 rounded-xl sm:rounded-2xl p-3 space-y-1 text-[11.5px] sm:text-[12px]">
                  <p className="text-[9.5px] uppercase font-bold tracking-wider text-[#9eb6aa]">Guest Contact</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#d4ebe1]">
                    {booking.customerName && (
                      <span className="flex items-center gap-1 font-semibold text-white">
                        <span className="material-symbols-outlined text-[13px] text-[#fe753c]">person</span>
                        <span>{booking.customerName}</span>
                      </span>
                    )}
                    {booking.phone && (
                      <span className="flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[13px] text-[#fe753c]">call</span>
                        <span>{booking.phoneCountryCode || '+91'} {booking.phone}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Special Requests / Extra Services if specified */}
              {booking.notes && booking.notes.trim() && (
                <div className="bg-[#0f2d22] border border-white/10 rounded-xl p-2.5 sm:p-3 space-y-0.5 text-[11.5px]">
                  <p className="text-[9.5px] uppercase font-bold tracking-wider text-[#fe753c]">Special Requests</p>
                  <p className="text-white italic line-clamp-2">"{booking.notes}"</p>
                </div>
              )}

              {/* Hospitality Details: Compact on mobile, detailed on desktop */}
              {/* Desktop detailed card */}
              <div className="hidden sm:block bg-[#082017] rounded-xl p-3 border border-white/5 space-y-1.5 text-[12px]">
                <div className="flex justify-between text-[#9eb6aa]">
                  <span>Reservation Status:</span>
                  <span className="text-emerald-400 font-semibold">Priority Confirmed</span>
                </div>
                <div className="flex justify-between text-[#9eb6aa]">
                  <span>Prepayment Required:</span>
                  <span className="text-white font-medium">None (Zero Prepayment)</span>
                </div>
                <div className="flex justify-between text-[#9eb6aa]">
                  <span>Settlement:</span>
                  <span className="text-white font-medium">Pay at Tirur Desk upon completion</span>
                </div>
                <div className="pt-1 border-t border-white/10 flex items-center gap-1.5 text-[#caead5] text-[11px]">
                  <span className="material-symbols-outlined text-[14px] text-[#fe753c]">spa</span>
                  <span>Open daily until 1:00 AM • Complimentary herbal drink prepared.</span>
                </div>
              </div>

              {/* Mobile compact badge */}
              <div className="sm:hidden flex items-center justify-between px-3 py-2 rounded-xl bg-[#082017] border border-white/10 text-[11px] text-[#caead5]">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-emerald-400">verified</span>
                  <span>Zero Prepayment • Pay at Salon</span>
                </span>
                <span className="text-[#9eb6aa] font-medium">Open till 1 AM</span>
              </div>

              {/* Quick Self-Service Management Actions */}
              <div className="bg-[#0a231b] border border-[#276451]/60 rounded-xl p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#caead5] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#fe753c]">tune</span>
                    <span>Self-Service Booking Pass</span>
                  </span>
                  <span className="text-[10px] text-[#86efac] font-medium">Instant Reschedule / Cancel</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const token = booking.managementToken || booking.bookingRef || '';
                      if (onManageBooking) onManageBooking(token);
                    }}
                    className="py-2 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px] text-[#fe753c]">schedule</span>
                    <span>Reschedule / Cancel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const token = booking.managementToken || booking.bookingRef || '';
                      const url = `${window.location.origin}/?manage=${encodeURIComponent(token)}`;
                      navigator.clipboard.writeText(url).then(() => {
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2500);
                      });
                    }}
                    className="py-2 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#d4ebe1] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px] text-[#fe753c]">
                      {copiedLink ? 'done' : 'content_copy'}
                    </span>
                    <span>{copiedLink ? 'Copied!' : 'Copy Pass Link'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const token = booking.managementToken || booking.bookingRef || '';
                    const url = `${window.location.origin}/?manage=${encodeURIComponent(token)}`;
                    const text = `StyleX Signature Salon Appointment Pass\n• Ref: ${booking.bookingRef}\n• Service: ${booking.serviceName}\n• Date: ${booking.date} at ${booking.time}\n\nView or Reschedule your booking here: ${url}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="w-full py-2 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#86efac] text-[11.5px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#25D366]">share</span>
                  <span>Save Pass to WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Pinned Sticky Footer - Always visible on mobile screens */}
            <div className="p-3 sm:p-4 bg-[#071a14]/95 border-t border-white/10 backdrop-blur-xs shrink-0">
              <button
                onClick={handleDoneClick}
                disabled={isCompleting}
                className="w-full py-3.5 sm:py-4 rounded-full text-white text-[14px] font-bold flex items-center justify-center gap-2 cursor-pointer bg-[#fe753c] hover:bg-[#e0622a] shadow-[0_4px_16px_rgba(254,117,60,0.4)] hover:shadow-[0_6px_22px_rgba(254,117,60,0.6)] active:scale-95 transition-all select-none"
              >
                <span>Done</span>
                <span className="material-symbols-outlined text-[18px]">done</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
