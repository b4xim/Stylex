import React, { useState, useEffect, useRef } from 'react';
import { PortfolioWork } from '../../types';

interface AddPortfolioPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (photo: PortfolioWork) => void;
  photoToEdit?: PortfolioWork | null;
}

export const AddPortfolioPhotoModal: React.FC<AddPortfolioPhotoModalProps> = ({
  isOpen,
  onClose,
  onSavePhoto,
  photoToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Smoothening');
  const [artisan, setArtisan] = useState('Texture Specialist');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [imageFileName, setImageFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (photoToEdit) {
      setTitle(photoToEdit.title || '');
      setCategory(photoToEdit.category || 'Smoothening');
      setArtisan(photoToEdit.artisan || 'Texture Specialist');
      setImageUrl(photoToEdit.imageUrl || '');
      setDescription(photoToEdit.description || '');
      setIsActive(photoToEdit.isActive ?? true);
      setImageFileName('');
      setUploadError('');
    } else {
      setTitle('');
      setCategory('Smoothening');
      setArtisan('Texture Specialist');
      setImageUrl('');
      setDescription('');
      setIsActive(true);
      setImageFileName('');
      setUploadError('');
    }
  }, [photoToEdit, isOpen]);

  if (!isOpen) return null;

  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    setUploadError('');
    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setUploadError('Please enter a title for the transformation photo.');
      return;
    }
    if (!imageUrl.trim()) {
      setUploadError('Please upload a high-resolution photo.');
      return;
    }

    const photoData: PortfolioWork = {
      id: photoToEdit?.id || `port-${Date.now()}`,
      title: title.trim(),
      category: category.trim() || 'Hair Styling',
      artisan: artisan.trim() || 'Master Artisan',
      imageUrl: imageUrl.trim(),
      description: description.trim() || undefined,
      isActive,
    };

    onSavePhoto(photoData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1a2e26] rounded-2xl shadow-2xl border border-[#c2c8c2]/50 dark:border-white/10 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c2c8c2]/30 dark:border-white/10 bg-[#f7f9f7] dark:bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#112e20] dark:bg-[#284435] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#112e20] dark:text-white">
                {photoToEdit ? 'Edit Client Transformation' : 'Upload Transformation Photo'}
              </h2>
              <p className="text-xs text-[#424844] dark:text-neutral-300">
                Displayed in the &ldquo;Client Transformations &amp; Artistry&rdquo; photo gallery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full text-[#424844] dark:text-neutral-400 hover:bg-[#c2c8c2]/30 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {uploadError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
              <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
              <span>{uploadError}</span>
            </div>
          )}

          {/* Photo Title */}
          <div>
            <label className="block text-xs font-semibold text-[#112e20] dark:text-neutral-200 uppercase tracking-wider mb-1.5">
              Transformation Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hair Smoothening & Gloss Transformation"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#c2c8c2]/60 dark:border-white/15 bg-white dark:bg-white/5 text-[#112e20] dark:text-white text-sm focus:outline-none focus:border-[#112e20] dark:focus:border-white/40 shadow-2xs"
            />
          </div>

          {/* Category & Lead Artisan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#112e20] dark:text-neutral-200 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c2c8c2]/60 dark:border-white/15 bg-white dark:bg-[#152720] text-[#112e20] dark:text-white text-sm focus:outline-none focus:border-[#112e20] shadow-2xs cursor-pointer"
              >
                <option value="Smoothening">Smoothening & Gloss</option>
                <option value="Bridal Makeover">Bridal Makeover</option>
                <option value="Kids Hair Cut">Kids Hair Cut</option>
                <option value="Hair Coloring">Hair Coloring & Highlights</option>
                <option value="Hair Styling">Hair Styling & Blowout</option>
                <option value="Skin Ritual">Skin & Facial Treatment</option>
                <option value="Men Grooming">Men's Grooming</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#112e20] dark:text-neutral-200 uppercase tracking-wider mb-1.5">
                Lead Artisan / Stylist *
              </label>
              <input
                type="text"
                required
                value={artisan}
                onChange={(e) => setArtisan(e.target.value)}
                placeholder="e.g. Texture Specialist, Niya, Lead Bridal Stylist"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c2c8c2]/60 dark:border-white/15 bg-white dark:bg-white/5 text-[#112e20] dark:text-white text-sm focus:outline-none focus:border-[#112e20] shadow-2xs"
              />
            </div>
          </div>

          {/* High-Resolution Photo Upload */}
          <div>
            <label className="block text-xs font-semibold text-[#112e20] dark:text-neutral-200 uppercase tracking-wider mb-1.5">
              Client Photo * (4:5 portrait ratio recommended)
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleProcessFile(file);
              }}
              className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                isDragging
                  ? 'border-[#112e20] dark:border-white bg-[#caead5]/20 dark:bg-white/10'
                  : 'border-[#c2c8c2]/60 dark:border-white/20 bg-[#f7f9f7] dark:bg-white/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleProcessFile(file);
                }}
                className="hidden"
              />

              {imageUrl ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                  <div className="relative w-28 h-36 rounded-xl overflow-hidden shadow-md border border-[#c2c8c2]/60 shrink-0 bg-black">
                    <img src={imageUrl} alt="Transformation Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                      <span className="text-[9px] font-bold text-[#fe753c] uppercase">{category}</span>
                      <span className="text-[10px] font-semibold truncate">{title || 'Preview'}</span>
                    </div>
                  </div>
                  <div className="text-left space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Photo Loaded</span>
                    </div>
                    {imageFileName && (
                      <p className="text-[11px] text-[#424844] dark:text-neutral-400 truncate max-w-xs font-mono">
                        {imageFileName}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1 px-3 py-1 text-xs rounded-lg bg-white dark:bg-white/10 border border-[#c2c8c2]/60 dark:border-white/20 text-[#112e20] dark:text-white hover:bg-[#eaefeb] cursor-pointer"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#112e20]/10 dark:bg-white/10 text-[#112e20] dark:text-white mx-auto flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                  </div>
                  <div className="text-xs text-[#424844] dark:text-neutral-300">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#112e20] dark:text-emerald-400 font-semibold underline hover:text-[#284435] cursor-pointer mr-1"
                    >
                      Click to upload
                    </button>
                    or drag &amp; drop client transformation photo
                  </div>
                  <p className="text-[10px] text-[#727973] dark:text-neutral-400">Supports PNG, JPG, WebP</p>
                </div>
              )}
            </div>

            {/* Direct URL input fallback */}
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste photo URL (/images/photos/... or https://...)"
                className="w-full px-3 py-1.5 rounded-lg border border-[#c2c8c2]/40 dark:border-white/10 bg-white dark:bg-white/5 text-[#112e20] dark:text-white text-xs focus:outline-none focus:border-[#112e20]"
              />
            </div>
          </div>

          {/* Description / Technique */}
          <div>
            <label className="block text-xs font-semibold text-[#112e20] dark:text-neutral-200 uppercase tracking-wider mb-1.5">
              Technique &amp; Style Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Silky, reflective glaze with advanced thermal bonding treatment."
              className="w-full px-3.5 py-2 rounded-xl border border-[#c2c8c2]/60 dark:border-white/15 bg-white dark:bg-white/5 text-[#112e20] dark:text-white text-sm focus:outline-none focus:border-[#112e20] shadow-2xs resize-none"
            />
          </div>

          {/* Active Status Switch */}
          <div className="flex items-center justify-between pt-2 border-t border-[#c2c8c2]/30 dark:border-white/10">
            <div>
              <div className="text-xs font-bold text-[#112e20] dark:text-white">Active on Client Website</div>
              <div className="text-[11px] text-[#424844] dark:text-neutral-400">
                Immediately displayed in the &ldquo;Client Transformations&rdquo; photo gallery.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                  isActive ? 'bg-[#112e20] dark:bg-emerald-600 justify-end' : 'bg-[#c2c8c2] dark:bg-neutral-600 justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </button>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#c2c8c2]/30 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#424844] dark:text-neutral-300 hover:bg-[#c2c8c2]/20 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#112e20] dark:bg-[#284435] text-white hover:bg-[#284435] dark:hover:bg-[#345845] text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px]">
                {photoToEdit ? 'save' : 'publish'}
              </span>
              <span>{photoToEdit ? 'Save Changes' : 'Publish Photo to Website'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
