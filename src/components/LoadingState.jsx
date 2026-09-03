import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, Search, Layers, Scan } from 'lucide-react';

const MULTI_SCAN_STEPS = [
  'Photo 1 (Close-up): Extracting fracture & surface wear vectors...',
  'Photo 2 (Full View): Analyzing overall component 3D geometry...',
  'Photo 3 (Label Tag): Running OCR model & serial number extraction...',
  'Photo 4 (Alt Angle): Aligning depth perspective & strain boundaries...',
  'Cross-Image Fusion: Synthesizing unified diagnostic report & cost range...'
];

export default function LoadingState({ angles }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < MULTI_SCAN_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full glass-panel rounded-2xl p-8 border border-blue-500/30 bg-slate-950/90 shadow-2xl relative overflow-hidden my-6">
      
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-xl mx-auto text-center space-y-6">
        
        {/* Animated Lens Visual */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border border-blue-500/40 animate-pulse"></div>
          
          <div className="w-full h-full rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center relative overflow-hidden shadow-xl shadow-blue-500/20">
            <Cpu className="w-12 h-12 text-blue-400 animate-spin" style={{ animationDuration: '5s' }} />
            {/* Laser scan line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_#3b82f6] animate-laser-scan"></div>
          </div>
        </div>

        {/* Header */}
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Cross-Image Vision Pipeline</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Running Multi-Angle Unified Analysis
          </h3>
        </div>

        {/* Progressive status text */}
        <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Vision Fusion Engine</span>
            <span className="font-mono text-blue-400 font-semibold">
              {Math.min(100, Math.round(((currentStepIndex + 1) / MULTI_SCAN_STEPS.length) * 100))}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 transition-all duration-300 rounded-full"
              style={{ width: `${((currentStepIndex + 1) / MULTI_SCAN_STEPS.length) * 100}%` }}
            ></div>
          </div>

          {/* Active step message */}
          <p className="text-xs sm:text-sm font-medium text-slate-300 min-h-[2rem] flex items-center justify-center space-x-2 px-2">
            <Scan className="w-4 h-4 text-blue-400 animate-pulse flex-shrink-0" />
            <span>{MULTI_SCAN_STEPS[currentStepIndex]}</span>
          </p>
        </div>

      </div>

    </div>
  );
}
