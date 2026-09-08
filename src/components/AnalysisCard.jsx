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

export default function AnalysisCard({ result, angles, onReset, onRetry, onUploadTargetAngle }) {
  const [completedSteps, setCompletedSteps] = useState([]);

  if (!result) return null;

  // Dedicated AI Analysis Format / Parser Error UI
  if (result.status === 'analysis_error' || result.isAnalysisError) {
    return (
      <div className="w-full rounded-xl p-6 sm:p-8 border border-[#202731] bg-[#10141A] text-center space-y-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.4)] animate-fadeIn relative overflow-hidden">
        <div className="w-12 h-12 mx-auto rounded-lg bg-[#141922] border border-[#202731] flex items-center justify-center">
          <Brain className="w-6 h-6 text-[#A7B0BD]" />
        </div>

        <div className="space-y-2.5 max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#141922] border border-[#202731] text-[#A7B0BD] text-[10px] font-mono uppercase tracking-wider">
            <span>Diagnostic Notice</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#F5F7FA] tracking-tight">
            Analysis could not be completed
          </h3>

          <p className="text-xs sm:text-sm text-[#A7B0BD] leading-relaxed">
            {result.rejectionReason || 'The vision inference model returned an unverified format. Please retry.'}
          </p>

          <p className="text-xs text-[#667180] pt-0.5">
            Your uploaded image is saved and ready.
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={onRetry || onReset}
            className="px-4 py-2 rounded-lg border border-[#283240] bg-[#141922] hover:bg-[#1A222E] text-[#F5F7FA] font-semibold text-xs tracking-wider uppercase transition-colors inline-flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A7B0BD]" />
            <span>Retry Diagnosis</span>
          </button>
        </div>
      </div>
    );
  }

  // Dedicated Provider Service / Rate Limit (429/503) Error UI
  if (
    result.status === 'provider_error' ||
    result.isProviderError ||
    result.status === 'service_error' ||
    result.isServiceError
  ) {
    return (
      <div className="w-full rounded-xl p-6 sm:p-8 border border-[#202731] bg-[#10141A] text-center space-y-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.4)] animate-fadeIn relative overflow-hidden">
        <div className="w-12 h-12 mx-auto rounded-lg bg-[#141922] border border-[#202731] flex items-center justify-center">
          <Activity className="w-6 h-6 text-[#A7B0BD]" />
        </div>

        <div className="space-y-2.5 max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#141922] border border-[#202731] text-[#A7B0BD] text-[10px] font-mono uppercase tracking-wider">
            <span>Service Availability</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#F5F7FA] tracking-tight">
            Diagnostic service temporarily unavailable
          </h3>

          <p className="text-xs sm:text-sm text-[#A7B0BD] leading-relaxed">
            {result.rejectionReason || 'The AI diagnostic vision service is busy. Please retry in a few moments.'}
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onRetry || onReset}
            className="px-4 py-2 rounded-lg border border-[#283240] bg-[#141922] hover:bg-[#1A222E] text-[#F5F7FA] font-semibold text-xs tracking-wider uppercase transition-colors inline-flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <Activity className="w-3.5 h-3.5 text-[#A7B0BD]" />
            <span>Retry Diagnosis</span>
          </button>
        </div>
      </div>
    );
  }

  // STAGE 9: Dedicated Invalid Image / Category Mismatch UI
  if (
    result.status === 'invalid_image' ||
    result.isInvalidImage ||
    result.isInvalidCategory ||
    (result.valid_for_diagnosis === false && result.status !== 'no_visible_damage' && result.status !== 'insufficient_evidence')
  ) {
    return (
      <div className="w-full rounded-xl p-6 sm:p-8 border border-[#A65D5D]/30 bg-[#10141A] text-center space-y-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.4)] animate-fadeIn relative overflow-hidden">
        <div className="w-12 h-12 mx-auto rounded-lg bg-[#141922] border border-[#202731] flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-[#A65D5D]" />
        </div>

        <div className="space-y-2.5 max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#A65D5D]/10 border border-[#A65D5D]/30 text-[#A65D5D] text-[10px] font-mono uppercase tracking-wider">
            <span>Category Verification</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#F5F7FA] tracking-tight">
            Image not suitable for this category
          </h3>

          <p className="text-xs sm:text-sm text-[#A7B0BD] leading-relaxed">
            {result.rejectionReason || result.errorMessage || 'The uploaded image does not contain the selected device category.'}
          </p>

          {result.detectedObject && (
            <div className="p-3 rounded-lg bg-[#0C1015] border border-[#202731] text-xs text-[#A7B0BD] flex items-center justify-center gap-3">
              <span>Detected: <strong className="text-[#F5F7FA] uppercase">{result.detectedObject}</strong></span>
              <span>•</span>
              <span>Selected: <strong className="text-[#F5F7FA]">{result.selectedCategory || 'Device'}</strong></span>
            </div>
          )}

          <p className="text-xs text-[#667180] pt-0.5">
            {result.suggestedAction || 'Please upload a clear, well-lit photo of the hardware device you want to inspect.'}
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg border border-[#283240] bg-[#141922] hover:bg-[#1A222E] text-[#F5F7FA] font-semibold text-xs tracking-wider uppercase transition-colors inline-flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-[#A7B0BD]" />
            <span>Upload Device Photo</span>
          </button>
        </div>
      </div>
    );
  }

  // STAGE 1: Dedicated Insufficient Visual Evidence UI
  if (result.status === 'insufficient_evidence' || result.isInsufficientEvidence) {
    return (
      <div className="w-full rounded-xl p-6 sm:p-8 border border-[#A7834F]/30 bg-[#10141A] text-center space-y-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.4)] animate-fadeIn relative overflow-hidden">
        <div className="w-12 h-12 mx-auto rounded-lg bg-[#141922] border border-[#202731] flex items-center justify-center">
          <HelpCircle className="w-6 h-6 text-[#A7834F]" />
        </div>

        <div className="space-y-2.5 max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#A7834F]/10 border border-[#A7834F]/30 text-[#A7834F] text-[10px] font-mono uppercase tracking-wider">
            <span>Visual Evidence Check</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#F5F7FA] tracking-tight">
            Insufficient visual evidence
          </h3>

          <p className="text-xs sm:text-sm text-[#A7B0BD] leading-relaxed">
            {result.rejectionReason || result.detailedIssueExplanation || 'The uploaded photo does not have sufficient resolution or clarity to verify condition.'}
          </p>

          <p className="text-xs text-[#667180] pt-0.5">
            {result.suggestedAction || 'Please take a closer, well-lit photo centered on the component.'}
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg border border-[#283240] bg-[#141922] hover:bg-[#1A222E] text-[#F5F7FA] font-semibold text-xs tracking-wider uppercase transition-colors inline-flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-[#A7B0BD]" />
            <span>Retake Photo</span>
          </button>
        </div>
      </div>
    );
  }

  // STAGE 10: Dedicated No Visible Damage UI
  if (result.status === 'no_visible_damage' || result.isNoVisibleDamage) {
    return (
      <div className="w-full space-y-6 animate-fadeIn">
        <div className="rounded-xl border border-[#202731] bg-[#10141A] p-6 sm:p-8 space-y-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.4)] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202731] pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#4F8A68]">
                <ShieldCheck className="w-4 h-4 text-[#4F8A68]" />
                <span>Physical Inspection Report</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FA] tracking-tight">
                No Visible Physical Damage Detected
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#4F8A68]/15 text-[#4F8A68] border border-[#4F8A68]/30">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#4F8A68]" />
                Exterior Intact
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#141922] text-[#A7B0BD] border border-[#202731]">
                {result.confidenceEngine?.diagnosisConfidence || 95}% Confidence
              </span>
            </div>
          </div>

          <div className="space-y-3 rounded-lg bg-[#0C1015] border border-[#202731] p-4 sm:p-5">
            <div className="flex items-center space-x-2 text-[#A7B0BD] font-semibold text-xs uppercase tracking-wider">
              <Check className="w-4 h-4 text-[#4F8A68] flex-shrink-0" />
              <span>Inspection Summary</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-[#F5F7FA] leading-relaxed">
              {result.plainEnglishSummary || 'The device exterior is intact with no visible fractures, dents, cracks, or burns.'}
            </p>
            <p className="text-xs sm:text-sm text-[#A7B0BD] leading-relaxed">
              {result.detailedIssueExplanation}
            </p>
          </div>

          {result.evidence && result.evidence.length > 0 && (
            <div className="p-4 rounded-lg bg-[#0C1015] border border-[#202731] space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A7B0BD] block">
                Visual Evidence Confirmed:
              </span>
              <ul className="space-y-1 text-xs text-[#A7B0BD] pl-4 list-disc">
                {result.evidence.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-4 rounded-lg bg-[#0C1015] border border-[#202731] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[#667180] font-medium">Estimated External Repair Cost</div>
              <div className="text-xl font-bold text-[#4F8A68]">₹0 <span className="text-xs font-normal text-[#667180]">(No repair required)</span></div>
            </div>

            <button
              onClick={onReset}
              className="px-4 py-2 rounded-lg border border-[#283240] bg-[#141922] hover:bg-[#1A222E] text-[#F5F7FA] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-[#A7B0BD]" />
              <span>Inspect Another Device</span>
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
          bg: 'bg-[#4F8A68]/15',
          text: 'text-[#4F8A68]',
          border: 'border-[#4F8A68]/30',
          icon: CheckCircle2
        };
      case 'medium':
        return {
          label: 'Medium Severity',
          bg: 'bg-[#A7834F]/15',
          text: 'text-[#A7834F]',
          border: 'border-[#A7834F]/30',
          icon: AlertTriangle
        };
      case 'high':
        return {
          label: 'High Severity',
          bg: 'bg-[#A65D5D]/15',
          text: 'text-[#A65D5D]',
          border: 'border-[#A65D5D]/30',
          icon: AlertTriangle
        };
      case 'critical':
      default:
        return {
          label: 'Critical Severity',
          bg: 'bg-[#A65D5D]/15',
          text: 'text-[#A65D5D]',
          border: 'border-[#A65D5D]/30',
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
    <div className="w-full space-y-6 animate-fadeIn">
      
      {/* 🌟 HERO CARD: AI ISSUE DIAGNOSIS & CLEAR EXPLANATION */}
      <div className="rounded-xl border border-[#202731] bg-[#10141A] p-6 sm:p-8 space-y-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.4)] relative overflow-hidden">
        
        {/* Header Eyebrow & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202731] pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#8294AA]">
              <Sparkles className="w-3.5 h-3.5 text-[#8294AA]" />
              <span>AI Damage & Issue Diagnosis Report</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7FA] tracking-tight leading-snug">
              {result.problemTitle || 'Hardware Damage Detected'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${severityBadge.bg} ${severityBadge.text} border ${severityBadge.border}`}>
              <SeverityIcon className="w-3.5 h-3.5 mr-1" />
              {severityBadge.label}
            </span>

            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#141922] text-[#A7B0BD] border border-[#202731]">
              <Zap className="w-3.5 h-3.5 mr-1 text-[#8294AA]" />
              {result.urgency || 'Immediate Attention Required'}
            </span>

            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#141922] text-[#A7B0BD] border border-[#202731] font-mono">
              {confidenceEngine.diagnosisConfidence}% Confidence
            </span>

            <button
              onClick={() => window.print()}
              className="px-2.5 py-1 rounded-md bg-[#0C1015] hover:bg-[#141922] text-[#A7B0BD] hover:text-[#F5F7FA] text-xs font-medium border border-[#202731] transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>

        {/* 🧠 SECTION 1: WHAT IS THE ISSUE? (CLEAR EXPLANATION) */}
        <div className="space-y-3 rounded-lg bg-[#0C1015] border border-[#202731] p-5 sm:p-6 relative">
          <div className="flex items-center space-x-2 text-[#A7B0BD] font-semibold text-xs uppercase tracking-wider">
            <Brain className="w-4 h-4 text-[#8294AA] flex-shrink-0" />
            <span>AI Plain-English Diagnosis</span>
          </div>

          {/* Short Summary */}
          {result.plainEnglishSummary && (
            <div className="text-base sm:text-lg font-semibold text-[#F5F7FA] leading-relaxed border-l-2 border-[#8294AA] pl-3 py-0.5">
              {result.plainEnglishSummary}
            </div>
          )}

          {/* Deep-Dive Technical Explanation */}
          <div className="text-xs sm:text-sm text-[#A7B0BD] leading-relaxed space-y-2 pt-1">
            <p>
              {result.detailedIssueExplanation || result.problemDescription || result.problem}
            </p>
          </div>
        </div>

        {/* 🧩 SECTION 2: IDENTIFIED DAMAGED COMPONENTS */}
        {affectedComponents.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#A7B0BD]">
              <Cpu className="w-3.5 h-3.5 text-[#8294AA]" />
              <span>Identified Damaged & Affected Hardware Components ({affectedComponents.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {affectedComponents.map((component, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center space-x-2.5 p-3 rounded-lg bg-[#0C1015] border border-[#202731] text-[#F5F7FA] shadow-sm"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#A65D5D] flex-shrink-0" />
                  <span className="text-xs font-medium leading-tight">{component}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ⚡ SECTION 3: CAUSE & RISKS */}
        <div className={`grid grid-cols-1 ${risksIfUnfixed.length > 0 ? 'lg:grid-cols-2' : ''} gap-4 pt-1`}>
          
          {/* Left Column: Root Cause */}
          <div className="p-4 sm:p-5 rounded-lg bg-[#0C1015] border border-[#202731] space-y-2.5">
            <div className="flex items-center space-x-2 text-[#A7834F] font-semibold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-[#A7834F] flex-shrink-0" />
              <span>Root Cause Analysis</span>
            </div>
            
            <p className="text-xs sm:text-sm text-[#A7B0BD] leading-relaxed">
              {result.possibleCause || result.rootCause || result.likelyCause || 'Visual stress point or kinetic impact observed on the component.'}
            </p>

            {result.evidence && result.evidence.length > 0 && (
              <div className="pt-2 border-t border-[#202731] space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#667180] block">
                  Observed Visual Evidence:
                </span>
                <ul className="space-y-1 text-xs text-[#A7B0BD] pl-4 list-disc">
                  {result.evidence.map((item, idx) => (
                    <li key={idx} className="leading-snug">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Risks */}
          {risksIfUnfixed.length > 0 && (
            <div className="p-4 sm:p-5 rounded-lg bg-[#0C1015] border border-[#A65D5D]/25 space-y-2.5">
              <div className="flex items-center space-x-2 text-[#A65D5D] font-semibold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5 text-[#A65D5D] flex-shrink-0" />
                <span>Risks If Left Unfixed</span>
              </div>

              <ul className="space-y-1.5 text-xs text-[#A7B0BD] pl-4 list-disc">
                {risksIfUnfixed.map((risk, idx) => (
                  <li key={idx} className="leading-relaxed font-medium">
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* 🛠️ SECTION 4: QUICK METRICS SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#202731]">
          <div className="p-3.5 rounded-lg bg-[#0C1015] border border-[#202731] space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-[#667180] font-medium">
              <UserCheck className="w-3.5 h-3.5 text-[#A7B0BD]" />
              <span>Recommendation</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#F5F7FA] line-clamp-2">
              {result.recommendation || result.solutionTitle}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0C1015] border border-[#202731] space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-[#667180] font-medium">
              <Wrench className="w-3.5 h-3.5 text-[#A7B0BD]" />
              <span>Repair Complexity</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#F5F7FA]">
              {result.complexity || 'Moderate'}
            </p>
            <span className="text-[10px] text-[#667180] block">Standard bench repair</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0C1015] border border-[#202731] space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-[#667180] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#A7B0BD]" />
              <span>Estimated Duration</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#F5F7FA]">
              {result.timeEstimate || '45 - 60 minutes'}
            </p>
            <span className="text-[10px] text-[#667180] block">Bench technician turnaround</span>
          </div>
        </div>

      </div>

      {/* 🩻 INTERACTIVE DAMAGE MAP */}
      {result.damageMap && (
        <DamageMap
          damageMap={result.damageMap}
          sampleImage={samplePhotoUrl}
        />
      )}

      {/* 💰 COST BREAKDOWN */}
      {result.costIntelligence && (
        <CostBreakdown costIntelligence={result.costIntelligence} />
      )}

      {/* 📍 NEARBY SERVICE LOCATOR */}
      <NearbyRepairLocator category={result.category || 'phone'} />

      {/* 🛠️ STEP-BY-STEP REPAIR BLUEPRINT */}
      {result.steps && result.steps.length > 0 && (
      <div className="rounded-xl p-6 sm:p-8 border border-[#202731] bg-[#10141A] space-y-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#202731] pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#F5F7FA] flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#A7B0BD]" />
              <span>Step-by-Step Repair Blueprint</span>
            </h3>
            <p className="text-xs text-[#A7B0BD] mt-0.5">
              Technical repair protocol. Track completed checklist stages.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 bg-[#0C1015] px-3 py-1.5 rounded-md border border-[#202731]">
            <span className="text-xs font-medium text-[#A7B0BD]">Progress:</span>
            <div className="w-20 h-1.5 bg-[#141922] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#4F8A68] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono text-[#4F8A68] font-semibold">{progressPercent}%</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {result.steps?.map((step, idx) => {
            const isCompleted = completedSteps.includes(idx);

            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`cursor-pointer p-4 rounded-lg border transition-colors duration-150 flex items-start space-x-3.5 ${
                  isCompleted
                    ? 'bg-[#0C1015] border-[#4F8A68]/30 text-[#A7B0BD]'
                    : 'bg-[#0C1015] hover:bg-[#141922] border-[#202731] text-[#F5F7FA]'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isCompleted ? (
                    <CheckSquare className="w-4 h-4 text-[#4F8A68]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#667180]" />
                  )}
                </div>

                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#141922] text-[#A7B0BD] font-medium">
                      Step {idx + 1}
                    </span>
                    <h4 className={`font-semibold text-sm ${isCompleted ? 'line-through text-[#667180]' : 'text-[#F5F7FA]'}`}>
                      {step.title}
                    </h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${isCompleted ? 'text-[#667180]' : 'text-[#A7B0BD]'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* 🎯 AI CONFIDENCE & TELEMETRY MATRIX */}
      <div className="rounded-xl p-6 sm:p-8 border border-[#202731] bg-[#10141A] space-y-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#202731] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#141922] border border-[#202731] flex items-center justify-center">
              <Brain className="w-4 h-4 text-[#A7B0BD]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F5F7FA]">
                Diagnostic Telemetry & System Parameters
              </h3>
              <p className="text-[11px] text-[#667180]">
                Model inference verification metrics
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg bg-[#0C1015] border border-[#202731] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A7B0BD]">
              <span className="font-semibold uppercase tracking-wider text-[10px]">1. Model Confidence</span>
              <span className={`font-bold font-mono ${isLowConfidence ? 'text-[#A7834F]' : 'text-[#4F8A68]'}`}>
                {confidenceEngine.diagnosisConfidence}%
              </span>
            </div>

            <div className="w-full h-1.5 bg-[#141922] rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 rounded-full ${
                  isLowConfidence 
                    ? 'bg-[#A7834F]' 
                    : 'bg-[#4F8A68]'
                }`}
                style={{ width: `${confidenceEngine.diagnosisConfidence}%` }}
              ></div>
            </div>

            <span className="text-[10px] text-[#667180] block font-mono">
              Level: <span className="text-[#F5F7FA] font-semibold">{confidenceEngine.confidenceLevel || (isLowConfidence ? 'LOW' : 'HIGH')}</span>
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0C1015] border border-[#202731] space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#A7B0BD]">
              <span className="font-semibold uppercase tracking-wider text-[10px]">2. Visual Evidence Quality</span>
              <span className="font-mono px-2 py-0.5 rounded text-[10px] bg-[#141922] text-[#A7B0BD] border border-[#202731]">
                {confidenceEngine.evidenceQuality || 'GOOD'}
              </span>
            </div>

            <p className="text-xs text-[#A7B0BD] pt-0.5">
              Optical resolution & edge contrast analyzed by vision models.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0C1015] border border-[#202731] space-y-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-[#A7B0BD] block">
              3. Diagnostic Limitations
            </span>
            <p className="text-xs text-[#A7B0BD] leading-relaxed">
              {confidenceEngine.unknowns || result.whatWeCannotSee || 'Internal structural traces cannot be inspected without physical disassembly.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
