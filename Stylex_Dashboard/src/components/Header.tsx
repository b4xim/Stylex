import React, { useState, useRef, useEffect } from 'react';
import { X_LOGO_URL } from '../constants';
import { UserAccount, AdminNotification } from '../types';

interface HeaderProps {
  onOpenNewBooking: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: UserAccount;
  onNavigateToSettings: () => void;
  onOpenChangePassword: () => void;
  onLogout: () => void;
  notifications?: AdminNotification[];
  onDeleteNotification?: (id: string) => void;
  onClearAllNotifications?: () => void;
  onSelectNotification?: (notif: AdminNotification) => void;
  unreadCount?: number;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewBooking,
  searchQuery,
  onSearchChange,
  currentUser,
  onNavigateToSettings,
  onOpenChangePassword,
  onLogout,
  notifications,
  onDeleteNotification,
  onClearAllNotifications,
  onSelectNotification,
  unreadCount = 2,
  onRefresh,
  isRefreshing = false,
  onToggleMobileMenu,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const activeNotifications = notifications ?? [];
  const unreadNotificationsCount = notifications
    ? notifications.filter((n) => !n.read).length
    : (unreadCount ?? 0);

  // Close menus on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 lg:left-56 xl:left-60 2xl:left-72 right-0 h-16 xl:h-20 bg-[#f6faf7]/90 dark:bg-[#121c17]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-30 flex flex-nowrap items-center justify-between px-3 sm:px-4 lg:px-6 border-b border-[#dfe4e0]/60 dark:border-[#24332a] gap-2 lg:gap-4 transition-all duration-300">
      {/* Left zone: Brand Status */}
      <div className="flex items-center gap-1.5 sm:gap-3 xl:gap-4 shrink-0 min-w-0">
        {/* Mobile Menu Hamburger */}
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Open navigation menu"
            className="lg:hidden p-1.5 sm:p-2 -ml-1 rounded-xl text-[#112e20] dark:text-white hover:bg-[#eaefeb] dark:hover:bg-[#1f2d25] transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <img alt="StyleX X Logo" className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0" src={X_LOGO_URL} />
          <span className="font-semibold text-sm sm:text-base text-[#112e20] dark:text-white whitespace-nowrap">
            <span className="hidden xs:inline">StyleX </span>Admin<span className="hidden md:inline"> Portal</span>
          </span>
        </div>

