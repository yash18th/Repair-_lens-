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
  PanelLeftClose
} from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange, searchQuery, onSearchChange, mobileOpen, onCloseMobile }) {
  const NAV_ITEMS = [
    { id: 'studio', label: 'Home', icon: Home, badge: null },
    { id: 'phone', label: 'Smartphone & Tablet', icon: Smartphone, badge: null, description: 'Mobile diagnostics' },
    { id: 'electronics', label: 'Electronics & PCB', icon: Monitor, badge: null, description: 'Board diagnostics' },
    { id: 'appliance', label: 'Home Appliance', icon: Plug, badge: null, description: 'Electrical systems' },
    { id: 'profile', label: 'Profile', icon: User, badge: null },
    { id: 'history', label: 'Scan History', icon: History, badge: '3' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const isCategoryItem = (id) => ['phone', 'electronics', 'appliance'].includes(id);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#151922] border-r border-[#2a303a] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
          
          {/* Logo & Close Mobile Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('studio')}>
              <div className="w-9 h-9 rounded-lg bg-[#1d222b] border border-[#2a303a] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-slate-200" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-[15px] tracking-[-0.02em] text-white">
                    RepairLens
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-[0.08em] uppercase">
                  Diagnostic Platform
                </p>
              </div>
            </div>

            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#0f1115] border border-[#2a303a] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#6b7cff]/40 transition-all"
            />
          </div>

          <nav className="space-y-1.5 pt-2">
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
                  className={`w-full text-left transition-all duration-200 group ${
                    categoryItem
                      ? `flex items-center justify-between gap-3 rounded-xl border px-2.5 py-2.5 ${
                          isActive
                            ? 'bg-[#1d222b] border-[#3a4658] text-white'
                            : 'bg-transparent border-transparent text-slate-300 hover:border-[#2a303a] hover:bg-[#1a1f28]'
                        }`
                      : `flex items-center justify-between px-2.5 py-2.5 rounded-lg text-xs font-medium ${
                          isActive
                            ? 'bg-[#1d222b] text-white border border-[#2a303a]'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-[#1a1f28]'
                        }`
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex items-center justify-center rounded-lg border transition-all duration-200 ${
                      categoryItem
                        ? isActive
                          ? 'w-9 h-9 border-[#3a4658] bg-[#212832] text-slate-100'
                          : 'w-9 h-9 border-[#2a303a] bg-[#121821] text-slate-300 group-hover:border-[#3a4658]'
                        : `w-4 h-4 ${
                            isActive ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-200'
                          }`
                    }`}>
                      <Icon className={categoryItem ? 'w-4 h-4' : 'w-4 h-4'} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className={`tracking-[-0.01em] ${categoryItem ? 'text-sm font-medium text-white' : 'text-xs font-medium'}`}>
                        {item.label}
                      </div>
                      {categoryItem && (
                        <div className="mt-0.5 text-[10px] text-slate-400 leading-relaxed">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                      isActive
                        ? 'bg-[#252d39] text-slate-200 border border-[#3a4658]'
                        : 'bg-[#121821] text-slate-400 border border-[#2a303a]'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {categoryItem && !item.badge && (
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isActive ? 'text-slate-200' : 'text-slate-500 group-hover:text-slate-300'
                    } group-hover:translate-x-0.5`} />
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* User Quick Profile Bottom Bar */}
        <div className="p-4 border-t border-[#2a303a] bg-[#111821]">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1a1f28] border border-[#2a303a]">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#212832] border border-[#3a4658] flex items-center justify-center font-semibold text-white text-xs">
                YS
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-medium text-white block truncate">Yashvanth</span>
                <span className="text-[10px] text-slate-400 block truncate">Pro Technician</span>
              </div>
            </div>

            <button 
              onClick={() => onTabChange('profile')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2a303a] transition-colors"
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
