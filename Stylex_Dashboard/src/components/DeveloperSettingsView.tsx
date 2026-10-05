import React, { useState, useEffect, useMemo } from 'react';
import { SalonSettings, SlotCapacityConfig, UserAccount } from '../types';

const SALON_SLOTS = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
  '09:00 PM',
  '10:00 PM',
  '11:00 PM',
  '12:00 AM',
];

const DEFAULT_CONFIG: SlotCapacityConfig = {
  defaultGents: 3,
  defaultLadies: 3,
  slotOverrides: {},
};

interface DeveloperSettingsViewProps {
  settings: SalonSettings;
  slotCapacityConfig: SlotCapacityConfig;
  onSaveSlotCapacityConfig: (config: SlotCapacityConfig) => Promise<void>;
  onToggleMaintenanceMode: (enabled: boolean) => Promise<void>;
  currentUser: UserAccount;
}

export const DeveloperSettingsView: React.FC<DeveloperSettingsViewProps> = ({
  settings,
  slotCapacityConfig,
  onSaveSlotCapacityConfig,
  onToggleMaintenanceMode,
  currentUser,
}) => {
  const isDeveloper =
    currentUser?.role === 'Developer' ||
    currentUser?.username?.toLowerCase() === 'developer' ||
    currentUser?.email?.toLowerCase() === 'dev@stylexsalon.in';

  // Maintenance mode local state
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(Boolean(settings.maintenanceMode));
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState(false);

  useEffect(() => {
    setMaintenanceMode(Boolean(settings.maintenanceMode));
  }, [settings.maintenanceMode]);

  // Slot capacity config local state
  const [capacityConfig, setCapacityConfig] = useState<SlotCapacityConfig>(() => ({
    defaultGents: typeof slotCapacityConfig?.defaultGents === 'number' ? slotCapacityConfig.defaultGents : 3,
    defaultLadies: typeof slotCapacityConfig?.defaultLadies === 'number' ? slotCapacityConfig.defaultLadies : 3,
    slotOverrides: { ...(slotCapacityConfig?.slotOverrides || {}) },
  }));

  useEffect(() => {
    setCapacityConfig({
      defaultGents: typeof slotCapacityConfig?.defaultGents === 'number' ? slotCapacityConfig.defaultGents : 3,
      defaultLadies: typeof slotCapacityConfig?.defaultLadies === 'number' ? slotCapacityConfig.defaultLadies : 3,
      slotOverrides: { ...(slotCapacityConfig?.slotOverrides || {}) },
    });
  }, [slotCapacityConfig]);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Check if capacity config is dirty compared to props
  const isDirty = useMemo(() => {
    if (capacityConfig.defaultGents !== (slotCapacityConfig?.defaultGents ?? 3)) return true;
    if (capacityConfig.defaultLadies !== (slotCapacityConfig?.defaultLadies ?? 3)) return true;
    const currentOverrides = JSON.stringify(capacityConfig.slotOverrides || {});
    const propOverrides = JSON.stringify(slotCapacityConfig?.slotOverrides || {});
    return currentOverrides !== propOverrides;
  }, [capacityConfig, slotCapacityConfig]);

  const handleMaintenanceToggle = async () => {
    if (isTogglingMaintenance) return;
    setIsTogglingMaintenance(true);
    const next = !maintenanceMode;
    setMaintenanceMode(next);
    try {
      await onToggleMaintenanceMode(next);
    } finally {
      setIsTogglingMaintenance(false);
    }
  };

  const handleUpdateDefaultGents = (val: number) => {
    const safe = Math.max(0, Math.min(25, val));
    setCapacityConfig((prev) => ({ ...prev, defaultGents: safe }));
  };

  const handleUpdateDefaultLadies = (val: number) => {
    const safe = Math.max(0, Math.min(25, val));
    setCapacityConfig((prev) => ({ ...prev, defaultLadies: safe }));
  };

  const handleUpdateSlotCapacity = (
    timeSlot: string,
    gender: 'gents' | 'ladies',
    val: number
  ) => {
    const safe = Math.max(0, Math.min(25, val));
    setCapacityConfig((prev) => {
      const overrides = { ...(prev.slotOverrides || {}) };
      const currentSlot = { ...(overrides[timeSlot] || {}) };
      currentSlot[gender] = safe;

      // If both match default, remove override
      const defaultG = prev.defaultGents;
      const defaultL = prev.defaultLadies;
      const slotG = typeof currentSlot.gents === 'number' ? currentSlot.gents : defaultG;
      const slotL = typeof currentSlot.ladies === 'number' ? currentSlot.ladies : defaultL;

      if (slotG === defaultG && slotL === defaultL) {
        delete overrides[timeSlot];
      } else {
        overrides[timeSlot] = currentSlot;
      }

      return {
        ...prev,
        slotOverrides: overrides,
      };
    });
  };

  const handleResetSlotOverride = (timeSlot: string) => {
    setCapacityConfig((prev) => {
      const overrides = { ...(prev.slotOverrides || {}) };
      delete overrides[timeSlot];
      return { ...prev, slotOverrides: overrides };
    });
  };

  const handleResetAllOverrides = () => {
    setCapacityConfig((prev) => ({
      ...prev,
      slotOverrides: {},
    }));
  };

  const handleSetAllGents = (count: number) => {
    setCapacityConfig((prev) => ({
      ...prev,
      defaultGents: count,
      slotOverrides: Object.fromEntries(
        Object.entries(prev.slotOverrides || {}).map(([slot, cur]) => [
          slot,
          { ...cur, gents: count },
        ])
      ),
    }));
  };

  const handleSetAllLadies = (count: number) => {
    setCapacityConfig((prev) => ({
      ...prev,
      defaultLadies: count,
      slotOverrides: Object.fromEntries(
        Object.entries(prev.slotOverrides || {}).map(([slot, cur]) => [
          slot,
          { ...cur, ladies: count },
        ])
      ),
    }));
  };

  const handleDiscard = () => {
    setCapacityConfig({
      defaultGents: slotCapacityConfig?.defaultGents ?? 3,
      defaultLadies: slotCapacityConfig?.defaultLadies ?? 3,
      slotOverrides: { ...(slotCapacityConfig?.slotOverrides || {}) },
    });
  };

  const handleSave = async () => {
    if (!isDirty || saveStatus === 'saving') return;
    setSaveStatus('saving');
    try {
      await onSaveSlotCapacityConfig(capacityConfig);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1800);
    } catch {
      setSaveStatus('idle');
    }
  };

  if (!isDeveloper) {
    return (
      <div className="w-full max-w-4xl mx-auto p-12 text-center flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-[64px] text-rose-500">lock</span>
        <h2 className="text-2xl font-bold text-[#112e20] dark:text-white">Developer Access Required</h2>
        <p className="text-sm text-[#525a55] dark:text-neutral-400 max-w-md">
          This section contains low-level engine parameters, slot concurrency ceilings, and system maintenance controls. Only accounts with the <strong>DEVELOPER</strong> role have authorization.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#c2c8c2]/30">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#112e20] dark:text-white tracking-tight">
              Developer Settings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-600 text-white shadow-xs">
              DEVELOPER ONLY
            </span>
          </div>
          <p className="text-sm text-[#424844] dark:text-neutral-300 mt-1">
            Configure system maintenance mode, operational ceilings, and per-timeslot booking capacities per gender.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!isDirty || saveStatus !== 'idle'}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isDirty && saveStatus === 'idle'
                ? 'text-[#424844] dark:text-neutral-300 hover:bg-[#eaefeb] dark:hover:bg-white/10'
                : 'opacity-40 cursor-not-allowed text-[#8a928c]'
            }`}
          >
            Discard Changes
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || saveStatus === 'saving'}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              saveStatus === 'saved'
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : isDirty
                ? 'bg-[#112e20] hover:bg-[#185341] text-white shadow-[#112e20]/25'
                : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed shadow-none'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">
              {saveStatus === 'saving' ? 'refresh' : saveStatus === 'saved' ? 'check_circle' : 'save'}
            </span>
            <span>
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved Successfully!' : 'Save Capacities'}
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* 1. MAINTENANCE MODE SECTION */}
        <section className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white dark:from-amber-950/40 dark:via-[#16251d] dark:to-[#111e17] rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col gap-5 border-2 border-amber-500/40 dark:border-amber-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                <span className="material-symbols-outlined text-[22px]">engineering</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg text-[#112e20] dark:text-white font-bold tracking-tight">
                    Maintenance Mode
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-xs">
                    Live Toggle
                  </span>
                </div>
                <span className="text-xs text-[#424844] dark:text-neutral-300 mt-0.5">
                  Route client website to the static maintenance booking screen or full live booking engine
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  maintenanceMode
                    ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    maintenanceMode ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                  }`}
                />
                {maintenanceMode ? 'WEBSITE OFFLINE (MAINTENANCE)' : 'WEBSITE ONLINE & LIVE'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/90 dark:bg-white/5 border border-amber-500/20 backdrop-blur-xs">
            <div className="flex flex-col max-w-xl">
              <span className="text-sm font-semibold text-[#112e20] dark:text-white">
                Static Maintenance Booking Screen
              </span>
              <p className="text-xs text-[#525a55] dark:text-neutral-300 mt-1 leading-relaxed">
                When enabled, visitors to <strong>stylexsalon.in</strong> see a luxury branded maintenance view with the small header <strong>"For Booking"</strong>, direct <strong>Call</strong> & <strong>WhatsApp</strong> concierge triggers, and the interactive Google Map.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleMaintenanceToggle}
                disabled={isTogglingMaintenance}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 ${
                  maintenanceMode
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                    : 'bg-[#112e20] hover:bg-[#185341] text-white shadow-[#112e20]/20'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">
                  {maintenanceMode ? 'power_settings_new' : 'toggle_on'}
                </span>
                <span>
                  {isTogglingMaintenance
                    ? 'Synchronizing...'
                    : maintenanceMode
                    ? 'Disable Maintenance Mode'
                    : 'Enable Maintenance Mode'}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. TIME SLOT CAPACITY CONFIGURATION PER GENDER */}
        <section className="bg-white dark:bg-[#16251d] rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col gap-6 border border-[#c2c8c2]/40 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#c2c8c2]/30 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#112e20] dark:bg-emerald-800 text-white flex items-center justify-center shadow-md shrink-0">
                <span className="material-symbols-outlined text-[22px]">tune</span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-base sm:text-lg text-[#112e20] dark:text-white font-bold tracking-tight">
                  Slot Booking Capacity per Gender
                </h2>
                <span className="text-xs text-[#424844] dark:text-neutral-300 mt-0.5">
                  Set maximum concurrent customer bookings allowed in each 1-hour time slot separately for Gents and Ladies
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#525a55] dark:text-neutral-400">
                Active Overrides:
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#112e20]/10 dark:bg-white/10 text-[#112e20] dark:text-white">
                {Object.keys(capacityConfig.slotOverrides || {}).length} of 15 slots
              </span>
            </div>
          </div>

          {/* Global Defaults Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#f6faf7] dark:bg-white/5 border border-[#c2c8c2]/40 dark:border-white/10">
            {/* Gents Default */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#111e17] border border-[#c2c8c2]/30 dark:border-white/10 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">man</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#112e20] dark:text-white">Gents Default Capacity</h3>
                  <p className="text-xs text-[#525a55] dark:text-neutral-400">Fallback bookings per slot</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateDefaultGents(capacityConfig.defaultGents - 1)}
                  className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-700 dark:text-white flex items-center justify-center font-bold cursor-pointer transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min={0}
                  max={25}
                  value={capacityConfig.defaultGents}
                  onChange={(e) => handleUpdateDefaultGents(parseInt(e.target.value, 10) || 0)}
                  className="w-12 text-center py-1 text-sm font-bold text-[#112e20] dark:text-white bg-transparent border border-neutral-300 dark:border-white/20 rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateDefaultGents(capacityConfig.defaultGents + 1)}
                  className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-700 dark:text-white flex items-center justify-center font-bold cursor-pointer transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Ladies Default */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#111e17] border border-[#c2c8c2]/30 dark:border-white/10 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">woman</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#112e20] dark:text-white">Ladies Default Capacity</h3>
                  <p className="text-xs text-[#525a55] dark:text-neutral-400">Fallback bookings per slot</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateDefaultLadies(capacityConfig.defaultLadies - 1)}
                  className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-700 dark:text-white flex items-center justify-center font-bold cursor-pointer transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min={0}
                  max={25}
                  value={capacityConfig.defaultLadies}
                  onChange={(e) => handleUpdateDefaultLadies(parseInt(e.target.value, 10) || 0)}
                  className="w-12 text-center py-1 text-sm font-bold text-[#112e20] dark:text-white bg-transparent border border-neutral-300 dark:border-white/20 rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateDefaultLadies(capacityConfig.defaultLadies + 1)}
                  className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-700 dark:text-white flex items-center justify-center font-bold cursor-pointer transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Quick Bulk Presets Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap p-3 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
            <span className="text-xs font-semibold text-[#525a55] dark:text-neutral-300 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-amber-600">bolt</span>
              Quick Actions:
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleSetAllGents(4)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 hover:border-neutral-400 cursor-pointer"
              >
                Set All Gents = 4
              </button>
              <button
                type="button"
                onClick={() => handleSetAllLadies(4)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 hover:border-neutral-400 cursor-pointer"
              >
                Set All Ladies = 4
              </button>
              <button
                type="button"
                onClick={handleResetAllOverrides}
                className="px-2.5 py-1 text-xs font-medium rounded-lg text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 cursor-pointer"
              >
                Clear All Custom Overrides
              </button>
            </div>
          </div>

          {/* Slot Breakdown Table */}
          <div className="overflow-x-auto rounded-xl border border-[#c2c8c2]/40 dark:border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f0f5f1] dark:bg-white/5 text-[#112e20] dark:text-white uppercase font-bold text-[11px] tracking-wider border-b border-[#c2c8c2]/40 dark:border-white/10">
                <tr>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Gents Limit</th>
                  <th className="py-3 px-4">Ladies Limit</th>
                  <th className="py-3 px-4 text-center">Combined Max</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c2c8c2]/30 dark:divide-white/5">
                {SALON_SLOTS.map((slot) => {
                  const override = capacityConfig.slotOverrides?.[slot];
                  const hasOverride = Boolean(
                    override &&
                      (typeof override.gents === 'number' || typeof override.ladies === 'number')
                  );

                  const gentsVal =
                    override && typeof override.gents === 'number'
                      ? override.gents
                      : capacityConfig.defaultGents;
                  const ladiesVal =
                    override && typeof override.ladies === 'number'
                      ? override.ladies
                      : capacityConfig.defaultLadies;

                  const isGentsOverridden = override && typeof override.gents === 'number';
                  const isLadiesOverridden = override && typeof override.ladies === 'number';
                  const total = gentsVal + ladiesVal;

                  return (
                    <tr
                      key={slot}
                      className={`hover:bg-[#fcfdfc] dark:hover:bg-white/5 transition-colors ${
                        hasOverride ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      {/* Slot Name */}
                      <td className="py-3 px-4 font-bold text-[#112e20] dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-amber-600">
                            schedule
                          </span>
                          <span>{slot}</span>
                        </div>
                      </td>

                      {/* Gents Stepper */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateSlotCapacity(slot, 'gents', gentsVal - 1)}
                            className="w-7 h-7 rounded bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-800 dark:text-white flex items-center justify-center font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span
                            className={`w-8 text-center font-bold ${
                              isGentsOverridden ? 'text-sky-600 dark:text-sky-400 font-extrabold' : 'text-[#112e20] dark:text-white'
                            }`}
                          >
                            {gentsVal}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateSlotCapacity(slot, 'gents', gentsVal + 1)}
                            className="w-7 h-7 rounded bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-800 dark:text-white flex items-center justify-center font-bold cursor-pointer"
                          >
                            +
                          </button>
                          {isGentsOverridden && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">
                              Custom
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Ladies Stepper */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateSlotCapacity(slot, 'ladies', ladiesVal - 1)}
                            className="w-7 h-7 rounded bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-800 dark:text-white flex items-center justify-center font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span
                            className={`w-8 text-center font-bold ${
                              isLadiesOverridden ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-[#112e20] dark:text-white'
                            }`}
                          >
                            {ladiesVal}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateSlotCapacity(slot, 'ladies', ladiesVal + 1)}
                            className="w-7 h-7 rounded bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-800 dark:text-white flex items-center justify-center font-bold cursor-pointer"
                          >
                            +
                          </button>
                          {isLadiesOverridden && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
                              Custom
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Combined Max */}
                      <td className="py-3 px-4 text-center font-bold text-[#112e20] dark:text-white">
                        <span className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-white/10 text-xs font-extrabold">
                          {total}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        {hasOverride ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300">
                            Custom Overridden
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-neutral-500">
                            Default Fallback
                          </span>
                        )}
                      </td>

                      {/* Reset Action */}
                      <td className="py-3 px-4 text-right">
                        {hasOverride && (
                          <button
                            type="button"
                            onClick={() => handleResetSlotOverride(slot)}
                            className="text-[11px] font-semibold text-neutral-500 hover:text-rose-600 cursor-pointer transition-colors"
                          >
                            Reset
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
