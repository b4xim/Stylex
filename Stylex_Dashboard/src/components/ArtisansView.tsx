import React, { useState, useEffect } from 'react';
import { Stylist, StylistLeave, UserAccount } from '../types';
import { getRolePermissions } from '../utils/permissions';

interface ArtisansViewProps {
  stylists: Stylist[];
  stylistLeaves: StylistLeave[];
  onOpenNewBookingWithStylist: (stylistId: string) => void;
  onOpenScheduleLeave: (stylistId?: string) => void;
  onDeleteLeave: (leaveId: string) => void;
  onAddStylist: () => void;
  onEditStylist: (stylist: Stylist) => void;
  onDeleteStylist: (id: string) => void;
  globalSearchQuery?: string;
  currentUser?: UserAccount;
}

export const ArtisansView: React.FC<ArtisansViewProps> = ({
  stylists,
  stylistLeaves,
  onOpenNewBookingWithStylist,
  onOpenScheduleLeave,
  onDeleteLeave,
  onAddStylist,
  onEditStylist,
  onDeleteStylist,
  globalSearchQuery = '',
  currentUser,
}) => {
  const permissions = getRolePermissions(currentUser?.role);
  const [localSearch, setLocalSearch] = useState('');
  const [artisanList, setArtisanList] = useState<Stylist[]>(stylists);
  const [leaveFilter, setLeaveFilter] = useState<'ALL' | 'FULL_DAY' | 'HALF_DAY'>('ALL');
  const [stylistToDelete, setStylistToDelete] = useState<Stylist | null>(null);

  useEffect(() => {
    setArtisanList(stylists);
  }, [stylists]);

  const effectiveSearch = (globalSearchQuery || localSearch).toLowerCase().trim();

  const filtered = artisanList.filter((s) => {
    if (!effectiveSearch) return true;
    return (
      s.name.toLowerCase().includes(effectiveSearch) ||
      s.role.toLowerCase().includes(effectiveSearch) ||
      s.station.toLowerCase().includes(effectiveSearch)
    );
  });

  const toggleAvailability = (id: string) => {
    setArtisanList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isAvailableToday: !s.isAvailableToday } : s))
    );
  };

  const filteredLeaves = stylistLeaves.filter((l) => {
    if (leaveFilter === 'FULL_DAY') return l.duration === 'FULL_DAY';
    if (leaveFilter === 'HALF_DAY') return l.duration === 'FIRST_HALF' || l.duration === 'SECOND_HALF';
    return true;
  });

  const getDurationBadge = (duration: StylistLeave['duration']) => {
    switch (duration) {
      case 'FULL_DAY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ffdad6] dark:bg-[#3d1414] text-[#ba1a1a] dark:text-[#fca5a5] border border-transparent dark:border-[#fca5a5]/20">
            <span className="material-symbols-outlined text-[13px]">event_busy</span>
            Full Day Off
          </span>
        );
      case 'FIRST_HALF':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ffe088]/60 dark:bg-[#3d3210] text-[#735c00] dark:text-[#fde047] border border-transparent dark:border-[#fde047]/20">
            <span className="material-symbols-outlined text-[13px]">wb_sunny</span>
            Half Day • Morning (10 AM – 4:30 PM)
          </span>
        );
      case 'SECOND_HALF':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ffe088]/60 dark:bg-[#3d3210] text-[#735c00] dark:text-[#fde047] border border-transparent dark:border-[#fde047]/20">
            <span className="material-symbols-outlined text-[13px]">bedtime</span>
            Half Day • Evening (4:30 PM – 1 AM)
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c2c8c2]/30 dark:border-white/10 pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#112e20] dark:text-white tracking-tight">
            Artisans & Stylists
          </h1>
          <p className="text-sm text-[#424844] dark:text-[#a0aca4] mt-1">
            Master colorists, skin specialists, and hair artisans at StyleX Tirur Outlet.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
          {permissions.canEditStylists && (
            <button
              onClick={onAddStylist}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#112e20] dark:bg-[#1f3a2c] hover:bg-[#9b4521] text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>+ Add Stylist</span>
            </button>
          )}
          {permissions.canManageStylistLeaves && (
            <button
              onClick={() => onOpenScheduleLeave()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eaefeb] dark:bg-[#1f2d25] text-[#112e20] dark:text-[#caead5] hover:bg-[#112e20] hover:text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer border border-transparent dark:border-white/10"
            >
              <span className="material-symbols-outlined text-[18px]">person_off</span>
              <span>Schedule Leave</span>
            </button>
          )}

          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#424844] dark:text-[#88998f] text-[18px]">
              search
            </span>
            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-[#192720] text-[#181d1b] dark:text-white placeholder:text-[#424844] dark:placeholder:text-[#7d9085] text-sm outline-none shadow-xs border border-[#c2c8c2]/30 dark:border-[#2a3c31] focus:ring-1 focus:ring-[#112e20] dark:focus:ring-[#caead5]"
              placeholder="Search stylists..."
            />
          </div>
        </div>
      </div>

      {/* 1. Stylists Rendered as Horizontal Rows */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#727973] font-label-caps">
            Active Artisans & Stylists ({filtered.length})
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-[#15201a] rounded-2xl p-12 text-center border border-[#c2c8c2]/30 dark:border-white/10">
            <span className="material-symbols-outlined text-4xl text-[#c2c8c2] dark:text-[#424844]">person_search</span>
            <p className="text-sm font-semibold text-[#181d1b] dark:text-white mt-2">No stylists match your search</p>
            <p className="text-xs text-[#727973] dark:text-[#a0aca4] mt-0.5">Try searching with a different name.</p>
          </div>
        ) : (
          filtered.map((stylist) => {
            const upcomingLeaves = stylistLeaves.filter(
              (l) => l.stylistId === stylist.id || l.stylistName.toLowerCase() === stylist.name.toLowerCase()
            );

            return (
              <div
                key={stylist.id}
                className="bg-white dark:bg-[#15201a] rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md border border-[#c2c8c2]/30 dark:border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all duration-200 group"
              >
                {/* Left: Avatar + Identity + Role + Station */}
                <div className="flex items-center gap-4 min-w-0 lg:w-[32%] shrink-0">
                  <div className="relative shrink-0">
                    <img
                      src={stylist.avatar}
                      alt={stylist.name}
                      className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover shadow-xs border border-[#eaefeb] dark:border-white/10"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-[#15201a] ${
                        stylist.isAvailableToday ? 'bg-emerald-500' : 'bg-[#c2c8c2] dark:bg-neutral-600'
                      }`}
                      title={stylist.isAvailableToday ? 'Available' : 'Unavailable'}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-base sm:text-lg text-[#112e20] dark:text-white font-semibold truncate leading-tight">
                        {stylist.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f0f5f1] dark:bg-[#1f2d25] text-[#424844] dark:text-[#a0aca4] truncate">
                        {stylist.station}
                      </span>
                      {/* Audience Badge */}
                      {(() => {
                        const g = (stylist.gender || 'both').toLowerCase();
                        if (g === 'gents' || g === 'male') {
                          return (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">man</span>
                              Gents
                            </span>
                          );
                        }
                        if (g === 'ladies' || g === 'female') {
                          return (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/30 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">woman</span>
                              Ladies
                            </span>
                          );
                        }
                        return (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">wc</span>
                            Gents & Ladies
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-xs text-[#9b4521] dark:text-[#ff9266] font-semibold mt-0.5 truncate">
                      {stylist.role}
                    </p>
                  </div>
                </div>

                {/* Middle: Availability Switch + Upcoming Leave */}
                <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap flex-1 min-w-0">
                  {/* Available Switch Button */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={stylist.isAvailableToday}
                    onClick={() => toggleAvailability(stylist.id)}
                    aria-label={`Toggle availability for ${stylist.name}`}
                    title={`Click to mark ${stylist.isAvailableToday ? 'Unavailable' : 'Available'}`}
                    className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0 select-none ${
                      stylist.isAvailableToday
                        ? 'border-emerald-300 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
                        : 'border-gray-200 bg-gray-50/90 text-gray-600 hover:bg-gray-100 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-400 dark:hover:bg-white/[0.10]'
                    }`}
                  >
                    <span
                      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                        stylist.isAvailableToday
                          ? 'bg-emerald-500 dark:bg-emerald-500'
                          : 'bg-[#c2c8c2] dark:bg-neutral-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                          stylist.isAvailableToday ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        stylist.isAvailableToday
                          ? 'text-emerald-800 dark:text-emerald-300'
                          : 'text-gray-600 dark:text-neutral-400'
                      }`}
                    >
                      {stylist.isAvailableToday ? 'Available' : 'Unavailable'}
                    </span>
                  </button>

                  {/* Upcoming Leave Notice */}
                  {upcomingLeaves.length > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] font-medium shrink-0">
                      <span className="material-symbols-outlined text-[14px] text-amber-600 dark:text-amber-400">event_busy</span>
                      <span>Leave: {upcomingLeaves[0].date} ({upcomingLeaves[0].duration === 'FULL_DAY' ? 'Full Day' : 'Half Day'})</span>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2 self-end lg:self-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#eaefeb] dark:border-white/10 w-full lg:w-auto justify-end">
                  {permissions.canManageStylistLeaves && (
                    <button
                      type="button"
                      onClick={() => onOpenScheduleLeave(stylist.id)}
                      className="h-8 px-3 rounded-xl border border-[#c2c8c2]/50 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-[#eaefeb] dark:hover:bg-white/10 text-[#181d1b] dark:text-neutral-200 text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                      title="Schedule leave for this stylist"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#424844] dark:text-[#a0aca4]">
                        event_busy
                      </span>
                      <span>Leave</span>
                    </button>
                  )}

                  {!permissions.isViewOnly && (
                    <button
                      type="button"
                      onClick={() => onOpenNewBookingWithStylist(stylist.id)}
                      className="h-8 px-3.5 rounded-xl bg-[#112e20] hover:bg-[#1b4330] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                      title={`Book appointment with ${stylist.name}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Book</span>
                    </button>
                  )}

                  {permissions.canEditStylists && (
                    <button
                      type="button"
                      onClick={() => onEditStylist(stylist)}
                      className="w-8 h-8 rounded-xl border border-[#c2c8c2]/50 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-[#eaefeb] dark:hover:bg-white/10 text-[#424844] dark:text-neutral-200 hover:text-[#112e20] dark:hover:text-white flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                      title="Edit Stylist Profile"
                    >
                      <span className="material-symbols-outlined text-[17px] text-current">edit</span>
                    </button>
                  )}

                  {permissions.canDeleteStylists && (
                    <button
                      type="button"
                      onClick={() => setStylistToDelete(stylist)}
                      className="w-8 h-8 rounded-xl border border-[#c2c8c2]/50 dark:border-white/10 bg-white dark:bg-white/5 text-[#424844] dark:text-neutral-300 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer btn-delete-action"
                      title={`Delete ${stylist.name}`}
                    >
                      <span className="material-symbols-outlined text-[17px] text-current transition-colors">
                        delete
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2. Stylist Scheduled Leaves & Roster Card (Moved to the Bottom) */}
      <div className="bg-white dark:bg-[#15201a] rounded-2xl border border-[#c2c8c2]/30 dark:border-white/10 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#c2c8c2]/30 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffdad6]/50 dark:bg-[#3d1414] flex items-center justify-center text-[#ba1a1a] dark:text-[#fca5a5]">
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl text-[#112e20] dark:text-white leading-tight">
                  Upcoming Stylist Leaves & Time-Off
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#eaefeb] dark:bg-[#202e26] text-[#112e20] dark:text-[#caead5] text-xs font-bold">
                  {stylistLeaves.length}
                </span>
              </div>
              <span className="text-xs text-[#424844] dark:text-[#a0aca4]">
                Pre-scheduled full-day and half-day leaves for salon artisans
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f0f5f1] dark:bg-[#1a2520] p-1 rounded-xl self-start sm:self-auto border border-transparent dark:border-white/10">
            <button
              onClick={() => setLeaveFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                leaveFilter === 'ALL'
                  ? 'bg-white dark:bg-[#24342a] text-[#112e20] dark:text-white shadow-xs'
                  : 'text-[#424844] dark:text-[#a0aca4] hover:text-[#112e20] dark:hover:text-white'
              }`}
            >
              All Leaves ({stylistLeaves.length})
            </button>
            <button
              onClick={() => setLeaveFilter('FULL_DAY')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                leaveFilter === 'FULL_DAY'
                  ? 'bg-white dark:bg-[#24342a] text-[#ba1a1a] dark:text-[#fca5a5] shadow-xs'
                  : 'text-[#424844] dark:text-[#a0aca4] hover:text-[#112e20] dark:hover:text-white'
              }`}
            >
              Full Day ({stylistLeaves.filter((l) => l.duration === 'FULL_DAY').length})
            </button>
            <button
              onClick={() => setLeaveFilter('HALF_DAY')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                leaveFilter === 'HALF_DAY'
                  ? 'bg-white dark:bg-[#24342a] text-[#735c00] dark:text-[#fde047] shadow-xs'
                  : 'text-[#424844] dark:text-[#a0aca4] hover:text-[#112e20] dark:hover:text-white'
              }`}
            >
              Half Day ({stylistLeaves.filter((l) => l.duration === 'FIRST_HALF' || l.duration === 'SECOND_HALF').length})
            </button>
          </div>
        </div>

        {filteredLeaves.length === 0 ? (
          <div className="py-8 text-center text-[#727973] dark:text-[#88998f] text-sm">
            No scheduled leaves found for this filter. All stylists are on active schedule.
          </div>
        ) : (
          <div className="divide-y divide-[#eaefeb] dark:divide-white/10">
            {filteredLeaves.map((leave) => {
              const matchedStylist = stylists.find((s) => s.id === leave.stylistId);
              return (
                <div
                  key={leave.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3 hover:bg-[#f0f5f1]/40 dark:hover:bg-white/5 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={matchedStylist?.avatar || 'https://images.unsplash.com/photo-1595956553066-fe24a8c33395?auto=format&fit=crop&w=400&q=80'}
                      alt={leave.stylistName}
                      className="w-10 h-10 rounded-full object-cover border border-[#c2c8c2]/50 dark:border-white/10 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-[#112e20] dark:text-white">
                          {leave.stylistName}
                        </span>
                        <span className="text-xs text-[#727973] dark:text-[#88998f] font-normal">
                          • {matchedStylist?.role || 'Artisan'}
                        </span>
                        {getDurationBadge(leave.duration)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#424844] dark:text-[#a0aca4] mt-0.5">
                        <span className="font-semibold text-[#112e20] dark:text-[#caead5]">
                          📅 {leave.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => onDeleteLeave(leave.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#ba1a1a] dark:text-[#fca5a5] hover:bg-[#ffdad6]/60 dark:hover:bg-red-950/40 transition-all cursor-pointer"
                      title="Revoke and cancel leave"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      <span>Revoke</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Deleting Stylist */}
      {stylistToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white dark:bg-[#15201a] rounded-2xl shadow-2xl w-full max-w-md border border-[#c2c8c2]/30 dark:border-[#2a3830] p-6 overflow-hidden animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-title"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">warning</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 id="confirm-delete-title" className="text-base font-semibold text-[#112e20] dark:text-white leading-tight">
                  Remove Stylist from Roster?
                </h3>
                <p className="text-xs text-[#526058] dark:text-[#9ea8a2] mt-1.5 leading-relaxed">
                  Are you sure you want to remove <span className="font-semibold text-[#112e20] dark:text-white">{stylistToDelete.name}</span> ({stylistToDelete.role}) from the salon roster? This will also unassign them from their station.
                </p>

                <div className="flex items-center gap-3 mt-5 justify-end">
                  <button
                    type="button"
                    onClick={() => setStylistToDelete(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#424844] dark:text-[#a0aca4] hover:bg-[#eaefeb] dark:hover:bg-[#202e26] rounded-full transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const id = stylistToDelete.id;
                      setStylistToDelete(null);
                      setArtisanList((prev) => prev.filter((s) => s.id !== id));
                      onDeleteStylist(id);
                    }}
                    className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 rounded-full shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Yes, Remove Stylist</span>
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
