import React from 'react';
import { Check, Zap, Sparkles, Shield, ArrowRight, Loader2 } from 'lucide-react';

const PLAN_FEATURES = {
  trial: [
    'Full AI Visual Damage Detection',
    '3-Day Full Telemetry Lab Access',
    'Component Identification Engine',
    'Preliminary Cost Intelligence',
    'Scan History & PDF Export',
  ],
  monthly: [
    'Unlimited AI Damage Diagnoses',
    'All 6 Hardware Categories Unlocked',
    'Real-time Market Pricing Engine',
    'OEM & Aftermarket Parts Estimation',
    'Persistent Scan Telemetry Storage',
    'Cancel Anytime with 1 Click',
  ],
  two_month: [
    'Everything in Monthly Plan',
    'Billed Every 2 Months',
    'Multi-angle Photo Fusion Engine',
    'Dedicated Nearby Repair Shop Finder',
    'Continuous Hardware Support',
    'Cancel Anytime with 1 Click',
  ],
  yearly: [
    'Everything in All Plans',
    'Maximum Cost Savings',
    'Priority Cloud AI Inference',
    'Full Enterprise Telemetry Retention',
    'Unlimited Estimates & Export',
    'Dedicated Technician Support',
  ],
};

export default function PricingCards({
  onSelectPlan,
  onStartTrial,
  isTrialEligible,
  currentPlan,
  activeLoadingPlan,
  paymentStepText,
}) {
  const cards = [
    {
      id: 'trial',
      title: 'FREE TRIAL',
      price: '₹0',
      period: '3 Days',
      description: 'Test all RepairLens features with zero commitment.',
      buttonText: 'START FREE TRIAL',
      isTrial: true,
      badge: null,
      popular: false,
    },
    {
      id: 'monthly',
      title: 'MONTHLY',
      price: '₹99',
      period: '1 Month',
      description: 'Standard monthly billing for active technicians.',
      buttonText: 'SUBSCRIBE',
      isTrial: false,
      badge: null,
      popular: false,
    },
    {
      id: 'two_month',
      title: '2 MONTHS',
      price: '₹299',
      period: '2 Months',
      description: 'Bi-monthly billing with uninterrupted access.',
      buttonText: 'SUBSCRIBE',
      isTrial: false,
      badge: null,
      popular: false,
    },
    {
      id: 'yearly',
      title: 'YEARLY',
      price: '₹599',
      period: '1 Year',
      description: 'Best annual value for busy workshops & labs.',
      buttonText: 'SUBSCRIBE',
      isTrial: false,
      badge: 'BEST VALUE',
      popular: true,
    },
  ];

  return (
    <div className="space-y-6">
      {paymentStepText && (
        <div className="rounded-xl border border-[#7D91AA]/40 bg-[#161C25] p-4 flex items-center justify-center gap-3 text-xs font-mono text-[#F4F6F8] shadow-lg animate-fadeIn">
          <Loader2 className="w-4 h-4 text-[#7D91AA] animate-spin" />
          <span className="font-semibold tracking-wider uppercase">{paymentStepText}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => {
          const isCurrent = currentPlan === card.id;
          const isLoading = activeLoadingPlan === card.id;
          const isTrialDisabled = card.isTrial && !isTrialEligible;

          return (
            <div
              key={card.id}
              className={`relative flex flex-col justify-between rounded-xl border transition-all duration-200 p-6 ${
                card.popular
                  ? 'border-[#7D91AA] bg-[#141A24] shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)] ring-1 ring-[#7D91AA]/40'
                  : 'border-[#232B36] bg-[#121720] hover:border-[#7D91AA]/40 hover:bg-[#151B23]'
              }`}
            >
              {/* Badge */}
              {card.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#7D91AA] to-[#A7B0BC] text-[#080B10] text-[10px] font-extrabold uppercase tracking-[0.14em] shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{card.badge}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-[#7D91AA]">
                      {card.title}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded bg-[#55A477]/10 border border-[#55A477]/30 text-[9px] font-mono font-semibold text-[#55A477] uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1.5 pt-2">
                    <span className="text-3xl font-extrabold tracking-tight text-[#F4F6F8] font-mono">
                      {card.price}
                    </span>
                    <span className="text-xs font-mono text-[#687382]">/ {card.period}</span>
                  </div>
                  <p className="text-xs text-[#A7B0BC] pt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#232B36] space-y-2.5 text-xs text-[#A7B0BC]">
                  {(PLAN_FEATURES[card.id] || []).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#55A477] shrink-0 mt-0.5" />
                      <span className="leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                {card.isTrial ? (
                  <button
                    type="button"
                    onClick={() => onStartTrial && onStartTrial()}
                    disabled={isTrialDisabled || isLoading || isCurrent}
                    className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isTrialDisabled
                        ? 'border border-[#232B36] bg-[#0D1118] text-[#687382] cursor-not-allowed'
                        : isCurrent
                        ? 'border border-[#55A477]/40 bg-[#55A477]/10 text-[#55A477] cursor-default'
                        : 'border border-[#232B36] bg-[#161C25] hover:bg-[#1D2430] hover:border-[#7D91AA]/40 text-[#F4F6F8]'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Activating...</span>
                      </>
                    ) : isTrialDisabled ? (
                      <span>Trial Already Used</span>
                    ) : isCurrent ? (
                      <span>Current Plan</span>
                    ) : (
                      <>
                        <span>{card.buttonText}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#7D91AA]" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectPlan && onSelectPlan(card.id)}
                    disabled={isLoading || isCurrent}
                    className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      card.popular
                        ? 'bg-[#7D91AA] hover:bg-[#8EA3BD] text-[#080B10] shadow-sm'
                        : 'border border-[#232B36] bg-[#161C25] hover:bg-[#1D2430] hover:border-[#7D91AA]/40 text-[#F4F6F8]'
                    } ${isCurrent ? 'opacity-50 cursor-default' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : isCurrent ? (
                      <span>Current Plan</span>
                    ) : (
                      <>
                        <span>{card.buttonText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
