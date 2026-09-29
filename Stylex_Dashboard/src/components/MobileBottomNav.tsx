import React from 'react';
import { NavTab } from '../types';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  todayAppointmentsCount: number;
  unreadConciergeCount: number;
  onOpenNewBooking: () => void;
  onToggleMenu: () => void;
  isMenuOpen: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  todayAppointmentsCount,
  unreadConciergeCount,
  onOpenNewBooking,
  onToggleMenu,
  isMenuOpen,
}) => {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#121c17]/95 backdrop-blur-xl border-t border-[#dfe4e0]/80 dark:border-[#24332a] px-2 pt-1.5 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] select-none"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Overview */}
        <button
          type="button"
          onClick={() => onTabChange('overview')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all active:scale-95 cursor-pointer relative ${
            currentTab === 'overview' && !isMenuOpen
              ? 'text-[#9b4521] dark:text-[#ff9266]'
              : 'text-[#5f6863] dark:text-[#8d9e94] hover:text-[#112e20] dark:hover:text-white'
          }`}
          title="Overview"
        >
          <div className="relative">
            <span
              className={`material-symbols-outlined text-[24px] ${
                currentTab === 'overview' && !isMenuOpen ? 'font-variation-settings-fill' : ''
              }`}
            >
              grid_view
            </span>
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Overview</span>
          {currentTab === 'overview' && !isMenuOpen && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#9b4521] dark:bg-[#ff9266] mt-0.5"></span>
          )}
        </button>

        {/* 2. Appointments */}
        <button
          type="button"
          onClick={() => onTabChange('appointments')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all active:scale-95 cursor-pointer relative ${
            currentTab === 'appointments' && !isMenuOpen
              ? 'text-[#9b4521] dark:text-[#ff9266]'
              : 'text-[#5f6863] dark:text-[#8d9e94] hover:text-[#112e20] dark:hover:text-white'
          }`}
          title="Appointments"
        >
          <div className="relative">
            <span
              className={`material-symbols-outlined text-[24px] ${
                currentTab === 'appointments' && !isMenuOpen ? 'font-variation-settings-fill' : ''
              }`}
            >
              book_online
            </span>
            {todayAppointmentsCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#9b4521] text-white ring-2 ring-white dark:ring-[#121c17] shadow-xs">
                {todayAppointmentsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Bookings</span>
          {currentTab === 'appointments' && !isMenuOpen && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#9b4521] dark:bg-[#ff9266] mt-0.5"></span>
          )}
        </button>

        {/* 3. Center Elevated + Booking Action */}
        <div className="flex flex-col items-center justify-center px-1 -mt-4">
          <button
            type="button"
            onClick={onOpenNewBooking}
            className="w-13 h-13 rounded-full bg-[#9b4521] hover:bg-[#752906] text-white flex items-center justify-center shadow-lg shadow-[#9b4521]/35 active:scale-90 transition-all cursor-pointer ring-4 ring-white dark:ring-[#121c17]"
            title="Create New Booking"
            aria-label="Create New Booking"
          >
            <span className="material-symbols-outlined text-[26px]">add</span>
          </button>
          <span className="text-[10px] font-bold text-[#9b4521] dark:text-[#ff9266] tracking-tight mt-0.5">
            + Book
          </span>
        </div>

        {/* 4. Concierge */}
        <button
          type="button"
          onClick={() => onTabChange('concierge-desk')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all active:scale-95 cursor-pointer relative ${
            currentTab === 'concierge-desk' && !isMenuOpen
              ? 'text-[#9b4521] dark:text-[#ff9266]'
              : 'text-[#5f6863] dark:text-[#8d9e94] hover:text-[#112e20] dark:hover:text-white'
          }`}
          title="Concierge Desk"
        >
          <div className="relative">
            <span
              className={`material-symbols-outlined text-[24px] ${
                currentTab === 'concierge-desk' && !isMenuOpen ? 'font-variation-settings-fill' : ''
              }`}
            >
              mark_chat_unread
            </span>
            {unreadConciergeCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#735c00] text-white ring-2 ring-white dark:ring-[#121c17] shadow-xs animate-pulse">
                {unreadConciergeCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Concierge</span>
          {currentTab === 'concierge-desk' && !isMenuOpen && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#9b4521] dark:bg-[#ff9266] mt-0.5"></span>
          )}
        </button>

        {/* 5. Menu Drawer Toggle */}
        <button
          type="button"
          onClick={onToggleMenu}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all active:scale-95 cursor-pointer relative ${
            isMenuOpen
              ? 'text-[#9b4521] dark:text-[#ff9266]'
              : 'text-[#5f6863] dark:text-[#8d9e94] hover:text-[#112e20] dark:hover:text-white'
          }`}
          title="More Sections"
        >
          <div className="relative">
            <span
              className={`material-symbols-outlined text-[24px] ${
                isMenuOpen ? 'font-variation-settings-fill' : ''
              }`}
            >
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">
            {isMenuOpen ? 'Close' : 'Menu'}
          </span>
          {isMenuOpen && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#9b4521] dark:bg-[#ff9266] mt-0.5"></span>
          )}
        </button>
      </div>
    </nav>
  );
};
