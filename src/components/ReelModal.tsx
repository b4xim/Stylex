import React, { useState, useRef, useEffect } from 'react';
import { ReelItem } from '../types.ts';

interface ReelModalProps {
  reel: ReelItem | null;
  onClose: () => void;
  onBookLook: (reel: ReelItem) => void;
}

export const ReelModal: React.FC<ReelModalProps> = ({ reel, onClose, onBookLook }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setVideoError(false);
    setIsPlaying(true);
  }, [reel]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  if (!reel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] max-h-[90vh] rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/20 flex flex-col justify-between">
        {/* Background Visual Asset (HTML5 Video with Poster Fallback) */}
        {reel.videoUrl && !videoError ? (
          <video
            ref={videoRef}
            src={reel.videoUrl}
            poster={reel.imageUrl}
            autoPlay
            loop
            playsInline
            muted={isMuted}
            onError={() => setVideoError(true)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={reel.imageUrl}
            alt={reel.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

        {/* Top Control Bar */}
        <div className="relative z-10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[12px] font-semibold tracking-wide shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fe753c] animate-pulse" />
              <span>StyleX Reel</span>
            </span>
            {reel.instagramUrl && (
              <a
                href={reel.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open on Instagram"
                className="px-3 py-1.5 rounded-full bg-black/50 hover:bg-[#fe753c]/30 backdrop-blur-md text-white hover:text-[#ffdbcf] text-[12px] font-semibold flex items-center gap-1.5 border border-white/20 hover:border-[#fe753c]/50 transition-colors"
                title="View original reel on Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Watch on Instagram</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
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
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
        >
          {!isPlaying && (
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/30 animate-scale-up">
              <span className="material-symbols-outlined text-[36px] ml-1">play_arrow</span>
            </div>
          )}
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
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onBookLook(reel);
              }}
              className="flex-1 py-3 rounded-full bg-[#fe753c] hover:bg-[#e0622a] text-white font-semibold text-[13px] shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <span>Book Appointment</span>
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            </button>
            {reel.instagramUrl && (
              <a
                href={reel.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch on Instagram"
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-105"
                title="Watch on Instagram"
              >
                <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
