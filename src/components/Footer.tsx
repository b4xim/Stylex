import React, { useState } from 'react';

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
    <footer className="w-full bg-gradient-to-b from-[#08241b] to-[#051812] text-[#d4ebe1] pt-14 pb-8 border-t border-[#1b4335] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <a href="#" className="inline-flex flex-col group">
                <div className="flex items-baseline tracking-wide leading-none font-bold text-[28px]">
                  <span className="text-[#f6faf7] tracking-wider font-sans">STYLE</span>
                  <span className="text-[#c55d38] font-display-hero italic font-semibold ml-0.5 text-[32px]">
                    X
                  </span>
                </div>
                <span className="text-[10px] tracking-[0.25em] text-[#d4ebe1]/70 font-medium uppercase font-sans mt-1">
                  SIGNATURE SALON
                </span>
              </a>
            </div>

            <p className="font-body-md text-[13px] sm:text-[14px] text-[#9eb6aa] max-w-sm leading-relaxed">
              High-end editorial hair artistry, bespoke botanical therapies, and elevated beauty rituals designed
              for timeless elegance.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="w-10 h-10 rounded-full bg-[#0e372b] border border-[#1d5644] flex items-center justify-center text-[#d4ebe1] hover:text-[#fe753c] hover:border-[#fe753c]/50 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">share</span>
              </span>
              <span className="w-10 h-10 rounded-full bg-[#0e372b] border border-[#1d5644] flex items-center justify-center text-[#d4ebe1] hover:text-[#fe753c] hover:border-[#fe753c]/50 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </span>
              <span className="w-10 h-10 rounded-full bg-[#0e372b] border border-[#1d5644] flex items-center justify-center text-[#d4ebe1] hover:text-[#fe753c] hover:border-[#fe753c]/50 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">public</span>
              </span>
            </div>
          </div>

          {/* Curation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-label-caps text-[11px] uppercase text-white font-bold tracking-wider">
              Curation
            </h4>
            <ul className="space-y-2.5 font-body-md text-[13px] text-[#9eb6aa]">
              <li className="hover:text-white transition-colors">
                <a href="#services-curation">Hair Sculpture & Color</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="#services-curation">Botanical Scalp Spa</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="#services-curation">Bridal & Gala Editorial</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="#atelier-reels">Artisanal Portfolio</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="#client-reviews">Client Stories</a>
              </li>
            </ul>
          </div>

          {/* Sanctuary Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-label-caps text-[11px] uppercase text-white font-bold tracking-wider">
              Sanctuary Hours
            </h4>
            <div className="space-y-1.5 font-body-md text-[13px] text-[#9eb6aa]">
              <div className="flex justify-between">
                <span className="font-medium text-[#d4ebe1]">Tue — Fri</span>
                <span>9:00 AM — 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-[#d4ebe1]">Saturday</span>
                <span>9:00 AM — 7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-[#d4ebe1]">Sunday</span>
                <span>10:00 AM — 5:00 PM</span>
              </div>
              <div className="flex justify-between text-[#fe753c]">
                <span className="font-medium">Monday</span>
                <span>Closed (Private Sessions)</span>
              </div>
            </div>

            <div className="pt-1">
              <p className="font-label-md text-[12px] text-[#9eb6aa]">
                <span className="font-medium text-[#d4ebe1]">Atelier Address:</span> 482 Mayfair Boulevard, Suite
                100, Beverly Hills, CA
              </p>
            </div>
          </div>

          {/* The Salon Journal Newsletter (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-label-caps text-[11px] uppercase text-white font-bold tracking-wider">
              The Salon Journal
            </h4>
            <p className="font-body-md text-[13px] text-[#9eb6aa]">
              Receive exclusive seasonal invitations, master stylist insights, and private bespoke salon reservations.
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
                {subscribed ? 'Subscribed to Journal ✓' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[#1b4335] flex flex-col md:flex-row items-center justify-between gap-4 font-caption text-[12px] text-[#9eb6aa]">
          <p>© 2025 StyleX Signature Salon. All rights reserved. Crafted with botanical refinement.</p>

          <div className="flex items-center gap-6">
            <a href="#" className="inline-flex flex-col items-end opacity-85 hover:opacity-100 transition-opacity">
              <div className="flex items-baseline leading-none font-bold text-[18px]">
                <span className="text-[#f6faf7] tracking-wider font-sans">STYLE</span>
                <span className="text-[#c55d38] font-display-hero italic font-semibold ml-0.5 text-[20px]">
                  X
                </span>
              </div>
              <span className="text-[7px] tracking-[0.22em] text-[#d4ebe1]/70 font-medium uppercase font-sans mt-0.5">
                SIGNATURE SALON
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
