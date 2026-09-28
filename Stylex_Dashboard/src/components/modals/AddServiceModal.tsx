import React, { useState, useEffect } from 'react';
import { ServiceItem, ServiceCategory } from '../../types';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveService: (service: ServiceItem) => void;
  serviceToEdit?: ServiceItem | null;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onSaveService,
  serviceToEdit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('hair');
  const [durationMin, setDurationMin] = useState(45);
  const [description, setDescription] = useState('');
  const [showOnWebsite, setShowOnWebsite] = useState(true);
  const [servesGents, setServesGents] = useState(true);
  const [servesLadies, setServesLadies] = useState(true);

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name);
      setCategory(serviceToEdit.category);
      setDurationMin(serviceToEdit.durationMin);
      setDescription(serviceToEdit.description);
      setShowOnWebsite(serviceToEdit.showOnWebsite);
      const g = (serviceToEdit.gender || 'both').toLowerCase();
      setServesGents(g === 'gents' || g === 'both' || g === 'unisex');
      setServesLadies(g === 'ladies' || g === 'both' || g === 'unisex');
    } else {
      setName('');
      setCategory('hair');
      setDurationMin(45);
      setDescription('');
      setShowOnWebsite(true);
      setServesGents(true);
      setServesLadies(true);
    }
  }, [serviceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let computedGender: 'gents' | 'ladies' | 'both' = 'both';
    if (servesGents && !servesLadies) {
      computedGender = 'gents';
    } else if (!servesGents && servesLadies) {
      computedGender = 'ladies';
    } else {
      computedGender = 'both';
    }

    const newOrUpdated: ServiceItem = {
      id: serviceToEdit ? serviceToEdit.id : `svc-${Date.now()}`,
      name: name.trim(),
      category,
      durationMin: Number(durationMin),
      description: description.trim(),
      showOnWebsite,
      gender: computedGender,
    };

    onSaveService(newOrUpdated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#112e20]/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#c2c8c2]/50">
        <div className="flex items-center justify-between pb-4 border-b border-[#eaefeb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f0f5f1] text-[#112e20] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">spa</span>
            </div>
            <div>
              <span className="text-[11px] text-[#9b4521] uppercase tracking-wider font-bold">
                Admin Service Catalog
              </span>
              <h3 className="font-serif text-2xl text-[#112e20]">
                {serviceToEdit ? 'Edit Service' : 'Add New Service'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#727973] hover:text-[#181d1b] rounded-full hover:bg-[#f0f5f1] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] mb-1">
              Service / Ritual Title
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hair Cut & Blowout Styling"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#181d1b] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
              >
                <option value="hair">Hair Design</option>
                <option value="skin">Skin Care & Glow</option>
                <option value="spa">Spa & Nails</option>
                <option value="groom">Pre-Grooming</option>
                <option value="bridal">Pre-Bridal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#181d1b] mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="15"
                step="15"
                value={durationMin}
                onChange={(e) => setDurationMin(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
              />
            </div>
          </div>

          {/* Target Section / Gender Checkboxes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#181d1b]">
              Target Section / Gender Offered *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                  servesGents
                    ? 'bg-emerald-50/70 border-emerald-500/50 text-[#112e20]'
                    : 'bg-[#f0f5f1]/60 border-[#c2c8c2]/30 text-[#727973] opacity-60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={servesGents}
                  onChange={(e) => {
                    if (!e.target.checked && !servesLadies) return; // Prevent deselecting both
                    setServesGents(e.target.checked);
                  }}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 accent-[#112e20] cursor-pointer"
                />
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#112e20]">man</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold leading-tight">Gents</span>
                    <span className="text-[10px] text-[#727973]">Men's Section</span>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                  servesLadies
                    ? 'bg-rose-50/70 border-rose-500/50 text-[#112e20]'
                    : 'bg-[#f0f5f1]/60 border-[#c2c8c2]/30 text-[#727973] opacity-60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={servesLadies}
                  onChange={(e) => {
                    if (!e.target.checked && !servesGents) return; // Prevent deselecting both
                    setServesLadies(e.target.checked);
                  }}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300 accent-[#9b4521] cursor-pointer"
                />
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-rose-600">woman</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold leading-tight">Ladies</span>
                    <span className="text-[10px] text-[#727973]">Women's Section</span>
                  </div>
                </div>
              </label>
            </div>
            <p className="text-[10px] text-[#727973] italic">
              {servesGents && servesLadies
                ? '✓ Available in both Gents & Ladies menus (Unisex)'
                : servesGents
                ? '✓ Available only in Gents menu'
                : '✓ Available only in Ladies menu'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#181d1b] mb-1">
              Editorial Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sensory biodynamic formulation, bone structure customization..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#f0f5f1]">
            <div>
              <span className="text-xs font-semibold text-[#112e20]">Show on Website</span>
              <p className="text-[11px] text-[#424844]">Display on client self-booking portal</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showOnWebsite}
                onChange={(e) => setShowOnWebsite(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#c2c8c2] rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#112e20]"></div>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-[#424844] hover:bg-[#eaefeb] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#9b4521] text-white text-xs font-semibold hover:bg-[#752906] transition-all shadow-md cursor-pointer"
            >
              {serviceToEdit ? 'Save Changes' : 'Add to Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
