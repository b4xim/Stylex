import React, { useState } from 'react';
import { Appointment, ServiceItem, Stylist } from '../../types';

interface ExpressWalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  stylists: Stylist[];
  onAddWalkIn: (booking: Appointment) => void;
}

export const ExpressWalkInModal: React.FC<ExpressWalkInModalProps> = ({
  isOpen,
  onClose,
  services,
  stylists,
  onAddWalkIn,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(services[2]?.id || services[0]?.id || '');
  const [selectedStylistId, setSelectedStylistId] = useState(stylists[0]?.id || '');

  if (!isOpen) return null;

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedStylist = stylists.find((s) => s.id === selectedStylistId) || stylists[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const initials = clientName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'WI';

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeStr = `${formattedHours}:${formattedMinutes} ${ampm}`;

    const newBooking: Appointment = {
      id: `apt-${Date.now()}`,
      time: timeStr,
      durationMin: selectedService?.durationMin || 45,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || '+91 96561 11149',
      clientInitials: initials,
      serviceName: selectedService ? selectedService.name : 'Express Styling Ritual',
      station: selectedStylist ? selectedStylist.station : 'Styling Station Chair 1',
      stylistName: selectedStylist ? selectedStylist.name : 'Niya',
      stylistAvatar: selectedStylist ? selectedStylist.avatar : '',
      status: 'IN_PROGRESS',
      dateStr: 'Today',
      notes: 'Express Walk-in guest seated immediately.',
    };

    onAddWalkIn(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#112e20]/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c2c8c2]/50">
        <div className="flex items-center justify-between pb-4 border-b border-[#eaefeb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ffdbcf] text-[#9b4521] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
            </div>
            <div>
              <span className="text-[11px] text-[#9b4521] uppercase tracking-wider font-bold">
                Direct Reception Entry
              </span>
              <h3 className="font-serif text-2xl text-[#112e20]">Express Walk-in</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#727973] hover:text-[#181d1b] rounded-full hover:bg-[#f0f5f1] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] mb-1">
              Guest Name
            </label>
            <input
              required
              autoFocus
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

          <div>
            <label className="block text-xs font-semibold text-[#181d1b] mb-1">
              Requested Ritual
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
              Assign Available Stylist
            </label>
            <select
              value={selectedStylistId}
              onChange={(e) => setSelectedStylistId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
            >
              {stylists.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} — {st.station}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-lg bg-[#eaefeb] text-xs text-[#424844] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#112e20]">info</span>
            <span>Will be seated immediately in session at assigned station.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-[#424844] hover:bg-[#eaefeb] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#9b4521] text-white text-xs font-semibold hover:bg-[#752906] transition-all shadow-md cursor-pointer"
            >
              Seat Guest In Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
