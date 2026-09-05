import React from 'react';
import { Menu, Bell, Plus } from 'lucide-react';

export default function Navbar({ activeTab, onReset, currentView, onToggleMobileSidebar }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'history':
        return 'Scan History';
      case 'profile':
        return 'Profile';
      case 'phone':
        return 'Smartphone & Tablet';
      case 'electronics':
        return 'Electronics & PCB';
      case 'appliance':
        return 'Home Appliance';
      case 'settings':
        return 'Settings';
      case 'studio':
      default:
        return 'Diagnostic Workspace';
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-soft)] bg-[rgba(7,11,22,0.7)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors border border-[var(--border-soft)]"
              aria-label="Open Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1">RepairLens</p>
              <h2 className="text-base font-semibold tracking-[-0.03em] text-[var(--text-primary)] flex items-center space-x-2">
                <span>{getTabTitle()}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[var(--text-secondary)] border border-[var(--border-soft)] bg-[rgba(15,23,42,0.8)] rounded-full">
              <span className="w-2 h-2 rounded-full bg-[radial-gradient(circle,#22d3ee,#4f46e5)]"></span>
              Service Desk
            </span>

            <button
              onClick={onReset}
              className="premium-button flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Diagnosis</span>
            </button>

            <button
              className="p-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors relative border border-[var(--border-soft)] bg-[rgba(15,23,42,0.7)]"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[linear-gradient(135deg,#22d3ee,#8b5cf6)]"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
