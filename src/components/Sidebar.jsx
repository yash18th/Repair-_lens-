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
} from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange, searchQuery, onSearchChange, mobileOpen, onCloseMobile }) {
  const NAV_ITEMS = [
    { id: 'studio', label: 'Home', icon: Home },
    { id: 'phone', label: 'Smartphone & Tablet', icon: Smartphone, description: 'Mobile diagnostics' },
    { id: 'electronics', label: 'Electronics & PCB', icon: Monitor, description: 'Board diagnostics' },
    { id: 'appliance', label: 'Home Appliance', icon: Plug, description: 'Electrical systems' },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const isCategoryItem = (id) => ['phone', 'electronics', 'appliance'].includes(id);

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/55 z-40 lg:hidden"
        ></div>
      )}

      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-72 border-r border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(10,15,26,0.98),rgba(8,11,22,0.98))] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 shadow-[0_0_0_1px_rgba(148,163,184,0.08)] ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-soft)]">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('studio')}>
              <div className="w-11 h-11 rounded-xl bg-[linear-gradient(135deg,rgba(79,70,229,0.24),rgba(124,58,237,0.18))] border border-[rgba(99,102,241,0.42)] flex items-center justify-center shadow-[0_0_24px_rgba(79,70,229,0.15)]">
                <Wrench className="w-4 h-4 text-[#e7ebff]" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-semibold text-[15px] tracking-[-0.04em] text-[var(--text-primary)]">
                    REPAIR
                  </span>
                  <span className="font-medium text-[var(--text-secondary)] text-[10px] uppercase tracking-[0.28em]">
                    LENS
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="SEARCH DIAGNOSTICS..."
              className="w-full pl-9 pr-4 py-2.5 bg-[rgba(15,23,42,0.8)] border border-[var(--border-soft)] text-[10px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] uppercase tracking-[0.16em] focus:outline-none focus:border-[rgba(99,102,241,0.5)] transition-all rounded-lg"
            />
          </div>

          <nav className="space-y-2.5 pt-2">
            {NAV_ITEMS.map((item) => {
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
                  className={`w-full text-left transition-all duration-180 group ${
                    categoryItem
                      ? `flex items-center justify-between gap-3 rounded-xl border px-3 py-3 ${
                          isActive
                            ? 'border-[rgba(99,102,241,0.5)] bg-[linear-gradient(135deg,rgba(79,70,229,0.16),rgba(124,58,237,0.08))] text-[var(--text-primary)]'
                            : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--border-soft)] hover:bg-white/[0.02]'
                        }`
                      : `flex items-center justify-between px-3 py-2.5 rounded-xl text-[11px] font-medium uppercase tracking-[0.14em] ${
                          isActive
                            ? 'text-[var(--text-primary)] nav-item-active'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.02]'
                        }`
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex items-center justify-center rounded-lg border ${
                      categoryItem
                        ? isActive
                          ? 'w-9 h-9 border-[rgba(99,102,241,0.5)] bg-[rgba(15,23,42,0.8)] text-[var(--text-primary)]'
                          : 'w-9 h-9 border-[var(--border-soft)] bg-[rgba(15,23,42,0.75)] text-[var(--text-secondary)] group-hover:border-[rgba(99,102,241,0.4)]'
                        : `w-4 h-4 ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'} `
                    }`}>
                      <Icon className={categoryItem ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className={`tracking-[-0.01em] ${categoryItem ? 'text-sm font-medium text-[var(--text-primary)]' : ''}`}>
                        {item.label}
                      </div>
                      {categoryItem && item.description && (
                        <div className="mt-0.5 text-[10px] text-[var(--text-secondary)] leading-relaxed uppercase tracking-[0.08em]">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {categoryItem && (
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-180 ${
                      isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                    } group-hover:translate-x-0.5`} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[var(--border-soft)] bg-[rgba(10,15,26,0.9)]">
          <div className="flex items-center justify-between p-2.5 bg-[rgba(15,23,42,0.8)] border border-[var(--border-soft)] rounded-xl">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-[linear-gradient(135deg,rgba(34,211,238,0.24),rgba(99,102,241,0.24))] border border-[rgba(99,102,241,0.4)] flex items-center justify-center font-semibold text-[var(--text-primary)] text-[10px]">
                YS
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-medium text-[var(--text-primary)] block truncate">Yashvanth</span>
                <span className="text-[10px] text-[var(--text-secondary)] block truncate uppercase tracking-[0.12em]">Pro Technician</span>
              </div>
            </div>

            <button
              onClick={() => onTabChange('profile')}
              className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
              title="Profile Settings"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
