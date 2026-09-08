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
  { id: 'studio', label: 'Home', icon: Home, categoryLabel: 'WORKSPACE OVERVIEW' },
];

const MODULE_ITEMS = [
  { id: 'phone', label: 'Smartphone & Tablet', icon: Smartphone, categoryLabel: 'MOBILE DIAGNOSTICS' },
  { id: 'computer', label: 'Computers & Laptops', icon: Laptop, categoryLabel: 'COMPUTER DIAGNOSTICS' },
  { id: 'electronics', label: 'Electronics & PCB', icon: Cpu, categoryLabel: 'BOARD DIAGNOSTICS' },
  { id: 'appliance', label: 'Home Appliance', icon: Plug, categoryLabel: 'ELECTRICAL SYSTEMS' },
  { id: 'vehicles', label: 'Vehicles', icon: Car, categoryLabel: 'VISIBLE VEHICLE DAMAGE' },
  { id: 'other', label: 'Other', icon: Package, categoryLabel: 'OTHER REPAIRABLE ITEMS' },
];

const SYSTEM_ITEMS = [
  { id: 'history', label: 'Scan History', icon: History, categoryLabel: 'TELEMETRY ARCHIVE' },
  { id: 'profile', label: 'Profile', icon: User, categoryLabel: 'OPERATOR CREDENTIALS' },
  { id: 'settings', label: 'Settings', icon: Settings, categoryLabel: 'CONFIGURATION' },
];

const ALL_NAV_ITEMS = [...WORKSPACE_ITEMS, ...MODULE_ITEMS, ...SYSTEM_ITEMS];

export default function Sidebar({ activeTab, onTabChange, searchQuery, onSearchChange, mobileOpen, onCloseMobile }) {
  const normalizedSearch = (searchQuery || '').trim().toLowerCase();

  const filteredNavItems = ALL_NAV_ITEMS.filter((item) => {
    if (!normalizedSearch) return true;
    return [item.label, item.categoryLabel, item.id]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedSearch));
  });

  const renderNavGroup = (items, groupTitle) => {
    const visibleItems = items.filter((item) => {
      if (!normalizedSearch) return true;
      return [item.label, item.categoryLabel, item.id]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));
    });

    if (visibleItems.length === 0) return null;

    return (
      <div className="space-y-1">
        {groupTitle && (
          <div className="px-2.5 pb-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#687382] font-mono">
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
                className={`w-full text-left transition-all duration-150 group relative flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg border ${
                  isActive
                    ? 'border-[#232B36] bg-[#161C25] text-[#F4F6F8] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]'
                    : 'border-transparent text-[#A7B0BC] hover:text-[#F4F6F8] hover:bg-[#121720] hover:border-[#232B36]'
                }`}
              >
                {/* Active Accent Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[2.5px] rounded-r bg-[#7D91AA]" />
                )}

                <div className="flex items-center gap-2.5 min-w-0 pl-1">
                  <div
                    className={`flex items-center justify-center rounded w-5 h-5 shrink-0 transition-colors ${
                      isActive
                        ? 'text-[#F4F6F8]'
                        : 'text-[#687382] group-hover:text-[#A7B0BC]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-xs font-medium tracking-tight truncate ${
                        isActive ? 'text-[#F4F6F8]' : 'text-[#A7B0BC] group-hover:text-[#F4F6F8]'
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-[8.5px] text-[#687382] leading-none uppercase tracking-[0.1em] truncate mt-0.5 font-mono">
                      {item.categoryLabel}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className={`w-3 h-3 transition-transform duration-150 shrink-0 ${
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
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 border-r border-[#232B36] bg-[#0B0F15] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 font-sans ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-3.5 space-y-3.5 flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#19202A]">
            <div
              className="flex items-center space-x-2.5 cursor-pointer group"
              onClick={() => onTabChange('studio')}
            >
              <div className="w-7 h-7 rounded-lg bg-[#121720] border border-[#232B36] flex items-center justify-center text-[#F4F6F8] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                <Wrench className="w-3.5 h-3.5 text-[#7D91AA] group-hover:text-[#F4F6F8] transition-colors" />
              </div>
              <div>
                <div className="flex items-baseline space-x-1">
                  <span className="font-bold text-xs tracking-tight text-[#F4F6F8]">
                    REPAIR
                  </span>
                  <span className="font-semibold text-[#7D91AA] text-[10px] tracking-[0.14em]">
                    LENS
                  </span>
                  <span className="inline-block w-1 h-1 rounded-full bg-[#55A477] ml-0.5" />
                </div>
                <div className="text-[8.5px] uppercase tracking-[0.14em] text-[#687382] font-mono">
                  DIAGNOSTIC LAB OS
                </div>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-md text-[#A7B0BC] hover:text-[#F4F6F8] hover:bg-white/5 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#687382] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="SEARCH DIAGNOSTICS..."
              aria-label="Search diagnostics"
              className="w-full pl-8 pr-7 py-1.5 bg-[#080B10] border border-[#232B36] text-[10px] text-[#F4F6F8] placeholder:text-[#596473] tracking-[0.08em] focus:outline-none focus:border-[#7D91AA] transition-colors rounded-lg font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#687382] hover:text-[#F4F6F8] transition-colors p-0.5 rounded"
                title="Clear search"
                aria-label="Clear search query"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Navigation Sections */}
          <nav className="space-y-4 pt-1">
            {renderNavGroup(WORKSPACE_ITEMS, 'WORKSPACE')}

            <div className="border-t border-[#19202A] pt-2" />

            {renderNavGroup(MODULE_ITEMS, 'DIAGNOSTIC MODULES')}

            <div className="border-t border-[#19202A] pt-2" />

            {renderNavGroup(SYSTEM_ITEMS, 'SYSTEM')}
          </nav>
        </div>

        {/* Technical Details & Operator Console Footer */}
        <div className="p-3 border-t border-[#19202A] bg-[#080B10] space-y-2 font-mono">
          {/* Subtle Telemetry Strip */}
          <div className="p-2 rounded-lg bg-[#0D1118] border border-[#19202A] space-y-1 text-[8.5px] text-[#687382]">
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-wider">DIAGNOSTIC ENGINE</span>
              <span className="flex items-center gap-1.5 text-[#55A477] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#55A477] animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-wider">TELEMETRY</span>
              <span className="text-[#A7B0BC]">MULTI-ANGLE FUSION</span>
            </div>
          </div>

          {/* Technician Profile Card */}
          <div className="flex items-center justify-between p-2 bg-[#0D1118] border border-[#232B36] rounded-lg">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-6 h-6 rounded bg-[#161C25] border border-[#232B36] flex items-center justify-center font-bold text-[#F4F6F8] text-[9px] flex-shrink-0">
                YS
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-semibold text-[#F4F6F8] block truncate leading-tight font-sans">
                  Yashvanth
                </span>
                <span className="text-[8px] text-[#687382] block truncate uppercase tracking-[0.08em]">
                  Lead Diagnostic Tech
                </span>
              </div>
            </div>

            <button
              onClick={() => onTabChange('profile')}
              className="p-1 rounded text-[#687382] hover:text-[#F4F6F8] hover:bg-white/5 transition-colors cursor-pointer"
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
