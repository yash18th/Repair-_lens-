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
  Monitor,
  Plug,
  Car,
  Package,
} from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange, searchQuery, onSearchChange, mobileOpen, onCloseMobile }) {
  const NAV_ITEMS = [
    { id: 'studio', label: 'Home', icon: Home },
    { id: 'phone', label: 'Smartphone & Tablet', icon: Smartphone, description: 'Mobile diagnostics' },
    { id: 'computer', label: 'Computers & Laptops', icon: Monitor, description: 'Computer diagnostics' },
    { id: 'electronics', label: 'Electronics & PCB', icon: Monitor, description: 'Board diagnostics' },
    { id: 'appliance', label: 'Home Appliance', icon: Plug, description: 'Electrical systems' },
    { id: 'vehicles', label: 'Vehicles', icon: Car, description: 'Visible vehicle damage' },
    { id: 'other', label: 'Other', icon: Package, description: 'Other repairable items' },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const isCategoryItem = (id) => ['phone', 'computer', 'electronics', 'appliance', 'vehicles', 'other'].includes(id);
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (!normalizedSearch) return true;
    return [item.label, item.description, item.id]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedSearch));
  });

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        ></div>
      )}

      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-72 border-r border-[#252B33] bg-[#080A0D] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 space-y-5 flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#252B33]">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('studio')}>
              <div className="w-9 h-9 rounded-lg bg-[#151A21] border border-[#252B33] flex items-center justify-center text-[#F2F4F7]">
                <Wrench className="w-4 h-4 text-[#9AA3AF]" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-sm tracking-tight text-[#F2F4F7]">
                    REPAIR
                  </span>
                  <span className="font-semibold text-[#6B7C93] text-[10px] uppercase tracking-[0.2em]">
                    LENS
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-md text-[#9AA3AF] hover:text-[#F2F4F7] hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#66707D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="SEARCH DIAGNOSTICS..."
              aria-label="Search diagnostics and navigation options"
              aria-expanded={Boolean(normalizedSearch)}
              aria-controls="diagnostic-search-options"
              className="w-full pl-8 pr-8 py-2 bg-[#0D1015] border border-[#252B33] text-[10px] text-[#F2F4F7] placeholder:text-[#66707D] uppercase tracking-[0.14em] focus:outline-none focus:border-[#6B7C93] transition-colors rounded-lg"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#66707D] hover:text-[#F2F4F7] transition-colors p-0.5 rounded"
                title="Clear search"
                aria-label="Clear search query"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            {normalizedSearch && (
              <div
                id="diagnostic-search-options"
                className="absolute left-0 right-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-lg border border-[#252B33] bg-[#0D1015] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
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
                        className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-[#151A21]"
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0 text-[#9AA3AF]" />
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-medium text-[#F2F4F7]">{item.label}</span>
                          {item.description && (
                            <span className="mt-0.5 block truncate text-[9px] uppercase tracking-[0.06em] text-[#66707D]">
                              {item.description}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3 py-2 text-[10px] uppercase tracking-[0.1em] text-[#66707D]">
                    No matching options
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 pt-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const categoryItem = isCategoryItem(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full text-left transition-colors duration-150 group ${
                    categoryItem
                      ? `flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 ${
                          isActive
                            ? 'border-[#252B33] bg-[#151A21] text-[#F2F4F7]'
                            : 'border-transparent text-[#9AA3AF] hover:text-[#F2F4F7] hover:bg-[#11151B]'
                        }`
                      : `flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-medium tracking-[0.08em] uppercase ${
                          isActive
                            ? 'border border-[#252B33] bg-[#151A21] text-[#F2F4F7]'
                            : 'text-[#9AA3AF] hover:text-[#F2F4F7] hover:bg-[#11151B]'
                        }`
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`flex items-center justify-center rounded-md ${
                      categoryItem
                        ? isActive
                          ? 'w-7 h-7 border border-[#363E4A] bg-[#0D1015] text-[#F2F4F7]'
                          : 'w-7 h-7 border border-[#252B33] bg-[#0D1015] text-[#66707D] group-hover:text-[#9AA3AF]'
                        : `w-4 h-4 ${isActive ? 'text-[#F2F4F7]' : 'text-[#66707D] group-hover:text-[#9AA3AF]'}`
                    }`}>
                      <Icon className={categoryItem ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5'} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className={`text-xs font-medium tracking-tight ${isActive ? 'text-[#F2F4F7]' : 'text-[#9AA3AF] group-hover:text-[#F2F4F7]'}`}>
                        {item.label}
                      </div>
                      {categoryItem && item.description && (
                        <div className="text-[9px] text-[#66707D] leading-tight uppercase tracking-[0.04em] truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {isActive ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6B7C93] flex-shrink-0" />
                  ) : categoryItem ? (
                    <ChevronRight className="w-3 h-3 text-[#66707D] group-hover:text-[#9AA3AF] transition-transform duration-150 group-hover:translate-x-0.5" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Technician profile footer */}
        <div className="p-3 border-t border-[#252B33] bg-[#080A0D]">
          <div className="flex items-center justify-between p-2 bg-[#0D1015] border border-[#252B33] rounded-lg">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-md bg-[#151A21] border border-[#252B33] flex items-center justify-center font-medium text-[#F2F4F7] text-[11px] flex-shrink-0">
                YS
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-medium text-[#F2F4F7] block truncate">Yashvanth</span>
                <span className="text-[9px] text-[#66707D] block truncate uppercase tracking-[0.08em]">Pro Technician</span>
              </div>
            </div>

            <button
              onClick={() => onTabChange('profile')}
              className="p-1 rounded text-[#66707D] hover:text-[#F2F4F7] hover:bg-white/5 transition-colors"
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
