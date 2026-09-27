import React, { useState } from 'react';
import { CarouselBanner, ReelItem, PortfolioWork, UserAccount } from '../types';

export type PromotionsTab = 'banners' | 'reels' | 'photos';

interface PromotionsViewProps {
  banners: CarouselBanner[];
  onToggleBanner: (id: string) => void;
  onEditBanner: (banner: CarouselBanner) => void;
  onDeleteBanner: (id: string) => void;
  onOpenAddPromotion: () => void;

  reels: ReelItem[];
  onToggleReel: (id: string) => void;
  onEditReel: (reel: ReelItem) => void;
  onDeleteReel: (id: string) => void;
  onOpenAddReel: () => void;

  portfolioWorks: PortfolioWork[];
  onTogglePortfolioWork: (id: string) => void;
  onEditPortfolioWork: (photo: PortfolioWork) => void;
  onDeletePortfolioWork: (id: string) => void;
  onOpenAddPortfolioPhoto: () => void;

  currentUser?: UserAccount;
}

export const PromotionsView: React.FC<PromotionsViewProps> = ({
  banners,
  onToggleBanner,
  onEditBanner,
  onDeleteBanner,
  onOpenAddPromotion,

  reels,
  onToggleReel,
  onEditReel,
  onDeleteReel,
  onOpenAddReel,

  portfolioWorks,
  onTogglePortfolioWork,
  onEditPortfolioWork,
  onDeletePortfolioWork,
  onOpenAddPortfolioPhoto,

  currentUser,
}) => {
  const isViewOnly = currentUser?.role === 'Staff' || currentUser?.role === 'Normal User';
  const [activeTab, setActiveTab] = useState<PromotionsTab>('banners');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Stats
  const activeBannersCount = banners.filter((b) => b.isActive).length;
  const activeReelsCount = reels.filter((r) => r.isActive !== false).length;
  const activePhotosCount = portfolioWorks.filter((p) => p.isActive !== false).length;

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Top Editorial Header & Command Zone */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c2c8c2]/30 dark:border-white/10 pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#112e20] dark:text-white tracking-tight">
            Promotions &amp; Media Studio
          </h1>
          <p className="text-sm text-[#424844] dark:text-neutral-300">
            Upload and curate carousel slides, vertical video reels, and client transformation photographs shown on the client-facing website.
          </p>
        </div>

        {/* Dynamic Action Button according to active tab */}
        {isViewOnly ? (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-500 text-xs font-medium shrink-0">
            <span className="material-symbols-outlined text-[15px]">visibility</span>
            <span>View-Only Mode</span>
          </div>
        ) : (
          <>
            {activeTab === 'banners' && (
              <button
                onClick={onOpenAddPromotion}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#112e20] dark:bg-[#284435] text-white hover:bg-[#284435] dark:hover:bg-[#345845] transition-colors text-[13px] font-semibold shadow-sm cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                <span>+ Add Carousel Slide</span>
              </button>
            )}

            {activeTab === 'reels' && (
              <button
                onClick={onOpenAddReel}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#112e20] dark:bg-[#284435] text-white hover:bg-[#284435] dark:hover:bg-[#345845] transition-colors text-[13px] font-semibold shadow-sm cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">smart_display</span>
                <span>+ Upload Reel</span>
              </button>
            )}

            {activeTab === 'photos' && (
              <button
                onClick={onOpenAddPortfolioPhoto}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#112e20] dark:bg-[#284435] text-white hover:bg-[#284435] dark:hover:bg-[#345845] transition-colors text-[13px] font-semibold shadow-sm cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                <span>+ Upload Photo</span>
              </button>
            )}
          </>
        )}
      </section>

      {/* Segmented Media Section Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-[#eaefeb] dark:bg-black/30 rounded-2xl w-fit max-w-full overflow-x-auto border border-[#c2c8c2]/40 dark:border-white/10">
        <button
          type="button"
          onClick={() => {
            setActiveTab('banners');
            setDeleteConfirmId(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'banners'
              ? 'bg-white dark:bg-[#1f372c] text-[#112e20] dark:text-white shadow-sm'
              : 'text-[#424844] dark:text-neutral-400 hover:text-[#112e20] dark:hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">view_carousel</span>
          <span>Carousel Banners</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'banners'
                ? 'bg-[#112e20] text-white dark:bg-white dark:text-[#112e20]'
                : 'bg-[#c2c8c2]/40 dark:bg-white/10 text-[#424844] dark:text-neutral-300'
            }`}
          >
            {banners.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('reels');
            setDeleteConfirmId(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'reels'
              ? 'bg-white dark:bg-[#1f372c] text-[#112e20] dark:text-white shadow-sm'
              : 'text-[#424844] dark:text-neutral-400 hover:text-[#112e20] dark:hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">smart_display</span>
          <span>Reels</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'reels'
                ? 'bg-[#112e20] text-white dark:bg-white dark:text-[#112e20]'
                : 'bg-[#c2c8c2]/40 dark:bg-white/10 text-[#424844] dark:text-neutral-300'
            }`}
          >
            {reels.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('photos');
            setDeleteConfirmId(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'photos'
              ? 'bg-white dark:bg-[#1f372c] text-[#112e20] dark:text-white shadow-sm'
              : 'text-[#424844] dark:text-neutral-400 hover:text-[#112e20] dark:hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">photo_library</span>
          <span>Photos</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'photos'
                ? 'bg-[#112e20] text-white dark:bg-white dark:text-[#112e20]'
                : 'bg-[#c2c8c2]/40 dark:bg-white/10 text-[#424844] dark:text-neutral-300'
            }`}
          >
            {portfolioWorks.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CAROUSEL BANNERS                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'banners' && (
        <div className="flex flex-col gap-6">
          {/* Overview Stat Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#1a2e26] rounded-xl p-4 border border-[#c2c8c2]/30 dark:border-white/10 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#e6ede7] dark:bg-white/10 text-[#112e20] dark:text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">view_carousel</span>
              </div>
              <div>
                <div className="text-xs text-[#727973] dark:text-neutral-400 uppercase tracking-wider font-semibold">Total Slides</div>
                <div className="text-xl font-bold text-[#112e20] dark:text-white">{banners.length} Slides</div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a2e26] rounded-xl p-4 border border-[#c2c8c2]/30 dark:border-white/10 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#caead5] dark:bg-emerald-950/50 text-[#042014] dark:text-emerald-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">visibility</span>
              </div>
              <div>
                <div className="text-xs text-[#727973] dark:text-neutral-400 uppercase tracking-wider font-semibold">Live on Portal</div>
                <div className="text-xl font-bold text-[#112e20] dark:text-white">{activeBannersCount} Active</div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a2e26] rounded-xl p-4 border border-[#c2c8c2]/30 dark:border-white/10 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#f0f5f1] dark:bg-white/5 text-[#727973] dark:text-neutral-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">visibility_off</span>
              </div>
              <div>
                <div className="text-xs text-[#727973] dark:text-neutral-400 uppercase tracking-wider font-semibold">Draft / Hidden</div>
                <div className="text-xl font-bold text-[#424844] dark:text-neutral-300">{banners.length - activeBannersCount} Hidden</div>
              </div>
            </div>
          </div>

          {/* Carousel Banners List */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#112e20] dark:text-white">
                  Homepage Carousel Slides
                </h2>
                <p className="text-xs text-[#727973] dark:text-neutral-400 mt-0.5">
                  Top hero banner slides with interactive booking privileges and validity timelines.
                </p>
              </div>
              <span className="text-xs text-[#424844] dark:text-neutral-300 font-medium bg-[#f0f5f1] dark:bg-white/10 px-3 py-1 rounded-full border border-[#c2c8c2]/30 dark:border-white/10">
                {banners.length} Curation Slides
              </span>
            </div>

            {banners.length === 0 ? (
              <div className="bg-white dark:bg-[#1a2e26] rounded-2xl p-12 border border-dashed border-[#c2c8c2] dark:border-white/20 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#f0f5f1] dark:bg-white/10 text-[#112e20] dark:text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">photo_library</span>
                </div>
                <h3 className="font-serif text-lg text-[#112e20] dark:text-white">No Carousel Slides Found</h3>
                <p className="text-xs text-[#727973] dark:text-neutral-400 max-w-sm">
                  Add your first carousel promotion banner with uploaded artwork to showcase seasonal rituals on the homepage.
                </p>
                <button
                  onClick={onOpenAddPromotion}
                  className="mt-2 px-5 py-2 rounded-full bg-[#112e20] dark:bg-[#284435] text-white text-xs font-semibold hover:bg-[#284435] transition-colors cursor-pointer"
                >
                  + Add Promotion Slide
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {banners.map((banner, index) => (
                  <div
                    key={banner.id}
                    className="bg-white dark:bg-[#1a2e26] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 border border-[#c2c8c2]/40 dark:border-white/10 hover:border-[#112e20]/30 dark:hover:border-white/30 transition-all hover:shadow-md"
                  >
                    {/* Left: Thumbnail & Content */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto flex-1">
                      <div className="relative w-full sm:w-48 sm:h-28 aspect-[16/9] sm:aspect-auto rounded-xl overflow-hidden shrink-0 border border-[#c2c8c2]/40 dark:border-white/10 bg-[#08241b] group shadow-inner">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono">
                          Slide #{index + 1}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base text-[#112e20] dark:text-white font-semibold tracking-tight truncate">
                            {banner.title}
                          </h3>
                          {banner.tag && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f0f5f1] dark:bg-white/10 text-[#9b4521] dark:text-[#ff9d79] border border-[#9b4521]/20">
                              {banner.tag}
                            </span>
                          )}
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              banner.isActive
                                ? 'bg-[#caead5] dark:bg-emerald-950/60 text-[#042014] dark:text-emerald-300'
                                : 'bg-[#eaefeb] dark:bg-white/10 text-[#727973] dark:text-neutral-400'
                            }`}
                          >
                            {banner.isActive ? 'Active on Portal' : 'Hidden'}
                          </span>
                        </div>

                        <p className="text-xs text-[#424844] dark:text-neutral-300 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-[#9b4521] dark:text-[#ff9d79]">
                            schedule
                          </span>
                          <span>{banner.validity}</span>
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-[11px] text-[#727973] dark:text-neutral-400">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">aspect_ratio</span>
                            <span>Full-width Hero</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">touch_app</span>
                            <span>Interactive Reservation</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-between sm:justify-end w-full lg:w-auto gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#eaefeb] dark:border-white/10 shrink-0">
                      {/* Toggle Active Switch */}
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <button
                          type="button"
                          disabled={isViewOnly}
                          onClick={() => onToggleBanner(banner.id)}
                          aria-label={`Toggle banner ${banner.title}`}
                          className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors ${
                            isViewOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          } ${
                            banner.isActive ? 'bg-[#112e20] dark:bg-emerald-600 justify-end' : 'bg-[#c2c8c2] dark:bg-neutral-600 justify-start'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-white shadow-xs"></span>
                        </button>
                        <span className="ml-2.5 text-xs text-[#112e20] dark:text-neutral-200 font-medium min-w-[50px]">
                          {banner.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </label>

                      <div className="h-6 w-px bg-[#c2c8c2]/40 dark:bg-white/10 hidden sm:block" />

                      {!isViewOnly ? (
                        <>
                          {/* Edit Banner Button */}
                          <button
                            onClick={() => onEditBanner(banner)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f0f5f1] dark:bg-white/10 hover:bg-[#112e20] dark:hover:bg-white text-[#112e20] dark:text-white hover:text-white dark:hover:text-[#112e20] transition-all text-xs font-semibold cursor-pointer border border-[#c2c8c2]/30 dark:border-white/10 shadow-2xs"
                            title="Edit Carousel Slide"
                          >
                            <span className="material-symbols-outlined text-[15px]">edit</span>
                            <span>Edit Slide</span>
                          </button>

                          {/* Delete Button / Confirmation */}
                          {deleteConfirmId === banner.id ? (
                            <div className="inline-flex items-center gap-1.5 bg-[#ffdad6] dark:bg-red-950/80 p-1 rounded-lg">
                              <span className="text-[11px] font-semibold text-[#410002] dark:text-red-200 px-1">Delete?</span>
                              <button
                                onClick={() => {
                                  onDeleteBanner(banner.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2 py-0.5 rounded bg-[#ba1a1a] text-white text-[11px] font-bold hover:bg-[#93000a] cursor-pointer"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-0.5 rounded bg-white dark:bg-white/20 text-[#410002] dark:text-white text-[11px] font-semibold hover:bg-[#f0f5f1] cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(banner.id)}
                              className="w-8 h-8 rounded-xl border border-[#c2c8c2]/50 dark:border-white/10 bg-white dark:bg-white/5 text-[#424844] dark:text-neutral-300 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer btn-delete-action shrink-0"
                              title="Delete Slide"
                            >
                              <span className="material-symbols-outlined text-[17px] text-current">delete</span>
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-neutral-400 dark:text-neutral-500 italic pr-2">
                          Read-only
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: REELS SECTION (ATELIER IN MOTION)                                  */}
      {/* ========================================================================= */}
      {activeTab === 'reels' && (
        <div className="flex flex-col gap-6">
          {/* Overview Stat Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#1a2e26] rounded-xl p-4 border border-[#c2c8c2]/30 dark:border-white/10 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#e6ede7] dark:bg-white/10 text-[#112e20] dark:text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">smart_display</span>
              </div>
              <div>
                <div className="text-xs text-[#727973] dark:text-neutral-400 uppercase tracking-wider font-semibold">Total Reels</div>
                <div className="text-xl font-bold text-[#112e20] dark:text-white">{reels.length} Reels</div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a2e26] rounded-xl p-4 border border-[#c2c8c2]/30 dark:border-white/10 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#caead5] dark:bg-emerald-950/50 text-[#042014] dark:text-emerald-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">play_circle</span>
              </div>
              <div>
                <div className="text-xs text-[#727973] dark:text-neutral-400 uppercase tracking-wider font-semibold">Live in Reels Track</div>
                <div className="text-xl font-bold text-[#112e20] dark:text-white">{activeReelsCount} Active</div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a2e26] rounded-xl p-4 border border-[#c2c8c2]/30 dark:border-white/10 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#fde8e4] dark:bg-[#fe753c]/20 text-[#9b4521] dark:text-[#ff9d79] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">videocam</span>
              </div>
              <div>
                <div className="text-xs text-[#727973] dark:text-neutral-400 uppercase tracking-wider font-semibold">With Attached Video</div>
                <div className="text-xl font-bold text-[#112e20] dark:text-white">
                  {reels.filter((r) => r.videoUrl).length} Videos
                </div>
              </div>
            </div>
          </div>

          {/* Reels Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#112e20] dark:text-white">
                Featured Reels
              </h2>
              <p className="text-xs text-[#727973] dark:text-neutral-400 mt-0.5">
                Vertical 9:16 reels displayed in the homepage Reels carousel with interactive lightbox playback.
              </p>
            </div>
            <button
              onClick={onOpenAddReel}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#112e20] dark:bg-[#284435] text-white hover:bg-[#284435] text-xs font-semibold cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Upload Reel</span>
            </button>
          </div>

          {/* Reels Grid */}
          {reels.length === 0 ? (
            <div className="bg-white dark:bg-[#1a2e26] rounded-2xl p-12 border border-dashed border-[#c2c8c2] dark:border-white/20 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#f0f5f1] dark:bg-white/10 text-[#112e20] dark:text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">movie</span>
              </div>
              <h3 className="font-serif text-lg text-[#112e20] dark:text-white">No Reels Uploaded Yet</h3>
              <p className="text-xs text-[#727973] dark:text-neutral-400 max-w-sm">
                Upload your salon&apos;s vertical reels, transformation highlights, and client stories to display them on the website.
              </p>
              <button
                onClick={onOpenAddReel}
                className="mt-2 px-5 py-2 rounded-full bg-[#112e20] dark:bg-[#284435] text-white text-xs font-semibold hover:bg-[#284435] cursor-pointer"
              >
                + Upload First Reel
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {reels.map((reel) => (
                <div
                  key={reel.id}
                  className="bg-white dark:bg-[#1a2e26] rounded-xl border border-[#c2c8c2]/40 dark:border-white/10 hover:border-[#112e20]/30 dark:hover:border-white/25 transition-all shadow-xs hover:shadow-md flex items-center gap-4 p-3 group"
                >
                  {/* Compact 9:16 thumbnail */}
                  <div className="relative w-10 h-16 rounded-lg overflow-hidden shrink-0 bg-[#071a14] border border-[#c2c8c2]/30 dark:border-white/10">
                    <img
                      src={reel.imageUrl}
                      alt={reel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px] text-white">play_arrow</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#fe753c]">{reel.tag}</span>
                      {reel.videoUrl && (
                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          <span className="material-symbols-outlined text-[12px]">videocam</span>
                          <span>MP4</span>
                        </span>
                      )}
                      {reel.instagramUrl && (
                        <a
                          href={reel.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-0.5 text-[10px] text-[#e1306c] font-medium hover:underline"
                        >
                          <svg className="w-2.5 h-2.5 fill-[#e1306c]" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                          <span>Instagram</span>
                        </a>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-[#112e20] dark:text-white truncate mt-0.5">{reel.title}</p>
                    <p className="text-[11px] text-[#727973] dark:text-neutral-400 truncate">{reel.category}{reel.stylistHandle ? ` • ${reel.stylistHandle}` : ''}</p>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={isViewOnly}
                      onClick={() => onToggleReel(reel.id)}
                      className={`flex items-center gap-1 ${isViewOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      title={reel.isActive !== false ? 'Visible on Client Site' : 'Hidden'}
                    >
                      <span className={`w-2 h-2 rounded-full ${reel.isActive !== false ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                      <span className="text-[11px] font-semibold text-[#112e20] dark:text-neutral-200 min-w-[36px]">
                        {reel.isActive !== false ? 'Live' : 'Hidden'}
                      </span>
                    </button>

                    <div className="h-4 w-px bg-[#c2c8c2]/40 dark:bg-white/10" />

                    {!isViewOnly ? (
                      <>
                        <button
                          onClick={() => onEditReel(reel)}
                          className="p-1.5 rounded-lg bg-[#f0f5f1] dark:bg-white/10 hover:bg-[#112e20] dark:hover:bg-white text-[#112e20] dark:text-white hover:text-white dark:hover:text-[#112e20] transition-colors cursor-pointer"
                          title="Edit Reel"
                        >
                          <span className="material-symbols-outlined text-[15px]">edit</span>
                        </button>

                        {deleteConfirmId === reel.id ? (
                          <div className="inline-flex items-center gap-1 bg-[#ffdad6] dark:bg-red-950/80 p-0.5 rounded-lg">
                            <button
                              onClick={() => { onDeleteReel(reel.id); setDeleteConfirmId(null); }}
                              className="px-2 py-0.5 rounded bg-[#ba1a1a] text-white text-[10px] font-bold hover:bg-[#93000a] cursor-pointer"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-0.5 rounded bg-white dark:bg-white/20 text-[#410002] dark:text-white text-[10px] font-semibold cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(reel.id)}
                            className="w-7 h-7 rounded-lg border border-[#c2c8c2]/50 dark:border-white/10 bg-white dark:bg-white/5 text-[#424844] dark:text-neutral-300 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 flex items-center justify-center transition-all cursor-pointer btn-delete-action shrink-0"
                            title="Delete Reel"
                          >
                            <span className="material-symbols-outlined text-[15px] text-current">delete</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 italic pr-1">
                        Read-only
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}



      {/* ========================================================================= */}
      {/* TAB 3: PHOTOS SECTION (CLIENT TRANSFORMATIONS & ARTISTRY)                 */}
      {/* ========================================================================= */}
      {activeTab === 'photos' && (
        <div className="flex flex-col gap-6">
          {/* Overview Stat Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#1a2e26] rounded-xl p-4 border border-[#c2c8c2]/30 dark:border-white/10 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#e6ede7] dark:bg-white/10 text-[#112e20] dark:text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">photo_library</span>
              </div>
              <div>
                <div className="text-xs text-[#727973] dark:text-neutral-400 uppercase tracking-wider font-semibold">Total Photos</div>
                <div className="text-xl font-bold text-[#112e20] dark:text-white">{portfolioWorks.length} Photos</div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a2e26] rounded-xl p-4 border border-[#c2c8c2]/30 dark:border-white/10 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#caead5] dark:bg-emerald-950/50 text-[#042014] dark:text-emerald-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">visibility</span>
              </div>
              <div>
                <div className="text-xs text-[#727973] dark:text-neutral-400 uppercase tracking-wider font-semibold">Live in Gallery</div>
                <div className="text-xl font-bold text-[#112e20] dark:text-white">{activePhotosCount} Active</div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a2e26] rounded-xl p-4 border border-[#c2c8c2]/30 dark:border-white/10 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#f0f5f1] dark:bg-white/5 text-[#727973] dark:text-neutral-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">brush</span>
              </div>
              <div>
                <div className="text-xs text-[#727973] dark:text-neutral-400 uppercase tracking-wider font-semibold">Featured Categories</div>
                <div className="text-xl font-bold text-[#112e20] dark:text-white">
                  {new Set(portfolioWorks.map((p) => p.category)).size} Categories
                </div>
              </div>
            </div>
          </div>

          {/* Photos Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#112e20] dark:text-white">
                Client Transformations &amp; Artistry
              </h2>
              <p className="text-xs text-[#727973] dark:text-neutral-400 mt-0.5">
                Curated high-resolution client makeovers and finished styling photographs displayed in the client photo gallery.
              </p>
            </div>
            <button
              onClick={onOpenAddPortfolioPhoto}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#112e20] dark:bg-[#284435] text-white hover:bg-[#284435] text-xs font-semibold cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
              <span>Upload Photo</span>
            </button>
          </div>

          {/* Photos Grid */}
          {portfolioWorks.length === 0 ? (
            <div className="bg-white dark:bg-[#1a2e26] rounded-2xl p-12 border border-dashed border-[#c2c8c2] dark:border-white/20 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#f0f5f1] dark:bg-white/10 text-[#112e20] dark:text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">photo_camera</span>
              </div>
              <h3 className="font-serif text-lg text-[#112e20] dark:text-white">No Transformation Photos Found</h3>
              <p className="text-xs text-[#727973] dark:text-neutral-400 max-w-sm">
                Upload your client hair styling, smoothening, and bridal transformation photos to show real results on your website.
              </p>
              <button
                onClick={onOpenAddPortfolioPhoto}
                className="mt-2 px-5 py-2 rounded-full bg-[#112e20] dark:bg-[#284435] text-white text-xs font-semibold hover:bg-[#284435] cursor-pointer"
              >
                + Upload First Photo
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {portfolioWorks.map((work) => (
                <div
                  key={work.id}
                  className="bg-white dark:bg-[#1a2e26] rounded-xl border border-[#c2c8c2]/40 dark:border-white/10 hover:border-[#112e20]/30 dark:hover:border-white/25 transition-all shadow-xs hover:shadow-md flex items-center gap-4 p-3 group"
                >
                  {/* Compact 4:5 thumbnail */}
                  <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-black border border-[#c2c8c2]/30 dark:border-white/10">
                    <img
                      src={work.imageUrl}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Metadata */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#fe753c]">{work.category}</span>
                    <p className="text-sm font-semibold text-[#112e20] dark:text-white truncate mt-0.5">{work.title}</p>
                    <p className="text-[11px] text-[#727973] dark:text-neutral-400 truncate">{work.artisan}</p>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={isViewOnly}
                      onClick={() => onTogglePortfolioWork(work.id)}
                      className={`flex items-center gap-1 ${isViewOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      title={work.isActive !== false ? 'Live on Site' : 'Hidden'}
                    >
                      <span className={`w-2 h-2 rounded-full ${work.isActive !== false ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                      <span className="text-[11px] font-semibold text-[#112e20] dark:text-neutral-200 min-w-[36px]">
                        {work.isActive !== false ? 'Live' : 'Hidden'}
                      </span>
                    </button>

                    <div className="h-4 w-px bg-[#c2c8c2]/40 dark:bg-white/10" />

                    {!isViewOnly ? (
                      <>
                        <button
                          onClick={() => onEditPortfolioWork(work)}
                          className="p-1.5 rounded-lg bg-[#f0f5f1] dark:bg-white/10 hover:bg-[#112e20] dark:hover:bg-white text-[#112e20] dark:text-white hover:text-white dark:hover:text-[#112e20] transition-colors cursor-pointer"
                          title="Edit Photo"
                        >
                          <span className="material-symbols-outlined text-[15px]">edit</span>
                        </button>

                        {deleteConfirmId === work.id ? (
                          <div className="inline-flex items-center gap-1 bg-[#ffdad6] dark:bg-red-950/80 p-0.5 rounded-lg">
                            <button
                              onClick={() => { onDeletePortfolioWork(work.id); setDeleteConfirmId(null); }}
                              className="px-2 py-0.5 rounded bg-[#ba1a1a] text-white text-[10px] font-bold hover:bg-[#93000a] cursor-pointer"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-0.5 rounded bg-white dark:bg-white/20 text-[#410002] dark:text-white text-[10px] font-semibold cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(work.id)}
                            className="w-7 h-7 rounded-lg border border-[#c2c8c2]/50 dark:border-white/10 bg-white dark:bg-white/5 text-[#424844] dark:text-neutral-300 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 flex items-center justify-center transition-all cursor-pointer btn-delete-action shrink-0"
                            title="Delete Photo"
                          >
                            <span className="material-symbols-outlined text-[15px] text-current">delete</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 italic pr-1">
                        Read-only
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
