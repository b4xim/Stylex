import React, { useState } from 'react';
import { Appointment, ServiceItem, Stylist, StylistLeave, BlackoutDate } from '../../types';
import { BOOKING_HEADINGS, matchesStylistGender, DASHBOARD_BOOKING_SLOTS } from '../../data/bookingHeadings';

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
  const [selectedGender, setSelectedGender] = useState<'gents' | 'ladies'>('gents');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  
  // Initialize with first heading of gents
  const defaultHeading = BOOKING_HEADINGS.find((h) => h.gender === 'gents');
  const [selectedServiceId, setSelectedServiceId] = useState(defaultHeading?.id || '');
  const [selectedStylistId, setSelectedStylistId] = useState(''); // "" = Any Available Stylist
  const [time, setTime] = useState('11:00 AM');
  const [isCustomTime, setIsCustomTime] = useState(false);
  const todayYMD = new Date().toISOString().split('T')[0];
  const [dateStr, setDateStr] = useState(initialDate || todayYMD);
  const [notes, setNotes] = useState('');
  const [slotOccupancy, setSlotOccupancy] = useState<Record<string, { bookedCount: number; maxCapacity: number; status: 'available' | 'filling_fast' | 'full'; isAvailable: boolean }>>({});

  const targetDateYMD = dateStr.toLowerCase() === 'today' ? todayYMD : dateStr;

  // Headings and custom services matching selected gender
  const availableHeadings = BOOKING_HEADINGS.filter((h) => h.gender === selectedGender);
  const customServices = services.filter((s) => {
    // Only include services that aren't already represented by a canonical heading
    const isHeading = BOOKING_HEADINGS.some((h) => h.id === s.id || h.name.toLowerCase() === s.name.toLowerCase());
    if (isHeading) return false;
    if (!s.gender || s.gender === 'both') return true;
    return s.gender === selectedGender;
  });

  // Stylists matching selected gender
  const availableStylists = stylists.filter((st) => matchesStylistGender(st.gender, selectedGender));

  // Resolved selected service details
  const selectedHeading = BOOKING_HEADINGS.find((h) => h.id === selectedServiceId);
  const selectedCustomService = services.find((s) => s.id === selectedServiceId);
  const currentServiceName = selectedHeading?.name || selectedCustomService?.name || availableHeadings[0]?.name || 'Hair Cut / Styling';
  const currentDurationMin = selectedHeading?.duration || selectedCustomService?.durationMin || 35;
  const currentPrice = selectedHeading?.startingPrice || selectedCustomService?.price || 250;

  // Resolved selected stylist
  const selectedStylist = stylists.find((s) => s.id === selectedStylistId);

  // Handle gender switch
  const handleGenderToggle = (newGender: 'gents' | 'ladies') => {
    if (newGender === selectedGender) return;
    setSelectedGender(newGender);

    const firstHeading = BOOKING_HEADINGS.find((h) => h.gender === newGender);
    if (firstHeading) {
      setSelectedServiceId(firstHeading.id);
    }

    // Check if currently selected stylist matches new gender
    if (selectedStylistId) {
      const isMatch = stylists.some(
        (st) => st.id === selectedStylistId && matchesStylistGender(st.gender, newGender)
      );
      if (!isMatch) {
        setSelectedStylistId(''); // Reset to Any Available Stylist
      }
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setDateStr(initialDate || new Date().toISOString().split('T')[0]);
    }
  }, [isOpen, initialDate]);

  // Fetch real-time slot occupancy matching selected gender & date
  React.useEffect(() => {
    if (!isOpen) return;
    const fetchSlots = async () => {
      try {
        const res = await fetch(`/api/bookings/slots?date=${targetDateYMD}&gender=${selectedGender}`);
        if (!res.ok) return;
        const json = await res.json().catch(() => null);
        if (json?.success && Array.isArray(json?.data)) {
          const map: Record<string, any> = {};
          json.data.forEach((s: any) => {
            map[s.timeSlot] = s;
          });
          setSlotOccupancy(map);
        }
      } catch {}
    };
    fetchSlots();
  }, [isOpen, targetDateYMD, selectedGender]);

  if (!isOpen) return null;

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
      const proceed = window.confirm(`Notice: Salon has a scheduled full day closure on this date (${fullDayClosure.station || 'Entire Salon'}). Do you want to proceed as Salon Admin?`);
      if (!proceed) return;
    }

    if (blockedSlotsList.includes(time)) {
      const proceed = window.confirm(`Notice: Time slot "${time}" is marked as blocked in Schedule Control. Do you want to proceed as Salon Admin?`);
      if (!proceed) return;
    }

    const initials = clientName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'GT';

    const defaultStation = selectedGender === 'gents' ? 'Styling Station Chair 1' : 'Ladies Salon Suite';

    const newBooking: Appointment = {
      id: `apt-${Date.now()}`,
      time,
      durationMin: currentDurationMin,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || '+91 96561 11149',
      clientEmail: clientEmail.trim() || undefined,
      clientInitials: initials,
      serviceName: currentServiceName,
      serviceId: selectedHeading?.id || selectedCustomService?.id,
      stylistId: selectedStylist?.id,
      gender: selectedGender,
      station: selectedStylist ? selectedStylist.station : defaultStation,
      stylistName: selectedStylist ? selectedStylist.name : 'Any Available Stylist',
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
          {/* Gender / Department Selection Toggle */}
          <div>
            <label className="block text-xs font-semibold text-[#181d1b] mb-1.5">
              Client Department / Section
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleGenderToggle('gents')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedGender === 'gents'
                    ? 'bg-[#112e20] text-white border-[#112e20] shadow-sm ring-2 ring-[#112e20]/20'
                    : 'bg-[#f0f5f1] text-[#424844] border-[#c2c8c2]/50 hover:bg-[#e4ebe5]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">man</span>
                <span>Gents Salon</span>
              </button>
              <button
                type="button"
                onClick={() => handleGenderToggle('ladies')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedGender === 'ladies'
                    ? 'bg-[#9b4521] text-white border-[#9b4521] shadow-sm ring-2 ring-[#9b4521]/20'
                    : 'bg-[#f0f5f1] text-[#424844] border-[#c2c8c2]/50 hover:bg-[#e4ebe5]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">woman</span>
                <span>Ladies Salon</span>
              </button>
            </div>
          </div>

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
                Salon Ritual / Service ({selectedGender === 'gents' ? 'Gents' : 'Ladies'})
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
                Assigned Artisan / Stylist
              </label>
              <select
                value={selectedStylistId}
                onChange={(e) => setSelectedStylistId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f0f5f1] border border-[#c2c8c2]/40 text-sm focus:bg-white focus:ring-1 focus:ring-[#112e20] outline-none"
              >
                <option value="">Any Available Stylist (First Available)</option>
                {availableStylists.map((st) => {
                  const hasLeave = stylistLeaves.find(
                    (l) => l.stylistId === st.id || l.stylistName.toLowerCase() === st.name.toLowerCase()
                  );
                  return (
                    <option key={st.id} value={st.id}>
                      {st.name} — {st.role || st.station}{hasLeave ? ` • ⚠️ [On Leave: ${hasLeave.date}]` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Selected Stylist Leave Warning */}
          {selectedStylistId && (() => {
            const leave = stylistLeaves.find(
              (l) => l.stylistId === selectedStylistId || (selectedStylist?.name && l.stylistName && l.stylistName.toLowerCase() === selectedStylist.name.toLowerCase())
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
              <label className="block text-xs font-semibold text-[#181d1b] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#2d6a4f]">schedule</span>
                <span>Time Slot ({selectedGender === 'gents' ? 'Gents Section' : 'Ladies Salon Suite'})</span>
              </label>
              <div className="flex items-center gap-2">
                {blockedSlotsList.length > 0 && (
                  <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">lock_clock</span>
                    {blockedSlotsList.length} blocked
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsCustomTime(!isCustomTime)}
                  className="text-[11px] text-[#2d6a4f] hover:text-[#112e20] font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                >
                  {isCustomTime ? 'Select from list' : 'Custom time'}
                </button>
              </div>
            </div>

            {isCustomTime ? (
              <div className="space-y-1">
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 10:20 AM or 11:45 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] border border-[#c2c8c2]/50 text-sm font-semibold text-[#181d1b] focus:bg-white focus:ring-2 focus:ring-[#112e20]/20 focus:border-[#112e20] outline-none"
                />
                <p className="text-[11px] text-[#5c6460]">Enter any operating time between 10:00 AM – 1:00 AM.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="relative">
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-xl bg-[#f0f5f1] border border-[#c2c8c2]/50 text-sm font-semibold text-[#181d1b] focus:bg-white focus:ring-2 focus:ring-[#112e20]/20 focus:border-[#112e20] outline-none transition-all cursor-pointer shadow-2xs"
                  >
                    {!DASHBOARD_BOOKING_SLOTS.some((s) => s.value === time) && (
                      <option value={time}>{time} (Custom / Active)</option>
                    )}

                    {(['Morning', 'Afternoon', 'Evening', 'Night & Late Night'] as const).map((groupName) => {
                      const groupSlots = DASHBOARD_BOOKING_SLOTS.filter((s) => s.group === groupName);
                      return (
                        <optgroup key={groupName} label={groupName} className="font-bold text-gray-700">
                          {groupSlots.map((slotObj) => {
                            const slot = slotObj.value;
                            const isBlocked = !!fullDayClosure || blockedSlotsList.includes(slot);
                            const occ = slotOccupancy[slot];
                            const bookedCount = occ?.bookedCount || 0;
                            let statusText = '';
                            if (isBlocked) statusText = ' [Blocked in Schedule]';
                            else if (occ && occ.status === 'full') statusText = ` [Full • ${bookedCount} Booked]`;
                            else if (occ && occ.status === 'filling_fast') statusText = ` [Filling Fast • ${bookedCount} Booked]`;
                            else if (bookedCount > 0) statusText = ` [${bookedCount} Booked]`;

                            return (
                              <option key={slot} value={slot} className="font-medium text-gray-900 py-1">
                                {slotObj.label}{statusText}
                              </option>
                            );
                          })}
                        </optgroup>
                      );
                    })}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#5c6460]">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#5c6460] px-1">
                  <span className="flex items-center gap-1 font-medium text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>10:00 AM – 1:00 AM Daily Range</span>
                  </span>
                  <span>15-min increments • Direct salon booking</span>
                </div>
              </div>
            )}
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
              <span className="font-semibold text-[#112e20]">
                {currentServiceName} ({selectedGender === 'gents' ? 'Gents' : 'Ladies'})
              </span>
              <p className="text-[#424844] mt-0.5">
                Estimated Duration: {currentDurationMin} mins
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#112e20] text-white font-bold text-[11px] uppercase tracking-wider">
              {selectedStylist ? selectedStylist.name : 'First Available Stylist'}
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
