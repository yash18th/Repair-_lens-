import React from 'react';
import { 
  Home, 
  User, 
  History, 
  BookOpen, 
  Settings, 
  Search, 
  Wrench, 
  Sparkles, 
  ChevronRight,
  Shield,
  Layers,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange, searchQuery, onSearchChange, mobileOpen, onCloseMobile }) {
  const NAV_ITEMS = [
    { id: 'studio', label: 'Home / Studio', icon: Home, badge: null },
    { id: 'profile', label: 'Profile', icon: User, badge: null },
    { id: 'history', label: 'Scan History', icon: History, badge: '3' },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen, badge: 'New' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

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
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
          
          {/* Logo & Close Mobile Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('studio')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
                <Wrench className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-extrabold text-lg tracking-tight text-white">
                    Repair<span className="text-purple-400">Lens</span>
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                  AI Diagnosis Dashboard
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

          {/* Search Bar Input (Matching Reference Screenshot) */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/60 transition-all"
            />
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 pt-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-md shadow-purple-600/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-purple-500/30 text-purple-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* User Quick Profile Bottom Bar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white text-xs shadow">
                YS
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-white block truncate">Yashvanth</span>
                <span className="text-[10px] text-purple-400 block truncate font-medium">Pro Technician</span>
              </div>
            </div>

            <button 
              onClick={() => onTabChange('profile')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
