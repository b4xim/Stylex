import React, { useState, useEffect } from 'react';
import { BOOKING_HEADINGS, SERVICES, MASTER_ARTISANS, TIME_SLOTS, SALON_DATA } from '../data/salonData.ts';
import { BookingState } from '../types.ts';

interface BookingEngineProps {
  onConfirmBooking: (booking: BookingState) => void;
  initialServiceId?: string;
  showHeader?: boolean;
}

export const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+968', country: 'Oman', flag: '🇴🇲' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
];

export interface SlotOccupancyInfo {
  timeSlot: string;
  isAvailable: boolean;
  bookedCount: number;
  maxCapacity: number;
  status: 'available' | 'filling_fast' | 'full';
  reason?: string;
}

export const getSalonNow = (): Date => {
  try {
    const str = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    return new Date(str);
  } catch {
    return new Date();
  }
};

export const isSlotInPast = (
  slotStr: string,
  selectedDay: number,
  selectedMonthIndex: number,
  selectedYear: number
): boolean => {
  const salonNow = getSalonNow();
  const currentSalonDay = new Date(salonNow.getFullYear(), salonNow.getMonth(), salonNow.getDate()).getTime();
  const chosenDay = new Date(selectedYear, selectedMonthIndex, selectedDay).getTime();

  // If chosen day is before today in salon time, all slots are in the past
  if (chosenDay < currentSalonDay) return true;
  // If chosen day is in the future, none of the slots are in the past
  if (chosenDay > currentSalonDay) return false;

  // Selected day is TODAY: Parse slot start time
  const match = slotStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return false;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridian = match[3].toUpperCase();

  if (meridian === 'AM' && hours === 12) {
    // 12:00 AM is midnight at the end of the operating day (24:00)
    hours = 24;
  } else if (meridian === 'PM' && hours < 12) {
    hours += 12;
  }

  // Create slot Date timestamp for today
  const slotTimestamp = new Date(
    salonNow.getFullYear(),
    salonNow.getMonth(),
    salonNow.getDate(),
    hours,
    minutes,
    0,
    0
  ).getTime();

  // The slot is in the past if salon's current time has reached or passed the slot start time
  return salonNow.getTime() >= slotTimestamp;
};

