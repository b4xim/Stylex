import React, { useState } from 'react';
import { DaySchedule, BlackoutDate, StylistLeave } from '../types';

interface ScheduleViewProps {
  weekSchedule: DaySchedule[];
  blackoutDates: BlackoutDate[];
  isEngineActive: boolean;
  stylistLeaves?: StylistLeave[];
  onToggleEngine: () => void;
  onToggleDay: (index: number) => void;
  onOpenAddBlackout: () => void;
  onDeleteBlackout: (id: string) => void;
  onOpenScheduleLeave?: () => void;
  onDeleteLeave?: (id: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  weekSchedule,
  blackoutDates,
  isEngineActive,
  stylistLeaves = [],
  onToggleEngine,
  onToggleDay,
  onOpenAddBlackout,
  onDeleteBlackout,
  onOpenScheduleLeave,
  onDeleteLeave,
}) => {
  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [editingHours, setEditingHours] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'FULL_DAY' | 'TIME_SLOTS'>('ALL');
  const [blockToDelete, setBlockToDelete] = useState<BlackoutDate | null>(null);

  const filteredBlackouts = blackoutDates.filter((item) => {
    if (filterType === 'FULL_DAY') {
      return item.blockType === 'FULL_DAY' || item.timeRange.toLowerCase().includes('all day');
    }
    if (filterType === 'TIME_SLOTS') {
      return item.blockType === 'TIME_SLOTS' || !item.timeRange.toLowerCase().includes('all day');
    }
    return true;
  });

  const handleStartEdit = (index: number, currentHours: string) => {
    setEditingDayIndex(index);
    setEditingHours(currentHours);
  };

  const handleSaveEdit = (index: number) => {
    weekSchedule[index].hours = editingHours;
    setEditingDayIndex(null);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pt-2 pb-12 flex flex-col gap-8">
      {/* Top Header & Master Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#c2c8c2]/30">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#112e20] tracking-tight">
            Schedule Control
          </h1>
          <p className="text-sm text-[#424844] mt-1">
            Manage standard outlet operating hours and scheduled closures.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-[#c2c8c2]/30 shadow-xs">
          <span className="text-[13px] font-semibold text-[#112e20] select-none">
            Accepting Public Bookings
          </span>
          <button
            onClick={onToggleEngine}
            aria-label="Toggle Public Bookings"
            className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
              isEngineActive ? 'bg-[#112e20] justify-end' : 'bg-[#c2c8c2] justify-start'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white shadow-sm"></span>
          </button>
        </div>
      </div>

      {/* Weekly Working Hours Card */}
      <div className="bg-white rounded-2xl border border-[#c2c8c2]/30 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-5 border-b border-[#c2c8c2]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0f5f1] flex items-center justify-center text-[#112e20]">
              <span className="material-symbols-outlined text-[22px]">schedule</span>
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#112e20] leading-tight">
                Weekly Working Hours
              </h2>
              <span className="text-xs text-[#424844]">
                Default operational schedule for clients & artisans
              </span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#eaefeb]">
          {weekSchedule.map((day, idx) => (
            <div
              key={day.dayName}
              className="flex items-center justify-between py-4 px-2 hover:bg-[#f0f5f1]/50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-4 w-44">
                <span className="text-base font-semibold text-[#112e20]">{day.dayName}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    day.isOpen
                      ? 'bg-[#caead5] text-[#042014]'
                      : 'bg-[#eaefeb] text-[#424844]'
                  }`}
                >
                  {day.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>

              {editingDayIndex === idx ? (
                <div className="flex items-center gap-2 flex-1 max-w-xs">
                  <input
                    value={editingHours}
                    onChange={(e) => setEditingHours(e.target.value)}
                    className="px-2 py-1 text-sm border border-[#c2c8c2] rounded bg-white w-full"
                  />
                  <button
                    onClick={() => handleSaveEdit(idx)}
                    className="px-2 py-1 bg-[#112e20] text-white text-xs rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div
                  className={`text-sm ${
                    day.isOpen
                      ? 'text-[#112e20] font-medium'
                      : 'text-[#424844] italic'
                  }`}
                >
                  {day.hours}
                </div>
              )}

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onToggleDay(idx)}
                  aria-label={`Toggle hours for ${day.dayName}`}
                  className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                    day.isOpen ? 'bg-[#112e20] justify-end' : 'bg-[#c2c8c2] justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-sm"></span>
                </button>
                <button
                  onClick={() => handleStartEdit(idx, day.hours)}
                  className="p-2 rounded-lg text-[#727973] hover:text-[#112e20] hover:bg-[#eaefeb] transition-colors cursor-pointer"
                  title="Edit Hours"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blocked Dates & Time Slots Card */}
      <div className="bg-white rounded-2xl border border-[#c2c8c2]/30 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#c2c8c2]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">event_busy</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl text-[#112e20] leading-tight">
                  Blocked Dates & Time Slots
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#eaefeb] text-[#112e20] text-xs font-bold">
                  {blackoutDates.length}
                </span>
              </div>
              <span className="text-xs text-[#424844]">
                Manage full day closures and specific blocked time slot windows
              </span>
            </div>
          </div>

          <button
            onClick={onOpenAddBlackout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#112e20] text-white hover:bg-[#9b4521] text-[13px] font-semibold transition-all cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Block Date / Time Slot</span>
          </button>
        </div>

        {/* Filter Tabs */}
        {blackoutDates.length > 0 && (
          <div className="flex items-center gap-2 py-3 border-b border-[#eaefeb]">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-[#112e20] text-white'
                  : 'bg-[#f0f5f1] text-[#424844] hover:bg-[#eaefeb]'
              }`}
            >
              All ({blackoutDates.length})
            </button>
            <button
              onClick={() => setFilterType('TIME_SLOTS')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'TIME_SLOTS'
                  ? 'bg-[#112e20] text-white'
                  : 'bg-[#f0f5f1] text-[#424844] hover:bg-[#eaefeb]'
              }`}
            >
              Time Slots
            </button>
            <button
              onClick={() => setFilterType('FULL_DAY')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'FULL_DAY'
                  ? 'bg-[#112e20] text-white'
                  : 'bg-[#f0f5f1] text-[#424844] hover:bg-[#eaefeb]'
              }`}
            >
              Full Day Closures
            </button>
          </div>
        )}

        <div className="divide-y divide-[#eaefeb]">
          {filteredBlackouts.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#727973]">
              No schedule blocks found in this category. Click "+ Block Date / Time Slot" to add one.
            </div>
          ) : (
            filteredBlackouts.map((item) => {
              const isFullDay = item.blockType === 'FULL_DAY' || item.timeRange.toLowerCase().includes('all day');

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-start justify-between py-4 gap-3 group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold ${
                        isFullDay
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      <span className="text-[10px] uppercase -mb-0.5 tracking-wider">{item.month}</span>
                      <span className="text-base font-serif">{item.day}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#112e20] flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isFullDay ? 'bg-red-500' : 'bg-amber-500'}`} />
                          {isFullDay ? 'Full Day Closure' : 'Time Slots Blocked'}
                        </span>
                        
                        {/* Type Badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 ${
                            isFullDay
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900 border border-amber-300/50'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {isFullDay ? 'block' : 'schedule'}
                          </span>
                          <span>{item.timeRange}</span>
                        </span>

                        {item.station && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                              item.station.toLowerCase().includes('ladies')
                                ? 'bg-pink-100 text-pink-800 border border-pink-200'
                                : item.station.toLowerCase().includes('gents')
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-[#f0f5f1] text-[#424844] border border-[#c2c8c2]/50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[12px]">
                              {item.station.toLowerCase().includes('ladies')
                                ? 'woman'
                                : item.station.toLowerCase().includes('gents')
                                ? 'man'
                                : 'storefront'}
                            </span>
                            <span>{item.station}</span>
                          </span>
                        )}
                      </div>

                      {/* Individual Blocked Slot Chips */}
                      {item.slots && item.slots.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-2">
                          <span className="text-[10px] font-semibold text-[#727973] uppercase tracking-wider">
                            Blocked Slots:
                          </span>
                          {item.slots.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffdad6] text-[#ba1a1a]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    <button
                      type="button"
                      onClick={() => setBlockToDelete(item)}
                      className="w-8 h-8 rounded-xl border border-[#c2c8c2]/50 dark:border-white/10 bg-white dark:bg-white/5 text-[#424844] dark:text-neutral-300 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer btn-delete-action"
                      title="Unblock this schedule"
                    >
                      <span className="material-symbols-outlined text-[17px] text-current">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Stylist & Artisan Leaves Card */}
      <div className="bg-white rounded-2xl border border-[#c2c8c2]/30 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#c2c8c2]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffdad6]/50 flex items-center justify-center text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[22px]">person_off</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl text-[#112e20] leading-tight">
                  Scheduled Stylist Leaves
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#eaefeb] text-[#112e20] text-xs font-bold">
                  {stylistLeaves.length}
                </span>
              </div>
              <span className="text-xs text-[#424844]">
                Future full-day and half-day leaves scheduled for salon staff
              </span>
            </div>
          </div>

          {onOpenScheduleLeave && (
            <button
              onClick={onOpenScheduleLeave}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eaefeb] text-[#112e20] hover:bg-[#112e20] hover:text-white text-[13px] font-semibold transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>+ Schedule Stylist Leave</span>
            </button>
          )}
        </div>

        {stylistLeaves.length === 0 ? (
          <div className="py-8 text-center text-[#727973] text-sm">
            No stylist leaves currently scheduled.
          </div>
        ) : (
          <div className="divide-y divide-[#eaefeb]">
            {stylistLeaves.map((leave) => (
              <div
                key={leave.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold ${
                      leave.duration === 'FULL_DAY'
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'bg-[#ffe088]/40 text-[#735c00]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {leave.duration === 'FULL_DAY' ? 'event_busy' : 'schedule'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-semibold text-[#112e20]">
                        {leave.stylistName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          leave.duration === 'FULL_DAY'
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : 'bg-[#ffe088]/50 text-[#735c00]'
                        }`}
                      >
                        {leave.duration === 'FULL_DAY'
                          ? 'Full Day Off'
                          : leave.duration === 'FIRST_HALF'
                          ? 'Half Day (Morning: 10 AM – 4:30 PM)'
                          : 'Half Day (Evening: 4:30 PM – 1 AM)'}
                      </span>
                      <span className="text-xs text-[#727973] font-medium">
                        • {leave.date}
                      </span>
                    </div>
                  </div>
                </div>

                {onDeleteLeave && (
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => onDeleteLeave(leave.id)}
                      className="w-8 h-8 rounded-xl border border-[#c2c8c2]/50 dark:border-white/10 bg-white dark:bg-white/5 text-[#424844] dark:text-neutral-300 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer btn-delete-action"
                      title="Revoke Leave"
                    >
                      <span className="material-symbols-outlined text-[17px] text-current">delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Unblocking Schedule */}
      {blockToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#c2c8c2]/30 p-6 overflow-hidden animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-unblock-title"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">lock_open</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 id="confirm-unblock-title" className="text-base font-semibold text-[#112e20] leading-tight">
                  Unblock Schedule?
                </h3>
                <p className="text-xs text-[#526058] mt-1.5 leading-relaxed">
                  Are you sure you want to remove the block on <span className="font-semibold text-[#112e20]">{blockToDelete.title}</span> ({blockToDelete.timeRange})? Client reservations will be re-enabled for this time window.
                </p>

                <div className="flex items-center gap-3 mt-5 justify-end">
                  <button
                    type="button"
                    onClick={() => setBlockToDelete(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#424844] hover:bg-[#eaefeb] rounded-full transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const id = blockToDelete.id;
                      setBlockToDelete(null);
                      onDeleteBlackout(id);
                    }}
                    className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Yes, Unblock</span>
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
