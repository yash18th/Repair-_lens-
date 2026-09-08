import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

const DIAGNOSTIC_STEPS = [
  { id: 'validation', label: 'IMAGE VALIDATION' },
  { id: 'damage', label: 'DAMAGE DETECTION' },
  { id: 'components', label: 'COMPONENT IDENTIFICATION' },
  { id: 'cost', label: 'COST ESTIMATION' },
];

export default function LiveDiagnosticEngine({
  stage = 'idle',
  isAnalyzing = false,
  analysisResult = null,
  analysisError = null,
  selectedCategory = 'phone',
  angles = {},
  className = '',
}) {
  let currentStage = stage;
  if (analysisError) {
    currentStage = 'error';
  } else if (analysisResult && !isAnalyzing) {
    currentStage = 'complete';
  } else if (isAnalyzing && currentStage === 'idle') {
    currentStage = 'analyzing';
  }

  const hasPhotos = Object.values(angles || {}).some(Boolean);

  const getStatusInfo = () => {
    switch (currentStage) {
      case 'validating':
        return {
          badge: 'VALIDATING IMAGE',
          subtext: 'Verifying image format, metadata, and visual clarity.',
          activeStepIndex: 0,
          progress: 25,
          message: 'Validating image quality and perspective...',
          dotClass: 'bg-[#7D91AA] animate-pulse',
        };
      case 'analyzing':
        return {
          badge: 'ANALYZING IMAGE',
          subtext: 'Your image is being analyzed for visible damage.',
          activeStepIndex: 1,
          progress: 42,
          message: 'Analyzing visible surface damage...',
          dotClass: 'bg-[#7D91AA] animate-pulse',
        };
      case 'detecting_damage':
        return {
          badge: 'DETECTING DAMAGE',
          subtext: 'Scanning fractures, cracks, and kinetic impact stress.',
          activeStepIndex: 1,
          progress: 65,
          message: 'Detecting visible damage and fault regions...',
          dotClass: 'bg-[#7D91AA] animate-pulse',
        };
      case 'identifying_components':
        return {
          badge: 'IDENTIFYING COMPONENTS',
          subtext: 'Cross-referencing damaged components with hardware catalog.',
          activeStepIndex: 2,
          progress: 82,
          message: 'Identifying affected hardware assemblies...',
          dotClass: 'bg-[#7D91AA] animate-pulse',
        };
      case 'calculating_cost':
        return {
          badge: 'CALCULATING REPAIR COST',
          subtext: 'Computing localized parts pricing and labor benchmarks.',
          activeStepIndex: 3,
          progress: 94,
          message: 'Calculating repair and component costs...',
          dotClass: 'bg-[#7D91AA] animate-pulse',
        };
      case 'complete':
        return {
          badge: 'ANALYSIS COMPLETE',
          subtext: 'Inspection report and market estimates have been generated.',
          activeStepIndex: 4,
          progress: 100,
          message: 'Report ready with verified estimates.',
          dotClass: 'bg-[#4E9A6E]',
        };
      case 'error':
        return {
          badge: 'ANALYSIS FAILED',
          subtext: analysisError || 'The diagnostic service was unable to complete this scan.',
          activeStepIndex: -1,
          progress: 0,
          message: 'Analysis unavailable. Please retry with a clear photo.',
          dotClass: 'bg-[#B35C5C]',
        };
      case 'idle':
      default:
        return {
          badge: hasPhotos ? 'READY TO ANALYZE' : 'STANDBY',
          subtext: hasPhotos
            ? 'Inspection photo ready. Click "Start Diagnosis" to begin.'
            : 'Upload a device photo to initiate visual damage analysis.',
          activeStepIndex: -1,
          progress: hasPhotos ? 10 : 0,
          message: hasPhotos ? 'Image staged. Ready for diagnostic scan.' : 'Awaiting device image.',
          dotClass: 'bg-[#687382]',
        };
    }
  };

  const status = getStatusInfo();

  return (
    <div className={`p-6 sm:p-7 rounded-xl border border-[#252D37] bg-[#11161D] space-y-6 shadow-sm ${className}`}>
      {/* Header & Status Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#F1F3F5]">
            Live Diagnosis
          </span>
          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#151B23] border border-[#252D37] text-[11px] font-medium tracking-wide text-[#F1F3F5]">
            <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
            <span>{status.badge}</span>
          </span>
        </div>
        <p className="text-xs text-[#9CA6B3] leading-relaxed">
          {status.subtext}
        </p>
      </div>

      <div className="border-t border-[#252D37]" />

      {/* 4 Core Steps Checklist */}
      <div className="space-y-3 font-mono text-xs">
        {DIAGNOSTIC_STEPS.map((step, idx) => {
          const isDone = currentStage === 'complete' || idx < status.activeStepIndex;
          const isCurrent = idx === status.activeStepIndex && currentStage !== 'complete' && currentStage !== 'error';

          return (
            <div
              key={step.id}
              className={`flex items-center justify-between py-1.5 px-1 transition-colors ${
                isCurrent ? 'text-[#F1F3F5] font-semibold' : isDone ? 'text-[#9CA6B3]' : 'text-[#687382]'
              }`}
            >
              <span className="text-xs tracking-wide">{step.label}</span>
              <span className="text-sm font-bold flex items-center justify-center w-5">
                {isDone ? (
                  <Check className="w-4 h-4 text-[#4E9A6E]" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-[#7D91AA] animate-pulse" />
                ) : (
                  <span className="text-[#687382]">○</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar & Real-time Status Readout */}
      <div className="space-y-2 pt-2 border-t border-[#1C232D]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#9CA6B3] text-xs truncate max-w-[220px] sm:max-w-none">
            {status.message}
          </span>
          <span className="font-mono font-semibold text-[#F1F3F5]">
            {status.progress}%
          </span>
        </div>

        <div className="w-full h-1 bg-[#151B23] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              currentStage === 'error'
                ? 'bg-[#B35C5C]'
                : currentStage === 'complete'
                ? 'bg-[#4E9A6E]'
                : 'bg-[#7D91AA]'
            }`}
            style={{ width: `${status.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
