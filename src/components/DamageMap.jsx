import React, { useState } from 'react';
import { Layers, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, ChevronRight, Info, Eye, Scan } from 'lucide-react';

export default function DamageMap({ damageMap, sampleImage }) {
  if (!damageMap || !damageMap.regions) return null;

  const [selectedRegionId, setSelectedRegionId] = useState(damageMap.regions[0]?.id || null);

  const selectedRegion = damageMap.regions.find(r => r.id === selectedRegionId) || damageMap.regions[0];

  const getRegionStyles = (type) => {
    switch (type) {
      case 'primary':
        return {
          badge: 'bg-red-500/20 text-red-300 border-red-500/40',
          dot: 'bg-red-500 shadow-[0_0_12px_#ef4444]',
          reticleBorder: 'border-red-500 bg-red-500/10 shadow-[0_0_25px_rgba(239,68,68,0.4)]',
          labelBg: 'bg-red-950/90 text-red-200 border-red-500/40',
          icon: ShieldAlert
        };
      case 'secondary':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-500 shadow-[0_0_12px_#f59e0b]',
          reticleBorder: 'border-amber-500 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.4)]',
          labelBg: 'bg-amber-950/90 text-amber-200 border-amber-500/40',
          icon: AlertTriangle
        };
      case 'intact':
      default:
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-500 shadow-[0_0_12px_#10b981]',
          reticleBorder: 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.3)]',
          labelBg: 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40',
          icon: CheckCircle2
        };
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-500/30 bg-slate-950/90 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <Layers className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <span>Interactive AI Damage Map</span>
            </h3>
            <p className="text-xs text-slate-400">
              AI detected <span className="font-bold text-purple-300">{damageMap.totalRegionsDetected || damageMap.regions.length} damage regions</span>. Click a region to inspect details.
            </p>
          </div>
        </div>

        {/* Legend Bar */}
        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>🔴 Primary</span>
          </span>
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>🟡 Secondary</span>
          </span>
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>🟢 Intact</span>
          </span>
        </div>
      </div>

      {/* Image Canvas with Overlay Bounding Reticles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Overlaid Image Container */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 aspect-video sm:aspect-square flex items-center justify-center shadow-xl group">
          <img
            src={damageMap.imageUrl || sampleImage}
            alt="Scanned item with AI damage overlay"
            className="w-full h-full object-cover filter brightness-[0.9]"
          />

          {/* Render glowing bounding reticles over image */}
          {damageMap.regions.map((region) => {
            const isSelected = region.id === selectedRegionId;
            const style = getRegionStyles(region.type);
            const Icon = style.icon;

            return (
              <div
                key={region.id}
                onClick={() => setSelectedRegionId(region.id)}
                style={{
                  top: region.position.top,
                  left: region.position.left,
                  width: region.position.width,
                  height: region.position.height
                }}
                className={`absolute cursor-pointer rounded-xl border-2 transition-all duration-300 flex flex-col justify-between p-2 group/box ${
                  style.reticleBorder
                } ${isSelected ? 'scale-105 z-20 shadow-2xl ring-2 ring-purple-400' : 'opacity-80 hover:opacity-100 hover:scale-102'}`}
              >
                {/* Top Corner Label Badge */}
                <div className={`self-start px-2 py-0.5 rounded text-[10px] font-bold border font-mono flex items-center space-x-1 ${style.labelBg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                  <span className="truncate max-w-[120px]">{region.label}</span>
                </div>

                {/* Center Laser Target Crosshair */}
                <div className="w-6 h-6 border border-white/60 rounded-full mx-auto my-auto flex items-center justify-center pointer-events-none opacity-50 group-hover/box:opacity-100 transition-opacity">
                  <Scan className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-slate-950/80 text-[10px] text-slate-300 border border-slate-800 backdrop-blur">
            💡 Click any reticle box to view region analysis
          </div>
        </div>

        {/* Selected Region Inspection Drawer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Eye className="w-4 h-4 text-purple-400" />
            <span>Region Inspection Details</span>
          </div>

          {/* Region Tabs Selector */}
          <div className="flex flex-wrap gap-2">
            {damageMap.regions.map((region) => {
              const isSelected = region.id === selectedRegionId;
              const style = getRegionStyles(region.type);

              return (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegionId(region.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                  <span className="truncate max-w-[140px]">{region.label}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Region Card */}
          {selectedRegion && (() => {
            const style = getRegionStyles(selectedRegion.type);
            const Icon = style.icon;

            return (
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5 text-purple-400" />
                    <h4 className="font-bold text-white text-sm">{selectedRegion.label}</h4>
                  </div>
                  
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${style.badge}`}>
                    {selectedRegion.type === 'primary' ? '🔴 Primary Damage' : selectedRegion.type === 'secondary' ? '🟡 Secondary Damage' : '🟢 Healthy / Intact'}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block mb-1">
                      AI Visual Findings:
                    </span>
                    <p className="text-slate-300 leading-relaxed font-medium">
                      {selectedRegion.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="text-purple-400 font-bold text-[11px] block">
                      Targeted Action Required:
                    </span>
                    <p className="text-slate-200 leading-relaxed">
                      {selectedRegion.actionRequired}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

      </div>

    </div>
  );
}
