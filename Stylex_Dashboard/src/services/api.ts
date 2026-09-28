/**
 * StyleX Management Dashboard - Production REST API Service Layer
 * Direct connection to PostgreSQL database via Express /api gateway
 */

import {
  Appointment,
  AppointmentStatus,
  ServiceItem,
  ServiceCategory,
  Stylist,
  VIPClient,
  CarouselBanner,
  ReelItem,
  PortfolioWork,
  SalonSettings,
} from '../types';

const TOKEN_KEY = 'stylex_admin_token';
const API_BASE = '/api';

export class DashboardApi {
  public static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public static setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public static clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  /**
   * Universal fetch helper with auto Bearer token injection and error handling
   */
  private static async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    retryAuth = true
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    try {
      const res = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized with silent retry if admin credentials exist
      if (res.status === 401 && retryAuth) {
        const loggedIn = await this.silentLogin();
        if (loggedIn) {
          return this.request<T>(endpoint, options, false);
        }
      }

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(errorJson?.message || `Request failed with HTTP status ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.warn(`[StyleX API] Request error on ${url}:`, error);
      throw error;
    }
  }

  /**
   * Silent session refresh only if user has an active authenticated session
   */
  public static async silentLogin(): Promise<boolean> {
    const sessionActive = localStorage.getItem('stylex_session_active');
    if (sessionActive !== 'true') {
      return false; // User has not signed in or has logged out
    }

    try {
      const savedEmail = localStorage.getItem('stylex_current_user_email_v2') || 'admin@stylexsalon.in';
      const accountsStr = localStorage.getItem('stylex_user_accounts_v2');
      let password = 'stylex2024';

      if (accountsStr) {
        try {
          const accounts = JSON.parse(accountsStr);
          const matched = accounts.find((a: any) =>
            a.email?.toLowerCase() === savedEmail.toLowerCase() ||
            a.username?.toLowerCase() === savedEmail.toLowerCase()
          );
          if (matched && matched.password) {
            password = matched.password;
          }
        } catch {}
      }

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: savedEmail, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.data?.token) {
          this.setToken(data.data.token);
          return true;
        }
      }
    } catch {}
    return false;
  }

  // ============================================================================
  // Authentication Endpoints
  // ============================================================================
  public static async login(identifier: string, password: string) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }, false);

    if (res?.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  public static async getMe() {
    return this.request('/auth/me');
  }

  public static async updatePassword(currentPassword: string, newPassword: string) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // ============================================================================
  // Bookings (Appointments)
  // ============================================================================
  public static async getBookings(params: { date?: string; status?: string; search?: string; limit?: number } = {}) {
    const q = new URLSearchParams();
    if (params.date) q.append('date', params.date);
    if (params.status) q.append('status', params.status);
    if (params.search) q.append('search', params.search);
    q.append('limit', String(params.limit || 200));

    const res = await this.request(`/bookings?${q.toString()}`);
    return res?.data || [];
  }

  public static async createBooking(data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    serviceId: string;
    secondaryServiceId?: string;
    stylistId?: string;
    date: string;
    timeSlot: string;
    notes?: string;
    source?: string;
  }) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public static async updateBookingStatus(id: string, status: string, notes?: string) {
    return this.request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  public static async resendWhatsApp(id: string) {
    return this.request(`/bookings/${id}/resend-whatsapp`, {
      method: 'POST',
    });
  }

  // ============================================================================
  // Services
  // ============================================================================
  public static async getServices(): Promise<ServiceItem[]> {
    const res = await this.request('/services');
    const rawList = res?.data || [];
    return rawList.map(mapBackendServiceToItem);
  }

  public static async createService(service: any) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    });
  }

  public static async updateService(id: string, service: any) {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    });
  }

  public static async deleteService(id: string) {
    return this.request(`/services/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // Stylists
  // ============================================================================
  public static async getStylists(): Promise<Stylist[]> {
    const res = await this.request('/stylists');
    const rawList = res?.data || [];
    return rawList.map(mapBackendStylistToItem);
  }

  public static async createStylist(stylist: any) {
    return this.request('/stylists', {
      method: 'POST',
      body: JSON.stringify(stylist),
    });
  }

  public static async updateStylist(id: string, stylist: any) {
    return this.request(`/stylists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(stylist),
    });
  }

  public static async deleteStylist(id: string) {
    return this.request(`/stylists/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // Customers (CRM / VIP)
  // ============================================================================
  public static async getCustomers(): Promise<VIPClient[]> {
    const res = await this.request('/customers');
    const rawList = res?.data || [];
    return rawList.map(mapBackendCustomerToVipClient);
  }

  // ============================================================================
  // Promotions (Banners, Reels, Portfolio)
  // ============================================================================
  public static async getBanners(): Promise<CarouselBanner[]> {
    const res = await this.request('/promotions/banners');
    const rawList = res?.data || [];
    return rawList.map((b: any) => ({
      id: b.id,
      title: b.title,
      tag: b.badge || 'Privilege',
      validity: 'Limited Time Privilege',
      imageUrl: b.imageUrl,
      isActive: b.isActive ?? true,
    }));
  }

  public static async getReels(): Promise<ReelItem[]> {
    const res = await this.request('/promotions/reels');
    const rawList = res?.data || [];
    return rawList.map((r: any) => ({
      id: r.id,
      title: r.title,
      tag: r.tag || 'Styling',
      views: r.views || '1.4k views',
      imageUrl: r.imageUrl,
      audioTrack: r.audioTrack || 'StyleX Ritual Acoustic',
      stylistHandle: r.stylistHandle || '@stylex.signature.salon.tirur',
      category: r.category || 'Treatment',
      description: r.description || '',
      instagramUrl: r.instagramUrl || 'https://www.instagram.com/stylex.signature.salon.tirur/',
      videoUrl: r.videoUrl,
      isActive: r.isActive ?? true,
    }));
  }

  public static async getPortfolioPhotos(): Promise<PortfolioWork[]> {
    const res = await this.request('/promotions/photos');
    const rawList = res?.data || [];
    return rawList.map((p: any) => ({
      id: p.id,
      title: p.title,
      category: p.category || 'Hair & Styling',
      artisan: p.artisan || 'StyleX Master Artisan',
      imageUrl: p.imageUrl,
      description: p.description || '',
      isActive: p.isActive ?? true,
    }));
  }

  // ============================================================================
  // Salon Settings
  // ============================================================================
  public static async getSettings(): Promise<Partial<SalonSettings>> {
    const res = await this.request('/settings');
    return res?.data || {};
  }

  public static async updateSettings(settings: Record<string, string>) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
}

// ============================================================================
// Data Mappers (PostgreSQL DB Record -> Dashboard State Object)
// ============================================================================

function normalizeToYMD(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const trimmed = String(dateStr).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  if (trimmed.toLowerCase() === 'today') return new Date().toISOString().split('T')[0];
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  return trimmed;
}

export function mapBackendBookingToAppointment(b: any): Appointment {
  const name = b.guestName || b.customer?.name || 'Guest Client';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'GC';

  let status: AppointmentStatus = 'BOOKED';
  if (b.status === 'IN_PROGRESS') status = 'IN_PROGRESS';
  else if (b.status === 'COMPLETED') status = 'COMPLETED';
  else if (b.status === 'CANCELLED') status = 'CANCELLED';
  else status = 'BOOKED';

  const visits = b.customer?.totalVisits || 1;
  let clientTier: Appointment['clientTier'] = 'Standard';
  if (visits >= 10) clientTier = 'VIP Platinum';
  else if (visits >= 5) clientTier = 'VIP Gold';
  else if (visits >= 2) clientTier = 'VIP Member';
  else clientTier = 'New Guest';

  const fullPhone = b.guestPhone || (b.customer?.phone
    ? `${b.customer.countryCode ? b.customer.countryCode + ' ' : ''}${b.customer.phone}`
    : '+91 96561 11149');

  const email = b.guestEmail || b.customer?.email || undefined;

  return {
    id: b.id,
    time: b.timeSlot || '11:00 AM',
    durationMin: b.service?.durationMins || 45,
    clientName: name,
    clientPhone: fullPhone,
    clientEmail: email,
    clientInitials: initials,
    clientTier,
    serviceName: b.service?.name || 'Signature Salon Ritual',
    station: b.source === 'WALK_IN' ? 'Walk-in Express Station' : (b.stylist?.station || 'Styling Station 01'),
    stylistName: b.stylist?.name || 'Any Stylist',
    stylistAvatar: b.stylist?.imageUrl || '',
    status,
    dateStr: normalizeToYMD(b.date),
    notes: b.notes ? `[Ref: ${b.bookingRef}] ${b.notes}` : `Ref: ${b.bookingRef}`,
  };
}

export function mapBackendServiceToItem(s: any): ServiceItem {
  let cat: ServiceCategory = 'hair';
  const c = (s.category || '').toLowerCase();
  if (c.includes('skin') || c.includes('facial')) cat = 'skin';
  else if (c.includes('spa')) cat = 'spa';
  else if (c.includes('beard') || c.includes('shave') || c.includes('groom')) cat = 'groom';
  else if (c.includes('bridal')) cat = 'bridal';

  return {
    id: s.id,
    name: s.name,
    category: cat,
    durationMin: s.durationMins || 45,
    description: s.description || '',
    showOnWebsite: s.isActive ?? true,
  };
}

export function mapBackendStylistToItem(st: any): Stylist {
  return {
    id: st.id,
    name: st.name,
    role: st.role || 'Senior Stylist',
    avatar: st.imageUrl || 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200',
    station: 'Styling Station 01',
    specialty: st.specialty || '',
    appointmentsCount: st.bookings?.length || 15,
    rating: st.rating || 4.9,
    reviewsCount: st.reviewCount || 42,
  };
}

export function mapBackendCustomerToVipClient(c: any): VIPClient {
  const initials = (c.name || 'GC')
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const visits = c.totalVisits || 1;
  let tier: VIPClient['tier'] = 'VIP Member';
  if (visits >= 10) tier = 'VIP Platinum';
  else if (visits >= 5) tier = 'VIP Gold';
  else if (visits === 1) tier = 'New Guest';

  const lastBooking = c.bookings?.[0];
  const lastVisit = lastBooking ? `${lastBooking.date} (${lastBooking.timeSlot})` : 'Recent';

  return {
    id: c.id,
    name: c.name,
    tier,
    phone: `${c.countryCode || '+91'} ${c.phone}`,
    email: c.email || 'guest@stylexsalon.in',
    visits,
    spent: `₹${(c.totalSpent || 0).toLocaleString('en-IN')}`,
    favArtisan: lastBooking?.stylist?.name || 'Niya Mathew',
    lastVisit,
    initials,
  };
}
