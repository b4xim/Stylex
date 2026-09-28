import React, { useRef, useState, useEffect } from 'react';
import { REELS, PORTFOLIO_WORKS, SALON_DATA } from '../data/salonData.ts';
import { ReelItem, PortfolioWork } from '../types.ts';

interface AtelierReelsProps {
  onOpenReel: (reel: ReelItem) => void;
  onOpenPortfolio: (item: PortfolioWork) => void;
}

export const AtelierReels: React.FC<AtelierReelsProps> = ({ onOpenReel, onOpenPortfolio }) => {
  const reelsTrackRef = useRef<HTMLDivElement>(null);
  const portfolioTrackRef = useRef<HTMLDivElement>(null);

  const [reels, setReels] = useState<ReelItem[]>(() => {
    try {
      const saved =
        localStorage.getItem('stylex_tirur_v6_reels') ||
        localStorage.getItem('stylex_reels');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const active = parsed.filter((r: any) => r.isActive !== false);
          if (active.length > 0) return active;
        }
      }
    } catch {}
    return REELS;
  });

  const [portfolioWorks, setPortfolioWorks] = useState<PortfolioWork[]>(() => {
    try {
      const saved =
        localStorage.getItem('stylex_tirur_v6_photos') ||
        localStorage.getItem('stylex_tirur_v6_portfolio') ||
        localStorage.getItem('stylex_photos') ||
        localStorage.getItem('stylex_portfolio');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const active = parsed.filter((p: any) => p.isActive !== false);
          if (active.length > 0) return active;
        }
      }
    } catch {}
    return PORTFOLIO_WORKS;
  });

  useEffect(() => {
    // 1. Fetch live reels from backend PostgreSQL API
    fetch('/api/promotions/reels')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          const active = data.data.filter((r: any) => r.isActive !== false);
          if (active.length > 0) {
            setReels(active);
          }
        }
      })
      .catch((err) => console.warn('Live reels load notice:', err));

    // 2. Fetch live transformation photos from backend PostgreSQL API
    fetch('/api/promotions/photos')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          const active = data.data.filter((p: any) => p.isActive !== false);
          if (active.length > 0) {
            setPortfolioWorks(active);
          }
        }
      })
      .catch((err) => console.warn('Live portfolio load notice:', err));

    // 3. Storage event listener for real-time cross-tab updates from Dashboard
    const handleSync = () => {
      try {
        const savedReels =
          localStorage.getItem('stylex_tirur_v6_reels') ||
          localStorage.getItem('stylex_reels');
        if (savedReels) {
          const parsed = JSON.parse(savedReels);
          if (Array.isArray(parsed)) {
            const active = parsed.filter((r: any) => r.isActive !== false);
            if (active.length > 0) setReels(active);
          }
        }
        const savedPortfolio =
          localStorage.getItem('stylex_tirur_v6_photos') ||
          localStorage.getItem('stylex_tirur_v6_portfolio') ||
          localStorage.getItem('stylex_photos') ||
          localStorage.getItem('stylex_portfolio');
        if (savedPortfolio) {
          const parsed = JSON.parse(savedPortfolio);
          if (Array.isArray(parsed)) {
            const active = parsed.filter((p: any) => p.isActive !== false);
            if (active.length > 0) setPortfolioWorks(active);
          }
        }
      } catch {}
    };

    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  const scrollReels = (direction: 'left' | 'right') => {
    if (reelsTrackRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      reelsTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollPortfolio = (direction: 'left' | 'right') => {
    if (portfolioTrackRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      portfolioTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-[#fbf9f5] py-20 px-4 sm:px-6 lg:px-12 border-t border-[#e7e5e0] relative" id="atelier-reels">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#112e20]/10 text-[#112e20] font-label-caps text-[11px] uppercase tracking-wider font-bold">
              <svg className="w-3.5 h-3.5 fill-[#fe753c]" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Featured Reels</span>
            </div>
            <h2 className="font-headline-lg text-[30px] sm:text-[38px] text-[#112e20] leading-tight font-display-hero font-bold">
              Real Transformations &amp; Salon Rituals
            </h2>
            <p className="font-body-lg text-[15px] sm:text-[16px] text-[#424844] max-w-xl">
              Watch genuine client makeovers, soothing hair spas, and daily styling rituals captured live at our salon.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <button
                onClick={() => scrollReels('left')}
                aria-label="Previous Reels"
                className="w-10 h-10 rounded-full bg-white border border-[#c2c8c2]/60 text-[#112e20] flex items-center justify-center hover:bg-[#eaefeb] hover:border-[#112e20]/40 transition-all shadow-sm active:scale-95 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <button
                onClick={() => scrollReels('right')}
                aria-label="Next Reels"
                className="w-10 h-10 rounded-full bg-white border border-[#c2c8c2]/60 text-[#112e20] flex items-center justify-center hover:bg-[#eaefeb] hover:border-[#112e20]/40 transition-all shadow-sm active:scale-95 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>

            <a
              href={SALON_DATA.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#c2c8c2]/60 text-[#112e20] font-label-md text-[13px] font-medium hover:border-[#112e20]/40 hover:shadow-md transition-all shadow-sm group"
            >
              <svg className="w-[18px] h-[18px] fill-[#e1306c] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Follow {SALON_DATA.instagramHandle}</span>
            </a>
          </div>
        </div>

        {/* Reels Track */}
        <div
          ref={reelsTrackRef}
          className="flex items-center gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {reels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => onOpenReel(reel)}
              className="w-[82vw] sm:w-[45vw] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start relative rounded-3xl overflow-hidden aspect-[9/16] shadow-lg border border-[#c2c8c2]/40 bg-[#284435] group cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              <img
                alt={reel.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                src={reel.imageUrl}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061d15]/95 via-black/20 to-black/30 pointer-events-none" />

              {/* Top Meta */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold tracking-wide shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fe753c] animate-pulse" />
                  <span>StyleX Reel</span>
                </span>

                {reel.instagramUrl ? (
                  <a
                    href={reel.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="View on Instagram"
                    title="View on Instagram"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 hover:bg-[#fe753c] backdrop-blur-md border border-white/20 text-white text-[11px] font-medium transition-all group/ig shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5 fill-currentColor text-[#fe753c] group-hover/ig:text-white transition-colors" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="text-[11px] font-semibold text-white/90 group-hover/ig:text-white">Instagram</span>
                  </a>
                ) : null}
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#fe753c] group-hover:border-[#fe753c] transition-all shadow-xl">
                  <span className="material-symbols-outlined text-[28px] ml-0.5">play_arrow</span>
                </div>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-4 left-4 right-4 z-10 space-y-2 text-white">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#fe753c] font-label-caps">
                    {reel.tag}
                  </p>
                  <h3 className="text-[16px] font-headline-sm font-semibold leading-snug drop-shadow-sm font-display-hero">
                    {reel.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Finished Client Artistry Gallery Row */}
        <div className="mt-4 border-t border-[#e7e5e0] space-y-6 relative pt-8">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9b4521]" />
              <h3 className="text-[14px] sm:text-[15px] font-bold tracking-wider uppercase text-[#112e20] font-label-caps">
                Client Transformations &amp; Artistry
              </h3>
              <span className="text-[#424844]/40 hidden sm:inline">•</span>
              <span className="text-[12px] text-[#424844]/70 font-normal hidden sm:inline">
                Curated Client Works & Transformations
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => scrollPortfolio('left')}
                aria-label="Previous Gallery"
                className="w-8 h-8 rounded-full border border-[#c2c8c2]/60 flex items-center justify-center text-[#112e20] hover:bg-[#eaefeb] transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>
              <button
                onClick={() => scrollPortfolio('right')}
                aria-label="Next Gallery"
                className="w-8 h-8 rounded-full border border-[#c2c8c2]/60 flex items-center justify-center text-[#112e20] hover:bg-[#eaefeb] transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>

          <div
            ref={portfolioTrackRef}
            className="w-full flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto sm:overflow-visible py-1"
            style={{ scrollbarWidth: 'none' }}
          >
            {portfolioWorks.map((work) => (
              <div
                key={work.id}
                onClick={() => onOpenPortfolio(work)}
                className="w-[70vw] sm:w-auto flex-shrink-0 rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-[#c2c8c2]/50 bg-white group transition-all duration-300 aspect-[4/5] cursor-pointer relative"
              >
                <img
                  alt={work.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  src={work.imageUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#fe753c]">
                    {work.category}
                  </p>
                  <p className="text-[12px] font-semibold truncate font-display-hero">{work.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
