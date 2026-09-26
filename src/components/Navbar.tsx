import React, { useState } from 'react';
import { LOGO_URL } from '../data/salonData.ts';

interface NavbarProps {
  onOpenBooking: () => void;
  activeScreen?: string;
  setActiveScreen?: (screen: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, activeScreen = 'home', setActiveScreen }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string, screenName?: string) => {
    setMobileMenuOpen(false);
    if (setActiveScreen && screenName) {
      setActiveScreen(screenName);
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Top Luxury Ticker / Brand Bar */}
      <div className="w-full bg-[#112e20] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-10 flex items-center justify-between font-label-md text-[13px]">
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="tel:+15557892539"
              className="flex items-center gap-1.5 hover:text-[#fe753c] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#caead5]">call</span>
              <span>+1 (555) 789-2539</span>
            </a>
            <span className="hidden sm:flex items-center gap-1.5 text-white/80">
              <span className="material-symbols-outlined text-[16px] text-[#caead5]">schedule</span>
              <span>Tue - Sun: 9:00 AM - 8:00 PM</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-1.5 text-[#aeceba]">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span>482 Mayfair Boulevard, Suite 100</span>
            </span>
            <span className="hidden lg:inline text-white/30">|</span>
            <span className="font-label-caps text-[11px] uppercase tracking-wider text-[#ffdbcf] font-bold">
              Luxury Concierge Service
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full bg-[#f6faf7]/90 backdrop-blur-xl border-b border-black/5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('hero-top', 'home')}
              className="inline-flex items-center text-left focus:outline-none"
            >
              <img
                alt="StyleX Signature Salon"
                className="h-9 sm:h-10 w-auto object-contain"
                src={LOGO_URL}
                onError={(e) => {
                  // Fallback if image load fails
                  (e.target as HTMLElement).style.display = 'none';
                  const fallback = document.getElementById('logo-fallback-nav');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div id="logo-fallback-nav" className="hidden flex-col">
                <div className="flex items-baseline text-[24px] font-bold text-[#112e20]">
                  <span>STYLE</span>
                  <span className="text-[#9b4521] italic font-serif ml-0.5 text-[28px]">X</span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#112e20]/80 font-bold -mt-1">
                  SIGNATURE SALON
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-8 text-[14px]">
            <button
              onClick={() => handleNavClick('hero-top', 'home')}
              className={`font-body-md font-semibold transition-colors cursor-pointer ${
                activeScreen === 'home' ? 'text-[#112e20]' : 'text-[#424844] hover:text-[#112e20]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('promotions-carousel')}
              className="font-body-md text-[#424844] hover:text-[#112e20] transition-colors cursor-pointer"
            >
              Privileges
            </button>
            <button
              onClick={() => handleNavClick('booking-engine', 'booking')}
              className={`font-body-md font-medium transition-colors cursor-pointer ${
                activeScreen === 'booking' ? 'text-[#112e20] font-semibold' : 'text-[#424844] hover:text-[#112e20]'
              }`}
            >
              Booking
            </button>
            <button
              onClick={() => handleNavClick('services-curation', 'services')}
              className={`font-body-md font-medium transition-colors cursor-pointer ${
                activeScreen === 'services' ? 'text-[#112e20] font-semibold' : 'text-[#424844] hover:text-[#112e20]'
              }`}
            >
              Services Menu
            </button>
            <button
              onClick={() => handleNavClick('atelier-reels')}
              className="font-body-md text-[#424844] hover:text-[#112e20] transition-colors cursor-pointer"
            >
              Atelier In Motion
            </button>
            <button
              onClick={() => handleNavClick('contact-location')}
              className="font-body-md text-[#424844] hover:text-[#112e20] transition-colors cursor-pointer"
            >
              Contact Us
            </button>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 rounded-full bg-[#9b4521] text-white font-label-md text-[13px] font-semibold shadow-[0_4px_16px_-2px_rgba(155,69,33,0.35)] hover:bg-[#fe9167] hover:text-[#752906] transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              Book Appointment
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/80 border border-black/10 text-[#112e20]"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden w-full bg-[#f6faf7] border-b border-[#112e20]/10 px-6 py-6 space-y-4 shadow-2xl">
          <div className="flex flex-col gap-3 text-[15px] font-medium text-[#112e20]">
            <button
              onClick={() => handleNavClick('hero-top', 'home')}
              className="text-left py-2 border-b border-[#112e20]/5 hover:text-[#9b4521]"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('promotions-carousel')}
              className="text-left py-2 border-b border-[#112e20]/5 hover:text-[#9b4521]"
            >
              Special Privileges & Offers
            </button>
            <button
              onClick={() => handleNavClick('booking-engine', 'booking')}
              className="text-left py-2 border-b border-[#112e20]/5 hover:text-[#9b4521]"
            >
              Reserve Signature Appointment
            </button>
            <button
              onClick={() => handleNavClick('services-curation', 'services')}
              className="text-left py-2 border-b border-[#112e20]/5 hover:text-[#9b4521]"
            >
              Curated Services Menu
            </button>
            <button
              onClick={() => handleNavClick('atelier-reels')}
              className="text-left py-2 border-b border-[#112e20]/5 hover:text-[#9b4521]"
            >
              Atelier In Motion (Reels & Artistry)
            </button>
            <button
              onClick={() => handleNavClick('client-reviews')}
              className="text-left py-2 border-b border-[#112e20]/5 hover:text-[#9b4521]"
            >
              Client Reviews & Stories
            </button>
            <button
              onClick={() => handleNavClick('contact-location')}
              className="text-left py-2 hover:text-[#9b4521]"
            >
              Concierge & Location Map
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 rounded-full bg-[#fe753c] text-white font-semibold text-center shadow-md"
            >
              Reserve Session
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
