import React, { useState } from 'react';
import { ServiceItem, UserAccount } from '../types';

interface ServiceMenuViewProps {
  services: ServiceItem[];
  onToggleVisibility: (id: string) => void;
  onOpenAddService: () => void;
  onEditService: (service: ServiceItem) => void;
  onDeleteService: (id: string) => void;
  globalSearchQuery?: string;
  currentUser?: UserAccount;
}

export const ServiceMenuView: React.FC<ServiceMenuViewProps> = ({
  services,
  onToggleVisibility,
  onOpenAddService,
  onEditService,
  onDeleteService,
  globalSearchQuery = '',
  currentUser,
}) => {
  const isViewOnly = currentUser?.role === 'Staff' || currentUser?.role === 'Normal User';
  const [activeCategory, setActiveCategory] = useState<'all' | 'hair' | 'skin' | 'spa' | 'groom' | 'bridal'>('all');
  const [localSearch, setLocalSearch] = useState('');
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);

  const effectiveSearch = (globalSearchQuery || localSearch).toLowerCase().trim();

  const filteredServices = services.filter((svc) => {
    if (activeCategory !== 'all' && svc.category !== activeCategory) {
      return false;
    }
    if (!effectiveSearch) return true;
    return (
      svc.name.toLowerCase().includes(effectiveSearch) ||
      svc.description.toLowerCase().includes(effectiveSearch)
    );
  });

  return (
    <div className="flex flex-col w-full">
      {/* Streamlined Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#112e20] tracking-tight">
            Service Menu
          </h1>
          <p className="text-sm text-[#424844] mt-1">
            Manage your salon services, timing, and website availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64 sm:w-72">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#424844] text-[18px]">
              search
            </span>
            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-[#181d1b] placeholder:text-[#424844] text-sm outline-none shadow-xs focus:ring-1 focus:ring-[#112e20] border border-[#c2c8c2]/40"
              placeholder="Search services..."
              type="text"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-3 top-2.5 text-[#727973] hover:text-[#181d1b]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {!isViewOnly ? (
            <button
              onClick={onOpenAddService}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9b4521] text-white text-[13px] font-semibold shadow-sm hover:bg-[#752906] transition-all hover:-translate-y-0.5 active:translate-y-0 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>+ Add Service</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-500 text-xs font-medium">
              <span className="material-symbols-outlined text-[15px]">visibility</span>
              <span>View-Only Mode</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Services' },
          { id: 'hair', label: 'Hair' },
          { id: 'skin', label: 'Skin Care' },
          { id: 'spa', label: 'Spa & Nails' },
          { id: 'groom', label: 'Pre-Groom' },
          { id: 'bridal', label: 'Pre-Bridal' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#112e20] text-white shadow-xs'
                : 'bg-[#eaefeb] text-[#181d1b] hover:bg-[#e5e9e6]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Clean Service Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#c2c8c2]/30 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#f0f5f1] border-b border-[#c2c8c2]/30 text-[#424844] text-[11px] uppercase tracking-wider font-semibold select-none">
          <div className="col-span-8">Service & Description</div>
          <div className="col-span-2 text-center">Duration</div>
          <div className="col-span-1 text-center">Website Display</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Items List */}
        <div className="divide-y divide-[#eaefeb]">
          {filteredServices.length === 0 ? (
            <div className="p-8 text-center text-[#727973] text-sm">
              No services found matching your criteria.
            </div>
          ) : (
            filteredServices.map((svc) => (
              <div
                key={svc.id}
                className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-[#f0f5f1]/40 transition-colors"
              >
                <div className="col-span-8 flex flex-col">
                  <span className="text-base text-[#112e20] font-semibold">
                    {svc.name}
                  </span>
                  <span className="text-xs text-[#424844] mt-0.5 leading-relaxed">
                    {svc.description}
                  </span>
                </div>

                <div className="col-span-2 flex items-center justify-center gap-1.5 text-[#181d1b] text-sm">
                  <span className="material-symbols-outlined text-[16px] text-[#424844]">
                    schedule
                  </span>
                  <span>{svc.durationMin} min</span>
                </div>

                <div className="col-span-1 flex items-center justify-center">
                  <button
                    type="button"
                    disabled={isViewOnly}
                    onClick={() => onToggleVisibility(svc.id)}
                    aria-label={`Toggle visibility of ${svc.name}`}
                    className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors ${
                      isViewOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    } ${
                      svc.showOnWebsite ? 'bg-[#112e20] justify-end' : 'bg-[#c2c8c2] justify-start'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-sm"></span>
                  </button>
                </div>

                <div className="col-span-1 flex items-center justify-end gap-1.5">
                  {!isViewOnly ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onEditService(svc)}
                        className="w-8 h-8 rounded-xl border border-[#c2c8c2]/50 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-[#eaefeb] dark:hover:bg-white/10 text-[#424844] dark:text-neutral-200 hover:text-[#112e20] dark:hover:text-white flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                        title="Edit Service"
                      >
                        <span className="material-symbols-outlined text-[17px] text-current">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setServiceToDelete(svc)}
                        className="w-8 h-8 rounded-xl border border-[#c2c8c2]/50 dark:border-white/10 bg-white dark:bg-white/5 text-[#424844] dark:text-neutral-300 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer btn-delete-action"
                        title="Delete Service"
                      >
                        <span className="material-symbols-outlined text-[17px] text-current">delete</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 italic pr-2">
                      Read-only
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* In-UI Confirmation Dialog for Service Deletion */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white dark:bg-[#15201a] rounded-2xl shadow-2xl w-full max-w-md border border-[#c2c8c2]/40 dark:border-white/10 p-6 overflow-hidden animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[26px]">delete_forever</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-[#112e20] dark:text-white leading-tight">
                  Remove Service?
                </h3>
                <p className="text-xs text-[#526058] dark:text-[#a0aca4] mt-2 leading-relaxed">
                  Are you sure you want to remove <span className="font-bold text-[#112e20] dark:text-white">{serviceToDelete.name}</span> from the salon service menu?
                </p>
                <div className="flex items-center gap-2.5 mt-5 justify-end">
                  <button
                    type="button"
                    onClick={() => setServiceToDelete(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#424844] dark:text-[#a0aca4] hover:bg-[#eaefeb] dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const id = serviceToDelete.id;
                      setServiceToDelete(null);
                      onDeleteService(id);
                    }}
                    className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Yes, Remove</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
