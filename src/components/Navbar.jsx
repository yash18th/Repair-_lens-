import React from 'react';
import { Menu, Bell, RotateCcw, Sparkles, Plus } from 'lucide-react';

export default function Navbar({ activeTab, onReset, currentView, onToggleMobileSidebar }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'history':
        return 'Scan History & Blueprints';
      case 'profile':
        return 'User Account Profile';
      case 'category-access':
        return 'Category Access';
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
              <h2 className="text-base font-black text-white flex items-center space-x-2">
                <span>{getTabTitle()}</span>
              </h2>
            </div>
          </div>

          {/* Right Action Icons & Status */}
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-1.5 animate-ping"></span>
              SaaS Demo V1
            </span>

            {/* Quick Action Button */}
            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center space-x-1 shadow-md shadow-purple-600/20"
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
