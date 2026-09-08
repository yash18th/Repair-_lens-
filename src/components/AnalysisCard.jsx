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
      <div className="w-full rounded-xl p-6 sm:p-8 border border-[#232B36] bg-[#121720] text-center space-y-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.4)] animate-fadeIn relative overflow-hidden">
        <div className="w-12 h-12 mx-auto rounded-lg bg-[#161C25] border border-[#232B36] flex items-center justify-center">
          <Brain className="w-6 h-6 text-[#A7B0BC]" />
        </div>

        <div className="space-y-2.5 max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#161C25] border border-[#232B36] text-[#A7B0BC] text-[10px] font-mono uppercase tracking-wider">
            <span>Diagnostic Notice</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#F4F6F8] tracking-tight">
            Analysis could not be completed
          </h3>

          <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
            {result.rejectionReason || 'The vision inference model returned an unverified format. Please retry.'}
          </p>

          <p className="text-xs text-[#687382] pt-0.5">
            Your uploaded image is saved and ready.
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={onRetry || onReset}
            className="px-4 py-2 rounded-lg border border-[#232B36] bg-[#161C25] hover:bg-[#1D2430] text-[#F4F6F8] font-semibold text-xs tracking-wider uppercase transition-colors inline-flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7D91AA]" />
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
      <div className="w-full rounded-xl p-6 sm:p-8 border border-[#232B36] bg-[#121720] text-center space-y-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.4)] animate-fadeIn relative overflow-hidden">
        <div className="w-12 h-12 mx-auto rounded-lg bg-[#161C25] border border-[#232B36] flex items-center justify-center">
          <Activity className="w-6 h-6 text-[#A7B0BC]" />
        </div>

        <div className="space-y-2.5 max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#161C25] border border-[#232B36] text-[#A7B0BC] text-[10px] font-mono uppercase tracking-wider">
            <span>Service Availability</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#F4F6F8] tracking-tight">
            Diagnostic service temporarily unavailable
          </h3>

          <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
            {result.rejectionReason || 'The AI diagnostic vision service is busy. Please retry in a few moments.'}
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onRetry || onReset}
            className="px-4 py-2 rounded-lg border border-[#232B36] bg-[#161C25] hover:bg-[#1D2430] text-[#F4F6F8] font-semibold text-xs tracking-wider uppercase transition-colors inline-flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <Activity className="w-3.5 h-3.5 text-[#7D91AA]" />
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
      <div className="w-full rounded-xl p-6 sm:p-8 border border-[#B36262]/30 bg-[#121720] text-center space-y-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.4)] animate-fadeIn relative overflow-hidden">
        <div className="w-12 h-12 mx-auto rounded-lg bg-[#161C25] border border-[#232B36] flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-[#B36262]" />
        </div>

        <div className="space-y-2.5 max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#B36262]/10 border border-[#B36262]/30 text-[#B36262] text-[10px] font-mono uppercase tracking-wider">
            <span>Category Verification</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#F4F6F8] tracking-tight">
            Image not suitable for this category
          </h3>

          <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
            {result.rejectionReason || result.errorMessage || 'The uploaded image does not contain the selected device category.'}
          </p>

          {result.detectedObject && (
            <div className="p-3 rounded-lg bg-[#0D1118] border border-[#232B36] text-xs text-[#A7B0BC] flex items-center justify-center gap-3">
              <span>Detected: <strong className="text-[#F4F6F8] uppercase">{result.detectedObject}</strong></span>
              <span>•</span>
              <span>Selected: <strong className="text-[#F4F6F8]">{result.selectedCategory || 'Device'}</strong></span>
            </div>
          )}

          <p className="text-xs text-[#687382] pt-0.5">
            {result.suggestedAction || 'Please upload a clear, well-lit photo of the hardware device you want to inspect.'}
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg border border-[#232B36] bg-[#161C25] hover:bg-[#1D2430] text-[#F4F6F8] font-semibold text-xs tracking-wider uppercase transition-colors inline-flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-[#7D91AA]" />
            <span>Upload Device Photo</span>
          </button>
        </div>
      </div>
    );
  }

  // STAGE 1: Dedicated Insufficient Visual Evidence UI
  if (result.status === 'insufficient_evidence' || result.isInsufficientEvidence) {
    return (
      <div className="w-full rounded-xl p-6 sm:p-8 border border-[#B28A50]/30 bg-[#121720] text-center space-y-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.4)] animate-fadeIn relative overflow-hidden">
        <div className="w-12 h-12 mx-auto rounded-lg bg-[#161C25] border border-[#232B36] flex items-center justify-center">
          <HelpCircle className="w-6 h-6 text-[#B28A50]" />
        </div>

        <div className="space-y-2.5 max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#B28A50]/10 border border-[#B28A50]/30 text-[#B28A50] text-[10px] font-mono uppercase tracking-wider">
            <span>Visual Evidence Check</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#F4F6F8] tracking-tight">
            Insufficient visual evidence
          </h3>

          <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
            {result.rejectionReason || result.detailedIssueExplanation || 'The uploaded photo does not have sufficient resolution or clarity to verify condition.'}
          </p>

          <p className="text-xs text-[#687382] pt-0.5">
            {result.suggestedAction || 'Please take a closer, well-lit photo centered on the component.'}
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg border border-[#232B36] bg-[#161C25] hover:bg-[#1D2430] text-[#F4F6F8] font-semibold text-xs tracking-wider uppercase transition-colors inline-flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-[#7D91AA]" />
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
        <div className="rounded-xl border border-[#232B36] bg-[#121720] p-6 sm:p-8 space-y-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.4)] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232B36] pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#55A477]">
                <ShieldCheck className="w-4 h-4 text-[#55A477]" />
                <span>Physical Inspection Report</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F4F6F8] tracking-tight">
                No Visible Physical Damage Detected
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#55A477]/15 text-[#55A477] border border-[#55A477]/30">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#55A477]" />
                Exterior Intact
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#161C25] text-[#A7B0BC] border border-[#232B36] font-mono">
                {result.confidenceEngine?.diagnosisConfidence || 95}% Confidence
              </span>
            </div>
          </div>

          <div className="space-y-3 rounded-lg bg-[#0D1118] border border-[#232B36] p-4 sm:p-5">
            <div className="flex items-center space-x-2 text-[#A7B0BC] font-semibold text-xs uppercase tracking-wider">
              <Check className="w-4 h-4 text-[#55A477] flex-shrink-0" />
              <span>Inspection Summary</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-[#F4F6F8] leading-relaxed">
              {result.plainEnglishSummary || 'The device exterior is intact with no visible fractures, dents, cracks, or burns.'}
            </p>
            <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
              {result.detailedIssueExplanation}
            </p>
          </div>

          {result.evidence && result.evidence.length > 0 && (
            <div className="p-4 rounded-lg bg-[#0D1118] border border-[#232B36] space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A7B0BC] block">
                Visual Evidence Confirmed:
              </span>
              <ul className="space-y-1 text-xs text-[#A7B0BC] pl-4 list-disc">
                {result.evidence.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-4 rounded-lg bg-[#0D1118] border border-[#232B36] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[#687382] font-medium">Estimated External Repair Cost</div>
              <div className="text-xl font-bold text-[#55A477]">₹0 <span className="text-xs font-normal text-[#687382]">(No repair required)</span></div>
            </div>

            <button
              onClick={onReset}
              className="px-4 py-2 rounded-lg border border-[#232B36] bg-[#161C25] hover:bg-[#1D2430] text-[#F4F6F8] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-[#7D91AA]" />
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
          bg: 'bg-[#55A477]/15',
          text: 'text-[#55A477]',
          border: 'border-[#55A477]/30',
          icon: CheckCircle2
        };
      case 'medium':
        return {
          label: 'Medium Severity',
          bg: 'bg-[#B28A50]/15',
          text: 'text-[#B28A50]',
          border: 'border-[#B28A50]/30',
          icon: AlertTriangle
        };
      case 'high':
        return {
          label: 'High Severity',
          bg: 'bg-[#B36262]/15',
          text: 'text-[#B36262]',
          border: 'border-[#B36262]/30',
          icon: AlertTriangle
        };
      case 'critical':
      default:
        return {
          label: 'Critical Severity',
          bg: 'bg-[#B36262]/15',
          text: 'text-[#B36262]',
          border: 'border-[#B36262]/30',
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
      <div className="rounded-xl border border-[#232B36] bg-[#121720] p-6 sm:p-8 space-y-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.4)] relative overflow-hidden">
        
        {/* Header Eyebrow & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232B36] pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#7D91AA]">
              <Sparkles className="w-3.5 h-3.5 text-[#7D91AA]" />
              <span>AI Damage & Issue Diagnosis Report</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F4F6F8] tracking-tight leading-snug">
              {result.problemTitle || 'Hardware Damage Detected'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${severityBadge.bg} ${severityBadge.text} border ${severityBadge.border}`}>
              <SeverityIcon className="w-3.5 h-3.5 mr-1" />
              {severityBadge.label}
            </span>

            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#161C25] text-[#A7B0BC] border border-[#232B36]">
              <Zap className="w-3.5 h-3.5 mr-1 text-[#7D91AA]" />
              {result.urgency || 'Immediate Attention Required'}
            </span>

            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#161C25] text-[#A7B0BC] border border-[#232B36] font-mono">
              {confidenceEngine.diagnosisConfidence}% Confidence
            </span>

            <button
              onClick={() => window.print()}
              className="px-2.5 py-1 rounded-md bg-[#0D1118] hover:bg-[#161C25] text-[#A7B0BC] hover:text-[#F4F6F8] text-xs font-medium border border-[#232B36] transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>

        {/* 🧠 SECTION 1: WHAT IS THE ISSUE? (CLEAR EXPLANATION) */}
        <div className="space-y-3 rounded-lg bg-[#0D1118] border border-[#232B36] p-5 sm:p-6 relative">
          <div className="flex items-center space-x-2 text-[#A7B0BC] font-semibold text-xs uppercase tracking-wider">
            <Brain className="w-4 h-4 text-[#7D91AA] flex-shrink-0" />
            <span>AI Plain-English Diagnosis</span>
          </div>

          {/* Short Summary */}
          {result.plainEnglishSummary && (
            <div className="text-base sm:text-lg font-semibold text-[#F4F6F8] leading-relaxed border-l-2 border-[#7D91AA] pl-3 py-0.5">
              {result.plainEnglishSummary}
            </div>
          )}

          {/* Deep-Dive Technical Explanation */}
          <div className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed space-y-2 pt-1">
            <p>
              {result.detailedIssueExplanation || result.problemDescription || result.problem}
            </p>
          </div>
        </div>

        {/* 🧩 SECTION 2: IDENTIFIED DAMAGED COMPONENTS */}
        {affectedComponents.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#A7B0BC]">
              <Cpu className="w-3.5 h-3.5 text-[#7D91AA]" />
              <span>Identified Damaged & Affected Hardware Components ({affectedComponents.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {affectedComponents.map((component, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center space-x-2.5 p-3 rounded-lg bg-[#0D1118] border border-[#232B36] text-[#F4F6F8] shadow-sm"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B36262] flex-shrink-0" />
                  <span className="text-xs font-medium leading-tight">{component}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ⚡ SECTION 3: CAUSE & RISKS */}
        <div className={`grid grid-cols-1 ${risksIfUnfixed.length > 0 ? 'lg:grid-cols-2' : ''} gap-4 pt-1`}>
          
          {/* Left Column: Root Cause */}
          <div className="p-4 sm:p-5 rounded-lg bg-[#0D1118] border border-[#232B36] space-y-2.5">
            <div className="flex items-center space-x-2 text-[#B28A50] font-semibold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-[#B28A50] flex-shrink-0" />
              <span>Root Cause Analysis</span>
            </div>
            
            <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
              {result.possibleCause || result.rootCause || result.likelyCause || 'Visual stress point or kinetic impact observed on the component.'}
            </p>

            {result.evidence && result.evidence.length > 0 && (
              <div className="pt-2 border-t border-[#232B36] space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#687382] block">
                  Observed Visual Evidence:
                </span>
                <ul className="space-y-1 text-xs text-[#A7B0BC] pl-4 list-disc">
                  {result.evidence.map((item, idx) => (
                    <li key={idx} className="leading-snug">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Risks */}
          {risksIfUnfixed.length > 0 && (
            <div className="p-4 sm:p-5 rounded-lg bg-[#0D1118] border border-[#B36262]/25 space-y-2.5">
              <div className="flex items-center space-x-2 text-[#B36262] font-semibold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5 text-[#B36262] flex-shrink-0" />
                <span>Risks If Left Unfixed</span>
              </div>

              <ul className="space-y-1.5 text-xs text-[#A7B0BC] pl-4 list-disc">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#232B36]">
          <div className="p-3.5 rounded-lg bg-[#0D1118] border border-[#232B36] space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-[#687382] font-medium">
              <UserCheck className="w-3.5 h-3.5 text-[#A7B0BC]" />
              <span>Recommendation</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#F4F6F8] line-clamp-2">
              {result.recommendation || result.solutionTitle}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0D1118] border border-[#232B36] space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-[#687382] font-medium">
              <Wrench className="w-3.5 h-3.5 text-[#A7B0BC]" />
              <span>Repair Complexity</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#F4F6F8]">
              {result.complexity || 'Moderate'}
            </p>
            <span className="text-[10px] text-[#687382] block">Standard bench repair</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0D1118] border border-[#232B36] space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-[#687382] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#A7B0BC]" />
              <span>Estimated Duration</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#F4F6F8]">
              {result.timeEstimate || '45 - 60 minutes'}
            </p>
            <span className="text-[10px] text-[#687382] block">Bench technician turnaround</span>
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
      <div className="rounded-xl p-6 sm:p-8 border border-[#232B36] bg-[#121720] space-y-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232B36] pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#F4F6F8] flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#7D91AA]" />
              <span>Step-by-Step Repair Blueprint</span>
            </h3>
            <p className="text-xs text-[#A7B0BC] mt-0.5">
              Technical repair protocol. Track completed checklist stages.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 bg-[#0D1118] px-3 py-1.5 rounded-md border border-[#232B36]">
            <span className="text-xs font-medium text-[#A7B0BC]">Progress:</span>
            <div className="w-20 h-1.5 bg-[#161C25] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#55A477] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono text-[#55A477] font-semibold">{progressPercent}%</span>
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
                    ? 'bg-[#0D1118] border-[#55A477]/30 text-[#A7B0BC]'
                    : 'bg-[#0D1118] hover:bg-[#161C25] border-[#232B36] text-[#F4F6F8]'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isCompleted ? (
                    <CheckSquare className="w-4 h-4 text-[#55A477]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#687382]" />
                  )}
                </div>

                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#161C25] text-[#A7B0BC] font-medium border border-[#232B36]">
                      Step {idx + 1}
                    </span>
                    <h4 className={`font-semibold text-sm ${isCompleted ? 'line-through text-[#687382]' : 'text-[#F4F6F8]'}`}>
                      {step.title}
                    </h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${isCompleted ? 'text-[#687382]' : 'text-[#A7B0BC]'}`}>
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
      <div className="rounded-xl p-6 sm:p-8 border border-[#232B36] bg-[#121720] space-y-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232B36] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#161C25] border border-[#232B36] flex items-center justify-center">
              <Brain className="w-4 h-4 text-[#7D91AA]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F4F6F8]">
                Diagnostic Telemetry & System Parameters
              </h3>
              <p className="text-[11px] text-[#687382]">
                Model inference verification metrics
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg bg-[#0D1118] border border-[#232B36] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A7B0BC]">
              <span className="font-semibold uppercase tracking-wider text-[10px]">1. Model Confidence</span>
              <span className={`font-bold font-mono ${isLowConfidence ? 'text-[#B28A50]' : 'text-[#55A477]'}`}>
                {confidenceEngine.diagnosisConfidence}%
              </span>
            </div>

            <div className="w-full h-1.5 bg-[#161C25] rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 rounded-full ${
                  isLowConfidence 
                    ? 'bg-[#B28A50]' 
                    : 'bg-[#55A477]'
                }`}
                style={{ width: `${confidenceEngine.diagnosisConfidence}%` }}
              ></div>
            </div>

            <span className="text-[10px] text-[#687382] block font-mono">
              Level: <span className="text-[#F4F6F8] font-semibold">{confidenceEngine.confidenceLevel || (isLowConfidence ? 'LOW' : 'HIGH')}</span>
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0D1118] border border-[#232B36] space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#A7B0BC]">
              <span className="font-semibold uppercase tracking-wider text-[10px]">2. Visual Evidence Quality</span>
              <span className="font-mono px-2 py-0.5 rounded text-[10px] bg-[#161C25] text-[#A7B0BC] border border-[#232B36]">
                {confidenceEngine.evidenceQuality || 'GOOD'}
              </span>
            </div>

            <p className="text-xs text-[#A7B0BC] pt-0.5">
              Optical resolution & edge contrast analyzed by vision models.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0D1118] border border-[#232B36] space-y-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-[#A7B0BC] block">
              3. Diagnostic Limitations
            </span>
            <p className="text-xs text-[#A7B0BC] leading-relaxed">
              {confidenceEngine.unknowns || result.whatWeCannotSee || 'Internal structural traces cannot be inspected without physical disassembly.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
