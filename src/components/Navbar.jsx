import React from 'react';
import { Menu, Plus, UserRound, CreditCard } from 'lucide-react';

export default function Navbar({
  activeTab,
  isAuthenticated,
  onToggleMobileSidebar,
  onNewDiagnosis,
  onOpenPayment,
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
      case 'computer':
        return 'Computers & Laptops';
      case 'electronics':
        return 'Electronics & PCB';
      case 'appliance':
        return 'Home Appliance';
      case 'vehicles':
        return 'Vehicles';
      case 'other':
        return 'Other';
      case 'settings':
        return 'Settings';
      case 'studio':
      default:
        return 'Diagnostic Workspace';
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#252D37] bg-[#0B0F15]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-1.5 rounded-md text-[#9CA6B3] hover:text-[#F1F3F5] hover:bg-[#11161D] transition-colors border border-[#252D37]"
              aria-label="Open Sidebar"
              type="button"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center min-w-0 overflow-hidden">
              <h2 className="text-sm font-semibold tracking-tight text-[#F1F3F5] truncate font-sans">
                {getTabTitle()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            {/* Service Desk status indicator */}
            <span className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 text-xs text-[#9CA6B3] border border-[#252D37] bg-[#090C11] rounded-lg whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4E9A6E]" />
              <span>Service Desk</span>
            </span>

            {/* Standout Primary New Diagnosis button */}
            <button
              onClick={onNewDiagnosis}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#7D91AA] hover:bg-[#8CA0B9] text-[#090C11] px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all shadow-sm whitespace-nowrap cursor-pointer"
              type="button"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Diagnosis</span>
            </button>

            {/* Profile / Sign In Button */}
            <button
              onClick={isAuthenticated ? onOpenProfile : onSignIn}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#252D37] bg-[#11161D] hover:bg-[#151B23] px-3 py-1.5 text-xs font-medium text-[#9CA6B3] hover:text-[#F1F3F5] transition-colors whitespace-nowrap cursor-pointer"
            >
              <UserRound className="w-3.5 h-3.5 text-[#7D91AA]" />
              <span>{isAuthenticated ? 'Profile' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
