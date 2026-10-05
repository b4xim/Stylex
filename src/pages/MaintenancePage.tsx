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
        {/* Location Map Section (Matches Clientside Homepage Map) */}
        {/* ============================================================== */}
        <div className="w-full max-w-4xl flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#fe753c] text-[20px]">location_on</span>
            <h3 className="font-serif text-lg sm:text-xl font-medium tracking-tight text-white">
              Salon Location & Directions
            </h3>
          </div>

          {/* Interactive Luxury Brand Map Card */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-[#031b14] border border-[#185341] min-h-[460px] sm:min-h-[520px] flex flex-col group select-none">
            {/* Static High-Res Brand Cartography Map Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src="/images/tirur_map_snapshot.jpg"
                alt="StyleX Signature Salon Tirur Location Map"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              {/* Subtle Luxury Vignette & Brand Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#021811]/90 via-[#021811]/25 to-[#021811]/70 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(2,24,17,0.6)_100%)] pointer-events-none" />
            </div>

            {/* Top Bar: Address & Verified Flagship Badge */}
            <div className="relative z-10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
              <div className="bg-[#031b14]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-[#185341] flex items-center gap-2 text-white font-label-md text-[12px] sm:text-[13px] font-semibold">
                <span className="material-symbols-outlined text-[#fe753c] text-[18px]">location_on</span>
                <span className="truncate">{SALON_DATA.addressLine1}, {SALON_DATA.addressLine2}, Tirur</span>
              </div>

              <div className="bg-[#042018]/90 text-[#a6d0be] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#185341] shadow-xl text-[11px] font-bold tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#fe753c] animate-pulse" />
                <span>Tirur Outlet • Map Overview</span>
              </div>
            </div>

            {/* Center Floating Salon Atelier Interactive Card (links to Maps) */}
            <div className="relative z-10 my-auto mx-auto px-4 py-8 pointer-events-auto">
              <a
                href={SALON_DATA.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 sm:p-6 rounded-2xl bg-[#031b14]/90 backdrop-blur-xl border border-[#185341] shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-center max-w-[280px] sm:max-w-[320px] transition-all transform hover:-translate-y-1 hover:border-[#fe753c] hover:shadow-[0_16px_45px_rgba(254,117,60,0.25)] group/card"
              >
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#fe753c]/20 border border-[#fe753c]/40 flex items-center justify-center text-[#fe753c] group-hover/card:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                </div>
                <h4 className="font-bold text-white text-[15px] sm:text-[16px]">StyleX Signature Salon</h4>
                <p className="text-[#a6d0be] text-[12px] mt-0.5">One Arcade, Near Lenskart, KG Padi Rd</p>
                <p className="text-[#7ea696] text-[11px] mt-1 font-medium">🕒 Open Daily 10:00 AM – 1:00 AM</p>
                <div className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fe753c] text-white text-[11px] font-bold shadow-md">
                  <span>Open in Google Maps</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_outward</span>
                </div>
              </a>
            </div>

            {/* Bottom Actions & Transit Information */}
            <div className="relative z-10 p-4 sm:p-5 mt-auto flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto">
              {/* Transit Distance Badges */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#caead5]/90">
                <div className="bg-[#031b14]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Tirur Rly Stn: ~1.2 km</span>
                </div>
                <div className="bg-[#031b14]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Bus Stand: ~900 m</span>
                </div>
              </div>

              {/* Direct Directions Action */}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#fe753c] hover:bg-[#e8652d] text-white font-label-md text-[12.5px] font-bold shadow-[0_4px_16px_rgba(254,117,60,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[17px]">directions</span>
                <span>Get Driving Directions</span>
              </a>
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
