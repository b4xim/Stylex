import React from 'react';
import { HERO_IMAGE, SALON_DATA } from '../data/salonData.ts';

interface HeroSectionProps {
  onReserveClick: () => void;
  onExploreMenuClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onReserveClick, onExploreMenuClick }) => {
  const whatsappLink = `https://wa.me/${SALON_DATA.whatsappNumber}?text=${encodeURIComponent('Hello StyleX Signature Salon Tirur, I would like to inquire about booking an appointment.')}`;

  return (
    <section
      id="hero-top"
      className="relative w-full bg-gradient-to-b from-[#072018] via-[#0b2b21] to-[#081d16] text-white pt-6 pb-20 px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-[#1b4335]"
    >
      {/* Ambient Lighting Orbs */}
      <div className="absolute -top-32 -left-20 w-[500px] h-[500px] rounded-full bg-[#185341]/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[600px] h-[600px] rounded-full bg-[#1e614d]/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center pt-4 sm:pt-6">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-7 space-y-7">
            <p className="text-[#fe753c] font-bold text-[12px] tracking-[0.25em] uppercase font-label-caps">
              HAIR · SKIN · BRIDAL & GROOM
            </p>

            <h1 className="text-white font-display-hero text-[42px] sm:text-[54px] lg:text-[62px] leading-[1.08] tracking-tight">
              Architectural Form.<br />
              Bespoke Texture.<br />
              <span className="italic font-normal text-[#d4ebe1]">Pure Botanical Luxury.</span>
            </h1>

            <p className="text-[#c2cec6] text-[15px] sm:text-[16px] max-w-xl leading-relaxed font-normal">
              Step inside Tirur’s premier signature salon at One Arcade, KG Padi Road. Experience customized Keratin silk infusions, French balayage, HydraFacial MD rituals, and complete VIP bridal suites.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={onReserveClick}
                className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-[#fe753c] hover:bg-[#e0622a] text-white font-semibold text-[14px] sm:text-[15px] shadow-[0_8px_24px_-4px_rgba(254,117,60,0.45)] transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <span>Reserve Your Session</span>
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-[#073327] hover:bg-[#0c4737] text-white font-semibold text-[14px] sm:text-[15px] border border-[#1b5040] shadow-md transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#fe753c]">chat</span>
                <span>WhatsApp Desk</span>
              </a>

              <button
                onClick={onExploreMenuClick}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#164234]/60 hover:bg-[#1c5241] text-white font-medium text-[14px] border border-[#276451] transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <span>Explore Menu</span>
                <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
              </button>
            </div>

            {/* Metrics Bar */}
            <div className="pt-4">
              <div className="inline-flex flex-wrap sm:flex-nowrap items-center gap-8 sm:gap-12 bg-[#0e372b]/70 border border-[#1d5644] rounded-2xl px-6 sm:px-7 py-5 backdrop-blur-md shadow-lg">
                <div>
                  <div className="text-[28px] font-bold text-white font-display-hero flex items-baseline">
                    14<span className="text-[#fe753c] font-normal text-[20px] ml-0.5">+</span>
                  </div>
                  <div className="text-[12px] text-[#9eb6aa] mt-0.5">Master Artisans</div>
                </div>

                <div className="hidden sm:block w-px h-8 bg-white/10" />

                <div>
                  <div className="text-[28px] font-bold text-white font-display-hero flex items-baseline">
                    12k<span className="text-[#fe753c] font-normal text-[20px] ml-0.5">+</span>
                  </div>
                  <div className="text-[12px] text-[#9eb6aa] mt-0.5">Transformations</div>
                </div>

                <div className="hidden sm:block w-px h-8 bg-white/10" />

                <div>
                  <div className="text-[28px] font-bold text-white font-display-hero flex items-center gap-1">
                    4.98<span className="text-[#fe753c] text-[20px] leading-none">★</span>
                  </div>
                  <div className="text-[12px] text-[#9eb6aa] mt-0.5">850+ Verified Reviews</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Model Portrait with Curated Badges */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px] aspect-[4/5] flex items-center justify-center">
              {/* Diffused Glow */}
              <div className="absolute -inset-10 bg-gradient-to-t from-[#072018] via-[#185341]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

              {/* Masked Editorial Image */}
              <div
                className="relative w-full h-full overflow-hidden rounded-3xl"
                style={{
                  WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 98%)',
                  maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 98%)'
                }}
              >
                <img
                  alt="High-end editorial fashion portrait of an elegant woman with gorgeous wavy chestnut hair in emerald attire"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                  src={HERO_IMAGE}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#072018] via-[#072018]/30 to-transparent pointer-events-none" />
              </div>

              {/* Floating Badge Top-Left: Rating */}
              <div className="absolute -top-3 -left-2 sm:-left-6 z-20">
                <div className="bg-[#0e2a20]/95 backdrop-blur-md border border-[#276451]/70 rounded-2xl p-3 shadow-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fe753c] flex items-center justify-center text-white shadow-md flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">military_tech</span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#fe753c] text-[13px] tracking-tight leading-none">★★★★★</span>
                      <span className="text-white font-bold text-[13px] leading-none">4.9 / 5</span>
                    </div>
                    <p className="text-[10px] text-[#9eb6aa] font-medium">From 850+ discerning guests</p>
                  </div>
                </div>
              </div>

              {/* Floating Pills Lower-Left */}
              <div className="absolute bottom-20 left-2 sm:left-6 z-20 flex flex-col gap-2.5">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0a271f]/90 backdrop-blur-md border border-[#1d5644] text-white text-[12px] shadow-lg">
                  <span className="material-symbols-outlined text-[16px] text-[#fe9167]">wine_bar</span>
                  <span className="font-medium tracking-wide">Complimentary Champagne & Consultation</span>
                </div>
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0a271f]/90 backdrop-blur-md border border-[#1d5644] text-white text-[12px] shadow-lg self-start">
                  <span className="material-symbols-outlined text-[16px] text-[#caead5]">eco</span>
                  <span className="font-medium tracking-wide">Bio-Dynamic Care</span>
                </div>
              </div>

              {/* Floating Badge Bottom-Right: Master Stylists */}
              <div className="absolute -bottom-3 -right-2 sm:-right-6 z-20">
                <div className="bg-[#071a14]/95 backdrop-blur-md border border-[#276451]/70 rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#9b4521]/20 border border-[#9b4521]/40 flex items-center justify-center text-[#fe9167] flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">content_cut</span>
                  </div>
                  <div className="space-y-0.5 text-left">
                    <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#fe9167] font-label-caps">
                      MASTER STYLISTS ON-SITE
                    </p>
                    <h4 className="text-[13px] font-semibold text-white leading-snug">
                      Bespoke Hair Sculpting & Couture Dye
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
