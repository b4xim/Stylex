import React, { useState, useMemo } from 'react';
import { Appointment, DaySchedule, UserAccount } from '../types';
import { getWhatsAppUrl, WhatsAppIcon } from '../utils/whatsapp';

interface OverviewViewProps {
  appointments: Appointment[];
  weekSchedule: DaySchedule[];
  isEngineActive: boolean;
  onToggleEngine: () => void;
  onOpenNewBooking: () => void;
  onOpenExpressWalkIn: () => void;
  onOpenRunSheet: () => void;
  onOpenAddBlackout: () => void;
  onCompleteSession: (aptId: string) => void;
  onCheckIn: (aptId: string) => void;
  onPrepare: (aptId: string) => void;
  onSendLink: (apt: Appointment) => void;
  onToggleDaySchedule: (index: number) => void;
  onManageBooking: (apt: Appointment) => void;
  globalSearchQuery?: string;
  currentUser?: UserAccount;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  appointments,
  weekSchedule,
  isEngineActive,
  onToggleEngine,
  onOpenNewBooking,
  onOpenExpressWalkIn,
  onOpenRunSheet,
  onOpenAddBlackout,
  onCompleteSession,
  onCheckIn,
  onPrepare,
  onSendLink,
  onToggleDaySchedule,
  onManageBooking,
  globalSearchQuery = '',
  currentUser,
}) => {
  const canDownloadRunSheet = currentUser ? (currentUser.role === 'Admin' || currentUser.role === 'Developer') : false;
  const [localSearch, setLocalSearch] = useState('');

  // Today's YYYY-MM-DD
  const todayYMD = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Filter Overview appointments:
  // 1. Shows BOOKED and IN_PROGRESS customers
  // 2. COMPLETED customers fall off once the particular booking day is completed (aptDate < todayYMD)
  // 3. CANCELLED appointments are excluded from the overview ledger
  const activeOverviewAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (apt.status === 'CANCELLED') return false;

      const aptDate = !apt.dateStr || apt.dateStr.toLowerCase() === 'today' ? todayYMD : apt.dateStr;

      // Completed customers fall off once the particular booking day has passed
      if (apt.status === 'COMPLETED') {
        return aptDate >= todayYMD;
      }

      // Active booked and in-progress customers (today and upcoming)
      if (apt.status === 'BOOKED' || apt.status === 'IN_PROGRESS') {
        return aptDate >= todayYMD;
      }

      return false;
    });
  }, [appointments, todayYMD]);

  const effectiveSearch = (globalSearchQuery || localSearch).toLowerCase().trim();

  const filteredAppointments = useMemo(() => {
    return activeOverviewAppointments.filter((apt) => {
      if (!effectiveSearch) return true;
      return (
        apt.clientName.toLowerCase().includes(effectiveSearch) ||
        apt.serviceName.toLowerCase().includes(effectiveSearch) ||
        apt.stylistName.toLowerCase().includes(effectiveSearch) ||
        apt.station.toLowerCase().includes(effectiveSearch)
      );
    });
  }, [activeOverviewAppointments, effectiveSearch]);

  // Today's appointments for top KPI metrics
  const todayAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const normalized = !apt.dateStr || apt.dateStr.toLowerCase() === 'today' ? todayYMD : apt.dateStr;
      return normalized === todayYMD;
    });
  }, [appointments, todayYMD]);

  const bookedCount = useMemo(() => todayAppointments.filter((a) => a.status === 'BOOKED').length, [todayAppointments]);
  const inProgressCount = useMemo(() => todayAppointments.filter((a) => a.status === 'IN_PROGRESS').length, [todayAppointments]);
  const completedCount = useMemo(() => todayAppointments.filter((a) => a.status === 'COMPLETED').length, [todayAppointments]);
  const cancelledCount = useMemo(() => todayAppointments.filter((a) => a.status === 'CANCELLED').length, [todayAppointments]);
  const totalBookingsCount = todayAppointments.length;

  return (
    <div className="flex flex-col w-full gap-8">
      {/* 1. Header & Quick Operations Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#9b4521] uppercase tracking-widest font-bold">
              Admin Command Center
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#112e20]"></span>
            <span className="text-xs text-[#424844]">
              Tirur Outlet • Station Sync 10:42 AM
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#112e20] tracking-tight">
            Admin Operations & Bookings Control
          </h1>
        </div>

        {/* Quick Operations Ribbon */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#f0f5f1] dark:bg-[#142e20] border border-transparent dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isEngineActive ? 'bg-[#284435] dark:bg-[#4ade80] animate-pulse' : 'bg-[#9b4521] animate-ping'
                }`}
              ></span>
              <span className="text-[13px] font-semibold text-[#112e20] dark:text-[#edf5f0]">
                Guest Booking Engine
              </span>
            </div>
            <button
              onClick={onToggleEngine}
              className={`px-3 py-1 rounded-full text-[11px] tracking-wider uppercase font-bold shadow-xs transition-all cursor-pointer ${
                isEngineActive
                  ? 'bg-[#112e20] dark:bg-[#22c55e] text-white dark:text-[#042014] hover:bg-[#9b4521]'
                  : 'bg-[#9b4521] text-white hover:bg-[#752906]'
              }`}
            >
              {isEngineActive ? 'Active' : 'Blackout'}
            </button>
          </div>

          {canDownloadRunSheet ? (
            <button
              type="button"
              onClick={onOpenRunSheet}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#142e20] text-[#112e20] dark:text-[#edf5f0] text-[13px] font-medium shadow-xs hover:bg-[#eaefeb] dark:hover:bg-[#1c402d] transition-colors cursor-pointer border border-[#c2c8c2]/30 dark:border-white/15"
              title="Export Daily Run Sheet (PDF)"
            >
              <span className="material-symbols-outlined text-[18px] text-[#112e20] dark:text-[#edf5f0]">ios_share</span>
              <span className="text-[#112e20] dark:text-[#edf5f0]">Run Sheet (PDF)</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0f5f1]/70 dark:bg-white/5 text-[#727973] dark:text-neutral-500 text-[13px] font-medium border border-[#c2c8c2]/40 dark:border-white/10 opacity-60 cursor-not-allowed select-none"
              title="Run Sheet (PDF) is restricted to Admin & Developer accounts"
            >
              <span className="material-symbols-outlined text-[18px] text-[#727973] dark:text-neutral-500">lock</span>
              <span>Run Sheet (PDF)</span>
            </button>
          )}

          <button
            onClick={onOpenExpressWalkIn}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9b4521] text-white text-[13px] font-semibold shadow-md hover:bg-[#752906] transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Express Walk-in</span>
          </button>
        </div>
      </div>

      {/* 2. Top KPI Metric Cards (Grid of 3) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="rounded-xl bg-white p-6 shadow-sm flex flex-col justify-between border border-[#c2c8c2]/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#424844] uppercase tracking-wider font-bold">
              Today's Appointments
            </span>
            <div className="w-9 h-9 rounded-full bg-[#f0f5f1] flex items-center justify-center text-[#112e20]">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-serif text-3xl text-[#112e20] font-semibold">
              {totalBookingsCount} Bookings
            </div>
            <p className="text-xs text-[#424844] mt-1">
              {bookedCount} booked • {inProgressCount} in progress • {completedCount} completed{cancelledCount > 0 ? ` • ${cancelledCount} cancelled` : ''}
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl bg-white p-6 shadow-sm flex flex-col justify-between border border-[#c2c8c2]/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#424844] uppercase tracking-wider font-bold">
              Online Booking Gateway
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] uppercase font-bold tracking-wider ${
                isEngineActive
                  ? 'bg-[#112e20] text-white'
                  : 'bg-[#9b4521] text-white'
              }`}
            >
              {isEngineActive ? 'Accepting' : 'Paused'}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="font-serif text-3xl text-[#112e20] font-semibold">
                {isEngineActive ? 'Engine Active' : 'Engine Paused'}
              </div>
              <p className="text-xs text-[#424844] mt-1">
                {isEngineActive
                  ? 'Public web portal accepting slots'
                  : 'Public reservations temporarily paused'}
              </p>
            </div>
            <button
              onClick={onToggleEngine}
              aria-label="Toggle Online Booking Engine"
              className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                isEngineActive ? 'bg-[#112e20] justify-end' : 'bg-[#c2c8c2] justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-sm"></span>
            </button>
          </div>
        </div>

        {/* Card 3: Completed Rituals */}
        <div className="rounded-xl bg-white p-6 shadow-sm flex flex-col justify-between border border-[#c2c8c2]/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#424844] uppercase tracking-wider font-bold">
              Completed Rituals
            </span>
            <div className="w-9 h-9 rounded-full bg-[#caead5]/60 flex items-center justify-center text-[#112e20]">
              <span className="material-symbols-outlined text-[20px]">task_alt</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-serif text-3xl text-[#112e20] font-semibold">
              {completedCount} Completed
            </div>
            <p className="text-xs text-[#424844] font-medium mt-1">
              Guest appointments successfully finished today
            </p>
          </div>
        </div>
      </section>

      {/* 3. Date Availability & Schedule Blocking Control Panel */}
      <section className="rounded-xl bg-white p-6 shadow-sm flex flex-col gap-4 border border-[#c2c8c2]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#112e20]">
              Weekly Schedule & Online Availability
            </h2>
            <p className="text-sm text-[#424844]">
              Manage public web availability and day overrides at a glance.
            </p>
          </div>
          <button
            onClick={onOpenAddBlackout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0f5f1] text-[#112e20] hover:bg-[#eaefeb] text-[13px] font-medium transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">event_busy</span>
            <span>Add Blackout Date</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 mt-2">
          {weekSchedule.map((item, idx) => (
            <div
              key={item.dayName}
              className={`rounded-xl p-4 flex flex-col justify-between gap-3 border border-[#c2c8c2]/20 transition-all ${
                item.isOpen ? 'bg-[#f0f5f1]' : 'bg-[#e5e9e6]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span
                    className={`text-[11px] uppercase tracking-wider font-bold ${
                      item.label === 'Today' ? 'text-[#9b4521]' : 'text-[#424844]'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="text-base text-[#112e20] font-semibold">{item.dateStr}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    item.statusText === 'Open'
                      ? 'bg-[#112e20] text-white'
                      : item.statusText === 'Blackout'
                      ? 'bg-[#9b4521] text-white'
                      : 'bg-[#2c312f] text-[#edf2ee]'
                  }`}
                >
                  {item.statusText}
                </span>
              </div>

              <div
                className={`text-xs ${
                  item.statusText === 'Blackout'
                    ? 'text-[#9b4521] font-semibold'
                    : !item.isOpen
                    ? 'text-[#ba1a1a] font-semibold'
                    : 'text-[#112e20] font-medium'
                }`}
              >
                {item.isOpen ? item.hours : 'Reservations Closed'}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#dfe4e0]/60">
                <span
                  className={`text-xs font-medium ${
                    item.isOpen ? 'text-[#181d1b]' : 'text-[#424844]'
                  }`}
                >
                  Accept Bookings
                </span>
                <button
                  type="button"
                  onClick={() => onToggleDaySchedule(idx)}
                  aria-label={`Toggle bookings for ${item.dateStr}`}
                  className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                    item.isOpen ? 'bg-[#112e20] justify-end' : 'bg-[#c2c8c2] justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-sm"></span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Live Bookings & Reservations Ledger Table */}
      <section className="rounded-xl bg-white p-6 shadow-sm flex flex-col gap-4 border border-[#c2c8c2]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-6 rounded-full bg-[#112e20]"></div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#112e20] dark:text-white">
                Live Outlet Appointments
              </h2>
              <p className="text-xs text-[#424844] dark:text-neutral-400 mt-0.5">
                Showing booked and in-progress guest sessions. Completed sessions fall off after the day closes.
              </p>
            </div>
          </div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#424844] text-[18px]">
              search
            </span>
            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search client or ritual..."
              className="pl-9 pr-4 py-1.5 w-64 rounded-full bg-[#f0f5f1] dark:bg-white/5 text-[#181d1b] dark:text-white placeholder:text-[#424844] text-sm outline-none focus:bg-white dark:focus:bg-[#1a2520] focus:ring-1 focus:ring-[#112e20] border border-transparent focus:border-[#112e20]/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#f0f5f1] dark:bg-white/5 text-[#424844] dark:text-neutral-300 text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4 rounded-l-lg">Client & Contact</th>
                <th className="py-3 px-4">Ritual & Station</th>
                <th className="py-3 px-4">Time & Stylist</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-0">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-[#727973] dark:text-neutral-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-neutral-400">event_available</span>
                      <p className="font-medium text-[#112e20] dark:text-neutral-200">No active booked or in-progress appointments</p>
                      <p className="text-xs text-neutral-500">Completed sessions from previous days have fallen off this ledger.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => {
                  const getInitialsBg = () => {
                    if (apt.clientInitials === 'CV') return 'bg-[#112e20] text-white';
                    if (apt.clientInitials === 'MT') return 'bg-[#ffdbcf] text-[#380d00]';
                    if (apt.clientInitials === 'AR') return 'bg-[#ffe088] text-[#241a00]';
                    return 'bg-[#e5e9e6] text-[#424844]';
                  };

                  return (
                    <tr key={apt.id} className="hover:bg-[#f0f5f1]/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-xs ${getInitialsBg()}`}
                          >
                            {apt.clientInitials}
                          </div>
                          <div>
                            <div className="text-base font-semibold text-[#112e20] dark:text-white flex items-center gap-2">
                              <span>{apt.clientName}</span>
                              <a
                                href={getWhatsAppUrl(apt.clientPhone, apt.clientName, apt.serviceName, apt.dateStr, apt.time)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#0f7a37] dark:text-[#4ade80] hover:text-white dark:hover:text-white transition-all text-[10px] font-semibold group/wa shadow-2xs"
                                title={`Chat with ${apt.clientName} on WhatsApp`}
                              >
                                <WhatsAppIcon className="w-3 h-3 text-[#25D366] group-hover/wa:text-white transition-colors" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                            <div className="text-xs text-[#424844] dark:text-[#a0aca4] flex items-center gap-1.5 flex-wrap">
                              <span>{apt.clientPhone}</span>
                              {apt.clientEmail && (
                                <>
                                  <span>•</span>
                                  <span className="inline-flex items-center gap-0.5 text-[#2d6a4f] dark:text-[#86efac] font-medium">
                                    <span className="material-symbols-outlined text-[12px]">mail</span>
                                    <span>{apt.clientEmail}</span>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-middle">
                        <div className="text-sm font-semibold text-[#112e20] dark:text-white">
                          {apt.serviceName}
                        </div>
                        <div className="text-xs text-[#424844] dark:text-neutral-400">{apt.station}</div>
                      </td>

                      <td className="py-4 px-4 align-middle">
                        <div className="text-sm font-semibold text-[#112e20] dark:text-white">
                          {(!apt.dateStr || apt.dateStr.toLowerCase() === 'today' || apt.dateStr === todayYMD)
                            ? `Today • ${apt.time}`
                            : `${apt.dateStr} • ${apt.time}`}
                        </div>
                        <div className="text-xs text-[#424844] dark:text-neutral-400">{apt.stylistName}</div>
                      </td>

                    <td className="py-4 px-4 align-middle">
                      {apt.status === 'IN_PROGRESS' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#9b4521] text-white text-[11px] font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                          In Progress
                        </span>
                      ) : apt.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e5e9e6] dark:bg-[#1a3828] text-[#112e20] dark:text-[#caead5] text-[11px] font-bold uppercase tracking-wider border border-transparent dark:border-[#caead5]/25">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#112e20] dark:bg-[#caead5]"></span>
                          Completed
                        </span>
                      ) : apt.status === 'CANCELLED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffdad6] dark:bg-[#3d1414] text-[#ba1a1a] dark:text-[#fca5a5] text-[11px] font-bold uppercase tracking-wider border border-transparent dark:border-[#fca5a5]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] dark:bg-[#ef4444]"></span>
                          Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#caead5] dark:bg-[#103a22] text-[#042014] dark:text-[#86efac] text-[11px] font-bold uppercase tracking-wider border border-transparent dark:border-[#86efac]/35">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#112e20] dark:bg-[#4ade80]"></span>
                          Booked
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status === 'IN_PROGRESS' ? (
                          <button
                            onClick={() => onCompleteSession(apt.id)}
                            className="px-3.5 py-1.5 rounded-full bg-[#112e20] text-white hover:bg-[#284435] text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                          >
                            Complete
                          </button>
                        ) : apt.status === 'COMPLETED' ? (
                          <span className="text-xs text-[#424844] font-medium px-2 py-1">
                            Finished
                          </span>
                        ) : apt.status === 'CANCELLED' ? (
                          <span className="text-xs text-[#ba1a1a] font-semibold px-2 py-1 bg-[#ffdad6]/60 rounded-full">
                            Cancelled
                          </span>
                        ) : (
                          <button
                            onClick={() => onCheckIn(apt.id)}
                            className="px-3.5 py-1.5 rounded-full bg-[#112e20] text-white hover:bg-[#284435] text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                          >
                            Check-In
                          </button>
                        )}

                        <button
                          onClick={() => onManageBooking(apt)}
                          className="p-1.5 rounded-full text-[#424844] hover:text-[#112e20] hover:bg-[#eaefeb] transition-colors cursor-pointer"
                          title="Manual Controls & Cancel"
                        >
                          <span className="material-symbols-outlined text-[17px]">tune</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
