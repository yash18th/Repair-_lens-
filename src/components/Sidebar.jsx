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

export default function Sidebar({ activeTab, onTabChange, searchQuery, onSearchChange, mobileOpen, onCloseMobile }) {
  const NAV_ITEMS = [
    { id: 'studio', label: 'Studio Overview', icon: Home, categoryLabel: 'WORKSPACE' },
    { id: 'phone', label: 'Smartphone & Tablet', icon: Smartphone, categoryLabel: 'MOBILE DIAGNOSTICS' },
    { id: 'computer', label: 'Computers & Laptops', icon: Laptop, categoryLabel: 'SYSTEM ARCHITECTURE' },
    { id: 'electronics', label: 'Electronics & PCB', icon: Cpu, categoryLabel: 'CIRCUIT ANALYSIS' },
    { id: 'appliance', label: 'Home Appliance', icon: Plug, categoryLabel: 'ELECTROMECHANICAL' },
    { id: 'vehicles', label: 'Vehicles', icon: Car, categoryLabel: 'PANEL & EXTERIOR' },
    { id: 'other', label: 'Other Equipment', icon: Package, categoryLabel: 'VISUAL REPAIR' },
    { id: 'history', label: 'Scan History', icon: History, categoryLabel: 'TELEMETRY ARCHIVE' },
    { id: 'profile', label: 'Profile', icon: User, categoryLabel: 'OPERATOR IDENTITY' },
    { id: 'settings', label: 'Settings', icon: Settings, categoryLabel: 'CONFIGURATION' },
  ];

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (!normalizedSearch) return true;
    return [item.label, item.categoryLabel, item.id]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedSearch));
  });

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-72 border-r border-[#202731] bg-[#090C10] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#181E26]">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onTabChange('studio')}>
              <div className="w-8 h-8 rounded-lg bg-[#141922] border border-[#202731] flex items-center justify-center text-[#F5F7FA] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                <Wrench className="w-3.5 h-3.5 text-[#8294AA] group-hover:text-[#F5F7FA] transition-colors" />
              </div>
              <div>
                <div className="flex items-baseline space-x-1">
                  <span className="font-bold text-xs tracking-tight text-[#F5F7FA]">
                    REPAIR
                  </span>
                  <span className="font-semibold text-[#8294AA] text-[10px] tracking-[0.14em]">
                    LENS
                  </span>
                  <span className="inline-block w-1 h-1 rounded-full bg-[#8294AA] ml-0.5"></span>
                </div>
                <div className="text-[9px] uppercase tracking-[0.12em] text-[#667180] font-mono">
                  DIAGNOSTIC LAB OS
                </div>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-md text-[#A7B0BD] hover:text-[#F5F7FA] hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#667180] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="SEARCH MODULES..."
              aria-label="Search diagnostics and navigation options"
              aria-expanded={Boolean(normalizedSearch)}
              aria-controls="diagnostic-search-options"
              className="w-full pl-8 pr-7 py-2 bg-[#0C1015] border border-[#202731] text-[10px] text-[#F5F7FA] placeholder:text-[#596473] tracking-[0.1em] focus:outline-none focus:border-[#8294AA] transition-colors rounded-lg font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#667180] hover:text-[#F5F7FA] transition-colors p-0.5 rounded"
                title="Clear search"
                aria-label="Clear search query"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            {normalizedSearch && (
              <div
                id="diagnostic-search-options"
                className="absolute left-0 right-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-lg border border-[#202731] bg-[#0C1015] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
              >
                {filteredNavItems.length > 0 ? (
                  filteredNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onTabChange(item.id);
                          onSearchChange('');
                        }}
                        className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-[#141922]"
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0 text-[#8294AA]" />
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-medium text-[#F5F7FA]">{item.label}</span>
                          <span className="mt-0.5 block truncate text-[9px] uppercase tracking-[0.1em] text-[#667180]">
                            {item.categoryLabel}
                          </span>
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3 py-2 text-[10px] uppercase tracking-[0.1em] text-[#667180]">
                    No matching modules
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Section */}
          <div className="space-y-1 pt-1">
            <div className="px-2 pb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#667180]">
              Diagnostic Modules
            </div>

            <nav className="space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full text-left transition-all duration-150 group relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border ${
                      isActive
                        ? 'border-[#202731] bg-[#141922] text-[#F5F7FA] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]'
                        : 'border-transparent text-[#A7B0BD] hover:text-[#F5F7FA] hover:bg-[#10141A] hover:border-[#181E26]'
                    }`}
                  >
                    {/* Active Accent Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-r bg-[#8294AA]" />
                    )}

                    <div className="flex items-center gap-2.5 min-w-0 pl-1">
                      <div className={`flex items-center justify-center rounded-md w-6 h-6 ${
                        isActive
                          ? 'text-[#F5F7FA]'
                          : 'text-[#667180] group-hover:text-[#A7B0BD]'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className={`text-xs font-medium tracking-tight truncate ${isActive ? 'text-[#F5F7FA]' : 'text-[#A7B0BD] group-hover:text-[#F5F7FA]'}`}>
                          {item.label}
                        </div>
                        <div className="text-[9px] text-[#667180] leading-none uppercase tracking-[0.1em] truncate mt-0.5 font-mono">
                          {item.categoryLabel}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`w-3 h-3 transition-transform duration-150 ${
                      isActive ? 'text-[#8294AA]' : 'text-[#667180] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                    }`} />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Technical Details & Status Console */}
        <div className="p-3 border-t border-[#181E26] bg-[#07090C] space-y-2.5">
          {/* Subtle Telemetry Strip */}
          <div className="p-2 rounded-lg bg-[#0C1015] border border-[#181E26] space-y-1 text-[9px] font-mono text-[#667180]">
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-wider">SYSTEM STATUS</span>
              <span className="flex items-center gap-1.5 text-[#4F8A68] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F8A68]" />
                ONLINE
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-wider">MODEL</span>
              <span className="text-[#A7B0BD]">REPAIRLENS AI</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-wider">VERSION</span>
              <span className="text-[#8294AA]">v1.0.4 PRO</span>
            </div>
          </div>

          {/* Technician Profile Card */}
          <div className="flex items-center justify-between p-2 bg-[#0C1015] border border-[#202731] rounded-lg">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-md bg-[#141922] border border-[#202731] flex items-center justify-center font-bold text-[#F5F7FA] text-[10px] flex-shrink-0">
                YS
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-semibold text-[#F5F7FA] block truncate leading-tight">Yashvanth</span>
                <span className="text-[9px] text-[#667180] block truncate uppercase tracking-[0.08em] font-mono">Lead Technician</span>
              </div>
            </div>

            <button
              onClick={() => onTabChange('profile')}
              className="p-1 rounded text-[#667180] hover:text-[#F5F7FA] hover:bg-white/5 transition-colors"
              title="Profile Settings"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
