import React, { useState, useEffect, useRef } from 'react';
import { Stylist } from '../../types';

interface StylistModalProps {
  isOpen: boolean;
  stylist?: Stylist | null; // null = add mode, Stylist = edit mode
  onClose: () => void;
  onSave: (stylist: Stylist) => void;
}

const BLANK: Omit<Stylist, 'id'> = {
  name: '',
  role: '',
  avatar: '',
  station: '',
  specialty: '',
  appointmentsCount: 0,
  rating: 5,
  reviewsCount: 0,
  isAvailableToday: true,
};

export const StylistModal: React.FC<StylistModalProps> = ({ isOpen, stylist, onClose, onSave }) => {
  const [form, setForm] = useState<Omit<Stylist, 'id'>>(BLANK);
  const [servesGents, setServesGents] = useState(true);
  const [servesLadies, setServesLadies] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!stylist;

  useEffect(() => {
    if (stylist) {
      const { id: _id, ...rest } = stylist;
      setForm(rest);
      setShowUrlInput(false);
      setUploadError('');
      const g = (stylist.gender || 'both').toLowerCase();
      setServesGents(g === 'gents' || g === 'male' || g === 'both' || g === 'any' || g === 'unisex');
      setServesLadies(g === 'ladies' || g === 'female' || g === 'both' || g === 'any' || g === 'unisex');
    } else {
      setForm(BLANK);
      setShowUrlInput(false);
      setUploadError('');
      setServesGents(true);
      setServesLadies(true);
    }
  }, [stylist, isOpen]);

  if (!isOpen) return null;

  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    setUploadError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setForm((prev) => ({ ...prev, avatar: e.target?.result as string }));
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) return;

    let computedGender = 'both';
    if (servesGents && !servesLadies) {
      computedGender = 'gents';
    } else if (!servesGents && servesLadies) {
      computedGender = 'ladies';
    } else {
      computedGender = 'both';
    }

    onSave({
      id: stylist?.id ?? `stylist_${Date.now()}`,
      ...form,
      gender: computedGender,
    });
    onClose();
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] dark:bg-[#1a2520] text-[#181d1b] dark:text-white text-sm border border-[#c2c8c2]/30 dark:border-[#2b3a32] outline-none focus:ring-2 focus:ring-[#9b4521] focus:border-transparent transition-all placeholder:text-[#727973] dark:placeholder:text-[#6a7c73]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#15201a] rounded-2xl shadow-2xl w-full max-w-lg border border-[#c2c8c2]/30 dark:border-[#2a3830] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#eaefeb] dark:border-[#243029] flex items-center justify-between bg-[#f8faf8] dark:bg-[#111b16]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#112e20] dark:bg-[#1e3829] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">
                {isEdit ? 'edit' : 'person_add'}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-[#112e20] dark:text-white text-base">
                {isEdit ? 'Edit Stylist' : 'Add New Stylist'}
              </h2>
              <p className="text-xs text-[#727973] dark:text-[#8d9c94]">
                {isEdit ? `Editing profile for ${stylist?.name}` : 'Add to your StyleX team roster'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#eaefeb] dark:hover:bg-[#1f2d25] text-[#727973] dark:text-[#8d9c94] dark:hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {/* Stylist Photo Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#424844] dark:text-[#d3ded8] uppercase tracking-wider flex items-center justify-between">
              <span>Stylist Portrait Photo</span>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[11px] text-[#9b4521] dark:text-[#ff9266] hover:underline normal-case font-normal cursor-pointer"
              >
                {showUrlInput ? 'Switch to file upload' : 'or paste image URL'}
              </button>
            </label>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Upload Area or Preview */}
            {!showUrlInput ? (
              form.avatar ? (
                /* Uploaded Preview Card */
                <div className="flex items-center gap-4 p-3 rounded-xl bg-[#f0f5f1] dark:bg-[#1a2520] border border-[#dfe4e0]/70 dark:border-[#2b3a32]">
                  <img
                    src={form.avatar}
                    alt={form.name || 'Stylist'}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white dark:border-[#25362d] shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#112e20] dark:text-white truncate">
                      {form.name ? `${form.name}'s Portrait` : 'Photo Selected'}
                    </p>
                    <p className="text-[11px] text-[#727973] dark:text-[#8d9c94] mt-0.5">
                      Ready to save with stylist profile
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-semibold text-[#112e20] dark:text-[#9fe2be] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">upload</span>
                        <span>Change Photo</span>
                      </button>
                      <span className="text-[#c2c8c2] dark:text-[#33463c]">•</span>
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, avatar: '' }))}
                        className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Drag & Drop Upload Zone */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? 'border-[#9b4521] bg-[#9b4521]/5 dark:bg-[#9b4521]/10'
                      : 'border-[#c2c8c2] dark:border-[#2f4036] hover:border-[#112e20] dark:hover:border-[#8fe0b0] bg-[#f8faf8] dark:bg-[#17221d]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#eaefeb] dark:bg-[#203127] text-[#112e20] dark:text-[#9fe2be] flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[22px]">add_a_photo</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#112e20] dark:text-white">
                      Click to upload portrait
                    </span>
                    <span className="text-xs text-[#727973] dark:text-[#8d9c94]"> or drag and drop</span>
                  </div>
                  <span className="text-[10px] text-[#727973] dark:text-[#7f9086]">
                    PNG, JPG, WebP supported
                  </span>
                </div>
              )
            ) : (
              /* Fallback URL Input */
              <div className="flex flex-col gap-2">
                <input
                  className={inputClass}
                  placeholder="https://... (portrait photo URL)"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                />
                {form.avatar && (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-[#f0f5f1] dark:bg-[#1a2520]">
                    <img
                      src={form.avatar}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-[#c2c8c2]/50"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <span className="text-xs text-[#424844] dark:text-[#97a59d]">URL Image Preview</span>
                  </div>
                )}
              </div>
            )}

            {uploadError && (
              <span className="text-xs text-rose-600 dark:text-rose-400 mt-1 pl-1">
                {uploadError}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#424844] dark:text-[#d3ded8] uppercase tracking-wider">
                Full Name *
              </label>
              <input
                required
                className={inputClass}
                placeholder="e.g. Niya Rajan"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#424844] dark:text-[#d3ded8] uppercase tracking-wider">
                Role / Title *
              </label>
              <input
                required
                className={inputClass}
                placeholder="e.g. Senior Stylist"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#424844] dark:text-[#d3ded8] uppercase tracking-wider">
              Assigned Station
            </label>
            <input
              className={inputClass}
              placeholder="e.g. Styling Station Chair 1"
              value={form.station}
              onChange={(e) => setForm({ ...form, station: e.target.value })}
            />
          </div>

          {/* Target Audience / Gender Served Checkboxes */}
          <div className="flex flex-col gap-2 pt-1">
            <label className="text-xs font-semibold text-[#424844] dark:text-[#d3ded8] uppercase tracking-wider">
              Services Offered To (Target Audience) *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  servesGents
                    ? 'bg-emerald-50/70 border-emerald-500/50 dark:bg-emerald-950/40 dark:border-emerald-500/50 text-[#112e20] dark:text-white'
                    : 'bg-[#f0f5f1]/60 border-[#c2c8c2]/30 dark:bg-[#1a2520] dark:border-[#2b3a32] text-[#727973] opacity-60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={servesGents}
                  onChange={(e) => {
                    if (!e.target.checked && !servesLadies) return; // Prevent deselecting both
                    setServesGents(e.target.checked);
                  }}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 accent-[#112e20] dark:accent-emerald-500 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#112e20] dark:text-[#8fe0b0]">
                    man
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold leading-tight">Gents</span>
                    <span className="text-[10px] text-[#727973] dark:text-[#8d9c94]">Men's Grooming</span>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  servesLadies
                    ? 'bg-emerald-50/70 border-emerald-500/50 dark:bg-emerald-950/40 dark:border-emerald-500/50 text-[#112e20] dark:text-white'
                    : 'bg-[#f0f5f1]/60 border-[#c2c8c2]/30 dark:bg-[#1a2520] dark:border-[#2b3a32] text-[#727973] opacity-60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={servesLadies}
                  onChange={(e) => {
                    if (!e.target.checked && !servesGents) return; // Prevent deselecting both
                    setServesLadies(e.target.checked);
                  }}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 accent-[#112e20] dark:accent-emerald-500 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-rose-600 dark:text-rose-400">
                    woman
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold leading-tight">Ladies</span>
                    <span className="text-[10px] text-[#727973] dark:text-[#8d9c94]">Women's Rituals</span>
                  </div>
                </div>
              </label>
            </div>
            <p className="text-[11px] text-[#727973] dark:text-[#8d9c94] px-0.5">
              {servesGents && servesLadies
                ? '✓ Serves both Gents and Ladies (Visible in all booking categories).'
                : servesGents
                ? '✓ Serves Gents only (Visible in Gents bookings).'
                : '✓ Serves Ladies only (Visible in Ladies bookings).'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#eaefeb] dark:border-[#243029]">
            <label className="text-sm font-semibold text-[#112e20] dark:text-white">
              Available
            </label>
            <button
              type="button"
              onClick={() => setForm({ ...form, isAvailableToday: !form.isAvailableToday })}
              className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                form.isAvailableToday ? 'bg-emerald-500 justify-end' : 'bg-[#c2c8c2] dark:bg-[#34463c] justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#eaefeb] dark:border-[#243029] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#424844] dark:text-[#9ea8a2] hover:bg-[#eaefeb] dark:hover:bg-[#1d2a23] rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#112e20] hover:bg-[#284435] text-white text-xs font-semibold transition-all cursor-pointer shadow-sm hover:shadow"
            >
              {isEdit ? 'Save Changes' : 'Add Stylist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
