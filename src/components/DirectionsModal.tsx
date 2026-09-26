import React from 'react';

interface DirectionsModalProps {
  onClose: () => void;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-[#071a14] text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#276451] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0e372b] to-[#164234] p-6 text-center space-y-1.5 border-b border-[#276451]">
          <div className="w-12 h-12 rounded-full bg-[#9b4521] text-white flex items-center justify-center mx-auto shadow-lg mb-2">
            <span className="material-symbols-outlined text-[24px]">near_me</span>
          </div>
          <span className="text-[#fe753c] text-[11px] font-bold uppercase tracking-[0.2em] font-label-caps">
            Concierge & Valet Access
          </span>
          <h3 className="text-[22px] font-bold text-white font-display-hero">
            Directions to StyleX Atelier
          </h3>
          <p className="text-[13px] text-[#caead5]">
            482 Mayfair Boulevard, Suite 100 • Beverly Hills, CA
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-[13px]">
          <div className="bg-[#0f2d22] border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#fe753c] text-[20px] flex-shrink-0 mt-0.5">
                directions_car
              </span>
              <div>
                <h4 className="font-semibold text-white">Complimentary White-Glove Valet</h4>
                <p className="text-[#9eb6aa] text-[12px] leading-relaxed">
                  Approach the private circular driveway on Mayfair Promenade opposite Mayfair Gardens. Our valet team
                  will receive your vehicle and issue your digital key voucher.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-white/10">
              <span className="material-symbols-outlined text-[#caead5] text-[20px] flex-shrink-0 mt-0.5">
                elevator
              </span>
              <div>
                <h4 className="font-semibold text-white">Private Atelier Elevator</h4>
                <p className="text-[#9eb6aa] text-[12px] leading-relaxed">
                  Enter through the bronze lobby doors to Suite 100. Our concierge host will escort you directly to
                  your private styling suite.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-white/10">
              <span className="material-symbols-outlined text-[#fe753c] text-[20px] flex-shrink-0 mt-0.5">
                wine_bar
              </span>
              <div>
                <h4 className="font-semibold text-white">Arrival Hospitality</h4>
                <p className="text-[#9eb6aa] text-[12px] leading-relaxed">
                  Enjoy chilled Brut Reserve champagne, artisanal herbal elixirs, or cold-pressed juices upon arrival.
                </p>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href="https://maps.google.com/?q=482+Mayfair+Boulevard+Beverly+Hills+CA"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-full bg-[#fe753c] hover:bg-[#e0622a] text-white text-[13px] font-semibold text-center shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              <span>Google Maps</span>
            </a>

            <button
              onClick={onClose}
              className="py-3 px-4 rounded-full bg-[#18392d] hover:bg-[#204a3b] text-white text-[13px] font-semibold text-center border border-[#276451] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Back to Atelier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
