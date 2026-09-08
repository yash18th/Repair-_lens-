import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, Scan } from 'lucide-react';

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

  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / MULTI_SCAN_STEPS.length) * 100));

  return (
    <div className="w-full rounded-xl p-8 border border-[#202731] bg-[#10141A] shadow-[0_4px_24px_rgba(0,0,0,0.3)] relative overflow-hidden my-6">
      <div className="max-w-md mx-auto text-center space-y-5">
        
        {/* Animated Lens Visual */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="w-full h-full rounded-full bg-[#141922] border border-[#202731] flex items-center justify-center relative overflow-hidden">
            <Cpu className="w-8 h-8 text-[#A7B0BD] animate-spin" style={{ animationDuration: '6s' }} />
            {/* Subtle laser scan line */}
            <div className="absolute inset-x-0 h-0.5 bg-[#8294AA] animate-laser-scan opacity-60"></div>
          </div>
        </div>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#141922] text-[#A7B0BD] text-[10px] font-mono uppercase tracking-wider border border-[#202731]">
            <Sparkles className="w-3 h-3 text-[#8294AA]" />
            <span>Vision Fusion Pipeline</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#F5F7FA] tracking-tight">
            Running Multi-Angle Diagnostic Analysis
          </h3>
        </div>

        {/* Progressive status text */}
        <div className="bg-[#0C1015] rounded-lg p-3.5 border border-[#202731] space-y-2.5">
          <div className="flex items-center justify-between text-xs text-[#A7B0BD]">
            <span>Inference Progress</span>
            <span className="font-mono text-[#F5F7FA] font-semibold">
              {progressPercent}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-[#141922] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8294AA] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Active step message */}
          <p className="text-xs font-medium text-[#A7B0BD] min-h-[1.5rem] flex items-center justify-center space-x-2 px-1">
            <Scan className="w-3.5 h-3.5 text-[#8294AA] flex-shrink-0" />
            <span className="truncate">{MULTI_SCAN_STEPS[currentStepIndex]}</span>
          </p>
        </div>

      </div>
    </div>
  );
}
