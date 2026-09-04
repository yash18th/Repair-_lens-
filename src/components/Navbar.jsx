import React from 'react';
import { Menu, Bell, RotateCcw, Sparkles, Plus } from 'lucide-react';

export default function Navbar({ activeTab, onReset, currentView, onToggleMobileSidebar }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'history':
        return 'Scan History & Blueprints';
      case 'profile':
        return 'User Account Profile';
      case 'phone':
        return 'Smartphone & Tablet Studio';
      case 'electronics':
        return 'Electronics & PCB Studio';
      case 'appliance':
        return 'Home Appliance Studio';
      case 'settings':
        return 'Platform Settings';
      case 'studio':
      default:
        return 'AI Diagnosis Studio';
    }
  };

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Mobile Sidebar Toggle & Page Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-base font-semibold tracking-[-0.02em] text-white flex items-center space-x-2">
                <span>{getTabTitle()}</span>
              </h2>
            </div>
          </div>

          {/* Right Action Icons & Status */}
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#1a1f28] text-slate-300 border border-[#2a303a]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6b7cff] mr-1.5"></span>
              Service Desk
            </span>

            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1a1f28] hover:bg-[#212832] text-slate-100 transition-colors flex items-center space-x-1 border border-[#2a303a]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Diagnosis</span>
            </button>

            {/* Notification Bell */}
            <button 
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500"></span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
