import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Appointment, UserAccount } from '../types';
import { getWhatsAppUrl, WhatsAppIcon } from '../utils/whatsapp';

interface AppointmentsViewProps {
  appointments: Appointment[];
  onOpenNewBooking: (initialDate?: string) => void;
  onCompleteSession: (aptId: string) => void;
  onCheckIn: (aptId: string) => void;
  onManageBooking: (apt: Appointment) => void;
  globalSearchQuery?: string;
  currentUser?: UserAccount;
}

// Date helpers
const formatYMD = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const parseYMD = (ymd: string): Date => {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const isDateMatching = (aptDateStr?: string, targetYMD?: string): boolean => {
  if (!aptDateStr || !targetYMD) return false;
  const todayYMD = formatYMD(new Date());
  const normalizedApt = (aptDateStr || '').toLowerCase() === 'today' ? todayYMD : aptDateStr;
  return normalizedApt === targetYMD;
};

const formatAptDateLabel = (dateStr?: string): string => {
  if (!dateStr) return 'Date TBD';
  if ((dateStr || '').toLowerCase() === 'today') return 'Today';
  try {
    const d = parseYMD(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  onOpenNewBooking,
  onCompleteSession,
  onCheckIn,
  onManageBooking,
  globalSearchQuery = '',
  currentUser,
}) => {
  const isViewOnly = currentUser?.role === 'Staff' || currentUser?.role === 'Normal User';
  const todayYMD = useMemo(() => formatYMD(new Date()), []);
  const [selectedDate, setSelectedDate] = useState<string>(todayYMD);
  const [showAllDates, setShowAllDates] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'BOOKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'>('ALL');
  
  // Custom Calendar Popover state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarContainerRef = useRef<HTMLDivElement>(null);

  const initialD = useMemo(() => parseYMD(selectedDate), [selectedDate]);
  const [viewYear, setViewYear] = useState(() => initialD.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => initialD.getMonth());

  // Close calendar popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarContainerRef.current && !calendarContainerRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  const isToday = selectedDate === todayYMD;

  // Formatted date labels
  const selectedDateObj = useMemo(() => parseYMD(selectedDate), [selectedDate]);

  const formattedSelectedFull = useMemo(() => {
    return selectedDateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [selectedDateObj]);

  const formattedSelectedShort = useMemo(() => {
    return selectedDateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }, [selectedDateObj]);

  // Step 1 day forward / backward
  const handleStepDay = (step: number) => {
    setShowAllDates(false);
    const d = parseYMD(selectedDate);
    d.setDate(d.getDate() + step);
    setSelectedDate(formatYMD(d));
  };

  // Step 7 days forward / backward
  const handleStepWeek = (step: number) => {
    setShowAllDates(false);
    const d = parseYMD(selectedDate);
    d.setDate(d.getDate() + (step * 7));
    setSelectedDate(formatYMD(d));
  };

  // Toggle custom calendar
  const handleToggleCalendar = () => {
    if (!isCalendarOpen) {
      const d = parseYMD(selectedDate);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
    setIsCalendarOpen((prev) => !prev);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Custom calendar grid cells
  const calendarCells = useMemo(() => {
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 for Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells: Array<{
      ymd: string;
      dayNum: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      hasAppts: boolean;
      apptsCount: number;
    }> = [];

    // Previous month padding
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevDate = new Date(viewYear, viewMonth - 1, d);
      const ymd = formatYMD(prevDate);
      const count = appointments.filter((a) => isDateMatching(a.dateStr, ymd)).length;
      cells.push({
        ymd,
        dayNum: d,
        isCurrentMonth: false,
        isToday: ymd === todayYMD,
        isSelected: ymd === selectedDate,
        hasAppts: count > 0,
        apptsCount: count,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const currDate = new Date(viewYear, viewMonth, d);
      const ymd = formatYMD(currDate);
      const count = appointments.filter((a) => isDateMatching(a.dateStr, ymd)).length;
      cells.push({
        ymd,
        dayNum: d,
        isCurrentMonth: true,
        isToday: ymd === todayYMD,
        isSelected: ymd === selectedDate,
        hasAppts: count > 0,
        apptsCount: count,
      });
    }

    // Next month padding to complete grid
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(viewYear, viewMonth + 1, d);
      const ymd = formatYMD(nextDate);
      const count = appointments.filter((a) => isDateMatching(a.dateStr, ymd)).length;
      cells.push({
        ymd,
        dayNum: d,
        isCurrentMonth: false,
        isToday: ymd === todayYMD,
        isSelected: ymd === selectedDate,
        hasAppts: count > 0,
        apptsCount: count,
      });
    }

    return cells;
  }, [viewYear, viewMonth, appointments, selectedDate, todayYMD]);

  // 7-day strip centered on selectedDate (3 days before, selected, 3 days after)
  const stripDays = useMemo(() => {
    const base = parseYMD(selectedDate);
    return [-3, -2, -1, 0, 1, 2, 3].map((offset) => {
      const d = new Date(base);
      d.setDate(d.getDate() + offset);
      const ymd = formatYMD(d);
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      const isDayToday = ymd === todayYMD;
      const isSelected = ymd === selectedDate;
      const apptsCount = appointments.filter((a) => isDateMatching(a.dateStr, ymd)).length;
      return {
        ymd,
        weekday,
        dayNum,
        month,
        isToday: isDayToday,
        isSelected,
        count: apptsCount,
      };
    });
  }, [selectedDate, appointments, todayYMD]);

  const hasGlobalSearch = Boolean(globalSearchQuery && globalSearchQuery.trim().length > 0);

  // Active appointments: all appointments if showAllDates is true or when searching globally, or filtered by selectedDate
  const relevantAppointments = useMemo(() => {
    if (showAllDates || hasGlobalSearch) {
      return appointments;
    }
    return appointments.filter((apt) => isDateMatching(apt.dateStr, selectedDate));
  }, [appointments, selectedDate, showAllDates, hasGlobalSearch]);

  // Status counts for current scope
  const statusCounts = useMemo(() => {
    return {
      ALL: relevantAppointments.length,
      BOOKED: relevantAppointments.filter((a) => a.status === 'BOOKED').length,
      IN_PROGRESS: relevantAppointments.filter((a) => a.status === 'IN_PROGRESS').length,
      COMPLETED: relevantAppointments.filter((a) => a.status === 'COMPLETED').length,
      CANCELLED: relevantAppointments.filter((a) => a.status === 'CANCELLED').length,
    };
  }, [relevantAppointments]);

  // Filtered by status and search query, sorted chronologically if all dates
  const filteredAppointments = useMemo(() => {
    const result = relevantAppointments.filter((apt) => {
      if (statusFilter !== 'ALL' && apt.status !== statusFilter) return false;
      if (!globalSearchQuery) return true;
      const q = globalSearchQuery.toLowerCase();
      const clientName = (apt.clientName || '').toLowerCase();
      const serviceName = (apt.serviceName || '').toLowerCase();
      const stylistName = (apt.stylistName || '').toLowerCase();
      const phone = (apt.clientPhone || '').toLowerCase();
      const notes = (apt.notes || '').toLowerCase();
      const email = (apt.clientEmail || '').toLowerCase();
      return (
        clientName.includes(q) ||
        serviceName.includes(q) ||
        stylistName.includes(q) ||
        phone.includes(q) ||
        notes.includes(q) ||
        email.includes(q)
      );
    });

    if (showAllDates || hasGlobalSearch) {
      return [...result].sort((a, b) => {
        const dateA = a.dateStr?.toLowerCase() === 'today' ? todayYMD : a.dateStr || '';
        const dateB = b.dateStr?.toLowerCase() === 'today' ? todayYMD : b.dateStr || '';
        if (dateA !== dateB) return dateA.localeCompare(dateB);
        return (a.time || '').localeCompare(b.time || '');
      });
    }

    return result;
  }, [relevantAppointments, statusFilter, globalSearchQuery, showAllDates, hasGlobalSearch, todayYMD]);

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[#c2c8c2]/30 dark:border-white/10 pb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9b4521] dark:text-[#ff9266]">
              {hasGlobalSearch ? 'Search Manifest' : showAllDates ? 'Master Manifest' : 'Daily Manifest'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#112e20] dark:bg-[#caead5]"></span>
            <span className="text-xs text-[#424844] dark:text-[#a0aca4]">
              {hasGlobalSearch
                ? `${statusCounts.ALL} match${statusCounts.ALL === 1 ? '' : 'es'} found across all dates`
                : showAllDates
                ? `${statusCounts.ALL} total reservation${statusCounts.ALL === 1 ? '' : 's'} across all dates`
                : `${statusCounts.ALL} reservation${statusCounts.ALL === 1 ? '' : 's'} on this date`}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#112e20] dark:text-white tracking-tight">
            Appointments
          </h1>
          <p className="text-sm text-[#424844] dark:text-[#a0aca4] mt-1">
            {showAllDates
              ? 'Comprehensive booking manifest showing all reservations irrespective of date.'
              : 'Guest reception schedule, artisan assignments, and service flow.'}
          </p>
        </div>

        {/* Modern Date Navigation & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick "Today" Button */}
          <button
            onClick={() => {
              setSelectedDate(todayYMD);
              setShowAllDates(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
              isToday && !showAllDates
                ? 'bg-[#112e20] dark:bg-[#203a2c] text-white border-[#112e20] dark:border-[#caead5]/30 shadow-sm ring-2 ring-[#112e20]/15 dark:ring-[#caead5]/20'
                : 'bg-white dark:bg-[#15201a] hover:bg-[#eaefeb] dark:hover:bg-[#1f2d25] text-[#112e20] dark:text-[#caead5] border-[#c2c8c2]/40 dark:border-white/10 shadow-2xs'
            }`}
            title="Jump to today's appointments"
          >
            <span className="material-symbols-outlined text-[16px]">today</span>
            <span>Today</span>
          </button>

          {/* Toggle All Bookings Irrespective of Date */}
          <button
            type="button"
            onClick={() => setShowAllDates((prev) => !prev)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer border select-none ${
              showAllDates
                ? 'bg-[#112e20] dark:bg-[#203a2c] text-white border-[#112e20] dark:border-[#caead5]/30 shadow-sm ring-2 ring-[#112e20]/15 dark:ring-[#caead5]/20'
                : 'bg-white dark:bg-[#15201a] hover:bg-[#eaefeb] dark:hover:bg-[#1f2d25] text-[#112e20] dark:text-[#caead5] border-[#c2c8c2]/40 dark:border-white/10 shadow-2xs'
            }`}
            title={showAllDates ? 'Switch to date-specific view' : 'View all bookings irrespective of date'}
          >
            <span className="material-symbols-outlined text-[16px]">
              {showAllDates ? 'event_available' : 'calendar_month'}
            </span>
            <span>All Bookings</span>
            {/* Embedded Micro-Switch Indicator */}
            <span
              className={`w-7 h-4 rounded-full flex items-center p-0.5 transition-colors duration-200 ${
                showAllDates
                  ? 'bg-emerald-400 justify-end'
                  : 'bg-[#c2c8c2] dark:bg-white/20 justify-start'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-white dark:bg-neutral-900 shadow-xs"></span>
            </span>
          </button>

          {/* Stepper + Custom Calendar Popover Capsule */}
          <div className="flex items-center bg-white dark:bg-[#15201a] rounded-xl border border-[#c2c8c2]/40 dark:border-white/10 shadow-2xs p-1">
            <button
              onClick={() => handleStepDay(-1)}
              aria-label="Previous Day"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#181d1b] dark:text-white hover:bg-[#f0f5f1] dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Previous Day"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {/* Clickable Date Display Triggering Custom Calendar Popover */}
            <div className="relative" ref={calendarContainerRef}>
              <button
                type="button"
                onClick={handleToggleCalendar}
                aria-expanded={isCalendarOpen}
                aria-haspopup="dialog"
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer select-none group ${
                  isCalendarOpen
                    ? 'bg-[#112e20] text-white dark:bg-[#203a2c]'
                    : 'hover:bg-[#f0f5f1] dark:hover:bg-white/10'
                }`}
                title="Click to open calendar"
              >
                <span
                  className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                    isCalendarOpen
                      ? 'text-[#caead5]'
                      : 'text-[#112e20] dark:text-[#caead5] group-hover:scale-110'
                  }`}
                >
                  calendar_month
                </span>
                <span
                  className={`text-sm font-semibold whitespace-nowrap ${
                    isCalendarOpen ? 'text-white' : 'text-[#112e20] dark:text-white'
                  }`}
                >
                  {formattedSelectedFull}
                </span>
                <span
                  className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                    isCalendarOpen
                      ? 'rotate-180 text-white'
                      : 'text-[#424844] dark:text-[#88998f] group-hover:text-[#112e20] dark:group-hover:text-white'
                  }`}
                >
                  arrow_drop_down
                </span>
              </button>

              {/* Custom High-End Calendar Popover Dropdown */}
              {isCalendarOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-76 sm:w-80 bg-white dark:bg-[#15201a] rounded-2xl shadow-2xl border border-[#c2c8c2]/50 dark:border-white/15 z-50 p-3 animate-in fade-in zoom-in-95 duration-150"
                  role="dialog"
                  aria-label="Calendar Date Picker"
                >
                  {/* Calendar Navigation Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#eaefeb] dark:border-white/10">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#181d1b] dark:text-white hover:bg-[#eaefeb] dark:hover:bg-white/10 transition-colors cursor-pointer"
                      title="Previous Month"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#112e20] dark:text-white">
                        {MONTH_NAMES[viewMonth]} {viewYear}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#181d1b] dark:text-white hover:bg-[#eaefeb] dark:hover:bg-white/10 transition-colors cursor-pointer"
                      title="Next Month"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </div>

                  {/* Day of Week Labels */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {WEEKDAY_NAMES.map((name, i) => (
                      <span
                        key={name}
                        className={`text-[11px] font-bold py-1 select-none ${
                          i === 0 || i === 6
                            ? 'text-[#9b4521] dark:text-[#ff9266]'
                            : 'text-[#727973] dark:text-[#88998f]'
                        }`}
                      >
                        {name}
                      </span>
                    ))}
                  </div>

                  {/* Day Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {calendarCells.map((cell) => (
                      <button
                        type="button"
                        key={cell.ymd}
                        onClick={() => {
                          setSelectedDate(cell.ymd);
                          setShowAllDates(false);
                          setIsCalendarOpen(false);
                        }}
                        className={`h-9 w-9 sm:h-9.5 sm:w-9.5 mx-auto rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative select-none ${
                          cell.isSelected && !showAllDates
                            ? 'bg-[#112e20] dark:bg-emerald-600 text-white font-bold shadow-md shadow-[#112e20]/20 dark:shadow-emerald-950/60 ring-2 ring-[#112e20]/20 dark:ring-emerald-400/40'
                            : cell.isCurrentMonth
                            ? 'text-[#181d1b] dark:text-white hover:bg-[#eaefeb] dark:hover:bg-white/10 font-semibold'
                            : 'text-[#c2c8c2] dark:text-neutral-600 hover:bg-[#f0f5f1] dark:hover:bg-white/5 font-normal'
                        } ${
                          cell.isToday && !(cell.isSelected && !showAllDates)
                            ? 'ring-1.5 ring-emerald-500 text-emerald-700 dark:text-emerald-400'
                            : ''
                        }`}
                        title={`${cell.ymd}${cell.apptsCount > 0 ? ` (${cell.apptsCount} reservation${cell.apptsCount === 1 ? '' : 's'})` : ''}`}
                      >
                        <span className="text-xs leading-none">{cell.dayNum}</span>
                        {cell.hasAppts && (
                          <span
                            className={`w-1 h-1 rounded-full mt-0.5 ${
                              cell.isSelected && !showAllDates
                                ? 'bg-white'
                                : 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.9)]'
                            }`}
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Bottom Quick Jump Action Strip */}
                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#eaefeb] dark:border-white/10 text-xs font-semibold gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDate(todayYMD);
                        setShowAllDates(false);
                        setIsCalendarOpen(false);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#eaefeb] dark:bg-[#1f2d25] text-[#112e20] dark:text-[#caead5] hover:bg-[#112e20] hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all cursor-pointer"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const tmrw = new Date();
                        tmrw.setDate(tmrw.getDate() + 1);
                        setSelectedDate(formatYMD(tmrw));
                        setShowAllDates(false);
                        setIsCalendarOpen(false);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#f0f5f1] dark:bg-white/5 text-[#424844] dark:text-neutral-300 hover:bg-[#eaefeb] dark:hover:bg-white/10 transition-all cursor-pointer"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAllDates(true);
                        setIsCalendarOpen(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                        showAllDates
                          ? 'bg-[#112e20] dark:bg-emerald-600 text-white shadow-2xs'
                          : 'bg-[#f0f5f1] dark:bg-white/5 text-[#424844] dark:text-neutral-300 hover:bg-[#eaefeb] dark:hover:bg-white/10'
                      }`}
                    >
                      All Dates
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(false)}
                      className="px-2 py-1.5 rounded-lg text-[#727973] dark:text-neutral-400 hover:text-[#181d1b] dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleStepDay(1)}
              aria-label="Next Day"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#181d1b] dark:text-white hover:bg-[#f0f5f1] dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Next Day"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          {/* New Booking Action */}
          {!isViewOnly ? (
            <button
              onClick={() => onOpenNewBooking(selectedDate)}
              className="px-4 sm:px-5 py-2 rounded-xl bg-[#112e20] dark:bg-[#1f3a2c] text-white text-[13px] font-semibold hover:bg-[#284435] dark:hover:bg-emerald-600 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>New Booking</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-500 text-xs font-medium ml-auto sm:ml-0">
              <span className="material-symbols-outlined text-[15px]">visibility</span>
              <span>View Only</span>
            </div>
          )}
        </div>
      </div>

      {/* Modern 7-Day Horizontal Timeline Strip */}
      <div className="bg-white dark:bg-[#15201a] rounded-2xl p-3 border border-[#c2c8c2]/35 dark:border-white/10 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          {/* Week Shift Back */}
          <button
            onClick={() => handleStepWeek(-1)}
            aria-label="Previous Week"
            title="Step 1 week back"
            className="p-2 rounded-xl text-[#424844] dark:text-[#a0aca4] hover:text-[#112e20] dark:hover:text-white hover:bg-[#f0f5f1] dark:hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">keyboard_double_arrow_left</span>
          </button>

          {/* 7 Days Cards */}
          <div className="grid grid-cols-7 gap-2 flex-1">
            {stripDays.map((day) => {
              const isCardSelected = !showAllDates && day.isSelected;
              return (
                <button
                  key={day.ymd}
                  onClick={() => {
                    setSelectedDate(day.ymd);
                    setShowAllDates(false);
                  }}
                  className={`flex flex-col items-center justify-center pt-3.5 pb-2 px-1 sm:px-2 rounded-xl transition-all cursor-pointer relative group text-center ${
                    isCardSelected
                      ? 'bg-[#112e20] dark:bg-[#1f3a2c] text-white shadow-md shadow-[#112e20]/15 dark:shadow-black/40 ring-2 ring-[#112e20]/25 dark:ring-[#caead5]/30'
                      : 'bg-[#f8faf8] dark:bg-[#1a2520] hover:bg-[#eaefeb] dark:hover:bg-[#223329] text-[#181d1b] dark:text-white border border-[#eaefeb] dark:border-white/5'
                  }`}
                >
                  {/* Today Indicator */}
                  {day.isToday && (
                    <span
                      className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-xs transition-all select-none z-10 ${
                        isCardSelected
                          ? 'bg-emerald-400 text-emerald-950 ring-2 ring-[#112e20] dark:ring-[#1f3a2c]'
                          : 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950 ring-2 ring-white dark:ring-[#1a2520]'
                      }`}
                    >
                      Today
                    </span>
                  )}

                  {/* Day of Week */}
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isCardSelected ? 'text-[#caead5]' : 'text-[#424844] dark:text-[#a0aca4]'
                    }`}
                  >
                    {day.weekday}
                  </span>

                  {/* Day of Month */}
                  <span
                    className={`text-lg sm:text-xl font-bold mt-0.5 leading-tight ${
                      isCardSelected ? 'text-white' : 'text-[#112e20] dark:text-white'
                    }`}
                  >
                    {day.dayNum}
                  </span>

                  {/* Month Name */}
                  <span
                    className={`text-[10px] font-medium leading-none ${
                      isCardSelected ? 'text-[#e5e9e6]' : 'text-[#727874] dark:text-[#88998f]'
                    }`}
                  >
                    {day.month}
                  </span>

                  {/* Appointment Count Badge */}
                  <div className="mt-1.5 flex items-center gap-1">
                    {day.count > 0 ? (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5 ${
                          isCardSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-[#caead5] dark:bg-emerald-950/60 text-[#042014] dark:text-emerald-300'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{day.count}</span>
                      </span>
                    ) : (
                      <span
                        className={`text-[10px] ${
                          isCardSelected ? 'text-white/40' : 'text-neutral-300 dark:text-neutral-600'
                        }`}
                      >
                        —
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Week Shift Forward */}
          <button
            onClick={() => handleStepWeek(1)}
            aria-label="Next Week"
            title="Step 1 week forward"
            className="p-2 rounded-xl text-[#424844] dark:text-[#a0aca4] hover:text-[#112e20] dark:hover:text-white hover:bg-[#f0f5f1] dark:hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">keyboard_double_arrow_right</span>
          </button>
        </div>
      </div>

      {/* Informative Banner when Viewing All Dates */}
      {showAllDates && (
        <div className="bg-[#caead5]/25 dark:bg-emerald-950/30 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 text-xs text-[#042014] dark:text-emerald-300 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/15 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">calendar_view_week</span>
            </span>
            <div>
              <span className="font-bold text-[#112e20] dark:text-white block sm:inline mr-1">
                Viewing All Bookings:
              </span>
              <span className="text-[#424844] dark:text-[#caead5]/80">
                Displaying all {filteredAppointments.length} reservation{filteredAppointments.length === 1 ? '' : 's'} across all dates.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAllDates(false)}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#15201a] border border-[#c2c8c2]/40 dark:border-white/10 text-[#112e20] dark:text-[#caead5] hover:bg-[#eaefeb] dark:hover:bg-white/10 font-semibold transition-all shadow-2xs cursor-pointer flex-shrink-0"
          >
            Filter by {formattedSelectedShort}
          </button>
        </div>
      )}

      {/* Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'ALL', label: 'All', count: statusCounts.ALL },
          { id: 'BOOKED', label: 'Booked', count: statusCounts.BOOKED },
          { id: 'IN_PROGRESS', label: 'In Progress', count: statusCounts.IN_PROGRESS },
          { id: 'COMPLETED', label: 'Completed', count: statusCounts.COMPLETED },
          { id: 'CANCELLED', label: 'Cancelled', count: statusCounts.CANCELLED },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === tab.id
                ? 'bg-[#112e20] dark:bg-[#203a2c] text-white shadow-xs'
                : 'bg-[#eaefeb] dark:bg-[#1f2d25] text-[#181d1b] dark:text-[#d3ded8] hover:bg-[#dfe4e0] dark:hover:bg-[#293c31]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                statusFilter === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-[#d0d6d1] dark:bg-[#2b3c32] text-[#424844] dark:text-[#a0aca4]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Manifest Table or Modern Empty State */}
      <div className="bg-white dark:bg-[#15201a] rounded-2xl shadow-xs border border-[#c2c8c2]/35 dark:border-white/10 overflow-hidden flex flex-col">
        {filteredAppointments.length === 0 ? (
          <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#f0f5f1] dark:bg-[#1a2520] text-[#112e20] dark:text-[#caead5] flex items-center justify-center mb-4 border border-[#c2c8c2]/30 dark:border-white/10">
              <span className="material-symbols-outlined text-[32px]">event_busy</span>
            </div>
            <h3 className="font-serif text-2xl text-[#112e20] dark:text-white font-semibold">
              {showAllDates ? 'No Bookings Found' : `No Appointments on ${formattedSelectedShort}`}
            </h3>
            <p className="text-sm text-[#424844] dark:text-[#a0aca4] mt-1.5 max-w-md">
              {showAllDates
                ? `There are no reservations matching your current search or status filter.`
                : statusFilter !== 'ALL'
                ? `There are no reservations marked as "${statusFilter}" on this day.`
                : `The manifest for ${formattedSelectedFull} is completely clear. You can schedule a new client reservation or walk-in session below.`}
            </p>
            {!isViewOnly && (
              <button
                onClick={() => onOpenNewBooking(selectedDate)}
                className="mt-6 px-6 py-2.5 rounded-full bg-[#112e20] dark:bg-[#1f3a2c] text-white text-xs font-semibold hover:bg-[#284435] dark:hover:bg-emerald-600 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Schedule New Booking</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-[#f0f5f1] dark:bg-[#1a2520] text-[#424844] dark:text-[#a0aca4] text-[11px] uppercase tracking-wider font-semibold border-b border-[#c2c8c2]/30 dark:border-white/10 select-none">
                  <th className="py-3.5 px-6">{showAllDates ? 'Date & Time' : 'Time & Duration'}</th>
                  <th className="py-3.5 px-4">Guest Name</th>
                  <th className="py-3.5 px-4">Service & Station</th>
                  <th className="py-3.5 px-4">Assigned Stylist</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaefeb] dark:divide-white/10">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-[#f0f5f1]/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 align-middle">
                      {showAllDates && (
                        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#eaefeb] dark:bg-white/10 text-[#112e20] dark:text-[#caead5] border border-[#c2c8c2]/30 dark:border-white/10">
                            <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                            {formatAptDateLabel(apt.dateStr)}
                          </span>
                          {isDateMatching(apt.dateStr, todayYMD) && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                              Today
                            </span>
                          )}
                        </div>
                      )}
                      <span className="text-base text-[#112e20] dark:text-white font-bold block">
                        {apt.time}
                      </span>
                      <span className="text-xs text-[#424844] dark:text-[#a0aca4] block mt-0.5">
                        {apt.durationMin} mins
                      </span>
                    </td>

                    <td className="py-4 px-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base text-[#181d1b] dark:text-white font-semibold">
                            {apt.clientName}
                          </span>
                          <a
                            href={getWhatsAppUrl(apt.clientPhone, apt.clientName, apt.serviceName, apt.dateStr, apt.time)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#0f7a37] dark:text-[#4ade80] hover:text-white dark:hover:text-white border border-[#25D366]/30 transition-all text-[11px] font-semibold cursor-pointer shadow-2xs group/wa"
                            title={`Chat with ${apt.clientName} on WhatsApp`}
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] group-hover/wa:text-white transition-colors shrink-0" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                        <div className="text-xs text-[#424844] dark:text-[#a0aca4] flex items-center gap-1.5 flex-wrap">
                          <span>{apt.clientPhone}</span>
                          {apt.clientEmail && (
                            <>
                              <span>•</span>
                              <span className="inline-flex items-center gap-1 text-[#2d6a4f] dark:text-[#86efac] font-medium">
                                <span className="material-symbols-outlined text-[13px]">mail</span>
                                <span>{apt.clientEmail}</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 align-middle">
                      <span className="text-sm font-medium text-[#181d1b] dark:text-white block">
                        {apt.serviceName}
                      </span>
                      <span className="text-xs text-[#424844] dark:text-[#a0aca4] block mt-0.5">{apt.station}</span>
                    </td>

                    <td className="py-4 px-4 align-middle">
                      {apt.stylistName && !apt.stylistName.toLowerCase().includes('any') ? (
                        <div className="flex items-center gap-2.5">
                          <img
                            className="w-8 h-8 rounded-full object-cover shadow-2xs border border-[#c2c8c2]/40 dark:border-white/10"
                            src={apt.stylistAvatar}
                            alt={apt.stylistName}
                          />
                          <span className="text-sm font-medium text-[#181d1b] dark:text-white">
                            {apt.stylistName}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0f5f1] dark:bg-white/5 text-[#424844] dark:text-[#a0aca4] text-xs font-medium border border-[#c2c8c2]/30 dark:border-white/10">
                          <span className="material-symbols-outlined text-[13px]">person_outline</span>
                          Any Stylist
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 align-middle">
                      {apt.status === 'IN_PROGRESS' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9b4521] text-white text-[11px] tracking-wider uppercase font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                          In Progress
                        </span>
                      ) : apt.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5e9e6] dark:bg-[#1a3828] text-[#112e20] dark:text-[#caead5] text-[11px] tracking-wider uppercase font-semibold border border-transparent dark:border-[#caead5]/25">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#112e20] dark:bg-[#caead5]"></span>
                          Completed
                        </span>
                      ) : apt.status === 'CANCELLED' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6] dark:bg-[#3d1414] text-[#ba1a1a] dark:text-[#fca5a5] text-[11px] tracking-wider uppercase font-semibold border border-transparent dark:border-[#fca5a5]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] dark:bg-[#ef4444]"></span>
                          Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#caead5] dark:bg-[#103a22] text-[#042014] dark:text-[#86efac] text-[11px] tracking-wider uppercase font-semibold border border-transparent dark:border-[#86efac]/35">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#112e20] dark:bg-[#4ade80]"></span>
                          Booked
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isViewOnly ? (
                          <>
                            {apt.status === 'IN_PROGRESS' ? (
                              <button
                                onClick={() => onCompleteSession(apt.id)}
                                className="px-4 py-1.5 rounded-full bg-[#112e20] dark:bg-[#1f3a2c] text-white text-xs font-semibold hover:bg-[#284435] dark:hover:bg-emerald-600 transition-all shadow-2xs cursor-pointer"
                              >
                                Complete
                              </button>
                            ) : apt.status === 'COMPLETED' ? (
                              <span className="inline-block text-xs font-semibold text-[#112e20] dark:text-[#caead5] bg-[#eaefeb] dark:bg-[#1a3828] px-3 py-1 rounded-full border border-[#c2c8c2]/40 dark:border-[#caead5]/25">
                                Finished
                              </span>
                            ) : apt.status === 'CANCELLED' ? (
                              <span className="inline-block text-xs font-semibold text-[#ba1a1a] dark:text-[#fca5a5] bg-[#ffdad6]/70 dark:bg-[#3d1414] px-3 py-1 rounded-full border border-[#ffdad6] dark:border-[#fca5a5]/30">
                                Cancelled
                              </span>
                            ) : (
                              <button
                                onClick={() => onCheckIn(apt.id)}
                                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-2xs cursor-pointer bg-[#112e20] dark:bg-[#1f3a2c] text-white hover:bg-[#284435] dark:hover:bg-emerald-600"
                              >
                                Check In
                              </button>
                            )}

                            <button
                              onClick={() => onManageBooking(apt)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#f0f5f1] dark:bg-[#1a2520] text-[#112e20] dark:text-[#caead5] hover:bg-[#eaefeb] dark:hover:bg-[#24332a] text-xs font-medium transition-colors cursor-pointer border border-[#c2c8c2]/30 dark:border-white/10"
                              title="Manual Booking Controls & Cancel"
                            >
                              <span className="material-symbols-outlined text-[16px]">tune</span>
                              <span>Manage</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-neutral-400 dark:text-neutral-500 italic pr-2">
                            {apt.status === 'IN_PROGRESS' ? 'In Progress' : apt.status === 'COMPLETED' ? 'Finished' : apt.status === 'CANCELLED' ? 'Cancelled' : 'Confirmed'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-[#f0f5f1]/40 dark:bg-[#1a2520]/60 flex items-center justify-between border-t border-[#c2c8c2]/30 dark:border-white/10 text-[#424844] dark:text-[#a0aca4] text-xs">
          <span>
            {showAllDates
              ? `Showing ${filteredAppointments.length} appointment${filteredAppointments.length === 1 ? '' : 's'} across all dates`
              : `Showing ${filteredAppointments.length} appointment${filteredAppointments.length === 1 ? '' : 's'} on ${formattedSelectedFull}`}
          </span>
          <span>Times shown in IST • Live Sync Active</span>
        </div>
      </div>
    </div>
  );
};
