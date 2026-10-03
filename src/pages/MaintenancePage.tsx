import React from 'react';
import { SALON_DATA, LOGO_URL } from '../data/salonData.ts';

const TIRUR_COORDINATES: [number, number] = [10.904776, 75.921187];

export const MaintenancePage: React.FC = () => {
  const whatsappUrl = `https://wa.me/${SALON_DATA.whatsappNumber}?text=${encodeURIComponent(
    'Hello StyleX Signature Salon Tirur, I would like to book an appointment.'
  )}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${TIRUR_COORDINATES[0]},${TIRUR_COORDINATES[1]}`;

  return (
    <div className="min-h-screen bg-[#071a12] text-white flex flex-col justify-between selection:bg-[#fe753c] selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Ambience & Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#185341]/30 via-[#112e20]/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#fe753c]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-[#185341]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Brand Logo */}
      <header className="relative z-10 w-full py-6 px-6 sm:px-12 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-[#071a12]/60">
        <div className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="StyleX Signature Salon"
            className="h-10 w-auto object-contain brightness-110"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span className="font-serif tracking-widest text-lg font-bold uppercase text-white leading-tight">
              StyleX
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#a6d0be] font-medium">
              Signature Salon • Tirur
            </span>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#a6d0be]">
          <span className="w-2 h-2 rounded-full bg-[#fe753c] animate-pulse" />
          <span className="hidden sm:inline">Salon Open Daily:</span>
          <span className="font-semibold text-white">10 AM – 1 AM</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 flex flex-col items-center text-center">
        {/* Maintenance Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#185341]/40 border border-[#185341] text-[#a6d0be] text-xs font-semibold uppercase tracking-wider mb-6 shadow-lg shadow-[#185341]/20">
          <span className="material-symbols-outlined text-[16px] text-[#fe753c]">engineering</span>
          <span>Website Enhancement In Progress</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-tight max-w-3xl mb-4">
          We Are Upgrading Our Website
        </h1>

        <p className="text-sm sm:text-base text-[#a6d0be] max-w-2xl leading-relaxed mb-10">
          Our online booking portal is temporarily undergoing scheduled maintenance. 
          However, our flagship salon at <strong>One Arcade, Tirur</strong> is open and welcoming guests for all hair, skin, spa, and grooming rituals.
        </p>

        {/* ============================================================== */}
        {/* "For Booking" Section with Call & WhatsApp Buttons */}
        {/* ============================================================== */}
        <div className="w-full max-w-xl bg-gradient-to-b from-[#112e20]/90 to-[#0b2016]/95 border border-[#185341] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-12">
          {/* Small Title */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#fe753c]" />
            <h2 className="font-serif text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#fe753c]">
              For Booking
            </h2>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#fe753c]" />
          </div>

          <p className="text-xs sm:text-sm text-neutral-200 mb-6 leading-relaxed">
            Please connect directly with our front desk via Call or WhatsApp for immediate reservation & stylist availability:
          </p>

          {/* 2 Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Button 1: Call */}
            <a
              href={`tel:${SALON_DATA.phoneNumberClean}`}
              className="flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-[#fe753c] hover:bg-[#e6632c] text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-[#fe753c]/25 hover:shadow-xl hover:shadow-[#fe753c]/35 hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[18px]">call</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/80 leading-none">
                  Direct Line
                </span>
                <span className="text-sm font-extrabold leading-tight">Call Us</span>
              </div>
            </a>

            {/* Button 2: WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-[#072412] font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-[#25D366]/25 hover:shadow-xl hover:shadow-[#25D366]/35 hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-black/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px] text-[#072412]">chat</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#072412]/80 leading-none">
                  Instant Chat
                </span>
                <span className="text-sm font-extrabold text-[#072412] leading-tight">WhatsApp Booking</span>
              </div>
            </a>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[12px] text-[#a6d0be]">
            <span className="material-symbols-outlined text-[15px] text-[#fe753c]">support_agent</span>
            <span>Desk Phone: <strong className="text-white">{SALON_DATA.phoneDisplay}</strong></span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Location Map Section */}
        {/* ============================================================== */}
        <div className="w-full max-w-4xl flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#fe753c] text-[20px]">location_on</span>
            <h3 className="font-serif text-lg sm:text-xl font-medium tracking-tight text-white">
              Salon Location & Directions
            </h3>
          </div>

          {/* Interactive Map Card */}
          <div className="w-full rounded-3xl overflow-hidden border border-[#185341] shadow-2xl bg-[#031b14] relative flex flex-col">
            {/* Embedded Google Map Iframe for Real Interactive Navigation */}
            <div className="w-full h-80 sm:h-96 relative">
              <iframe
                title="StyleX Signature Salon Location Map"
                src={`https://maps.google.com/maps?q=${TIRUR_COORDINATES[0]},${TIRUR_COORDINATES[1]}&hl=en&z=16&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                className="w-full h-full grayscale-[25%] contrast-[110%] opacity-90"
              />
            </div>

            {/* Address Banner Below Map */}
            <div className="p-5 sm:p-6 bg-[#042018] border-t border-[#185341] flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#fe753c]/20 border border-[#fe753c]/30 flex items-center justify-center text-[#fe753c] shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">StyleX Signature Salon</h4>
                  <p className="text-xs sm:text-sm text-[#a6d0be] mt-0.5">
                    {SALON_DATA.addressLine1}, {SALON_DATA.addressLine2}, {SALON_DATA.city} - {SALON_DATA.pincode}
                  </p>
                  <p className="text-[11px] text-[#7ea696] mt-1">
                    🕒 Hours: Open Daily 10:00 AM – 1:00 AM
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">directions</span>
                  <span>Get Directions</span>
                </a>

                <a
                  href={SALON_DATA.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#fe753c] hover:bg-[#e6632c] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>Google Maps</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 px-6 text-center text-xs text-[#7ea696] border-t border-white/10 bg-[#071a12]/80 backdrop-blur-md">
        <p>© {new Date().getFullYear()} StyleX Signature Salon. All rights reserved.</p>
        <p className="mt-1 text-[11px] text-[#527365]">
          Flagship Atelier Tirur, Kerala • Premium Hair, Aesthetics & Grooming
        </p>
      </footer>
    </div>
  );
};
