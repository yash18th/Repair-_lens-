import React from 'react';
import { Settings, Cpu, ChevronRight } from 'lucide-react';
import { ITEM_CATEGORIES } from '../services/api';

export default function SettingsPage({ onSelectCategoryAndNavigate }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20 mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>Platform Preferences</span>
        </div>
        <h1 className="text-3xl font-black text-white">System Settings</h1>
        <p className="text-xs text-slate-400">Configure AI vision pipeline preferences, camera resolution, and notification alerts.</p>
      </div>

      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>AI Vision Pipeline Settings</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <div>
                <span className="font-bold text-slate-200 block">Cross-Image Vision Fusion</span>
                <span className="text-slate-400 text-[11px]">Combine 4-angle photo inputs into a single diagnostic report</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-600 rounded" />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <div>
                <span className="font-bold text-slate-200 block">Evidence & Uncertainty Layer</span>
                <span className="text-slate-400 text-[11px]">Display "What We Cannot See" transparent risk callouts</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-600 rounded" />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-bold text-slate-200 block">OCR Model Identification</span>
                <span className="text-slate-400 text-[11px]">Automatically scan serial numbers & model tags from Photo 3</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-600 rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-slate-300">
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[11px] font-bold">2</span>
            <span>Category Access</span>
          </div>
          <span className="text-[11px] text-slate-500">Choose a category</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {ITEM_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategoryAndNavigate(cat.id)}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3.5 text-left transition-all duration-200 hover:border-purple-500/60 hover:bg-slate-900"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-lg flex-shrink-0">
                  {cat.icon}
                </div>

                <div className="min-w-0">
                  <div className="font-extrabold text-white text-lg group-hover:text-purple-300 transition-colors">{cat.label}</div>
                  <div className="text-[11px] text-slate-400 truncate">{cat.desc}</div>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 text-xs font-bold flex-shrink-0">
                Open
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
