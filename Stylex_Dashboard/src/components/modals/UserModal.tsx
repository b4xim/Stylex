import React, { useState, useEffect } from 'react';
import { UserAccount, SystemRole } from '../../types';

interface UserModalProps {
  isOpen: boolean;
  user?: UserAccount | null;
  onClose: () => void;
  onSave: (user: UserAccount) => { success: boolean; message?: string };
  existingEmails: string[];
}

const DEFAULT_TITLES: Record<SystemRole, string> = {
  Admin: 'Salon Administrator',
  Developer: 'Lead Developer & Tech',
  Manager: 'Salon Floor Manager',
  Staff: 'Front Desk & Floor Staff',
  'Normal User': 'Front Desk & Floor Staff',
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return 'US';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave,
  existingEmails,
}) => {
  const isEdit = !!user;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<SystemRole>('Manager');
  const [roleTitle, setRoleTitle] = useState('Salon Floor Manager');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setRoleTitle(user.roleTitle);
      setPassword('');
      setErrorMessage('');
    } else {
      setName('');
      setEmail('');
      setRole('Manager');
      setRoleTitle(DEFAULT_TITLES['Manager']);
      setPassword('');
      setErrorMessage('');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleRoleChange = (newRole: SystemRole) => {
    setRole(newRole);
    // If the title was standard, update it to the new role default
    setRoleTitle(DEFAULT_TITLES[newRole]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter the user’s full name.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Check duplicate email
    const duplicate = existingEmails.some(
      (e) => e.toLowerCase() === cleanEmail && (!user || user.email.toLowerCase() !== cleanEmail)
    );
    if (duplicate) {
      setErrorMessage('An account with this email address already exists.');
      return;
    }

    if (!isEdit && (!password || password.length < 6)) {
      setErrorMessage('Please enter a secure password of at least 6 characters.');
      return;
    }

    if (isEdit && password && password.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }

    const userPayload: UserAccount = {
      id: user?.id ?? `user_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role,
      roleTitle: roleTitle.trim() || DEFAULT_TITLES[role],
      initials: getInitials(name),
      password: password ? password : (user?.password ?? 'stylex2024'),
      createdAt: user?.createdAt ?? new Date().toISOString().split('T')[0],
    };

    const res = onSave(userPayload);
    if (res.success) {
      onClose();
    } else if (res.message) {
      setErrorMessage(res.message);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] dark:bg-[#192620] text-[#181d1b] dark:text-white text-sm border border-[#c2c8c2]/30 dark:border-[#2b3a32] outline-none focus:ring-2 focus:ring-[#9b4521] focus:border-transparent transition-all placeholder:text-[#727973] dark:placeholder:text-[#6a7c73]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#15201a] rounded-2xl shadow-2xl w-full max-w-lg border border-[#c2c8c2]/30 dark:border-[#2a3830] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#eaefeb] dark:border-[#243029] flex items-center justify-between bg-[#f8faf8] dark:bg-[#111b16]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#112e20] dark:bg-[#1d3527] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">
                {isEdit ? 'manage_accounts' : 'person_add'}
              </span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#112e20] dark:text-white">
                {isEdit ? `Edit User • ${user?.name}` : 'Add New Staff Account'}
              </h3>
              <p className="text-xs text-[#727973] dark:text-[#8d9c94]">
                {isEdit ? 'Update account details and access credentials' : 'Provision a new operator for the Tirur Outlet'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#727973] hover:text-[#181d1b] dark:text-[#8d9c94] dark:hover:text-white p-1 rounded-lg hover:bg-[#eaefeb] dark:hover:bg-[#1d2a23] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
            <span className="material-symbols-outlined text-[18px] shrink-0 text-red-600 dark:text-red-400">
              error
            </span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#181d1b] dark:text-[#d3ded8] mb-1.5">
                Full Name *
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pooja Nair"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#181d1b] dark:text-[#d3ded8] mb-1.5">
                Email Address *
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pooja@stylexsalon.in"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#181d1b] dark:text-[#d3ded8] mb-1.5">
                Access Role *
              </label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as SystemRole)}
                className={inputClass}
              >
                <option value="Admin">Admin (Full Access)</option>
                <option value="Developer">Developer (Full Access)</option>
                <option value="Manager">Manager (Operations - Restricted Settings & Stylists)</option>
                <option value="Staff">Staff (View Only - No Edit/Delete)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#181d1b] dark:text-[#d3ded8] mb-1.5">
                Role Title (Display)
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Salon Floor Manager"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#181d1b] dark:text-[#d3ded8]">
                {isEdit ? 'Change Password (leave blank to keep current)' : 'Account Password *'}
              </label>
              <button
                type="button"
                onClick={() => {
                  const randomPass = 'stylex' + Math.floor(1000 + Math.random() * 9000);
                  setPassword(randomPass);
                  setShowPassword(true);
                }}
                className="text-[11px] text-[#9b4521] dark:text-[#ff9266] hover:underline cursor-pointer"
              >
                Generate Password
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEdit ? '••••••••••••' : 'Minimum 6 characters'}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#727973] hover:text-[#181d1b] dark:hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Footer buttons */}
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
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#9b4521] hover:bg-[#752906] rounded-full shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>{isEdit ? 'Update Account' : 'Create User Account'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
