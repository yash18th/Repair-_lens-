import React from 'react';
import { Lock, X, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export default function SubscriptionPaywallModal({
  isOpen,
  onClose,
  onOpenSubscriptionPlans,
  isTrialEligible,
  onStartTrial,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080B10]/85 px-4 py-8 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-[#232B36] bg-[#121720] shadow-[0_24px_48px_rgba(0,0,0,0.6)] space-y-6 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-[#232B36] pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#232B36] bg-[#161C25] text-[#7D91AA]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7D91AA] font-mono">
                Subscription Required
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#F4F6F8]">
                Unlock RepairLens Diagnostic Lab
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#232B36] bg-[#0D1118] p-1.5 text-[#687382] transition-colors hover:text-[#F4F6F8] cursor-pointer"
            aria-label="Close subscription prompt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
            An active subscription or 3-day free trial is required to perform AI damage diagnoses, component breakdown, and market repair cost estimation.
          </p>

          <div className="rounded-lg border border-[#232B36] bg-[#0D1118] p-4 space-y-2 text-xs font-mono text-[#A7B0BC]">
            <div className="flex items-center justify-between text-[#F4F6F8]">
              <span>Monthly Subscription:</span>
              <span className="font-bold text-[#7D91AA]">₹99 / month</span>
            </div>
            <div className="flex items-center justify-between text-[#F4F6F8]">
              <span>2 Months Subscription:</span>
              <span className="font-bold text-[#7D91AA]">₹299 / 2 months</span>
            </div>
            <div className="flex items-center justify-between text-[#F4F6F8]">
              <span>Yearly Subscription:</span>
              <span className="font-bold text-[#55A477]">₹599 / year (Best Value)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {isTrialEligible && onStartTrial && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartTrial();
              }}
              className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-lg bg-[#55A477] hover:bg-[#489167] text-[#080B10] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start 3-Day Free Trial</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenSubscriptionPlans) onOpenSubscriptionPlans();
            }}
            className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-lg bg-[#161C25] hover:bg-[#1D2430] border border-[#232B36] hover:border-[#7D91AA]/40 text-[#F4F6F8] font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Subscription Plans</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#7D91AA]" />
          </button>
        </div>
      </div>
    </div>
  );
}
