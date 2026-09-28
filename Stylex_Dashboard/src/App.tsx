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

export default function App() {
  // Navigation & Authentication
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('stylex_session_active') === 'true';
  });

  // User Accounts & Authentication (Dynamic Staff Directory)
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('stylex_user_accounts_v2');
    if (!saved) return INITIAL_USERS;
    try {
      const parsed: UserAccount[] = JSON.parse(saved);
      // Ensure bladeoski and developer are always guaranteed present
      const hasBladeoski = parsed.some((u) => u.username === 'bladeoski' || u.id === 'user-bladeoski');
      const hasDev = parsed.some((u) => u.username === 'developer' || u.id === 'user-dev');
      const hasAdmin = parsed.some((u) => u.username === 'admin' || u.id === 'user-1');
      let merged = [...parsed];
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
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('stylex_user_accounts_v2');
    let loadedUsers: UserAccount[] = INITIAL_USERS;
    if (saved) {
      try {
        loadedUsers = JSON.parse(saved);
      } catch {
        loadedUsers = INITIAL_USERS;
      }
    }
    const savedIdentifier = localStorage.getItem('stylex_current_user_email_v2') || localStorage.getItem('stylex_current_user_email_v1');
    const matched = loadedUsers.find(
      (u) =>
        u.email.toLowerCase() === (savedIdentifier || '').toLowerCase() ||
        (u.username && u.username.toLowerCase() === (savedIdentifier || '').toLowerCase())
    );
    return matched || loadedUsers[0] || INITIAL_USERS[0];
  });

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<UserAccount | null>(null);

  // Sync users to localStorage
  useEffect(() => {
    localStorage.setItem('stylex_user_accounts_v2', JSON.stringify(users));
  }, [users]);

  // Keep currentUser in sync if updated in users list
  useEffect(() => {
    const updated = users.find((u) => u.id === currentUser.id);
    if (updated) {
      setCurrentUser(updated);
    }
  }, [users]);

  // Core Data (with Tirur Flagship data keys)
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('stylex_tirur_v7_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('stylex_tirur_v6_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>(() => {
    const saved = localStorage.getItem('stylex_tirur_v7_schedule');
    return saved ? JSON.parse(saved) : INITIAL_WEEK_SCHEDULE;
  });

  const [blackoutDates, setBlackoutDates] = useState<BlackoutDate[]>(() => {
    const saved = localStorage.getItem('stylex_tirur_v6_blackouts');
    return saved ? JSON.parse(saved) : INITIAL_BLACKOUT_DATES;
  });

  const [banners, setBanners] = useState<CarouselBanner[]>(() => {
    const saved = localStorage.getItem('stylex_tirur_v6_banners');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [reels, setReels] = useState<ReelItem[]>(() => {
    const saved = localStorage.getItem('stylex_tirur_v6_reels');
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });

  const [portfolioWorks, setPortfolioWorks] = useState<PortfolioWork[]>(() => {
    const saved = localStorage.getItem('stylex_tirur_v6_portfolio');
    return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO_WORKS;
  });

  const [stylists, setStylists] = useState<Stylist[]>(() => {
    const saved = localStorage.getItem('stylex_tirur_v6_stylists');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((s: Stylist) => {
          const { specialty: _spec, ...rest } = s;
          return rest;
        });
      } catch (e) {}
    }
    return INITIAL_STYLISTS;
  });
  const [vipClients, setVipClients] = useState<VIPClient[]>(INITIAL_VIP_CLIENTS);

  const [stylistLeaves, setStylistLeaves] = useState<StylistLeave[]>(() => {
    const saved = localStorage.getItem('stylex_tirur_v6_stylist_leaves');
    return saved ? JSON.parse(saved) : INITIAL_STYLIST_LEAVES;
  });

  const [inquiries, setInquiries] = useState<ConciergeInquiry[]>(() => {
    const saved = localStorage.getItem('stylex_tirur_v6_inquiries');
    return saved ? JSON.parse(saved) : INITIAL_CONCIERGE_INQUIRIES;
  });

  const [settings, setSettings] = useState<SalonSettings>(() => {
    const saved = localStorage.getItem('stylex_tirur_v6_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
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
    localStorage.setItem('stylex_tirur_v7_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('stylex_tirur_v6_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('stylex_tirur_v7_schedule', JSON.stringify(weekSchedule));
  }, [weekSchedule]);

  useEffect(() => {
    localStorage.setItem('stylex_tirur_v6_blackouts', JSON.stringify(blackoutDates));
  }, [blackoutDates]);

  useEffect(() => {
    localStorage.setItem('stylex_tirur_v6_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('stylex_tirur_v6_reels', JSON.stringify(reels));
    // Dispatch storage event so client site can hot-reload
    window.dispatchEvent(new Event('storage'));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem('stylex_tirur_v6_portfolio', JSON.stringify(portfolioWorks));
    window.dispatchEvent(new Event('storage'));
  }, [portfolioWorks]);

  useEffect(() => {
    localStorage.setItem('stylex_tirur_v6_stylist_leaves', JSON.stringify(stylistLeaves));
    localStorage.setItem('stylex_stylist_leaves', JSON.stringify(stylistLeaves));
  }, [stylistLeaves]);

  useEffect(() => {
    localStorage.setItem('stylex_tirur_v6_stylists', JSON.stringify(stylists));
  }, [stylists]);

  useEffect(() => {
    localStorage.setItem('stylex_tirur_v6_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('stylex_tirur_v6_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Live Data Synchronization with PostgreSQL Backend
  useEffect(() => {
    let isMounted = true;

    async function loadRealData() {
      try {
        if (!DashboardApi.getToken()) {
          await DashboardApi.silentLogin();
        }

        // 1. Fetch live bookings from PostgreSQL
        try {
          const liveBookings = await DashboardApi.getBookings();
          if (isMounted && Array.isArray(liveBookings) && liveBookings.length > 0) {
            const mappedAppointments = liveBookings.map(mapBackendBookingToAppointment);
            setAppointments(mappedAppointments);
          }
        } catch (e) {
          console.warn('Live bookings fetch:', e);
        }

        // 2. Fetch live services
        try {
          const liveServices = await DashboardApi.getServices();
          if (isMounted && Array.isArray(liveServices) && liveServices.length > 0) {
            setServices(liveServices);
          }
        } catch (e) {
          console.warn('Live services fetch:', e);
        }

        // 3. Fetch live stylists
        try {
          const liveStylists = await DashboardApi.getStylists();
          if (isMounted && Array.isArray(liveStylists) && liveStylists.length > 0) {
            setStylists(liveStylists);
          }
        } catch (e) {
          console.warn('Live stylists fetch:', e);
        }

        // 4. Fetch live customers (CRM)
        try {
          const liveCustomers = await DashboardApi.getCustomers();
          if (isMounted && Array.isArray(liveCustomers) && liveCustomers.length > 0) {
            setVipClients(liveCustomers);
          }
        } catch (e) {
          console.warn('Live customers fetch:', e);
        }

        // 5. Fetch promotional banners, reels, and photos
        try {
          const liveBanners = await DashboardApi.getBanners();
          if (isMounted && Array.isArray(liveBanners) && liveBanners.length > 0) {
            setBanners(liveBanners);
          }
        } catch {}

        try {
          const liveReels = await DashboardApi.getReels();
          if (isMounted && Array.isArray(liveReels) && liveReels.length > 0) {
            setReels(liveReels);
          }
        } catch {}

        try {
          const livePhotos = await DashboardApi.getPortfolioPhotos();
          if (isMounted && Array.isArray(livePhotos) && livePhotos.length > 0) {
            setPortfolioWorks(livePhotos);
          }
        } catch {}

      } catch (err) {
        console.warn('Live data sync encountered an error:', err);
      }
    }

    if (isAuthenticated) {
      loadRealData();
      const interval = setInterval(loadRealData, 20000); // 20s polling for real-time bookings
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
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
      await DashboardApi.updateBookingStatus(aptId, 'CANCELLED');
    } catch (err) {
      console.warn('Backend API delete status failed:', err);
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
    setStylists((prev) => {
      if (exists) {
        addToast('success', 'Stylist Updated', `${updated.name}'s profile has been saved.`);
        return prev.map((s) => (s.id === updated.id ? updated : s));
      }
      addToast('success', 'Stylist Added', `${updated.name} has been added to the team.`);
      return [updated, ...prev];
    });

    try {
      if (exists) {
        await DashboardApi.updateStylist(updated.id, {
          name: updated.name,
          role: updated.role,
          specialty: updated.specialty,
          imageUrl: updated.avatar,
        });
      } else {
        await DashboardApi.createStylist({
          id: updated.id || updated.name.toLowerCase().replace(/\s+/g, '-'),
          name: updated.name,
          role: updated.role,
          gender: 'any',
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
    setStylists((prev) => prev.filter((s) => s.id !== id));
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
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, showOnWebsite: next } : s))
    );
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
  const handleAddBlackout = (item: BlackoutDate) => {
    setBlackoutDates((prev) => [item, ...prev]);
    const isSlots = item.blockType === 'TIME_SLOTS' && item.slots && item.slots.length > 0;
    addToast(
      'info',
      isSlots ? 'Time Slot(s) Blocked' : 'Date Blocked',
      isSlots
        ? `${item.slots!.length} 1-hour slot(s) blocked on ${item.month} ${item.day}`
        : `Full day closure registered on ${item.month} ${item.day}`
    );
  };

  const handleDeleteBlackout = (id: string) => {
    setBlackoutDates((prev) => prev.filter((b) => b.id !== id));
    addToast('info', 'Blackout Removed', 'Outlet schedule returned to standard hours.');
  };

  // Promotions Handlers
  const handleToggleBanner = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
    addToast('info', 'Banner Updated', 'Homepage carousel banner display updated.');
  };

  const handleSaveBanner = (banner: CarouselBanner) => {
    setBanners((prev) => {
      const exists = prev.some((b) => b.id === banner.id);
      if (exists) {
        return prev.map((b) => (b.id === banner.id ? banner : b));
      }
      return [banner, ...prev];
    });
    addToast('success', 'Promotion Slide Saved', `"${banner.title}" saved.`);
  };

  const handleDeleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    addToast('info', 'Slide Removed', 'Carousel promotion slide removed.');
  };

  // Reels Handlers
  const handleToggleReel = (id: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: r.isActive === false ? true : false } : r))
    );
    addToast('info', 'Reel Updated', 'Reel display status updated on client website.');
  };

  const handleSaveReel = (reel: ReelItem) => {
    setReels((prev) => {
      const exists = prev.some((r) => r.id === reel.id);
      if (exists) {
        return prev.map((r) => (r.id === reel.id ? reel : r));
      }
      return [reel, ...prev];
    });
    addToast('success', 'Reel Published', `"${reel.title}" is now live in the Atelier Reels section.`);
  };

  const handleDeleteReel = (id: string) => {
    setReels((prev) => prev.filter((r) => r.id !== id));
    addToast('info', 'Reel Removed', 'Reel removed from client website gallery.');
  };

  // Portfolio Works Handlers
  const handleTogglePortfolioWork = (id: string) => {
    setPortfolioWorks((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: p.isActive === false ? true : false } : p))
    );
    addToast('info', 'Photo Updated', 'Transformation photo visibility updated on client website.');
  };

  const handleSavePortfolioPhoto = (photo: PortfolioWork) => {
    setPortfolioWorks((prev) => {
      const exists = prev.some((p) => p.id === photo.id);
      if (exists) {
        return prev.map((p) => (p.id === photo.id ? photo : p));
      }
      return [photo, ...prev];
    });
    addToast('success', 'Photo Published', `"${photo.title}" is now live in the Client Transformations gallery.`);
  };

  const handleDeletePortfolioWork = (id: string) => {
    setPortfolioWorks((prev) => prev.filter((p) => p.id !== id));
    addToast('info', 'Photo Removed', 'Transformation photo removed from client website gallery.');
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
  const handleSaveSettings = (newSettings: SalonSettings) => {
    setSettings(newSettings);
    addToast('success', 'Salon Settings Saved', 'Salon profile and notification policies updated.');
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
    const exists = users.some((u) => u.id === userPayload.id);
    if (exists) {
      setUsers((prev) => prev.map((u) => (u.id === userPayload.id ? userPayload : u)));
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
    localStorage.setItem('stylex_current_user_email_v2', user.email);
    localStorage.setItem('stylex_session_active', 'true');
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
