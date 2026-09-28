import React, { useState, useEffect, useMemo } from 'react';
import { SalonSettings, UserAccount } from '../types';
import { WhatsAppQRControl } from './WhatsAppQRControl';
import { getRolePermissions } from '../utils/permissions';

interface SettingsViewProps {
  settings: SalonSettings;
  onSave: (newSettings: SalonSettings) => void;
  onToggleDarkMode?: (enabled: boolean) => void;
  onToggleMaintenanceMode?: (enabled: boolean) => void;
  users: UserAccount[];
  currentUser: UserAccount;
  onAddUser: () => void;
  onEditUser: (user: UserAccount) => void;
  onDeleteUser: (userId: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSave,
  onToggleDarkMode,
  onToggleMaintenanceMode,
  users,
  currentUser,
  onAddUser,
  onEditUser,
  onDeleteUser,
}) => {
  const permissions = useMemo(() => getRolePermissions(currentUser?.role || 'Normal User'), [currentUser?.role]);
  const isSettingsDisabled = !permissions.canEditSettings;
  const isDeveloper = currentUser?.role === 'Developer' || currentUser?.username === 'developer';
  const visibleUsers = useMemo(() => (Array.isArray(users) ? users.filter((u) => !u.isSecret) : []), [users]);

  const [formData, setFormData] = useState<SalonSettings>({ ...settings });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);

  // Synchronize formData when external settings change (e.g. initial load or after save)
  useEffect(() => {
    setFormData((prev) => {
      const isCurrentlyDirty =
        prev.salonName !== settings.salonName ||
        prev.phone !== settings.phone ||
        prev.email !== settings.email ||
        prev.address !== settings.address ||
        Boolean(prev.reschedulePolicy24h) !== Boolean(settings.reschedulePolicy24h) ||
        Boolean(prev.smsWhatsappReminders) !== Boolean(settings.smsWhatsappReminders) ||
        Boolean(prev.emailCalendarInvites) !== Boolean(settings.emailCalendarInvites) ||
        Boolean(prev.maintenanceMode) !== Boolean(settings.maintenanceMode);

      if (isCurrentlyDirty) {
        return { ...prev, darkMode: settings.darkMode };
      }
      return { ...settings };
    });
  }, [settings]);

  const isDirty = useMemo(() => {
    return (
      formData.salonName !== settings.salonName ||
      formData.phone !== settings.phone ||
      formData.email !== settings.email ||
      formData.address !== settings.address ||
      Boolean(formData.reschedulePolicy24h) !== Boolean(settings.reschedulePolicy24h) ||
      Boolean(formData.smsWhatsappReminders) !== Boolean(settings.smsWhatsappReminders) ||
      Boolean(formData.emailCalendarInvites) !== Boolean(settings.emailCalendarInvites) ||
      Boolean(formData.darkMode) !== Boolean(settings.darkMode) ||
      Boolean(formData.whatsappBotConnected) !== Boolean(settings.whatsappBotConnected) ||
      Boolean(formData.maintenanceMode) !== Boolean(settings.maintenanceMode)
    );
  }, [formData, settings]);

  const handleDiscard = () => {
    setFormData({ ...settings });
    if (onToggleDarkMode && settings.darkMode !== formData.darkMode) {
      onToggleDarkMode(Boolean(settings.darkMode));
    }
  };

  const handleSave = () => {
    if (!isDirty || saveStatus === 'saving') return;
    setSaveStatus('saving');
    setTimeout(() => {
      onSave(formData);
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 1600);
    }, 450);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 pb-16 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#c2c8c2]/30">
        <div className="flex flex-col">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#112e20] dark:text-white tracking-tight">
            Admin Settings
          </h1>
          <p className="text-sm text-[#424844] dark:text-neutral-300 mt-1">
            Manage core salon profile, booking policy, and automated guest reminders.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap justify-end">
          {/* Developer-Only Maintenance Mode Button */}
          {isDeveloper && (
            <button
              type="button"
              onClick={() => {
                const nextState = !Boolean(formData.maintenanceMode);
                setFormData((prev) => ({ ...prev, maintenanceMode: nextState }));
                if (onToggleMaintenanceMode) {
                  onToggleMaintenanceMode(nextState);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 shadow-sm cursor-pointer border ${
                formData.maintenanceMode
                  ? 'bg-rose-600 text-white border-rose-500 shadow-rose-600/30 hover:bg-rose-700 animate-pulse'
                  : 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/40 hover:bg-amber-500/25'
              }`}
              title="Click to toggle Client Site Maintenance Mode"
            >
              <span className="material-symbols-outlined text-[18px]">
                {formData.maintenanceMode ? 'engineering' : 'build'}
              </span>
              <span>
                Maintenance Mode: <strong>{formData.maintenanceMode ? 'ACTIVE' : 'OFF'}</strong>
              </span>
            </button>
          )}

          {/* Discard Button (animated in/out) */}
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!isDirty || saveStatus !== 'idle'}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
              isDirty && saveStatus === 'idle'
                ? 'opacity-100 translate-x-0 text-[#424844] dark:text-neutral-300 hover:bg-[#eaefeb] dark:hover:bg-white/10 hover:text-[#181d1b] dark:hover:text-white'
                : 'opacity-0 translate-x-2 pointer-events-none'
            }`}
          >
            Discard
          </button>

          {/* Dynamic Save Changes Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || saveStatus === 'saving' || isSettingsDisabled}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 shadow-xs overflow-hidden select-none ${
              saveStatus === 'saved'
                ? 'bg-emerald-600 text-white shadow-emerald-600/30 scale-102 cursor-default'
                : saveStatus === 'saving'
                ? 'bg-[#9b4521] text-white opacity-90 cursor-wait'
                : isDirty && !isSettingsDisabled
                ? 'bg-gradient-to-r from-[#9b4521] via-[#aa4d26] to-[#b85429] hover:from-[#843717] hover:to-[#9b4521] text-white shadow-lg shadow-[#9b4521]/30 hover:shadow-xl hover:shadow-[#9b4521]/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ring-2 ring-[#9b4521]/20 animate-[pulse-subtle_2.8s_infinite]'
                : 'bg-[#f0f5f1] dark:bg-white/5 text-[#727973] dark:text-neutral-400 border border-[#c2c8c2]/40 dark:border-white/10 cursor-not-allowed opacity-75'
            }`}
          >
            {/* Shimmer effect when dirty */}
            {isDirty && saveStatus === 'idle' && (
              <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            )}

            {saveStatus === 'saving' ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Saving...</span>
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <span className="material-symbols-outlined text-[18px] text-white animate-in zoom-in-75 duration-200">
                  check_circle
                </span>
                <span>Saved!</span>
              </>
            ) : isDirty ? (
              <>
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                </span>
                <span className="material-symbols-outlined text-[18px] text-white">save</span>
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[17px] text-emerald-600 dark:text-emerald-400">
                  check
                </span>
                <span>All Changes Saved</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-3xl flex flex-col gap-6">
        {/* Developer Exclusive: Maintenance Mode Card */}
        {isDeveloper && (
          <section className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white dark:from-amber-950/40 dark:via-[#16251d] dark:to-[#111e17] rounded-2xl p-6 shadow-sm flex flex-col gap-5 border-2 border-amber-500/40 dark:border-amber-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                  <span className="material-symbols-outlined text-[22px]">engineering</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base text-[#112e20] dark:text-white font-bold tracking-tight">
                      Maintenance Mode
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-xs">
                      Developer Control
                    </span>
                  </div>
                  <span className="text-xs text-[#424844] dark:text-neutral-300 mt-0.5">
                    Toggle client website between full live booking and static maintenance page
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    formData.maintenanceMode
                      ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      formData.maintenanceMode ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                    }`}
                  />
                  {formData.maintenanceMode ? 'WEBSITE OFFLINE (MAINTENANCE)' : 'WEBSITE ONLINE & LIVE'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/90 dark:bg-white/5 border border-amber-500/20 backdrop-blur-xs">
              <div className="flex flex-col max-w-xl">
                <span className="text-sm font-semibold text-[#112e20] dark:text-white">
                  Static Maintenance Booking Page
                </span>
                <p className="text-xs text-[#525a55] dark:text-neutral-300 mt-1 leading-relaxed">
                  When enabled, all visitors to the client website are presented with a luxury branded maintenance screen. It displays the small title <strong>"For Booking"</strong>, direct <strong>Call</strong> & <strong>WhatsApp</strong> buttons, and the interactive salon location map.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const next = !Boolean(formData.maintenanceMode);
                    setFormData((prev) => ({ ...prev, maintenanceMode: next }));
                    if (onToggleMaintenanceMode) {
                      onToggleMaintenanceMode(next);
                    }
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 ${
                    formData.maintenanceMode
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                      : 'bg-[#112e20] hover:bg-[#185341] text-white shadow-[#112e20]/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {formData.maintenanceMode ? 'power_settings_new' : 'toggle_on'}
                  </span>
                  <span>{formData.maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}</span>
                </button>
              </div>
            </div>
          </section>
        )}
        {/* Appearance & Interface Theme */}
        <section className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4 border border-[#c2c8c2]/30">
          <div className="flex items-center gap-3 pb-2 border-b border-[#c2c8c2]/30">
            <span className="material-symbols-outlined text-[#112e20] text-[22px]">palette</span>
            <div className="flex flex-col">
              <h2 className="text-base text-[#112e20] font-semibold">Appearance & Display</h2>
              <span className="text-xs text-[#424844]">
                Interface themes and visual presentation mode
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-1">
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#f0f5f1] transition-colors">
              <div className="flex items-center gap-3.5 pr-4">
                <div className="w-10 h-10 rounded-full bg-white text-[#112e20] flex items-center justify-center shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[22px]">
                    {formData.darkMode ? 'dark_mode' : 'light_mode'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#112e20] font-semibold flex items-center gap-2">
                    <span>Dark Mode</span>
                    {formData.darkMode && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#caead5] text-[#042014] dark:bg-[#143e26] dark:text-[#86efac]">
                        Active
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-[#424844] mt-0.5">
                    Toggle dark aesthetic theme across the admin dashboard workspace
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const updated = !formData.darkMode;
                  setFormData({ ...formData, darkMode: updated });
                  if (onToggleDarkMode) onToggleDarkMode(updated);
                }}
                aria-label="Toggle Dark Mode"
                className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer shrink-0 ${
                  formData.darkMode ? 'bg-[#112e20] justify-end' : 'bg-[#c2c8c2] justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-sm"></span>
              </button>
            </div>
          </div>
        </section>

        {/* Salon Details */}
        <section className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4 border border-[#c2c8c2]/30">
          <div className="flex items-center gap-3 pb-2 border-b border-[#c2c8c2]/30">
            <span className="material-symbols-outlined text-[#112e20] text-[22px]">storefront</span>
            <div className="flex flex-col">
              <h2 className="text-base text-[#112e20] font-semibold">Salon Details</h2>
              <span className="text-xs text-[#424844]">
                Visible on booking receipts and confirmations
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs text-[#181d1b] dark:text-neutral-200 font-medium">Salon Name</label>
              <input
                disabled={isSettingsDisabled}
                value={formData.salonName}
                onChange={(e) => setFormData({ ...formData, salonName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#f0f5f1] dark:bg-[#1a2520] border border-[#c2c8c2]/30 dark:border-white/10 text-[#181d1b] dark:text-white text-sm focus:bg-white dark:focus:bg-[#202e26] focus:ring-1 focus:ring-[#112e20] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                type="text"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#181d1b] dark:text-neutral-200 font-medium">Phone Number</label>
              <input
                disabled={isSettingsDisabled}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#f0f5f1] dark:bg-[#1a2520] border border-[#c2c8c2]/30 dark:border-white/10 text-[#181d1b] dark:text-white text-sm focus:bg-white dark:focus:bg-[#202e26] focus:ring-1 focus:ring-[#112e20] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                type="text"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#181d1b] dark:text-neutral-200 font-medium">Concierge Email</label>
              <input
                disabled={isSettingsDisabled}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#f0f5f1] dark:bg-[#1a2520] border border-[#c2c8c2]/30 dark:border-white/10 text-[#181d1b] dark:text-white text-sm focus:bg-white dark:focus:bg-[#202e26] focus:ring-1 focus:ring-[#112e20] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                type="email"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs text-[#181d1b] dark:text-neutral-200 font-medium">Address</label>
              <input
                disabled={isSettingsDisabled}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#f0f5f1] dark:bg-[#1a2520] border border-[#c2c8c2]/30 dark:border-white/10 text-[#181d1b] dark:text-white text-sm focus:bg-white dark:focus:bg-[#202e26] focus:ring-1 focus:ring-[#112e20] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                type="text"
              />
            </div>
          </div>
        </section>

        {/* Booking Policy */}
        <section className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4 border border-[#c2c8c2]/30">
          <div className="flex items-center gap-3 pb-2 border-b border-[#c2c8c2]/30">
            <span className="material-symbols-outlined text-[#112e20] text-[22px]">lock_clock</span>
            <div className="flex flex-col">
              <h2 className="text-base text-[#112e20] font-semibold">Booking Policy</h2>
              <span className="text-xs text-[#424844]">
                Client cancellation and rescheduling parameters
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-1">
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#f0f5f1]">
              <div className="flex flex-col pr-4">
                <span className="text-[13px] text-[#112e20] font-semibold">
                  24h Reschedule & Cancellation Policy
                </span>
                <span className="text-xs text-[#424844] mt-0.5">
                  Complimentary changes and cancellations up to 24 hours prior to appointment time.
                </span>
              </div>
              <button
                type="button"
                disabled={isSettingsDisabled}
                onClick={() =>
                  !isSettingsDisabled &&
                  setFormData({
                    ...formData,
                    reschedulePolicy24h: !formData.reschedulePolicy24h,
                  })
                }
                aria-label="Toggle 24h Reschedule Policy"
                className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors ${
                  isSettingsDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  formData.reschedulePolicy24h ? 'bg-[#112e20] justify-end' : 'bg-[#c2c8c2] justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-sm"></span>
              </button>
            </div>
          </div>
        </section>

        {/* Staff & Operator Accounts */}
        <section className="bg-white dark:bg-[#15201a] rounded-xl p-6 shadow-sm flex flex-col gap-4 border border-[#c2c8c2]/30 dark:border-white/10 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#c2c8c2]/30 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#112e20] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-base text-[#112e20] dark:text-white font-semibold flex items-center gap-2">
                  <span>Staff & Operator Accounts</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eaefeb] dark:bg-white/10 text-[#112e20] dark:text-white">
                    {visibleUsers.length} {visibleUsers.length === 1 ? 'Account' : 'Accounts'}
                  </span>
                </h2>
                <span className="text-xs text-[#424844] dark:text-neutral-400">
                  Provision login credentials, manage system roles and outlet privileges
                </span>
              </div>
            </div>

            {permissions.canAddUsers && (
              <button
                type="button"
                onClick={onAddUser}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#112e20] text-white hover:bg-[#1b4330] text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                <span>Add User</span>
              </button>
            )}
          </div>

          <div className="divide-y divide-[#eaefeb] dark:divide-white/5">
            {visibleUsers.map((u) => {
              const isCurrent = u.id === currentUser.id;
              const isDefaultAdmin = u.email === 'admin@stylexsalon.in' || u.username === 'admin';

              return (
                <div
                  key={u.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-1 last:pb-1"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#112e20] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ring-2 ring-[#eaefeb] dark:ring-white/10">
                      {u.initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#112e20] dark:text-white truncate">
                          {u.name}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#caead5] text-[#0f3d23]">
                            You
                          </span>
                        )}
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#f0f5f1] dark:bg-white/10 text-[#55635c] dark:text-neutral-300">
                          {u.role}
                        </span>
                      </div>
                      <span className="text-xs text-[#727973] dark:text-neutral-400 truncate">
                        {u.email} • <span className="text-[#9b4521] dark:text-[#d97746] font-medium">{u.roleTitle}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    {permissions.canEditUsers && (
                      <button
                        type="button"
                        onClick={() => onEditUser(u)}
                        className="w-8 h-8 rounded-xl border border-[#c2c8c2]/50 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-[#eaefeb] dark:hover:bg-white/10 text-[#424844] dark:text-neutral-200 hover:text-[#112e20] dark:hover:text-white flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                        title={isCurrent ? "Edit Your Profile & Password" : "Edit User Profile"}
                      >
                        <span className="material-symbols-outlined text-[17px] text-current">edit</span>
                      </button>
                    )}
                    {!isDefaultAdmin && !isCurrent && permissions.canDeleteUsers && (
                      <button
                        type="button"
                        onClick={() => setUserToDelete(u)}
                        className="w-8 h-8 rounded-xl border border-[#c2c8c2]/50 dark:border-white/10 bg-white dark:bg-white/5 text-[#424844] dark:text-neutral-300 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer btn-delete-action"
                        title="Delete User Account"
                      >
                        <span className="material-symbols-outlined text-[17px] text-current">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Notifications */}
        <section className={`bg-white dark:bg-[#15201a] rounded-xl p-6 shadow-sm flex flex-col gap-4 border border-[#c2c8c2]/30 dark:border-white/10 transition-colors ${isSettingsDisabled ? 'opacity-70' : ''}`}>
          <div className="flex items-center gap-3 pb-2 border-b border-[#c2c8c2]/30 dark:border-white/10">
            <span className="material-symbols-outlined text-[#112e20] dark:text-white text-[22px]">
              mark_chat_read
            </span>
            <div className="flex flex-col">
              <h2 className="text-base text-[#112e20] dark:text-white font-semibold">Notifications</h2>
              <span className="text-xs text-[#424844] dark:text-neutral-400">
                Automated client reminders and calendar sync
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-1">
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#f0f5f1] dark:bg-white/5">
              <div className="flex flex-col pr-4">
                <span className="text-[13px] text-[#112e20] dark:text-white font-semibold">
                  WhatsApp & SMS Reminders
                </span>
                <span className="text-xs text-[#424844] dark:text-neutral-400 mt-0.5">
                  Send 24-hour appointment reminder and directions via SMS and WhatsApp.
                </span>
              </div>
              <button
                type="button"
                disabled={isSettingsDisabled}
                onClick={() =>
                  setFormData({
                    ...formData,
                    smsWhatsappReminders: !formData.smsWhatsappReminders,
                  })
                }
                aria-label="Toggle WhatsApp & SMS Reminders"
                className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors ${
                  isSettingsDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  formData.smsWhatsappReminders ? 'bg-[#112e20] justify-end' : 'bg-[#c2c8c2] dark:bg-white/20 justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-sm"></span>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-[#f0f5f1] dark:bg-white/5">
              <div className="flex flex-col pr-4">
                <span className="text-[13px] text-[#112e20] dark:text-white font-semibold">
                  Email Calendar Invites
                </span>
                <span className="text-xs text-[#424844] dark:text-neutral-400 mt-0.5">
                  Attach .ics calendar invite to booking confirmation email.
                </span>
              </div>
              <button
                type="button"
                disabled={isSettingsDisabled}
                onClick={() =>
                  setFormData({
                    ...formData,
                    emailCalendarInvites: !formData.emailCalendarInvites,
                  })
                }
                aria-label="Toggle Email Calendar Invites"
                className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors ${
                  isSettingsDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  formData.emailCalendarInvites ? 'bg-[#112e20] justify-end' : 'bg-[#c2c8c2] dark:bg-white/20 justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-sm"></span>
              </button>
            </div>
          </div>
        </section>

        {/* WhatsApp Bot Gateway & QR Pairing Section */}
        <WhatsAppQRControl
          isConnected={Boolean(formData.whatsappBotConnected ?? true)}
          connectedPhone={formData.whatsappBotPhone || '+91 96561 11149'}
          disabled={isSettingsDisabled}
          onToggleConnected={(connected) =>
            setFormData({
              ...formData,
              whatsappBotConnected: connected,
            })
          }
        />
      </div>

      {/* Floating Bottom Save Bar for when user scrolls down */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
          isDirty && !isSettingsDisabled
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-[#15201a]/95 backdrop-blur-md border border-[#c2c8c2]/50 dark:border-white/15 shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
          <div className="flex items-center gap-2 pr-3 border-r border-[#c2c8c2]/40 dark:border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-xs font-semibold text-[#112e20] dark:text-neutral-200 whitespace-nowrap">
              Careful — you have unsaved changes
            </span>
          </div>

          <button
            type="button"
            onClick={handleDiscard}
            disabled={saveStatus !== 'idle'}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#424844] dark:text-neutral-300 hover:bg-[#eaefeb] dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white transition-all shadow-md cursor-pointer ${
              saveStatus === 'saved'
                ? 'bg-emerald-600'
                : saveStatus === 'saving'
                ? 'bg-[#9b4521] opacity-90 cursor-wait'
                : 'bg-gradient-to-r from-[#9b4521] to-[#b85429] hover:from-[#843717] hover:to-[#9b4521] hover:scale-102 active:scale-98 shadow-sm'
            }`}
          >
            {saveStatus === 'saving' ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Saving...</span>
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                <span>Saved!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[15px]">save</span>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* In-UI Confirmation Dialog for User Deletion */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white dark:bg-[#15201a] rounded-2xl shadow-2xl w-full max-w-md border border-[#c2c8c2]/40 dark:border-white/10 p-6 overflow-hidden animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[26px]">person_remove</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-[#112e20] dark:text-white leading-tight">
                  Delete User Account?
                </h3>
                <p className="text-xs text-[#526058] dark:text-[#a0aca4] mt-2 leading-relaxed">
                  Are you sure you want to permanently delete the user account for <span className="font-bold text-[#112e20] dark:text-white">{userToDelete.name}</span> ({userToDelete.username ? '@' + userToDelete.username : userToDelete.email})?
                </p>
                <div className="mt-2.5 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-[11px] text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] shrink-0 text-rose-600 dark:text-rose-400">warning</span>
                  <span>This action cannot be undone and will revoke all access for this user immediately.</span>
                </div>

                <div className="flex items-center gap-2.5 mt-5 justify-end">
                  <button
                    type="button"
                    onClick={() => setUserToDelete(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#424844] dark:text-[#a0aca4] hover:bg-[#eaefeb] dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const id = userToDelete.id;
                      setUserToDelete(null);
                      onDeleteUser(id);
                    }}
                    className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Yes, Delete User</span>
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
