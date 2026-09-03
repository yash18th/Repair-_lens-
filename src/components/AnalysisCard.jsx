import React, { useState } from 'react';
import DamageMap from './DamageMap';
import CostBreakdown from './CostBreakdown';
import NearbyRepairLocator from './NearbyRepairLocator';
import { 
  AlertTriangle, 
  DollarSign, 
  Wrench, 
  UserCheck, 
  Info, 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  ShieldAlert, 
  Clock,
  Sparkles,
  Award,
  Tag,
  Printer,
  ShieldCheck,
  Check,
  Brain,
  Eye,
  Camera,
  Layers,
  ArrowRight,
  HelpCircle,
  Search,
  Focus,
  CornerUpRight
} from 'lucide-react';

export default function AnalysisCard({ result, angles, onReset, onUploadTargetAngle }) {
  const [completedSteps, setCompletedSteps] = useState([]);

  if (!result) return null;

  // Handle Invalid Category Error
  if (result.isInvalidCategory || result.success === false) {
    return (
      <div className="w-full glass-panel rounded-2xl p-8 border-2 border-red-500/50 bg-red-950/30 text-center space-y-6 shadow-2xl animate-fadeIn">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="text-2xl font-black text-white">Invalid Image Content Detected</h3>
          <p className="text-sm text-red-200/90 leading-relaxed">
            {result.errorMessage || 'The uploaded photo does not match the active Smartphone & Tablet studio category. Please upload a clear photo of a smartphone display or chassis.'}
          </p>
        </div>

        <button
          onClick={onReset}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-xl transition-all duration-200 inline-flex items-center space-x-2"
        >
          <Camera className="w-4 h-4" />
          <span>Upload Phone Photo Again</span>
        </button>
      </div>
    );
  }

  const toggleStep = (index) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(i => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low':
        return {
          label: 'Low Severity',
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-400',
          border: 'border-emerald-500/30',
          icon: CheckCircle2
        };
      case 'medium':
        return {
          label: 'Medium Severity',
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          border: 'border-amber-500/30',
          icon: AlertTriangle
        };
      case 'high':
        return {
          label: 'High Severity',
          bg: 'bg-orange-500/10',
          text: 'text-orange-400',
          border: 'border-orange-500/30',
          icon: AlertTriangle
        };
      case 'critical':
      default:
        return {
          label: 'Critical Severity',
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          border: 'border-red-500/30',
          icon: ShieldAlert
        };
    }
  };

  const severityBadge = getSeverityBadge(result.severity);
  const SeverityIcon = severityBadge.icon;

  const confidenceEngine = result.confidenceEngine || {
    diagnosisConfidence: 87,
    confidenceLevel: 'HIGH',
    evidenceQuality: 'GOOD',
    unknowns: 'Internal structural damage cannot be determined from surface photos alone.',
    isLowConfidence: false
  };

  const isLowConfidence = confidenceEngine.isLowConfidence || confidenceEngine.diagnosisConfidence < 60;
  const nextPhotoGuide = result.guidedNextPhotoRequest;
  const samplePhotoUrl = Object.values(angles || {}).find(Boolean)?.previewUrl || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800';

  const progressPercent = result.steps?.length 
    ? Math.round((completedSteps.length / result.steps.length) * 100)
    : 0;

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      
      {/* Disclaimer Banner */}
      {result.isMockData && (
        <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs flex items-start space-x-3 shadow-lg">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-blue-200 block">AI Vision Engine Intelligence Summary</span>
            <p className="text-blue-300/90 leading-relaxed">
              {result.disclaimer || 'Backend AI vision inference pipeline is ready to be linked to live models.'}
            </p>
          </div>
        </div>
      )}

      {/* 🎯 AI CONFIDENCE & UNCERTAINTY ENGINE CARD */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-indigo-500/40 bg-slate-950/90 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
                <span>AI Confidence & Uncertainty Engine</span>
              </h3>
              <p className="text-xs text-slate-400">
                3-Dimensional Intelligence & Limitation Matrix
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider text-[11px]">1. Diagnosis Confidence</span>
              <span className={`font-bold font-mono ${isLowConfidence ? 'text-amber-400' : 'text-emerald-400'}`}>
                {confidenceEngine.diagnosisConfidence}%
              </span>
            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  isLowConfidence 
                    ? 'bg-amber-500' 
                    : confidenceEngine.diagnosisConfidence >= 90 
                    ? 'bg-emerald-400' 
                    : 'bg-blue-500'
                }`}
                style={{ width: `${confidenceEngine.diagnosisConfidence}%` }}
              ></div>
            </div>

            <span className="text-[11px] text-slate-500 block font-mono">
              Status: <span className="text-slate-300 font-bold">{confidenceEngine.confidenceLevel || (isLowConfidence ? 'LOW' : 'HIGH')}</span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider text-[11px]">2. Evidence Quality</span>
              <span className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] ${
                confidenceEngine.evidenceQuality === 'EXCELLENT' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                confidenceEngine.evidenceQuality === 'GOOD' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {confidenceEngine.evidenceQuality || 'GOOD'}
              </span>
            </div>

            <p className="text-xs text-slate-300 pt-1">
              Visual resolution & perspective angles evaluated by vision models.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400 block">
              3. Unknown / Limitations
            </span>
            <p className="text-xs text-slate-300 leading-snug">
              {confidenceEngine.unknowns || result.whatWeCannotSee || 'Internal structural damage cannot be determined.'}
            </p>
          </div>
        </div>
      </div>

      {/* 💰 INDIA REPAIR COST INTELLIGENCE */}
      <CostBreakdown costIntelligence={result.costIntelligence} />

      {/* 📍 SWIGGY / ZOMATO STYLE NEARBY SERVICE CENTRE LOCATOR */}
      <NearbyRepairLocator category={result.category || 'phone'} />

      {/* 🩻 INTERACTIVE AI DAMAGE MAP */}
      <DamageMap
        damageMap={result.damageMap}
        sampleImage={samplePhotoUrl}
      />

      {/* Main Diagnosis Title Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${severityBadge.bg} ${severityBadge.text} border ${severityBadge.border}`}>
                <SeverityIcon className="w-3.5 h-3.5 mr-1.5" />
                {severityBadge.label}
              </span>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-400" />
                Confidence: {confidenceEngine.diagnosisConfidence}%
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {result.problemTitle || result.problem}
            </h2>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center space-x-2"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print Blueprint</span>
            </button>
          </div>

        </div>

        {/* 3 Core Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>Recommendation</span>
            </div>
            <p className="text-lg font-bold text-slate-100 truncate">
              {result.recommendation}
            </p>
            <span className="text-[11px] text-slate-500 block">
              {result.diySuitabilityScore ? `${result.diySuitabilityScore}% DIY suitability` : 'High'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
              <Wrench className="w-4 h-4 text-violet-400" />
              <span>Repair Complexity</span>
            </div>
            <p className="text-lg font-bold text-slate-100">
              {result.complexity || 'Moderate'}
            </p>
            <span className="text-[11px] text-slate-500 block">Skill level required</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Estimated Duration</span>
            </div>
            <p className="text-lg font-bold text-slate-100">
              {result.timeEstimate || '1 - 2 hours'}
            </p>
            <span className="text-[11px] text-slate-500 block">Average duration</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side 2-Column Cards: 🔴 THE PROBLEM vs 🟢 THE SOLUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-red-500/30 bg-slate-950/80 space-y-5">
          <div className="flex items-center space-x-2 text-red-400 font-extrabold text-lg border-b border-slate-800 pb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span>1. What is Broken (The Problem)</span>
          </div>

          <div className="space-y-3 text-sm text-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Damage Summary</span>
              <p className="leading-relaxed text-slate-300">
                {result.problemDescription || result.problem}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Likely Cause</span>
              <p className="leading-relaxed text-slate-300">
                {result.possibleCause}
              </p>
            </div>

            {result.risksIfUnfixed && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs space-y-2 mt-4">
                <span className="font-bold text-red-300 flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Risks If Left Unfixed:</span>
                </span>
                <ul className="space-y-1.5 text-red-200/90 pl-5 list-disc">
                  {result.risksIfUnfixed.map((risk, idx) => (
                    <li key={idx}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 bg-slate-950/80 space-y-5">
          <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-lg border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>2. How to Fix It (The Solution)</span>
          </div>

          <div className="space-y-4 text-sm text-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Recommended Repair Plan</span>
              <h4 className="font-bold text-white text-base mb-1">
                {result.solutionTitle || result.recommendation}
              </h4>
              <p className="leading-relaxed text-slate-300">
                {result.solutionDescription || 'Follow the step-by-step repair guide below to safely unbolt, replace, and re-seal the component.'}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Tools & Supplies Needed</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(result.toolsRequired || ['Standard Hand Tools', 'Safety Glasses', 'Cleaning Wipe']).map((tool, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800 text-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Interactive Repair Guide */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span>Step-by-Step Repair Blueprint</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Click checkboxes as you perform each step to track your repair progress.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">Progress:</span>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
        </div>

        <div className="space-y-4">
          {result.steps?.map((step, idx) => {
            const isCompleted = completedSteps.includes(idx);

            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`cursor-pointer p-5 rounded-xl border transition-all duration-200 flex items-start space-x-4 ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                    : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isCompleted ? (
                    <CheckSquare className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Square className="w-6 h-6 text-slate-500 group-hover:text-slate-300" />
                  )}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-purple-400 font-bold">
                      Step {idx + 1}
                    </span>
                    <h4 className={`font-bold text-base ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                      {step.title}
                    </h4>
                  </div>
                  <p className={`text-sm leading-relaxed ${isCompleted ? 'text-slate-500' : 'text-slate-300'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
