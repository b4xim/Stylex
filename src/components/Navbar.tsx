import React, { useState, useEffect } from 'react';
import { LOGO_URL, SALON_DATA } from '../data/salonData.ts';

interface NavbarProps {
  onOpenBooking: () => void;
  activeScreen?: string;
  setActiveScreen?: (screen: string) => void;
  onNavigate?: (path: string, sectionId?: string, screenName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  activeScreen = 'home',
  setActiveScreen,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string, screenName?: string, path?: string) => {
    setMobileMenuOpen(false);
    if (setActiveScreen && screenName) {
      setActiveScreen(screenName);
    }
    if (onNavigate) {
      onNavigate(path || (screenName === 'booking' ? '/booking' : '/'), sectionId, screenName);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Home', sectionId: 'hero-top', screen: 'home', path: '/' },
    { label: 'Booking', sectionId: 'booking-engine', screen: 'booking', path: '/booking' },
    { label: 'Services Menu', sectionId: 'services-curation', screen: 'services', path: '/#services-curation' },
    { label: 'Contact Us', sectionId: 'contact-location', screen: 'contact', path: '/#contact-location' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* Ultra-Slim Top Notice Bar (Hidden on Mobile, Visible on Desktop/Tablet) */}
      <div className="hidden sm:block w-full bg-[#021811] text-white border-b border-white/[0.08] text-[10px] sm:text-[10.5px] font-medium tracking-wide">
        <div className="w-full px-3 sm:px-6 lg:px-8 h-6 flex items-center justify-between overflow-hidden">
          {/* Left: Mobile Number & Operating Hours */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${SALON_DATA.phoneNumberClean}`}
              className="inline-flex items-center gap-1.5 font-bold tracking-wider text-white hover:text-[#fe753c] transition-colors"
              title="Call StyleX Signature Salon"
            >
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fe753c] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#fe753c]" />
              </span>
              <span>{SALON_DATA.phoneDisplay}</span>
            </a>
            <span className="text-white/20 hidden xs:inline">•</span>
            <span className="text-[#a6d0be] hidden xs:inline text-[9.5px] sm:text-[10px] tracking-wider uppercase">
              Open Daily 10 AM – 1 AM
            </span>
          </div>

          {/* Right: Luxury Family Salon & Location */}
          <div className="flex items-center gap-2 text-[#b0c4b8] text-[9.5px] sm:text-[10px]">
            <span className="hidden sm:inline-flex items-center gap-1">
              <span className="text-[#fe753c] text-[10px]">★</span>
              <span>Luxury Family Salon</span>
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <a
              href={SALON_DATA.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#d4ebe1] hover:text-[#fe753c] transition-colors"
              title="Directions to StyleX"
            >
              <span className="material-symbols-outlined text-[11px] text-[#fe753c]">location_on</span>
              <span className="truncate max-w-[130px] sm:max-w-none">One Arcade, Near Lenskart</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Slim Header Bar */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#031b14]/95 backdrop-blur-xl border-b border-[#144e3d]/80 shadow-[0_4px_20px_rgba(0,0,0,0.35)]'
            : 'bg-[#052118]/90 backdrop-blur-md border-b border-[#124536]/50 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-11 sm:h-12 flex items-center justify-between gap-4 relative">
          {/* Desktop Brand Logo (Left-aligned) */}
          <button
            onClick={() => handleNavClick('hero-top', 'home', '/')}
            className="hidden sm:flex items-center select-none focus:outline-none group cursor-pointer"
            aria-label="StyleX Signature Salon Home"
          >
            <img
              alt="StyleX Signature Salon"
              className="h-6 sm:h-6.5 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              src={LOGO_URL}
            />
          </button>

          {/* Mobile Center Brand Logo (Only for Mobile View: StyleX_Logo_Txt) */}
          <button
            onClick={() => handleNavClick('hero-top', 'home', '/')}
            className="sm:hidden absolute left-1/2 -translate-x-1/2 flex items-center select-none focus:outline-none group cursor-pointer"
            aria-label="StyleX Home"
          >
            <img
              alt="StyleX"
              className="h-6 w-auto object-contain transition-transform duration-200 active:scale-95"
              src="/logo_txt.png"
            />
          </button>

          {/* Desktop Nav Items (Slim & Modern - Strictly Home, Booking, Services Menu, Contact Us) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeScreen === link.screen;
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleNavClick(link.sectionId, link.screen, link.path)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium tracking-wide transition-colors cursor-pointer select-none focus:outline-none focus-visible:outline-none ${
                    isActive
                      ? 'text-white bg-white/[0.08]'
                      : 'text-[#caead5]/75 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#fe753c] rounded-full shadow-[0_0_8px_rgba(254,117,60,0.8)]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Slim CTA Button (Desktop only; hidden on mobile) */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="hidden md:inline-flex items-center gap-1 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#fe753c] hover:bg-[#e8652d] text-white text-[11px] sm:text-[11.5px] font-bold shadow-[0_2px_10px_rgba(254,117,60,0.3)] transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>Book Appointment</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-[16px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Slim & Focused) */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-[#031b14]/98 backdrop-blur-2xl border-b border-[#185341] px-6 py-5 shadow-2xl animate-fade-in">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = activeScreen === link.screen;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.sectionId, link.screen, link.path)}
                  className={`text-left py-2.5 px-4 rounded-xl text-[14px] font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-[#0f4637] text-white border border-[#21735a]'
                      : 'text-[#caead5] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="material-symbols-outlined text-[16px] text-[#fe753c]">chevron_right</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 mt-3 border-t border-[#185341]/60">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 rounded-full bg-[#fe753c] hover:bg-[#e8652d] text-white font-bold text-[13px] text-center shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Book Appointment</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
