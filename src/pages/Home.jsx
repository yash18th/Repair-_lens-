import React from 'react';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import LoadingState from '../components/LoadingState';
import DiagnosticTelemetryScan from '../components/DiagnosticTelemetryScan';
import { ITEM_CATEGORIES } from '../services/api';
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Smartphone,
  Laptop,
  Cpu,
  Plug,
  Car,
  Package,
  Wrench
} from 'lucide-react';

const CATEGORY_ICON_COMPONENTS = {
  phone: Smartphone,
  computer: Laptop,
  electronics: Cpu,
  appliance: Plug,
  vehicles: Car,
  other: Package,
};

const CATEGORY_INFO = {
  phone: {
    title: 'Smartphone & Tablet',
    iconComponent: Smartphone,
    badge: 'DISPLAY & COMPONENT DIAGNOSTICS',
    description: 'Inspect display damage, battery faults, charging issues, and frame stress with structured multi-angle analysis.',
    whatToCapture: [
      'Close-up of glass crack or display shatter',
      'Clear overview of the device face',
      'Model number sticker or rear label',
      'Good lighting with minimal glare',
    ],
  },
  electronics: {
    title: 'Electronics & PCB',
    iconComponent: Cpu,
    badge: 'CIRCUIT BOARD TELEMETRY',
    description: 'Assess burned components, capacitor faults, VRM failure, and board-level issues through focused imaging.',
    whatToCapture: [
      'Close-up of burnt IC or charred component',
      'Top-down PCB layout photo',
      'Silkscreen part number or board revision tag',
      'Clear focus on damaged traces',
    ],
  },
  computer: { 
    title: 'Computers & Laptops', 
    iconComponent: Laptop,
    badge: 'SYSTEM ARCHITECTURE DIAGNOSTICS', 
    description: 'Assess visible screen, keyboard, hinge, casing, port and board damage.', 
    whatToCapture: ['Close-up of damaged area', 'Full device view', 'Model label', 'Side angle'] 
  },
  vehicles: {
    title: 'Vehicles',
    iconComponent: Car,
    badge: 'PANEL & EXTERIOR EVALUATION',
    description: 'Review visible body, bumper, light, glass and tyre damage. Hidden mechanical faults require physical inspection.',
    whatToCapture: [
      'Close-up of scratch or dent',
      'Overview of the panel surface',
      'VIN tag or paint-code reference',
      'Side angle for depth evaluation',
    ],
  },
  other: { 
    title: 'Other Equipment', 
    iconComponent: Package,
    badge: 'VISUAL REPAIR ASSESSMENT', 
    description: 'Assess visibly damaged repairable items and industrial equipment.', 
    whatToCapture: ['Close-up', 'Full object', 'Model label if available', 'Another angle'] 
  },
  appliance: {
    title: 'Home Appliance',
    iconComponent: Plug,
    badge: 'ELECTROMECHANICAL SYSTEMS',
    description: 'Examine seals, wiring, leakage points, and component wear for practical repair recommendations.',
    whatToCapture: [
      'Close-up of sealed joint or rust',
      'Front overview of the appliance',
      'Model label with ratings',
      'Clear lighting on the affected area',
    ],
  },
};

