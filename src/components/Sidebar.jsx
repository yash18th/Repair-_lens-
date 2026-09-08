import React from 'react';
import {
  Home,
  User,
  History,
  Settings,
  Search,
  Wrench,
  ChevronRight,
  X,
  Smartphone,
  Laptop,
  Cpu,
  Plug,
  Car,
  Package,
} from 'lucide-react';

const WORKSPACE_ITEMS = [
  { id: 'studio', label: 'Home', icon: Home },
];

const MODULE_ITEMS = [
  { id: 'phone', label: 'Smartphone & Tablet', icon: Smartphone },
  { id: 'computer', label: 'Computers & Laptops', icon: Laptop },
  { id: 'electronics', label: 'Electronics & PCB', icon: Cpu },
  { id: 'appliance', label: 'Home Appliance', icon: Plug },
  { id: 'vehicles', label: 'Vehicles', icon: Car },
  { id: 'other', label: 'Other', icon: Package },
];

const SYSTEM_ITEMS = [
  { id: 'history', label: 'Scan History', icon: History },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ALL_NAV_ITEMS = [...WORKSPACE_ITEMS, ...MODULE_ITEMS, ...SYSTEM_ITEMS];

export default function Sidebar({ activeTab, onTabChange, searchQuery, onSearchChange, mobileOpen, onCloseMobile }) {
  const normalizedSearch = (searchQuery || '').trim().toLowerCase();

  const renderNavGroup = (items, groupTitle) => {
    const visibleItems = items.filter((item) => {
      if (!normalizedSearch) return true;
      return [item.label, item.id]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));
    });

    if (visibleItems.length === 0) return null;

    return (
      <div className="space-y-1">
        {groupTitle && (
          <div className="px-3 pb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#687382]">
            {groupTitle}
          </div>
        )}
        <div className="space-y-0.5">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onTabChange(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full text-left transition-all duration-150 group relative flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs cursor-pointer ${
                  isActive
                    ? 'border border-[#252D37] bg-[#151B23] text-[#F1F3F5] font-semibold'
                    : 'border border-transparent text-[#9CA6B3] hover:text-[#F1F3F5] hover:bg-[#11161D]'
                }`}
              >
                {/* Active Accent Bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r bg-[#7D91AA]" />
                )}

                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#7D91AA]' : 'text-[#687382] group-hover:text-[#9CA6B3]'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform duration-150 shrink-0 ${
                    isActive
                      ? 'text-[#7D91AA]'
                      : 'text-[#687382] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 border-r border-[#252D37] bg-[#0B0F15] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 font-sans ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#252D37]">
            <div
              className="flex items-center space-x-2.5 cursor-pointer group"
              onClick={() => onTabChange('studio')}
            >
              <div className="w-8 h-8 rounded-lg bg-[#11161D] border border-[#252D37] flex items-center justify-center text-[#F1F3F5]">
                <Wrench className="w-4 h-4 text-[#7D91AA] group-hover:text-[#F1F3F5] transition-colors" />
              </div>
              <div>
                <div className="flex items-baseline space-x-1">
                  <span className="font-bold text-sm tracking-tight text-[#F1F3F5]">
                    RepairLens
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4E9A6E] ml-1" />
                </div>
                <div className="text-[10px] text-[#687382]">
                  Diagnostics Studio
                </div>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-md text-[#9CA6B3] hover:text-[#F1F3F5] hover:bg-white/5 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#687382] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              aria-label="Search diagnostics"
              className="w-full pl-8 pr-7 py-1.5 bg-[#090C11] border border-[#252D37] text-xs text-[#F1F3F5] placeholder:text-[#687382] focus:outline-none focus:border-[#7D91AA] transition-colors rounded-lg"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#687382] hover:text-[#F1F3F5] transition-colors p-0.5 rounded"
                title="Clear search"
                aria-label="Clear search query"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Navigation Sections */}
          <nav className="space-y-4 pt-1">
            {renderNavGroup(WORKSPACE_ITEMS, 'Workspace')}

            <div className="border-t border-[#1C232D]" />

            {renderNavGroup(MODULE_ITEMS, 'Diagnostic Modules')}

            <div className="border-t border-[#1C232D]" />

            {renderNavGroup(SYSTEM_ITEMS, 'System')}
          </nav>
        </div>

        {/* Technician Profile Card in Footer */}
        <div className="p-3.5 border-t border-[#252D37] bg-[#090C11]">
          <div className="flex items-center justify-between p-2.5 bg-[#11161D] border border-[#252D37] rounded-lg">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#151B23] border border-[#252D37] flex items-center justify-center font-bold text-[#F1F3F5] text-[10px] flex-shrink-0">
                YS
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-semibold text-[#F1F3F5] block truncate leading-tight">
                  Yashvanth
                </span>
                <span className="text-[10px] text-[#687382] block truncate">
                  Diagnostic Tech
                </span>
              </div>
            </div>

            <button
              onClick={() => onTabChange('profile')}
              className="p-1 rounded text-[#687382] hover:text-[#F1F3F5] hover:bg-white/5 transition-colors cursor-pointer"
              title="Profile Settings"
              type="button"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
