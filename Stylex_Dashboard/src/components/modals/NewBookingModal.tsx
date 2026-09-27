import React, { useState } from 'react';
import { Appointment, ServiceItem, Stylist, StylistLeave, BlackoutDate } from '../../types';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  stylists: Stylist[];
  stylistLeaves?: StylistLeave[];
  blackoutDates?: BlackoutDate[];
  onAddBooking: (booking: Appointment) => void;
  initialDate?: string;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  isOpen,
  onClose,
  services,
  stylists,
  stylistLeaves = [],
  blackoutDates = [],
  onAddBooking,
  initialDate,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientTier, setClientTier] = useState<Appointment['clientTier']>('VIP Platinum');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedStylistId, setSelectedStylistId] = useState(stylists[0]?.id || '');
  const [time, setTime] = useState('11:00 AM');
  const todayYMD = new Date().toISOString().split('T')[0];
  const [dateStr, setDateStr] = useState(initialDate || todayYMD);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setDateStr(initialDate || new Date().toISOString().split('T')[0]);
    }
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedStylist = stylists.find((s) => s.id === selectedStylistId) || stylists[0];

  const targetDateYMD = dateStr.toLowerCase() === 'today' ? todayYMD : dateStr;

  const activeBlackouts = blackoutDates.filter((b) => {
    if (!b.dateStr) return false;
    return b.dateStr === targetDateYMD || (dateStr.toLowerCase() === 'today' && b.dateStr === todayYMD);
  });

  const fullDayClosure = activeBlackouts.find((b) => b.blockType === 'FULL_DAY');
  const blockedSlotsList: string[] = [];
  activeBlackouts.forEach((b) => {
    if (b.blockType === 'TIME_SLOTS' && b.slots) {
      blockedSlotsList.push(...b.slots);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    if (fullDayClosure) {
      alert(`Cannot book: Salon has a scheduled full day closure on this date.`);
      return;
    }

    if (blockedSlotsList.includes(time)) {
      alert(`Cannot book: Time slot "${time}" is blocked in Schedule Control.`);
      return;
    }

    const initials = clientName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'GT';

    const newBooking: Appointment = {
      id: `apt-${Date.now()}`,
      time,
      durationMin: selectedService?.durationMin || 60,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || '+91 96561 11149',
      clientEmail: clientEmail.trim() || undefined,
      clientInitials: initials,
      clientTier,
      serviceName: selectedService ? selectedService.name : 'Custom Atelier Ritual',
      station: selectedStylist ? selectedStylist.station : 'Styling Station Chair 1',
      stylistName: selectedStylist ? selectedStylist.name : 'Niya',
      stylistAvatar: selectedStylist ? selectedStylist.avatar : '',
      status: 'BOOKED',
      dateStr,
      notes: notes.trim(),
    };

    onAddBooking(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#112e20]/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#c2c8c2]/50 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#eaefeb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f0f5f1] text-[#112e20] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">calendar_add_on</span>
            </div>
            <div>
              <span className="text-[11px] text-[#9b4521] uppercase tracking-wider font-bold">
                Guest Reservation
              </span>
              <h3 className="font-serif text-2xl text-[#112e20]">New Client Booking</h3>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#181d1b] mb-1">
                Guest Full Name
              </label>
              <input
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Athira P"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#181d1b] mb-1">
                Phone Number
              </label>
              <input
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+91 98470 12345"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#181d1b] mb-1">
                Guest Email Address (Optional)
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="guest@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#181d1b] mb-1">
                Client Distinction
              </label>
              <select
                value={clientTier}
                onChange={(e) => setClientTier(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
              >
                <option value="VIP Platinum">VIP Platinum</option>
                <option value="VIP Gold">VIP Gold</option>
                <option value="VIP Member">VIP Member</option>
                <option value="New Guest">New Guest</option>
                <option value="Standard">Standard Client</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#181d1b] mb-1">
                Date & Manifest
              </label>
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#181d1b] mb-1">
                Salon Ritual / Service
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.durationMin} mins)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#181d1b] mb-1">
                Assigned Artisan / Stylist
              </label>
              <select
                value={selectedStylistId}
                onChange={(e) => setSelectedStylistId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
              >
                {stylists.map((st) => {
                  const hasLeave = stylistLeaves.find(
                    (l) => l.stylistId === st.id || l.stylistName.toLowerCase() === st.name.toLowerCase()
                  );
                  return (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.role}){hasLeave ? ` • ⚠️ [On Leave: ${hasLeave.date}]` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Selected Stylist Leave Warning */}
          {(() => {
            const leave = stylistLeaves.find(
              (l) => l.stylistId === selectedStylistId || l.stylistName.toLowerCase() === selectedStylist?.name.toLowerCase()
            );
            if (!leave) return null;
            return (
              <div className="p-2.5 bg-[#ffe088]/30 border border-[#ffe088] rounded-xl flex items-center gap-2 text-xs text-[#735c00]">
                <span className="material-symbols-outlined text-[18px]">info</span>
                <span>
                  <strong>Roster Notice:</strong> {selectedStylist?.name} has scheduled leave on{' '}
                  <strong>{leave.date}</strong> ({leave.duration === 'FULL_DAY' ? 'Full Day' : leave.duration === 'FIRST_HALF' ? 'Morning Shift' : 'Evening Shift'}).
                </span>
              </div>
            );
          })()}

          {/* Full Day Closure Warning */}
          {fullDayClosure && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
              <span className="material-symbols-outlined text-[18px] text-red-600 mt-0.5">do_not_disturb_on</span>
              <div>
                <strong className="block text-red-900 font-semibold">
                  Date Blocked (Full Day Closure)
                </strong>
                <span>This date is closed for bookings in Schedule Control ({fullDayClosure.station || 'Entire Salon'}).</span>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#181d1b]">
                Time Slot (1-Hour)
              </label>
              {blockedSlotsList.length > 0 && (
                <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock_clock</span>
                  {blockedSlotsList.length} slot{blockedSlotsList.length > 1 ? 's' : ''} blocked
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {[
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
              ].map((slot) => {
                const isBlocked = !!fullDayClosure || blockedSlotsList.includes(slot);
                return (
                  <button
                    type="button"
                    key={slot}
                    disabled={isBlocked}
                    onClick={() => setTime(slot)}
                    className={`py-2 px-1 text-xs rounded-lg font-medium transition-all relative text-center ${
                      isBlocked
                        ? 'bg-red-50 text-red-400 border border-red-200 line-through cursor-not-allowed opacity-60'
                        : time === slot
                        ? 'bg-[#112e20] text-white shadow-xs font-bold'
                        : 'bg-[#f0f5f1] text-[#181d1b] hover:bg-[#eaefeb]'
                    }`}
                  >
                    <span>{slot}</span>
                    {isBlocked && (
                      <span className="block text-[8px] font-bold text-red-600 no-underline tracking-tighter">
                        Blocked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#181d1b] mb-1">
              Client Consultation & Preferences
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Beverage preference, hair formula history, scalp sensitivity notes..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
            />
          </div>

          {/* Reservation Summary */}
          <div className="p-3.5 rounded-xl bg-[#f0f5f1] border border-[#dfe4e0] flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-[#112e20]">Estimated Duration: {selectedService?.durationMin || 60} mins</span>
              <p className="text-[#424844] mt-0.5">Assigned to stylist station upon guest arrival</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#112e20] text-white font-bold text-[11px] uppercase tracking-wider">
              Confirmed Booking
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-[#424844] hover:bg-[#eaefeb] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#9b4521] text-white text-xs font-semibold hover:bg-[#752906] transition-all shadow-md cursor-pointer"
            >
              Confirm & Book Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
