import React, { useState } from 'react';
import { SERVICES } from '../data/salonData.ts';
import { ServiceItem } from '../types.ts';

interface ServicesMenuProps {
  onSelectServiceToBook: (service: ServiceItem) => void;
}

export const ServicesMenu: React.FC<ServicesMenuProps> = ({ onSelectServiceToBook }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'color' | 'spa' | 'cut' | 'smoothing' | 'styling'>('all');

  const filteredServices = SERVICES.filter((srv) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'color') return srv.category === 'color';
    if (selectedFilter === 'spa') return srv.category === 'spa';
    if (selectedFilter === 'cut') return srv.category === 'cut';
    if (selectedFilter === 'smoothing') return srv.category === 'smoothing';
    if (selectedFilter === 'styling') return srv.category === 'styling';
    return true;
  });

  return (
    <section className="w-full bg-[#f0f5f1] py-20 px-4 sm:px-6 lg:px-12 border-t border-[#c2c8c2]/40" id="services-curation">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#112e20]/10 text-[#112e20] font-label-caps text-[11px] uppercase tracking-wider font-bold mb-3">
              <span>High-Fashion Editorial Craft</span>
            </div>
            <h2 className="font-headline-lg text-[32px] sm:text-[40px] text-[#112e20] leading-tight">
              Curated Signature Menu
            </h2>
            <p className="font-body-lg text-[15px] sm:text-[16px] text-[#424844] max-w-xl">
              Every service begins with a microscopic scalp assessment and personalized consultation to elevate
              your personal style.
            </p>
          </div>

          {/* Service Filter Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-full font-label-md text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-[#112e20] text-white shadow-sm font-semibold'
                  : 'bg-white text-[#181d1b] hover:bg-[#eaefeb] border border-[#c2c8c2]/40'
              }`}
              type="button"
            >
              All Rituals
            </button>
            <button
              onClick={() => setSelectedFilter('color')}
              className={`px-4 py-2 rounded-full font-label-md text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'color'
                  ? 'bg-[#112e20] text-white shadow-sm font-semibold'
                  : 'bg-white text-[#181d1b] hover:bg-[#eaefeb] border border-[#c2c8c2]/40'
              }`}
              type="button"
            >
              Color & Light
            </button>
            <button
              onClick={() => setSelectedFilter('spa')}
              className={`px-4 py-2 rounded-full font-label-md text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'spa'
                  ? 'bg-[#112e20] text-white shadow-sm font-semibold'
                  : 'bg-white text-[#181d1b] hover:bg-[#eaefeb] border border-[#c2c8c2]/40'
              }`}
              type="button"
            >
              Botanical Spa
            </button>
            <button
              onClick={() => setSelectedFilter('cut')}
              className={`px-4 py-2 rounded-full font-label-md text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'cut'
                  ? 'bg-[#112e20] text-white shadow-sm font-semibold'
                  : 'bg-white text-[#181d1b] hover:bg-[#eaefeb] border border-[#c2c8c2]/40'
              }`}
              type="button"
            >
              Architectural Cut
            </button>
            <button
              onClick={() => setSelectedFilter('smoothing')}
              className={`px-4 py-2 rounded-full font-label-md text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'smoothing'
                  ? 'bg-[#112e20] text-white shadow-sm font-semibold'
                  : 'bg-white text-[#181d1b] hover:bg-[#eaefeb] border border-[#c2c8c2]/40'
              }`}
              type="button"
            >
              Botanical Smoothing
            </button>
          </div>
        </div>

        {/* Service Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isFeatured = service.isFeatured;

            if (isFeatured) {
              return (
                <div
                  key={service.id}
                  className="bg-[#112e20] text-white rounded-3xl p-6 shadow-xl border-2 border-[#9b4521] flex flex-col justify-between relative transform lg:-translate-y-1 group transition-all"
                >
                  <div className="absolute -top-3.5 right-6 bg-[#9b4521] text-white font-label-caps text-[10px] uppercase tracking-wider py-1 px-3.5 rounded-full font-bold shadow-md">
                    Signature Specialty
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-[11px] uppercase tracking-widest text-[#ffdbcf] font-bold">
                        {service.categoryLabel}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#284435] text-[#caead5] font-label-md text-[11px] font-semibold">
                        {service.durationLabel}
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-[20px] text-white leading-snug font-display-hero">
                      {service.name}
                    </h3>

                    <p className="font-body-md text-[13px] leading-relaxed text-[#aeceba]">
                      {service.description}
                    </p>

                    <ul className="space-y-2 pt-1 text-[12px] text-[#caead5]">
                      {service.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#ffdbcf] text-[16px]">spa</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 flex items-baseline gap-2">
                      <span className="text-[24px] font-bold text-white font-display-hero">
                        ${service.price}
                      </span>
                      <span className="text-[12px] text-[#aeceba]">including consultation</span>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-[#284435]">
                    <button
                      onClick={() => onSelectServiceToBook(service)}
                      className="w-full py-2.5 px-4 rounded-full bg-[#9b4521] text-white hover:bg-[#fe9167] hover:text-[#752906] transition-colors font-label-md text-[13px] font-bold text-center flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
                      type="button"
                    >
                      <span>Reserve Ritual</span>
                      <span className="material-symbols-outlined text-[16px]">spa</span>
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-[#112e20]/10 hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-[11px] uppercase tracking-widest text-[#9b4521] font-bold">
                      {service.categoryLabel}
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-[#e5e9e6] text-[#112e20] font-label-md text-[11px] font-semibold">
                      {service.durationLabel}
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-[20px] text-[#112e20] group-hover:text-[#9b4521] transition-colors leading-snug font-display-hero">
                    {service.name}
                  </h3>

                  <p className="font-body-md text-[13px] leading-relaxed text-[#424844]">
                    {service.description}
                  </p>

                  <ul className="space-y-2 pt-1 text-[12px] text-[#424844]">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#9b4521] text-[16px]">check</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="text-[24px] font-bold text-[#112e20] font-display-hero">
                      ${service.price}
                    </span>
                    <span className="text-[12px] text-[#424844]/70">all-inclusive</span>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-[#c2c8c2]/30">
                  <button
                    onClick={() => onSelectServiceToBook(service)}
                    className="w-full py-2.5 px-4 rounded-full bg-[#112e20] text-white hover:bg-[#9b4521] transition-colors font-label-md text-[13px] font-medium text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    type="button"
                  >
                    <span>Book Experience</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