export const BookingEngine: React.FC<BookingEngineProps> = ({
  onConfirmBooking,
  initialServiceId,
  showHeader = true,
}) => {
  // Gender / Department selection (Gents vs Ladies)
  const initialFound = BOOKING_HEADINGS.find((h) => h.id === initialServiceId) 
    || SERVICES.find((s) => s.id === initialServiceId);
  const initialGender: 'gents' | 'ladies' = initialFound?.gender === 'ladies' ? 'ladies' : 'gents';

  const [selectedGender, setSelectedGender] = useState<'gents' | 'ladies'>(initialGender);

  // Available headings filtered by selected gender
  const availableHeadings = BOOKING_HEADINGS.filter(
    (h) => h.gender === selectedGender
  );

  // Default heading for selected gender
  const defaultHeading = (initialFound && initialFound.gender === selectedGender)
    ? (BOOKING_HEADINGS.find((h) => h.id === initialFound.id || (h.category === initialFound.category && h.gender === selectedGender)) || availableHeadings[0])
    : availableHeadings[0];

  const [selectedService, setSelectedService] = useState(defaultHeading);

  // Live stylists synchronized with Dashboard / Backend
  // Start empty – populated from /api/stylists so only real dashboard stylists show
  const [stylistsList, setStylistsList] = useState<any[]>(() => {
    try {
      const saved =
        localStorage.getItem('stylex_stylists') ||
        localStorage.getItem('stylex_tirur_v6_stylists');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Exclude any old placeholder role names
          return parsed.filter(
            (p: any) =>
              p.name &&
              !p.name.includes("Master Barber & Men's Grooming Lead") &&
              !p.name.includes("Senior Men's Stylist") &&
              !p.name.includes("Master Stylist & Creative Director") &&
              !p.name.includes("Senior Hair Artisan")
          );
        }
      }
    } catch {}
    return [];
  });

  const [liveBlockedSlots, setLiveBlockedSlots] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const sanitizeStylists = (list: any[]) => {
      return list
        .filter(
          (s: any) =>
            s.name &&
            !s.name.includes("Master Barber & Men's Grooming Lead") &&
            !s.name.includes("Senior Men's Stylist") &&
            !s.name.includes("Master Stylist & Creative Director") &&
            !s.name.includes("Senior Hair Artisan")
        )
        .map((s: any) => ({
          id: s.id,
          name: s.name,
          role: s.role || 'Senior Stylist',
          specialty: s.specialty || s.role || 'Hair & Styling',
          gender: s.gender || 'both',
          imageUrl: s.imageUrl || s.avatar,
          rating: s.rating || 4.9,
        }));
    };

    // Fetch live stylists added in dashboard
    fetch('/api/stylists')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!isMounted) return;
        if (json?.success && Array.isArray(json.data)) {
          const mapped = sanitizeStylists(json.data);
          setStylistsList(mapped);
          try {
            localStorage.setItem('stylex_stylists', JSON.stringify(mapped));
          } catch {}
        }
      })
      .catch((err) => {
        console.warn('Could not fetch /api/stylists:', err);
      });

    // Cross-tab storage sync
    const handleStorageSync = () => {
      try {
        const saved =
          localStorage.getItem('stylex_stylists') ||
          localStorage.getItem('stylex_tirur_v6_stylists');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setStylistsList(sanitizeStylists(parsed));
          }
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorageSync);

    // Fetch live blocked slots
    fetch('/api/blocked-slots')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!isMounted) return;
        if (json?.success && Array.isArray(json.data)) {
          setLiveBlockedSlots(json.data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch /api/blocked-slots:', err);
      });

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageSync);
    };
  }, []);

  const matchesStylistGender = (stylistGender: string | undefined, targetGender: 'gents' | 'ladies') => {
    const g = (stylistGender || 'both').toLowerCase();
    if (g === 'both' || g === 'any' || g === 'unisex') return true;
    if (targetGender === 'gents') return g === 'gents' || g === 'male';
    if (targetGender === 'ladies') return g === 'ladies' || g === 'female';
    return true;
  };

  // Available artisans filtered by selected gender
  const availableArtisans = stylistsList.filter((a) => matchesStylistGender(a.gender, selectedGender));

  const [selectedArtisan, setSelectedArtisan] = useState('Any Stylist');

  // When gender changes, automatically update headings and stylists
  const handleGenderChange = (newGender: 'gents' | 'ladies') => {
    if (newGender === selectedGender) return;
    setSelectedGender(newGender);

    const newHeadings = BOOKING_HEADINGS.filter((h) => h.gender === newGender);
    if (newHeadings.length > 0) {
      setSelectedService(newHeadings[0]);
    }

    const newArtisans = stylistsList.filter((a) => matchesStylistGender(a.gender, newGender));
    // If a stylist was selected that is specific to the old gender, reset to 'Any Stylist'
    if (selectedArtisan !== 'Any Stylist' && !newArtisans.some((a) => a.name === selectedArtisan)) {
      setSelectedArtisan('Any Stylist');
    }
  };

  // Sync if initialServiceId changes externally
  useEffect(() => {
    if (!initialServiceId) return;
    const found = BOOKING_HEADINGS.find((h) => h.id === initialServiceId) 
      || SERVICES.find((s) => s.id === initialServiceId);
    if (found) {
      const g = found.gender === 'ladies' ? 'ladies' : 'gents';
      setSelectedGender(g);
      const matchingHeading = BOOKING_HEADINGS.find((h) => h.id === found.id || (h.category === found.category && h.gender === g))
        || BOOKING_HEADINGS.filter((h) => h.gender === g)[0];
      if (matchingHeading) {
        setSelectedService(matchingHeading);
      }
      const filteredArtisans = stylistsList.filter((a) => matchesStylistGender(a.gender, g));
      if (selectedArtisan !== 'Any Stylist' && !filteredArtisans.some((a) => a.name === selectedArtisan)) {
        setSelectedArtisan('Any Stylist');
      }
    }
  }, [initialServiceId, stylistsList]);

  // Month & Day selection (Synchronized with Salon Local Time in Tirur, Kerala)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(() => getSalonNow().getMonth());
  const [currentYear, setCurrentYear] = useState(() => getSalonNow().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number>(() => getSalonNow().getDate());

  // Time selection
  const timeSlots = TIME_SLOTS;
  const [selectedTime, setSelectedTime] = useState<string>(() => {
    const sNow = getSalonNow();
    const firstValid = TIME_SLOTS.find(
      (s) => !isSlotInPast(s, sNow.getDate(), sNow.getMonth(), sNow.getFullYear())
    );
    return firstValid || TIME_SLOTS[0];
  });
  const [slotOccupancy, setSlotOccupancy] = useState<Record<string, SlotOccupancyInfo>>({});
  const [, setIsLoadingSlots] = useState<boolean>(false);

  // Notes & Submission
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [showCalendarOnMobile, setShowCalendarOnMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guest Contact Information (Full Name & Mobile compulsory, Email optional without "optional" label)
  const [fullName, setFullName] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Quick 7 days for mobile 1-tap booking
  const next7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = getSalonNow();
    d.setDate(d.getDate() + i);
    return {
      dayNum: d.getDate(),
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
      dayLabel: i === 0 ? 'Today' : i === 1 ? 'Tmrw' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
      dateStr: `${d.getDate()} ${monthNames[d.getMonth()].slice(0, 3)}`,
    };
  });

  const salonNow = getSalonNow();
  const isCurrentOrPastMonth =
    currentYear < salonNow.getFullYear() ||
    (currentYear === salonNow.getFullYear() && currentMonthIndex <= salonNow.getMonth());

  const handlePrevMonth = () => {
    if (isCurrentOrPastMonth) return;
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

  const handleServiceChange = (headingId: string) => {
    const s = availableHeadings.find((item) => item.id === headingId);
    if (s) setSelectedService(s);
  };

  const dateObj = new Date(currentYear, currentMonthIndex, selectedDay);
  const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
  const dateString = `${dayName}, ${monthNames[currentMonthIndex].slice(0, 3)} ${selectedDay}, ${currentYear}`;

  // Check if an artisan has a scheduled leave or blocked slot for the selected date & time
  const getStylistLeaveStatus = (artisanName: string, artisanId?: string) => {
    const yyyy = currentYear;
    const mm = String(currentMonthIndex + 1).padStart(2, '0');
    const dd = String(selectedDay).padStart(2, '0');
    const targetDateStr = `${yyyy}-${mm}-${dd}`;

    // 1. Check local dashboard leaves
    let leaves: any[] = [];
    try {
      const raw =
        localStorage.getItem('stylex_stylist_leaves') ||
        localStorage.getItem('stylex_tirur_v6_stylist_leaves');
      if (raw) leaves = JSON.parse(raw);
    } catch (e) {}

    const match = leaves.find(
      (l) =>
        (artisanId && l.stylistId === artisanId) ||
        (l.stylistName && artisanName && l.stylistName.toLowerCase() === artisanName.toLowerCase())
    );

    if (match && match.date === targetDateStr) {
      if (match.duration === 'FULL_DAY') {
        return { isUnavailable: true, notice: 'On Leave (Full Day)' };
      }

      const hourMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      let hour24 = 12;
      if (hourMatch) {
        let h = parseInt(hourMatch[1], 10);
        const ampm = hourMatch[3].toUpperCase();
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        hour24 = h;
      }

      const isMorning = hour24 < 16.5;

      if (match.duration === 'FIRST_HALF' && isMorning) {
        return { isUnavailable: true, notice: 'Morning Shift Off (Available after 4:30 PM)' };
      }
      if (match.duration === 'SECOND_HALF' && !isMorning) {
        return { isUnavailable: true, notice: 'Evening Shift Off (Available until 4:30 PM)' };
      }
    }

    // 2. Check live blocked slots from backend API
    if (Array.isArray(liveBlockedSlots) && liveBlockedSlots.length > 0) {
      const blocked = liveBlockedSlots.find((b) => {
        if (b.date !== targetDateStr) return false;
        const matchesStylist =
          (artisanId && b.stylistId === artisanId) ||
          (b.stylist?.name && artisanName && b.stylist.name.toLowerCase() === artisanName.toLowerCase());
        if (!matchesStylist) return false;
        return b.timeSlot === 'ALL_DAY' || b.timeSlot === selectedTime;
      });

      if (blocked) {
        return {
          isUnavailable: true,
          notice: blocked.timeSlot === 'ALL_DAY' ? 'Unavailable Today' : `Booked at ${selectedTime}`,
        };
      }
    }

    return { isUnavailable: false, notice: '' };
  };

  // Check Blackout Dates and Blocked Time Slots from Schedule Control
  const getBlackoutStatus = (dayNum?: number) => {
    const yyyy = currentYear;
    const mm = String(currentMonthIndex + 1).padStart(2, '0');
    const dd = String(dayNum || selectedDay).padStart(2, '0');
    const targetDateStr = `${yyyy}-${mm}-${dd}`;

    let blackouts: any[] = [];
    try {
      const raw = localStorage.getItem('stylex_tirur_v6_blackouts');
      if (raw) blackouts = JSON.parse(raw);
    } catch (e) {}

    const matching = blackouts.filter((b) => {
      if (b.dateStr !== targetDateStr) return false;
      const st = (b.station || '').toLowerCase();
      if (st && !st.includes('all')) {
        if (st.includes('ladies') && selectedGender !== 'ladies') return false;
        if (st.includes('gents') && selectedGender !== 'gents') return false;
      }
      return true;
    });

    const fullDay = matching.find((b) => b.blockType === 'FULL_DAY');
    const blockedSlots: string[] = [];
    matching.forEach((b) => {
      if (b.blockType === 'TIME_SLOTS' && b.slots) {
        blockedSlots.push(...b.slots);
      }
    });

    return {
      isFullDayClosed: !!fullDay,
      fullDayTitle: fullDay?.title || '',
      blockedSlots,
      station: fullDay?.station || 'All',
    };
  };

  // Fetch real-time slot occupancy from backend
  useEffect(() => {
    let isCancelled = false;
    const yyyy = currentYear;
    const mm = String(currentMonthIndex + 1).padStart(2, '0');
    const dd = String(selectedDay).padStart(2, '0');
    const isoDateStr = `${yyyy}-${mm}-${dd}`;

    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const queryParams = new URLSearchParams({
          date: isoDateStr,
          gender: selectedGender,
        });
        if (selectedArtisan && selectedArtisan !== 'Any Stylist' && selectedArtisan !== 'Any Master Artisan') {
          queryParams.set('stylistId', selectedArtisan);
        }

        const res = await fetch(`/api/bookings/slots?${queryParams.toString()}`);
        if (!res.ok) return;
        const json = await res.json().catch(() => null);
        if (json?.success && Array.isArray(json?.data) && !isCancelled) {
          const map: Record<string, SlotOccupancyInfo> = {};
          json.data.forEach((slot: SlotOccupancyInfo) => {
            map[slot.timeSlot] = slot;
          });
          setSlotOccupancy(map);

          // If current selected time is full (3/3), blocked, or in the past, auto-select first available time slot
          const currentBlackout = getBlackoutStatus(selectedDay);
          const currentSlot = map[selectedTime];
          const isCurrentPast = isSlotInPast(selectedTime, selectedDay, currentMonthIndex, currentYear);
          const isCurrentFull =
            isCurrentPast ||
            currentBlackout.blockedSlots.includes(selectedTime) ||
            (currentSlot && (!currentSlot.isAvailable || currentSlot.status === 'full' || currentSlot.bookedCount >= 3));

          if (isCurrentFull) {
            const firstAvailable = TIME_SLOTS.find((s) => {
              if (isSlotInPast(s, selectedDay, currentMonthIndex, currentYear)) return false;
              if (currentBlackout.blockedSlots.includes(s)) return false;
              const occ = map[s];
              return !occ || (occ.isAvailable && occ.status !== 'full' && occ.bookedCount < 3);
            });
            if (firstAvailable) {
              setSelectedTime(firstAvailable);
            }
          }
        }
      } catch (err) {
        console.warn('Real-time slot occupancy load notice:', err);
      } finally {
        if (!isCancelled) {
          setIsLoadingSlots(false);
        }
      }
    };

    fetchSlots();
    const interval = setInterval(fetchSlots, 20000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [selectedDay, currentMonthIndex, currentYear, selectedGender, selectedArtisan]);

  // Ensure selectedTime automatically switches away from past/blocked/full slot whenever date changes
  useEffect(() => {
    const isPast = isSlotInPast(selectedTime, selectedDay, currentMonthIndex, currentYear);
    const occ = slotOccupancy[selectedTime];
    const isBlocked = getBlackoutStatus(selectedDay).blockedSlots.includes(selectedTime);
    const isFull = isBlocked || (occ ? !occ.isAvailable || occ.status === 'full' || (occ.bookedCount || 0) >= 3 : false);

    if (isPast || isFull) {
      const currentBlackout = getBlackoutStatus(selectedDay);
      const nextAvailable = TIME_SLOTS.find((s) => {
        if (isSlotInPast(s, selectedDay, currentMonthIndex, currentYear)) return false;
        if (currentBlackout.blockedSlots.includes(s)) return false;
        const o = slotOccupancy[s];
        return !o || (o.isAvailable && o.status !== 'full' && (o.bookedCount || 0) < 3);
      });
      if (nextAvailable) {
        setSelectedTime(nextAvailable);
      }
    }
  }, [selectedDay, currentMonthIndex, currentYear]);

  const handleSubmit = async () => {
    // Full Name is compulsory
    const cleanName = fullName.trim();
    if (!cleanName) {
      setNameError('Please enter your full name');
      return;
    }
    setNameError('');

    // Mobile number is strictly compulsory
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone) {
      setPhoneError('Please enter your mobile number');
      return;
    }
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      setPhoneError('Please enter a valid mobile number');
      return;
    }
    setPhoneError('');

    // Email is optional, but if entered it must be valid format
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');

    const currentBlackout = getBlackoutStatus();
    if (currentBlackout.isFullDayClosed) {
      alert(`Sorry, reservations are closed on this date. Please choose another date.`);
      return;
    }
    if (currentBlackout.blockedSlots.includes(selectedTime)) {
      alert(`The selected time slot (${selectedTime}) is blocked. Please select another slot.`);
      return;
    }
    if (isSlotInPast(selectedTime, selectedDay, currentMonthIndex, currentYear)) {
      alert(`The selected time slot (${selectedTime}) has already passed. Please choose an upcoming time slot.`);
      return;
    }

    const yyyy = currentYear;
    const mm = String(currentMonthIndex + 1).padStart(2, '0');
    const dd = String(selectedDay).padStart(2, '0');
    const isoDateStr = `${yyyy}-${mm}-${dd}`;

    const currentOccupancy = slotOccupancy[selectedTime];
    if (currentOccupancy && (!currentOccupancy.isAvailable || currentOccupancy.status === 'full' || currentOccupancy.bookedCount >= 3)) {
      alert(`The ${selectedGender === 'ladies' ? 'Ladies' : 'Gents'} Section has reached its maximum capacity of 3 concurrent appointments for ${selectedTime} on ${isoDateStr}. Please select an adjacent time slot.`);
      return;
    }

    setIsSubmitting(true);

    const cleanStylist =
      selectedArtisan && selectedArtisan !== 'Any Stylist' && selectedArtisan !== 'Any Master Artisan'
        ? selectedArtisan
        : undefined;

    try {
      const payload = {
        customerName: cleanName,
        customerPhone: digitsOnly,
        countryCode: phoneCountryCode,
        customerEmail: email.trim() || undefined,
        serviceId: selectedService.id,
        stylistId: cleanStylist,
        gender: selectedGender,
        date: isoDateStr,
        timeSlot: selectedTime,
        notes: notes.trim() || undefined,
        source: 'WEBSITE',
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let json: any = null;
      try {
        const text = await res.text();
        try {
          json = JSON.parse(text);
        } catch {
          console.warn('Server response was not JSON:', text.slice(0, 200));
        }
      } catch (e) {
        console.error('Failed to read server response body:', e);
      }

      if (!res.ok || !json?.success || !json?.data?.booking) {
        let errorMsg = json?.message;
        if (!errorMsg) {
          if (res.status === 502 || res.status === 503 || res.status === 504) {
            errorMsg = 'Reservation system is currently synchronizing. Please try again in a few moments, or contact our concierge directly at +91 96561 11149.';
          } else {
            errorMsg = `Unable to complete your reservation (HTTP ${res.status}). Please try another time slot or contact our concierge directly at +91 96561 11149.`;
          }
        }
        console.error('Booking submission rejected by server:', res.status, json);
        alert(errorMsg);
        return;
      }

      const createdBooking = json.data.booking;
      const serverRef = createdBooking.bookingRef;
      const assignedStylistName = createdBooking.stylist?.name || selectedArtisan;

      // Re-sync slot occupancy after successful booking
      setSlotOccupancy((prev) => {
        const existing = prev[selectedTime];
        const newCount = (existing?.bookedCount || 0) + 1;
        return {
          ...prev,
          [selectedTime]: {
            timeSlot: selectedTime,
            bookedCount: newCount,
            maxCapacity: 3,
            isAvailable: newCount < 3,
            status: newCount >= 3 ? 'full' : newCount === 2 ? 'filling_fast' : 'available',
          },
        };
      });

      onConfirmBooking({
        bookingRef: serverRef,
        customerName: cleanName,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        price: selectedService.price,
        duration: selectedService.duration,
        date: dateString,
        dayOfMonth: selectedDay,
        time: selectedTime,
        stylist: assignedStylistName,
        notes: notes,
        beverage: 'Complimentary Artisanal Herbal Drink',
        gender: selectedGender,
        phoneCountryCode: phoneCountryCode,
        phone: cleanPhone,
        email: email.trim(),
      });
    } catch (err) {
      console.error('Booking network error:', err);
      alert('Network error connecting to StyleX reservation servers. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                      {availableHeadings.map((heading) => (
                        <option key={heading.id} value={heading.id}>
                          {heading.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Select Buttons (Swipeable on Mobile) */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#424844]/70 font-label-caps whitespace-nowrap">
                      Popular:
                    </span>
                    {availableHeadings.slice(0, 5).map((heading) => {
                      const isSelected = selectedService.id === heading.id;
                      return (
                        <button
                          key={heading.id}
                          onClick={() => setSelectedService(heading)}
                          className={`px-3 py-1 rounded-full text-[11.5px] sm:text-[12px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#112e20] text-white font-semibold shadow-sm'
                              : 'bg-[#f0f5f1] text-[#181d1b] border border-[#c2c8c2]/50 hover:border-[#112e20]/40'
                          }`}
                          type="button"
                        >
                          {heading.name}
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
                          disabled={isCurrentOrPastMonth}
                          aria-label="Previous Month"
                          className={`w-7 h-7 rounded-full border border-[#c2c8c2]/50 flex items-center justify-center transition-colors ${
                            isCurrentOrPastMonth
                              ? 'text-neutral-300 dark:text-neutral-600 opacity-30 cursor-not-allowed border-transparent'
                              : 'text-[#181d1b] hover:bg-[#eaefeb] cursor-pointer'
                          }`}
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
                        const dayBlackout = getBlackoutStatus(dayNum);
                        const isDayClosed = dayBlackout.isFullDayClosed;

                        const todayObj = getSalonNow();
                        todayObj.setHours(0, 0, 0, 0);
                        const cellDateObj = new Date(currentYear, currentMonthIndex, dayNum);
                        cellDateObj.setHours(0, 0, 0, 0);
                        const isPast = cellDateObj.getTime() < todayObj.getTime();

                        return (
                          <button
                            key={dayNum}
                            onClick={() => !isPast && !isDayClosed && setSelectedDay(dayNum)}
                            disabled={isPast || isDayClosed}
                            title={isPast ? 'Past date cannot be booked' : isDayClosed ? 'Salon Closed' : undefined}
                            className={`h-8 rounded-lg flex items-center justify-center font-medium transition-colors relative ${
                              isPast
                                ? 'text-neutral-400/40 bg-neutral-100/30 cursor-not-allowed line-through opacity-40 select-none'
                                : isSelected
                                ? 'bg-[#112e20] text-white font-bold shadow-sm ring-2 ring-[#112e20] cursor-pointer'
                                : isDayClosed
                                ? 'text-red-500 bg-red-50/70 font-semibold border border-red-200/50 cursor-not-allowed'
                                : 'text-[#181d1b] hover:bg-[#eaefeb] cursor-pointer'
                            }`}
                            type="button"
                          >
                            {dayNum}
                            {isDayClosed && !isPast && (
                              <span className="w-1 h-1 rounded-full bg-red-500 absolute bottom-1" />
                            )}
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
                        <span>Open 10 AM – 12 AM</span>
                      </div>
                    </div>
                  </div>

                  {/* Time Slots & Master Artisan (5 cols) */}
                  <div className="md:col-span-5 space-y-3.5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#424844] font-label-caps block">
                          Select Time Slot (1-Hour)
                        </label>
                        <span className="text-[11px] text-[#fe753c] font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">schedule</span> 10 AM – 12 AM
                        </span>
                      </div>

                      {/* Touch-Friendly Grid of All Available Slots */}
                      {(() => {
                        const currentBlackout = getBlackoutStatus();
                        if (currentBlackout.isFullDayClosed) {
                          return (
                            <div className="p-4 bg-red-50/90 border border-red-200 rounded-2xl text-center">
                              <span className="material-symbols-outlined text-[24px] text-red-600 mb-1">block</span>
                              <p className="text-[12.5px] font-bold text-red-900">
                                Date Closed
                              </p>
                              <p className="text-[11px] text-red-700 mt-0.5">
                                Salon reservations are closed on this date ({currentBlackout.station || 'Entire Salon'}). Please choose an alternative date.
                              </p>
                            </div>
                          );
                        }

                        const allSlotsPast = timeSlots.every((s) =>
                          isSlotInPast(s, selectedDay, currentMonthIndex, currentYear)
                        );

                        return (
                          <div className="space-y-2">
                            {allSlotsPast && (
                              <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-center space-y-1.5">
                                <div className="flex items-center justify-center gap-1.5 text-amber-900 text-[12px] font-bold">
                                  <span className="material-symbols-outlined text-[17px] text-amber-600">history_toggle_off</span>
                                  <span>All Slots for Today Have Closed</span>
                                </div>
                                <p className="text-[11px] text-amber-800">
                                  Appointment slots for today have concluded. Please select tomorrow to reserve your slot.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const tomorrow = new Date(getSalonNow());
                                    tomorrow.setDate(tomorrow.getDate() + 1);
                                    setSelectedDay(tomorrow.getDate());
                                    setCurrentMonthIndex(tomorrow.getMonth());
                                    setCurrentYear(tomorrow.getFullYear());
                                  }}
                                  className="mt-0.5 px-3 py-1 bg-[#112e20] text-white text-[11px] font-semibold rounded-lg hover:bg-[#185341] transition-colors cursor-pointer inline-flex items-center gap-1"
                                >
                                  <span>Reserve for Tomorrow</span>
                                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                                </button>
                              </div>
                            )}

                            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                              {timeSlots.map((slot) => {
                                const isSelected = selectedTime === slot;
                                const isSlotBlocked = currentBlackout.blockedSlots.includes(slot);
                                const occ = slotOccupancy[slot];
                                const bookedCount = occ?.bookedCount || 0;
                                const isFull = isSlotBlocked || (occ ? !occ.isAvailable || occ.status === 'full' || bookedCount >= 3 : false);
                                const isPast = isSlotInPast(slot, selectedDay, currentMonthIndex, currentYear);
                                const isDisabled = isPast || isFull;
                                const isFillingFast = !isDisabled && (occ ? occ.status === 'filling_fast' || bookedCount === 2 : false);

                                return (
                                  <button
                                    key={slot}
                                    disabled={isDisabled}
                                    onClick={() => setSelectedTime(slot)}
                                    title={
                                      isPast
                                        ? 'Time Passed (Cannot book past slots)'
                                        : isFull
                                        ? 'Fully Booked'
                                        : isFillingFast
                                        ? 'Filling Fast'
                                        : 'Available'
                                    }
                                    className={`py-2.5 px-1 rounded-xl text-[12px] font-semibold transition-all duration-150 text-center relative select-none ${
                                      isPast
                                        ? 'bg-neutral-100 text-neutral-400 border-2 border-neutral-200/80 cursor-not-allowed opacity-50 line-through'
                                        : isFull
                                        ? 'bg-red-50/70 text-red-500/80 border-2 border-red-200/80 cursor-not-allowed opacity-70'
                                        : isFillingFast
                                        ? isSelected
                                          ? 'bg-[#fe753c] text-white font-bold shadow-md ring-2 ring-[#fe753c]/40 border-2 border-[#fe753c] cursor-pointer'
                                          : 'bg-white text-amber-700 border-2 border-amber-400 hover:bg-amber-500 hover:text-white hover:border-amber-500 cursor-pointer'
                                        : isSelected
                                        ? 'bg-[#fe753c] text-white font-bold shadow-md ring-2 ring-[#fe753c]/40 border-2 border-[#fe753c] cursor-pointer'
                                        : 'bg-white text-[#185341] border-2 border-emerald-600/50 hover:bg-[#185341] hover:text-white hover:border-[#185341] cursor-pointer'
                                    }`}
                                    type="button"
                                  >
                                    <span>{slot}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Status Legend */}
                            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 px-1 text-[11px] font-medium text-[#424844]">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-600" />
                                <span className="text-[#185341] font-semibold">Available</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500" />
                                <span className="text-amber-800 font-semibold">Filling Fast</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-red-600" />
                                <span className="text-red-700 font-semibold">Full</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 border border-neutral-400" />
                                <span className="text-neutral-500 font-semibold">Past Slot</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-emerald-600/50 text-[#181d1b] font-body-md text-[13px] hover:border-[#185341] hover:bg-emerald-50/20 focus:outline-none focus:border-[#185341] cursor-pointer transition-colors shadow-xs"
                      >
                        <option value="Any Stylist" className="bg-white text-[#181d1b] font-medium">Any Stylist</option>
                        {availableArtisans.map((a) => {
                          const leaveStatus = getStylistLeaveStatus(a.name, a.id);
                          return (
                            <option
                              key={a.id || a.name}
                              value={a.name}
                              disabled={leaveStatus.isUnavailable}
                              className={leaveStatus.isUnavailable ? 'text-gray-400 bg-gray-100 italic' : 'bg-white text-[#181d1b]'}
                            >
                              {a.name}{leaveStatus.isUnavailable ? ` • [${leaveStatus.notice}]` : ''}
                            </option>
                          );
                        })}
                      </select>

                      {/* Advisory if currently selected stylist is on leave for this slot */}
                      {(() => {
                        if (selectedArtisan === 'Any Stylist') return null;
                        const leaveStatus = getStylistLeaveStatus(selectedArtisan);
                        if (!leaveStatus.isUnavailable) return null;
                        return (
                          <div className="mt-1.5 p-2.5 bg-[#ffe088]/30 border border-[#ffe088] rounded-xl flex items-start gap-2 text-xs text-[#735c00]">
                            <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0">
                              info
                            </span>
                            <span>
                              <strong>{selectedArtisan}</strong> is {leaveStatus.notice.toLowerCase()} on this date and time.
                              Please select another time or choose <em>"Any Stylist"</em>.
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests & Notes (Collapsible) */}
              <div className="space-y-2 pt-2 border-t border-[#c2c8c2]/30">
                <button
                  type="button"
                  onClick={() => setShowNotes(!showNotes)}
                  className="w-full text-left flex flex-col gap-0.5 cursor-pointer group"
                >
                  <div className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#185341] group-hover:text-[#042018] transition-colors">
                    <span className="material-symbols-outlined text-[16px] text-[#fe753c]">
                      {showNotes ? 'remove_circle_outline' : 'add_circle_outline'}
                    </span>
                    <span>{showNotes ? 'Hide special requests or extra services' : 'Add special requests or notes (optional)'}</span>
                  </div>
                  <span className="text-[11.5px] text-[#424844]/75 pl-5">
                    If you need any extra services you may mention here
                  </span>
                </button>

                {showNotes && (
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="If you need any extra services or have special requests, mention them here..."
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
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#fe753c] text-white flex items-center justify-center text-[10px] font-bold">
                      3
                    </span>
                    <span className="text-[#fe753c] text-[11px] font-bold uppercase tracking-[0.18em] font-label-caps">
                      Confirm Appointment
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#18392d]/80 text-[10px] font-bold tracking-wider text-[#9eb6aa] uppercase border border-white/10">
                    Summary & Pass
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
                      <span>{selectedGender === 'gents' ? 'Gents' : 'Ladies'}</span>
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-headline-sm text-[18px] sm:text-[22px] font-semibold tracking-normal font-display-hero">
                      {selectedService.name}
                    </h3>
                    <p className="text-[12px] text-[#9eb6aa] mt-0.5">
                      {selectedService.categoryLabel} • {selectedArtisan}
                    </p>
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

                  {notes.trim() && (
                    <div className="bg-[#0f2d22] border border-[#fe753c]/30 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 space-y-0.5">
                      <p className="text-[9.5px] font-bold uppercase tracking-wider text-[#fe753c] font-label-caps flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">edit_note</span>
                        <span>Extra Services / Notes</span>
                      </p>
                      <p className="text-[12px] text-white/95 truncate">"{notes}"</p>
                    </div>
                  )}
                </div>

                {/* Guest Contact Details */}
                <div className="space-y-2.5 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#9eb6aa] font-label-caps block">
                      Guest Contact Details
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Guest Full Name (Compulsory) */}
                    <div className="space-y-1 sm:col-span-2">
                      <div className={`flex items-center rounded-xl bg-[#0f2d22] border ${
                        nameError ? 'border-red-400 ring-1 ring-red-400' : 'border-white/15'
                      } focus-within:border-[#fe753c] focus-within:bg-[#0b241a] transition-all overflow-hidden`}>
                        <span className="pl-2.5 text-[#9eb6aa] flex items-center">
                          <span className="material-symbols-outlined text-[16px]">person</span>
                        </span>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (nameError) setNameError('');
                          }}
                          placeholder="Your Full Name *"
                          required
                          className="w-full px-2.5 py-2.5 bg-transparent text-white text-[12.5px] placeholder-[#9eb6aa]/50 focus:outline-none font-medium"
                        />
                      </div>
                      {nameError && (
                        <p className="text-[10.5px] text-red-400 font-medium flex items-center gap-1 pt-0.5">
                          <span className="material-symbols-outlined text-[12px]">error</span>
                          {nameError}
                        </p>
                      )}
                    </div>

                    {/* Mobile Number with Extension Selector (Compulsory) */}
                    <div className="space-y-1">
                      <div className={`flex items-center rounded-xl bg-[#0f2d22] border ${
                        phoneError ? 'border-red-400 ring-1 ring-red-400' : 'border-white/15'
                      } focus-within:border-[#fe753c] focus-within:bg-[#0b241a] transition-all overflow-hidden`}>
                        <select
                          value={phoneCountryCode}
                          onChange={(e) => setPhoneCountryCode(e.target.value)}
                          className="py-2.5 pl-2.5 pr-1 bg-[#0f2d22] text-white font-semibold text-[12.5px] focus:outline-none cursor-pointer border-r border-white/10"
                          aria-label="Country Extension"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code + c.country} value={c.code} className="bg-[#071a14] text-white">
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            if (phoneError) setPhoneError('');
                          }}
                          placeholder="Mobile Number *"
                          required
                          className="w-full px-3 py-2 bg-transparent text-white text-[12.5px] placeholder-[#9eb6aa]/50 focus:outline-none font-medium"
                        />
                      </div>
                      {phoneError && (
                        <p className="text-[10.5px] text-red-400 font-medium flex items-center gap-1 pt-0.5">
                          <span className="material-symbols-outlined text-[12px]">error</span>
                          {phoneError}
                        </p>
                      )}
                    </div>

                    {/* Email Address Input (Optional, NO 'optional' label!) */}
                    <div className="space-y-1">
                      <div className={`flex items-center rounded-xl bg-[#0f2d22] border ${
                        emailError ? 'border-red-400 ring-1 ring-red-400' : 'border-white/15'
                      } focus-within:border-[#fe753c] focus-within:bg-[#0b241a] transition-all overflow-hidden`}>
                        <span className="pl-2.5 text-[#9eb6aa] flex items-center">
                          <span className="material-symbols-outlined text-[15px]">mail</span>
                        </span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError('');
                          }}
                          placeholder="Email Address"
                          className="w-full px-2.5 py-2 bg-transparent text-white text-[12.5px] placeholder-[#9eb6aa]/50 focus:outline-none font-medium"
                        />
                      </div>
                      {emailError && (
                        <p className="text-[10.5px] text-red-400 font-medium flex items-center gap-1 pt-0.5">
                          <span className="material-symbols-outlined text-[12px]">error</span>
                          {emailError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reservation Status & Zero Prepayment */}
                <div className="pt-2.5 border-t border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-white font-medium text-[13px]">
                    <span className="text-[#9eb6aa]">Reservation Status</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Priority Guaranteed
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9eb6aa] flex items-center gap-1.5 pt-0.5">
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
