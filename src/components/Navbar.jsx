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
        return 'Telemetry Archive';
      case 'profile':
        return 'Operator Credentials';
      case 'phone':
        return 'Mobile Diagnostics';
      case 'computer':
        return 'System Architecture';
      case 'electronics':
        return 'Circuit & PCB Analysis';
      case 'appliance':
        return 'Electromechanical';
      case 'vehicles':
        return 'Visible Vehicle Damage';
      case 'other':
        return 'Other Repairable Items';
      case 'settings':
        return 'System Preferences';
      case 'studio':
      default:
        return 'Diagnostic Workspace';
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#232B36] bg-[#0B0F15]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13 gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-1.5 rounded-md text-[#A7B0BC] hover:text-[#F4F6F8] hover:bg-[#121720] transition-colors border border-[#232B36]"
              aria-label="Open Sidebar"
              type="button"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center min-w-0 overflow-hidden font-mono text-xs">
              <span className="hidden sm:inline-block text-[#687382] text-[10px] tracking-[0.14em] uppercase mr-2 truncate">
                RL-OS //
              </span>
              <h2 className="text-xs sm:text-sm font-semibold tracking-tight text-[#F4F6F8] truncate font-sans">
                {getTabTitle()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Service Desk status indicator */}
            <span className="inline-flex items-center gap-2 px-2.5 py-1 text-[10px] uppercase font-mono tracking-[0.12em] text-[#A7B0BC] border border-[#232B36] bg-[#080B10] rounded-md whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#55A477] animate-pulse" />
              Service Desk
            </span>

            {/* Compact Professional New Diagnosis button */}
            <button
              onClick={onNewDiagnosis}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#2E3845] bg-[#161C25] hover:bg-[#1C2430] hover:border-[#7D91AA]/50 px-2.5 sm:px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#F4F6F8] transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] whitespace-nowrap cursor-pointer"
              type="button"
            >
              <Plus className="w-3.5 h-3.5 text-[#7D91AA]" />
              <span>New Diagnosis</span>
            </button>

            {/* Profile Button */}
            <button
              onClick={isAuthenticated ? onOpenProfile : onSignIn}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#232B36] bg-[#080B10] hover:bg-[#121720] hover:border-[#2E3845] px-2.5 sm:px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#A7B0BC] hover:text-[#F4F6F8] transition-colors whitespace-nowrap cursor-pointer"
            >
              <UserRound className="w-3.5 h-3.5 text-[#687382]" />
              <span>{isAuthenticated ? 'Profile' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
