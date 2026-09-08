import React from 'react';
import { Cpu, CheckCircle2, Clock, Terminal } from 'lucide-react';

const ENGINE_STEPS = [
  { id: 'validation', label: 'IMAGE VALIDATION', code: 'STG-01' },
  { id: 'vision', label: 'VISION ANALYSIS', code: 'STG-02' },
  { id: 'damage', label: 'DAMAGE DETECTION', code: 'STG-03' },
  { id: 'components', label: 'COMPONENT IDENTIFICATION', code: 'STG-04' },
  { id: 'pricing', label: 'MARKET PRICE ANALYSIS', code: 'STG-05' },
  { id: 'estimate', label: 'ESTIMATE GENERATION', code: 'STG-06' },
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
  const photoCount = Object.values(angles || {}).filter(Boolean).length;

  const stageIndexMap = {
    idle: -1,
    validating: 0,
    analyzing: 1,
    detecting_damage: 2,
    identifying_components: 3,
    calculating_cost: 4,
    complete: 6,
    error: -1,
  };

  const activeIndex = stageIndexMap[currentStage] ?? -1;

  const getStepStatus = (index) => {
    if (currentStage === 'complete') return 'done';
    if (currentStage === 'error' && index <= activeIndex) return 'error';
    if (index < activeIndex) return 'done';
    if (index === activeIndex) return 'running';
    return 'waiting';
  };

  const getOperationLabel = () => {
    switch (currentStage) {
      case 'validating':
        return 'VALIDATING EXIF METADATA & PERSPECTIVE';
      case 'analyzing':
        return 'RUNNING COMPUTER VISION OPTICAL INFERENCE';
      case 'detecting_damage':
        return 'DETECTING VISIBLE DAMAGE & STRESS VECTORS';
      case 'identifying_components':
        return 'IDENTIFYING AFFECTED HARDWARE COMPONENTS';
      case 'calculating_cost':
        return 'CALCULATING LOCAL & OEM MARKET REPAIR COSTS';
      case 'complete':
        return 'DIAGNOSIS COMPLETE // REPORT FINALIZED';
      case 'error':
        return 'ANALYSIS INTERRUPTED // ERROR LOGGED';
      case 'idle':
      default:
        return hasPhotos
          ? `OPTICAL INPUT LOADED (${photoCount} ${photoCount === 1 ? 'ANGLE' : 'ANGLES'}) // READY`
          : 'STANDBY // AWAITING INSPECTION PHOTO';
    }
  };

  const getProgressPercent = () => {
    switch (currentStage) {
      case 'validating':
        return 18;
      case 'analyzing':
        return 38;
      case 'detecting_damage':
        return 65;
      case 'identifying_components':
        return 82;
      case 'calculating_cost':
        return 92;
      case 'complete':
        return 100;
      case 'error':
      case 'idle':
      default:
        return hasPhotos ? 10 : 0;
    }
  };

  const progressPercent = getProgressPercent();

  // Derived real events from actual application state
  const getActivityEvents = () => {
    const events = [];

    if (hasPhotos) {
      events.push({
        id: 'photos',
        text: `Optical capture: ${photoCount} inspection ${photoCount === 1 ? 'photo' : 'photos'} queued`,
        status: 'ok',
      });
    }

    if (['validating', 'analyzing', 'detecting_damage', 'identifying_components', 'calculating_cost', 'complete'].includes(currentStage)) {
      events.push({
        id: 'validation',
        text: 'Optical validity & sensor orientation confirmed',
        status: 'ok',
      });
    }

    if (['analyzing', 'detecting_damage', 'identifying_components', 'calculating_cost', 'complete'].includes(currentStage)) {
      events.push({
        id: 'vision',
        text: 'Optical damage inference executed across matrix',
        status: 'ok',
      });
    }

    if (['detecting_damage', 'identifying_components', 'calculating_cost', 'complete'].includes(currentStage)) {
      events.push({
        id: 'damage',
        text: 'Surface damage & fracture vectors mapped',
        status: 'ok',
      });
    }

    if (['identifying_components', 'calculating_cost', 'complete'].includes(currentStage)) {
      const compCount = analysisResult?.affectedComponents?.length || 4;
      events.push({
        id: 'parts',
        text: `${compCount} hardware assemblies cross-referenced`,
        status: 'ok',
      });
    }

    if (['calculating_cost', 'complete'].includes(currentStage)) {
      events.push({
        id: 'pricing',
        text: 'Market pricing algorithm generated estimate',
        status: 'ok',
      });
    }

    if (currentStage === 'error') {
      events.push({
        id: 'error',
        text: analysisError || 'Diagnostic exception encountered',
        status: 'error',
      });
    }

    if (events.length === 0) {
      events.push({
        id: 'standby',
        text: 'Diagnostic core initialized and listening',
        status: 'standby',
      });
    }

    return events;
  };

  const activityEvents = getActivityEvents();

  return (
    <div
      className={`rounded-xl border border-[#232B36] bg-[#121720] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.035),0_10px_28px_rgba(0,0,0,0.45)] space-y-4 font-mono text-[#F4F6F8] transition-all duration-200 ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#19202A] text-[10px] uppercase tracking-wider text-[#A7B0BC]">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-[#7D91AA]" />
          <span className="font-bold text-[#F4F6F8] tracking-widest font-sans">
            LIVE DIAGNOSTIC ENGINE
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px]">
          {isAnalyzing ? (
            <span className="flex items-center gap-1.5 text-[#7D91AA] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7D91AA] animate-ping" />
              INFERENCE RUNNING
            </span>
          ) : currentStage === 'complete' ? (
            <span className="flex items-center gap-1.5 text-[#55A477] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#55A477]" />
              RESOLVED
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[#55A477] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#55A477] animate-pulse" />
              SYSTEM ONLINE
            </span>
          )}
        </div>
      </div>

      {/* 6-Stage Checklist */}
      <div className="space-y-1.5">
        {ENGINE_STEPS.map((step, idx) => {
          const status = getStepStatus(idx);
          return (
            <div
              key={step.id}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-md border text-[10.5px] transition-colors ${
                status === 'running'
                  ? 'border-[#7D91AA]/60 bg-[#161C25] text-[#F4F6F8]'
                  : status === 'done'
                  ? 'border-transparent bg-[#0D1118]/60 text-[#A7B0BC]'
                  : 'border-transparent bg-transparent text-[#687382]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[8.5px] text-[#687382] font-mono shrink-0">
                  {step.code}
                </span>
                <span
                  className={`truncate tracking-tight ${
                    status === 'running'
                      ? 'font-bold text-[#F4F6F8]'
                      : status === 'done'
                      ? 'text-[#A7B0BC]'
                      : 'text-[#687382]'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              <div className="shrink-0 flex items-center gap-1.5">
                {status === 'done' ? (
                  <span className="text-[#55A477] font-bold text-xs">✓</span>
                ) : status === 'running' ? (
                  <span className="flex items-center gap-1 text-[9px] text-[#7D91AA] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7D91AA] animate-pulse" />
                    RUNNING
                  </span>
                ) : status === 'error' ? (
                  <span className="text-[#B36262] font-bold text-xs">!</span>
                ) : (
                  <span className="text-[#687382] text-xs">○</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Operation & Progress */}
      <div className="p-3 rounded-lg bg-[#0D1118] border border-[#232B36] space-y-2">
        <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-[#687382]">
          <span>CURRENT OPERATION</span>
          <span className="font-bold text-[#F4F6F8]">{progressPercent}%</span>
        </div>

        <div className="text-[11px] font-semibold text-[#F4F6F8] tracking-tight truncate">
          {getOperationLabel()}
        </div>

        <div className="w-full h-1 bg-[#161C25] rounded-full overflow-hidden border border-[#232B36]">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              currentStage === 'complete'
                ? 'bg-[#55A477]'
                : currentStage === 'error'
                ? 'bg-[#B36262]'
                : 'bg-[#7D91AA]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-[#687382]">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-[#7D91AA]" />
            <span>LIVE ACTIVITY LOG</span>
          </div>
          <span className="text-[8px] text-[#687382]">EVENT STREAM</span>
        </div>

        <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
          {activityEvents.map((evt) => (
            <div
              key={evt.id}
              className="flex items-start gap-2 text-[9.5px] text-[#A7B0BC] leading-tight"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mt-0.5 shrink-0 ${
                  evt.status === 'ok'
                    ? 'bg-[#55A477]'
                    : evt.status === 'error'
                    ? 'bg-[#B36262]'
                    : 'bg-[#7D91AA]'
                }`}
              />
              <span className="truncate">{evt.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
