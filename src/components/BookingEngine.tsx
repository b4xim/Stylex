import React, { useState } from 'react';
import { SERVICES, MASTER_ARTISANS } from '../data/salonData.ts';
import { BookingState } from '../types.ts';

interface BookingEngineProps {
  onConfirmBooking: (booking: BookingState) => void;
  initialServiceId?: string;
}

export const BookingEngine: React.FC<BookingEngineProps> = ({ onConfirmBooking, initialServiceId }) => {
  // Service selection
  const defaultService = SERVICES.find((s) => s.id === initialServiceId) || SERVICES[0];
  const [selectedService, setSelectedService] = useState(defaultService);

  // Month & Day selection
  const [currentMonthIndex, setCurrentMonthIndex] = useState(9); // 9 = October
  const [currentYear, setCurrentYear] = useState(2024);
  const [selectedDay, setSelectedDay] = useState<number>(24);

  // Time selection
  const timeSlots = ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');

  // Artisan & Notes
  const [selectedArtisan, setSelectedArtisan] = useState(MASTER_ARTISANS[0].name);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
    const s = SERVICES.find((item) => item.id === serviceId);
    if (s) setSelectedService(s);
  };

  // Calculations
  const servicePrice = selectedService.price;
  const deposit = Math.round(servicePrice * 0.25);
  const balance = servicePrice - deposit;

  const dateString = `Thu, ${monthNames[currentMonthIndex].slice(0, 3)} ${selectedDay}`;

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
        beverage: 'Complimentary Brut Reserve Champagne'
      });
    }, 600);
  };

  // Generate calendar days for October 2024 / current month
  // October 2024 starts on Tuesday (offset 1 for Mon-first)
  // Days 1..31
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = (new Date(currentYear, currentMonthIndex, 1).getDay() + 6) % 7; // Monday = 0

  return (
    <section className="w-full bg-[#f6faf7] py-20 px-4 sm:px-6 lg:px-12 relative" id="booking-engine">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
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

        {/* Outer Card Frame */}
        <div className="bg-white rounded-3xl shadow-xl border border-[#c2c8c2]/50 relative overflow-hidden">
          {/* Step Indicator Header Bar */}
          <div className="pb-6 pt-6 border-b border-[#c2c8c2]/40 px-6 md:px-8 bg-[#f0f5f1]/50">
            <div className="grid grid-cols-3 gap-3 sm:gap-8 items-center max-w-2xl mx-auto">
              {/* Step 1 */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#112e20] text-white flex items-center justify-center font-bold text-[12px] shadow-sm flex-shrink-0">
                  <span className="material-symbols-outlined text-[15px]">check</span>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#424844]/70 font-label-caps">
                    STEP 01
                  </p>
                  <p className="text-[12px] sm:text-[13px] font-semibold text-[#112e20]">Service</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#fe753c] text-white flex items-center justify-center font-bold text-[12px] shadow-sm flex-shrink-0 ring-4 ring-[#fe753c]/20">
                  2
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#fe753c] font-label-caps">
                    STEP 02
                  </p>
                  <p className="text-[12px] sm:text-[13px] font-bold text-[#112e20]">Schedule</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#e5e9e6] text-[#424844] flex items-center justify-center font-bold text-[12px] flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#424844]/60 font-label-caps">
                    STEP 03
                  </p>
                  <p className="text-[12px] sm:text-[13px] font-medium text-[#424844]/60">Confirmation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Booking Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 lg:p-8 bg-[#f0f5f1]/40 items-stretch">
            {/* Left 7 Columns: Interactive Selectors */}
            <div className="lg:col-span-7 space-y-7 p-5 sm:p-8 bg-white rounded-3xl border border-[#c2c8c2]/50 shadow-md">
              {/* 1. Service Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#112e20] tracking-tight font-title-md flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#112e20]/10 text-[#112e20] text-[11px] font-bold inline-flex items-center justify-center">
                      1
                    </span>
                    Select Desired Service
                  </h3>
                  <span className="text-[12px] text-[#424844]">Includes scalp diagnosis & blow-dry</span>
                </div>

                <div className="space-y-2.5">
                  <div className="relative">
                    <select
                      value={selectedService.id}
                      onChange={(e) => handleServiceChange(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#f0f5f1] border border-[#c2c8c2]/60 text-[#181d1b] font-title-md text-[14px] sm:text-[15px] font-semibold focus:outline-none focus:border-[#112e20] cursor-pointer hover:border-[#112e20]/40 transition-colors shadow-sm"
                    >
                      {SERVICES.map((srv) => (
                        <option key={srv.id} value={srv.id}>
                          {srv.name} — ${srv.price} ({srv.duration} min)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#424844]/70 font-label-caps">
                      Quick Select:
                    </span>
                    {SERVICES.slice(0, 4).map((srv) => {
                      const isSelected = selectedService.id === srv.id;
                      return (
                        <button
                          key={srv.id}
                          onClick={() => setSelectedService(srv)}
                          className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#112e20] tracking-tight font-title-md flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#112e20]/10 text-[#112e20] text-[11px] font-bold inline-flex items-center justify-center">
                      2
                    </span>
                    Select Date & Available Time
                  </h3>
                  <span className="text-[12px] text-[#424844] font-medium">Pacific Standard Time (PST)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  {/* Calendar Matrix (7 cols) */}
                  <div className="md:col-span-7 bg-[#f0f5f1] border border-[#c2c8c2]/40 rounded-2xl p-4 space-y-3.5">
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
                        <span>Atelier Open</span>
                      </div>
                    </div>
                  </div>

                  {/* Time Slots (5 cols) */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#424844] font-label-caps block">
                        Select Preferred Time Slot
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl bg-[#f0f5f1] border border-[#c2c8c2]/50 text-[#181d1b] font-body-md text-[13px] focus:outline-none focus:border-[#112e20] cursor-pointer hover:border-[#112e20]/40 transition-colors"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot} — {slot.includes('AM') ? 'Morning Slot' : 'Afternoon/Eve'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#424844]/70 font-label-caps">
                          Quick Select
                        </p>
                        <span className="text-[11px] text-[#fe753c] font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">schedule</span> 5 Open
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.slice(0, 4).map((slot) => {
                          const isSelected = selectedTime === slot;
                          return (
                            <button
                              key={slot}
                              onClick={() => setSelectedTime(slot)}
                              className={`px-3 py-2 rounded-xl text-[12px] transition-all text-center cursor-pointer ${
                                isSelected
                                  ? 'bg-[#fe753c] text-white font-bold shadow-sm'
                                  : 'bg-[#f0f5f1] text-[#181d1b] font-medium border border-[#c2c8c2]/50 hover:border-[#112e20]/40'
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
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#424844] font-label-caps block">
                        Master Artisan
                      </label>
                      <select
                        value={selectedArtisan}
                        onChange={(e) => setSelectedArtisan(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f5f1] border border-[#c2c8c2]/50 text-[#181d1b] font-body-md text-[13px] focus:outline-none focus:border-[#112e20] cursor-pointer"
                      >
                        {MASTER_ARTISANS.map((a) => (
                          <option key={a.id} value={a.name}>
                            {a.name} ({a.specialty})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Special Requests & Atelier Notes */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#112e20] tracking-tight font-title-md flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#112e20]/10 text-[#112e20] text-[11px] font-bold inline-flex items-center justify-center">
                      3
                    </span>
                    Special Requests & Atelier Notes
                  </h3>
                  <span className="text-[12px] text-[#424844]">Optional</span>
                </div>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Hair texture, allergies, styling preferences, or complimentary beverage choice..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-[#f0f5f1] border border-[#c2c8c2]/50 text-[#181d1b] font-body-md text-[14px] placeholder-[#424844]/60 focus:outline-none hover:border-[#112e20]/40 focus:border-[#112e20] transition-colors resize-none shadow-sm"
                />
              </div>
            </div>

            {/* Right 5 Columns: Live Reservation Summary in Rich Emerald Canvas */}
            <div className="lg:col-span-5 bg-[#071a14] text-white p-6 md:p-8 flex flex-col justify-between shadow-2xl border border-[#1d5644] rounded-3xl relative overflow-hidden h-full">
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-[#fe753c] text-[11px] font-bold uppercase tracking-[0.18em] font-label-caps">
                    Reservation Summary
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#18392d]/80 text-[10px] font-bold tracking-wider text-[#9eb6aa] uppercase border border-white/10">
                    Live Estimate
                  </span>
                </div>

                {/* Selected Service Card */}
                <div className="space-y-1 pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9eb6aa] font-label-caps">
                    Selected Service
                  </p>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <h3 className="text-white font-headline-sm text-[22px] font-semibold tracking-normal font-display-hero">
                        {selectedService.name}
                      </h3>
                      <p className="text-[12px] text-[#9eb6aa]">{selectedService.categoryLabel} • {selectedArtisan}</p>
                    </div>
                    <span className="text-[20px] font-bold text-white tracking-tight">
                      ${selectedService.price}.00
                    </span>
                  </div>
                </div>

                {/* Date & Time Pods */}
                <div className="space-y-2.5 pt-1">
                  <div className="bg-[#0f2d22] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9eb6aa] font-label-caps">
                        Date
                      </p>
                      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-white">
                        <span className="material-symbols-outlined text-[15px] text-[#fe753c]">calendar_today</span>
                        <span>{dateString}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9eb6aa] font-label-caps">
                        Time
                      </p>
                      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#fe753c]">
                        <span className="material-symbols-outlined text-[15px] text-[#fe753c]">schedule</span>
                        <span>{selectedTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0f2d22] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#9eb6aa]">timelapse</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#9eb6aa] font-label-caps">
                        Estimated Duration
                      </span>
                    </div>
                    <span className="text-[13px] font-bold text-white">{selectedService.duration} Minutes</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-2 border-t border-white/10 space-y-2.5 text-[13px]">
                  <div className="flex items-center justify-between text-[#c2cec6]">
                    <span>Service Total</span>
                    <span className="text-white font-medium">${selectedService.price}.00</span>
                  </div>
                  <div className="flex items-center justify-between text-[#c2cec6]">
                    <span>Deposit Due Now (25%)</span>
                    <span className="text-[#fe753c] font-bold">${deposit}.00</span>
                  </div>
                  <div className="flex items-center justify-between text-[#c2cec6]">
                    <span>Balance Due at Atelier</span>
                    <span className="text-white font-medium">${balance}.00</span>
                  </div>
                  <p className="text-[9px] uppercase tracking-wider text-[#9eb6aa]/70 font-semibold pt-0.5">
                    Remaining balance paid at checkout
                  </p>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="space-y-3 pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#fe753c] hover:bg-[#e0622a] text-white font-semibold text-[15px] shadow-[0_8px_24px_-4px_rgba(254,117,60,0.5)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-75"
                  type="button"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      <span>Securing Atelier Slot...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Book Appointment</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>

                <div className="bg-[#0d261d] border border-white/10 rounded-xl p-2.5 flex items-center justify-center gap-2 text-[11px] text-[#9eb6aa] text-center">
                  <span className="material-symbols-outlined text-[15px] text-[#fe753c]">wine_bar</span>
                  <span>Complimentary champagne & valet • 24h flexible reschedule</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
