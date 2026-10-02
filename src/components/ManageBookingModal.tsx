import React, { useState, useEffect } from 'react';
import { SALON_DATA } from '../data/salonData.ts';

interface ManageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialToken?: string | null;
}

export const ManageBookingModal: React.FC<ManageBookingModalProps> = ({
  isOpen,
  onClose,
  initialToken,
}) => {
  const [activeToken, setActiveToken] = useState<string | null>(initialToken || null);
  const [booking, setBooking] = useState<any | null>(null);
  const [lookupPhone, setLookupPhone] = useState<string>('');
  const [lookupResults, setLookupResults] = useState<any[] | null>(null);
  const [viewMode, setViewMode] = useState<'lookup' | 'details' | 'reschedule' | 'cancel_confirm'>('lookup');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Reschedule state
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);

  // Cancel state
  const [cancelReason, setCancelReason] = useState<string>('Change of plans');

  useEffect(() => {
    if (initialToken) {
      setActiveToken(initialToken);
      fetchBookingDetails(initialToken);
    } else {
      setViewMode('lookup');
    }
  }, [initialToken, isOpen]);

  // Reset states on modal close
  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setCopiedLink(false);
    }
  }, [isOpen]);

  const fetchBookingDetails = async (token: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/bookings/manage/${encodeURIComponent(token)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Unable to find reservation pass');
      }
      setBooking(json.data);
      setViewMode('details');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error fetching reservation pass. Please check reference code.');
      setViewMode('lookup');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = lookupPhone.replace(/[^0-9]/g, '');
    if (clean.length < 7) {
      setErrorMessage('Please enter a valid mobile number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setLookupResults(null);

    try {
      const res = await fetch('/api/bookings/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: clean }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to search bookings');
      }
      if (!json.data || json.data.length === 0) {
        setErrorMessage('No active upcoming reservations found for this mobile number.');
      } else if (json.data.length === 1) {
        // Direct jump to booking
        fetchBookingDetails(json.data[0].managementToken || json.data[0].bookingRef);
      } else {
        setLookupResults(json.data);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error looking up reservations.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate 14-day date options
  const upcomingDays = React.useMemo(() => {
    const days: { ymd: string; label: string; weekday: string; dateNum: number }[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateNum = d.getDate();
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${weekday}, ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      days.push({ ymd, label, weekday, dateNum });
    }
    return days;
  }, []);

  const openRescheduleView = () => {
    if (!booking) return;
    const initialDay = upcomingDays[0]?.ymd || booking.date;
    setSelectedDate(initialDay);
    setSelectedSlot('');
    setViewMode('reschedule');
    loadAvailableSlots(initialDay);
  };

  const loadAvailableSlots = async (dateYMD: string) => {
    setIsLoadingSlots(true);
    try {
      const stylistParam = booking?.stylist?.id ? `&stylistId=${booking.stylist.id}` : '';
      const genderParam = booking?.service?.gender ? `&gender=${booking.service.gender}` : '';
      const res = await fetch(`/api/bookings/slots?date=${dateYMD}${stylistParam}${genderParam}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setAvailableSlots(json.data || []);
      } else {
        setAvailableSlots([]);
      }
    } catch {
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleDateChange = (ymd: string) => {
    setSelectedDate(ymd);
    setSelectedSlot('');
    loadAvailableSlots(ymd);
  };

  const submitReschedule = async () => {
    if (!booking || !selectedDate || !selectedSlot) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const token = booking.managementToken || booking.bookingRef;
      const res = await fetch(`/api/bookings/manage/${encodeURIComponent(token)}/reschedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          timeSlot: selectedSlot,
          stylistId: booking.stylist?.id,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to reschedule appointment');
      }
      setSuccessMessage('Appointment successfully rescheduled!');
      await fetchBookingDetails(token);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not reschedule appointment.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitCancel = async () => {
    if (!booking) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const token = booking.managementToken || booking.bookingRef;
      const res = await fetch(`/api/bookings/manage/${encodeURIComponent(token)}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to cancel appointment');
      }
      setSuccessMessage('Appointment has been cancelled.');
      await fetchBookingDetails(token);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not cancel appointment.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyManageLink = () => {
    if (!booking) return;
    const token = booking.managementToken || booking.bookingRef;
    const url = `${window.location.origin}/?manage=${encodeURIComponent(token)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  const openWhatsAppShare = () => {
    if (!booking) return;
    const token = booking.managementToken || booking.bookingRef;
    const url = `${window.location.origin}/?manage=${encodeURIComponent(token)}`;
    const text = `StyleX Signature Salon Appointment Pass\n• Ref: ${booking.bookingRef}\n• Service: ${booking.service?.name}\n• Date: ${booking.date} at ${booking.timeSlot}\n\nView or Reschedule your booking here: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[92dvh] sm:max-h-[88vh] bg-[#071a14] border border-[#276451] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#0e372b] to-[#164234] p-4 sm:p-5 border-b border-[#276451] relative shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#fe753c]/20 border border-[#fe753c]/40 text-[#fe753c] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display-hero leading-tight">
                {viewMode === 'lookup' && 'Find Your Reservation'}
                {viewMode === 'details' && 'Reservation Pass'}
                {viewMode === 'reschedule' && 'Reschedule Appointment'}
                {viewMode === 'cancel_confirm' && 'Cancel Reservation'}
              </h3>
              <p className="text-[11px] text-[#aeceba]">
                StyleX Signature Salon • Tirur Flagship
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Global Alert Notification */}
        {errorMessage && (
          <div className="bg-red-950/80 border-b border-red-500/40 px-4 py-2.5 text-xs text-red-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-red-400 shrink-0">error</span>
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-4 py-2.5 text-xs text-emerald-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-400 shrink-0">check_circle</span>
            <span className="flex-1">{successMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto overscroll-contain flex-1 space-y-4">
          
          {/* ========================================================================= */}
          {/* 1. LOOKUP VIEW: Search by Mobile Number                                   */}
          {/* ========================================================================= */}
          {viewMode === 'lookup' && (
            <div className="space-y-4">
              <div className="bg-[#0f2d22] border border-white/10 rounded-2xl p-4 text-center space-y-2">
                <span className="material-symbols-outlined text-3xl text-[#fe753c]">search</span>
                <h4 className="text-sm sm:text-base font-bold text-white">Enter Your Registered Mobile Number</h4>
                <p className="text-xs text-[#aeceba] max-w-xs mx-auto">
                  View your upcoming visits, reschedule to another time, or manage your reservation.
                </p>
              </div>

              <form onSubmit={handlePhoneLookup} className="space-y-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#9eb6aa] font-bold mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-white/15 bg-[#03150f] focus-within:border-[#fe753c] transition-colors">
                    <span className="px-3.5 py-2.5 text-xs font-semibold text-[#fe753c] bg-white/5 border-r border-white/10 flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={lookupPhone}
                      onChange={(e) => setLookupPhone(e.target.value)}
                      placeholder="e.g. 98765 43210"
                      required
                      className="w-full px-3 py-2.5 bg-transparent text-white text-sm focus:outline-none placeholder-white/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-[#fe753c] hover:bg-[#e8652d] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  ) : (
                    <>
                      <span>Find My Bookings</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              {/* Multiple Search Results List */}
              {lookupResults && lookupResults.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <p className="text-xs font-bold text-[#aeceba]">Active Reservations ({lookupResults.length}):</p>
                  {lookupResults.map((resItem) => (
                    <div
                      key={resItem.id}
                      onClick={() => fetchBookingDetails(resItem.managementToken || resItem.bookingRef)}
                      className="p-3 rounded-xl bg-[#0f2d22] hover:bg-[#153e2f] border border-white/10 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#fe753c]">{resItem.bookingRef}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                            {resItem.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-white truncate mt-0.5">{resItem.serviceName}</p>
                        <p className="text-[11px] text-[#aeceba]">
                          {resItem.date} at {resItem.timeSlot} • {resItem.stylistName}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-[#fe753c] text-[18px] group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. DETAILS VIEW: Active Reservation Pass                                  */}
          {/* ========================================================================= */}
          {viewMode === 'details' && booking && (
            <div className="space-y-4">
              {/* Pass Card */}
              <div className="bg-[#0f2d22] border border-white/15 rounded-2xl p-4 space-y-3 relative overflow-hidden shadow-inner">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#9eb6aa] block">Reservation Reference</span>
                    <span className="font-mono text-base font-bold text-white tracking-wide">{booking.bookingRef}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    booking.status === 'CONFIRMED'
                      ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                      : booking.status === 'CANCELLED'
                      ? 'bg-red-950/70 border-red-500/50 text-red-300'
                      : 'bg-white/10 border-white/20 text-white'
                  }`}>
                    {booking.status}
                  </span>
                </div>

                {/* Service & Stylist */}
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#9eb6aa] tracking-wider">Service</p>
                  <h4 className="text-base font-bold text-white font-display-hero">{booking.service?.name}</h4>
                  <div className="flex items-center justify-between text-xs text-[#d4ebe1] pt-1 mt-1 border-t border-white/5">
                    <span>Stylist: {booking.stylist?.name || 'Any Master Artisan'}</span>
                    <span className="text-[#fe753c] font-semibold">{booking.service?.duration || 35} mins</span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <div className="bg-[#082017] p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase text-[#9eb6aa] font-bold block">Date</span>
                    <span className="text-xs font-semibold text-white">{booking.date}</span>
                  </div>
                  <div className="bg-[#082017] p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase text-[#9eb6aa] font-bold block">Time Slot</span>
                    <span className="text-xs font-bold text-[#fe753c]">{booking.timeSlot} IST</span>
                  </div>
                </div>

                {/* Location */}
                <div className="text-[11px] text-[#aeceba] flex items-center justify-between pt-1">
                  <span>📍 {SALON_DATA.addressLine1}, {SALON_DATA.city}</span>
                  <span className="font-bold text-white">₹{booking.total}</span>
                </div>
              </div>

              {/* Status Notice / Restrictions */}
              {!booking.canModify && booking.status !== 'CANCELLED' && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-amber-400 shrink-0 mt-0.5">info</span>
                  <p>
                    Online changes close 2 hours before start. Please call our salon desk at{' '}
                    <a href={`tel:${SALON_DATA.phoneNumberClean}`} className="underline font-bold text-white">
                      {SALON_DATA.phoneDisplay}
                    </a>{' '}
                    for immediate assistance.
                  </p>
                </div>
              )}

              {/* Action Buttons (Reschedule / Cancel) */}
              {booking.canModify && (
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={openRescheduleView}
                    className="py-2.5 px-3 rounded-xl bg-[#fe753c] hover:bg-[#e8652d] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>Reschedule</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('cancel_confirm')}
                    className="py-2.5 px-3 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                    <span>Cancel</span>
                  </button>
                </div>
              )}

              {/* Quick Share / Save Tools */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#9eb6aa] block">
                  Quick Save &amp; Pass Tools
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={copyManageLink}
                    className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-[#d4ebe1] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#fe753c]">
                      {copiedLink ? 'done' : 'content_copy'}
                    </span>
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={openWhatsAppShare}
                    className="py-2 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-xs text-[#86efac] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#25D366]">share</span>
                    <span>Save to WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Back to search link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setViewMode('lookup')}
                  className="text-xs text-[#aeceba] hover:text-white underline cursor-pointer"
                >
                  ← Search another reservation
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. RESCHEDULE VIEW: Date & Slot Picker                                    */}
          {/* ========================================================================= */}
          {viewMode === 'reschedule' && (
            <div className="space-y-4">
              <div className="bg-[#0f2d22] border border-white/10 rounded-xl p-3 text-xs text-[#d4ebe1]">
                <p className="font-semibold text-white">Current Reservation:</p>
                <p>{booking?.service?.name} on {booking?.date} at {booking?.timeSlot}</p>
              </div>

              {/* 14-Day Date Selector */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#9eb6aa] font-bold mb-2">
                  1. Select New Date
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {upcomingDays.map((day) => {
                    const isSelected = selectedDate === day.ymd;
                    return (
                      <button
                        key={day.ymd}
                        type="button"
                        onClick={() => handleDateChange(day.ymd)}
                        className={`flex flex-col items-center justify-center min-w-[62px] py-2 px-2 rounded-xl text-xs transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#fe753c] border-[#fe753c] text-white shadow-md font-bold'
                            : 'bg-white/5 border-white/10 text-[#d4ebe1] hover:bg-white/10'
                        }`}
                      >
                        <span className="text-[10px] uppercase opacity-80">{day.weekday}</span>
                        <span className="text-sm font-bold">{day.dateNum}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slot Selector */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#9eb6aa] font-bold mb-2">
                  2. Select Available Time Slot
                </label>
                
                {isLoadingSlots ? (
                  <div className="p-8 text-center text-xs text-[#aeceba] flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    <span>Checking live salon calendar...</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-[#aeceba]">
                    No open appointment slots on this date. Please choose another day.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot === slot.timeSlot;
                      const isDisabled = !slot.isAvailable;
                      return (
                        <button
                          key={slot.timeSlot}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => setSelectedSlot(slot.timeSlot)}
                          className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all border text-center ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                              : isDisabled
                              ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed line-through'
                              : 'bg-[#0f2d22] border-white/10 text-white hover:border-[#fe753c] cursor-pointer'
                          }`}
                        >
                          {slot.timeSlot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setViewMode('details')}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedDate || !selectedSlot || isLoading}
                  onClick={submitReschedule}
                  className="flex-2 py-2.5 rounded-xl bg-[#fe753c] hover:bg-[#e8652d] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  ) : (
                    <span>Confirm Reschedule</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. CANCEL CONFIRMATION VIEW                                              */}
          {/* ========================================================================= */}
          {viewMode === 'cancel_confirm' && (
            <div className="space-y-4">
              <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-4 text-center space-y-2">
                <span className="material-symbols-outlined text-3xl text-red-400">warning</span>
                <h4 className="text-sm sm:text-base font-bold text-white">Cancel Your Appointment?</h4>
                <p className="text-xs text-red-200/80 max-w-xs mx-auto">
                  Are you sure you want to cancel your reservation for{' '}
                  <strong className="text-white">{booking?.service?.name}</strong> on {booking?.date} at {booking?.timeSlot}?
                </p>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#9eb6aa] font-bold mb-1.5">
                  Cancellation Reason (Optional)
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/15 bg-[#03150f] text-white text-xs focus:outline-none focus:border-red-400"
                >
                  <option value="Change of plans">Change of plans</option>
                  <option value="Personal emergency">Personal emergency</option>
                  <option value="Traveling / Out of town">Traveling / Out of town</option>
                  <option value="Booking error">Booking error</option>
                  <option value="Other">Other reason</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setViewMode('details')}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer"
                >
                  Keep Reservation
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={submitCancel}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  ) : (
                    <span>Yes, Cancel</span>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
