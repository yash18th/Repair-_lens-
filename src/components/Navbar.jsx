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
    <header className="sticky top-0 z-30 border-b border-[var(--border-soft)] bg-[rgba(245,241,232,0.9)] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-1">RepairLens</p>
              <h2 className="text-base font-medium tracking-[-0.02em] text-[var(--text-primary)] flex items-center space-x-2">
                <span>{getTabTitle()}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-secondary)] border border-[var(--border-soft)] bg-[var(--bg-surface)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mr-1.5"></span>
              Service Desk
            </span>

            <button
              onClick={onReset}
              className="premium-button-secondary flex items-center space-x-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Diagnosis</span>
            </button>

            <button
              className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--accent)]"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
