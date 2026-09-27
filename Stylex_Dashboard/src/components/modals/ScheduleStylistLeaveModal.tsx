import React, { useState, useEffect } from 'react';
import { Stylist, StylistLeave, LeaveDuration, Appointment } from '../../types';

interface ScheduleStylistLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  stylists: Stylist[];
  initialStylistId?: string;
  appointments: Appointment[];
  onAddLeave: (leave: StylistLeave) => void;
}

export const ScheduleStylistLeaveModal: React.FC<ScheduleStylistLeaveModalProps> = ({
  isOpen,
  onClose,
  stylists,
  initialStylistId,
  appointments,
  onAddLeave,
}) => {
  const [selectedStylistId, setSelectedStylistId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [duration, setDuration] = useState<LeaveDuration>('FULL_DAY');
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    if (initialStylistId) {
      setSelectedStylistId(initialStylistId);
    } else if (stylists.length > 0) {
      setSelectedStylistId(stylists[0].id);
    }
  }, [initialStylistId, stylists, isOpen]);

  // Default to tomorrow's date if not set
  useEffect(() => {
    if (isOpen && !selectedDate) {
      const tmrw = new Date();
      tmrw.setDate(tmrw.getDate() + 1);
      const yyyy = tmrw.getFullYear();
      const mm = String(tmrw.getMonth() + 1).padStart(2, '0');
      const dd = String(tmrw.getDate()).padStart(2, '0');
      setSelectedDate(`${yyyy}-${mm}-${dd}`);
    }
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  const currentStylist = stylists.find((s) => s.id === selectedStylistId) || stylists[0];

  // Check if there are existing bookings for this stylist on that date
  const conflictingBookings = appointments.filter((apt) => {
    const isSameStylist = apt.stylistName.toLowerCase() === currentStylist?.name.toLowerCase();
    const isSameDate = apt.dateStr === selectedDate;
    return isSameStylist && isSameDate && apt.status !== 'CANCELLED';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStylistId || !selectedDate) return;

    const newLeave: StylistLeave = {
      id: `leave-${Date.now()}`,
      stylistId: selectedStylistId,
      stylistName: currentStylist?.name || 'Stylist',
      date: selectedDate,
      duration,
      reason: reason.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddLeave(newLeave);
    setReason('');
    onClose();
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#112e20]/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#c2c8c2]/50 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eaefeb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ffdad6]/60 text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">person_off</span>
            </div>
            <div>
              <span className="text-[11px] text-[#9b4521] uppercase tracking-wider font-bold">
                Roster & Availability Control
              </span>
              <h3 className="font-serif text-2xl text-[#112e20]">Schedule Stylist Leave</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#727973] hover:text-[#181d1b] rounded-full hover:bg-[#f0f5f1] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Stylist Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] mb-1.5">
              Select Artisan / Stylist
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {stylists.map((st) => {
                const isSelected = st.id === selectedStylistId;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStylistId(st.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#112e20] bg-[#caead5]/20 ring-1 ring-[#112e20]'
                        : 'border-[#eaefeb] hover:bg-[#f0f5f1]'
                    }`}
                  >
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#c2c8c2]/40"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#112e20] truncate">{st.name}</p>
                      <p className="text-[10px] text-[#727973] truncate">{st.role}</p>
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[#112e20] text-[18px]">
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] mb-1.5">
              Future Leave Date
            </label>
            <input
              type="date"
              required
              min={todayStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
            />
          </div>

          {/* Leave Duration Selection: Full-day vs Half-day */}
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] mb-1.5">
              Leave Duration & Schedule Window
            </label>
            <div className="grid grid-cols-1 gap-2">
              <label
                onClick={() => setDuration('FULL_DAY')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  duration === 'FULL_DAY'
                    ? 'border-[#ba1a1a] bg-[#ffdad6]/25 ring-1 ring-[#ba1a1a]'
                    : 'border-[#eaefeb] hover:bg-[#f0f5f1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">event_busy</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#112e20] block">Full Day Off</span>
                    <span className="text-[11px] text-[#727973]">
                      Entire working day (10:00 AM – 01:00 AM). Fully disabled from bookings.
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="leaveDuration"
                  checked={duration === 'FULL_DAY'}
                  onChange={() => setDuration('FULL_DAY')}
                  className="accent-[#ba1a1a] w-4 h-4 ml-2"
                />
              </label>

              <label
                onClick={() => setDuration('FIRST_HALF')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  duration === 'FIRST_HALF'
                    ? 'border-[#9b4521] bg-[#ffe088]/20 ring-1 ring-[#9b4521]'
                    : 'border-[#eaefeb] hover:bg-[#f0f5f1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ffe088]/50 text-[#735c00] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">wb_sunny</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#112e20] block">
                      Half Day • First Half (Morning Shift)
                    </span>
                    <span className="text-[11px] text-[#727973]">
                      Off 10:00 AM – 04:30 PM. Available for evening bookings from 04:30 PM.
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="leaveDuration"
                  checked={duration === 'FIRST_HALF'}
                  onChange={() => setDuration('FIRST_HALF')}
                  className="accent-[#9b4521] w-4 h-4 ml-2"
                />
              </label>

              <label
                onClick={() => setDuration('SECOND_HALF')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  duration === 'SECOND_HALF'
                    ? 'border-[#9b4521] bg-[#ffe088]/20 ring-1 ring-[#9b4521]'
                    : 'border-[#eaefeb] hover:bg-[#f0f5f1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ffe088]/50 text-[#735c00] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">bedtime</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#112e20] block">
                      Half Day • Second Half (Evening Shift)
                    </span>
                    <span className="text-[11px] text-[#727973]">
                      Available morning until 04:30 PM. Off 04:30 PM – 01:00 AM.
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="leaveDuration"
                  checked={duration === 'SECOND_HALF'}
                  onChange={() => setDuration('SECOND_HALF')}
                  className="accent-[#9b4521] w-4 h-4 ml-2"
                />
              </label>
            </div>
          </div>

          {/* Reason / Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] mb-1.5">
              Reason / Operational Roster Note
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Personal emergency, Academy workshop, Family leave"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
            />
          </div>

          {/* Conflict Warning if existing bookings match */}
          {conflictingBookings.length > 0 && (
            <div className="p-3 bg-[#ffdad6]/40 border border-[#ffdad6] rounded-xl flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[20px] shrink-0 mt-0.5">
                warning
              </span>
              <div className="text-xs text-[#410002]">
                <p className="font-bold">
                  {conflictingBookings.length} Existing Booking(s) on this Date:
                </p>
                <p className="mt-0.5">
                  {conflictingBookings.map((b) => `${b.clientName} (${b.time})`).join(', ')}.
                  You can reassign them in the Reservations Ledger via the "Manage" button.
                </p>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#eaefeb]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#727973] hover:text-[#181d1b] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#112e20] hover:bg-[#9b4521] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Confirm Stylist Leave</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
