import React, { useState } from 'react';
import { SALON_DATA } from '../data/salonData.ts';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="w-full bg-gradient-to-b from-[#08241b] to-[#051812] text-[#d4ebe1] pt-6 sm:pt-14 pb-6 sm:pb-8 border-t border-[#1b4335] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Mobile: Ultra-Minimal Clean Footer */}
        <div className="md:hidden space-y-3.5 text-center py-1">
          {/* Centered Minimal Brand with Iconic X */}
          <div className="flex flex-col items-center gap-1.5">
            <img
              src="/favicon.png"
              alt="StyleX"
              className="h-8 w-8 object-contain"
            />
            <h3 className="font-display-hero text-white text-[15px] font-bold tracking-tight">
              StyleX Signature Salon
            </h3>
            <p className="text-[11.5px] text-[#9eb6aa]">
              Tirur Outlet • Open Daily 10:00 AM – 1:00 AM
            </p>
          </div>

          {/* 4 Compact Social & Contact Action Circles */}
          <div className="flex items-center justify-center gap-2.5 pt-1">
            <a
              href={SALON_DATA.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-[#0e372b] border border-[#1d5644] flex items-center justify-center text-[#d4ebe1] hover:text-[#fe753c] active:scale-95 transition-all shadow-sm"
            >
              <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href={`https://wa.me/${SALON_DATA.whatsappNumber}?text=${encodeURIComponent('Hello StyleX Signature Salon Tirur, I would like to inquire about appointments.')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full bg-[#0e372b] border border-[#1d5644] flex items-center justify-center text-[#d4ebe1] hover:text-[#fe753c] active:scale-95 transition-all shadow-sm"
            >
              <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </a>
            <a
              href={SALON_DATA.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Maps"
              className="w-9 h-9 rounded-full bg-[#0e372b] border border-[#1d5644] flex items-center justify-center text-[#d4ebe1] hover:text-[#fe753c] active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">explore</span>
            </a>
            <a
              href={`tel:${SALON_DATA.phoneNumberClean}`}
              aria-label="Call Desk"
              className="w-9 h-9 rounded-full bg-[#0e372b] border border-[#1d5644] flex items-center justify-center text-[#d4ebe1] hover:text-[#fe753c] active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
            </a>
          </div>

          {/* Slim Copyright */}
          <div className="pt-2 border-t border-[#1b4335]/70 text-[10.5px] text-[#9eb6aa]/80">
            <p>© {new Date().getFullYear()} StyleX Tirur. All rights reserved.</p>
          </div>
        </div>

        {/* Desktop: Full 12-Column Rich Luxury Footer */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <a href="#" className="inline-block">
                <img
                  src="/logo.png"
                  alt="StyleX Signature Salon"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </a>
            </div>

            <p className="font-body-md text-[13px] sm:text-[14px] text-[#9eb6aa] max-w-sm leading-relaxed">
              Tirur’s premier signature salon for precision hair artistry, advanced skin therapies, and private VIP bridal suites. Open daily until 1:00 AM.
            </p>

            {/* Social & Channel Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={SALON_DATA.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow on Instagram"
                className="w-10 h-10 rounded-full bg-[#0e372b] border border-[#1d5644] flex items-center justify-center text-[#d4ebe1] hover:text-[#fe753c] hover:border-[#fe753c]/50 transition-all cursor-pointer"
              >
                <svg className="w-[19px] h-[19px] fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={`https://wa.me/${SALON_DATA.whatsappNumber}?text=${encodeURIComponent('Hello StyleX Signature Salon Tirur, I would like to inquire about appointments.')}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="w-10 h-10 rounded-full bg-[#0e372b] border border-[#1d5644] flex items-center justify-center text-[#d4ebe1] hover:text-[#fe753c] hover:border-[#fe753c]/50 transition-all cursor-pointer"
              >
                <svg className="w-[19px] h-[19px] fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>
              <a
                href={SALON_DATA.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Locate on Google Maps"
                className="w-10 h-10 rounded-full bg-[#0e372b] border border-[#1d5644] flex items-center justify-center text-[#d4ebe1] hover:text-[#fe753c] hover:border-[#fe753c]/50 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">explore</span>
              </a>
              <a
                href={`tel:${SALON_DATA.phoneNumberClean}`}
                title="Call Desk"
                className="w-10 h-10 rounded-full bg-[#0e372b] border border-[#1d5644] flex items-center justify-center text-[#d4ebe1] hover:text-[#fe753c] hover:border-[#fe753c]/50 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
              </a>
            </div>
          </div>

          {/* Services Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-label-caps text-[11px] uppercase text-white font-bold tracking-wider">
              Services
            </h4>
            <ul className="space-y-2.5 font-body-md text-[13px] text-[#9eb6aa]">
              <li className="hover:text-white transition-colors">
                <a href="#services-curation">Hair Styling & Color</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="#services-curation">Hydra Facial & Skin Care</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="#services-curation">Bridal & Grooming</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="#atelier-reels">Client Transformations</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="#client-reviews">Customer Reviews</a>
              </li>
            </ul>
          </div>

          {/* Outlet Timings & Address (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-label-caps text-[11px] uppercase text-white font-bold tracking-wider">
              Tirur Outlet Hours
            </h4>
            <div className="space-y-2 font-body-md text-[13px] text-[#9eb6aa]">
              <div className="p-3 rounded-xl bg-[#0e372b]/60 border border-[#1d5644] space-y-1">
                <div className="flex items-center justify-between text-white font-semibold">
                  <span>Open Daily</span>
                  <span className="text-[#fe753c]">10:00 AM – 1:00 AM</span>
                </div>
                <p className="text-[11px] text-[#a6d0be]">Monday through Sunday</p>
              </div>

              <div className="pt-2 text-[12px] space-y-1">
                <p className="text-white font-medium">Physical Address:</p>
                <p className="text-[#a6d0be]">
                  {SALON_DATA.addressLine1}, {SALON_DATA.addressLine2},
                </p>
                <p className="text-[#a6d0be]">
                  {SALON_DATA.city} – {SALON_DATA.pincode}
                </p>
                <p className="text-[#fe753c] text-[11px] font-medium pt-0.5">
                  Landmark: {SALON_DATA.landmark}
                </p>
                <p className="text-white text-[12px] font-semibold pt-1">
                  Desk: {SALON_DATA.phoneDisplay}
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter / Direct Inquiry (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-label-caps text-[11px] uppercase text-white font-bold tracking-wider">
              The StyleX Circle
            </h4>
            <p className="font-body-md text-[13px] text-[#9eb6aa]">
              Receive seasonal privileges, bridal booking announcements, and exclusive hair care invitations.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2.5 rounded-full bg-[#0e372b]/80 border border-[#1d5644] text-white font-body-md text-[13px] placeholder-[#9eb6aa]/70 focus:outline-none focus:border-[#fe753c] transition-colors"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#fe753c] text-white font-label-md text-[13px] hover:bg-[#e0622a] transition-all font-semibold shadow-[0_4px_14px_rgba(254,117,60,0.35)] cursor-pointer active:scale-95"
              >
                {subscribed ? 'Subscribed to Circle ✓' : 'Join Privilege Circle'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright (Desktop) */}
        <div className="hidden md:flex pt-6 border-t border-[#1b4335] flex-col md:flex-row items-center justify-between gap-4 font-caption text-[12px] text-[#9eb6aa]">
          <p>© {new Date().getFullYear()} StyleX Signature Salon • Tirur Outlet, Kerala. All rights reserved.</p>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={SALON_DATA.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a6d0be] hover:text-white transition-colors"
            >
              {SALON_DATA.instagramHandle}
            </a>
            <span>•</span>
            <span className="text-[#a6d0be]">Luxury Family Salon</span>
          </div>
        </div>
      </div>
    </footer>
  );
};


