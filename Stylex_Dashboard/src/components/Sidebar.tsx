import React from 'react';
import { NavTab } from '../types';
import { LOGO_URL } from '../constants';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  todayAppointmentsCount: number;
  unreadConciergeCount: number;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  isDeveloper?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  todayAppointmentsCount,
  unreadConciergeCount,
  onLogout,
  isOpen = false,
  onClose,
  isDeveloper = false,
}) => {
  const navItems: { id: NavTab; label: string; icon: string; badge?: string; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'grid_view' },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: 'book_online',
      badge: `${todayAppointmentsCount} Today`,
      badgeColor: 'bg-[#9b4521] text-white',
    },
    { id: 'schedule-control', label: 'Schedule Control', icon: 'calendar_month' },
    { id: 'artisans-and-stylists', label: 'Stylists', icon: 'content_cut' },
    { id: 'service-menu', label: 'Service Menu', icon: 'spa' },
    { id: 'promotions', label: 'Promotions', icon: 'auto_awesome' },
    { id: 'clients-and-vip', label: 'Clients', icon: 'group' },
    {
      id: 'concierge-desk',
      label: 'Concierge Desk',
      icon: 'mark_chat_unread',
      badge: unreadConciergeCount > 0 ? String(unreadConciergeCount) : undefined,
      badgeColor: 'bg-[#735c00] text-white',
    },
    { id: 'atelier-settings', label: 'Admin Settings', icon: 'tune' },
    ...(isDeveloper
      ? [
          {
            id: 'site-analytics' as NavTab,
            label: 'Site Analytics',
            icon: 'monitoring',
            badge: 'DEV',
            badgeColor: 'bg-emerald-600/90 text-white',
          },
          {
            id: 'developer-settings' as NavTab,
            label: 'Developer Settings',
            icon: 'terminal',
            badge: 'DEV',
            badgeColor: 'bg-amber-600 text-white',
          },
        ]
      : []),
  ];

  const handleSelectTab = (tabId: NavTab) => {
    onTabChange(tabId);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    onLogout();
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-72 max-w-[85vw] lg:w-56 xl:w-60 2xl:w-72 bg-[#112e20] text-white z-50 flex flex-col justify-between shadow-[0_4px_24px_rgba(17,46,32,0.25)] transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Sidebar Navigation"
      >
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="h-16 xl:h-20 px-3.5 xl:px-6 flex items-center justify-between bg-[#112e20] border-b border-[#284435]/50">
            <img
              alt="StyleX Signature Salon"
              className="h-7 sm:h-8 xl:h-10 w-auto max-w-[155px] xl:max-w-[210px] object-contain"
              src={LOGO_URL}
            />
            {/* Mobile Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-2 text-[#aeceba] hover:text-white rounded-xl hover:bg-[#284435] transition-colors"
                aria-label="Close navigation"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            )}
          </div>

          {/* Navigation Core */}
          <div className="px-2 xl:px-3.5 py-2.5 xl:py-4 overflow-y-auto max-h-[calc(100vh-150px)]">
            <div className="px-2.5 py-0.5 mb-1.5 flex items-center justify-between text-[#aeceba] text-[10px] xl:text-[11px] uppercase tracking-wider font-bold">
              <span>Management Core</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#9b4521]"></span>
            </div>

            <nav className="flex flex-col gap-0.5 xl:gap-1">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 xl:px-3.5 py-2 xl:py-2.5 rounded-lg transition-colors text-left font-semibold border-l-2 cursor-pointer ${
                      isActive
                        ? 'bg-[#284435] text-white border-[#9b4521]'
                        : 'text-[#aeceba] hover:bg-[#284435]/70 hover:text-white border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 xl:gap-3 min-w-0">
                      <span className="material-symbols-outlined text-[19px] xl:text-[20px] shrink-0">{item.icon}</span>
                      <span className="text-[12.5px] xl:text-[14px] leading-snug truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-1.5 xl:px-2 py-0.2 xl:py-0.5 rounded-full text-[9.5px] xl:text-[11px] font-bold tracking-wider uppercase shrink-0 ${
                          item.badgeColor || 'bg-[#9b4521] text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-2.5 xl:p-4 bg-[#284435]/30 border-t border-[#284435]/50">
          <div className="flex items-center justify-between px-2.5 py-1.5 xl:px-3 xl:py-2 mb-1.5 xl:mb-2 rounded-lg bg-[#284435]/60">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ffb59a] animate-pulse"></span>
              <span className="text-[10px] xl:text-[11px] text-[#caead5] uppercase tracking-wider font-bold">
                Live Sync Active
              </span>
            </div>
            <span className="material-symbols-outlined text-[#aeceba] text-[15px] xl:text-[16px]">cloud_done</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 xl:gap-3 px-2.5 py-1.5 xl:px-3 xl:py-2 text-[#aeceba] hover:text-white transition-colors text-xs xl:text-sm rounded-lg hover:bg-[#284435]/40 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px] xl:text-[18px]">logout</span>
            <span className="text-[12.5px] xl:text-[14px]">Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
