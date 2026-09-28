import React, { useState, useEffect, useMemo } from 'react';
import {
  NavTab,
  Appointment,
  ServiceItem,
  DaySchedule,
  BlackoutDate,
  CarouselBanner,
  ReelItem,
  PortfolioWork,
  Stylist,
  VIPClient,
  ConciergeInquiry,
  SalonSettings,
  StylistLeave,
  UserAccount,
  SystemRole,
} from './types';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_SERVICES,
  INITIAL_WEEK_SCHEDULE,
  INITIAL_BLACKOUT_DATES,
  INITIAL_BANNERS,
  INITIAL_REELS,
  INITIAL_PORTFOLIO_WORKS,
  INITIAL_STYLISTS,
  INITIAL_VIP_CLIENTS,
  INITIAL_CONCIERGE_INQUIRIES,
  INITIAL_SETTINGS,
  INITIAL_STYLIST_LEAVES,
  INITIAL_USERS,
  getRelativeDateStr,
} from './mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer, ToastMessage } from './components/Toast';
import { DashboardApi, mapBackendBookingToAppointment } from './services/api';
import { OverviewView } from './components/OverviewView';
import { AppointmentsView } from './components/AppointmentsView';
import { ScheduleView } from './components/ScheduleView';
import { ArtisansView } from './components/ArtisansView';
import { ServiceMenuView } from './components/ServiceMenuView';
import { PromotionsView } from './components/PromotionsView';
import { ClientsView } from './components/ClientsView';
import { ConciergeView } from './components/ConciergeView';
import { SettingsView } from './components/SettingsView';
import { AdminSignIn } from './components/AdminSignIn';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { UserModal } from './components/modals/UserModal';

import { NewBookingModal } from './components/modals/NewBookingModal';
import { ExpressWalkInModal } from './components/modals/ExpressWalkInModal';
import { AddServiceModal } from './components/modals/AddServiceModal';
import { AddBlackoutModal } from './components/modals/AddBlackoutModal';
import { AddPromotionModal } from './components/modals/AddPromotionModal';
import { AddReelModal } from './components/modals/AddReelModal';
import { AddPortfolioPhotoModal } from './components/modals/AddPortfolioPhotoModal';
import { RunSheetModal } from './components/modals/RunSheetModal';
import { ManageBookingModal } from './components/modals/ManageBookingModal';
import { ScheduleStylistLeaveModal } from './components/modals/ScheduleStylistLeaveModal';
import { StylistModal } from './components/modals/StylistModal';

import { safeSetItem, safeGetItem, cleanObsoleteStorage } from './utils/storage';

// Run cleanup immediately to purge legacy keys and free up localStorage quota
cleanObsoleteStorage();

function safeParse<T>(key: string, fallback: T): T {
  return safeGetItem<T>(key, fallback);
}

