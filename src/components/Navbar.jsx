import React from 'react';
import { Menu, Plus, UserRound } from 'lucide-react';

export default function Navbar({
  activeTab,
  isAuthenticated,
  onToggleMobileSidebar,
  onNewDiagnosis,
  onSignIn,
  onOpenProfile,
}) {
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
        <div className="flex items-center justify-between h-16 gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors border border-[var(--border-soft)]"
              aria-label="Open Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1">RepairLens</p>
              <h2 className="text-base font-semibold tracking-[-0.03em] text-[var(--text-primary)] flex items-center space-x-2 truncate">
                <span>{getTabTitle()}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <span className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[var(--text-secondary)] border border-[var(--border-soft)] bg-[rgba(15,23,42,0.8)] rounded-full whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-[radial-gradient(circle,#22d3ee,#4f46e5)]"></span>
              Service Desk
            </span>

            <button
              onClick={onNewDiagnosis}
              className="premium-button inline-flex items-center gap-2 whitespace-nowrap"
              type="button"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Diagnosis</span>
            </button>

            <button
              onClick={isAuthenticated ? onOpenProfile : onSignIn}
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-soft)] bg-[rgba(15,23,42,0.7)] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-primary)] transition-colors hover:border-[rgba(99,102,241,0.4)] hover:bg-[rgba(99,102,241,0.08)] whitespace-nowrap"
            >
              <UserRound className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? 'Profile' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
