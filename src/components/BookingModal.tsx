import React from 'react';
import { BookingState } from '../types.ts';

interface BookingModalProps {
  booking: BookingState | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const bookingCode = `SX-${Math.floor(1000 + Math.random() * 9000)}-TIRUR`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-[#071a14] text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#276451] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0e372b] to-[#164234] p-6 text-center space-y-2 border-b border-[#276451]">
          <div className="w-12 h-12 rounded-full bg-[#fe753c] text-white flex items-center justify-center mx-auto shadow-lg">
            <span className="material-symbols-outlined text-[28px]">check</span>
          </div>
          <span className="text-[#fe753c] text-[11px] font-bold uppercase tracking-[0.2em] font-label-caps">
            Reservation Secured • {booking.gender === 'gents' ? 'Gents Atelier' : 'Ladies Atelier'} • Tirur Flagship
          </span>
          <h3 className="text-[24px] font-bold text-white font-display-hero">
            StyleX Signature Salon Pass
          </h3>
          <p className="text-[12px] text-[#aeceba]">
            Booking Reference: <span className="font-mono font-bold text-white">{bookingCode}</span>
          </p>
        </div>

        {/* Pass Details */}
        <div className="p-6 space-y-5">
          {/* Service & Artisan */}
          <div className="bg-[#0f2d22] border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#9eb6aa]">Service</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#18392d] text-[#fe753c] font-semibold border border-[#fe753c]/30">
                    {booking.gender === 'gents' ? 'Gents Atelier' : 'Ladies Atelier'}
                  </span>
                </div>
                <h4 className="text-[18px] font-semibold text-white font-display-hero">{booking.serviceName}</h4>
              </div>
              <span className="text-[18px] font-bold text-[#fe753c]">
                ₹{booking.price.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between items-center text-[12px] pt-1 border-t border-white/10 text-[#d4ebe1]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#fe753c]">person</span>
                Artisan: {booking.stylist === 'Any Artisan' ? 'Any Available Artisan' : booking.stylist}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#fe753c]">timelapse</span>
                {booking.duration} min
              </span>
            </div>
          </div>

          {/* Schedule & Location Pass */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0f2d22] border border-white/10 rounded-2xl p-3.5 space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#9eb6aa]">Date & Time</p>
              <p className="text-[13px] font-semibold text-white">{booking.date}</p>
              <p className="text-[12px] text-[#fe753c] font-medium">{booking.time} IST</p>
            </div>

            <div className="bg-[#0f2d22] border border-white/10 rounded-2xl p-3.5 space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#9eb6aa]">Location</p>
              <p className="text-[13px] font-semibold text-white">One Arcade, Tirur</p>
              <p className="text-[12px] text-[#caead5] font-medium">Near Lenskart, KG Padi Rd</p>
            </div>
          </div>

          {/* Financials & Concierge Hospitality */}
          <div className="bg-[#082017] rounded-xl p-3 border border-white/5 space-y-1.5 text-[12px]">
            <div className="flex justify-between text-[#9eb6aa]">
              <span>Total Service Amount:</span>
              <span className="text-[#fe753c] font-bold text-[14px]">₹{booking.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#9eb6aa]">
              <span>Prepayment Required:</span>
              <span className="text-emerald-400 font-semibold">₹0 (Zero Prepayment)</span>
            </div>
            <div className="flex justify-between text-[#9eb6aa]">
              <span>Settlement:</span>
              <span className="text-white font-medium">Pay at Tirur Desk upon completion</span>
            </div>
            <div className="pt-1 border-t border-white/10 flex items-center gap-1.5 text-[#caead5] text-[11px]">
              <span className="material-symbols-outlined text-[14px] text-[#fe753c]">spa</span>
              <span>Open daily until 1:00 AM • Complimentary herbal refreshment prepared.</span>
            </div>
          </div>

          {/* Simulated QR Code & Barcode */}
          <div className="flex items-center justify-between bg-white text-black p-3 rounded-2xl">
            <div className="space-y-0.5">
              <p className="text-[9px] uppercase font-bold tracking-wider text-black/60">Digital Salon Pass</p>
              <p className="text-[12px] font-mono font-bold">{bookingCode}</p>
              <p className="text-[10px] text-black/70">Show this pass to your arrival concierge at One Arcade</p>
            </div>
            <div className="w-14 h-14 bg-black flex items-center justify-center rounded-lg text-white font-mono text-[9px] text-center p-1 font-bold">
              [QR PASS]
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-full bg-[#fe753c] hover:bg-[#e0622a] text-white text-[14px] font-bold shadow-[0_4px_16px_rgba(254,117,60,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Done</span>
              <span className="material-symbols-outlined text-[18px]">done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
