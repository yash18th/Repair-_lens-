import React from 'react';
import { Smartphone, Laptop, Cpu, Plug, Car, Package, Eye } from 'lucide-react';

const CATEGORY_ICONS = {
  phone: Smartphone,
  computer: Laptop,
  electronics: Cpu,
  appliance: Plug,
  vehicles: Car,
  other: Package,
};

export default function DiagnosticTelemetryScan({
  stage = 'idle',
  isAnalyzing = false,
  analysisResult = null,
  analysisError = null,
  angles = {},
  selectedCategory = 'phone',
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

  const isScanning = isAnalyzing || ['validating', 'analyzing', 'detecting_damage', 'identifying_components', 'calculating_cost'].includes(currentStage);

  // Extract first available preview photo
  const previewPhoto = Object.values(angles || {}).find((p) => p && p.previewUrl)?.previewUrl || null;
  const CategoryIcon = CATEGORY_ICONS[selectedCategory] || Smartphone;

  const getStatusBadge = () => {
    if (currentStage === 'error') {
      return { label: 'ANALYSIS FAILED', dot: 'bg-[#B35C5C]' };
    }
    if (currentStage === 'complete') {
      return { label: 'SCAN COMPLETE', dot: 'bg-[#4E9A6E]' };
    }
    if (isScanning) {
      return { label: 'ANALYZING', dot: 'bg-[#7D91AA] animate-pulse' };
    }
    return { label: 'STANDBY', dot: 'bg-[#687382]' };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className={`p-6 sm:p-7 rounded-xl border border-[#252D37] bg-[#11161D] space-y-4 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#F1F3F5]">
          Device Scan
        </span>
        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#151B23] border border-[#252D37] text-[11px] font-medium tracking-wide text-[#F1F3F5]">
          <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
          <span>{statusBadge.label}</span>
        </span>
      </div>

      {/* Clean Device / Image Scan Preview Area */}
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#090C11] border border-[#252D37] flex items-center justify-center group">
        {previewPhoto ? (
          <img
            src={previewPhoto}
            alt="Device for inspection"
            className="w-full h-full object-cover filter brightness-[0.92]"
          />
        ) : (
          /* Clean, calm device placeholder */
          <div className="flex flex-col items-center justify-center space-y-3 p-6 text-center">
            <div className="w-14 h-14 rounded-xl bg-[#11161D] border border-[#252D37] flex items-center justify-center text-[#7D91AA]">
              <CategoryIcon className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium text-[#F1F3F5]">
                No Image Loaded
              </div>
              <p className="text-[11px] text-[#687382] max-w-[220px]">
                Upload a photo to visualize device surface and damage inspection.
              </p>
            </div>
          </div>
        )}

        {/* Subtle Sweeping Scan Line when scanning */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#7D91AA] to-transparent shadow-[0_0_12px_rgba(125,145,170,0.8)] animate-scan-beam" />
          </div>
        )}

        {/* Small clean detection bounding box if damage identified or in progress */}
        {(isScanning || currentStage === 'complete') && previewPhoto && (
          <div className="absolute top-[28%] left-[24%] w-[42%] h-[36%] border border-[#B35C5C]/70 bg-[#B35C5C]/5 rounded-md pointer-events-none transition-all flex items-start justify-start p-1.5">
            <span className="px-1.5 py-0.5 rounded bg-[#090C11]/90 border border-[#B35C5C]/40 text-[9px] font-mono text-[#F1F3F5]">
              Surface Defect
            </span>
          </div>
        )}

        {/* Corner Scan Watermark */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-[#090C11]/85 border border-[#252D37] text-[10px] text-[#9CA6B3] font-mono pointer-events-none">
          {previewPhoto ? 'Optical Input Active' : 'Sensor Ready'}
        </div>
      </div>

      {/* Simplified Footer Details */}
      <div className="flex items-center justify-between text-xs text-[#9CA6B3] pt-1">
        <span className="capitalize">
          {selectedCategory} Inspection
        </span>
        <span className="font-mono text-[11px] text-[#687382]">
          {previewPhoto ? '1 Photo Analyzed' : 'Awaiting Input'}
        </span>
      </div>
    </div>
  );
}
