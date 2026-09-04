import React from 'react';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import LoadingState from '../components/LoadingState';
import { ITEM_CATEGORIES } from '../services/api';
import { 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  Layers, 
  Camera, 
  FileCheck2, 
  ArrowLeft, 
  ChevronRight, 
  Check, 
  HelpCircle,
  Wrench,
  Smartphone,
  Laptop,
  Car,
  Plug,
  Hammer
} from 'lucide-react';

const CATEGORY_INFO = {
  phone: {
    title: 'Smartphone & Tablet AI Diagnosis Studio',
    icon: '📱',
    badge: 'OLED & Display Specialist',
    description: 'Our computer vision engine for smartphones inspects front display glass shatter, OLED ink-bleed, touch digitiser responsiveness, and aluminum bezel frame dents.',
    whatToCapture: [
      'Close-up of glass crack or display shatter',
      'Clear overview of front display screen',
      'Model number sticker or back glass tag',
      'Good lighting with minimal surface glare'
    ]
  },
  electronics: {
    title: 'Electronics & PCB Circuit Board Studio',
    icon: '💻',
    badge: 'Micro-Soldering & Component Rework',
    description: 'Our PCB diagnostic models inspect power delivery IC thermal burns, VRM MOSFET carbonisation, SMD capacitor cracks, and multi-layer copper trace delamination.',
    whatToCapture: [
      'Close-up of burnt IC or charred component',
      'Top-down view of PCB motherboard',
      'Silkscreen part number or board revision tag',
      'Clear focus on damaged circuit traces'
    ]
  },
  auto: {
    title: 'Automotive Bodywork & Denting Studio',
    icon: '🚗',
    badge: 'Paint & Bodywork Specialist',
    description: 'Our automotive vision models measure bumper dent depth, clearcoat scratch abrasion, foreign paint transfer, and plastic valence flexion from curb contact.',
    whatToCapture: [
      'Close-up of scratch, dent, or scuff mark',
      'Overview of bumper or door panel section',
      'Door jamb VIN tag for paint code matching',
      'Side perspective showing dent depth'
    ]
  },
  appliance: {
    title: 'Home Appliance Diagnostic Studio',
    icon: '🔌',
    badge: 'Washing Machine & Appliance Specialist',
    description: 'Our appliance vision engine inspects front-load door bellow seal cracking, mould colonisation, rear spider bearing rust, and water leakage stains.',
    whatToCapture: [
      'Close-up of cracked rubber seal or rust',
      'Front overview of appliance/machine',
      'Rating tag with model code (e.g. WW65R)',
      'Clear lighting on affected component'
    ]
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
  isAnalyzing
}) {
  const hasAnyPhoto = Object.values(angles).some(Boolean);
  const activeCategoryInfo = CATEGORY_INFO[selectedCategory] || CATEGORY_INFO.phone;

  if (currentView === 'home') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fadeIn">
        <section className="space-y-6">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1.5 rounded-md border border-[#2a303a] bg-[#151922] text-[11px] font-medium uppercase tracking-[0.12em] text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6b7cff]"></span>
            <span>Diagnostic Workspace</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-white">
              Select a device category
            </h1>
            <p className="text-sm text-slate-400 leading-6">
              Choose a category to begin diagnostics, identify probable faults, and review recommended repair actions.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Primary Modules</div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {ITEM_CATEGORIES.filter((category) => ['phone', 'electronics', 'appliance'].includes(category.id)).map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategoryAndNavigate(category.id)}
                className="group flex items-center justify-between gap-4 rounded-xl border border-[#2a303a] bg-[#191d24] px-4 py-4 text-left transition-all duration-200 hover:border-[#3a4658] hover:bg-[#1d222b]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-lg border border-[#2a303a] bg-[#121821] flex items-center justify-center text-xl text-slate-100">
                    {category.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="text-lg font-medium tracking-[-0.02em] text-white group-hover:text-slate-100">
                      {category.label}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400 truncate">
                      {category.desc}
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center text-slate-300 group-hover:text-white transition-transform duration-200 group-hover:translate-x-0.5">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t border-[#2a303a]">
          <div className="glass-panel rounded-xl p-4 border border-[#2a303a]">
            <div className="text-[11px] uppercase tracking-[0.12em] text-slate-400 mb-3">Recent Activity</div>
            <div className="text-sm text-slate-200">No recent scans</div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-[#2a303a]">
            <div className="text-[11px] uppercase tracking-[0.12em] text-slate-400 mb-3">Quick Actions</div>
            <div className="space-y-2 text-sm text-slate-200">
              <div>Start new diagnosis</div>
              <div>Review saved reports</div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-[#2a303a]">
            <div className="text-[11px] uppercase tracking-[0.12em] text-slate-400 mb-3">Status</div>
            <div className="text-sm text-slate-200">Ready for inspection</div>
          </div>
        </section>
      </div>
    );
  }

  // ─── PAGE 2: DEDICATED CATEGORY STUDIO PAGE (currentView === 'studio-category') ───
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2a303a]">
        <button
          onClick={onBackToCategories}
          className="inline-flex items-center space-x-2 text-sm font-medium text-slate-300 hover:text-white transition-colors bg-[#191d24] px-4 py-2 rounded-lg border border-[#2a303a]"
        >
          <ArrowLeft className="w-4 h-4 text-slate-300" />
          <span>Back to categories</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span>Active context:</span>
          <span className="px-2.5 py-1 rounded-full bg-[#1d222b] text-slate-200 border border-[#2a303a] flex items-center space-x-1">
            <span>{activeCategoryInfo.icon}</span>
            <span>{activeCategoryInfo.badge}</span>
          </span>
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-xl border border-[#2a303a] bg-[#191d24] space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-xl bg-[#121821] border border-[#2a303a] flex items-center justify-center text-3xl flex-shrink-0">
            {activeCategoryInfo.icon}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-white">
              {activeCategoryInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1 max-w-3xl">
              {activeCategoryInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Upload & Diagnosis Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
            <span className="w-5 h-5 rounded-full bg-[#1d222b] border border-[#2a303a] text-slate-200 flex items-center justify-center text-[11px] font-medium">2</span>
            <span>Upload damage photo</span>
          </div>
        </div>

        {isAnalyzing ? (
          <LoadingState angles={angles} />
        ) : (
          <div className="space-y-6">
            
            {/* Single Uploader Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
              <ImageUploader
                angles={angles}
                selectedCategory={selectedCategory}
                onAngleUpdated={onAngleUpdated}
                onRemoveAngle={onRemoveAngle}
              />
            </div>

            {/* Photo Preview & Analysis CTA */}
            {hasAnyPhoto && (
              <ImagePreview
                angles={angles}
                onAnalyze={onAnalyze}
                onRemoveAngle={onRemoveAngle}
                onClearAll={onClearAllAngles}
              />
            )}

          </div>
        )}
      </section>

    </div>
  );
}

