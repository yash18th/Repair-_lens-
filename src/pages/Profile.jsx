import React from 'react';
import { Mail, ChevronRight, Home, User, Settings } from 'lucide-react';

const DASHBOARD_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, description: 'Overview and studio entry' },
  { id: 'profile', label: 'Profile', icon: User, description: 'Your account and metrics' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'Preferences and controls' }
];

export default function Profile({ onSelectCategoryAndNavigate }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-purple-600/30">
            YS
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h1 className="text-2xl font-black text-white">Yashvanth</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
                Pro Technician
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start space-x-1">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>yashvanth@repairlens.ai</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-400">Total Scans Run</span>
            <p className="text-2xl font-black text-white font-mono">48</p>
          </div>
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-400">Completed DIY Repairs</span>
            <p className="text-2xl font-black text-emerald-400 font-mono">34</p>
          </div>
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-400">Saved Repair Cost</span>
            <p className="text-2xl font-black text-purple-400 font-mono">$1,850</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-slate-300">
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[11px] font-bold">1</span>
            <span>Dashboard</span>
          </div>
          <span className="text-[11px] text-slate-500">Quick access</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {DASHBOARD_ITEMS.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              type="button"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-left transition-all duration-200 hover:border-purple-500/60 hover:bg-slate-900 min-w-[180px] flex-1"
              aria-label={`${label}: ${description}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-white group-hover:text-purple-300 transition-colors">{label}</div>
                  <div className="text-[11px] text-slate-400">{description}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-300" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
