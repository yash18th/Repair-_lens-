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
        return 'Telemetry History';
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
        return 'Panel & Exterior';
      case 'other':
        return 'Visual Inspection';
      case 'settings':
        return 'System Preferences';
      case 'studio':
      default:
        return 'Diagnostic Workspace';
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#202731] bg-[#090C10]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-1.5 rounded-md text-[#A7B0BD] hover:text-[#F5F7FA] hover:bg-[#141922] transition-colors border border-[#202731]"
              aria-label="Open Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center min-w-0 overflow-hidden font-mono text-xs">
              <span className="hidden sm:inline-block text-[#667180] text-[10px] tracking-[0.14em] uppercase mr-2 truncate">
                RL-OS //
              </span>
              <h2 className="text-xs sm:text-sm font-semibold tracking-tight text-[#F5F7FA] truncate">
                {getTabTitle()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Service Desk status indicator */}
            <span className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 text-[10px] uppercase font-mono tracking-[0.12em] text-[#A7B0BD] border border-[#202731] bg-[#0C1015] rounded-md whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F8A68]"></span>
              Service Desk
            </span>

            {/* Compact Professional New Diagnosis button */}
            <button
              onClick={onNewDiagnosis}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#283240] bg-[#141922] hover:bg-[#1A222E] hover:border-[#384556] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#F5F7FA] transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] whitespace-nowrap cursor-pointer"
              type="button"
            >
              <Plus className="w-3.5 h-3.5 text-[#8294AA]" />
              <span>New Diagnosis</span>
            </button>

            <button
              onClick={isAuthenticated ? onOpenProfile : onSignIn}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#202731] bg-[#0C1015] hover:bg-[#141922] hover:border-[#283240] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#A7B0BD] hover:text-[#F5F7FA] transition-colors whitespace-nowrap cursor-pointer"
            >
              <UserRound className="w-3.5 h-3.5 text-[#667180]" />
              <span>{isAuthenticated ? 'Profile' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
