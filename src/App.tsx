/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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
import { DirectionsModal } from './components/DirectionsModal.tsx';
import { BookingState, ReelItem, ServiceItem } from './types.ts';
import { PORTFOLIO_WORKS } from './data/salonData.ts';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('couture-haircut');

  // Modals state
  const [confirmedBooking, setConfirmedBooking] = useState<BookingState | null>(null);
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);
  const [activePortfolioItem, setActivePortfolioItem] = useState<(typeof PORTFOLIO_WORKS)[0] | null>(null);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);

  // Scroll to booking engine with smooth scroll
  const scrollToBooking = (serviceId?: string) => {
    if (serviceId) {
      setSelectedServiceId(serviceId);
    }
    const element = document.getElementById('booking-engine');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services-curation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Promo card claim handler
  const handleSelectPromo = (promoId: string) => {
    if (promoId === 'promo-1') {
      scrollToBooking('hair-spa-promo');
    } else if (promoId === 'promo-2') {
      scrollToBooking('nordic-balayage');
    } else {
      scrollToBooking('bespoke-bridal');
    }
  };

  // Services menu direct booking
  const handleSelectServiceToBook = (service: ServiceItem) => {
    scrollToBooking(service.id);
  };

  // Book from reel
  const handleBookFromReel = (reel: ReelItem) => {
    if (reel.category.includes('Color')) {
      scrollToBooking('nordic-balayage');
    } else if (reel.category.includes('Scalp')) {
      scrollToBooking('cellular-scalp-spa');
    } else {
      scrollToBooking('dry-editorial-cut');
    }
  };

  // Book from portfolio
  const handleBookFromPortfolio = (artisan: string) => {
    console.log(`Booking with artisan: ${artisan}`);
    scrollToBooking('couture-haircut');
  };

  return (
    <div className="min-h-screen bg-[#f6faf7] font-body-md text-[#181d1b] selection:bg-[#ffdbcf] selection:text-[#380d00] flex flex-col">
      {/* Top Fixed Navigation */}
      <Navbar
        onOpenBooking={() => scrollToBooking()}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
      />

      {/* Main Content (pt-[120px] for the 40px top bar + 80px main navbar) */}
      <main className="w-full pt-[120px] bg-[#f6faf7] min-h-[calc(100vh-120px)] relative flex-grow">
        <div className="flex flex-col w-full">
          {/* Hero Section */}
          <HeroSection
            onReserveClick={() => scrollToBooking()}
            onExploreMenuClick={scrollToServices}
          />

          {/* Interactive Promotions Carousel (Hair Spa Rs 599 / Anti Dandruff Rs 999) */}
          <PromotionsCarousel onSelectPromo={handleSelectPromo} />

          {/* Interactive Concierge Booking Engine */}
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
          <ContactAndMap
            onOpenDirections={() => setShowDirectionsModal(true)}
          />
        </div>
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

      <DirectionsModal
        onClose={() => setShowDirectionsModal(false)}
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
