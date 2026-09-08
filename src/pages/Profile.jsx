import React, { useState, useEffect } from 'react';
import { Mail, ChevronRight, Home, User, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { getApiBaseUrl } from '../services/config';

const DASHBOARD_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, description: 'Overview and studio entry' },
  { id: 'profile', label: 'Profile', icon: User, description: 'Your account and metrics' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'Preferences and controls' }
];

export default function Profile({ onSelectCategoryAndNavigate, onLogout }) {
  const [scanCount, setScanCount] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadScanData = async () => {
      try {
        const apiBaseUrl = getApiBaseUrl();
        const res = await fetch(`${apiBaseUrl}/api/scans`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          const scans = data.scans || data.history || [];
          if (isMounted) {
            setScanCount(scans.length);
          }
        }
      } catch (e) {
        // Fallback safely
      }
    };
    loadScanData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="p-8 rounded-xl border border-[#232B36] bg-[#121720] space-y-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-16 h-16 rounded-xl bg-[#161C25] border border-[#232B36] flex items-center justify-center text-lg font-bold text-[#F4F6F8] font-mono">
              OP
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#F4F6F8]">Diagnostic Operator</h1>
                <span className="px-2 py-0.5 rounded-md bg-[#161C25] text-[#7D91AA] border border-[#232B36] text-[10px] font-mono uppercase tracking-wider">
                  Active Station
                </span>
              </div>
              <p className="text-xs text-[#A7B0BC] flex items-center justify-center sm:justify-start space-x-1.5 font-mono">
                <Mail className="w-3.5 h-3.5 text-[#687382]" />
                <span>diagnostics@repairlens.local</span>
              </p>
            </div>
          </div>

          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-[#232B36] bg-[#161C25] hover:bg-[#1D2430] px-3.5 py-2 text-xs font-medium text-[#A7B0BC] transition-colors hover:text-[#F4F6F8] cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#232B36]">
          <div className="bg-[#0D1118] p-4 rounded-lg border border-[#232B36] text-center space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#687382]">Recorded Scans</span>
            <p className="text-2xl font-bold text-[#F4F6F8] font-mono">
              {scanCount !== null ? scanCount : '--'}
            </p>
          </div>
          <div className="bg-[#0D1118] p-4 rounded-lg border border-[#232B36] text-center space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#687382]">Diagnostic Verification</span>
            <p className="text-2xl font-bold text-[#55A477] font-mono">Active</p>
          </div>
          <div className="bg-[#0D1118] p-4 rounded-lg border border-[#232B36] text-center space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#687382]">Market Pricing Engine</span>
            <p className="text-2xl font-bold text-[#7D91AA] font-mono">Online</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#A7B0BC]">
            <span className="w-5 h-5 rounded-md bg-[#161C25] border border-[#232B36] text-[#7D91AA] flex items-center justify-center text-[10px] font-bold">1</span>
            <span>Diagnostic Controls</span>
          </div>
          <span className="text-[11px] font-mono text-[#687382]">QUICK ACCESS</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {DASHBOARD_ITEMS.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelectCategoryAndNavigate && onSelectCategoryAndNavigate(id)}
              className="group flex items-center justify-between gap-3 rounded-xl border border-[#232B36] bg-[#121720] px-4 py-3 text-left transition-all duration-200 hover:bg-[#161C25] hover:border-[#7D91AA]/40 min-w-[180px] flex-1 cursor-pointer"
              aria-label={`${label}: ${description}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0D1118] border border-[#232B36] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#7D91AA]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F4F6F8]">{label}</div>
                  <div className="text-[11px] text-[#A7B0BC]">{description}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#687382] group-hover:text-[#F4F6F8] transition-colors" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
