import React, { useState, useEffect } from 'react';
import { SERVICES, MASTER_ARTISANS, TIME_SLOTS, SALON_DATA } from '../data/salonData.ts';
import { BookingState } from '../types.ts';

interface BookingEngineProps {
  onConfirmBooking: (booking: BookingState) => void;
  initialServiceId?: string;
  showHeader?: boolean;
}

export const BookingEngine: React.FC<BookingEngineProps> = ({
  onConfirmBooking,
  initialServiceId,
  showHeader = true,
}) => {
  // Gender / Department selection (Gents vs Ladies)
  const initialService = SERVICES.find((s) => s.id === initialServiceId);
  const initialGender: 'gents' | 'ladies' = initialService?.gender === 'gents' ? 'gents' : 'ladies';

  const [selectedGender, setSelectedGender] = useState<'gents' | 'ladies'>(initialGender);

  // Available services filtered by selected gender
  const availableServices = SERVICES.filter(
    (s) => s.gender === selectedGender || s.gender === 'both'
  );

  // Default service for selected gender
  const defaultService =
    (initialService && (initialService.gender === selectedGender || initialService.gender === 'both'))
      ? initialService
      : availableServices[0];

  const [selectedService, setSelectedService] = useState(defaultService);

  // Available artisans filtered by selected gender
  const availableArtisans = MASTER_ARTISANS.filter(
    (a) => a.gender === selectedGender || a.gender === 'both'
  );

  const [selectedArtisan, setSelectedArtisan] = useState('Any Artisan');

  // When gender changes, automatically update services and stylists
  const handleGenderChange = (newGender: 'gents' | 'ladies') => {
    if (newGender === selectedGender) return;
    setSelectedGender(newGender);

    const newServices = SERVICES.filter((s) => s.gender === newGender || s.gender === 'both');
    if (newServices.length > 0) {
      setSelectedService(newServices[0]);
    }

    const newArtisans = MASTER_ARTISANS.filter((a) => a.gender === newGender || a.gender === 'both');
    // If an artisan was selected that is specific to the old gender, reset to 'Any Artisan'
    if (selectedArtisan !== 'Any Artisan' && !newArtisans.some((a) => a.name === selectedArtisan)) {
      setSelectedArtisan('Any Artisan');
    }
  };

  // Sync if initialServiceId changes externally
  useEffect(() => {
    if (!initialServiceId) return;
    const found = SERVICES.find((s) => s.id === initialServiceId);
    if (found) {
      const g = found.gender === 'gents' ? 'gents' : 'ladies';
      setSelectedGender(g);
      setSelectedService(found);
      const filteredArtisans = MASTER_ARTISANS.filter((a) => a.gender === g || a.gender === 'both');
      if (selectedArtisan !== 'Any Artisan' && !filteredArtisans.some((a) => a.name === selectedArtisan)) {
        setSelectedArtisan('Any Artisan');
      }
    }
  }, [initialServiceId]);

  // Month & Day selection
  const now = new Date();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number>(now.getDate());

  // Time selection
  const timeSlots = TIME_SLOTS;
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[0]);

  // Notes & Submission
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [showCalendarOnMobile, setShowCalendarOnMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Quick 7 days for mobile 1-tap booking
  const next7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dayNum: d.getDate(),
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
      dayLabel: i === 0 ? 'Today' : i === 1 ? 'Tmrw' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
      dateStr: `${d.getDate()} ${monthNames[d.getMonth()].slice(0, 3)}`,
    };
  });

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  const handleServiceChange = (serviceId: string) => {
    const s = availableServices.find((item) => item.id === serviceId);
    if (s) setSelectedService(s);
  };

  // Calculations
  const servicePrice = selectedService.price;
  const deposit = Math.round(servicePrice * 0.25);
  const balance = servicePrice - deposit;

  const dateObj = new Date(currentYear, currentMonthIndex, selectedDay);
  const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
  const dateString = `${dayName}, ${monthNames[currentMonthIndex].slice(0, 3)} ${selectedDay}, ${currentYear}`;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmBooking({
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        price: selectedService.price,
        duration: selectedService.duration,
        date: dateString,
        dayOfMonth: selectedDay,
        time: selectedTime,
        stylist: selectedArtisan,
        notes: notes,
        beverage: 'Complimentary Artisanal Herbal Drink',
        gender: selectedGender,
      });
    }, 600);
  };

  // Generate calendar days for October 2024 / current month
  // October 2024 starts on Tuesday (offset 1 for Mon-first)
  // Days 1..31
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = (new Date(currentYear, currentMonthIndex, 1).getDay() + 6) % 7; // Monday = 0

  return (
    <section
      className={`w-full bg-[#f6faf7] ${showHeader ? 'py-20' : 'pt-2 pb-12 sm:pb-16'} px-4 sm:px-6 lg:px-12 relative`}
      id="booking-engine"
    >
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Section Header */}
        {showHeader && (
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#112e20]/10 text-[#112e20] font-label-caps text-[11px] uppercase tracking-wider font-bold">
              <span className="material-symbols-outlined text-[16px]">room_service</span>
              <span>Seamless Atelier Concierge</span>
            </div>

            <h2 className="font-headline-lg text-[32px] sm:text-[40px] text-[#112e20] leading-tight">
              Reserve Your Signature Appointment
            </h2>

            <p className="font-body-lg text-[15px] sm:text-[16px] text-[#424844]">
              Select your tailor-made experience, preferred master artisan, and optimal time. Indulge in perfection
              from arrival to finish.
            </p>
          </div>
        )}

        {/* Outer Card Frame */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-[#c2c8c2]/50 relative overflow-hidden">
          {/* Step Indicator Header Bar */}
          <div className="py-3 sm:py-6 border-b border-[#c2c8c2]/40 px-4 sm:px-8 bg-[#f0f5f1]/50">
            {/* Mobile: Ultra-compact Modern Progress Bar */}
            <div className="flex sm:hidden items-center justify-between text-[11px] font-semibold text-[#112e20]">
              <span className="flex items-center gap-1.5 text-[#112e20]">
                <span className="w-5 h-5 rounded-full bg-[#112e20] text-white text-[10px] font-bold flex items-center justify-center">1</span>
                <span>Service</span>
              </span>
              <span className="text-[#c2c8c2]">›</span>
              <span className="flex items-center gap-1.5 text-[#fe753c]">
                <span className="w-5 h-5 rounded-full bg-[#fe753c] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#fe753c]/30">2</span>
                <span>Date & Time</span>
              </span>
              <span className="text-[#c2c8c2]">›</span>
              <span className="flex items-center gap-1.5 text-[#424844]/60">
                <span className="w-5 h-5 rounded-full bg-[#e5e9e6] text-[#424844] text-[10px] font-bold flex items-center justify-center">3</span>
                <span>Confirm</span>
              </span>
            </div>

            {/* Desktop: Full 3-column Step Display */}
            <div className="hidden sm:grid grid-cols-3 gap-8 items-center max-w-2xl mx-auto">
              {/* Step 1 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#112e20] text-white flex items-center justify-center font-bold text-[12px] shadow-sm flex-shrink-0">
                  <span className="material-symbols-outlined text-[15px]">check</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#424844]/70 font-label-caps">
                    STEP 01
                  </p>
                  <p className="text-[13px] font-semibold text-[#112e20]">Service</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#fe753c] text-white flex items-center justify-center font-bold text-[12px] shadow-sm flex-shrink-0 ring-4 ring-[#fe753c]/20">
                  2
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#fe753c] font-label-caps">
                    STEP 02
                  </p>
                  <p className="text-[13px] font-bold text-[#112e20]">Schedule</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e5e9e6] text-[#424844] flex items-center justify-center font-bold text-[12px] flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#424844]/60 font-label-caps">
                    STEP 03
                  </p>
                  <p className="text-[13px] font-medium text-[#424844]/60">Confirmation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Booking Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 p-3.5 sm:p-6 lg:p-8 bg-[#f0f5f1]/40 items-stretch">
            {/* Left 7 Columns: Interactive Selectors */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-7 p-4 sm:p-8 bg-white rounded-2xl sm:rounded-3xl border border-[#c2c8c2]/50 shadow-md">
              {/* Atelier Department Selector: Gents vs Ladies */}
              <div className="space-y-2 pb-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11.5px] sm:text-[12px] font-bold uppercase tracking-wider text-[#112e20] font-label-caps flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#fe753c]">storefront</span>
                    <span>Department</span>
                  </label>
                  <span className="text-[11px] font-semibold text-[#185341] bg-[#072f23]/10 px-2.5 py-0.5 rounded-full">
                    {selectedGender === 'gents' ? 'Gents' : 'Ladies'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 p-1 sm:p-1.5 bg-[#f0f5f1] rounded-2xl border border-[#c2c8c2]/60">
                  <button
                    type="button"
                    onClick={() => handleGenderChange('gents')}
                    className={`flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                      selectedGender === 'gents'
                        ? 'bg-[#112e20] text-white shadow-md'
                        : 'text-[#424844] hover:text-[#112e20] hover:bg-white/70'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">man</span>
                    <span className="text-[14px] sm:text-[15px] font-semibold">Gents</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenderChange('ladies')}
                    className={`flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                      selectedGender === 'ladies'
                        ? 'bg-[#112e20] text-white shadow-md'
                        : 'text-[#424844] hover:text-[#112e20] hover:bg-white/70'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">woman</span>
                    <span className="text-[14px] sm:text-[15px] font-semibold">Ladies</span>
                  </button>
                </div>
              </div>

              {/* 1. Service Selection */}
              <div className="space-y-2.5 pt-1 border-t border-[#c2c8c2]/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14.5px] sm:text-[16px] font-semibold text-[#112e20] tracking-tight font-title-md flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#112e20]/10 text-[#112e20] text-[11px] font-bold inline-flex items-center justify-center">
                      1
                    </span>
                    <span>Select {selectedGender === 'gents' ? 'Gents' : 'Ladies'} Service</span>
                  </h3>
                  <span className="text-[11px] sm:text-[12px] text-[#424844]">Includes diagnosis & style</span>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <select
                      value={selectedService.id}
                      onChange={(e) => handleServiceChange(e.target.value)}
                      className="w-full px-3.5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#f0f5f1] border border-[#c2c8c2]/60 text-[#181d1b] font-title-md text-[13.5px] sm:text-[15px] font-semibold focus:outline-none focus:border-[#112e20] cursor-pointer hover:border-[#112e20]/40 transition-colors shadow-sm"
                    >
                      {availableServices.map((srv) => (
                        <option key={srv.id} value={srv.id}>
                          {srv.name} — ₹{srv.price.toLocaleString('en-IN')} ({srv.duration} min)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Select Buttons (Swipeable on Mobile) */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#424844]/70 font-label-caps whitespace-nowrap">
                      Popular:
                    </span>
                    {availableServices.slice(0, 5).map((srv) => {
                      const isSelected = selectedService.id === srv.id;
                      return (
                        <button
                          key={srv.id}
                          onClick={() => setSelectedService(srv)}
                          className={`px-3 py-1 rounded-full text-[11.5px] sm:text-[12px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#112e20] text-white font-semibold shadow-sm'
                              : 'bg-[#f0f5f1] text-[#181d1b] border border-[#c2c8c2]/50 hover:border-[#112e20]/40'
                          }`}
                          type="button"
                        >
                          {srv.name.split(' ')[0]} {srv.name.split(' ')[1] || ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Date & Time Selection */}
              <div className="space-y-3 sm:space-y-4 pt-1 border-t border-[#c2c8c2]/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14.5px] sm:text-[16px] font-semibold text-[#112e20] tracking-tight font-title-md flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#112e20]/10 text-[#112e20] text-[11px] font-bold inline-flex items-center justify-center">
                      2
                    </span>
                    Select Date & Time
                  </h3>
                  <span className="text-[10.5px] sm:text-[12px] text-[#185341] font-semibold bg-[#072f23]/10 px-2 py-0.5 rounded-full">
                    Open 10 AM – 1 AM
                  </span>
                </div>

                {/* Mobile Quick Date Chips (1-tap Selection) */}
                <div className="md:hidden space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#424844] uppercase tracking-wider">
                      Selected: <strong className="text-[#112e20]">{dateString}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCalendarOnMobile(!showCalendarOnMobile)}
                      className="text-[11px] font-bold text-[#fe753c] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                      <span>{showCalendarOnMobile ? 'Hide Month' : 'Full Month'}</span>
                    </button>
                  </div>

                  {/* Horizontal Scrollable Day Chips */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {next7Days.map((item) => {
                      const isSelected = selectedDay === item.dayNum && currentMonthIndex === item.monthIndex;
                      return (
                        <button
                          key={`${item.year}-${item.monthIndex}-${item.dayNum}`}
                          type="button"
                          onClick={() => {
                            setSelectedDay(item.dayNum);
                            setCurrentMonthIndex(item.monthIndex);
                            setCurrentYear(item.year);
                          }}
                          className={`flex-shrink-0 w-16 py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#112e20] text-white shadow-md ring-2 ring-[#fe753c]'
                              : 'bg-[#f0f5f1] text-[#181d1b] border border-[#c2c8c2]/50 hover:bg-[#eaefeb]'
                          }`}
                        >
                          <div className={`text-[10px] uppercase font-bold ${isSelected ? 'text-[#fe753c]' : 'text-[#424844]/80'}`}>
                            {item.dayLabel}
                          </div>
                          <div className="text-[14px] font-bold leading-tight mt-0.5">
                            {item.dayNum}
                          </div>
                          <div className={`text-[9px] ${isSelected ? 'text-[#caead5]' : 'text-[#424844]/60'}`}>
                            {monthNames[item.monthIndex].slice(0, 3)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
                  {/* Calendar Matrix: Shown on Desktop or when toggled on Mobile */}
                  <div className={`md:col-span-7 bg-[#f0f5f1] border border-[#c2c8c2]/40 rounded-2xl p-4 space-y-3.5 ${showCalendarOnMobile ? 'block' : 'hidden md:block'}`}>
                    {/* Month Nav */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#c2c8c2]/40">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#9b4521] text-[20px]">calendar_month</span>
                        <h4 className="font-headline-sm text-[16px] font-bold text-[#112e20]">
                          {monthNames[currentMonthIndex]} {currentYear}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={handlePrevMonth}
                          aria-label="Previous Month"
                          className="w-7 h-7 rounded-full border border-[#c2c8c2]/50 flex items-center justify-center text-[#181d1b] hover:bg-[#eaefeb] transition-colors cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                        </button>
                        <button
                          onClick={handleNextMonth}
                          aria-label="Next Month"
                          className="w-7 h-7 rounded-full border border-[#c2c8c2]/50 flex items-center justify-center text-[#181d1b] hover:bg-[#eaefeb] transition-colors cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </button>
                      </div>
                    </div>

                    {/* Day of Week Headers */}
                    <div className="grid grid-cols-7 text-center gap-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                        <span
                          key={day}
                          className={`text-[10px] font-bold font-label-caps uppercase ${
                            idx === 6 ? 'text-[#9b4521]' : 'text-[#424844]/70'
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>

                    {/* Month Days Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[12px]">
                      {/* Empty padding days */}
                      {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                        <span key={`pad-${i}`} className="h-8 text-[#424844]/30 flex items-center justify-center">
                          {30 - firstDayOfWeek + i + 1}
                        </span>
                      ))}

                      {/* Actual Month Days */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const isSelected = selectedDay === dayNum;
                        return (
                          <button
                            key={dayNum}
                            onClick={() => setSelectedDay(dayNum)}
                            className={`h-8 rounded-lg flex items-center justify-center font-medium transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#112e20] text-white font-bold shadow-sm ring-2 ring-[#112e20]'
                                : 'text-[#181d1b] hover:bg-[#eaefeb]'
                            }`}
                            type="button"
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>

                    {/* Calendar Footer Legend */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-[#c2c8c2]/40 text-[10px] text-[#424844] font-label-caps">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#112e20]" />
                        <span>Selected ({dateString})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fe753c]" />
                        <span>Open 10 AM – 1 AM</span>
                      </div>
                    </div>
                  </div>

                  {/* Time Slots & Master Artisan (5 cols) */}
                  <div className="md:col-span-5 space-y-3.5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#424844] font-label-caps block">
                          Select Time Slot
                        </label>
                        <span className="text-[11px] text-[#fe753c] font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">schedule</span> 10 AM – 1 AM
                        </span>
                      </div>

                      {/* Touch-Friendly Grid of All Available Slots (3 cols: 5 neat rows of hourly slots) */}
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        {timeSlots.map((slot) => {
                          const isSelected = selectedTime === slot;
                          return (
                            <button
                              key={slot}
                              onClick={() => setSelectedTime(slot)}
                              className={`py-2 px-1 rounded-xl text-[11.5px] sm:text-[12px] font-semibold transition-all text-center cursor-pointer ${
                                isSelected
                                  ? 'bg-[#fe753c] text-white font-bold shadow-md ring-2 ring-[#fe753c]/40'
                                  : 'bg-[#f0f5f1] text-[#181d1b] border border-[#c2c8c2]/50 hover:bg-[#eaefeb]'
                              }`}
                              type="button"
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Master Artisan Choice */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#424844] font-label-caps block">
                          Preferred Stylist
                        </label>
                        <span className="text-[10px] text-[#424844]/70 font-medium bg-[#e8eee9] px-2 py-0.5 rounded-full border border-[#c2c8c2]/50">
                          Optional
                        </span>
                      </div>
                      <select
                        value={selectedArtisan}
                        onChange={(e) => setSelectedArtisan(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] border border-[#c2c8c2]/50 text-[#181d1b] font-body-md text-[13px] focus:outline-none focus:border-[#112e20] cursor-pointer"
                      >
                        <option value="Any Artisan">Any Artisan (First Available Specialist)</option>
                        {availableArtisans.map((a) => (
                          <option key={a.id} value={a.name}>
                            {a.name} ({a.specialty})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Special Requests & Notes (Collapsible on Mobile) */}
              <div className="space-y-2 pt-1 border-t border-[#c2c8c2]/30">
                <button
                  type="button"
                  onClick={() => setShowNotes(!showNotes)}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#185341] hover:text-[#042018] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#fe753c]">
                    {showNotes ? 'remove_circle_outline' : 'add_circle_outline'}
                  </span>
                  <span>{showNotes ? 'Hide special requests' : 'Add special requests or notes (optional)'}</span>
                </button>

                {showNotes && (
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Hair texture, allergies, styling preferences..."
                    rows={2}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f0f5f1] border border-[#c2c8c2]/50 text-[#181d1b] text-[13px] placeholder-[#424844]/60 focus:outline-none focus:border-[#112e20] transition-colors resize-none shadow-sm"
                  />
                )}
              </div>
            </div>

            {/* Right 5 Columns: Live Reservation Summary in Rich Emerald Canvas */}
            <div className="lg:col-span-5 bg-[#071a14] text-white p-4 sm:p-8 flex flex-col justify-between shadow-2xl border border-[#1d5644] rounded-2xl sm:rounded-3xl relative overflow-hidden h-full">
              <div className="space-y-3.5 sm:space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-[#fe753c] text-[11px] font-bold uppercase tracking-[0.18em] font-label-caps">
                    Reservation Summary
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#18392d]/80 text-[10px] font-bold tracking-wider text-[#9eb6aa] uppercase border border-white/10">
                    Live Total
                  </span>
                </div>

                {/* Selected Service Card */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9eb6aa] font-label-caps">
                      Selected Treatment
                    </p>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#18392d] text-[#fe753c] text-[10px] font-bold uppercase tracking-wider border border-[#fe753c]/30">
                      <span className="material-symbols-outlined text-[13px]">
                        {selectedGender === 'gents' ? 'man' : 'woman'}
                      </span>
                      <span>{selectedGender === 'gents' ? 'Gents Atelier' : 'Ladies Atelier'}</span>
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <h3 className="text-white font-headline-sm text-[18px] sm:text-[22px] font-semibold tracking-normal font-display-hero">
                        {selectedService.name}
                      </h3>
                      <p className="text-[12px] text-[#9eb6aa]">
                        {selectedService.categoryLabel} • {selectedArtisan === 'Any Artisan' ? 'Any Available Artisan' : selectedArtisan}
                      </p>
                    </div>
                    <span className="text-[19px] sm:text-[20px] font-bold text-[#fe753c] tracking-tight">
                      ₹{selectedService.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Date & Time Pods */}
                <div className="space-y-2 pt-1">
                  <div className="bg-[#0f2d22] border border-white/10 rounded-xl sm:rounded-2xl p-3 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[9.5px] font-bold uppercase tracking-wider text-[#9eb6aa] font-label-caps">
                        Date
                      </p>
                      <div className="flex items-center gap-1.5 text-[12.5px] sm:text-[13px] font-semibold text-white">
                        <span className="material-symbols-outlined text-[14px] text-[#fe753c]">calendar_today</span>
                        <span>{dateString}</span>
                      </div>
                    </div>

                    <div className="space-y-0.5 text-left">
                      <p className="text-[9.5px] font-bold uppercase tracking-wider text-[#9eb6aa] font-label-caps">
                        Time
                      </p>
                      <div className="flex items-center gap-1.5 text-[12.5px] sm:text-[13px] font-semibold text-[#fe753c]">
                        <span className="material-symbols-outlined text-[14px] text-[#fe753c]">schedule</span>
                        <span>{selectedTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0f2d22] border border-white/10 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#9eb6aa]">timelapse</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#9eb6aa] font-label-caps">
                        Estimated Duration
                      </span>
                    </div>
                    <span className="text-[12.5px] font-bold text-white">{selectedService.duration} Minutes</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-white font-bold text-[14.5px] sm:text-[15.5px]">
                    <span>Total Service Amount</span>
                    <span className="text-[#fe753c] text-[18px] sm:text-[20px]">₹{selectedService.price.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[10.5px] text-[#9eb6aa] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-emerald-400">verified</span>
                    <span>Zero prepayment required • Pay upon completion at Tirur desk</span>
                  </p>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="space-y-2.5 pt-5">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#fe753c] hover:bg-[#e0622a] text-white font-bold text-[14.5px] sm:text-[15px] shadow-[0_6px_20px_rgba(254,117,60,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-75"
                  type="button"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      <span>Securing Slot...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Appointment</span>
                      <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                    </>
                  )}
                </button>

                <div className="hidden sm:flex bg-[#0d261d] border border-white/10 rounded-xl p-2 items-center justify-center gap-1.5 text-[10.5px] text-[#9eb6aa] text-center">
                  <span className="material-symbols-outlined text-[13px] text-[#fe753c]">location_on</span>
                  <span>One Arcade, Near Lenskart, Tirur • Open until 1:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
