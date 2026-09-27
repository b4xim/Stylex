import React, { useState, useEffect, useRef } from 'react';
import { ReelItem } from '../../types';

interface AddReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveReel: (reel: ReelItem) => void;
  reelToEdit?: ReelItem | null;
}

export const AddReelModal: React.FC<AddReelModalProps> = ({
  isOpen,
  onClose,
  onSaveReel,
  reelToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Smoothening');
  const [category, setCategory] = useState('Hair Texture');
  const [stylistHandle, setStylistHandle] = useState('StyleX Team • Tirur');
  const [audioTrack, setAudioTrack] = useState('Original Audio • StyleX');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [imageFileName, setImageFileName] = useState('');
  const [videoFileName, setVideoFileName] = useState('');
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (reelToEdit) {
      setTitle(reelToEdit.title || '');
      setTag(reelToEdit.tag || 'Trending Look');
      setCategory(reelToEdit.category || 'Hair Texture');
      setStylistHandle(reelToEdit.stylistHandle || 'StyleX Team • Tirur');
      setAudioTrack(reelToEdit.audioTrack || 'Original Audio • StyleX');
      setImageUrl(reelToEdit.imageUrl || '');
      setVideoUrl(reelToEdit.videoUrl || '');
      setInstagramUrl(reelToEdit.instagramUrl || '');
      setDescription(reelToEdit.description || '');
      setIsActive(reelToEdit.isActive ?? true);
      setImageFileName('');
      setVideoFileName('');
      setUploadError('');
    } else {
      setTitle('');
      setTag('Smoothening');
      setCategory('Hair Texture');
      setStylistHandle('StyleX Team • Tirur');
      setAudioTrack('Original Audio • StyleX');
      setImageUrl('');
      setVideoUrl('');
      setInstagramUrl('');
      setDescription('');
      setIsActive(true);
      setImageFileName('');
      setVideoFileName('');
      setUploadError('');
    }
  }, [reelToEdit, isOpen]);

  if (!isOpen) return null;

  const handleProcessImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP) for the reel cover.');
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

  const handleProcessVideoFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setUploadError('Please select a valid video file (MP4, WebM) or paste a video link.');
      return;
    }
    setUploadError('');
    setVideoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setVideoUrl(e.target.result as string);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read video file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setUploadError('Please enter a reel title.');
      return;
    }
    if (!imageUrl.trim()) {
      setUploadError('Please upload a cover/thumbnail image for the reel.');
      return;
    }

    const reelData: ReelItem = {
      id: reelToEdit?.id || `reel-${Date.now()}`,
      title: title.trim(),
      tag: tag.trim() || 'StyleX Reel',
      category: category.trim() || 'Hair Care',
      stylistHandle: stylistHandle.trim() || 'StyleX Team • Tirur',
      audioTrack: audioTrack.trim() || 'Original Audio • StyleX',
      imageUrl: imageUrl.trim(),
      videoUrl: videoUrl.trim() || undefined,
      instagramUrl: instagramUrl.trim() || undefined,
      description: description.trim() || undefined,
      isActive,
    };

    onSaveReel(reelData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a2e26] rounded-2xl shadow-2xl border border-[#c2c8c2]/50 dark:border-white/10 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c2c8c2]/30 dark:border-white/10 bg-[#f7f9f7] dark:bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#112e20] dark:bg-[#284435] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">smart_display</span>
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#112e20] dark:text-white">
                {reelToEdit ? 'Edit Atelier Reel' : 'Upload Client Reel'}
              </h2>
              <p className="text-xs text-[#424844] dark:text-neutral-300">
                Showcased on the client website under &ldquo;Featured Reels (Atelier in Motion)&rdquo;
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

          {/* Reel Title */}
          <div>
            <label className="block text-xs font-semibold text-[#112e20] dark:text-neutral-200 uppercase tracking-wider mb-1.5">
              Reel Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hair Smoothening & Gloss Makeover"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#c2c8c2]/60 dark:border-white/15 bg-white dark:bg-white/5 text-[#112e20] dark:text-white text-sm focus:outline-none focus:border-[#112e20] dark:focus:border-white/40 shadow-2xs"
            />
          </div>

          {/* Category & Badge Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#112e20] dark:text-neutral-200 uppercase tracking-wider mb-1.5">
                Badge / Tag *
              </label>
              <input
                type="text"
                required
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Smoothening, Bridal Makeover"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c2c8c2]/60 dark:border-white/15 bg-white dark:bg-white/5 text-[#112e20] dark:text-white text-sm focus:outline-none focus:border-[#112e20] dark:focus:border-white/40 shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#112e20] dark:text-neutral-200 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c2c8c2]/60 dark:border-white/15 bg-white dark:bg-[#152720] text-[#112e20] dark:text-white text-sm focus:outline-none focus:border-[#112e20] shadow-2xs cursor-pointer"
              >
                <option value="Hair Texture">Hair Texture & Smoothening</option>
                <option value="Bridal & Makeup">Bridal Makeover & Styling</option>
                <option value="Kids Hair Cut">Kids Hair Cut & Styling</option>
                <option value="Hair Color">Hair Color & Highlights</option>
                <option value="Hair Care">Hair Care & Spa Rituals</option>
                <option value="Skin Care">Skin & Facial Artistry</option>
              </select>
            </div>
          </div>

          {/* Stylist / Handle & Audio Track */}
          <div>
            <label className="block text-xs font-semibold text-[#112e20] dark:text-neutral-200 uppercase tracking-wider mb-1.5">
              Stylist / Artisan Handle
            </label>
            <input
              type="text"
              value={stylistHandle}
              onChange={(e) => setStylistHandle(e.target.value)}
              placeholder="e.g. Texture Specialist • Tirur"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#c2c8c2]/60 dark:border-white/15 bg-white dark:bg-white/5 text-[#112e20] dark:text-white text-sm focus:outline-none focus:border-[#112e20] shadow-2xs"
            />
          </div>

          {/* Cover / Thumbnail Upload */}
          <div>
            <label className="block text-xs font-semibold text-[#112e20] dark:text-neutral-200 uppercase tracking-wider mb-1.5">
              Reel Cover / Poster Image * (9:16 vertical)
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingImage(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDraggingImage(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingImage(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleProcessImageFile(file);
              }}
              className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                isDraggingImage
                  ? 'border-[#112e20] dark:border-white bg-[#caead5]/20 dark:bg-white/10'
                  : 'border-[#c2c8c2]/60 dark:border-white/20 bg-[#f7f9f7] dark:bg-white/5'
              }`}
            >
              <input
                ref={imageFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleProcessImageFile(file);
                }}
                className="hidden"
              />

              {imageUrl ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                  <div className="relative w-24 h-40 rounded-xl overflow-hidden shadow-md border border-[#c2c8c2]/60 shrink-0 bg-black">
                    <img src={imageUrl} alt="Reel Cover Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1.5">
                      <span className="text-[9px] font-bold text-white uppercase">{tag}</span>
                    </div>
                  </div>
                  <div className="text-left space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Image Ready</span>
                    </div>
                    {imageFileName && (
                      <p className="text-[11px] text-[#424844] dark:text-neutral-400 truncate max-w-xs font-mono">
                        {imageFileName}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => imageFileInputRef.current?.click()}
                      className="mt-1 px-3 py-1 text-xs rounded-lg bg-white dark:bg-white/10 border border-[#c2c8c2]/60 dark:border-white/20 text-[#112e20] dark:text-white hover:bg-[#eaefeb] cursor-pointer"
                    >
                      Change Cover
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
                      onClick={() => imageFileInputRef.current?.click()}
                      className="text-[#112e20] dark:text-emerald-400 font-semibold underline hover:text-[#284435] cursor-pointer mr-1"
                    >
                      Click to upload
                    </button>
                    or drag &amp; drop reel cover (9:16)
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
                placeholder="Or paste direct image URL (/videos/thumbnails/... or https://...)"
                className="w-full px-3 py-1.5 rounded-lg border border-[#c2c8c2]/40 dark:border-white/10 bg-white dark:bg-white/5 text-[#112e20] dark:text-white text-xs focus:outline-none focus:border-[#112e20]"
              />
            </div>
          </div>

          {/* Video Attachment (Optional Video URL or MP4 upload) */}
          <div className="p-3.5 rounded-xl bg-[#f7f9f7] dark:bg-white/5 border border-[#c2c8c2]/40 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#112e20] dark:text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#fe753c]">videocam</span>
                <span>Video Reel Asset (Optional MP4 / Video Link)</span>
              </label>
              {videoUrl && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Video Attached
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                ref={videoFileInputRef}
                type="file"
                accept="video/mp4,video/webm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleProcessVideoFile(file);
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => videoFileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 border border-[#c2c8c2]/60 dark:border-white/20 text-[#112e20] dark:text-white text-xs font-medium hover:bg-[#eaefeb] shrink-0 cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">upload_file</span>
                <span>{videoFileName ? 'Change Video' : 'Upload MP4 File'}</span>
              </button>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Or paste video URL (e.g. /videos/reels/Smoothening.mp4)"
                className="flex-1 w-full px-3 py-1.5 rounded-lg border border-[#c2c8c2]/40 dark:border-white/10 bg-white dark:bg-white/5 text-[#112e20] dark:text-white text-xs focus:outline-none focus:border-[#112e20]"
              />
            </div>
            {videoFileName && (
              <p className="text-[11px] text-[#424844] dark:text-neutral-400 font-mono truncate">
                Selected: {videoFileName}
              </p>
            )}
          </div>

          {/* Instagram Post URL */}
          <div>
            <label className="block text-xs font-semibold text-[#112e20] dark:text-neutral-200 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <span className="text-[#e1306c]">Instagram Reel Link</span>
              <span className="text-[11px] text-[#727973] font-normal lowercase">(optional external redirect)</span>
            </label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://www.instagram.com/p/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#c2c8c2]/60 dark:border-white/15 bg-white dark:bg-white/5 text-[#112e20] dark:text-white text-sm focus:outline-none focus:border-[#112e20] shadow-2xs"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#112e20] dark:text-neutral-200 uppercase tracking-wider mb-1.5">
              Short Description / Ritual Details
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Silky, frizz-free hair smoothening with lasting radiant shine."
              className="w-full px-3.5 py-2 rounded-xl border border-[#c2c8c2]/60 dark:border-white/15 bg-white dark:bg-white/5 text-[#112e20] dark:text-white text-sm focus:outline-none focus:border-[#112e20] shadow-2xs resize-none"
            />
          </div>

          {/* Active Status Switch */}
          <div className="flex items-center justify-between pt-2 border-t border-[#c2c8c2]/30 dark:border-white/10">
            <div>
              <div className="text-xs font-bold text-[#112e20] dark:text-white">Active on Client Website</div>
              <div className="text-[11px] text-[#424844] dark:text-neutral-400">
                Immediately visible in the &ldquo;Featured Reels&rdquo; carousel.
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
                {reelToEdit ? 'save' : 'publish'}
              </span>
              <span>{reelToEdit ? 'Save Changes' : 'Publish Reel to Website'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
