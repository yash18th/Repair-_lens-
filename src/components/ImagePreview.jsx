import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Trash2, Layers } from 'lucide-react';

export default function ImagePreview({ angles, onAnalyze, onRemoveAngle, onClearAll }) {
  const uploadedPhotos = Object.entries(angles || {})
    .filter(([_, item]) => Boolean(item))
    .map(([key, item]) => ({ key, ...item }));

  if (uploadedPhotos.length === 0) return null;

  return (
    <div className="w-full glass-panel rounded-2xl p-6 sm:p-8 border border-purple-500/40 shadow-2xl space-y-6 animate-fadeIn bg-slate-950/90">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base flex items-center space-x-2">
              <span>{uploadedPhotos.length} {uploadedPhotos.length === 1 ? 'Damage Photo' : 'Damage Photos'} Ready</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                {uploadedPhotos.length === 1 ? 'Single Angle' : 'Multi-Angle Pack'}
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              {uploadedPhotos.length === 1 
                ? 'Ready for instant AI visual defect & cost estimation' 
                : 'Combined perspective inputs ready for high-accuracy composite inspection'
              }
            </p>
          </div>
        </div>

        {/* Thumbnail Preview Strip & Clear */}
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2 overflow-hidden py-1">
            {uploadedPhotos.map((photo, i) => (
              <img
                key={photo.key || i}
                src={photo.previewUrl}
                alt={photo.name}
                className="inline-block h-8 w-8 rounded-lg ring-2 ring-slate-900 object-cover border border-purple-500/40"
                title={photo.name}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg border border-slate-700/60 transition-colors flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Primary Action CTA Button */}
      <div>
        <button
          type="button"
          onClick={onAnalyze}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-purple-600/30 hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center space-x-3 group cursor-pointer"
        >
          <Sparkles className="w-6 h-6 text-purple-200 group-hover:rotate-12 transition-transform" />
          <span>Run AI Damage Diagnosis ({uploadedPhotos.length} {uploadedPhotos.length === 1 ? 'Photo' : 'Photos'})</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
