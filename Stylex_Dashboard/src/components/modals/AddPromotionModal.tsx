import React, { useState, useEffect, useRef } from 'react';
import { CarouselBanner } from '../../types';

interface AddPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBanner: (banner: CarouselBanner) => void;
  bannerToEdit?: CarouselBanner | null;
}

export const AddPromotionModal: React.FC<AddPromotionModalProps> = ({
  isOpen,
  onClose,
  onSaveBanner,
  bannerToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Limited Privilege');
  const [validity, setValidity] = useState('Open Daily • 10:00 AM – 1:00 AM');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [imageFileName, setImageFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bannerToEdit) {
      setTitle(bannerToEdit.title || '');
      setTag(bannerToEdit.tag || 'Limited Privilege');
      setValidity(bannerToEdit.validity || 'Open Daily • 10:00 AM – 1:00 AM');
      setImageUrl(bannerToEdit.imageUrl || '');
      setIsActive(bannerToEdit.isActive ?? true);
      setImageFileName('');
      setUploadError('');
    } else {
      setTitle('');
      setTag('Limited Privilege');
      setValidity('Open Daily • 10:00 AM – 1:00 AM');
      setImageUrl('');
      setIsActive(true);
      setImageFileName('');
      setUploadError('');
    }
  }, [bannerToEdit, isOpen]);

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
    if (!title.trim()) return;
    if (!imageUrl.trim()) {
      setUploadError('Please upload a promotional image for this banner.');
      return;
    }

    onSaveBanner({
      id: bannerToEdit?.id || `ban-${Date.now()}`,
      title: title.trim(),
      tag: tag.trim() || 'Featured Offer',
      validity: validity.trim() || 'Seasonal Special',
      imageUrl: imageUrl.trim(),
      isActive,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#112e20]/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#c2c8c2]/50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eaefeb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f0f5f1] text-[#112e20] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">
                {bannerToEdit ? 'edit_note' : 'auto_awesome'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#9b4521] uppercase tracking-wider font-bold">
                Carousel Studio
              </span>
              <h3 className="font-serif text-2xl text-[#112e20]">
                {bannerToEdit ? 'Edit Carousel Promotion' : 'New Carousel Promotion'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-[#727973] hover:text-[#181d1b] rounded-full hover:bg-[#f0f5f1] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Campaign Headline */}
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] mb-1">
              Promotion Campaign Headline <span className="text-[#9b4521]">*</span>
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Signature Hair Spa & Anti-Dandruff Ritual"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none transition-all"
            />
          </div>

          {/* Privilege Tag & Validity in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#181d1b] mb-1">
                Privilege Tag / Badge
              </label>
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Limited Privilege"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#181d1b] mb-1">
                Validity / Timing
              </label>
              <input
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
                placeholder="e.g. Open Daily • 10:00 AM – 1:00 AM"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none transition-all"
              />
            </div>
          </div>

          {/* Image Upload Section (Instead of URL) */}
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] mb-1.5 flex items-center justify-between">
              <span>
                Promotion Banner Image <span className="text-[#9b4521]">*</span>
              </span>
              <span className="text-[11px] text-[#727973] font-normal">
                Recommended 16:9 or 21:9 ratio
              </span>
            </label>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {imageUrl ? (
              /* Image Uploaded / Preview State */
              <div className="rounded-xl border border-[#c2c8c2]/50 p-3 bg-[#f8faf8] flex flex-col gap-3">
                <div className="relative rounded-lg overflow-hidden border border-[#c2c8c2]/30 aspect-[21/9] bg-[#0c2217] flex items-center justify-center group shadow-xs">
                  <img
                    src={imageUrl}
                    alt={title || 'Promotion preview'}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  {tag && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#112e20] text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      {tag}
                    </div>
                  )}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px]">
                    Preview
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-[18px] text-[#112e20]">
                      check_circle
                    </span>
                    <span className="text-xs text-[#424844] truncate">
                      {imageFileName || 'Uploaded Banner Image'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#112e20] text-white text-xs font-semibold hover:bg-[#284435] transition-colors cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[15px]">upload</span>
                      <span>Change Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setImageFileName('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="w-8 h-8 rounded-xl border border-[#c2c8c2]/50 dark:border-white/10 bg-white dark:bg-white/5 text-[#424844] dark:text-neutral-300 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer btn-delete-action"
                      title="Remove image"
                    >
                      <span className="material-symbols-outlined text-[17px] text-current">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Dropzone / Upload Action State */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                  isDragging
                    ? 'border-[#112e20] bg-[#e6ede7]'
                    : 'border-[#c2c8c2] bg-[#f8faf8] hover:bg-[#f0f5f1] hover:border-[#112e20]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#e6ede7] text-[#112e20] flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">add_photo_alternate</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#112e20]">
                    Click to upload promotional image
                  </p>
                  <p className="text-xs text-[#727973] mt-0.5">
                    or drag & drop your banner file here (PNG, JPG, WebP)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#112e20] text-white text-xs font-semibold hover:bg-[#284435] transition-colors shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  <span>Upload Image</span>
                </button>
              </div>
            )}

            {uploadError && (
              <p className="text-xs text-[#ba1a1a] mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                <span>{uploadError}</span>
              </p>
            )}
          </div>

          {/* Active Status Switch */}
          <div className="pt-2 flex items-center justify-between border-t border-[#eaefeb]">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#181d1b]">
                Active on Live Carousel
              </span>
              <span className="text-[11px] text-[#727973]">
                Display this slide immediately to visiting clients
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                isActive ? 'bg-[#112e20] justify-end' : 'bg-[#c2c8c2] justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-xs"></span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#eaefeb]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-[#424844] hover:bg-[#eaefeb] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#112e20] text-white text-xs font-semibold hover:bg-[#284435] transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>{bannerToEdit ? 'Save Changes' : 'Publish Carousel Slide'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
