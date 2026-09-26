import React, { useState } from 'react';
import { SERVICES } from '../data/salonData.ts';
import { ServiceItem } from '../types.ts';

interface ServicesMenuProps {
  onSelectServiceToBook: (service: ServiceItem) => void;
}

export const ServicesMenu: React.FC<ServicesMenuProps> = ({ onSelectServiceToBook }) => {
  const [selectedGender, setSelectedGender] = useState<'gents' | 'ladies'>('gents');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hair' | 'skin' | 'bridal' | 'groom' | 'spa'>('all');

  const filteredServices = SERVICES.filter((srv) => {
    const matchesGender = srv.gender === selectedGender;
    const matchesCategory = selectedFilter === 'all' || srv.category === selectedFilter;
    return matchesGender && matchesCategory;
  });

  const gentsCategories = [
    { id: 'all', label: 'All Categories' },
    { id: 'hair', label: 'Hair Cut & Styling' },
    { id: 'skin', label: 'Skin Care' },
    { id: 'groom', label: 'Groom Atelier' },
  ];

  const ladiesCategories = [
    { id: 'all', label: 'All Categories' },
    { id: 'hair', label: 'Hair Cut & Styling' },
    { id: 'skin', label: 'Skin Care' },
    { id: 'bridal', label: 'Bridal Atelier' },
    { id: 'spa', label: 'Nails & Pedicure' },
  ];

  const activeCategories = selectedGender === 'gents' ? gentsCategories : ladiesCategories;

  const handleGenderChange = (gender: 'gents' | 'ladies') => {
    setSelectedGender(gender);
    if (gender === 'gents' && (selectedFilter === 'bridal' || selectedFilter === 'spa')) {
      setSelectedFilter('all');
    } else if (gender === 'ladies' && selectedFilter === 'groom') {
      setSelectedFilter('all');
    }
  };

  return (
    <section className="w-full bg-[#f0f5f1] py-20 px-4 sm:px-6 lg:px-12 border-t border-[#c2c8c2]/40" id="services-curation">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="w-full md:max-w-md lg:max-w-lg flex-shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#112e20]/10 text-[#112e20] font-label-caps text-[11px] uppercase tracking-wider font-bold mb-3">
              <span>Bespoke Tirur Flagship Menu</span>
            </div>
            <h2 className="font-headline-lg text-[32px] sm:text-[40px] text-[#112e20] leading-tight">
              Curated Signature Services
            </h2>
            <p className="font-body-lg text-[15px] sm:text-[16px] text-[#424844]">
              Curated directly from our Tirur flagship salon menu. Master hair styling, scalp therapies, and luxury VIP suites.
            </p>
          </div>

          {/* Department Switcher & Category Pills */}
          <div className="space-y-3 w-full md:w-auto flex flex-col md:items-end flex-shrink-0">
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-[#c2c8c2]/50 w-fit shadow-xs">
              <button
                type="button"
                onClick={() => handleGenderChange('gents')}
                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors flex items-center gap-1 cursor-pointer border ${
                  selectedGender === 'gents'
                    ? 'bg-[#112e20] text-white border-[#112e20] shadow-sm'
                    : 'bg-transparent text-[#424844] border-transparent hover:text-[#112e20]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">man</span>
                <span>Gents Menu</span>
              </button>
              <button
                type="button"
                onClick={() => handleGenderChange('ladies')}
                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors flex items-center gap-1 cursor-pointer border ${
                  selectedGender === 'ladies'
                    ? 'bg-[#112e20] text-white border-[#112e20] shadow-sm'
                    : 'bg-transparent text-[#424844] border-transparent hover:text-[#112e20]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">woman</span>
                <span>Ladies Menu</span>
              </button>
            </div>

            {/* Service Filter Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
              {activeCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilter(cat.id as any)}
                  className={`px-3.5 py-1.5 rounded-full font-label-md text-[12px] font-semibold transition-colors cursor-pointer whitespace-nowrap border ${
                    selectedFilter === cat.id
                      ? 'bg-[#112e20] text-white border-[#112e20] shadow-sm'
                      : 'bg-white text-[#181d1b] border-[#c2c8c2]/50 hover:bg-[#eaefeb]'
                  }`}
                  type="button"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Service Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[480px] items-stretch">
          {filteredServices.map((service) => {
            const isFeatured = service.isFeatured || service.featured;

            return (
              <div
                key={service.id}
                className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between group relative ${
                  isFeatured
                    ? 'border-2 border-[#fe753c]/60 ring-2 ring-[#fe753c]/10'
                    : 'border border-[#c2c8c2]/50'
                }`}
              >
                {/* Signature Bookmark Badge */}
                {isFeatured && (
                  <div className="absolute -top-3.5 right-6 bg-[#fe753c] text-white font-label-caps text-[10px] uppercase tracking-wider py-1 px-3.5 rounded-full font-bold shadow-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">bookmark</span>
                    <span>{service.badge || 'Signature Specialty'}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Category & Duration */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-label-caps text-[11px] uppercase tracking-widest font-bold ${
                        isFeatured ? 'text-[#fe753c]' : 'text-[#185341]'
                      }`}
                    >
                      {service.categoryLabel}
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-[#e5e9e6] text-[#112e20] font-label-md text-[11px] font-semibold">
                      {service.durationLabel}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="font-headline-sm text-[20px] text-[#112e20] group-hover:text-[#fe753c] transition-colors leading-snug font-display-hero">
                      {service.name}
                    </h3>
                    {service.tagline && (
                      <p className="text-[#fe753c] text-[12px] font-medium mt-0.5 font-label-caps">
                        {service.tagline}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="font-body-md text-[13px] leading-relaxed text-[#424844]">
                    {service.description}
                  </p>

                  {/* Sub-menu: Individual Services in this Section */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#727973] font-label-caps">
                      Services in this section
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/60 text-[#112e20] text-[11.5px] font-medium leading-none"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#fe753c] flex-shrink-0" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-[#c2c8c2]/30">
                  <button
                    onClick={() => onSelectServiceToBook(service)}
                    className="w-full py-2.5 px-4 rounded-full bg-[#112e20] hover:bg-[#fe753c] text-white transition-colors font-label-md text-[13px] font-semibold text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm"
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
