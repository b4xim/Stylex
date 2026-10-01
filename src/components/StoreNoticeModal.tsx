import React, { useEffect } from 'react';
import { StoreNotice } from '../types.ts';

interface StoreNoticeModalProps {
  notice: StoreNotice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StoreNoticeModal: React.FC<StoreNoticeModalProps> = ({
  notice,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !notice || !notice.isActive || !notice.message?.trim()) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#122019] rounded-3xl border border-[#c2c8c2]/50 dark:border-white/10 shadow-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col gap-4 transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#112e20] via-[#fe753c] to-[#112e20]" />

        {/* Top Header: Badge & Close Button */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fe753c]/10 text-[#fe753c] border border-[#fe753c]/20 text-[11px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">campaign</span>
            <span>{notice.badge || 'Special Notice'}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Notice"
            className="w-8 h-8 rounded-full bg-[#f0f5f1] dark:bg-white/10 hover:bg-[#eaefeb] dark:hover:bg-white/20 text-[#424844] dark:text-neutral-300 hover:text-[#112e20] dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Headline */}
        {notice.title && (
          <h2 className="font-serif text-2xl sm:text-3xl text-[#112e20] dark:text-white font-bold tracking-tight leading-snug">
            {notice.title}
          </h2>
        )}

        {/* Message Body */}
        <div className="text-sm sm:text-[15px] text-[#424844] dark:text-neutral-300 leading-relaxed whitespace-pre-line py-1">
          {notice.message}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#112e20] hover:bg-[#185341] dark:bg-[#1f3b2d] dark:hover:bg-[#284a39] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <span>{notice.buttonText || 'Got It'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
