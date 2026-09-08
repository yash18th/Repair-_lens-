import React from 'react';
import { Activity, Check, AlertCircle, Radio } from 'lucide-react';

const PIPELINE_STAGES = [
  { id: 'image', label: 'IMAGE', sublabel: 'VALIDATION' },
  { id: 'vision', label: 'VISION', sublabel: 'ANALYSIS' },
  { id: 'damage', label: 'DAMAGE', sublabel: 'DETECTION' },
  { id: 'parts', label: 'PARTS', sublabel: 'IDENTIFY' },
  { id: 'cost', label: 'COST', sublabel: 'ESTIMATE' },
];

export default function DiagnosticTelemetryScan({
  stage = 'idle',
  isAnalyzing = false,
  analysisResult = null,
  analysisError = null,
  angles = {},
  selectedCategory = 'phone',
  className = '',
}) {
  // Determine effective stage
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

  // Configuration mapped to actual states
  const stageConfig = {
    idle: {
      statusLabel: 'READY',
      statusSub: '○ SYSTEM READY',
      statusColor: '#7D91AA',
      progressPercent: 0,
      activePipelineIndex: -1,
      telemetry: {
        visionEngine: 'STANDBY',
        imageQuality: hasPhotos ? 'INPUT READY' : 'AWAITING INPUT',
        damageDetection: 'READY',
        objectTracking: 'STANDBY',
        analysisStage: '00 / 05',
      },
    },
    validating: {
      statusLabel: 'VALIDATING IMAGE',
      statusSub: '● CHECKING METADATA',
      statusColor: '#7D91AA',
      progressPercent: 20,
      activePipelineIndex: 0,
      telemetry: {
        visionEngine: 'INITIALIZING',
        imageQuality: 'CHECKING EXIF',
        damageDetection: 'QUEUED',
        objectTracking: 'ACQUIRING',
        analysisStage: '01 / 05',
      },
    },
    analyzing: {
      statusLabel: 'ANALYZING IMAGE',
      statusSub: '● OPTICAL INFERENCE',
      statusColor: '#7D91AA',
      progressPercent: 40,
      activePipelineIndex: 1,
      telemetry: {
        visionEngine: 'ACTIVE',
        imageQuality: 'VERIFIED',
        damageDetection: 'INITIALIZING',
        objectTracking: 'ACTIVE',
        analysisStage: '02 / 05',
      },
    },
    detecting_damage: {
      statusLabel: 'DETECTING DAMAGE',
      statusSub: '● SURFACE VECTOR MAPPING',
      statusColor: '#7D91AA',
      progressPercent: 65,
      activePipelineIndex: 2,
      telemetry: {
        visionEngine: 'ACTIVE',
        imageQuality: 'OPTIMAL',
        damageDetection: 'ACTIVE',
        objectTracking: 'LOCKED',
        analysisStage: '03 / 05',
      },
    },
    identifying_components: {
      statusLabel: 'IDENTIFYING COMPONENTS',
      statusSub: '● OEM SCHEMATIC MATCH',
      statusColor: '#7D91AA',
      progressPercent: 82,
      activePipelineIndex: 3,
      telemetry: {
        visionEngine: 'ACTIVE',
        imageQuality: 'OPTIMAL',
        damageDetection: 'RESOLVED',
        objectTracking: 'RESOLVED',
        analysisStage: '04 / 05',
      },
    },
    calculating_cost: {
      statusLabel: 'CALCULATING MARKET COST',
      statusSub: '● AGGREGATING PARTS/LABOR',
      statusColor: '#B28A50',
      progressPercent: 92,
      activePipelineIndex: 4,
      telemetry: {
        visionEngine: 'FINALIZING',
        imageQuality: 'VERIFIED',
        damageDetection: 'RESOLVED',
        objectTracking: 'RESOLVED',
        analysisStage: '05 / 05',
      },
    },
    complete: {
      statusLabel: 'ANALYSIS COMPLETE',
      statusSub: '✓ ALL SYSTEMS RESOLVED',
      statusColor: '#55A477',
      progressPercent: 100,
      activePipelineIndex: 5,
      telemetry: {
        visionEngine: 'COMPLETE',
        imageQuality: 'HIGH FIDELITY',
        damageDetection: 'RESOLVED',
        objectTracking: 'RESOLVED',
        analysisStage: '05 / 05',
      },
    },
    error: {
      statusLabel: 'ANALYSIS INTERRUPTED',
      statusSub: '! SYSTEM EXCEPTION',
      statusColor: '#B36262',
      progressPercent: 0,
      activePipelineIndex: -1,
      telemetry: {
        visionEngine: 'INTERRUPTED',
        imageQuality: 'UNVERIFIED',
        damageDetection: 'ABORTED',
        objectTracking: 'RELEASED',
        analysisStage: 'ERR',
      },
    },
  };

  const activeConf = stageConfig[currentStage] || stageConfig.idle;
  const isActivelyScanning = ['validating', 'analyzing', 'detecting_damage', 'identifying_components', 'calculating_cost'].includes(currentStage);
  const isComplete = currentStage === 'complete';
  const isError = currentStage === 'error';

  // Derived metrics from actual analysisResult when complete
  const detectedComponentsCount = Array.isArray(analysisResult?.affectedComponents) && analysisResult.affectedComponents.length > 0
    ? analysisResult.affectedComponents.length
    : (analysisResult?.costIntelligence?.componentsIdentified?.length || 4);

  const replacementPartsCount = Array.isArray(analysisResult?.costIntelligence?.partBreakdown) && analysisResult.costIntelligence.partBreakdown.length > 0
    ? analysisResult.costIntelligence.partBreakdown.length
    : (analysisResult?.itemizedParts?.length || analysisResult?.costIntelligence?.oemVsAftermarket?.parts?.length || 3);

  const repairOpsCount = Array.isArray(analysisResult?.costIntelligence?.laborBreakdown) && analysisResult.costIntelligence.laborBreakdown.length > 0
    ? analysisResult.costIntelligence.laborBreakdown.length
    : (Array.isArray(analysisResult?.steps) && analysisResult.steps.length > 0 ? analysisResult.steps.length : 2);

  return (
    <div
      className={`rounded-xl border border-[#232B36] bg-[#121720] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.035),0_10px_28px_rgba(0,0,0,0.45)] space-y-4 font-mono text-[#F4F6F8] transition-all duration-300 ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#19202A] text-[10px] uppercase tracking-wider text-[#A7B0BC]">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#7D91AA]" />
          <span className="font-bold text-[#F4F6F8] tracking-widest font-sans">DEVICE SCAN</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#687382] text-[9px] hidden sm:inline">OPTICAL TELEMETRY</span>
          <span className="px-1.5 py-0.5 rounded bg-[#080B10] border border-[#232B36] text-[9px] text-[#7D91AA]">
            {selectedCategory.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Center Technical Scan Target Visualization */}
      <div className="relative h-36 sm:h-40 rounded-lg bg-[#080B10] border border-[#232B36] flex items-center justify-center overflow-hidden select-none">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />

        {/* Ambient Corner Coordinate Labels */}
        <div className="absolute top-2 left-2.5 text-[8px] text-[#687382] font-mono tracking-wider flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[#7D91AA]/60" />
          <span>OPTICAL INPUT // {hasPhotos ? `CH-${photoCount}` : 'READY'}</span>
        </div>
        <div className="absolute top-2 right-2.5 text-[8px] text-[#687382] font-mono tracking-wider">
          FRAME {isComplete ? 'LOCK' : (isActivelyScanning ? '03/05' : '01')}
        </div>
        <div className="absolute bottom-2 left-2.5 text-[8px] text-[#687382] font-mono tracking-wider">
          FOV: 78.4° / N: {isComplete ? 'RES' : 'CAL'}
        </div>
        <div className="absolute bottom-2 right-2.5 text-[8px] text-[#687382] font-mono tracking-wider">
          {isComplete ? 'SIGNAL VERIFIED' : (isActivelyScanning ? 'SIGNAL ACQUIRED' : 'STANDBY')}
        </div>

        {/* Circular Reticle Rings */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Outer Ring */}
          <circle
            cx="50%"
            cy="50%"
            r="60"
            fill="none"
            stroke="#7D91AA"
            strokeWidth="0.75"
            strokeDasharray="4 6"
            className={isActivelyScanning ? 'animate-radar-pulse' : ''}
          />
          {/* Subtle Inner Ring */}
          <circle
            cx="50%"
            cy="50%"
            r="38"
            fill="none"
            stroke="#7D91AA"
            strokeWidth="0.75"
            strokeDasharray="2 4"
          />
          {/* Reticle Axes */}
          <line x1="50%" y1="12" x2="50%" y2="28" stroke="#7D91AA" strokeWidth="0.75" />
          <line x1="50%" y1="100%" x2="50%" y2="calc(100% - 16px)" stroke="#7D91AA" strokeWidth="0.75" />
          <line x1="16" y1="50%" x2="32" y2="50%" stroke="#7D91AA" strokeWidth="0.75" />
          <line x1="100%" y1="50%" x2="calc(100% - 16px)" y2="50%" stroke="#7D91AA" strokeWidth="0.75" />
        </svg>

        {/* Central Scan Target Box */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div
            className={`w-28 sm:w-32 h-20 sm:h-22 rounded border transition-all duration-300 relative flex items-center justify-center ${
              isComplete
                ? 'border-[#55A477]/70 shadow-[inset_0_0_12px_rgba(85,164,119,0.15)]'
                : isError
                ? 'border-[#B36262]/70 shadow-[inset_0_0_12px_rgba(179,98,98,0.15)]'
                : isActivelyScanning
                ? 'border-[#7D91AA]/80 shadow-[inset_0_0_12px_rgba(125,145,170,0.18)]'
                : 'border-[#7D91AA]/30 shadow-[inset_0_0_8px_rgba(125,145,170,0.06)]'
            }`}
          >
            {/* Precision Corner Brackets: ┌ ┐ └ ┘ */}
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#7D91AA]" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#7D91AA]" />
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#7D91AA]" />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#7D91AA]" />

            {/* Micro Crosshair Center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2.5 h-[1px] bg-[#7D91AA]/40" />
              <div className="h-2.5 w-[1px] bg-[#7D91AA]/40 absolute" />
            </div>

            {/* Diagnostic Node Dots */}
            <div
              className={`absolute top-2 left-2 w-1 h-1 rounded-full transition-opacity duration-300 ${
                isActivelyScanning ? 'bg-[#7D91AA] opacity-90' : 'bg-[#687382] opacity-40'
              }`}
            />
            <div
              className={`absolute top-2 right-2 w-1 h-1 rounded-full transition-opacity duration-300 ${
                isActivelyScanning ? 'bg-[#7D91AA] opacity-90' : 'bg-[#687382] opacity-40'
              }`}
            />
            <div
              className={`absolute bottom-2 left-2 w-1 h-1 rounded-full transition-opacity duration-300 ${
                isActivelyScanning ? 'bg-[#7D91AA] opacity-90' : 'bg-[#687382] opacity-40'
              }`}
            />
            <div
              className={`absolute bottom-2 right-2 w-1 h-1 rounded-full transition-opacity duration-300 ${
                isActivelyScanning ? 'bg-[#7D91AA] opacity-90' : 'bg-[#687382] opacity-40'
              }`}
            />

            {/* Center Status Icon / Target Indicator */}
            {isComplete ? (
              <div className="flex flex-col items-center justify-center text-[#55A477] animate-fadeIn">
                <Check className="w-5 h-5 mb-0.5" />
                <span className="text-[7.5px] font-mono tracking-widest uppercase text-[#55A477]">LOCKED</span>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center text-[#B36262] animate-fadeIn">
                <AlertCircle className="w-5 h-5 mb-0.5" />
                <span className="text-[7.5px] font-mono tracking-widest uppercase text-[#B36262]">FAULT</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-1">
                <div
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    isActivelyScanning ? 'bg-[#7D91AA] animate-ping' : 'bg-[#55A477]/80'
                  }`}
                />
                <span className="text-[8px] text-[#A7B0BC] tracking-widest uppercase font-mono">
                  {isActivelyScanning ? 'SCANNING' : 'CALIBRATED'}
                </span>
              </div>
            )}

            {/* Moving Horizontal Scan Beam (TOP -> BOTTOM -> RESET) */}
            {isActivelyScanning && (
              <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#7D91AA] to-transparent animate-scan-beam pointer-events-none shadow-[0_0_8px_rgba(125,145,170,0.6)]" />
            )}
          </div>
          <span className="text-[8px] text-[#687382] tracking-widest uppercase font-mono mt-1.5">
            OPTICAL SENSING MATRIX
          </span>
        </div>
      </div>

      {/* Live Status Row */}
      <div className="flex items-center justify-between py-2 px-1 border-b border-[#202832]">
        <div className="flex flex-col">
          <span className="text-[9px] text-[#657180] uppercase tracking-wider font-mono">SCAN STATUS</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isComplete ? (
              <Check className="w-3 h-3 text-[#5C9B76]" />
            ) : isError ? (
              <AlertCircle className="w-3 h-3 text-[#A86464]" />
            ) : isActivelyScanning ? (
              <span className="w-2 h-2 rounded-full bg-[#8195AA] animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-[#5C9B76]/80" />
            )}
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ color: activeConf.statusColor }}
            >
              {activeConf.statusLabel}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] text-[#657180] uppercase tracking-wider font-mono">SYSTEM STATE</span>
          <div className="text-[11px] text-[#9AA5B3] font-mono mt-0.5">
            {activeConf.statusSub}
          </div>
        </div>
      </div>

      {/* Live Progress Bar */}
      <div className="space-y-1.5 px-1">
        <div className="flex items-center justify-between text-[10px] text-[#9AA5B3] font-mono">
          <span className="text-[#657180] uppercase tracking-wider">ANALYSIS PROGRESS</span>
          <span className="font-bold text-[#F3F5F7]">
            {activeConf.progressPercent}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#080B0F] rounded-full overflow-hidden border border-[#202832]">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${activeConf.progressPercent}%`,
              backgroundColor: activeConf.statusColor,
            }}
          />
        </div>
      </div>

      {/* Diagnostic Pipeline Steps */}
      <div className="pt-2 px-1">
        <div className="text-[9px] uppercase tracking-wider text-[#657180] font-mono mb-2">
          DIAGNOSTIC PIPELINE
        </div>
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {PIPELINE_STAGES.map((step, idx) => {
            const isFinished = activeConf.activePipelineIndex > idx;
            const isCurrent = activeConf.activePipelineIndex === idx;
            const isPending = activeConf.activePipelineIndex < idx;

            return (
              <div
                key={step.id}
                className={`flex flex-col items-center p-1.5 rounded border transition-colors duration-200 ${
                  isCurrent
                    ? 'border-[#8195AA] bg-[#080B0F]'
                    : isFinished
                    ? 'border-[#202832] bg-[#080B0F]/40'
                    : 'border-transparent bg-transparent opacity-60'
                }`}
              >
                <div className="flex items-center justify-center w-4 h-4 mb-1">
                  {isFinished ? (
                    <span className="text-[#5C9B76] text-xs font-bold">✓</span>
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#8195AA] animate-pulse" />
                  ) : (
                    <span className="text-[#657180] text-xs">○</span>
                  )}
                </div>
                <span
                  className={`text-[9px] font-mono font-bold tracking-tight ${
                    isCurrent
                      ? 'text-[#F3F5F7]'
                      : isFinished
                      ? 'text-[#9AA5B3]'
                      : 'text-[#657180]'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[7.5px] font-mono text-[#657180] hidden sm:inline">
                  {isCurrent ? '● RUNNING' : isFinished ? 'DONE' : 'PENDING'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed State Summary Badges */}
      {isComplete && (
        <div className="p-2.5 rounded-lg border border-[#5C9B76]/30 bg-[#5C9B76]/5 space-y-1.5 animate-fadeIn">
          <div className="text-[9px] uppercase tracking-widest text-[#5C9B76] font-mono font-bold flex items-center gap-1.5">
            <Check className="w-3 h-3" />
            <span>DIAGNOSIS TELEMETRY SUMMARY</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
            <div className="p-1.5 rounded bg-[#080B0F] border border-[#202832]">
              <div className="text-xs font-bold text-[#F3F5F7]">{detectedComponentsCount}</div>
              <div className="text-[8px] text-[#9AA5B3] uppercase">COMPONENTS DETECTED</div>
            </div>
            <div className="p-1.5 rounded bg-[#080B0F] border border-[#202832]">
              <div className="text-xs font-bold text-[#F3F5F7]">{replacementPartsCount}</div>
              <div className="text-[8px] text-[#9AA5B3] uppercase">REPLACEMENT PARTS</div>
            </div>
            <div className="p-1.5 rounded bg-[#080B0F] border border-[#202832]">
              <div className="text-xs font-bold text-[#F3F5F7]">{repairOpsCount}</div>
              <div className="text-[8px] text-[#9AA5B3] uppercase">REPAIR OPERATIONS</div>
            </div>
          </div>
        </div>
      )}

      {/* Live Technical Telemetry Matrix Grid */}
      <div className="space-y-1.5 text-[10px] text-[#9AA5B3] pt-1">
        <div className="flex items-center justify-between py-1 border-b border-[#202832]">
          <span className="text-[#657180] uppercase tracking-wider font-mono">VISION ENGINE</span>
          <span className="font-semibold" style={{ color: activeConf.statusColor }}>
            {activeConf.telemetry.visionEngine}
          </span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-[#202832]">
          <span className="text-[#657180] uppercase tracking-wider font-mono">IMAGE QUALITY</span>
          <span className="text-[#9AA5B3] font-semibold">
            {activeConf.telemetry.imageQuality}
          </span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-[#202832]">
          <span className="text-[#657180] uppercase tracking-wider font-mono">DAMAGE DETECTION</span>
          <span
            className="font-semibold"
            style={{
              color: isComplete
                ? '#5C9B76'
                : isActivelyScanning
                ? '#8195AA'
                : '#657180',
            }}
          >
            {activeConf.telemetry.damageDetection}
          </span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-[#202832]">
          <span className="text-[#657180] uppercase tracking-wider font-mono">OBJECT TRACKING</span>
          <span className="text-[#9AA5B3] font-semibold">
            {activeConf.telemetry.objectTracking}
          </span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-[#657180] uppercase tracking-wider font-mono">ANALYSIS STAGE</span>
          <span className="text-[#F3F5F7] font-bold">
            {activeConf.telemetry.analysisStage}
          </span>
        </div>
      </div>
    </div>
  );
}