export default function App() {
  // Navigation & Authentication
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('stylex_session_active') === 'true';
  });

  // User Accounts & Authentication (Dynamic Staff Directory)
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const parsed = safeParse<UserAccount[]>('stylex_user_accounts_v2', INITIAL_USERS);
    const safeList = Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
    const hasBladeoski = safeList.some((u) => u?.username === 'bladeoski' || u?.id === 'user-bladeoski');
    const hasDev = safeList.some((u) => u?.username === 'developer' || u?.id === 'user-dev');
    const hasAdmin = safeList.some((u) => u?.username === 'admin' || u?.id === 'user-admin' || u?.id === 'user-1');
    let merged = [...safeList];
    if (!hasBladeoski) {
      const blade = INITIAL_USERS.find((u) => u.username === 'bladeoski');
      if (blade) merged.push(blade);
    }
    if (!hasDev) {
      const dev = INITIAL_USERS.find((u) => u.username === 'developer');
      if (dev) merged.push(dev);
    }
    if (!hasAdmin) {
      const adm = INITIAL_USERS.find((u) => u.username === 'admin');
      if (adm) merged.push(adm);
    }
    return merged;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const loadedUsers = safeParse<UserAccount[]>('stylex_user_accounts_v2', INITIAL_USERS);
    const safeUsersList = Array.isArray(loadedUsers) && loadedUsers.length > 0 ? loadedUsers : INITIAL_USERS;
    const savedIdentifier = (
      localStorage.getItem('stylex_current_user_email_v2') ||
      localStorage.getItem('stylex_current_user_email_v1') ||
      ''
    ).trim().toLowerCase();

    if (savedIdentifier) {
      const matched = safeUsersList.find((u) => {
        const uEmail = (u?.email || '').trim().toLowerCase();
        const uName = (u?.username || '').trim().toLowerCase();
        return (uEmail && uEmail === savedIdentifier) || (uName && uName === savedIdentifier);
      });
      if (matched) return matched;
    }
    return safeUsersList[0] || INITIAL_USERS[0];
  });

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<UserAccount | null>(null);

  // Sync users to localStorage
  useEffect(() => {
    safeSetItem('stylex_user_accounts_v2', JSON.stringify(users));
  }, [users]);

  // Keep currentUser in sync if updated in users list
  useEffect(() => {
    if (!currentUser?.id) return;
    const updated = users.find((u) => u?.id === currentUser.id);
    if (updated) {
      setCurrentUser(updated);
    }
  }, [users, currentUser?.id]);

  // Core Data (with Tirur Flagship data keys)
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const parsed = safeParse<Appointment[]>('stylex_tirur_v7_appointments', INITIAL_APPOINTMENTS);
    return Array.isArray(parsed) ? parsed : INITIAL_APPOINTMENTS;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const parsed = safeParse<ServiceItem[]>('stylex_tirur_v6_services', INITIAL_SERVICES);
    return Array.isArray(parsed) ? parsed : INITIAL_SERVICES;
  });

  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>(() => {
    const parsed = safeParse<DaySchedule[]>('stylex_tirur_v7_schedule', INITIAL_WEEK_SCHEDULE);
    return Array.isArray(parsed) ? parsed : INITIAL_WEEK_SCHEDULE;
  });

  const [blackoutDates, setBlackoutDates] = useState<BlackoutDate[]>(() => {
    const parsed = safeParse<BlackoutDate[]>('stylex_tirur_v6_blackouts', INITIAL_BLACKOUT_DATES);
    return Array.isArray(parsed) ? parsed : INITIAL_BLACKOUT_DATES;
  });

  const [banners, setBanners] = useState<CarouselBanner[]>(() => {
    const parsed = safeParse<CarouselBanner[]>('stylex_tirur_v6_banners', INITIAL_BANNERS);
    return Array.isArray(parsed) ? parsed : INITIAL_BANNERS;
  });

  const [reels, setReels] = useState<ReelItem[]>(() => {
    const parsed = safeParse<ReelItem[]>('stylex_tirur_v6_reels', INITIAL_REELS);
    return Array.isArray(parsed) ? parsed : INITIAL_REELS;
  });

  const [portfolioWorks, setPortfolioWorks] = useState<PortfolioWork[]>(() => {
    const parsed = safeParse<PortfolioWork[]>('stylex_tirur_v6_portfolio', INITIAL_PORTFOLIO_WORKS);
    return Array.isArray(parsed) ? parsed : INITIAL_PORTFOLIO_WORKS;
  });

  const [stylists, setStylists] = useState<Stylist[]>(() => {
    const parsed = safeParse<Stylist[]>('stylex_tirur_v6_stylists', INITIAL_STYLISTS);
    if (Array.isArray(parsed)) {
      return parsed.map((s: Stylist) => {
        const { specialty: _spec, ...rest } = s;
        return rest;
      });
    }
    return INITIAL_STYLISTS;
  });
  const [vipClients, setVipClients] = useState<VIPClient[]>(() => {
    const parsed = safeParse<VIPClient[]>('stylex_tirur_v6_clients', INITIAL_VIP_CLIENTS);
    return Array.isArray(parsed) ? parsed : INITIAL_VIP_CLIENTS;
  });

  const [stylistLeaves, setStylistLeaves] = useState<StylistLeave[]>(() => {
    const parsed = safeParse<StylistLeave[]>('stylex_tirur_v6_stylist_leaves', INITIAL_STYLIST_LEAVES);
    return Array.isArray(parsed) ? parsed : INITIAL_STYLIST_LEAVES;
  });

  const [inquiries, setInquiries] = useState<ConciergeInquiry[]>(() => {
    const parsed = safeParse<ConciergeInquiry[]>('stylex_tirur_v6_inquiries', INITIAL_CONCIERGE_INQUIRIES);
    return Array.isArray(parsed) ? parsed : INITIAL_CONCIERGE_INQUIRIES;
  });

  const [settings, setSettings] = useState<SalonSettings>(() => {
    const parsed = safeParse<SalonSettings>('stylex_tirur_v6_settings', INITIAL_SETTINGS);
    const maintenanceSaved = localStorage.getItem('stylex_maintenance_mode');
    if (maintenanceSaved !== null) {
      return { ...parsed, maintenanceMode: maintenanceSaved === 'true' };
    }
    return parsed;
  });

  const [isEngineActive, setIsEngineActive] = useState<boolean>(true);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Modals state
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [bookingInitialDate, setBookingInitialDate] = useState<string>('');
  const [isExpressWalkInOpen, setIsExpressWalkInOpen] = useState(false);
  const [isRunSheetOpen, setIsRunSheetOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<ServiceItem | null>(null);
  const [isAddBlackoutOpen, setIsAddBlackoutOpen] = useState(false);
  const [isAddPromotionOpen, setIsAddPromotionOpen] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState<CarouselBanner | null>(null);
  const [isAddReelOpen, setIsAddReelOpen] = useState(false);
  const [reelToEdit, setReelToEdit] = useState<ReelItem | null>(null);
  const [isAddPortfolioPhotoOpen, setIsAddPortfolioPhotoOpen] = useState(false);
  const [portfolioPhotoToEdit, setPortfolioPhotoToEdit] = useState<PortfolioWork | null>(null);
  const [managedAppointment, setManagedAppointment] = useState<Appointment | null>(null);
  const [isScheduleLeaveOpen, setIsScheduleLeaveOpen] = useState(false);
  const [leaveTargetStylistId, setLeaveTargetStylistId] = useState<string | undefined>(undefined);
  const [isStylistModalOpen, setIsStylistModalOpen] = useState(false);
  const [stylistToEdit, setStylistToEdit] = useState<Stylist | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'error', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to localStorage
  useEffect(() => {
    safeSetItem('stylex_tirur_v7_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    safeSetItem('stylex_tirur_v6_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    safeSetItem('stylex_tirur_v7_schedule', JSON.stringify(weekSchedule));
  }, [weekSchedule]);

  useEffect(() => {
    safeSetItem('stylex_tirur_v6_blackouts', JSON.stringify(blackoutDates));
  }, [blackoutDates]);

  useEffect(() => {
    safeSetItem('stylex_tirur_v6_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    safeSetItem('stylex_tirur_v6_reels', JSON.stringify(reels));
    // Dispatch storage event so client site can hot-reload
    window.dispatchEvent(new Event('storage'));
  }, [reels]);

  useEffect(() => {
    safeSetItem('stylex_tirur_v6_portfolio', JSON.stringify(portfolioWorks));
    window.dispatchEvent(new Event('storage'));
  }, [portfolioWorks]);

  useEffect(() => {
    safeSetItem('stylex_tirur_v6_stylist_leaves', JSON.stringify(stylistLeaves));
    safeSetItem('stylex_stylist_leaves', JSON.stringify(stylistLeaves));
  }, [stylistLeaves]);

  useEffect(() => {
    safeSetItem('stylex_tirur_v6_stylists', JSON.stringify(stylists));
  }, [stylists]);

  useEffect(() => {
    safeSetItem('stylex_tirur_v6_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    safeSetItem('stylex_tirur_v6_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Live Data Synchronization with PostgreSQL Backend
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadRealData = async (silent = true) => {
    try {
      if (!DashboardApi.getToken()) {
        await DashboardApi.silentLogin();
      }

      // 1. Fetch live bookings from PostgreSQL
      try {
        const liveBookings = await DashboardApi.getBookings();
        if (Array.isArray(liveBookings)) {
          const mappedAppointments = liveBookings.map(mapBackendBookingToAppointment);
          setAppointments(mappedAppointments);
        }
      } catch (e) {
        console.warn('Live bookings fetch:', e);
      }

      // 2. Fetch live services
      try {
        const liveServices = await DashboardApi.getServices();
        if (Array.isArray(liveServices) && liveServices.length > 0) {
          setServices(liveServices);
        }
      } catch (e) {
        console.warn('Live services fetch:', e);
      }

      // 3. Fetch live stylists
      try {
        const liveStylists = await DashboardApi.getStylists();
        if (Array.isArray(liveStylists)) {
          setStylists(liveStylists);
          try {
            safeSetItem('stylex_tirur_v6_stylists', JSON.stringify(liveStylists));
            safeSetItem('stylex_stylists', JSON.stringify(liveStylists));
          } catch {}
        }
      } catch (e) {
        console.warn('Live stylists fetch:', e);
      }

      // 4. Fetch live customers (CRM)
      try {
        const liveCustomers = await DashboardApi.getCustomers();
        if (Array.isArray(liveCustomers) && liveCustomers.length > 0) {
          setVipClients(liveCustomers);
        }
      } catch (e) {
        console.warn('Live customers fetch:', e);
      }

      // 5. Fetch promotional banners, reels, and photos
      try {
        const liveBanners = await DashboardApi.getBanners();
        if (Array.isArray(liveBanners)) {
          setBanners(liveBanners);
          safeSetItem('stylex_tirur_v6_banners', JSON.stringify(liveBanners));
          safeSetItem('stylex_banners', JSON.stringify(liveBanners));
        }
      } catch {}

      try {
        const liveReels = await DashboardApi.getReels();
        if (Array.isArray(liveReels)) {
          setReels(liveReels);
          safeSetItem('stylex_tirur_v6_reels', JSON.stringify(liveReels));
          safeSetItem('stylex_reels', JSON.stringify(liveReels));
        }
      } catch {}

      try {
        const livePhotos = await DashboardApi.getPortfolioPhotos();
        if (Array.isArray(livePhotos)) {
          setPortfolioWorks(livePhotos);
          safeSetItem('stylex_tirur_v6_photos', JSON.stringify(livePhotos));
          safeSetItem('stylex_photos', JSON.stringify(livePhotos));
          safeSetItem('stylex_tirur_v6_portfolio', JSON.stringify(livePhotos));
          safeSetItem('stylex_portfolio', JSON.stringify(livePhotos));
        }
      } catch {}

      // 6. Fetch live blocked slots
      try {
        const liveBlocked = await DashboardApi.getBlockedSlots();
        if (Array.isArray(liveBlocked) && liveBlocked.length > 0) {
          const grouped: Record<string, { id: string; dateStr: string; slots: string[]; reason: string }> = {};
          liveBlocked.forEach((b: any) => {
            const dateStr = b.date ? String(b.date).split('T')[0] : '';
            const tagMatch = (b.reason || '').match(/\[(block-[^\]]+)\]/);
            const groupKey = tagMatch ? tagMatch[1] : `${dateStr}_${b.reason || 'block'}`;
            if (!grouped[groupKey]) {
              grouped[groupKey] = {
                id: tagMatch ? tagMatch[1] : b.id,
                dateStr,
                slots: [],
                reason: (b.reason || '').replace(/\[block-[^\]]+\]/, '').trim(),
              };
            }
            if (b.timeSlot && b.timeSlot !== 'ALL_DAY') {
              grouped[groupKey].slots.push(b.timeSlot);
            }
          });

          const mappedBlackouts: BlackoutDate[] = Object.values(grouped).map((g) => {
            const dObj = new Date(g.dateStr + 'T00:00:00');
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const month = !isNaN(dObj.getTime()) ? monthNames[dObj.getMonth()] : 'OCT';
            const day = !isNaN(dObj.getTime()) ? String(dObj.getDate()).padStart(2, '0') : '01';
            const isFullDay = g.slots.length === 0;
            return {
              id: g.id,
              month,
              day,
              dateStr: g.dateStr,
              title: isFullDay ? 'Full Day Closure' : 'Blocked Time Slots',
              timeRange: isFullDay ? 'All Day' : g.slots.join(', '),
              blockType: isFullDay ? 'FULL_DAY' : 'TIME_SLOTS',
              slots: isFullDay ? undefined : g.slots,
              station: 'All',
              description: g.reason || (isFullDay ? 'Full day closure' : `${g.slots.length} slot(s) blocked`),
            };
          });

          if (mappedBlackouts.length > 0) {
            setBlackoutDates((prev) => {
              const prevIds = new Set(prev.map((p) => p.id));
              const newItems = mappedBlackouts.filter((m) => !prevIds.has(m.id));
              return [...newItems, ...prev];
            });
          }
        }
      } catch (e) {
        console.warn('Live blocked slots fetch:', e);
      }
    } catch (err) {
      console.warn('Live data sync encountered an error:', err);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadRealData(false);
      addToast(
        'success',
        'Live Data Synchronized',
        'Successfully fetched latest appointments and salon records.'
      );
    } catch {
      addToast('info', 'Synced', 'Salon records refreshed.');
    } finally {
      setTimeout(() => setIsRefreshing(false), 450);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadRealData();
      // Only poll bookings every 20s (not banners/services/stylists to avoid overwriting user toggles)
      const interval = setInterval(async () => {
        try {
          if (!DashboardApi.getToken()) await DashboardApi.silentLogin();
          const liveBookings = await DashboardApi.getBookings();
          if (Array.isArray(liveBookings)) {
            setAppointments(liveBookings.map(mapBackendBookingToAppointment));
          }
        } catch {}
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Operational Handlers
  const handleToggleEngine = () => {
    const next = !isEngineActive;
    setIsEngineActive(next);
    addToast(
      next ? 'success' : 'info',
      next ? 'Guest Booking Engine Activated' : 'Public Reservations Paused',
      next ? 'Public web portal is now accepting appointments.' : 'Public booking gateway is paused.'
    );
  };

  const handleToggleDaySchedule = (index: number) => {
    const targetDay = weekSchedule[index];
    if (!targetDay) return;
    const nextOpen = !targetDay.isOpen;
    setWeekSchedule((prev) =>
      prev.map((day, idx) =>
        idx === index
          ? { ...day, isOpen: nextOpen, statusText: nextOpen ? 'Open' : 'Closed' }
          : day
      )
    );
    addToast(
      'info',
      `${targetDay.dateStr} Availability Changed`,
      nextOpen ? 'Public booking slots open.' : 'Day marked closed/blackout.'
    );
  };

  const handleAddBooking = async (newBooking: Appointment) => {
    setAppointments((prev) => [newBooking, ...prev]);
    addToast(
      'success',
      'Booking Reservation Confirmed',
      `${newBooking.clientName} booked for ${newBooking.serviceName} at ${newBooking.time}.`
    );

    try {
      const selectedService = services.find((s) => s.name === newBooking.serviceName) || services[0];
      const selectedStylist = stylists.find((st) => st.name === newBooking.stylistName);

      const res = await DashboardApi.createBooking({
        customerName: newBooking.clientName,
        customerPhone: newBooking.clientPhone.replace(/\s+/g, ''),
        customerEmail: newBooking.clientEmail,
        serviceId: selectedService?.id || 'signature-service',
        stylistId: selectedStylist?.id,
        date: newBooking.dateStr,
        timeSlot: newBooking.time,
        notes: newBooking.notes,
        source: 'ADMIN_DASHBOARD',
      });

      if (res?.data?.booking) {
        const liveApt = mapBackendBookingToAppointment(res.data.booking);
        setAppointments((prev) => prev.map((a) => (a.id === newBooking.id ? liveApt : a)));
      }
    } catch (err) {
      console.warn('Backend API createBooking failed (retained locally):', err);
    }
  };

  const handleAddWalkIn = async (walkIn: Appointment) => {
    setAppointments((prev) => [walkIn, ...prev]);
    addToast(
      'success',
      'Express Walk-In Seated',
      `${walkIn.clientName} seated in ${walkIn.station} for ${walkIn.serviceName}.`
    );

    try {
      const todayYMD = new Date().toISOString().split('T')[0];
      const selectedService = services.find((s) => s.name === walkIn.serviceName) || services[0];
      const selectedStylist = stylists.find((st) => st.name === walkIn.stylistName);

      const res = await DashboardApi.createBooking({
        customerName: walkIn.clientName,
        customerPhone: walkIn.clientPhone.replace(/\s+/g, ''),
        serviceId: selectedService?.id || 'signature-service',
        stylistId: selectedStylist?.id,
        date: todayYMD,
        timeSlot: walkIn.time,
        notes: 'Walk-in Guest',
        source: 'WALK_IN',
      });

      if (res?.data?.booking) {
        const liveApt = mapBackendBookingToAppointment(res.data.booking);
        setAppointments((prev) => prev.map((a) => (a.id === walkIn.id ? liveApt : a)));
      }
    } catch (err) {
      console.warn('Backend API createWalkIn failed (retained locally):', err);
    }
  };

  const handleCheckIn = async (aptId: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: 'IN_PROGRESS' as const } : a))
    );
    const apt = appointments.find((a) => a.id === aptId);
    addToast(
      'success',
      'Guest In Progress',
      `${apt?.clientName || 'Guest'} marked In Progress at ${apt?.station || 'station'}.`
    );

    try {
      await DashboardApi.updateBookingStatus(aptId, 'IN_PROGRESS');
    } catch (err) {
      console.warn('Backend API update status failed:', err);
    }
  };

  const handlePrepare = (aptId: string) => {
    const apt = appointments.find((a) => a.id === aptId);
    addToast(
      'info',
      'Station Prepared',
      `${apt?.station || 'Station'} prepared for ${apt?.clientName || 'guest'}.`
    );
  };

  const handleSendLink = async (apt: Appointment) => {
    addToast(
      'info',
      'Sending WhatsApp Voucher...',
      `Triggering official WhatsApp confirmation to ${apt.clientPhone}...`
    );

    try {
      const res = await DashboardApi.resendWhatsApp(apt.id);
      if (res?.success) {
        addToast(
          'success',
          'WhatsApp Voucher Sent',
          `Successfully dispatched booking confirmation & directions to ${apt.clientPhone}.`
        );
      } else {
        addToast(
          'info',
          'Reminder Prepared',
          `Sent appointment confirmation to ${apt.clientPhone}.`
        );
      }
    } catch {
      addToast(
        'info',
        'Reminder Prepared',
        `Sent appointment confirmation to ${apt.clientPhone}.`
      );
    }
  };

  const handleCompleteSession = async (aptId: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === aptId
          ? { ...a, status: 'COMPLETED' as const }
          : a
      )
    );
    const apt = appointments.find((a) => a.id === aptId);
    addToast(
      'success',
      'Session Finished',
      `Ritual completed for ${apt?.clientName || 'guest'}. Station is now ready.`
    );

    try {
      await DashboardApi.updateBookingStatus(aptId, 'COMPLETED');
    } catch (err) {
      console.warn('Backend API update status failed:', err);
    }
  };

  const handleUpdateBooking = (updated: Appointment) => {
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    addToast(
      'success',
      'Booking Updated',
      `Reservation for ${updated.clientName} updated successfully.`
    );
  };

  const handleCancelBooking = async (aptId: string, reason?: string) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === aptId) {
          const notesAppend = reason ? `${a.notes ? a.notes + ' | ' : ''}Cancellation Reason: ${reason}` : a.notes;
          return { ...a, status: 'CANCELLED' as const, notes: notesAppend };
        }
        return a;
      })
    );
    const target = appointments.find((a) => a.id === aptId);
    addToast(
      'info',
      'Booking Cancelled',
      `Reservation for ${target?.clientName || 'guest'} has been cancelled.`
    );

    try {
      await DashboardApi.updateBookingStatus(aptId, 'CANCELLED', reason);
    } catch (err) {
      console.warn('Backend API cancel status failed:', err);
    }
  };

  const handleDeleteBooking = async (aptId: string) => {
    const target = appointments.find((a) => a.id === aptId);
    setAppointments((prev) => prev.filter((a) => a.id !== aptId));
    addToast(
      'info',
      'Booking Removed',
      `Record for ${target?.clientName || 'guest'} permanently deleted from registry.`
    );

    try {
      await DashboardApi.deleteBooking(aptId);
    } catch (err) {
      // If DELETE not supported yet, fall back to marking CANCELLED
      try {
        await DashboardApi.updateBookingStatus(aptId, 'CANCELLED');
      } catch {}
      console.warn('Backend API delete booking failed (fell back to cancel):', err);
    }
  };

  // Stylist Leave Handlers
  const handleOpenScheduleLeave = (stylistId?: string) => {
    setLeaveTargetStylistId(stylistId);
    setIsScheduleLeaveOpen(true);
  };

  const handleAddStylistLeave = (newLeave: StylistLeave) => {
    setStylistLeaves((prev) => [newLeave, ...prev]);
    const durationLabel =
      newLeave.duration === 'FULL_DAY'
        ? 'Full Day Off'
        : newLeave.duration === 'FIRST_HALF'
        ? 'Half Day (Morning: 10 AM – 4:30 PM)'
        : 'Half Day (Evening: 4:30 PM – 1 AM)';
    addToast(
      'info',
      'Stylist Leave Scheduled',
      `${newLeave.stylistName} scheduled off on ${newLeave.date} (${durationLabel}).`
    );
  };

  const handleDeleteStylistLeave = (leaveId: string) => {
    const target = stylistLeaves.find((l) => l.id === leaveId);
    setStylistLeaves((prev) => prev.filter((l) => l.id !== leaveId));
    addToast(
      'info',
      'Stylist Leave Revoked',
      `Leave for ${target?.stylistName || 'stylist'} revoked. Stylist restored to active roster.`
    );
  };

  // Stylist CRUD Handlers
  const handleOpenAddStylist = () => {
    setStylistToEdit(null);
    setIsStylistModalOpen(true);
  };

  const handleOpenEditStylist = (stylist: Stylist) => {
    setStylistToEdit(stylist);
    setIsStylistModalOpen(true);
  };

  const handleSaveStylist = async (updated: Stylist) => {
    const exists = stylists.find((s) => s.id === updated.id);
    let nextStylists: Stylist[];
    if (exists) {
      addToast('success', 'Stylist Updated', `${updated.name}'s profile has been saved.`);
      nextStylists = stylists.map((s) => (s.id === updated.id ? updated : s));
    } else {
      addToast('success', 'Stylist Added', `${updated.name} has been added to the team.`);
      nextStylists = [updated, ...stylists];
    }
    setStylists(nextStylists);
    try {
      safeSetItem('stylex_tirur_v6_stylists', JSON.stringify(nextStylists));
      safeSetItem('stylex_stylists', JSON.stringify(nextStylists));
      window.dispatchEvent(new Event('storage'));
    } catch {}

    try {
      if (exists) {
        await DashboardApi.updateStylist(updated.id, {
          name: updated.name,
          role: updated.role,
          gender: updated.gender || 'both',
          specialty: updated.specialty,
          imageUrl: updated.avatar,
        });
      } else {
        await DashboardApi.createStylist({
          id: updated.id || updated.name.toLowerCase().replace(/\s+/g, '-'),
          name: updated.name,
          role: updated.role,
          gender: updated.gender || 'both',
          specialty: updated.specialty || 'Master Hair Stylist',
          imageUrl: updated.avatar,
        });
      }
    } catch (err) {
      console.warn('Backend API stylist save error:', err);
    }
  };

  const handleDeleteStylist = async (id: string) => {
    const target = stylists.find((s) => s.id === id);
    const nextStylists = stylists.filter((s) => s.id !== id);
    setStylists(nextStylists);
    try {
      safeSetItem('stylex_tirur_v6_stylists', JSON.stringify(nextStylists));
      safeSetItem('stylex_stylists', JSON.stringify(nextStylists));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    addToast('info', 'Stylist Removed', `${target?.name || 'Stylist'} removed from the roster.`);

    try {
      await DashboardApi.deleteStylist(id);
    } catch (err) {
      console.warn('Backend API stylist delete error:', err);
    }
  };

  // Service Menu Handlers
  const handleToggleServiceVisibility = async (id: string) => {
    const target = services.find((s) => s.id === id);
    if (!target) return;
    const next = !target.showOnWebsite;
    const nextServices = services.map((s) => (s.id === id ? { ...s, showOnWebsite: next } : s));
    setServices(nextServices);
    try {
      safeSetItem('stylex_tirur_v6_services', JSON.stringify(nextServices));
      safeSetItem('stylex_services', JSON.stringify(nextServices));
    } catch {}
    addToast(
      'info',
      'Service Visibility Updated',
      `"${target.name}" is now ${next ? 'visible on' : 'hidden from'} client website.`
    );

    try {
      await DashboardApi.updateService(id, { isActive: next });
    } catch (err) {
      console.warn('Backend API service visibility error:', err);
    }
  };

  const handleSaveService = async (service: ServiceItem) => {
    const exists = services.some((s) => s.id === service.id);
    setServices((prev) => {
      if (exists) {
        return prev.map((s) => (s.id === service.id ? service : s));
      }
      return [...prev, service];
    });
    addToast(
      'success',
      serviceToEdit ? 'Service Details Updated' : 'New Service Published',
      `"${service.name}" is ready in the salon catalog.`
    );
    setServiceToEdit(null);

    try {
      if (exists) {
        await DashboardApi.updateService(service.id, {
          name: service.name,
          category: service.category,
          durationMins: service.durationMin,
          description: service.description,
          isActive: service.showOnWebsite,
        });
      } else {
        await DashboardApi.createService({
          id: service.id || service.name.toLowerCase().replace(/\s+/g, '-'),
          name: service.name,
          category: service.category,
          gender: 'unisex',
          durationMins: service.durationMin,
          price: 350,
          description: service.description,
          isActive: service.showOnWebsite,
        });
      }
    } catch (err) {
      console.warn('Backend API service save error:', err);
    }
  };

  const handleDeleteService = async (id: string) => {
    const target = services.find((s) => s.id === id);
    if (!window.confirm(`Are you sure you want to remove "${target?.name}" from the service menu?`)) {
      return;
    }
    setServices((prev) => prev.filter((s) => s.id !== id));
    addToast('info', 'Service Removed', `"${target?.name}" removed from catalog.`);

    try {
      await DashboardApi.deleteService(id);
    } catch (err) {
      console.warn('Backend API service delete error:', err);
    }
  };

  // Blackout Date Handlers
  const handleAddBlackout = async (item: BlackoutDate) => {
    setBlackoutDates((prev) => [item, ...prev]);
    const isSlots = item.blockType === 'TIME_SLOTS' && item.slots && item.slots.length > 0;
    addToast(
      'info',
      isSlots ? 'Time Slot(s) Blocked' : 'Date Blocked',
      isSlots
        ? `${item.slots!.length} 1-hour slot(s) blocked on ${item.month} ${item.day}`
        : `Full day closure registered on ${item.month} ${item.day}`
    );

    try {
      const dateStr = item.dateStr || new Date().toISOString().split('T')[0];
      const slotsToBlock = isSlots ? item.slots! : ['ALL_DAY'];
      await DashboardApi.createBlockedSlot({
        date: dateStr,
        timeSlots: slotsToBlock,
        reason: item.description || item.title || 'Administrative blackout',
        id: item.id,
      });
    } catch (err) {
      console.warn('Could not persist blocked slot to backend:', err);
    }
  };

  const handleDeleteBlackout = async (id: string) => {
    setBlackoutDates((prev) => prev.filter((b) => b.id !== id));
    addToast('info', 'Blackout Removed', 'Outlet schedule returned to standard hours.');

    try {
      await DashboardApi.deleteBlockedSlot(id);
    } catch (err) {
      console.warn('Could not delete blocked slot from backend:', err);
    }
  };

  // Promotions Handlers
  const handleToggleBanner = async (id: string) => {
    const target = banners.find((b) => b.id === id);
    const nextActive = !(target?.isActive ?? true);
    const nextBanners = banners.map((b) => (b.id === id ? { ...b, isActive: nextActive } : b));
    setBanners(nextBanners);
    try {
      safeSetItem('stylex_tirur_v6_banners', JSON.stringify(nextBanners));
      safeSetItem('stylex_banners', JSON.stringify(nextBanners));
    } catch {}
    addToast('info', 'Banner Updated', `Homepage carousel banner is now ${nextActive ? 'active' : 'hidden'}.`);

    try {
      await DashboardApi.updateBanner(id, { isActive: nextActive });
    } catch (err) {
      console.warn('Backend API banner toggle failed:', err);
    }
  };

  const handleSaveBanner = async (banner: CarouselBanner) => {
    const exists = banners.some((b) => b.id === banner.id);
    const updated = exists ? banners.map((b) => (b.id === banner.id ? banner : b)) : [banner, ...banners];
    setBanners(updated);
    try {
      safeSetItem('stylex_tirur_v6_banners', JSON.stringify(updated));
      safeSetItem('stylex_banners', JSON.stringify(updated));
    } catch {}
    addToast('success', 'Promotion Slide Saved', `"${banner.title}" saved.`);

    try {
      if (exists) {
        await DashboardApi.updateBanner(banner.id, {
          title: banner.title,
          badge: banner.tag,
          imageUrl: banner.imageUrl,
          isActive: banner.isActive,
        });
      } else {
        await DashboardApi.createBanner({
          id: banner.id,
          title: banner.title,
          badge: banner.tag,
          imageUrl: banner.imageUrl,
        });
      }
    } catch (err) {
      console.warn('Backend API banner save failed:', err);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    const updated = banners.filter((b) => b.id !== id);
    setBanners(updated);
    try {
      safeSetItem('stylex_tirur_v6_banners', JSON.stringify(updated));
      safeSetItem('stylex_banners', JSON.stringify(updated));
    } catch {}
    addToast('info', 'Slide Removed', 'Carousel promotion slide removed.');

    try {
      await DashboardApi.deleteBanner(id);
    } catch (err) {
      console.warn('Backend API banner delete failed:', err);
    }
  };

  // Reels Handlers
  const handleToggleReel = async (id: string) => {
    const target = reels.find((r) => r.id === id);
    const nextActive = !(target?.isActive ?? true);
    const nextReels = reels.map((r) => (r.id === id ? { ...r, isActive: nextActive } : r));
    setReels(nextReels);
    try {
      safeSetItem('stylex_tirur_v6_reels', JSON.stringify(nextReels));
      safeSetItem('stylex_reels', JSON.stringify(nextReels));
    } catch {}
    addToast('info', 'Reel Updated', `Reel is now ${nextActive ? 'visible' : 'hidden'} on client website.`);

    try {
      await DashboardApi.updateReel(id, { isActive: nextActive });
    } catch (err) {
      console.warn('Backend API reel toggle failed:', err);
    }
  };

  const handleSaveReel = async (reel: ReelItem) => {
    const exists = reels.some((r) => r.id === reel.id);
    const updated = exists ? reels.map((r) => (r.id === reel.id ? reel : r)) : [reel, ...reels];
    setReels(updated);
    try {
      safeSetItem('stylex_tirur_v6_reels', JSON.stringify(updated));
      safeSetItem('stylex_reels', JSON.stringify(updated));
    } catch {}
    addToast('success', 'Reel Published', `"${reel.title}" is now live in the Atelier Reels section.`);

    try {
      if (exists) {
        await DashboardApi.updateReel(reel.id, {
          title: reel.title,
          imageUrl: reel.imageUrl,
          videoUrl: reel.videoUrl,
          isActive: reel.isActive,
        });
      } else {
        await DashboardApi.createReel({
          id: reel.id,
          title: reel.title,
          tag: reel.tag,
          category: reel.category,
          imageUrl: reel.imageUrl,
          videoUrl: reel.videoUrl,
          instagramUrl: reel.instagramUrl,
          audioTrack: reel.audioTrack,
          stylistHandle: reel.stylistHandle,
          description: reel.description,
        });
      }
    } catch (err) {
      console.warn('Backend API reel save failed:', err);
    }
  };

  const handleDeleteReel = async (id: string) => {
    const updated = reels.filter((r) => r.id !== id);
    setReels(updated);
    try {
      safeSetItem('stylex_tirur_v6_reels', JSON.stringify(updated));
      safeSetItem('stylex_reels', JSON.stringify(updated));
    } catch {}
    addToast('info', 'Reel Removed', 'Reel removed from client website gallery.');

    try {
      await DashboardApi.deleteReel(id);
    } catch (err) {
      console.warn('Backend API reel delete failed:', err);
    }
  };

  // Portfolio Works Handlers
  const handleTogglePortfolioWork = async (id: string) => {
    const target = portfolioWorks.find((p) => p.id === id);
    const nextActive = !(target?.isActive ?? true);
    const nextPhotos = portfolioWorks.map((p) => (p.id === id ? { ...p, isActive: nextActive } : p));
    setPortfolioWorks(nextPhotos);
    try {
      safeSetItem('stylex_tirur_v6_photos', JSON.stringify(nextPhotos));
      safeSetItem('stylex_photos', JSON.stringify(nextPhotos));
      safeSetItem('stylex_tirur_v6_portfolio', JSON.stringify(nextPhotos));
      safeSetItem('stylex_portfolio', JSON.stringify(nextPhotos));
    } catch {}
    addToast('info', 'Photo Updated', `Transformation photo is now ${nextActive ? 'visible' : 'hidden'} on client website.`);

    try {
      await DashboardApi.updatePortfolioPhoto(id, { isActive: nextActive });
    } catch (err) {
      console.warn('Backend API portfolio toggle failed:', err);
    }
  };

  const handleSavePortfolioPhoto = async (photo: PortfolioWork) => {
    const exists = portfolioWorks.some((p) => p.id === photo.id);
    const updated = exists ? portfolioWorks.map((p) => (p.id === photo.id ? photo : p)) : [photo, ...portfolioWorks];
    setPortfolioWorks(updated);
    try {
      safeSetItem('stylex_tirur_v6_photos', JSON.stringify(updated));
      safeSetItem('stylex_photos', JSON.stringify(updated));
      safeSetItem('stylex_tirur_v6_portfolio', JSON.stringify(updated));
      safeSetItem('stylex_portfolio', JSON.stringify(updated));
    } catch {}
    addToast('success', 'Photo Published', `"${photo.title}" is now live in the Client Transformations gallery.`);

    try {
      if (exists) {
        await DashboardApi.updatePortfolioPhoto(photo.id, {
          title: photo.title,
          imageUrl: photo.imageUrl,
          isActive: photo.isActive,
        });
      } else {
        await DashboardApi.createPortfolioPhoto({
          id: photo.id,
          title: photo.title,
          category: photo.category,
          artisan: photo.artisan,
          imageUrl: photo.imageUrl,
          description: photo.description,
        });
      }
    } catch (err) {
      console.warn('Backend API portfolio save failed:', err);
    }
  };

  const handleDeletePortfolioWork = async (id: string) => {
    const updated = portfolioWorks.filter((p) => p.id !== id);
    setPortfolioWorks(updated);
    try {
      safeSetItem('stylex_tirur_v6_photos', JSON.stringify(updated));
      safeSetItem('stylex_photos', JSON.stringify(updated));
      safeSetItem('stylex_tirur_v6_portfolio', JSON.stringify(updated));
      safeSetItem('stylex_portfolio', JSON.stringify(updated));
    } catch {}
    addToast('info', 'Photo Removed', 'Transformation photo removed from client website gallery.');

    try {
      await DashboardApi.deletePortfolioPhoto(id);
    } catch (err) {
      console.warn('Backend API portfolio delete failed:', err);
    }
  };

  // Concierge Handlers
  const handleResolveInquiry = (id: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: 'Resolved' as const } : inq))
    );
    addToast('success', 'Inquiry Resolved', 'Marked as completed in concierge ledger.');
  };

  const handleReplyInquiry = (id: string, replyText: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: 'In Progress' as const } : inq))
    );
    addToast(
      'success',
      'Dispatch Transmitted',
      `Message forwarded to guest: "${replyText.slice(0, 40)}..."`
    );
  };

  // Settings Handlers
  const handleSaveSettings = async (newSettings: SalonSettings) => {
    setSettings(newSettings);
    safeSetItem('stylex_tirur_v6_settings', JSON.stringify(newSettings));
    if (typeof newSettings.maintenanceMode !== 'undefined') {
      safeSetItem('stylex_maintenance_mode', String(Boolean(newSettings.maintenanceMode)));
      window.dispatchEvent(new Event('storage'));
    }

    try {
      if (!DashboardApi.getToken()) await DashboardApi.silentLogin();
      await DashboardApi.updateSettings({
        salonName: newSettings.salonName,
        phone: newSettings.phone,
        email: newSettings.email,
        address: newSettings.address,
        reschedulePolicy24h: String(newSettings.reschedulePolicy24h),
        smsWhatsappReminders: String(newSettings.smsWhatsappReminders),
        emailCalendarInvites: String(newSettings.emailCalendarInvites),
        darkMode: String(Boolean(newSettings.darkMode)),
        whatsappBotConnected: String(Boolean(newSettings.whatsappBotConnected)),
        whatsappBotPhone: newSettings.whatsappBotPhone || '',
        maintenanceMode: String(Boolean(newSettings.maintenanceMode)),
      });
    } catch (e) {
      console.warn('API sync warning for settings:', e);
    }
    addToast('success', 'Salon Settings Saved', 'Salon profile and notification policies updated.');
  };

  const handleToggleMaintenanceMode = async (enabled: boolean) => {
    const updated = { ...settings, maintenanceMode: enabled };
    setSettings(updated);
    safeSetItem('stylex_tirur_v6_settings', JSON.stringify(updated));
    safeSetItem('stylex_maintenance_mode', String(enabled));
    window.dispatchEvent(new Event('storage'));

    try {
      if (!DashboardApi.getToken()) await DashboardApi.silentLogin();
      await DashboardApi.updateSettings({
        salonName: updated.salonName,
        phone: updated.phone,
        email: updated.email,
        address: updated.address,
        maintenanceMode: String(enabled),
      });
      addToast(
        enabled ? 'error' : 'success',
        enabled ? 'Maintenance Mode Enabled' : 'Maintenance Mode Disabled',
        enabled
          ? 'Client website is now displaying the static maintenance page.'
          : 'Client website is live and operational.'
      );
    } catch (e) {
      console.warn('API sync warning for maintenance mode:', e);
      addToast(
        enabled ? 'info' : 'success',
        enabled ? 'Maintenance Mode Active (Local)' : 'Maintenance Mode Inactive',
        enabled ? 'Client site is displaying maintenance page.' : 'Client site is live.'
      );
    }
  };

  const handleToggleDarkMode = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, darkMode: enabled }));
    addToast(
      'info',
      enabled ? 'Dark Theme Activated' : 'Light Theme Activated',
      enabled ? 'Switched to midnight atelier dark mode.' : 'Switched to signature botanical light mode.'
    );
  };

  // User Management Handlers
  const handleAddUser = () => {
    if (currentUser.role !== 'Admin' && currentUser.role !== 'Developer') {
      addToast('error', 'Access Denied', 'Only Admin and Developer accounts can create users.');
      return;
    }
    setUserToEdit(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: UserAccount) => {
    if (currentUser.role !== 'Admin' && currentUser.role !== 'Developer') {
      addToast('error', 'Access Denied', 'Only Admin and Developer accounts can edit other users.');
      return;
    }
    setUserToEdit(user);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (userPayload: UserAccount): { success: boolean; message?: string } => {
    if (currentUser.role !== 'Admin' && currentUser.role !== 'Developer') {
      addToast('error', 'Access Denied', 'Only Admin and Developer accounts have access to modify users.');
      return { success: false, message: 'Permission denied: Only Admin and Developer accounts can modify users.' };
    }
    const exists = users.find((u) => u.id === userPayload.id);
    if (exists) {
      // RBAC RULE: A user can only change their own password!
      // If another user (e.g. Admin editing Developer) is updating details,
      // preserve the target user's existing password so it cannot be altered by anyone else.
      const isSelf = currentUser.id === userPayload.id;
      const safePayload: UserAccount = {
        ...userPayload,
        password: isSelf ? (userPayload.password || exists.password) : exists.password,
      };

      setUsers((prev) => prev.map((u) => (u.id === userPayload.id ? safePayload : u)));
      addToast('success', 'User Updated', `Account for ${userPayload.name} updated successfully.`);
    } else {
      setUsers((prev) => [...prev, userPayload]);
      addToast('success', 'User Created', `Staff account for ${userPayload.name} (${userPayload.role}) created.`);
    }
    return { success: true };
  };

  const handleDeleteUser = (userId: string) => {
    if (currentUser.role !== 'Admin' && currentUser.role !== 'Developer') {
      addToast('error', 'Access Denied', 'Only Admin and Developer accounts can delete other users.');
      return;
    }
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    if (target.email === 'admin@stylexsalon.in' || target.username === 'admin') {
      addToast('error', 'Action Denied', 'The default administrator account cannot be deleted.');
      return;
    }
    if (target.id === currentUser.id) {
      addToast('error', 'Action Denied', 'You cannot delete your own active account.');
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the user account for "${target.name}" (${target.username ? '@' + target.username : target.email})?\n\nThis action cannot be undone.`
    );
    if (!confirmed) {
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    addToast('info', 'User Removed', `Account for ${target.name} has been deleted.`);
  };

  // Change Password Handler for active user
  const handleUpdatePassword = (oldPass: string, newPass: string) => {
    if (oldPass !== currentUser.password) {
      return { success: false, message: 'Current password does not match.' };
    }
    const updatedUser = { ...currentUser, password: newPass };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    addToast(
      'success',
      'Password Updated',
      `Credentials updated successfully for ${currentUser.name}.`
    );
    return { success: true, message: 'Password updated successfully.' };
  };

  // Login & Logout
  const handleLogout = () => {
    DashboardApi.clearToken();
    localStorage.removeItem('stylex_session_active');
    setIsAuthenticated(false);
    addToast('info', 'Signed Out', `Signed out of ${currentUser.name} account.`);
  };

  const handleSignInSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    safeSetItem('stylex_current_user_email_v2', user.email);
    safeSetItem('stylex_session_active', 'true');
    setIsAuthenticated(true);
    addToast(
      'success',
      `Welcome, ${user.name}`,
      `Authenticated as ${user.roleTitle} (${user.username ? '@' + user.username : user.email}).`
    );
  };

  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'Unread').length;

  // Dynamic count of today's appointments for sidebar badge
  const todayAppointmentsCount = useMemo(() => {
    const todayYMD = getRelativeDateStr(0);
    return appointments.filter((apt) => {
      if (!apt.dateStr) return false;
      const normalized = apt.dateStr.toLowerCase() === 'today' ? todayYMD : apt.dateStr;
      return normalized === todayYMD;
    }).length;
  }, [appointments]);

  // If user signed out, display Admin Sign In screen
  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
        <AdminSignIn
          onSignInSuccess={handleSignInSuccess}
          users={users}
        />
      </>
    );
  }

  return (
    <div className="bg-[#f6faf7] font-body-md text-[#181d1b] antialiased min-h-screen">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setGlobalSearchQuery('');
        }}
        todayAppointmentsCount={todayAppointmentsCount}
        unreadConciergeCount={unreadInquiriesCount}
        onLogout={handleLogout}
      />

      {/* Main Content Pane */}
      <div className="pl-72">
        <Header
          onOpenNewBooking={() => setIsNewBookingOpen(true)}
          searchQuery={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
          currentUser={currentUser}
          onNavigateToSettings={() => setCurrentTab('atelier-settings')}
          onOpenChangePassword={() => setIsChangePasswordOpen(true)}
          onLogout={handleLogout}
          unreadCount={unreadInquiriesCount}
          darkMode={settings.darkMode}
          onToggleDarkMode={() => handleToggleDarkMode(!settings.darkMode)}
          onRefresh={handleRefreshData}
          isRefreshing={isRefreshing}
        />

        <main className="relative pt-20 bg-[#f6faf7] min-h-screen px-6 sm:px-8 py-8">
          {currentTab === 'overview' && (
            <OverviewView
              appointments={appointments}
              weekSchedule={weekSchedule}
              isEngineActive={isEngineActive}
              onToggleEngine={handleToggleEngine}
              onOpenNewBooking={() => setIsNewBookingOpen(true)}
              onOpenExpressWalkIn={() => setIsExpressWalkInOpen(true)}
              onOpenRunSheet={() => setIsRunSheetOpen(true)}
              onOpenAddBlackout={() => setIsAddBlackoutOpen(true)}
              onCompleteSession={handleCompleteSession}
              onCheckIn={handleCheckIn}
              onPrepare={handlePrepare}
              onSendLink={handleSendLink}
              onToggleDaySchedule={handleToggleDaySchedule}
              onManageBooking={(apt) => setManagedAppointment(apt)}
              globalSearchQuery={globalSearchQuery}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              onOpenNewBooking={(targetDate?: string) => {
                setBookingInitialDate(targetDate || new Date().toISOString().split('T')[0]);
                setIsNewBookingOpen(true);
              }}
              onCompleteSession={handleCompleteSession}
              onCheckIn={handleCheckIn}
              onManageBooking={(apt) => setManagedAppointment(apt)}
              globalSearchQuery={globalSearchQuery}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'schedule-control' && (
            <ScheduleView
              weekSchedule={weekSchedule}
              blackoutDates={blackoutDates}
              isEngineActive={isEngineActive}
              stylistLeaves={stylistLeaves}
              onToggleEngine={handleToggleEngine}
              onToggleDay={handleToggleDaySchedule}
              onOpenAddBlackout={() => setIsAddBlackoutOpen(true)}
              onDeleteBlackout={handleDeleteBlackout}
              onOpenScheduleLeave={() => handleOpenScheduleLeave()}
              onDeleteLeave={handleDeleteStylistLeave}
            />
          )}

          {currentTab === 'artisans-and-stylists' && (
            <ArtisansView
              stylists={stylists}
              stylistLeaves={stylistLeaves}
              onOpenNewBookingWithStylist={(stylistId) => {
                setIsNewBookingOpen(true);
              }}
              onOpenScheduleLeave={handleOpenScheduleLeave}
              onDeleteLeave={handleDeleteStylistLeave}
              onAddStylist={handleOpenAddStylist}
              onEditStylist={handleOpenEditStylist}
              onDeleteStylist={handleDeleteStylist}
              globalSearchQuery={globalSearchQuery}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'service-menu' && (
            <ServiceMenuView
              services={services}
              onToggleVisibility={handleToggleServiceVisibility}
              onOpenAddService={() => {
                setServiceToEdit(null);
                setIsAddServiceOpen(true);
              }}
              onEditService={(svc) => {
                setServiceToEdit(svc);
                setIsAddServiceOpen(true);
              }}
              onDeleteService={handleDeleteService}
              globalSearchQuery={globalSearchQuery}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'promotions' && (
            <PromotionsView
              banners={banners}
              onToggleBanner={handleToggleBanner}
              onEditBanner={(banner) => {
                setBannerToEdit(banner);
                setIsAddPromotionOpen(true);
              }}
              onDeleteBanner={handleDeleteBanner}
              onOpenAddPromotion={() => {
                setBannerToEdit(null);
                setIsAddPromotionOpen(true);
              }}
              reels={reels}
              onToggleReel={handleToggleReel}
              onEditReel={(reel) => {
                setReelToEdit(reel);
                setIsAddReelOpen(true);
              }}
              onDeleteReel={handleDeleteReel}
              onOpenAddReel={() => {
                setReelToEdit(null);
                setIsAddReelOpen(true);
              }}
              portfolioWorks={portfolioWorks}
              onTogglePortfolioWork={handleTogglePortfolioWork}
              onEditPortfolioWork={(photo) => {
                setPortfolioPhotoToEdit(photo);
                setIsAddPortfolioPhotoOpen(true);
              }}
              onDeletePortfolioWork={handleDeletePortfolioWork}
              onOpenAddPortfolioPhoto={() => {
                setPortfolioPhotoToEdit(null);
                setIsAddPortfolioPhotoOpen(true);
              }}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'clients-and-vip' && (
            <ClientsView
              clients={vipClients}
              onBookClient={(name, phone) => {
                setIsNewBookingOpen(true);
              }}
              globalSearchQuery={globalSearchQuery}
            />
          )}

          {currentTab === 'concierge-desk' && (
            <ConciergeView
              inquiries={inquiries}
              onResolveInquiry={handleResolveInquiry}
              onReplyInquiry={handleReplyInquiry}
              globalSearchQuery={globalSearchQuery}
            />
          )}

          {currentTab === 'atelier-settings' && (
            <SettingsView
              settings={settings}
              onSave={handleSaveSettings}
              onToggleDarkMode={handleToggleDarkMode}
              onToggleMaintenanceMode={handleToggleMaintenanceMode}
              users={users}
              currentUser={currentUser}
              onAddUser={handleAddUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        services={services}
        stylists={stylists}
        stylistLeaves={stylistLeaves}
        blackoutDates={blackoutDates}
        onAddBooking={handleAddBooking}
        initialDate={bookingInitialDate}
      />

      <ExpressWalkInModal
        isOpen={isExpressWalkInOpen}
        onClose={() => setIsExpressWalkInOpen(false)}
        services={services}
        stylists={stylists}
        onAddWalkIn={handleAddWalkIn}
      />

      <AddServiceModal
        isOpen={isAddServiceOpen}
        onClose={() => {
          setIsAddServiceOpen(false);
          setServiceToEdit(null);
        }}
        onSaveService={handleSaveService}
        serviceToEdit={serviceToEdit}
      />

      <AddBlackoutModal
        isOpen={isAddBlackoutOpen}
        onClose={() => setIsAddBlackoutOpen(false)}
        onAddBlackout={handleAddBlackout}
      />

      <AddPromotionModal
        isOpen={isAddPromotionOpen}
        onClose={() => {
          setIsAddPromotionOpen(false);
          setBannerToEdit(null);
        }}
        onSaveBanner={handleSaveBanner}
        bannerToEdit={bannerToEdit}
      />

      <AddReelModal
        isOpen={isAddReelOpen}
        onClose={() => {
          setIsAddReelOpen(false);
          setReelToEdit(null);
        }}
        onSaveReel={handleSaveReel}
        reelToEdit={reelToEdit}
      />

      <AddPortfolioPhotoModal
        isOpen={isAddPortfolioPhotoOpen}
        onClose={() => {
          setIsAddPortfolioPhotoOpen(false);
          setPortfolioPhotoToEdit(null);
        }}
        onSavePhoto={handleSavePortfolioPhoto}
        photoToEdit={portfolioPhotoToEdit}
      />

      <RunSheetModal
        isOpen={isRunSheetOpen}
        onClose={() => setIsRunSheetOpen(false)}
        appointments={appointments}
        dateStr="Thursday, Oct 24, 2024"
      />

      <ManageBookingModal
        isOpen={!!managedAppointment}
        appointment={managedAppointment}
        stylists={stylists}
        stylistLeaves={stylistLeaves}
        onClose={() => setManagedAppointment(null)}
        onUpdateBooking={handleUpdateBooking}
        onCancelBooking={handleCancelBooking}
        onDeleteBooking={handleDeleteBooking}
      />

      <ScheduleStylistLeaveModal
        isOpen={isScheduleLeaveOpen}
        onClose={() => {
          setIsScheduleLeaveOpen(false);
          setLeaveTargetStylistId(undefined);
        }}
        stylists={stylists}
        initialStylistId={leaveTargetStylistId}
        appointments={appointments}
        onAddLeave={handleAddStylistLeave}
      />

      <StylistModal
        isOpen={isStylistModalOpen}
        stylist={stylistToEdit}
        onClose={() => { setIsStylistModalOpen(false); setStylistToEdit(null); }}
        onSave={handleSaveStylist}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        currentUser={currentUser}
        onUpdatePassword={handleUpdatePassword}
      />

      <UserModal
        isOpen={isUserModalOpen}
        user={userToEdit}
        currentUser={currentUser}
        onClose={() => {
          setIsUserModalOpen(false);
          setUserToEdit(null);
        }}
        onSave={handleSaveUser}
        existingEmails={users.map((u) => u.email)}
      />
    </div>
  );
}
