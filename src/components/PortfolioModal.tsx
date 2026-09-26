import React from 'react';
import { PORTFOLIO_WORKS } from '../data/salonData.ts';

interface PortfolioModalProps {
  item: (typeof PORTFOLIO_WORKS)[0] | null;
  onClose: () => void;
  onBookArtisan: (artisan: string) => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ item, onClose, onBookArtisan }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#071a14] rounded-3xl overflow-hidden shadow-2xl border border-[#276451] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Lightbox"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* High-Resolution Image Container */}
        <div className="md:w-1/2 aspect-[4/5] bg-black relative">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Narrative & Artisan details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between text-white space-y-4">
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#fe753c] font-label-caps">
              {item.category}
            </span>

            <h3 className="text-[22px] font-bold font-display-hero text-white leading-snug">
              {item.title}
            </h3>

            <div className="space-y-1 pt-1 border-t border-white/10 text-[13px] text-[#aeceba]">
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

            <p className="text-[12px] text-[#9eb6aa] leading-relaxed pt-2">
              Every client transformation is bespoke, calibrated to hair diameter, natural pigment base, and
              facial geometry. Preserved with certified biodynamic phytokeratin sealers.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => {
                onClose();
                onBookArtisan(item.artisan);
              }}
              className="w-full py-3 rounded-full bg-[#fe753c] hover:bg-[#e0622a] text-white font-semibold text-[13px] shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Book with {item.artisan}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
