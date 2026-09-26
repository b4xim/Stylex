import React, { useRef } from 'react';
import { REELS, PORTFOLIO_WORKS } from '../data/salonData.ts';
import { ReelItem } from '../types.ts';

interface AtelierReelsProps {
  onOpenReel: (reel: ReelItem) => void;
  onOpenPortfolio: (item: (typeof PORTFOLIO_WORKS)[0]) => void;
}

export const AtelierReels: React.FC<AtelierReelsProps> = ({ onOpenReel, onOpenPortfolio }) => {
  const reelsTrackRef = useRef<HTMLDivElement>(null);
  const portfolioTrackRef = useRef<HTMLDivElement>(null);

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
              <span className="material-symbols-outlined text-[15px] text-[#9b4521]">play_circle</span>
              <span>Social Dispatch & Reels</span>
            </div>
            <h2 className="font-headline-lg text-[32px] sm:text-[40px] text-[#112e20] leading-tight">
              Atelier in Motion:<br />
              <span className="italic font-normal">Real Transformations & Salon Rituals</span>
            </h2>
            <p className="font-body-lg text-[15px] sm:text-[16px] text-[#424844] max-w-xl">
              Step inside our sanctuary through genuine client moments, soothing scalp therapies, and breathtaking
              hair transformations captured daily.
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
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#c2c8c2]/60 text-[#112e20] font-label-md text-[13px] font-medium hover:border-[#112e20]/40 hover:shadow-md transition-all shadow-sm group"
            >
              <span className="material-symbols-outlined text-[18px] text-[#9b4521] group-hover:scale-110 transition-transform">
                photo_camera
              </span>
              <span>Follow @StyleXAtelier</span>
            </a>
          </div>
        </div>

        {/* Reels Track */}
        <div
          ref={reelsTrackRef}
          className="flex items-center gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {REELS.map((reel) => (
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
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[14px] text-[#ffdbcf]">visibility</span>
                  {reel.views}
                </span>
                <span className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[16px]">bookmark</span>
                </span>
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

                <div className="flex items-center gap-1.5 text-[11px] text-[#c2cec6] pt-1 border-t border-white/15">
                  <span className="material-symbols-outlined text-[13px] text-[#ffdbcf]">music_note</span>
                  <span className="truncate">{reel.audioTrack}</span>
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
                Atelier Finished Artistry
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
            {PORTFOLIO_WORKS.map((work) => (
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
