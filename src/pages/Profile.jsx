import React from 'react';
import { Mail, ChevronRight } from 'lucide-react';
import { ITEM_CATEGORIES } from '../services/api';

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
            <span>Choose an Item Category to Open Dedicated Studio</span>
          </div>
          <span className="text-[11px] text-slate-500">Click any category below to begin</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ITEM_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl p-5 border border-slate-800 bg-slate-900/80 transition-all duration-300 space-y-3 relative overflow-hidden group hover:scale-[1.02] hover:border-purple-500/60 hover:bg-slate-900 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectCategoryAndNavigate(cat.id)}
                  className="px-3 py-1.5 rounded-full bg-purple-600/20 text-purple-300 font-bold text-xs border border-purple-500/30 flex items-center space-x-1 hover:bg-purple-600 hover:text-white transition-colors"
                >
                  <span>Open Studio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-white text-lg group-hover:text-purple-300 transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-purple-400 font-semibold">
                <span>⚡ Dedicated Vision Model</span>
                <span>Instant AI Diagnosis</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
