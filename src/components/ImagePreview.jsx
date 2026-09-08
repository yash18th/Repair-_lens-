import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Trash2 } from 'lucide-react';

export default function ImagePreview({ angles, onAnalyze, onRemoveAngle, onClearAll }) {
  const uploadedPhotos = Object.entries(angles || {})
    .filter(([_, item]) => Boolean(item))
    .map(([key, item]) => ({ key, ...item }));

  if (uploadedPhotos.length === 0) return null;

  return (
    <div className="w-full rounded-xl p-5 sm:p-6 border border-[#232B36] bg-[#121720] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.4)] space-y-5 animate-fadeIn">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232B36]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#161C25] border border-[#232B36] flex items-center justify-center text-[#55A477]">
            <CheckCircle2 className="w-4 h-4 text-[#55A477]" />
          </div>
          <div>
            <h4 className="font-semibold text-[#F4F6F8] text-sm flex items-center space-x-2">
              <span>{uploadedPhotos.length} {uploadedPhotos.length === 1 ? 'Inspection Photo' : 'Inspection Photos'} Ready</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#161C25] text-[#A7B0BC] border border-[#232B36] font-mono">
                {uploadedPhotos.length === 1 ? 'Single Angle' : 'Multi-Angle'}
              </span>
            </h4>
            <p className="text-xs text-[#A7B0BC]">
              {uploadedPhotos.length === 1 
                ? 'Ready for defect analysis and estimate computation' 
                : 'Combined perspectives ready for composite diagnostic evaluation'
              }
            </p>
          </div>
        </div>

        {/* Thumbnail Preview Strip & Clear */}
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-1.5 overflow-hidden py-0.5">
            {uploadedPhotos.map((photo, i) => (
              <img
                key={photo.key || i}
                src={photo.previewUrl}
                alt={photo.name}
                className="inline-block h-7 w-7 rounded-md ring-1 ring-[#232B36] object-cover border border-[#232B36]"
                title={photo.name}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-[#687382] hover:text-[#B36262] hover:bg-[#161C25] px-2.5 py-1 rounded-md border border-[#232B36] transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Primary Action CTA Button */}
      <div>
        <button
          type="button"
          onClick={onAnalyze}
          className="w-full py-3 px-5 rounded-lg border border-[#232B36] bg-[#161C25] hover:bg-[#1D2430] hover:border-[#7D91AA]/40 text-[#F4F6F8] font-semibold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center space-x-2.5 cursor-pointer shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-[#7D91AA]" />
          <span>Execute Damage Diagnosis ({uploadedPhotos.length} {uploadedPhotos.length === 1 ? 'Photo' : 'Photos'})</span>
          <ArrowRight className="w-4 h-4 text-[#7D91AA]" />
        </button>
      </div>

    </div>
  );
}
