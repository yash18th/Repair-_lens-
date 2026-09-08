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
    <header className="sticky top-0 z-30 border-b border-[#252B33] bg-[#080A0D]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-1.5 rounded-md text-[#9AA3AF] hover:text-[#F2F4F7] hover:bg-[#151A21] transition-colors border border-[#252B33]"
              aria-label="Open Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold tracking-tight text-[#F2F4F7] truncate">
                {getTabTitle()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Subtle Service Desk status badge */}
            <span className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#9AA3AF] border border-[#252B33] bg-[#0D1015] rounded-md whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F8A68]"></span>
              Service Desk
            </span>

            {/* Sophisticated Professional New Diagnosis button */}
            <button
              onClick={onNewDiagnosis}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#364150] bg-[#1C232D] hover:bg-[#252F3C] hover:border-[#4A586C] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-[#F2F4F7] transition-colors shadow-sm whitespace-nowrap cursor-pointer"
              type="button"
            >
              <Plus className="w-3.5 h-3.5 text-[#9AA3AF]" />
              <span>New Diagnosis</span>
            </button>

            <button
              onClick={isAuthenticated ? onOpenProfile : onSignIn}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#252B33] bg-[#0D1015] hover:bg-[#151A21] hover:border-[#363E4A] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.06em] text-[#9AA3AF] hover:text-[#F2F4F7] transition-colors whitespace-nowrap cursor-pointer"
            >
              <UserRound className="w-3.5 h-3.5 text-[#66707D]" />
              <span>{isAuthenticated ? 'Profile' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
