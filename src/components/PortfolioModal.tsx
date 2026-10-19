import React, { useEffect } from 'react';
import { PortfolioWork } from '../types.ts';

interface PortfolioModalProps {
  item: PortfolioWork | null;
  onClose: () => void;
  onBookArtisan: (artisan: string) => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ item, onClose, onBookArtisan }) => {
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      {/* Mobile Floating Close Button - Fixed to viewport so it is ALWAYS visible and reachable on mobile */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close Lightbox"
        className="md:hidden fixed top-3 right-3 w-10 h-10 rounded-full bg-black/85 backdrop-blur-md text-white flex items-center justify-center transition-all z-50 cursor-pointer shadow-2xl border border-white/30 active:scale-90"
      >
        <span className="material-symbols-outlined text-[22px]">close</span>
      </button>

      <div
        className="relative w-full max-w-2xl max-h-[92dvh] sm:max-h-[90vh] bg-[#071a14] rounded-2xl sm:rounded-3xl overflow-y-auto md:overflow-hidden shadow-2xl border border-[#276451] flex flex-col md:flex-row my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Desktop Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Lightbox"
          className="hidden md:flex absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white items-center justify-center transition-colors z-20 cursor-pointer shadow-md border border-white/10"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* High-Resolution Image Container */}
        <div className="w-full md:w-1/2 aspect-[16/10] sm:aspect-[4/5] max-h-[250px] sm:max-h-none bg-black relative shrink-0">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Narrative & Artisan details */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-between text-white space-y-3 sm:space-y-4">
          <div className="space-y-2 sm:space-y-3">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#fe753c] font-label-caps">
              {item.category}
            </span>

            <h3 className="text-[18px] sm:text-[22px] font-bold font-display-hero text-white leading-snug">
              {item.title}
            </h3>

            <div className="space-y-1 pt-1 border-t border-white/10 text-[12px] sm:text-[13px] text-[#aeceba]">
              <p>
                <span className="text-white font-semibold">Lead Artisan:</span> {item.artisan}
              </p>
              <p>
                <span className="text-white font-semibold">Technique:</span> Freehand Micro-Foiling & Tonal Glaze
              </p>
              <p>
                <span className="text-white font-semibold">Longevity:</span> 4-6 Months Seamless Growth
              </p>
            </div>

            <p className="text-[11px] sm:text-[12px] text-[#9eb6aa] leading-relaxed pt-1 sm:pt-2">
              Every client transformation is bespoke, calibrated to hair diameter, natural pigment base, and
              facial geometry. Preserved with certified biodynamic phytokeratin sealers.
            </p>
          </div>

          <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                onClose();
                onBookArtisan(item.artisan);
              }}
              className="w-full py-2.5 sm:py-3 rounded-full bg-[#fe753c] hover:bg-[#e0622a] text-white font-semibold text-[13px] shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Book with {item.artisan}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="md:hidden w-full py-2 rounded-full bg-white/10 hover:bg-white/15 text-white/80 font-medium text-[12px] flex items-center justify-center cursor-pointer transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
