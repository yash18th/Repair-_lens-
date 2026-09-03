import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Trash2 } from 'lucide-react';

export default function ImagePreview({ angles, onAnalyze, onRemoveAngle, onClearAll }) {
  const uploadedPhotos = Object.entries(angles || {})
    .filter(([_, item]) => Boolean(item))
    .map(([key, item]) => ({ key, ...item }));

  if (uploadedPhotos.length === 0) return null;

  return (
    <div className="w-full glass-panel rounded-2xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl space-y-6 animate-fadeIn">
      
      {/* Header section */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h4 className="font-bold text-white text-base">
            Damage Photo Ready for AI Diagnosis
          </h4>
        </div>
        
        <button
          onClick={onClearAll}
          className="text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg border border-slate-700/60 transition-colors flex items-center space-x-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Photo</span>
        </button>
      </div>

      {/* Primary Action CTA */}
      <div>
        <button
          onClick={onAnalyze}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-purple-600/30 hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center space-x-3 group cursor-pointer"
        >
          <Sparkles className="w-6 h-6 text-purple-200 group-hover:rotate-12 transition-transform" />
          <span>Run AI Damage Diagnosis</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}