export default function Home({
  currentView,
  angles,
  selectedCategory,
  onSelectCategoryAndNavigate,
  onBackToCategories,
  onAngleUpdated,
  onRemoveAngle,
  onClearAllAngles,
  onAnalyze,
  analysisError,
  onStartDiagnosisRequest,
  isAnalyzing,
}) {
  const hasAnyPhoto = Object.values(angles).some(Boolean);
  const activeCategoryInfo = CATEGORY_INFO[selectedCategory] || CATEGORY_INFO.phone;
  const ActiveIconComponent = activeCategoryInfo.iconComponent || Smartphone;

  if (currentView === 'home') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fadeIn">
        {/* High-End Split Hero Section */}
        <section className="hero-panel tech-grid relative overflow-hidden rounded-xl border border-[#202731] bg-[#0B0E13] p-6 sm:p-8 lg:p-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_12px_32px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Headline & Action */}
            <div className="lg:col-span-7 space-y-5">
              <div className="eyebrow">
                <span className="gold-dot"></span>
                <span>DIAGNOSTIC WORKSPACE</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl md:text-6xl leading-[1.06] text-[#F5F7FA] tracking-[-0.035em] font-extrabold">
                  Diagnose with{' '}
                  <span className="bg-gradient-to-r from-[#8294AA] to-[#B8C5D3] bg-clip-text text-transparent">
                    precision engineered.
                  </span>
                </h1>
                <p className="max-w-xl text-sm sm:text-base text-[#A7B0BD] leading-relaxed">
                  Enterprise-grade device diagnostics, hardware failure telemetry, and guided teardown intelligence built for technicians and professional service desks.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    className="premium-button"
                    onClick={() => (onStartDiagnosisRequest ? onStartDiagnosisRequest('phone') : onSelectCategoryAndNavigate('phone'))}
                  >
                    <span>START A DIAGNOSIS</span>
                  </button>
                  <button
                    type="button"
                    className="premium-button-secondary"
                    onClick={() => onSelectCategoryAndNavigate('electronics')}
                  >
                    <span>VIEW CATEGORIES</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Real-time Diagnostic Telemetry Visual */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-[#202731] bg-[#10141A] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.4)] space-y-4 font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-[#181E26] text-[10px] uppercase tracking-wider text-[#A7B0BD]">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#8294AA]" />
                    <span className="font-bold text-[#F5F7FA]">DEVICE SCAN</span>
                  </div>
                  <span className="text-[#667180] text-[9px]">REAL-TIME TELEMETRY</span>
                </div>

                {/* Minimal Technical Device Outline & Scan Line */}
                <div className="relative h-28 rounded-lg bg-[#0C1015] border border-[#181E26] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 tech-grid opacity-25"></div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
                    <div className="w-14 h-18 rounded border border-[#8294AA]/40 flex items-center justify-center relative shadow-[inset_0_0_8px_rgba(130,148,170,0.1)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4F8A68]/80"></div>
                      <div className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-[#8294AA]"></div>
                      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 border-t border-r border-[#8294AA]"></div>
                      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b border-l border-[#8294AA]"></div>
                      <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-[#8294AA]"></div>
                      <div className="absolute inset-x-0 h-[1px] bg-[#8294AA]/60 animate-laser-scan"></div>
                    </div>
                    <span className="text-[8px] text-[#667180] tracking-widest uppercase font-mono">OPTICAL SENSING</span>
                  </div>
                </div>

                {/* Telemetry Matrix Grid */}
                <div className="space-y-1.5 text-[10px] text-[#A7B0BD] pt-1">
                  <div className="flex items-center justify-between py-1 border-b border-[#181E26]">
                    <span className="text-[#667180] uppercase tracking-wider">SCAN STATUS</span>
                    <span className="text-[#4F8A68] font-semibold">READY</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#181E26]">
                    <span className="text-[#667180] uppercase tracking-wider">IMAGE ANALYSIS</span>
                    <span className="text-[#8294AA] font-semibold">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#181E26]">
                    <span className="text-[#667180] uppercase tracking-wider">DAMAGE DETECTION</span>
                    <span className="text-[#4F8A68] font-semibold">READY</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#667180] uppercase tracking-wider">CONFIDENCE</span>
                    <span className="text-[#F5F7FA] font-bold">98.4%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Diagnostic Modules Section */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between gap-4 px-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#667180] font-mono">
              DIAGNOSTIC MODULES // SELECT TARGET HARDWARE
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ITEM_CATEGORIES.map((category, index) => {
              const IconComponent = CATEGORY_ICON_COMPONENTS[category.id] || Wrench;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onSelectCategoryAndNavigate(category.id)}
                  className="category-card group p-5 text-left border border-[#202731] hover:border-[#283240] bg-[#10141A] hover:bg-[#141922] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono font-bold text-[#667180] tracking-[0.14em]">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-[#0C1015] border border-[#202731] flex items-center justify-center text-[#8294AA] group-hover:text-[#F5F7FA] transition-colors shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-[#F5F7FA] tracking-tight group-hover:text-white transition-colors">
                        {category.label}
                      </h3>
                      <p className="text-xs text-[#A7B0BD] leading-relaxed line-clamp-2">
                        {category.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#181E26] flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.12em] text-[#667180] group-hover:text-[#A7B0BD]">
                    <span>MODULE READY</span>
                    <ArrowRight className="w-3.5 h-3.5 card-arrow transition-transform duration-180" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Telemetry Status Metrics Bar */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#202731]">
          <div className="small-stat p-4">
            <div className="text-[9px] uppercase tracking-[0.16em] text-[#667180] font-mono mb-1.5">RECENT ACTIVITY</div>
            <div className="text-xs font-semibold text-[#F5F7FA]">No active scan records</div>
          </div>

          <div className="small-stat p-4">
            <div className="text-[9px] uppercase tracking-[0.16em] text-[#667180] font-mono mb-1.5">SYSTEM PROTOCOL</div>
            <div className="text-xs text-[#A7B0BD] font-medium">Multi-angle optical vision fusion</div>
          </div>

          <div className="small-stat p-4">
            <div className="text-[9px] uppercase tracking-[0.16em] text-[#667180] font-mono mb-1.5">WORKSPACE STATUS</div>
            <div className="text-xs font-semibold text-[#F5F7FA] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F8A68]" />
              <span>Diagnostic core online & ready</span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#202731]">
        <button
          onClick={onBackToCategories}
          className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#A7B0BD] hover:text-[#F5F7FA] transition-colors border border-[#202731] bg-[#10141A] hover:bg-[#141922] px-3 py-2 rounded-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to categories</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#A7B0BD] font-mono">
          <span className="text-[#667180]">ACTIVE CONTEXT:</span>
          <span className="px-2.5 py-1 border border-[#202731] bg-[#10141A] text-[#F5F7FA] rounded-md flex items-center gap-2 text-[10px] tracking-wider">
            <ActiveIconComponent className="w-3.5 h-3.5 text-[#8294AA]" />
            <span>{activeCategoryInfo.badge}</span>
          </span>
        </div>
      </div>

      <div className="premium-panel p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-[#0C1015] border border-[#202731] flex items-center justify-center text-[#8294AA] flex-shrink-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
            <ActiveIconComponent className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7FA] tracking-tight">
              {activeCategoryInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#A7B0BD] leading-relaxed mt-1 max-w-3xl">
              {activeCategoryInfo.description}
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[#A7B0BD]">
            <span className="w-5 h-5 rounded border border-[#202731] bg-[#10141A] text-[#F5F7FA] flex items-center justify-center text-[10px]">2</span>
            <span>Upload Inspection Photos</span>
          </div>
        </div>

        {isAnalyzing ? (
          <LoadingState angles={angles} />
        ) : (
          <div className="space-y-6">
            <div className="premium-panel p-6 sm:p-8">
              <ImageUploader
                angles={angles}
                selectedCategory={selectedCategory}
                onAngleUpdated={onAngleUpdated}
                onRemoveAngle={onRemoveAngle}
              />
            </div>

            {hasAnyPhoto && (
              <>
                {analysisError && (
                  <div role="alert" className="rounded-xl border border-[#A65D5D]/40 bg-[#A65D5D]/10 px-4 py-3 text-xs font-mono text-[#fca5a5]">
                    {analysisError}
                  </div>
                )}
                <ImagePreview
                  angles={angles}
                  onAnalyze={onAnalyze}
                  onRemoveAngle={onRemoveAngle}
                  onClearAll={onClearAllAngles}
                />
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
