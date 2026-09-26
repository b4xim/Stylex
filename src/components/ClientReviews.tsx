import React, { useState } from 'react';
import { REVIEWS } from '../data/salonData.ts';

export const ClientReviews: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'color' | 'spa' | 'cut'>('all');

  const filteredReviews = REVIEWS.filter((rev) => {
    if (activeCategory === 'all') return true;
    return rev.category === activeCategory;
  });

  return (
    <section className="w-full bg-[#f6faf7] px-4 sm:px-6 lg:px-12 border-t border-[#c2c8c2]/40 relative overflow-hidden py-16" id="client-reviews">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-8">
          {/* Header & Overall Rating Card */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
            <div className="space-y-2.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#112e20]/10 text-[#112e20] font-label-caps text-[11px] uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-[14px] text-[#9b4521]">verified</span>
                <span>Client Experiences & Stories</span>
              </div>

              <h2 className="font-display-hero text-[30px] sm:text-[36px] text-[#112e20] tracking-tight leading-tight">
                Voices of the Sanctuary
              </h2>

              <p className="font-body-md text-[14px] sm:text-[15px] text-[#424844]">
                Unfiltered impressions on our tailored scalp rituals and bespoke architectural transformations.
              </p>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    activeCategory === 'all'
                      ? 'bg-[#112e20] text-white shadow-sm'
                      : 'bg-[#f0f5f1] text-[#181d1b] border border-[#c2c8c2]/50 hover:border-[#112e20]/40'
                  }`}
                  type="button"
                >
                  All (850+)
                </button>
                <button
                  onClick={() => setActiveCategory('color')}
                  className={`px-3.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                    activeCategory === 'color'
                      ? 'bg-[#112e20] text-white shadow-sm'
                      : 'bg-[#f0f5f1] text-[#181d1b] border border-[#c2c8c2]/50 hover:border-[#112e20]/40'
                  }`}
                  type="button"
                >
                  Balayage & Color
                </button>
                <button
                  onClick={() => setActiveCategory('spa')}
                  className={`px-3.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                    activeCategory === 'spa'
                      ? 'bg-[#112e20] text-white shadow-sm'
                      : 'bg-[#f0f5f1] text-[#181d1b] border border-[#c2c8c2]/50 hover:border-[#112e20]/40'
                  }`}
                  type="button"
                >
                  Scalp Spa
                </button>
                <button
                  onClick={() => setActiveCategory('cut')}
                  className={`px-3.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                    activeCategory === 'cut'
                      ? 'bg-[#112e20] text-white shadow-sm'
                      : 'bg-[#f0f5f1] text-[#181d1b] border border-[#c2c8c2]/50 hover:border-[#112e20]/40'
                  }`}
                  type="button"
                >
                  Couture Cut
                </button>
              </div>
            </div>

            {/* Scorecard Box */}
            <div className="bg-white border border-[#c2c8c2]/50 rounded-2xl p-4 shadow-md flex items-center gap-4 lg:self-end">
              <div className="flex items-center gap-3">
                <span className="font-display-hero text-[32px] font-bold text-[#112e20] leading-none">
                  4.98
                </span>
                <div>
                  <div className="flex text-[#fe753c] text-[14px] leading-none gap-0.5">★★★★★</div>
                  <p className="text-[11px] font-medium text-[#424844] pt-1">850+ Verified Reviews</p>
                </div>
              </div>

              <div className="h-8 w-px bg-[#c2c8c2]/40" />

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9b4521]/10 text-[#9b4521] text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                <span>Vogue Beauty Finalist</span>
              </div>
            </div>
          </div>

          {/* Review Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredReviews.map((rev) => {
              const isDark = rev.id === 'rev-2';

              if (isDark) {
                return (
                  <div
                    key={rev.id}
                    className="bg-gradient-to-b from-[#0e372b] to-[#08241b] text-white rounded-2xl p-5 border border-[#9b4521]/50 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-3 relative"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[#fe753c] text-[13px]">
                          <span>★★★★★</span>
                          <span className="text-white text-[11px] font-bold ml-1 font-title-md">5.0</span>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[#caead5] text-[10px] font-bold uppercase tracking-wider font-label-caps">
                          <span className="material-symbols-outlined text-[11px]">verified</span> {rev.tag}
                        </span>
                      </div>

                      <p className="text-[13px] text-[#d4ebe1] leading-snug">
                        “{rev.quote}”
                      </p>

                      <div className="inline-flex items-center gap-1 text-[11px] text-[#ffdbcf] font-medium">
                        <span className="material-symbols-outlined text-[13px]">spa</span>
                        <span>{rev.highlightText}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#9b4521] text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                          {rev.initials}
                        </div>
                        <span className="font-semibold text-white truncate max-w-[110px]">{rev.author}</span>
                      </div>
                      <span className="text-[#9eb6aa]">Artisan: {rev.artisan}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl p-5 border border-[#c2c8c2]/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[#fe753c] text-[13px]">
                        <span>★★★★★</span>
                        <span className="text-[#181d1b] text-[11px] font-bold ml-1 font-title-md">5.0</span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#9b4521]/10 text-[#9b4521] text-[10px] font-bold uppercase tracking-wider font-label-caps">
                        <span className="material-symbols-outlined text-[11px]">check_circle</span> {rev.tag}
                      </span>
                    </div>

                    <p className="text-[13px] text-[#181d1b] leading-snug">
                      “{rev.quote}”
                    </p>

                    <div className="inline-flex items-center gap-1 text-[11px] text-[#9b4521] font-medium">
                      <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                      <span>{rev.highlightText}</span>
                    </div>
                  </div>

                    <div className="pt-3 border-t border-[#c2c8c2]/30 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#112e20] text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                        {rev.initials}
                      </div>
                      <span className="font-semibold text-[#112e20] truncate max-w-[110px]">{rev.author}</span>
                    </div>
                    <span className="text-[#424844]/70">Artisan: {rev.artisan}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
