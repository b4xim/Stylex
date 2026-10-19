import React, { useState, useEffect, useRef } from 'react';
import { PROMO_SLIDES } from '../data/salonData.ts';

interface PromotionsCarouselProps {
  onSelectPromo: (promoId: string) => void;
}

export const PromotionsCarousel: React.FC<PromotionsCarouselProps> = ({ onSelectPromo }) => {
  const [slides, setSlides] = useState<any[]>(() => {
    try {
      const saved =
        localStorage.getItem('stylex_tirur_v6_banners') ||
        localStorage.getItem('stylex_banners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const active = parsed.filter((b: any) => b.isActive !== false);
          return active.map((b: any, idx: number) => ({
            id: b.id || `promo-${idx + 1}`,
            title: b.title,
            subtitle: b.subtitle || b.validity || 'Limited Time Privilege',
            tag: b.badge || b.tag || 'Special Offer',
            imageUrl: b.imageUrl,
            offerText: b.subtitle || b.validity || 'Limited Time Privilege',
            primaryService: b.title,
            primaryPrice: 'Signature Privilege',
            secondaryService: 'Consultation',
            secondaryPrice: 'Included',
          }));
        }
      }
    } catch {
      // fallback
    }
    return PROMO_SLIDES;
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe support for smooth mobile swiping
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-advance carousel banner every 5 seconds
  useEffect(() => {
    if (!slides || slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length, currentSlideIndex, isPaused]);

  useEffect(() => {
    const applyBanners = (list: any[]) => {
      const active = (list || []).filter((b: any) => b.isActive !== false);
      setSlides(
        active.map((b: any, idx: number) => ({
          id: b.id || `promo-${idx + 1}`,
          title: b.title,
          subtitle: b.subtitle || b.validity || 'Limited Time Privilege',
          tag: b.badge || b.tag || 'Special Offer',
          imageUrl: b.imageUrl,
          offerText: b.subtitle || b.validity || 'Limited Time Privilege',
          primaryService: b.title,
          primaryPrice: 'Signature Privilege',
          secondaryService: 'Consultation',
          secondaryPrice: 'Included',
        }))
      );
    };

    // 1. Fetch live banners from backend API
    fetch('/api/promotions/banners')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          applyBanners(data.data);
        }
      })
      .catch(() => {});

    // 2. Storage event listener for cross-tab updates
    const handleSync = () => {
      try {
        const saved =
          localStorage.getItem('stylex_tirur_v6_banners') ||
          localStorage.getItem('stylex_banners');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            applyBanners(parsed);
          }
        }
      } catch {}
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  useEffect(() => {
    if (currentSlideIndex >= slides.length) {
      setCurrentSlideIndex(0);
    }
  }, [slides.length, currentSlideIndex]);

  // When all carousel promotions are disabled or deleted, the carousel itself should not be visible on the home page
  if (!slides || slides.length === 0) {
    return null;
  }

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 40;
      if (distance > minSwipeDistance) {
        // Swiped left -> next
        nextSlide();
      } else if (distance < -minSwipeDistance) {
        // Swiped right -> prev
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentSlide = slides[currentSlideIndex] || slides[0];
  if (!currentSlide) return null;

  return (
    <section className="w-full bg-[#f6faf7] py-4 sm:py-8 lg:py-10 px-3 sm:px-6 lg:px-12 relative" id="promotions-carousel">
      <div className="max-w-7xl mx-auto w-full">
        {/* Carousel Frame */}
        <div
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-2xl border border-[#112e20]/15 bg-[#0a1e16] group w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Visual Display */}
          <div
            className="w-full relative flex items-center justify-center cursor-pointer overflow-hidden bg-black/40"
            onClick={() => onSelectPromo(currentSlide.id)}
          >
            <img
              key={currentSlide.id || currentSlideIndex}
              alt={currentSlide.title}
              className="w-full h-auto max-h-[460px] sm:max-h-[520px] object-cover sm:object-contain select-none transition-all duration-700 ease-out group-hover:scale-[1.01] animate-in fade-in block"
              src={currentSlide.imageUrl}
            />
          </div>

          {/* Top-Left Tag - Hidden on mobile, visible on desktop */}
          <div className="hidden sm:block absolute top-5 left-5 z-20 pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#112e20]/10 shadow-md text-[#112e20] font-label-caps text-[11px] uppercase tracking-wider font-bold">
              <span className="material-symbols-outlined text-[15px] text-[#9b4521]">workspace_premium</span>
              <span>{currentSlide.tag}</span>
            </div>
          </div>

          {slides.length > 1 && (
            <>
              {/* Top-Right Counter Pill */}
              <div className="absolute top-3 sm:top-5 right-3 sm:right-5 z-20 hidden sm:block pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white font-label-caps text-[11px] uppercase tracking-wider font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fe753c] animate-pulse" />
                  <span>Slide {currentSlideIndex + 1} of {slides.length} • Seasonal Curation</span>
                </div>
              </div>

              {/* Previous Arrow - Hidden on mobile to avoid blocking content, visible on tablet/desktop */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                aria-label="Previous Offer"
                className="hidden sm:flex absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#112e20] shadow-xl backdrop-blur-md border border-black/10 items-center justify-center transition-all z-20 cursor-pointer active:scale-95 hover:scale-105"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">chevron_left</span>
              </button>

              {/* Next Arrow - Hidden on mobile to avoid blocking content, visible on tablet/desktop */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                aria-label="Next Offer"
                className="hidden sm:flex absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#112e20] shadow-xl backdrop-blur-md border border-black/10 items-center justify-center transition-all z-20 cursor-pointer active:scale-95 hover:scale-105"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">chevron_right</span>
              </button>

              {/* Bottom Dots Indicator Bar */}
              <div className="absolute bottom-2 sm:bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-black/50 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/20 shadow-md">
                {slides.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlideIndex(idx);
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all cursor-pointer rounded-full ${
                      currentSlideIndex === idx
                        ? 'w-5 sm:w-7 h-1.5 sm:h-2 bg-[#fe753c]'
                        : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/60 hover:bg-white'
                    }`}
                    type="button"
                  />
                ))}
              </div>
            </>
          )}

          {/* Quick Reserve Privilege Ribbon Hover / Tap Bar */}
          <div className="hidden md:flex absolute bottom-4 right-6 z-20 items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectPromo(currentSlide.id);
              }}
              className="px-4 py-2 rounded-full bg-[#fe753c] text-white font-medium text-[12px] shadow-lg hover:bg-[#e0622a] transition-all flex items-center gap-1.5"
            >
              <span>Claim Privilege</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
