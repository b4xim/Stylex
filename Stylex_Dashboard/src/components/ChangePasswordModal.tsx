import React, { useState } from 'react';
import { UserAccount } from '../types';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUpdatePassword: (oldPass: string, newPass: string) => { success: boolean; message: string } | Promise<{ success: boolean; message: string }>;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdatePassword,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentPassword) {
      setErrorMessage('Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onUpdatePassword(currentPassword, newPassword);
      if (result.success) {
        // Reset state and close
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrorMessage('');
        onClose();
      } else {
        setErrorMessage(result.message || 'Current password does not match.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#15201a] rounded-2xl shadow-2xl border border-[#c2c8c2]/50 dark:border-[#2d3a33] w-full max-w-md overflow-hidden relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#eaefeb] dark:border-[#243029] flex items-center justify-between bg-[#fbfdfb] dark:bg-[#121c17]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#caead5]/60 dark:bg-[#20362b] text-[#112e20] dark:text-[#a8e0be] flex items-center justify-center font-bold text-sm">
              <span className="material-symbols-outlined text-[20px]">lock_reset</span>
            </div>
            <div>
              <h3 id="change-password-title" className="text-base font-semibold text-[#112e20] dark:text-white leading-tight">
                Change Password
              </h3>
              <p className="text-xs text-[#727973] dark:text-[#97a59d] mt-0.5">
                Account credentials for <span className="font-semibold text-[#181d1b] dark:text-[#d3ded7]">{currentUser.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#727973] hover:text-[#181d1b] dark:text-[#97a59d] dark:hover:text-white rounded-lg hover:bg-[#eaefeb] dark:hover:bg-[#202e26] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* User Card Summary */}
        <div className="px-6 pt-5 pb-1">
          <div className="p-3 rounded-xl bg-[#f0f5f1] dark:bg-[#1b2620] border border-[#dfe4e0]/60 dark:border-[#2a3830] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#112e20] text-white flex items-center justify-center text-xs font-bold ring-2 ring-[#eaefeb]/40">
                {currentUser.initials}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#112e20] dark:text-white leading-tight">
                  {currentUser.name} ({currentUser.roleTitle})
                </span>
                <span className="text-[11px] text-[#727973] dark:text-[#9ca8a1]">
                  {currentUser.email}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#caead5] dark:bg-[#1c3a2b] text-[#112e20] dark:text-[#8ce2ad]">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
            <span className="material-symbols-outlined text-[18px] shrink-0 text-red-600 dark:text-red-400 mt-0.5">
              error
            </span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] dark:text-[#e1e7e3] mb-1.5" htmlFor="current-password">
              Current Password
            </label>
            <div className="relative">
              <input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-[#f0f5f1] dark:bg-[#1a2520] text-[#181d1b] dark:text-white text-sm outline-none border border-[#dfe4e0] dark:border-[#2d3a33] focus:border-[#9b4521] focus:ring-1 focus:ring-[#9b4521] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label="Toggle password visibility"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#727973] hover:text-[#181d1b] dark:hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showCurrent ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] dark:text-[#e1e7e3] mb-1.5" htmlFor="new-password">
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-[#f0f5f1] dark:bg-[#1a2520] text-[#181d1b] dark:text-white text-sm outline-none border border-[#dfe4e0] dark:border-[#2d3a33] focus:border-[#9b4521] focus:ring-1 focus:ring-[#9b4521] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                aria-label="Toggle password visibility"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#727973] hover:text-[#181d1b] dark:hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showNew ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] dark:text-[#e1e7e3] mb-1.5" htmlFor="confirm-new-password">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirm-new-password"
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-[#f0f5f1] dark:bg-[#1a2520] text-[#181d1b] dark:text-white text-sm outline-none border border-[#dfe4e0] dark:border-[#2d3a33] focus:border-[#9b4521] focus:ring-1 focus:ring-[#9b4521] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label="Toggle password visibility"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#727973] hover:text-[#181d1b] dark:hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showConfirm ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#eaefeb] dark:border-[#243029]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#424844] dark:text-[#a0aca4] hover:bg-[#eaefeb] dark:hover:bg-[#202e26] rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#9b4521] hover:bg-[#752906] rounded-full shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
