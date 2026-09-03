import React from 'react';
import { User, ShieldCheck, Award, Wrench, Calendar, Mail, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
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

        {/* 3 Metrics Cards */}
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

    </div>
  );
}
