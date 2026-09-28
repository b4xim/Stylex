import React, { useState, useEffect } from 'react';
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

  const currentSlide = slides[currentSlideIndex] || slides[0];
  if (!currentSlide) return null;

  return (
    <section className="w-full bg-[#f6faf7] py-8 sm:py-10 px-4 sm:px-6 lg:px-12 relative" id="promotions-carousel">
      <div className="max-w-7xl mx-auto w-full">
        {/* Carousel Frame */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#112e20]/20 bg-[#112e20] group w-full">
          {/* Main Visual Display */}
          <div className="w-full aspect-[16/7] sm:aspect-[21/9] lg:aspect-[24/9] min-h-[220px] sm:min-h-[280px] flex items-center justify-center relative bg-gradient-to-b from-[#08241b] to-[#051812] cursor-pointer"
               onClick={() => onSelectPromo(currentSlide.id)}>
            <img
              alt={currentSlide.title}
              className="w-full h-full object-contain select-none transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              src={currentSlide.imageUrl}
            />
          </div>

          {/* Top-Left Tag */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#112e20]/10 shadow-md text-[#112e20] font-label-caps text-[11px] uppercase tracking-wider font-bold">
              <span className="material-symbols-outlined text-[15px] text-[#9b4521]">workspace_premium</span>
              <span>{currentSlide.tag}</span>
            </div>
          </div>

          {slides.length > 1 && (
            <>
              {/* Top-Right Counter Pill */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 hidden sm:block">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white font-label-caps text-[11px] uppercase tracking-wider font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fe753c] animate-pulse" />
                  <span>Slide {currentSlideIndex + 1} of {slides.length} • Seasonal Curation</span>
                </div>
              </div>

              {/* Previous Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                aria-label="Previous Offer"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-[#112e20] shadow-lg backdrop-blur-md border border-black/10 flex items-center justify-center transition-all z-20 cursor-pointer active:scale-95 hover:scale-105"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">chevron_left</span>
              </button>

              {/* Next Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                aria-label="Next Offer"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-[#112e20] shadow-lg backdrop-blur-md border border-black/10 flex items-center justify-center transition-all z-20 cursor-pointer active:scale-95 hover:scale-105"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">chevron_right</span>
              </button>

              {/* Bottom Dots Indicator Bar */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
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
                        ? 'w-7 h-2 bg-[#fe753c]'
                        : 'w-2 h-2 bg-white/60 hover:bg-white'
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