        {/* Outlet Status Badge - Full on 2xl, Compact on xl */}
        <div className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0f5f1] dark:bg-[#192720] text-[#181d1b] dark:text-[#caead5] border border-[#c2c8c2]/40 dark:border-[#2a3c31] shrink-0 whitespace-nowrap">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="text-[12px] font-medium whitespace-nowrap">
            Tirur Outlet • Open
          </span>
        </div>
        <div className="hidden xl:flex 2xl:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0f5f1] dark:bg-[#192720] text-[#181d1b] dark:text-[#caead5] border border-[#c2c8c2]/40 dark:border-[#2a3c31] shrink-0 whitespace-nowrap" title="Tirur Outlet: Open">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="text-[11px] font-medium whitespace-nowrap">
            Open
          </span>
        </div>
      </div>

      {/* Right zone: Actions & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3 xl:gap-4 shrink-0 min-w-0">
        {/* Search */}
        <div className="relative hidden lg:flex items-center shrink min-w-0">
          <span className="material-symbols-outlined absolute left-3 text-[#424844] dark:text-[#88998f] text-[18px] pointer-events-none shrink-0">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-32 lg:w-40 xl:w-56 2xl:w-72 focus-within:w-44 lg:focus-within:w-56 xl:focus-within:w-72 2xl:focus-within:w-80 pl-9 pr-7 py-2 rounded-full bg-[#f0f5f1] dark:bg-[#192720] text-[#181d1b] dark:text-white placeholder:text-[#424844] dark:placeholder:text-[#7d9085] text-xs sm:text-sm outline-none focus:bg-white dark:focus:bg-[#203128] focus:ring-1 focus:ring-[#112e20] dark:focus:ring-[#caead5] border border-transparent focus:border-[#112e20]/20 transition-all duration-300 shadow-xs"
            placeholder="Search bookings, clients..."
            type="text"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 text-[#727973] hover:text-[#181d1b] dark:text-[#88998f] dark:hover:text-white"
              title="Clear search"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Refresh Live Data CTA */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#f0f5f1] dark:bg-[#192720] text-[#112e20] dark:text-[#caead5] border border-[#c2c8c2]/50 dark:border-[#2a3c31] text-[13px] font-medium hover:bg-[#e2ebe4] dark:hover:bg-[#22352b] transition-all cursor-pointer shadow-2xs group active:scale-95 disabled:opacity-60 shrink-0 whitespace-nowrap"
            title="Refresh live appointments & records from database"
          >
            <span
              className={`material-symbols-outlined text-[18px] sm:text-[19px] text-[#112e20] dark:text-[#7cebb0] shrink-0 ${
                isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'
              }`}
            >
              refresh
            </span>
            <span className="hidden xl:inline font-semibold text-xs whitespace-nowrap">
              {isRefreshing ? 'Syncing...' : 'Refresh'}
            </span>
          </button>
        )}

        {/* New Booking CTA - on mobile, MobileBottomNav has the primary elevated + Book button */}
        <button
          onClick={onOpenNewBooking}
          className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-3.5 xl:px-5 py-2 sm:py-2.5 rounded-full bg-[#9b4521] text-white text-xs sm:text-[13px] font-semibold shadow-sm hover:bg-[#752906] transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shrink-0 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[16px] sm:text-[18px] shrink-0">add</span>
          <span className="whitespace-nowrap">New Booking</span>
        </button>

        {/* Notifications */}
        <div className="relative shrink-0" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative p-2 sm:p-2.5 rounded-full hover:bg-[#eaefeb] dark:hover:bg-[#1f2d25] transition-colors cursor-pointer text-[#181d1b] dark:text-white shrink-0"
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ff4d15] text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white dark:ring-[#121c17] shadow-[0_0_10px_rgba(255,100,50,0.8)] animate-pulse">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#15201a] rounded-2xl shadow-2xl border border-[#c2c8c2]/50 dark:border-[#2d3a33] p-3 sm:p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-[#eaefeb] dark:border-[#243029]">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-[#112e20] dark:text-white">Notifications</h4>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[10px] text-[#ff7a45] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ff7a45]/15 dark:bg-[#ff7a45]/25">
                      {unreadNotificationsCount} New
                    </span>
                  )}
                </div>
                {activeNotifications.length > 0 && onClearAllNotifications && (
                  <button
                    type="button"
                    onClick={() => onClearAllNotifications()}
                    className="flex items-center gap-1 text-[11px] text-[#727973] hover:text-rose-600 dark:text-[#8e9e95] dark:hover:text-rose-400 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Clear all notifications"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {activeNotifications.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#eaefeb] dark:bg-[#1f2d25] flex items-center justify-center mx-auto mb-2 text-[#727973] dark:text-[#88998f]">
                    <span className="material-symbols-outlined text-[24px]">notifications_off</span>
                  </div>
                  <p className="text-xs font-semibold text-[#181d1b] dark:text-white">No notifications</p>
                  <p className="text-[11px] text-[#727973] dark:text-[#8e9e95] mt-1 max-w-[220px] mx-auto leading-relaxed">
                    You're all caught up! New bookings and concierge inquiries will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#eaefeb] dark:divide-[#243029] max-h-80 sm:max-h-96 overflow-y-auto mt-1 custom-scrollbar">
                  {activeNotifications.map((notif) => {
                    const isBooking = notif.type === 'booking';
                    const isConcierge = notif.type === 'concierge';
                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (onSelectNotification) {
                            onSelectNotification(notif);
                          }
                          setShowNotifications(false);
                        }}
                        className={`group relative p-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-3 my-1 ${
                          !notif.read
                            ? 'bg-[#f4f8f5] dark:bg-[#18261e] hover:bg-[#ebf2ed] dark:hover:bg-[#1f3127]'
                            : 'hover:bg-[#f6faf7] dark:hover:bg-[#19251f]'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${
                            isBooking
                              ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                              : isConcierge
                              ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                              : 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[17px]">
                            {isBooking ? 'calendar_month' : isConcierge ? 'chat_bubble' : 'notifications'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-center gap-1.5">
                            <p
                              className={`text-xs truncate ${
                                !notif.read
                                  ? 'font-semibold text-[#112e20] dark:text-white'
                                  : 'font-medium text-[#181d1b] dark:text-[#d5ded8]'
                              }`}
                            >
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d15] shrink-0"></span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#424844] dark:text-[#97a59d] mt-0.5 line-clamp-2 leading-relaxed">
                            {notif.description}
                          </p>
                          <span className="text-[10px] text-[#727973] dark:text-[#7f8f86] mt-1 block">
                            {notif.timestamp}
                          </span>
                        </div>
                        {onDeleteNotification && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteNotification(notif.id);
                            }}
                            title="Delete notification"
                            aria-label="Delete notification"
                            className="absolute top-2.5 right-2.5 p-1 rounded-md text-[#727973] hover:text-rose-600 dark:text-[#88998f] dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">close</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-7 sm:h-8 w-px bg-[#e5e9e6] dark:bg-[#25362c] shrink-0"></div>

        {/* User Profile Trigger & Dropdown Menu */}
        <div className="relative shrink-0" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-1 pr-1.5 sm:pr-2 py-1 rounded-xl text-left hover:bg-[#eaefeb]/70 dark:hover:bg-[#1a2821] transition-all cursor-pointer group shrink-0"
            title={`${currentUser.name} (${currentUser.roleTitle}) - Account Options`}
            aria-expanded={showProfileMenu}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#112e20] dark:bg-[#203a2c] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-[#eaefeb] dark:ring-[#2a3c31] relative shrink-0">
              {currentUser.initials}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#112e20]"></span>
            </div>
            <div className="hidden md:flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-[13px] font-semibold text-[#112e20] dark:text-white leading-tight group-hover:text-[#9b4521] dark:group-hover:text-[#ff9266] transition-colors whitespace-nowrap truncate max-w-[110px]">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#eaefeb] dark:bg-[#22352a] text-[#112e20] dark:text-[#a0dbb7] shrink-0">
                  {currentUser.role}
                </span>
              </div>
              <span className="hidden xl:block text-[11px] text-[#9b4521] dark:text-[#ff9266] font-medium leading-none mt-0.5 whitespace-nowrap truncate max-w-[130px]">
                {currentUser.roleTitle}
              </span>
            </div>
            <span
              className={`material-symbols-outlined text-[18px] text-[#727973] dark:text-[#88998f] transition-transform duration-200 shrink-0 ${
                showProfileMenu ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#15201a] rounded-2xl shadow-2xl border border-[#c2c8c2]/50 dark:border-[#2d3a33] p-2 z-50 animate-in fade-in zoom-in-95 overflow-hidden">
              {/* Profile Card Header */}
              <div className="p-3 bg-[#f6faf7] dark:bg-[#1b2620] rounded-xl mb-1.5 border border-[#eaefeb] dark:border-[#26342c]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#112e20] dark:bg-[#244233] text-white flex items-center justify-center font-bold text-sm shadow-inner ring-2 ring-[#caead5]/60 dark:ring-[#2f4f3e]">
                    {currentUser.initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#112e20] dark:text-white truncate">
                        {currentUser.name}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-[#9b4521] text-white">
                        {currentUser.role}
                      </span>
                    </div>
                    <span className="text-xs text-[#727973] dark:text-[#97a59d] truncate">
                      {currentUser.email}
                    </span>
                    <span className="text-[11px] text-[#9b4521] dark:text-[#ff9266] font-medium truncate mt-0.5">
                      {currentUser.roleTitle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="space-y-1 text-xs">
                {/* Atelier Settings */}
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateToSettings();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#181d1b] dark:text-[#dbe5df] hover:bg-[#eaefeb] dark:hover:bg-[#202e26] transition-colors text-left cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#eaefeb] dark:bg-[#23332a] flex items-center justify-center text-[#112e20] dark:text-[#a0dbb7] group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[17px]">settings</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-[13px] text-[#112e20] dark:text-white">Settings</span>
                    <span className="text-[10px] text-[#727973] dark:text-[#8e9e95]">Outlet rules, hours & notifications</span>
                  </div>
                </button>

                {/* Change Password */}
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenChangePassword();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#181d1b] dark:text-[#dbe5df] hover:bg-[#eaefeb] dark:hover:bg-[#202e26] transition-colors text-left cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#eaefeb] dark:bg-[#23332a] flex items-center justify-center text-[#112e20] dark:text-[#a0dbb7] group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[17px]">lock_reset</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-[13px] text-[#112e20] dark:text-white">Change Password</span>
                    <span className="text-[10px] text-[#727973] dark:text-[#8e9e95]">Update login credentials for {currentUser.name}</span>
                  </div>
                </button>

                <div className="my-1.5 border-t border-[#eaefeb] dark:border-[#243029]"></div>

                {/* Logout */}
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-100/70 dark:bg-rose-950/80 flex items-center justify-center text-rose-600 dark:text-rose-300 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[17px]">logout</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-[13px] text-rose-700 dark:text-rose-300">Log Out</span>
                    <span className="text-[10px] text-rose-600/70 dark:text-rose-400/70">Sign out of {currentUser.name} account</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
