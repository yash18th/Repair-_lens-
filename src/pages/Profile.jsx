import React from 'react';
import { Mail, ChevronRight, Home, User, Settings, LogOut } from 'lucide-react';

const DASHBOARD_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, description: 'Overview and studio entry' },
  { id: 'profile', label: 'Profile', icon: User, description: 'Your account and metrics' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'Preferences and controls' }
];

export default function Profile({ onSelectCategoryAndNavigate, onLogout }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="glass-panel p-8 rounded-2xl border border-[#202731] bg-[#10141A] space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-20 h-20 rounded-2xl bg-[#141922] border border-[#202731] flex items-center justify-center text-xl font-bold text-[#F5F7FA]">
              YS
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <h1 className="text-2xl font-bold text-[#F5F7FA]">Yashvanth</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#141922] text-[#A7B0BD] border border-[#202731] text-xs font-medium">
                  Pro Technician
                </span>
              </div>
              <p className="text-xs text-[#A7B0BD] flex items-center justify-center sm:justify-start space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-[#667180]" />
                <span>yashvanth@repairlens.ai</span>
              </p>
            </div>
          </div>

          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-[#202731] bg-[#141922] px-3.5 py-2 text-xs font-medium text-[#A7B0BD] transition-colors hover:border-[#283240] hover:text-[#F5F7FA]"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#202731]">
          <div className="bg-[#0C1015] p-4 rounded-xl border border-[#202731] text-center space-y-1">
            <span className="text-xs text-[#A7B0BD]">Total Scans Run</span>
            <p className="text-2xl font-bold text-[#F5F7FA] font-mono">48</p>
          </div>
          <div className="bg-[#0C1015] p-4 rounded-xl border border-[#202731] text-center space-y-1">
            <span className="text-xs text-[#A7B0BD]">Completed DIY Repairs</span>
            <p className="text-2xl font-bold text-[#4F8A68] font-mono">34</p>
          </div>
          <div className="bg-[#0C1015] p-4 rounded-xl border border-[#202731] text-center space-y-1">
            <span className="text-xs text-[#A7B0BD]">Saved Repair Cost</span>
            <p className="text-2xl font-bold text-[#8294AA] font-mono">$1,850</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#A7B0BD]">
            <span className="w-5 h-5 rounded-md bg-[#141922] border border-[#202731] text-[#A7B0BD] flex items-center justify-center text-[10px] font-bold">1</span>
            <span>Dashboard</span>
          </div>
          <span className="text-[11px] text-[#667180]">Quick access</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {DASHBOARD_ITEMS.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              type="button"
              className="group flex items-center justify-between gap-3 rounded-xl border border-[#202731] bg-[#10141A] px-4 py-3 text-left transition-all duration-200 hover:bg-[#141922] hover:border-[#283240] min-w-[180px] flex-1"
              aria-label={`${label}: ${description}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0C1015] border border-[#202731] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#A7B0BD]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F5F7FA]">{label}</div>
                  <div className="text-[11px] text-[#A7B0BD]">{description}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#667180] group-hover:text-[#A7B0BD] transition-colors" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
