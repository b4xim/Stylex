import React, { useState, useEffect } from 'react';
import { Appointment, AppointmentStatus, Stylist, StylistLeave } from '../../types';
import { getWhatsAppUrl, WhatsAppIcon } from '../../utils/whatsapp';

interface ManageBookingModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  stylists: Stylist[];
  stylistLeaves?: StylistLeave[];
  onClose: () => void;
  onUpdateBooking: (updated: Appointment) => void;
  onCancelBooking: (appointmentId: string, reason?: string) => void;
  onDeleteBooking: (appointmentId: string) => void;
}

export const ManageBookingModal: React.FC<ManageBookingModalProps> = ({
  isOpen,
  appointment,
  stylists,
  stylistLeaves = [],
  onClose,
  onUpdateBooking,
  onCancelBooking,
  onDeleteBooking,
}) => {
  const [status, setStatus] = useState<AppointmentStatus>('BOOKED');
  const [time, setTime] = useState('');
  const [selectedStylistId, setSelectedStylistId] = useState('');
  const [notes, setNotes] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');

  useEffect(() => {
    if (appointment) {
      setStatus(appointment.status);
      setTime(appointment.time);
      const foundStylist = stylists.find((s) => s.name === appointment.stylistName);
      setSelectedStylistId(foundStylist ? foundStylist.id : stylists[0]?.id || '');
      setNotes(appointment.notes || '');
      setCancellationReason('');
    }
  }, [appointment, isOpen, stylists]);

  if (!isOpen || !appointment) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const stylist = stylists.find((s) => s.id === selectedStylistId);

    const updated: Appointment = {
      ...appointment,
      status,
      time: time.trim() || appointment.time,
      stylistName: stylist ? stylist.name : appointment.stylistName,
      stylistAvatar: stylist ? stylist.avatar : appointment.stylistAvatar,
      station: stylist ? stylist.station : appointment.station,
      notes: notes.trim(),
    };

    onUpdateBooking(updated);
    onClose();
  };

  const handleQuickCancel = () => {
    const reason = cancellationReason.trim() || 'Cancelled by reception management';
    onCancelBooking(appointment.id, reason);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete the reservation for ${appointment.clientName}?`)) {
      onDeleteBooking(appointment.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#112e20]/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-[#15201a] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#c2c8c2]/50 dark:border-white/10 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eaefeb] dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0f5f1] dark:bg-white/10 text-[#112e20] dark:text-[#caead5] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">tune</span>
            </div>
            <div>
              <span className="text-[11px] text-[#9b4521] dark:text-[#ff9266] uppercase tracking-wider font-bold">
                Manual Booking Control
              </span>
              <h3 className="font-serif text-2xl text-[#112e20] dark:text-white font-semibold">
                {appointment.clientName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-[#727973] hover:text-[#181d1b] dark:text-[#a0aca4] dark:hover:text-white rounded-full hover:bg-[#f0f5f1] dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Client & Service Info Banner */}
        <div className="mt-4 p-4 rounded-xl bg-[#f0f5f1] dark:bg-[#1a2520] border border-[#dfe4e0] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm text-[#112e20] dark:text-white block">
              {appointment.serviceName}
            </span>
            <div className="text-[#424844] dark:text-[#a0aca4] flex items-center gap-2 flex-wrap">
              <span className="font-medium text-[#181d1b] dark:text-white">{appointment.clientPhone}</span>
              <span>•</span>
              <span className="font-semibold text-[#9b4521] dark:text-[#ff9266]">
                {appointment.clientTier || 'Standard Guest'}
              </span>
            </div>
            {appointment.clientEmail && (
              <div className="flex items-center gap-1.5 text-xs text-[#2d6a4f] dark:text-[#86efac] font-medium mt-0.5">
                <span className="material-symbols-outlined text-[14px]">mail</span>
                <span>{appointment.clientEmail}</span>
              </div>
            )}
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 shrink-0">
            <div className="text-left sm:text-right">
              <span className="font-bold text-xs text-[#112e20] dark:text-white block">
                {appointment.time}
              </span>
              <span className="text-[11px] text-[#424844] dark:text-[#a0aca4] mt-0.5 block">
                {appointment.station}
              </span>
            </div>

            {/* Direct WhatsApp Action Button */}
            <a
              href={getWhatsAppUrl(appointment.clientPhone, appointment.clientName, appointment.serviceName, appointment.dateStr, appointment.time)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer group"
              title={`Chat with ${appointment.clientName} directly on WhatsApp`}
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4.5">
          {/* Status Override Pills */}
          <div>
            <label className="block text-xs font-bold text-[#181d1b] dark:text-white mb-2 uppercase tracking-wider">
              Booking Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setStatus('BOOKED')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                  status === 'BOOKED'
                    ? 'bg-[#112e20] dark:bg-emerald-600 text-white border-[#112e20] dark:border-emerald-500 shadow-sm ring-2 ring-[#112e20]/15 dark:ring-emerald-400/20'
                    : 'bg-[#f0f5f1] dark:bg-white/5 text-[#112e20] dark:text-[#caead5] border-transparent hover:bg-[#e5e9e6] dark:hover:bg-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Booked</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('IN_PROGRESS')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                  status === 'IN_PROGRESS'
                    ? 'bg-[#9b4521] dark:bg-amber-600 text-white border-[#9b4521] dark:border-amber-500 shadow-sm ring-2 ring-[#9b4521]/15 dark:ring-amber-400/20'
                    : 'bg-[#f0f5f1] dark:bg-white/5 text-[#9b4521] dark:text-[#ff9266] border-transparent hover:bg-[#e5e9e6] dark:hover:bg-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>In Progress</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('COMPLETED')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                  status === 'COMPLETED'
                    ? 'bg-[#284435] dark:bg-teal-700 text-white border-[#284435] dark:border-teal-600 shadow-sm ring-2 ring-[#284435]/15 dark:ring-teal-400/20'
                    : 'bg-[#f0f5f1] dark:bg-white/5 text-[#284435] dark:text-teal-300 border-transparent hover:bg-[#e5e9e6] dark:hover:bg-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-300 dark:bg-teal-300"></span>
                <span>Completed</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('CANCELLED')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                  status === 'CANCELLED'
                    ? 'bg-[#ba1a1a] dark:bg-rose-700 text-white border-[#ba1a1a] dark:border-rose-600 shadow-sm ring-2 ring-[#ba1a1a]/15 dark:ring-rose-400/20'
                    : 'bg-[#ffdad6]/60 dark:bg-rose-950/30 text-[#ba1a1a] dark:text-rose-300 border-transparent hover:bg-[#ffdad6] dark:hover:bg-rose-950/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span>Cancelled</span>
              </button>
            </div>
          </div>

          {/* Time & Stylist Reassignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#181d1b] dark:text-white mb-1.5">
                Scheduled Time Slot
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 11:30 AM"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] dark:bg-[#1a2520] border border-[#c2c8c2]/40 dark:border-white/10 text-sm text-[#181d1b] dark:text-white focus:bg-white dark:focus:bg-[#15201a] focus:ring-1 focus:ring-[#112e20] dark:focus:ring-emerald-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#181d1b] dark:text-white mb-1.5">
                Reassign Stylist & Station
              </label>
              <select
                value={selectedStylistId}
                onChange={(e) => setSelectedStylistId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] dark:bg-[#1a2520] border border-[#c2c8c2]/40 dark:border-white/10 text-sm text-[#181d1b] dark:text-white focus:bg-white dark:focus:bg-[#15201a] focus:ring-1 focus:ring-[#112e20] dark:focus:ring-emerald-500 outline-none transition-colors"
              >
                {stylists.map((st) => {
                  const matchLeave = stylistLeaves.find(
                    (l) => (l.stylistId === st.id || l.stylistName.toLowerCase() === st.name.toLowerCase()) &&
                           (appointment?.dateStr === l.date || appointment?.dateStr === 'Today')
                  );
                  return (
                    <option key={st.id} value={st.id} className="dark:bg-[#15201a] dark:text-white">
                      {st.name} ({st.station}){matchLeave ? ` • ⚠️ [On Leave: ${matchLeave.duration === 'FULL_DAY' ? 'Full Day' : matchLeave.duration === 'FIRST_HALF' ? 'Morning' : 'Evening'}]` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Operational Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] dark:text-white mb-1.5">
              Operational Notes & Special Instructions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Client requested 10-minute scalp massage; requested senior stylist..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#f0f5f1] dark:bg-[#1a2520] border border-[#c2c8c2]/40 dark:border-white/10 text-sm text-[#181d1b] dark:text-white focus:bg-white dark:focus:bg-[#15201a] focus:ring-1 focus:ring-[#112e20] dark:focus:ring-emerald-500 outline-none transition-colors"
            />
          </div>

          {/* Quick Cancel Section (if status is not yet cancelled) */}
          {status !== 'CANCELLED' && (
            <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/30 transition-all space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[16px]">event_busy</span>
                  </span>
                  <div>
                    <span className="text-xs font-bold text-rose-900 dark:text-rose-300 block">
                      Quick Cancel Reservation
                    </span>
                    <span className="text-[11px] text-rose-700/80 dark:text-rose-400/80 block">
                      Instantly mark as cancelled with an optional note
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleQuickCancel}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                  <span>Cancel Booking</span>
                </button>
              </div>
              <input
                type="text"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Reason (e.g. Guest requested reschedule, emergency, no-show)"
                className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-[#121915] border border-rose-200/80 dark:border-rose-900/40 text-xs text-[#181d1b] dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-rose-400 dark:focus:border-rose-500/60 focus:ring-1 focus:ring-rose-400/30 dark:focus:ring-rose-500/20 outline-none transition-all"
              />
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#eaefeb] dark:border-white/10">
            <button
              type="button"
              onClick={handleDelete}
              className="h-9 px-3.5 rounded-xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/60 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer btn-delete-action"
            >
              <span className="material-symbols-outlined text-[16px] text-current">delete</span>
              <span>Delete Booking</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#424844] dark:text-[#a0aca4] hover:bg-[#eaefeb] dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#112e20] dark:bg-emerald-600 text-white text-xs font-semibold hover:bg-[#284435] dark:hover:bg-emerald-500 transition-all shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
