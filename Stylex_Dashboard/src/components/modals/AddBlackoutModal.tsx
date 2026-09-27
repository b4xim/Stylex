import React, { useState } from 'react';
import { BlackoutDate } from '../../types';

interface AddBlackoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlackout: (item: BlackoutDate) => void;
}

export const SALON_HOURLY_SLOTS = [
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

const STATIONS = [
  'All (Default)',
  'Ladies Section',
  'Gents Section',
];

export const AddBlackoutModal: React.FC<AddBlackoutModalProps> = ({
  isOpen,
  onClose,
  onAddBlackout,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [blockType, setBlockType] = useState<'FULL_DAY' | 'TIME_SLOTS'>('TIME_SLOTS');
  const [dateStr, setDateStr] = useState(todayStr);
  const [selectedSlots, setSelectedSlots] = useState<string[]>(['02:00 PM', '03:00 PM', '04:00 PM']);
  const [station, setStation] = useState(STATIONS[0]);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSelectPresetTime = (preset: 'morning' | 'afternoon' | 'evening' | 'all' | 'clear') => {
    if (preset === 'morning') {
      setSelectedSlots(['10:00 AM', '11:00 AM', '12:00 PM']);
    } else if (preset === 'afternoon') {
      setSelectedSlots(['01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM']);
    } else if (preset === 'evening') {
      setSelectedSlots([
        '05:00 PM',
        '06:00 PM',
        '07:00 PM',
        '08:00 PM',
        '09:00 PM',
        '10:00 PM',
        '11:00 PM',
        '12:00 AM',
      ]);
    } else if (preset === 'all') {
      setSelectedSlots([...SALON_HOURLY_SLOTS]);
    } else {
      setSelectedSlots([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!dateStr) {
      setErrorMessage('Please select a valid date.');
      return;
    }

    if (blockType === 'TIME_SLOTS' && selectedSlots.length === 0) {
      setErrorMessage('Please select at least one time slot to block.');
      return;
    }

    // Parse date parts
    const dateObj = new Date(dateStr + 'T00:00:00');
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = monthNames[dateObj.getMonth()] || 'OCT';
    const day = String(dateObj.getDate()).padStart(2, '0');

    let timeRange = 'All Day';
    if (blockType === 'TIME_SLOTS') {
      const sortedSlots = [...selectedSlots].sort(
        (a, b) => SALON_HOURLY_SLOTS.indexOf(a) - SALON_HOURLY_SLOTS.indexOf(b)
      );
      if (sortedSlots.length === 1) {
        timeRange = `${sortedSlots[0]}`;
      } else {
        timeRange = `${sortedSlots[0]} – ${sortedSlots[sortedSlots.length - 1]} (${sortedSlots.length} slots)`;
      }
    }

    const title = blockType === 'FULL_DAY' ? 'Full Day Closure' : 'Blocked Time Slots';
    const description = `${blockType === 'FULL_DAY' ? 'Full day closure' : `${selectedSlots.length} 1-hour slot(s) blocked`} for ${station}.`;

    onAddBlackout({
      id: `block-${Date.now()}`,
      month,
      day,
      dateStr,
      title,
      timeRange,
      blockType,
      slots: blockType === 'TIME_SLOTS' ? selectedSlots : undefined,
      station,
      description,
      createdAt: new Date().toISOString(),
    });

    onClose();
  };

  const formattedDatePreview = (() => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  })();

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] dark:bg-[#1a2520] text-[#181d1b] dark:text-white text-sm border border-[#c2c8c2]/30 dark:border-[#2b3a32] outline-none focus:ring-2 focus:ring-[#9b4521] focus:border-transparent transition-all placeholder:text-[#727973] dark:placeholder:text-[#6a7c73]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-[#15201a] rounded-2xl shadow-2xl max-w-lg w-full border border-[#c2c8c2]/40 dark:border-[#2a3830] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#eaefeb] dark:border-[#243029] flex items-center justify-between bg-[#f8faf8] dark:bg-[#111b16]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">event_busy</span>
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#112e20] dark:text-white">
                Block Dates & Time Slots
              </h3>
              <p className="text-xs text-[#727973] dark:text-[#8d9c94]">
                1-hour slots from 10:00 AM to 12:00 AM or full day closure
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#727973] hover:text-[#181d1b] dark:text-[#8d9c94] dark:hover:text-white rounded-lg hover:bg-[#eaefeb] dark:hover:bg-[#1f2d25] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              <span className="material-symbols-outlined text-[18px] shrink-0 text-red-600 dark:text-red-400">
                error
              </span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Block Type Tabs */}
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] dark:text-[#d3ded8] mb-1.5">
              Select Block Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#f0f5f1] dark:bg-[#1a2620] rounded-xl border border-[#dfe4e0]/60 dark:border-[#2a3830]">
              <button
                type="button"
                onClick={() => setBlockType('TIME_SLOTS')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  blockType === 'TIME_SLOTS'
                    ? 'bg-white dark:bg-[#25362d] text-[#112e20] dark:text-white shadow-xs border border-[#c2c8c2]/30 dark:border-transparent'
                    : 'text-[#5f6863] dark:text-[#88968e] hover:text-[#181d1b] dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>Specific Time Slots</span>
              </button>

              <button
                type="button"
                onClick={() => setBlockType('FULL_DAY')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  blockType === 'FULL_DAY'
                    ? 'bg-white dark:bg-[#25362d] text-[#112e20] dark:text-white shadow-xs border border-[#c2c8c2]/30 dark:border-transparent'
                    : 'text-[#5f6863] dark:text-[#88968e] hover:text-[#181d1b] dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">today</span>
                <span>Full Day Closure</span>
              </button>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#181d1b] dark:text-[#d3ded8]">
                Select Date *
              </label>
              {formattedDatePreview && (
                <span className="text-[11px] font-semibold text-[#9b4521] dark:text-[#ff9266]">
                  {formattedDatePreview}
                </span>
              )}
            </div>
            <input
              type="date"
              required
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Time Slot Selection (Visible if TIME_SLOTS) */}
          {blockType === 'TIME_SLOTS' && (
            <div className="p-3.5 rounded-xl bg-[#f8faf8] dark:bg-[#1a2620] border border-[#eaefeb] dark:border-[#26352c] flex flex-col gap-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-semibold text-[#112e20] dark:text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-600 dark:text-amber-400">
                    schedule
                  </span>
                  <span>Select 1-Hour Slots ({selectedSlots.length} selected)</span>
                </span>
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleSelectPresetTime('morning')}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-[#25362d] text-[#424844] dark:text-[#9ea8a2] hover:text-[#112e20] dark:hover:text-white border border-[#c2c8c2]/30 cursor-pointer"
                  >
                    Morning (10-12)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetTime('afternoon')}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-[#25362d] text-[#424844] dark:text-[#9ea8a2] hover:text-[#112e20] dark:hover:text-white border border-[#c2c8c2]/30 cursor-pointer"
                  >
                    Afternoon (1-4)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetTime('evening')}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-[#25362d] text-[#424844] dark:text-[#9ea8a2] hover:text-[#112e20] dark:hover:text-white border border-[#c2c8c2]/30 cursor-pointer"
                  >
                    Evening (5-12)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetTime('all')}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-[#25362d] text-[#424844] dark:text-[#9ea8a2] hover:text-[#112e20] dark:hover:text-white border border-[#c2c8c2]/30 cursor-pointer"
                  >
                    All Day
                  </button>
                </div>
              </div>

              {/* Grid of 1-Hour Slots */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 pt-1">
                {SALON_HOURLY_SLOTS.map((slot) => {
                  const isSelected = selectedSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => toggleSlot(slot)}
                      className={`py-2 px-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'bg-[#ba1a1a] text-white shadow-xs font-bold ring-1 ring-red-400'
                          : 'bg-white dark:bg-[#202e26] text-[#424844] dark:text-[#a0aca4] hover:bg-[#eaefeb] dark:hover:bg-[#2b3d33] border border-[#eaefeb] dark:border-[#2b3c31]'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#727973] dark:text-[#8d9c94] pt-1 border-t border-[#eaefeb] dark:border-[#243029]">
                <span>Tap slot to toggle block</span>
                {selectedSlots.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSelectPresetTime('clear')}
                    className="text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear selection
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Station / Area Scope */}
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] dark:text-[#d3ded8] mb-1.5">
              Scope / Section
            </label>
            <select
              value={station}
              onChange={(e) => setStation(e.target.value)}
              className={inputClass}
            >
              {STATIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#eaefeb] dark:border-[#243029]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#424844] dark:text-[#a0aca4] hover:bg-[#eaefeb] dark:hover:bg-[#1f2d25] rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#112e20] dark:bg-[#1e3829] hover:bg-[#9b4521] text-white text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>
                {blockType === 'FULL_DAY' ? 'Confirm Full Day Closure' : `Confirm Block (${selectedSlots.length} Slots)`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
