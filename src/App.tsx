/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { PromotionsCarousel } from './components/PromotionsCarousel.tsx';
import { BookingEngine } from './components/BookingEngine.tsx';
import { ServicesMenu } from './components/ServicesMenu.tsx';
import { AtelierReels } from './components/AtelierReels.tsx';
import { ClientReviews } from './components/ClientReviews.tsx';
import { ContactAndMap } from './components/ContactAndMap.tsx';
import { Footer } from './components/Footer.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { ReelModal } from './components/ReelModal.tsx';
import { PortfolioModal } from './components/PortfolioModal.tsx';
import { BookingPage } from './pages/BookingPage.tsx';
import { BookingState, ReelItem, ServiceItem } from './types.ts';
import { PORTFOLIO_WORKS } from './data/salonData.ts';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('hair-1');

  // Modals state
  const [confirmedBooking, setConfirmedBooking] = useState<BookingState | null>(null);
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);
  const [activePortfolioItem, setActivePortfolioItem] = useState<(typeof PORTFOLIO_WORKS)[0] | null>(null);

  const [activeSection, setActiveSection] = useState<string>('home');

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isBookingPage = currentPath === '/booking';
  const activeScreen = isBookingPage ? 'booking' : activeSection;

  // Scroll spy for homepage sections to highlight active nav link on scroll
  useEffect(() => {
    if (isBookingPage) return;

    const handleScroll = () => {
      if (window.scrollY < 250) {
        setActiveSection('home');
        return;
      }
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        setActiveSection('contact');
        return;
      }

      const sections = [
        { id: 'hero-top', name: 'home' },
        { id: 'services-curation', name: 'services' },
        { id: 'contact-location', name: 'contact' },
      ];

      const scrollPosition = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(sections[i].name);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBookingPage]);

  // Client-side router navigation
  const navigate = (path: string, sectionId?: string, screenName?: string) => {
    const targetPath = path.startsWith('/booking') ? '/booking' : '/';
    if (screenName) {
      setActiveSection(screenName);
    } else if (sectionId === 'services-curation') {
      setActiveSection('services');
    } else if (sectionId === 'contact-location') {
      setActiveSection('contact');
    } else if (sectionId === 'hero-top') {
      setActiveSection('home');
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
      setCurrentPath(targetPath);
    }
    if (targetPath === '/booking') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Scroll to booking engine with smooth scroll
  const scrollToBooking = (serviceId?: string) => {
    if (serviceId) {
      setSelectedServiceId(serviceId);
    }
    if (isBookingPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById('booking-engine');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    if (isBookingPage) {
      navigate('/', 'services-curation');
      return;
    }
    const element = document.getElementById('services-curation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Promo card claim handler
  const handleSelectPromo = (promoId: string) => {
    if (promoId === 'promo-1') {
      scrollToBooking('hair-5');
    } else if (promoId === 'promo-2') {
      scrollToBooking('hair-4');
    } else {
      scrollToBooking('bridal-1');
    }
  };

  // Services menu direct booking
  const handleSelectServiceToBook = (service: ServiceItem) => {
    scrollToBooking(service.id);
  };

  // Book from reel
  const handleBookFromReel = (reel: ReelItem) => {
    if (reel.category.includes('Color')) {
      scrollToBooking('hair-4');
    } else if (reel.category.includes('Scalp')) {
      scrollToBooking('hair-5');
    } else if (reel.category.includes('Skin')) {
      scrollToBooking('skin-1');
    } else if (reel.category.includes('Bridal')) {
      scrollToBooking('bridal-1');
    } else {
      scrollToBooking('hair-1');
    }
  };

  // Book from portfolio
  const handleBookFromPortfolio = (_artisan: string) => {
    scrollToBooking('hair-1');
  };

  return (
    <div className="min-h-screen bg-[#f6faf7] font-body-md text-[#181d1b] selection:bg-[#ffdbcf] selection:text-[#380d00] flex flex-col">
      {/* Top Fixed Navigation */}
      <Navbar
        onOpenBooking={() => navigate('/booking')}
        activeScreen={activeScreen}
        setActiveScreen={setActiveSection}
        onNavigate={navigate}
      />

      {/* Main Content (pt-[44px] on mobile since top notice bar is hidden, sm:pt-[72px] on desktop) */}
      <main className="w-full pt-[44px] sm:pt-[72px] bg-[#f6faf7] min-h-[calc(100vh-44px)] sm:min-h-[calc(100vh-72px)] relative flex-grow">
        {isBookingPage ? (
          /* Dedicated Standalone /booking Page */
          <BookingPage
            selectedServiceId={selectedServiceId}
            onConfirmBooking={(booking) => setConfirmedBooking(booking)}
            onNavigateHome={() => navigate('/')}
            onScrollToSection={(sectionId) => navigate('/', sectionId)}
          />
        ) : (
          /* Full Homepage with All Curated Sections & In-Page Booking Card */
          <div className="flex flex-col w-full">
            {/* Hero Section */}
            <HeroSection
              onReserveClick={() => scrollToBooking()}
              onExploreMenuClick={scrollToServices}
            />

            {/* Interactive Promotions Carousel (Hair Spa Rs 599 / Anti Dandruff Rs 999) */}
            <PromotionsCarousel onSelectPromo={handleSelectPromo} />

            {/* In-Page Interactive Concierge Booking Engine (Preserved on Homepage) */}
            <BookingEngine
              initialServiceId={selectedServiceId}
              onConfirmBooking={(booking) => setConfirmedBooking(booking)}
            />

            {/* Curated Signature Services Menu */}
            <ServicesMenu onSelectServiceToBook={handleSelectServiceToBook} />

            {/* Atelier in Motion (Social Dispatch & Reels + Portfolio Artistry) */}
            <AtelierReels
              onOpenReel={(reel) => setActiveReel(reel)}
              onOpenPortfolio={(item) => setActivePortfolioItem(item)}
            />

            {/* Client Reviews & Experiences (Voices of the Sanctuary) */}
            <ClientReviews />

            {/* Contact & Interactive Map Canvas */}
            <ContactAndMap />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals */}
      <BookingModal
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
      />

      <ReelModal
        reel={activeReel}
        onClose={() => setActiveReel(null)}
        onBookLook={handleBookFromReel}
      />

      <PortfolioModal
        item={activePortfolioItem}
        onClose={() => setActivePortfolioItem(null)}
        onBookArtisan={handleBookFromPortfolio}
      />


      {/* Floating Concierge Action Trigger on mobile/tablet */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <button
          onClick={() => scrollToBooking()}
          aria-label="Book Atelier Session"
          className="w-14 h-14 rounded-full bg-[#fe753c] text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all border-2 border-white"
        >
          <span className="material-symbols-outlined text-[26px]">calendar_month</span>
        </button>
      </div>
    </div>
  );
}
