import React, { useState } from 'react';
import { IndianRupee, Store, Wrench, Hammer, TrendingUp, ChevronDown, ChevronUp, Info } from 'lucide-react';

function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

export default function CostBreakdown({ costIntelligence }) {
  const [expanded, setExpanded] = useState(true);

  if (!costIntelligence) return null;

  const { breakdown, localPrices, confidenceLabel, totalEstimate } = costIntelligence;

  const breakdownTotal = breakdown.reduce((sum, item) => sum + item.amount, 0);

  const serviceStyles = {
    authorized: {
      icon: Store,
      iconColor: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-950/30',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      label: 'Authorized Service Centre'
    },
    garage: {
      icon: Wrench,
      iconColor: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/20',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      label: 'Independent Garage'
    },
    diy: {
      icon: Hammer,
      iconColor: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      label: 'DIY Repair'
    }
  };

  const confidenceColors = {
    High: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    Low: 'text-red-400 bg-red-500/10 border-red-500/30'
  };

  return (
    <div className="glass-panel rounded-2xl border border-emerald-500/30 bg-slate-950/90 shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-slate-900/40 transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <IndianRupee className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">
              India Repair Cost Intelligence
            </h3>
            <p className="text-xs text-slate-400">
              Localised ₹ pricing · Parts · Labour · GST · Local market rates
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Total Pill */}
          <span className="hidden sm:block text-xl font-black text-emerald-400 font-mono">
            {formatINR(totalEstimate.min)} – {formatINR(totalEstimate.max)}
          </span>
          {expanded
            ? <ChevronUp className="w-5 h-5 text-slate-400" />
            : <ChevronDown className="w-5 h-5 text-slate-400" />
          }
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-800 px-6 pb-6 space-y-6 pt-5">

          {/* Mobile Total */}
          <div className="sm:hidden text-2xl font-black text-emerald-400 font-mono text-center">
            {formatINR(totalEstimate.min)} – {formatINR(totalEstimate.max)}
          </div>

          {/* Cost Breakdown Table */}
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Estimated Repair Cost Breakdown</span>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60">
              {breakdown.map((item, idx) => {
                const isGST = item.label.toLowerCase().includes('gst');
                const isTotal = item.isTotal;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-4 py-3 text-sm transition-colors
                      ${isTotal
                        ? 'bg-emerald-950/30 border-t-2 border-emerald-500/50 font-black text-white'
                        : isGST
                        ? 'text-slate-400 italic border-t border-slate-800/60'
                        : 'text-slate-300 border-t border-slate-800/40 first:border-t-0'
                      }
                    `}
                  >
                    <span className={isTotal ? 'text-emerald-300 text-base' : ''}>{item.label}</span>
                    <span className={`font-mono ${isTotal ? 'text-emerald-400 text-lg' : isGST ? 'text-slate-400' : 'text-slate-200'}`}>
                      {formatINR(item.amount)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Confidence Tag */}
            <div className="flex items-center space-x-2 pt-2">
              <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="text-[11px] text-slate-500">
                Cost estimate confidence:
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${confidenceColors[confidenceLabel] || confidenceColors['Medium']}`}>
                {confidenceLabel || 'Medium'}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800" />

          {/* Local Price Intelligence */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Store className="w-3.5 h-3.5 text-purple-400" />
              <span>Local Price Intelligence</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {localPrices.map((option) => {
                const style = serviceStyles[option.type] || serviceStyles.garage;
                const Icon = style.icon;

                return (
                  <div
                    key={option.type}
                    className={`p-4 rounded-xl border ${style.border} ${style.bg} space-y-3 transition-all hover:scale-[1.02]`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${style.iconColor} flex-shrink-0`} />
                      <span className="text-xs font-bold text-white">{option.label || style.label}</span>
                    </div>

                    <p className="font-black text-lg text-white font-mono leading-none">
                      {formatINR(option.min)}<span className="text-slate-400 font-normal text-sm mx-1">–</span>{formatINR(option.max)}
                    </p>

                    {option.note && (
                      <p className="text-[11px] text-slate-400 leading-snug">{option.note}</p>
                    )}

                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border inline-block ${style.badge}`}>
                      {option.type === 'authorized' ? '✅ Warranty Safe' : option.type === 'diy' ? '🛠️ Best Savings' : '⚡ Recommended'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
