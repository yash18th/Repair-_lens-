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
  CornerUpRight,
  Zap,
  Activity,
  Cpu
} from 'lucide-react';

export default function AnalysisCard({ result, angles, onReset, onUploadTargetAngle }) {
  const [completedSteps, setCompletedSteps] = useState([]);

  if (!result) return null;

  // STAGE 9: Dedicated Invalid Image / Category Mismatch UI
  if (
    result.status === 'invalid_image' ||
    result.isInvalidImage ||
    result.isInvalidCategory ||
    (result.valid_for_diagnosis === false && result.status !== 'no_visible_damage' && result.status !== 'insufficient_evidence')
  ) {
    return (
      <div className="w-full glass-panel rounded-3xl p-8 sm:p-10 border-2 border-red-500/40 bg-gradient-to-b from-slate-950/95 via-red-950/20 to-slate-950/95 text-center space-y-6 shadow-2xl animate-fadeIn relative overflow-hidden">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shadow-lg shadow-red-950/50">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <div className="space-y-3 max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider">
            <span>Image Not Suitable for Diagnosis</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Category & Object Mismatch
          </h3>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {result.rejectionReason || result.errorMessage || 'The uploaded image does not contain the selected device category.'}
          </p>

          {result.detectedObject && (
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-center gap-3">
              <span>Detected Object: <strong className="text-amber-300 uppercase">{result.detectedObject}</strong></span>
              <span>•</span>
              <span>Selected Studio: <strong className="text-indigo-300">{result.selectedCategory || 'Device'}</strong></span>
            </div>
          )}

          <p className="text-xs text-slate-400 pt-1">
            {result.suggestedAction || 'Please upload a clear, well-lit photo of the hardware device you want to inspect.'}
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onReset}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-xl transition-all duration-200 inline-flex items-center space-x-2"
          >
            <Camera className="w-4 h-4" />
            <span>Upload Correct Device Photo</span>
          </button>
        </div>
      </div>
    );
  }

  // Dedicated Service / API Error UI
  if (
    result.status === 'service_error' ||
    result.isServiceError ||
    (result.rejectionReason && (
      result.rejectionReason.includes('Gemini API') ||
      result.rejectionReason.includes('API key') ||
      result.rejectionReason.includes('service error')
    ))
  ) {
    return (
      <div className="w-full glass-panel rounded-3xl p-8 sm:p-10 border-2 border-violet-500/40 bg-gradient-to-b from-slate-950/95 via-violet-950/20 to-slate-950/95 text-center space-y-6 shadow-2xl animate-fadeIn relative overflow-hidden">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center shadow-lg shadow-violet-950/50">
          <Activity className="w-8 h-8 text-violet-400 animate-pulse" />
        </div>

        <div className="space-y-3 max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider">
            <span>AI Diagnostic Service Notice</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI Service Reconnecting
          </h3>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {result.rejectionReason || 'The AI diagnostic vision service is initializing endpoints or reconnecting with Google Gemini API.'}
          </p>

          <p className="text-xs text-slate-400 pt-1">
            Your image is valid. Please retry now to connect with the updated endpoint.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onReset}
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-sm shadow-xl transition-all duration-200 inline-flex items-center space-x-2"
          >
            <Camera className="w-4 h-4" />
            <span>Retry Diagnosis</span>
          </button>
        </div>
      </div>
    );
  }

  // STAGE 1: Dedicated Insufficient Visual Evidence UI
  if (result.status === 'insufficient_evidence' || result.isInsufficientEvidence) {
    return (
      <div className="w-full glass-panel rounded-3xl p-8 sm:p-10 border-2 border-amber-500/40 bg-gradient-to-b from-slate-950/95 via-amber-950/20 to-slate-950/95 text-center space-y-6 shadow-2xl animate-fadeIn relative overflow-hidden">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-950/50">
          <HelpCircle className="w-8 h-8 text-amber-400" />
        </div>

        <div className="space-y-3 max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <span>Insufficient Visual Evidence</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Image Unclear or Obstructed
          </h3>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {result.rejectionReason || result.detailedIssueExplanation || 'The uploaded photo does not have sufficient resolution, lighting, or focus to verify hardware condition.'}
          </p>

          <p className="text-xs text-slate-400 pt-1">
            {result.suggestedAction || 'Please take a closer, well-lit photo centered on the component and ensure no blur or reflections obstruct the view.'}
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onReset}
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-sm shadow-xl transition-all duration-200 inline-flex items-center space-x-2"
          >
            <Camera className="w-4 h-4" />
            <span>Retake Clear Photo</span>
          </button>
        </div>
      </div>
    );
  }

  // STAGE 10: Dedicated No Visible Damage UI
  if (result.status === 'no_visible_damage' || result.isNoVisibleDamage) {
    return (
      <div className="w-full space-y-8 animate-fadeIn">
        <div className="glass-panel rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-slate-950/95 via-emerald-950/20 to-slate-950/95 p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Physical Inspection Report</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                No Visible Physical Damage Detected
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                Exterior Intact
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-800/80 text-purple-300 border border-slate-700">
                <Brain className="w-3.5 h-3.5 mr-1 text-purple-400" />
                {result.confidenceEngine?.diagnosisConfidence || 95}% Confidence
              </span>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-emerald-950/25 border border-emerald-500/30 p-5 sm:p-6">
            <div className="flex items-center space-x-2 text-emerald-300 font-extrabold text-sm uppercase tracking-wider">
              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>Inspection Summary</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {result.plainEnglishSummary || 'The device exterior is intact with no visible fractures, dents, cracks, or burns.'}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {result.detailedIssueExplanation}
            </p>
          </div>

          {result.evidence && result.evidence.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Visual Evidence Confirmed:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300 pl-4 list-disc">
                {result.evidence.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-medium">Estimated External Repair Cost</div>
              <div className="text-2xl font-black text-emerald-400">₹0 <span className="text-xs font-normal text-slate-400">(No physical repair required)</span></div>
            </div>

            <button
              onClick={onReset}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all inline-flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Diagnose Another Device</span>
            </button>
          </div>
        </div>
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
          bg: 'bg-emerald-500/15',
          text: 'text-emerald-300',
          border: 'border-emerald-500/40',
          icon: CheckCircle2
        };
      case 'medium':
        return {
          label: 'Medium Severity',
          bg: 'bg-amber-500/15',
          text: 'text-amber-300',
          border: 'border-amber-500/40',
          icon: AlertTriangle
        };
      case 'high':
        return {
          label: 'High Severity',
          bg: 'bg-orange-500/15',
          text: 'text-orange-300',
          border: 'border-orange-500/40',
          icon: AlertTriangle
        };
      case 'critical':
      default:
        return {
          label: 'Critical Severity',
          bg: 'bg-red-500/15',
          text: 'text-red-300',
          border: 'border-red-500/40',
          icon: ShieldAlert
        };
    }
  };

  const severityBadge = getSeverityBadge(result.severity);
  const SeverityIcon = severityBadge.icon;

  const confidenceEngine = result.confidenceEngine || {
    diagnosisConfidence: 94,
    confidenceLevel: 'HIGH',
    evidenceQuality: 'GOOD',
    unknowns: 'Internal structural traces cannot be inspected without physical disassembly.',
    isLowConfidence: false
  };

  const isLowConfidence = confidenceEngine.isLowConfidence || confidenceEngine.diagnosisConfidence < 60;
  const samplePhotoUrl = Object.values(angles || {}).find(Boolean)?.previewUrl || '';

  const progressPercent = result.steps?.length 
    ? Math.round((completedSteps.length / result.steps.length) * 100)
    : 0;

  const affectedComponents = (result.affectedComponents && result.affectedComponents.length > 0)
    ? result.affectedComponents
    : [];

  const risksIfUnfixed = (result.risksIfUnfixed && result.risksIfUnfixed.length > 0)
    ? result.risksIfUnfixed
    : [];

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      
      {/* 🌟 HERO CARD: AI ISSUE DIAGNOSIS & CLEAR EXPLANATION */}
      <div className="glass-panel rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/95 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Ambient glow accent */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Eyebrow & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Damage & Issue Diagnosis Report</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {result.problemTitle || 'Hardware Damage Detected'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${severityBadge.bg} ${severityBadge.text} border ${severityBadge.border}`}>
              <SeverityIcon className="w-3.5 h-3.5 mr-1.5" />
              {severityBadge.label}
            </span>

            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/40">
              <Zap className="w-3.5 h-3.5 mr-1 text-indigo-400" />
              {result.urgency || 'Immediate Attention Required'}
            </span>

            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-800/80 text-purple-300 border border-slate-700">
              <Brain className="w-3.5 h-3.5 mr-1 text-purple-400" />
              {confidenceEngine.diagnosisConfidence}% Confidence
            </span>

            <button
              onClick={() => window.print()}
              className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>

        {/* 🧠 SECTION 1: WHAT IS THE ISSUE? (CLEAR PLAIN-ENGLISH EXPLANATION) */}
        <div className="space-y-3 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 p-5 sm:p-6 relative">
          <div className="flex items-center space-x-2 text-indigo-300 font-extrabold text-sm uppercase tracking-wider">
            <Brain className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <span>AI Plain-English Diagnosis (What is the Issue?)</span>
          </div>

          {/* Short Executive Summary */}
          {result.plainEnglishSummary && (
            <div className="text-base sm:text-lg font-bold text-white leading-relaxed border-l-4 border-indigo-500 pl-4 py-1">
              {result.plainEnglishSummary}
            </div>
          )}

          {/* Deep-Dive Technical Explanation */}
          <div className="text-sm sm:text-base text-slate-300 leading-relaxed space-y-2 pt-1">
            <p>
              {result.detailedIssueExplanation || result.problemDescription || result.problem}
            </p>
          </div>
        </div>

        {/* 🧩 SECTION 2: IDENTIFIED DAMAGED & AFFECTED COMPONENTS (ONLY IF REAL COMPONENTS FOUND) */}
        {affectedComponents.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Identified Damaged & Affected Hardware Components ({affectedComponents.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {affectedComponents.map((component, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 shadow-sm hover:border-purple-500/40 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
                  <span className="text-xs font-semibold leading-tight">{component}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ⚡ SECTION 3: CAUSE & CRITICAL RISKS (DYNAMIC) */}
        <div className={`grid grid-cols-1 ${risksIfUnfixed.length > 0 ? 'lg:grid-cols-2' : ''} gap-5 pt-2`}>
          
          {/* Left Column: Root Cause */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Root Cause (Why Did This Happen?)</span>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              {result.possibleCause || result.rootCause || result.likelyCause || 'Visual stress point or kinetic impact observed on the component.'}
            </p>

            {result.evidence && result.evidence.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Observed Visual Evidence:
                </span>
                <ul className="space-y-1 text-xs text-slate-400 pl-4 list-disc">
                  {result.evidence.map((item, idx) => (
                    <li key={idx} className="leading-snug">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Risks If Left Unfixed (Only if risks identified) */}
          {risksIfUnfixed.length > 0 && (
            <div className="p-5 rounded-xl bg-red-950/25 border border-red-500/30 space-y-3">
              <div className="flex items-center space-x-2 text-red-300 font-bold text-sm">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>Risks If Left Unfixed:</span>
              </div>

              <ul className="space-y-2 text-xs text-red-200/90 pl-4 list-disc">
                {risksIfUnfixed.map((risk, idx) => (
                  <li key={idx} className="leading-relaxed font-medium">
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* 🛠️ SECTION 4: 3 QUICK METRICS SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>AI Recommendation</span>
            </div>
            <p className="text-sm font-bold text-slate-100 line-clamp-2">
              {result.recommendation || result.solutionTitle}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
              <Wrench className="w-4 h-4 text-violet-400" />
              <span>Repair Complexity</span>
            </div>
            <p className="text-sm font-bold text-slate-100">
              {result.complexity || 'Moderate'}
            </p>
            <span className="text-[11px] text-slate-500 block">Professional tooling advised</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Estimated Duration</span>
            </div>
            <p className="text-sm font-bold text-slate-100">
              {result.timeEstimate || '45 - 60 minutes'}
            </p>
            <span className="text-[11px] text-slate-500 block">Average bench repair time</span>
          </div>
        </div>

      </div>

      {/* 🩻 INTERACTIVE AI DAMAGE MAP (BOUNDING BOXES ON THE DAMAGE) */}
      {result.damageMap && (
        <DamageMap
          damageMap={result.damageMap}
          sampleImage={samplePhotoUrl}
        />
      )}

      {/* 💰 INDIA REPAIR COST INTELLIGENCE */}
      {result.costIntelligence && (
        <CostBreakdown costIntelligence={result.costIntelligence} />
      )}

      {/* 📍 SWIGGY / ZOMATO STYLE NEARBY SERVICE CENTRE LOCATOR */}
      <NearbyRepairLocator category={result.category || 'phone'} />

      {/* 🛠️ STEP-BY-STEP REPAIR BLUEPRINT */}
      {result.steps && result.steps.length > 0 && (
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span>Step-by-Step Repair Blueprint</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Technical protocol for resolving this issue. Check off steps as they are completed.
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
      )}

      {/* 🎯 AI CONFIDENCE & TELEMETRY MATRIX (AT BOTTOM) */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-950/80 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>AI Confidence & Technical Limitations</span>
              </h3>
              <p className="text-xs text-slate-400">
                Diagnostic telemetry evaluated by vision inference models
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider text-[11px]">1. Model Confidence</span>
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
              <span className="font-bold uppercase tracking-wider text-[11px]">2. Visual Evidence Quality</span>
              <span className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] ${
                confidenceEngine.evidenceQuality === 'EXCELLENT' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                confidenceEngine.evidenceQuality === 'GOOD' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {confidenceEngine.evidenceQuality || 'GOOD'}
              </span>
            </div>

            <p className="text-xs text-slate-300 pt-1">
              Optical resolution & edge contrast analyzed by vision models.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400 block">
              3. Diagnostic Limitations
            </span>
            <p className="text-xs text-slate-300 leading-snug">
              {confidenceEngine.unknowns || result.whatWeCannotSee || 'Internal structural traces cannot be inspected without physical disassembly.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
