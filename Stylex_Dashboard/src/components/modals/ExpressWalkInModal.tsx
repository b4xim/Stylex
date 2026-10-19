import React, { useState } from 'react';
import { Appointment, ServiceItem, Stylist } from '../../types';
import { BOOKING_HEADINGS, matchesStylistGender } from '../../data/bookingHeadings';

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
  const [selectedGender, setSelectedGender] = useState<'gents' | 'ladies'>('gents');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Headings matching selected gender
  const availableHeadings = BOOKING_HEADINGS.filter((h) => h.gender === selectedGender);
  const customServices = services.filter((s) => {
    const isHeading = BOOKING_HEADINGS.some((h) => h.id === s.id || h.name.toLowerCase() === s.name.toLowerCase());
    if (isHeading) return false;
    if (!s.gender || s.gender === 'both') return true;
    return s.gender === selectedGender;
  });

  const [selectedServiceId, setSelectedServiceId] = useState(availableHeadings[0]?.id || '');
  const [selectedStylistId, setSelectedStylistId] = useState('');

  if (!isOpen) return null;

  // Filter stylists matching selected gender
  const availableStylists = stylists.filter((st) => matchesStylistGender(st.gender, selectedGender));

  // Handle gender toggle
  const handleGenderToggle = (newGender: 'gents' | 'ladies') => {
    if (newGender === selectedGender) return;
    setSelectedGender(newGender);

    const firstHeading = BOOKING_HEADINGS.find((h) => h.gender === newGender);
    if (firstHeading) {
      setSelectedServiceId(firstHeading.id);
    }

    if (selectedStylistId) {
      const isMatch = stylists.some(
        (st) => st.id === selectedStylistId && matchesStylistGender(st.gender, newGender)
      );
      if (!isMatch) {
        setSelectedStylistId('');
      }
    }
  };

  const selectedHeading = BOOKING_HEADINGS.find((h) => h.id === selectedServiceId);
  const selectedCustomService = services.find((s) => s.id === selectedServiceId);
  const currentServiceName = selectedHeading?.name || selectedCustomService?.name || availableHeadings[0]?.name || 'Hair Cut / Styling';
  const currentDurationMin = selectedHeading?.duration || selectedCustomService?.durationMin || 35;
  const currentPrice = selectedHeading?.startingPrice || selectedCustomService?.price || 250;
  const selectedStylist = stylists.find((s) => s.id === selectedStylistId);

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

    const defaultStation = selectedGender === 'gents' ? 'Styling Station Chair 1' : 'Ladies Salon Suite';

    const newBooking: Appointment = {
      id: `apt-${Date.now()}`,
      time: timeStr,
      durationMin: currentDurationMin,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || '+91 96561 11149',
      clientInitials: initials,
      serviceName: currentServiceName,
      serviceId: selectedHeading?.id || selectedCustomService?.id,
      stylistId: selectedStylist?.id,
      gender: selectedGender,
      station: selectedStylist ? selectedStylist.station : defaultStation,
      stylistName: selectedStylist ? selectedStylist.name : 'Any Available Stylist',
      stylistAvatar: selectedStylist ? selectedStylist.avatar : '',
      status: 'IN_PROGRESS',
      dateStr: 'Today',
      notes: `Express Walk-in guest seated immediately (${selectedGender === 'gents' ? 'Gents Section' : 'Ladies Salon Suite'}).`,
    };

    onAddWalkIn(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#112e20]/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c2c8c2]/50 max-h-[90vh] overflow-y-auto">
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
          {/* Gender / Department Selection Toggle */}
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] mb-1.5">
              Client Department / Section
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleGenderToggle('gents')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedGender === 'gents'
                    ? 'bg-[#112e20] text-white border-[#112e20] shadow-sm ring-2 ring-[#112e20]/20'
                    : 'bg-[#f0f5f1] text-[#424844] border-[#c2c8c2]/50 hover:bg-[#e4ebe5]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">man</span>
                <span>Gents Salon</span>
              </button>
              <button
                type="button"
                onClick={() => handleGenderToggle('ladies')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedGender === 'ladies'
                    ? 'bg-[#9b4521] text-white border-[#9b4521] shadow-sm ring-2 ring-[#9b4521]/20'
                    : 'bg-[#f0f5f1] text-[#424844] border-[#c2c8c2]/50 hover:bg-[#e4ebe5]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">woman</span>
                <span>Ladies Salon</span>
              </button>
            </div>
          </div>

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
              Requested Ritual ({selectedGender === 'gents' ? 'Gents' : 'Ladies'})
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
            >
              <optgroup label={`${selectedGender === 'gents' ? 'Gents' : 'Ladies'} Booking Catalog`}>
                {availableHeadings.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.duration} mins)
                  </option>
                ))}
              </optgroup>
              {customServices.length > 0 && (
                <optgroup label="Additional Custom Services">
                  {customServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.durationMin} mins)
                    </option>
                  ))}
                </optgroup>
              )}
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
              <option value="">Any Available Stylist (First Available)</option>
              {availableStylists.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} — {st.role || st.station}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-lg bg-[#eaefeb] text-xs text-[#424844] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#112e20]">info</span>
              <span>
                {currentServiceName} • {currentDurationMin} mins
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#112e20] uppercase tracking-wider">
              {selectedStylist ? selectedStylist.name : 'First Available'}
            </span>
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
