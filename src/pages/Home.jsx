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

  // ─── PAGE 1: CATEGORY SELECTION HUB (currentView === 'home') ─────────────
  if (currentView === 'home') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 animate-fadeIn">
        
        {/* Hero Banner */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20 shadow-inner">
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Next-Gen Damage Diagnostics Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Select item category & get repair blueprints <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">instantly.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Choose your device or hardware category below to open a dedicated AI diagnosis studio with tailored evidence breakdowns and Indian ₹ cost intelligence.
          </p>
        </section>

        {/* Category selection moved to Profile dashboard */}
        <section className="max-w-5xl mx-auto glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Category dashboard is available in Profile</span>
            </span>
            <span className="text-[11px] text-slate-500">Use Profile to open the studio</span>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section id="features" className="max-w-5xl mx-auto space-y-8 pt-6 border-t border-slate-900">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Clear & Actionable Diagnosis</h2>
            <p className="text-sm text-slate-400">Everything you need to decide whether to DIY or hire a professional</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <Camera className="w-8 h-8 text-blue-400" />
              <h4 className="font-bold text-white">Visual Damage Analysis</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clear breakdown of what is broken and root causes of material strain.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <Layers className="w-8 h-8 text-indigo-400" />
              <h4 className="font-bold text-white">Side-by-Side Blueprint</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Problem vs. Solution card layouts showing risk factors and tools required.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <FileCheck2 className="w-8 h-8 text-violet-400" />
              <h4 className="font-bold text-white">Cost & Time Estimates</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compare DIY component price ranges against professional service quotes.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <h4 className="font-bold text-white">Interactive Repair Steps</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step-by-step repair checklists with completion progress tracking.
              </p>
            </div>
          </div>
        </section>

      </div>
    );
  }

  // ─── PAGE 2: DEDICATED CATEGORY STUDIO PAGE (currentView === 'studio-category') ───
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={onBackToCategories}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors bg-slate-900 px-4 py-2 rounded-xl border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4 text-purple-400" />
          <span>Back to Category Selector</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span>Active Context:</span>
          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 flex items-center space-x-1">
            <span>{activeCategoryInfo.icon}</span>
            <span>{activeCategoryInfo.badge}</span>
          </span>
        </div>
      </div>

      {/* Dedicated Category Studio Hero Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-2 border-purple-500/40 bg-gradient-to-br from-purple-950/60 via-slate-950/90 to-blue-950/60 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-3xl shadow-lg shadow-purple-600/20 flex-shrink-0">
            {activeCategoryInfo.icon}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
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
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-slate-300">
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[11px] font-bold">2</span>
            <span>Upload Damage Photo for {activeCategoryInfo.title}</span>
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

