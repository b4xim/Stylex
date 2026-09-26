import React, { useState } from 'react';
import { ReelItem } from '../types.ts';

interface ReelModalProps {
  reel: ReelItem | null;
  onClose: () => void;
  onBookLook: (reel: ReelItem) => void;
}

export const ReelModal: React.FC<ReelModalProps> = ({ reel, onClose, onBookLook }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!reel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] max-h-[90vh] rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/20 flex flex-col justify-between">
        {/* Background Visual Asset */}
        <img
          src={reel.imageUrl}
          alt={reel.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

        {/* Top Control Bar */}
        <div className="relative z-10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 border border-white/20">
              <span className="material-symbols-outlined text-[14px] text-[#fe753c]">visibility</span>
              {reel.views}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              aria-label="Toggle Mute"
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close Reel"
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Center Play/Pause Overlay indicator */}
        <div
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
        >
          {!isPlaying && (
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/30 animate-scale-up">
              <span className="material-symbols-outlined text-[36px] ml-1">play_arrow</span>
            </div>
          )}
        </div>

        {/* Right Floating Actions (Like, Bookmark, Share) */}
        <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-4">
          <button
            onClick={() => setIsLiked(!isLiked)}
            aria-label="Like"
            className="flex flex-col items-center gap-1 text-white"
          >
            <div className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
              isLiked ? 'bg-[#fe753c] text-white' : 'bg-black/40 border border-white/20'
            }`}>
              <span className="material-symbols-outlined text-[22px]">
                {isLiked ? 'favorite' : 'favorite_border'}
              </span>
            </div>
            <span className="text-[10px] font-semibold">{isLiked ? '1.8k' : '1.7k'}</span>
          </button>

          <button
            onClick={() => alert('Look bookmarked to your Atelier profile.')}
            aria-label="Save"
            className="flex flex-col items-center gap-1 text-white"
          >
            <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">bookmark</span>
            </div>
            <span className="text-[10px] font-semibold">Save</span>
          </button>
        </div>

        {/* Bottom Details & Booking Shortcut */}
        <div className="relative z-10 p-5 space-y-3">
          <div className="space-y-1 text-white">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#fe753c] uppercase tracking-wider font-label-caps">
                {reel.tag}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-[11px] text-[#aeceba]">{reel.stylistHandle}</span>
            </div>

            <h3 className="text-[18px] font-bold font-display-hero text-white leading-snug">
              {reel.title}
            </h3>

            {reel.description && (
              <p className="text-[12px] text-white/80 line-clamp-2 leading-relaxed">
                {reel.description}
              </p>
            )}

            <div className="flex items-center gap-1.5 text-[11px] text-[#d4ebe1] pt-1">
              <span className="material-symbols-outlined text-[14px] text-[#fe753c]">music_note</span>
              <span className="truncate">{reel.audioTrack}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onBookLook(reel);
              }}
              className="w-full py-3 rounded-full bg-[#fe753c] hover:bg-[#e0622a] text-white font-semibold text-[13px] shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <span>Book This Transformation</span>
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
