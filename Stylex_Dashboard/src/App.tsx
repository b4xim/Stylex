import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  AdminNotification,
  StoreNotice,
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
  INITIAL_NOTIFICATIONS,
  getRelativeDateStr,
} from './mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
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
import { WhatsAppDisconnectedModal } from './components/modals/WhatsAppDisconnectedModal';

import { safeSetItem, safeGetItem, cleanObsoleteStorage } from './utils/storage';

// Run cleanup immediately to purge legacy keys and free up localStorage quota
cleanObsoleteStorage();

function safeParse<T>(key: string, fallback: T): T {
  return safeGetItem<T>(key, fallback);
}

// User account deduplication helper: ensures only 1 developer account exists
export const deduplicateUsers = (userList: UserAccount[]): UserAccount[] => {
  if (!Array.isArray(userList)) return [];
  const seenKeys = new Set<string>();
  const result: UserAccount[] = [];

  for (const u of userList) {
    if (!u) continue;
    const cleanUsername = (u.username || '').trim().toLowerCase();
    const cleanEmail = (u.email || '').trim().toLowerCase();
    const isDev = u.role === 'Developer' || cleanUsername === 'developer' || cleanEmail === 'dev@stylexsalon.in';

    // Unique key: developer accounts always resolve to a single singleton slot
    const key = isDev ? 'role_developer_singleton' : (cleanEmail || cleanUsername || u.id);
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      result.push(u);
    }
  }

  return result;
};

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
    const hasBladeoski = safeList.some((u) => u?.username?.toLowerCase() === 'bladeoski' || u?.email?.toLowerCase() === 'bladeoski@stylex.com');
    const hasDev = safeList.some((u) => u?.role === 'Developer' || u?.username?.toLowerCase() === 'developer' || u?.email?.toLowerCase() === 'dev@stylexsalon.in');
    const hasAdmin = safeList.some((u) => (u?.role === 'Admin' && u?.username?.toLowerCase() === 'admin') || u?.email?.toLowerCase() === 'admin@stylexsalon.in');
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
    const clean = deduplicateUsers(merged);
    try {
      safeSetItem('stylex_user_accounts_v2', JSON.stringify(clean));
    } catch {}
    return clean;
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    const parsed = safeParse<AdminNotification[]>('stylex_admin_notifications_v2', []);
    const valid = Array.isArray(parsed) ? parsed : [];
    // Purge any legacy mock notifications (notif-1, notif-2)
    const clean = valid.filter((n) => n.id !== 'notif-1' && n.id !== 'notif-2');
    try {
      safeSetItem('stylex_admin_notifications_v2', JSON.stringify(clean));
    } catch {}
    return clean;
  });

  const isInitialDataLoadedRef = useRef<boolean>(false);
  const knownBookingIdsRef = useRef<Set<string>>(new Set());
  const knownInquiryIdsRef = useRef<Set<string>>(new Set());

  // Synthesizer chime fallback
  const playNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  };

  // Dedicated MP3 notification sound for bookings
  const playBookingNotificationSound = () => {
    try {
      const audio = new Audio('/Sound/Chord-Apple-SnapYT.App.mp3');
      audio.volume = 0.9;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play restricted by browser policy; using fallback chime:', err);
          playNotificationChime();
        });
      }
    } catch {
      playNotificationChime();
    }
  };

  // Pre-unlock audio on user interaction so background alerts will play without blocking
  useEffect(() => {
    const unlockAudio = () => {
      try {
        const audio = new Audio('/Sound/Chord-Apple-SnapYT.App.mp3');
        audio.volume = 0;
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
        }).catch(() => {});
      } catch {}
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleSelectNotification = (notif: AdminNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    if (notif.linkTab) {
      setCurrentTab(notif.linkTab);
      setIsMobileMenuOpen(false);
    }
  };

  const [settings, setSettings] = useState<SalonSettings>(() => {
    const parsed = safeParse<SalonSettings>('stylex_tirur_v6_settings', INITIAL_SETTINGS);
    const maintenanceSaved = localStorage.getItem('stylex_maintenance_mode');
    if (maintenanceSaved !== null) {
      return { ...parsed, maintenanceMode: maintenanceSaved === 'true' };
    }
    return parsed;
  });

  const [isEngineActive, setIsEngineActive] = useState<boolean>(() => {
    const saved = localStorage.getItem('stylex_booking_engine_active');
    return saved !== null ? saved === 'true' : true;
  });
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Store Notice Announcement State
  const [storeNotice, setStoreNotice] = useState<StoreNotice>(() => {
    const saved = localStorage.getItem('stylex_store_notice');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...parsed,
            isActive: parsed.isActive === true || parsed.isActive === 'true',
          };
        }
      } catch {}
    }
    return {
      isActive: false,
      title: 'Outlet Notice',
      message: '',
      badge: 'Special Notice',
      buttonText: 'Got It',
    };
  });

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

  // WhatsApp Bot Disconnection Alert Modal
  const [isWhatsAppDisconnectedModalOpen, setIsWhatsAppDisconnectedModalOpen] = useState(false);
  const hasCheckedWhatsAppOnOpenRef = useRef(false);

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
    safeSetItem('stylex_tirur_v6_clients', JSON.stringify(vipClients));
  }, [vipClients]);

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

  useEffect(() => {
    safeSetItem('stylex_admin_notifications_v2', JSON.stringify(notifications));
  }, [notifications]);

  // Real-time cross-tab storage sync (e.g. concierge inquiries from website)
  useEffect(() => {
    const handleStorageSync = () => {
      try {
        const savedInquiries = localStorage.getItem('stylex_tirur_v6_inquiries');
        if (savedInquiries) {
          const parsed = JSON.parse(savedInquiries);
          if (Array.isArray(parsed)) {
            setInquiries(parsed);
          }
        }
        const savedClients = localStorage.getItem('stylex_tirur_v6_clients');
        if (savedClients) {
          const parsed = JSON.parse(savedClients);
          if (Array.isArray(parsed)) {
            setVipClients(parsed);
          }
        }
        const savedNotifs = localStorage.getItem('stylex_admin_notifications_v2');
        if (savedNotifs) {
          const parsed = JSON.parse(savedNotifs);
          if (Array.isArray(parsed)) {
            setNotifications(parsed);
          }
        }
      } catch {}
    };

    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

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

          if (!isInitialDataLoadedRef.current) {
            mappedAppointments.forEach((apt) => {
              if (apt.id) knownBookingIdsRef.current.add(String(apt.id));
            });
          } else {
            const brandNewBookings = mappedAppointments.filter(
              (apt) => apt.id && !knownBookingIdsRef.current.has(String(apt.id))
            );
            if (brandNewBookings.length > 0) {
              const newNotifs: AdminNotification[] = brandNewBookings.map((apt) => {
                knownBookingIdsRef.current.add(String(apt.id));
                return {
                  id: `booking-${apt.id}-${Date.now()}`,
                  type: 'booking',
                  title: `New Booking: ${apt.clientName || 'Guest'}`,
                  description: `${apt.serviceName || 'Ritual'} booked for ${apt.time || ''} on ${apt.dateStr || 'Upcoming'}`.trim(),
                  timestamp: 'Just now',
                  read: false,
                  linkTab: 'appointments',
                  createdAt: Date.now(),
                };
              });
              setNotifications((prev) => [...newNotifs, ...prev]);
              brandNewBookings.forEach((apt) => {
                addToast(
                  'info',
                  'New Booking Received',
                  `${apt.clientName || 'Guest'} reserved ${apt.serviceName || 'an appointment'}.`
                );
              });
              playBookingNotificationSound();
            }
          }
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

      // 7. Fetch live concierge inquiries
      try {
        const liveInquiries = await DashboardApi.getInquiries();
        if (Array.isArray(liveInquiries)) {
          setInquiries(liveInquiries);
          safeSetItem('stylex_tirur_v6_inquiries', JSON.stringify(liveInquiries));

          if (!isInitialDataLoadedRef.current) {
            liveInquiries.forEach((inq) => {
              if (inq.id) knownInquiryIdsRef.current.add(String(inq.id));
            });
          } else {
            const brandNewInquiries = liveInquiries.filter(
              (inq) => inq.id && !knownInquiryIdsRef.current.has(String(inq.id))
            );
            if (brandNewInquiries.length > 0) {
              const newNotifs: AdminNotification[] = brandNewInquiries.map((inq) => {
                knownInquiryIdsRef.current.add(String(inq.id));
                return {
                  id: `inquiry-${inq.id}-${Date.now()}`,
                  type: 'concierge',
                  title: `Concierge Inquiry: ${inq.clientName || 'Client'}`,
                  description: inq.message
                    ? inq.message.length > 70
                      ? inq.message.substring(0, 67) + '...'
                      : inq.message
                    : inq.serviceRequested || 'New concierge inquiry received',
                  timestamp: 'Just now',
                  read: false,
                  linkTab: 'concierge-desk',
                  createdAt: Date.now(),
                };
              });
              setNotifications((prev) => [...newNotifs, ...prev]);
              brandNewInquiries.forEach((inq) => {
                addToast(
                  'info',
                  'New Concierge Message',
                  `${inq.clientName || 'Client'} sent an inquiry.`
                );
              });
              playNotificationChime();
            }
          }
        }
      } catch (e) {
        console.warn('Live inquiries fetch:', e);
      }

      // 8. Fetch live salon settings
      try {
        const liveSettings: any = await DashboardApi.getSettings();
        if (liveSettings) {
          if (typeof liveSettings.bookingEngineActive !== 'undefined') {
            const isActive = liveSettings.bookingEngineActive === true || liveSettings.bookingEngineActive === 'true';
            setIsEngineActive(isActive);
            safeSetItem('stylex_booking_engine_active', String(isActive));
          }

          if (typeof liveSettings.maintenanceMode !== 'undefined') {
            const isMaint = liveSettings.maintenanceMode === true || liveSettings.maintenanceMode === 'true';
            safeSetItem('stylex_maintenance_mode', String(isMaint));
            setSettings((prev) => ({ ...prev, maintenanceMode: isMaint }));
          }

          setSettings((prev) => {
            const updated = { ...prev };
            if (typeof liveSettings.maintenanceMode !== 'undefined') {
              updated.maintenanceMode = liveSettings.maintenanceMode === true || liveSettings.maintenanceMode === 'true';
            }
            if (liveSettings.salonName) updated.salonName = liveSettings.salonName;
            if (liveSettings.phone) updated.phone = liveSettings.phone;
            if (liveSettings.email) updated.email = liveSettings.email;
            if (liveSettings.address) updated.address = liveSettings.address;
            if (typeof liveSettings.smsWhatsappReminders !== 'undefined') {
              updated.smsWhatsappReminders = liveSettings.smsWhatsappReminders === true || liveSettings.smsWhatsappReminders === 'true';
            }
            if (typeof liveSettings.emailCalendarInvites !== 'undefined') {
              updated.emailCalendarInvites = liveSettings.emailCalendarInvites === true || liveSettings.emailCalendarInvites === 'true';
            }
            safeSetItem('stylex_tirur_v6_settings', JSON.stringify(updated));
            return updated;
          });

          if (liveSettings.weekSchedule && Array.isArray(liveSettings.weekSchedule) && liveSettings.weekSchedule.length > 0) {
            setWeekSchedule(liveSettings.weekSchedule);
            safeSetItem('stylex_tirur_v7_schedule', JSON.stringify(liveSettings.weekSchedule));
          }

          if (liveSettings.storeNotice && typeof liveSettings.storeNotice === 'object') {
            const normalized: StoreNotice = {
              ...liveSettings.storeNotice,
              isActive: liveSettings.storeNotice.isActive === true || liveSettings.storeNotice.isActive === 'true',
            };
            const localStr = localStorage.getItem('stylex_store_notice');
            let shouldApply = true;
            if (localStr) {
              try {
                const localParsed = JSON.parse(localStr);
                if (localParsed?.updatedAt && normalized?.updatedAt) {
                  const localTime = new Date(localParsed.updatedAt).getTime();
                  const serverTime = new Date(normalized.updatedAt).getTime();
                  if (localTime > serverTime) {
                    shouldApply = false;
                    DashboardApi.updateSettings({ storeNotice: localParsed }).catch(() => {});
                  }
                }
              } catch {}
            }
            if (shouldApply) {
              setStoreNotice(normalized);
              safeSetItem('stylex_store_notice', JSON.stringify(normalized));
            }
          }
        }
      } catch (e) {
        console.warn('Live settings fetch:', e);
      }

      // 9. Check live WhatsApp Bot connection status on dashboard open
      try {
        const botStatus = await DashboardApi.getWhatsAppBotStatus();
        if (botStatus && typeof botStatus.connected !== 'undefined') {
          const isConnected = Boolean(botStatus.connected);
          if (!isConnected && !hasCheckedWhatsAppOnOpenRef.current) {
            hasCheckedWhatsAppOnOpenRef.current = true;
            setIsWhatsAppDisconnectedModalOpen(true);
          }
        }
      } catch (e) {
        console.warn('Live WhatsApp status check on dashboard open:', e);
      }

      // Mark initial load completed
      isInitialDataLoadedRef.current = true;
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
      // Poll bookings & inquiries every 15s to notify admin in real-time
      const interval = setInterval(async () => {
        try {
          if (!DashboardApi.getToken()) await DashboardApi.silentLogin();

          // 1. Live Bookings
          const liveBookings = await DashboardApi.getBookings();
          if (Array.isArray(liveBookings)) {
            const mappedAppointments = liveBookings.map(mapBackendBookingToAppointment);
            setAppointments(mappedAppointments);
            const brandNewBookings = mappedAppointments.filter(
              (apt) => apt.id && !knownBookingIdsRef.current.has(String(apt.id))
            );
            if (brandNewBookings.length > 0) {
              const newNotifs: AdminNotification[] = brandNewBookings.map((apt) => {
                knownBookingIdsRef.current.add(String(apt.id));
                return {
                  id: `booking-${apt.id}-${Date.now()}`,
                  type: 'booking',
                  title: `New Booking: ${apt.clientName || 'Guest'}`,
                  description: `${apt.serviceName || 'Ritual'} booked for ${apt.time || ''} on ${apt.dateStr || 'Upcoming'}`.trim(),
                  timestamp: 'Just now',
                  read: false,
                  linkTab: 'appointments',
                  createdAt: Date.now(),
                };
              });
              setNotifications((prev) => [...newNotifs, ...prev]);
              brandNewBookings.forEach((apt) => {
                addToast(
                  'info',
                  'New Booking Received',
                  `${apt.clientName || 'Guest'} reserved ${apt.serviceName || 'an appointment'}.`
                );
              });
              playBookingNotificationSound();
            }
          }

          // 2. Live Concierge Inquiries
          const liveInquiries = await DashboardApi.getInquiries();
          if (Array.isArray(liveInquiries)) {
            setInquiries(liveInquiries);
            safeSetItem('stylex_tirur_v6_inquiries', JSON.stringify(liveInquiries));
            const brandNewInquiries = liveInquiries.filter(
              (inq) => inq.id && !knownInquiryIdsRef.current.has(String(inq.id))
            );
            if (brandNewInquiries.length > 0) {
              const newNotifs: AdminNotification[] = brandNewInquiries.map((inq) => {
                knownInquiryIdsRef.current.add(String(inq.id));
                return {
                  id: `inquiry-${inq.id}-${Date.now()}`,
                  type: 'concierge',
                  title: `Concierge Inquiry: ${inq.clientName || 'Client'}`,
                  description: inq.message
                    ? inq.message.length > 70
                      ? inq.message.substring(0, 67) + '...'
                      : inq.message
                    : inq.serviceRequested || 'New concierge inquiry received',
                  timestamp: 'Just now',
                  read: false,
                  linkTab: 'concierge-desk',
                  createdAt: Date.now(),
                };
              });
              setNotifications((prev) => [...newNotifs, ...prev]);
              brandNewInquiries.forEach((inq) => {
                addToast(
                  'info',
                  'New Concierge Message',
                  `${inq.clientName || 'Client'} sent an inquiry.`
                );
              });
              playNotificationChime();
            }
          }

          // 3. Live Salon Settings (e.g. Maintenance Mode sync across devices & sessions)
          try {
            const liveSettings: any = await DashboardApi.getSettings();
            if (liveSettings) {
              if (typeof liveSettings.maintenanceMode !== 'undefined') {
                const isMaint = liveSettings.maintenanceMode === true || liveSettings.maintenanceMode === 'true';
                safeSetItem('stylex_maintenance_mode', String(isMaint));
                setSettings((prev) => (prev.maintenanceMode !== isMaint ? { ...prev, maintenanceMode: isMaint } : prev));
              }
              if (typeof liveSettings.bookingEngineActive !== 'undefined') {
                const isActive = liveSettings.bookingEngineActive === true || liveSettings.bookingEngineActive === 'true';
                safeSetItem('stylex_booking_engine_active', String(isActive));
                setIsEngineActive((prev) => (prev !== isActive ? isActive : prev));
              }
              if (liveSettings.weekSchedule && Array.isArray(liveSettings.weekSchedule) && liveSettings.weekSchedule.length > 0) {
                const currentStr = localStorage.getItem('stylex_tirur_v7_schedule');
                const newStr = JSON.stringify(liveSettings.weekSchedule);
                if (currentStr !== newStr) {
                  setWeekSchedule(liveSettings.weekSchedule);
                  safeSetItem('stylex_tirur_v7_schedule', newStr);
                }
              }
              if (liveSettings.storeNotice && typeof liveSettings.storeNotice === 'object') {
                const normalized: StoreNotice = {
                  ...liveSettings.storeNotice,
                  isActive: liveSettings.storeNotice.isActive === true || liveSettings.storeNotice.isActive === 'true',
                };
                const currentStr = localStorage.getItem('stylex_store_notice');
                let shouldApply = true;
                if (currentStr) {
                  try {
                    const localParsed = JSON.parse(currentStr);
                    if (localParsed?.updatedAt && normalized?.updatedAt) {
                      const localTime = new Date(localParsed.updatedAt).getTime();
                      const serverTime = new Date(normalized.updatedAt).getTime();
                      if (localTime > serverTime) {
                        shouldApply = false;
                        DashboardApi.updateSettings({ storeNotice: localParsed }).catch(() => {});
                      }
                    }
                  } catch {}
                }
                const newStr = JSON.stringify(normalized);
                if (shouldApply && currentStr !== newStr) {
                  setStoreNotice(normalized);
                  safeSetItem('stylex_store_notice', newStr);
                }
              }
            }
          } catch {}
        } catch {}
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Operational Handlers
  const handleToggleEngine = async () => {
    const next = !isEngineActive;
    setIsEngineActive(next);
    try {
      localStorage.setItem('stylex_booking_engine_active', String(next));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('stylex_booking_engine_updated'));
    } catch {}

    addToast(
      next ? 'success' : 'info',
      next ? 'Guest Booking Engine Activated' : 'Public Reservations Paused',
      next ? 'Public web portal is now accepting appointments.' : 'Public booking gateway is paused.'
    );

    try {
      await DashboardApi.updateSettings({ bookingEngineActive: String(next) });
    } catch (err) {
      console.warn('Backend API updateSettings bookingEngineActive error:', err);
    }
  };

  const handleToggleDaySchedule = (index: number) => {
    const targetDay = weekSchedule[index];
    if (!targetDay) return;
    const nextOpen = !targetDay.isOpen;
    const nextSchedule = weekSchedule.map((day, idx) =>
      idx === index
        ? { ...day, isOpen: nextOpen, statusText: nextOpen ? 'Open' : 'Closed' }
        : day
    );
    setWeekSchedule(nextSchedule);
    safeSetItem('stylex_tirur_v7_schedule', JSON.stringify(nextSchedule));
    window.dispatchEvent(new Event('storage'));
    DashboardApi.updateSettings({ weekSchedule: nextSchedule }).catch((err) => {
      console.warn('Backend API updateSettings weekSchedule error:', err);
    });
    addToast(
      'info',
      `${targetDay.dayName} Availability Changed`,
      nextOpen ? `${targetDay.dayName} reservations are now open.` : `${targetDay.dayName} marked closed for public booking.`
    );
  };

  const handleUpdateDayHours = (index: number, newHours: string) => {
    const targetDay = weekSchedule[index];
    if (!targetDay) return;
    const nextSchedule = weekSchedule.map((day, idx) =>
      idx === index
        ? { ...day, hours: newHours, subText: newHours }
        : day
    );
    setWeekSchedule(nextSchedule);
    safeSetItem('stylex_tirur_v7_schedule', JSON.stringify(nextSchedule));
    window.dispatchEvent(new Event('storage'));
    DashboardApi.updateSettings({ weekSchedule: nextSchedule }).catch((err) => {
      console.warn('Backend API updateSettings weekSchedule error:', err);
    });
    addToast(
      'success',
      `${targetDay.dayName} Hours Updated`,
      `Working hours set to ${newHours}`
    );
  };

  const handleSaveStoreNotice = async (newNotice: StoreNotice) => {
    const updated: StoreNotice = {
      ...newNotice,
      isActive: Boolean(newNotice.isActive),
      updatedAt: new Date().toISOString(),
    };
    setStoreNotice(updated);
    safeSetItem('stylex_store_notice', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));

    try {
      if (!DashboardApi.getToken()) await DashboardApi.silentLogin();
      await DashboardApi.updateSettings({ storeNotice: updated });
    } catch (err) {
      console.warn('Backend API updateSettings storeNotice error:', err);
    }

    addToast(
      updated.isActive ? 'success' : 'info',
      updated.isActive ? 'Store Notice Published' : 'Store Notice Disabled',
      updated.isActive ? 'Notice popup is now live on the website.' : 'Notice popup has been turned off.'
    );
  };

  const handleAddBooking = async (newBooking: Appointment) => {
    setAppointments((prev) => [newBooking, ...prev]);
    knownBookingIdsRef.current.add(String(newBooking.id));

    const notif: AdminNotification = {
      id: `booking-${newBooking.id}-${Date.now()}`,
      type: 'booking',
      title: `New Booking: ${newBooking.clientName}`,
      description: `${newBooking.serviceName} at ${newBooking.time} (${newBooking.dateStr})`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'appointments',
      createdAt: Date.now(),
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(
      'success',
      'Booking Reservation Confirmed',
      `${newBooking.clientName} booked for ${newBooking.serviceName} at ${newBooking.time}.`
    );
    playBookingNotificationSound();

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
        knownBookingIdsRef.current.add(String(liveApt.id));
        setAppointments((prev) => prev.map((a) => (a.id === newBooking.id ? liveApt : a)));
      }
    } catch (err) {
      console.warn('Backend API createBooking failed (retained locally):', err);
    }
  };

  const handleAddWalkIn = async (walkIn: Appointment) => {
    setAppointments((prev) => [walkIn, ...prev]);
    knownBookingIdsRef.current.add(String(walkIn.id));

    const notif: AdminNotification = {
      id: `walkin-${walkIn.id}-${Date.now()}`,
      type: 'booking',
      title: `Express Walk-In: ${walkIn.clientName}`,
      description: `${walkIn.serviceName} seated in ${walkIn.station}`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'appointments',
      createdAt: Date.now(),
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(
      'success',
      'Express Walk-In Seated',
      `${walkIn.clientName} seated in ${walkIn.station} for ${walkIn.serviceName}.`
    );
    playBookingNotificationSound();

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
        knownBookingIdsRef.current.add(String(liveApt.id));
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
      window.dispatchEvent(new Event('storage'));
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
    const updated = exists
      ? services.map((s) => (s.id === service.id ? service : s))
      : [...services, service];
    setServices(updated);

    try {
      safeSetItem('stylex_tirur_v6_services', JSON.stringify(updated));
      safeSetItem('stylex_services', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch {}

    addToast(
      'success',
      serviceToEdit ? 'Service Details Updated' : 'New Service Published',
      `"${service.name}" is ready in the salon catalog.`
    );
    setServiceToEdit(null);

    const backendGender =
      service.gender === 'ladies'
        ? 'ladies'
        : service.gender === 'gents'
        ? 'gents'
        : 'unisex';

    try {
      if (exists) {
        await DashboardApi.updateService(service.id, {
          name: service.name,
          category: service.category,
          gender: backendGender,
          durationMins: service.durationMin,
          description: service.description,
          isActive: service.showOnWebsite,
        });
      } else {
        await DashboardApi.createService({
          id: service.id || service.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          name: service.name,
          category: service.category,
          gender: backendGender,
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
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);

    try {
      safeSetItem('stylex_tirur_v6_services', JSON.stringify(updated));
      safeSetItem('stylex_services', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch {}

    addToast('info', 'Service Removed', `"${target?.name || 'Service'}" removed from catalog.`);

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
      window.dispatchEvent(new Event('storage'));
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
      window.dispatchEvent(new Event('storage'));
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
      window.dispatchEvent(new Event('storage'));
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
      window.dispatchEvent(new Event('storage'));
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
      window.dispatchEvent(new Event('storage'));
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
      window.dispatchEvent(new Event('storage'));
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
      window.dispatchEvent(new Event('storage'));
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
      window.dispatchEvent(new Event('storage'));
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
      window.dispatchEvent(new Event('storage'));
    } catch {}
    addToast('info', 'Photo Removed', 'Transformation photo removed from client website gallery.');

    try {
      await DashboardApi.deletePortfolioPhoto(id);
    } catch (err) {
      console.warn('Backend API portfolio delete failed:', err);
    }
  };

  // Concierge Handlers
  const handleResolveInquiry = async (id: string) => {
    const updated = inquiries.map((inq) =>
      inq.id === id ? { ...inq, status: 'Resolved' as const } : inq
    );
    setInquiries(updated);
    safeSetItem('stylex_tirur_v6_inquiries', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    addToast('success', 'Inquiry Resolved', 'Marked as completed in concierge ledger.');

    try {
      await DashboardApi.updateInquiry(id, { status: 'Resolved' });
    } catch {}
  };

  const handleReplyInquiry = async (id: string, replyText: string) => {
    const updated = inquiries.map((inq) =>
      inq.id === id ? { ...inq, status: 'In Progress' as const } : inq
    );
    setInquiries(updated);
    safeSetItem('stylex_tirur_v6_inquiries', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    addToast(
      'success',
      'Dispatch Transmitted',
      `Message forwarded to guest: "${replyText.slice(0, 40)}..."`
    );

    try {
      await DashboardApi.updateInquiry(id, { status: 'In Progress' });
    } catch {}
  };

  const handleDeleteInquiry = async (id: string) => {
    const updated = inquiries.filter((inq) => inq.id !== id);
    setInquiries(updated);
    safeSetItem('stylex_tirur_v6_inquiries', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    addToast('info', 'Inquiry Removed', 'Message deleted from concierge desk.');

    try {
      await DashboardApi.deleteInquiry(id);
    } catch (err) {
      console.warn('Backend inquiry delete failed:', err);
    }
  };

  // Unique Clients grouped strictly by Mobile Number
  // Each unique mobile number represents a single client displaying their total number of sessions
  const uniqueClients = useMemo<VIPClient[]>(() => {
    function normalizeClientPhone(phone?: string): string {
      if (!phone) return '';
      const digits = phone.replace(/\D/g, '');
      if (digits.length === 12 && digits.startsWith('91')) {
        return digits.slice(2);
      }
      if (digits.length === 11 && digits.startsWith('0')) {
        return digits.slice(1);
      }
      return digits;
    }

    const clientsByPhone = new Map<string, {
      id: string;
      name: string;
      phone: string;
      email: string;
      notes: string;
      preferredStylist?: string;
      favoriteRitual?: string;
      lastVisit: string;
      lastVisitTimestamp: number;
      sessionsCount: number;
      totalSpentAmount: number;
      stylistCounts: Record<string, number>;
      ritualCounts: Record<string, number>;
    }>();

    // 1. Process VIP clients loaded from database / CRM
    (vipClients || []).forEach((c) => {
      const normPhone = normalizeClientPhone(c.phone);
      if (!normPhone) return;

      const visits = Number(c.totalVisits || c.visits || 1);
      const spentNum = parseFloat(String(c.spent || '').replace(/[^0-9.]/g, '')) || 0;
      const existing = clientsByPhone.get(normPhone);

      if (!existing) {
        clientsByPhone.set(normPhone, {
          id: c.id,
          name: c.name || 'Guest Client',
          phone: c.phone,
          email: c.email || '',
          notes: c.notes || '',
          preferredStylist: c.preferredStylist || c.favArtisan,
          favoriteRitual: c.favoriteRitual,
          lastVisit: c.lastVisit || 'Recent',
          lastVisitTimestamp: 0,
          sessionsCount: visits,
          totalSpentAmount: spentNum,
          stylistCounts: {},
          ritualCounts: {},
        });
      } else {
        existing.sessionsCount = Math.max(existing.sessionsCount, visits);
        existing.totalSpentAmount = Math.max(existing.totalSpentAmount, spentNum);
        if (!existing.notes && c.notes) existing.notes = c.notes;
        if (!existing.email && c.email) existing.email = c.email;
        if (c.name && (!existing.name || existing.name === 'Guest Client')) existing.name = c.name;
      }
    });

    // 2. Process all appointments to dynamically count sessions per unique mobile number
    (appointments || []).forEach((apt) => {
      const normPhone = normalizeClientPhone(apt.clientPhone);
      if (!normPhone) return;

      let aptTimestamp = 0;
      if (apt.dateStr) {
        const d = new Date(apt.dateStr + (apt.time ? ` ${apt.time}` : ''));
        if (!isNaN(d.getTime())) aptTimestamp = d.getTime();
      }

      const existing = clientsByPhone.get(normPhone);
      const aptPrice = Number(apt.price) || 0;

      if (!existing) {
        clientsByPhone.set(normPhone, {
          id: `client-${normPhone}`,
          name: apt.clientName || 'Guest Client',
          phone: apt.clientPhone,
          email: apt.clientEmail || '',
          notes: apt.notes || '',
          preferredStylist: apt.stylistName,
          favoriteRitual: apt.serviceName,
          lastVisit: apt.dateStr ? `${apt.dateStr} (${apt.time || ''})` : 'Recent',
          lastVisitTimestamp: aptTimestamp,
          sessionsCount: 1,
          totalSpentAmount: aptPrice,
          stylistCounts: apt.stylistName ? { [apt.stylistName]: 1 } : {},
          ritualCounts: apt.serviceName ? { [apt.serviceName]: 1 } : {},
        });
      } else {
        existing.sessionsCount += 1;
        existing.totalSpentAmount += aptPrice;

        if (apt.clientName && apt.clientName.trim().length > existing.name.length) {
          existing.name = apt.clientName.trim();
        }
        if (apt.clientEmail && !existing.email) {
          existing.email = apt.clientEmail.trim();
        }
        if (apt.notes && !existing.notes) {
          existing.notes = apt.notes;
        }

        if (apt.stylistName) {
          existing.stylistCounts[apt.stylistName] = (existing.stylistCounts[apt.stylistName] || 0) + 1;
        }
        if (apt.serviceName) {
          existing.ritualCounts[apt.serviceName] = (existing.ritualCounts[apt.serviceName] || 0) + 1;
        }

        if (aptTimestamp >= existing.lastVisitTimestamp) {
          existing.lastVisitTimestamp = aptTimestamp;
          existing.lastVisit = apt.dateStr ? `${apt.dateStr} (${apt.time || ''})` : existing.lastVisit;
        }
      }
    });

    return Array.from(clientsByPhone.values()).map((c) => {
      const topStylist = Object.entries(c.stylistCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || c.preferredStylist || 'Master Stylist';
      const topRitual = Object.entries(c.ritualCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || c.favoriteRitual || 'Signature Service';

      const initials = (c.name || 'GC')
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      return {
        id: c.id,
        name: c.name,
        initials: initials || 'GC',
        phone: c.phone,
        email: c.email || 'guest@stylexsalon.in',
        totalVisits: c.sessionsCount,
        visits: c.sessionsCount,
        preferredStylist: topStylist,
        favArtisan: topStylist,
        favoriteRitual: topRitual,
        lastVisit: c.lastVisit,
        spent: `₹${c.totalSpentAmount.toLocaleString('en-IN')}`,
        notes: c.notes || 'Client in good standing',
      };
    }).sort((a, b) => b.totalVisits - a.totalVisits);
  }, [vipClients, appointments]);

  // Clients Handlers
  const handleDeleteClient = async (id: string) => {
    function normalizeClientPhone(phone?: string): string {
      if (!phone) return '';
      const digits = phone.replace(/\D/g, '');
      if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
      if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
      return digits;
    }

    const target = uniqueClients.find((c) => c.id === id);
    const updated = vipClients.filter((c) => c.id !== id);
    setVipClients(updated);

    if (target?.phone) {
      const norm = normalizeClientPhone(target.phone);
      setAppointments((prev) => prev.filter((a) => normalizeClientPhone(a.clientPhone) !== norm));
    }

    safeSetItem('stylex_tirur_v6_clients', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    addToast('info', 'Client Removed', `Client profile for "${target?.name || 'Client'}" deleted.`);

    if (id && !id.startsWith('client-')) {
      try {
        await DashboardApi.deleteCustomer(id);
      } catch (err) {
        console.warn('Backend customer delete failed:', err);
      }
    }
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
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    addToast('info', 'User Removed', `Account for ${target.name} has been deleted.`);
  };

  // Change Password Handler for active user
  const handleUpdatePassword = async (oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    // 1. If backend token exists, call backend API to update password in database
    const token = DashboardApi.getToken();
    if (token) {
      try {
        const res = await DashboardApi.updatePassword(oldPass, newPass);
        if (res && res.success !== false) {
          const updatedUser = { ...currentUser, password: newPass };
          setCurrentUser(updatedUser);
          setUsers((prev) => {
            const next = prev.map((u) => (u.id === updatedUser.id ? updatedUser : u));
            try {
              safeSetItem('stylex_user_accounts_v2', JSON.stringify(next));
            } catch {}
            return next;
          });
          addToast(
            'success',
            'Password Updated',
            `Credentials updated successfully for ${currentUser.name}.`
          );
          return { success: true, message: 'Password updated successfully.' };
        } else {
          return { success: false, message: res?.message || 'Current password does not match.' };
        }
      } catch (err: any) {
        console.error('API updatePassword error:', err);
        const errMsg = err?.message || '';
        if (
          errMsg.toLowerCase().includes('current password') ||
          errMsg.toLowerCase().includes('incorrect') ||
          errMsg.includes('400')
        ) {
          return { success: false, message: 'Current password does not match. Please verify and try again.' };
        }
        return { success: false, message: errMsg || 'Failed to update password.' };
      }
    }

    // 2. Offline / local fallback mode
    let expectedPassword = currentUser.password;
    if (!expectedPassword) {
      if (currentUser.username === 'developer' || currentUser.email === 'dev@stylexsalon.in') {
        expectedPassword = 'stylexdev';
      } else if (currentUser.username === 'admin' || currentUser.email === 'admin@stylexsalon.in') {
        expectedPassword = 'stylex2024';
      } else if (currentUser.username === 'bladeoski' || currentUser.email === 'bladeoski@stylex.com') {
        expectedPassword = 'bL4d3_89xK!mPq2';
      }
    }

    if (expectedPassword && oldPass !== expectedPassword) {
      return { success: false, message: 'Current password does not match.' };
    }

    const updatedUser = { ...currentUser, password: newPass };
    setCurrentUser(updatedUser);
    setUsers((prev) => {
      const next = prev.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      try {
        safeSetItem('stylex_user_accounts_v2', JSON.stringify(next));
      } catch {}
      return next;
    });
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
    setUsers((prev) => {
      const isDev = user.role === 'Developer' || user.username?.toLowerCase() === 'developer' || user.email?.toLowerCase() === 'dev@stylexsalon.in';
      const exists = prev.some((u) => 
        u.id === user.id || 
        (u.username && u.username.toLowerCase() === user.username.toLowerCase()) ||
        (u.email && u.email.toLowerCase() === user.email.toLowerCase()) ||
        (isDev && (u.role === 'Developer' || u.username?.toLowerCase() === 'developer' || u.email?.toLowerCase() === 'dev@stylexsalon.in'))
      );
      const next = exists
        ? prev.map((u) => {
            const isMatch = u.id === user.id || 
              (u.username && u.username.toLowerCase() === user.username.toLowerCase()) ||
              (u.email && u.email.toLowerCase() === user.email.toLowerCase()) ||
              (isDev && (u.role === 'Developer' || u.username?.toLowerCase() === 'developer' || u.email?.toLowerCase() === 'dev@stylexsalon.in'));
            return isMatch ? { ...u, ...user } : u;
          })
        : [...prev, user];
      const deduped = deduplicateUsers(next);
      try {
        safeSetItem('stylex_user_accounts_v2', JSON.stringify(deduped));
      } catch {}
      return deduped;
    });
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
          setIsMobileMenuOpen(false);
        }}
        todayAppointmentsCount={todayAppointmentsCount}
        unreadConciergeCount={unreadInquiriesCount}
        onLogout={handleLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Pane */}
      <div className="pl-0 lg:pl-56 xl:pl-60 2xl:pl-72 min-h-screen transition-all duration-300">
        <Header
          onOpenNewBooking={() => setIsNewBookingOpen(true)}
          searchQuery={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
          currentUser={currentUser}
          onNavigateToSettings={() => {
            setCurrentTab('atelier-settings');
            setIsMobileMenuOpen(false);
          }}
          onOpenChangePassword={() => setIsChangePasswordOpen(true)}
          onLogout={handleLogout}
          notifications={notifications}
          onDeleteNotification={handleDeleteNotification}
          onClearAllNotifications={handleClearAllNotifications}
          onSelectNotification={handleSelectNotification}
          darkMode={settings.darkMode}
          onToggleDarkMode={() => handleToggleDarkMode(!settings.darkMode)}
          onRefresh={handleRefreshData}
          isRefreshing={isRefreshing}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        <main className="relative pt-[72px] sm:pt-[76px] xl:pt-[92px] pb-32 lg:pb-12 bg-[#f6faf7] dark:bg-[#0d1611] min-h-screen px-3 sm:px-5 lg:px-6 2xl:px-8 transition-all">
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
              onUpdateDayHours={handleUpdateDayHours}
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
              storeNotice={storeNotice}
              onSaveStoreNotice={handleSaveStoreNotice}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'clients-and-vip' && (
            <ClientsView
              clients={uniqueClients}
              onBookClient={(name, phone) => {
                setIsNewBookingOpen(true);
              }}
              onDeleteClient={handleDeleteClient}
              globalSearchQuery={globalSearchQuery}
            />
          )}

          {currentTab === 'concierge-desk' && (
            <ConciergeView
              inquiries={inquiries}
              onResolveInquiry={handleResolveInquiry}
              onReplyInquiry={handleReplyInquiry}
              onDeleteInquiry={handleDeleteInquiry}
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

      {/* WhatsApp Disconnected Alert Modal */}
      <WhatsAppDisconnectedModal
        isOpen={isWhatsAppDisconnectedModalOpen}
        onClose={() => setIsWhatsAppDisconnectedModalOpen(false)}
        onGoToSettings={() => {
          setIsWhatsAppDisconnectedModalOpen(false);
          setCurrentTab('settings');
          setGlobalSearchQuery('');
          setTimeout(() => {
            const qrEl = document.getElementById('whatsapp-qr-section');
            if (qrEl) {
              qrEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 250);
        }}
      />

      {/* Mobile PWA Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setGlobalSearchQuery('');
          setIsMobileMenuOpen(false);
        }}
        todayAppointmentsCount={todayAppointmentsCount}
        unreadConciergeCount={unreadInquiriesCount}
        onOpenNewBooking={() => setIsNewBookingOpen(true)}
        onToggleMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        isMenuOpen={isMobileMenuOpen}
      />
    </div>
  );
}
