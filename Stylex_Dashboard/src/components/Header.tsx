import React, { useState, useRef, useEffect } from 'react';
import { X_LOGO_URL } from '../mockData';
import { UserAccount } from '../types';

interface HeaderProps {
  onOpenNewBooking: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: UserAccount;
  onNavigateToSettings: () => void;
  onOpenChangePassword: () => void;
  onLogout: () => void;
  unreadCount?: number;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewBooking,
  searchQuery,
  onSearchChange,
  currentUser,
  onNavigateToSettings,
  onOpenChangePassword,
  onLogout,
  unreadCount = 2,
  onRefresh,
  isRefreshing = false,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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
    <header className="fixed top-0 left-72 right-0 h-20 bg-[#f6faf7]/90 dark:bg-[#121c17]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-6 border-b border-[#dfe4e0]/60 dark:border-[#24332a]">
      {/* Left zone: Brand Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <img alt="StyleX X Logo" className="h-8 w-8 object-contain shrink-0" src={X_LOGO_URL} />
          <span className="font-semibold text-base text-[#112e20] dark:text-white">StyleX Admin Portal</span>
        </div>

        <div className="hidden xl:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#f0f5f1] dark:bg-[#192720] text-[#181d1b] dark:text-[#caead5] border border-[#c2c8c2]/40 dark:border-[#2a3c31]">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[13px] font-medium">
            Tirur Outlet • Open
          </span>
        </div>
      </div>

      {/* Right zone: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden lg:flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-[#424844] dark:text-[#88998f] text-[18px]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-72 lg:w-80 pl-10 pr-4 py-2 rounded-full bg-[#f0f5f1] dark:bg-[#192720] text-[#181d1b] dark:text-white placeholder:text-[#424844] dark:placeholder:text-[#7d9085] text-sm outline-none focus:bg-white dark:focus:bg-[#203128] focus:ring-1 focus:ring-[#112e20] dark:focus:ring-[#caead5] border border-transparent focus:border-[#112e20]/20 transition-all shadow-xs"
            placeholder="Search bookings, clients, rituals..."
            type="text"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-[#727973] hover:text-[#181d1b] dark:text-[#88998f] dark:hover:text-white"
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f0f5f1] dark:bg-[#192720] text-[#112e20] dark:text-[#caead5] border border-[#c2c8c2]/50 dark:border-[#2a3c31] text-[13px] font-medium hover:bg-[#e2ebe4] dark:hover:bg-[#22352b] transition-all cursor-pointer shadow-2xs group active:scale-95 disabled:opacity-60"
            title="Refresh live appointments & records from database"
          >
            <span
              className={`material-symbols-outlined text-[19px] text-[#112e20] dark:text-[#7cebb0] ${
                isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'
              }`}
            >
              refresh
            </span>
            <span className="hidden sm:inline font-semibold text-xs">
              {isRefreshing ? 'Syncing...' : 'Refresh'}
            </span>
          </button>
        )}

        {/* New Booking CTA */}
        <button
          onClick={onOpenNewBooking}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9b4521] text-white text-[13px] font-semibold shadow-sm hover:bg-[#752906] transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Booking</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative p-2.5 rounded-full hover:bg-[#eaefeb] dark:hover:bg-[#1f2d25] transition-colors cursor-pointer text-[#181d1b] dark:text-white"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#ff4d15] dark:bg-[#ff7a45] ring-2 ring-white dark:ring-[#121c17] shadow-[0_0_10px_rgba(255,100,50,0.95)] animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#15201a] rounded-xl shadow-xl border border-[#c2c8c2]/50 dark:border-[#2d3a33] p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-[#eaefeb] dark:border-[#243029]">
                <h4 className="font-semibold text-sm text-[#112e20] dark:text-white">Admin Notifications</h4>
                <span className="text-[11px] text-[#ff7a45] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ff7a45]/15 dark:bg-[#ff7a45]/25">
                  2 New
                </span>
              </div>
              <div className="divide-y divide-[#eaefeb] dark:divide-[#243029] text-xs">
                <div className="py-2.5">
                  <p className="font-medium text-[#181d1b] dark:text-white">VIP Bridal Suite Session</p>
                  <p className="text-[#424844] dark:text-[#97a59d] mt-0.5">Pre-bridal consultation scheduled for 2:00 PM</p>
                  <span className="text-[10px] text-[#727973] dark:text-[#7f8f86] mt-1 block">15 min ago</span>
                </div>
                <div className="py-2.5">
                  <p className="font-medium text-[#181d1b] dark:text-white">New VIP Inquiry: Fatima Zahra</p>
                  <p className="text-[#424844] dark:text-[#97a59d] mt-0.5">Bridal suite inquiry for 5 guests</p>
                  <span className="text-[10px] text-[#727973] dark:text-[#7f8f86] mt-1 block">35 min ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-[#e5e9e6] dark:bg-[#25362c]"></div>

        {/* User Profile Trigger & Dropdown Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl text-left hover:bg-[#eaefeb]/70 dark:hover:bg-[#1a2821] transition-all cursor-pointer group"
            title={`${currentUser.name} (${currentUser.roleTitle}) - Account Options`}
            aria-expanded={showProfileMenu}
          >
            <div className="w-9 h-9 rounded-full bg-[#112e20] dark:bg-[#203a2c] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-[#eaefeb] dark:ring-[#2a3c31] relative">
              {currentUser.initials}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#112e20]"></span>
            </div>
            <div className="hidden md:flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-semibold text-[#112e20] dark:text-white leading-tight group-hover:text-[#9b4521] dark:group-hover:text-[#ff9266] transition-colors">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#eaefeb] dark:bg-[#22352a] text-[#112e20] dark:text-[#a0dbb7]">
                  {currentUser.role}
                </span>
              </div>
              <span className="text-[11px] text-[#9b4521] dark:text-[#ff9266] font-medium leading-none mt-0.5">
                {currentUser.roleTitle}
              </span>
            </div>
            <span
              className={`material-symbols-outlined text-[18px] text-[#727973] dark:text-[#88998f] transition-transform duration-200 ${
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
