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
          badge: 'bg-[#A65D5D]/15 text-[#fca5a5] border-[#A65D5D]/30',
          dot: 'bg-[#A65D5D]',
          reticleBorder: 'border-[#A65D5D] bg-[#A65D5D]/10',
          labelBg: 'bg-[#0C1015] text-[#fca5a5] border-[#A65D5D]/40',
          icon: ShieldAlert
        };
      case 'secondary':
        return {
          badge: 'bg-[#A7834F]/15 text-[#fcd34d] border-[#A7834F]/30',
          dot: 'bg-[#A7834F]',
          reticleBorder: 'border-[#A7834F] bg-[#A7834F]/10',
          labelBg: 'bg-[#0C1015] text-[#fcd34d] border-[#A7834F]/40',
          icon: AlertTriangle
        };
      case 'intact':
      default:
        return {
          badge: 'bg-[#4F8A68]/15 text-[#86efac] border-[#4F8A68]/30',
          dot: 'bg-[#4F8A68]',
          reticleBorder: 'border-[#4F8A68] bg-[#4F8A68]/10',
          labelBg: 'bg-[#0C1015] text-[#86efac] border-[#4F8A68]/40',
          icon: CheckCircle2
        };
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#202731] bg-[#10141A] space-y-6 shadow-xl relative overflow-hidden">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#202731] pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#141922] border border-[#202731] flex items-center justify-center">
            <Layers className="w-5 h-5 text-[#A7B0BD]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#F5F7FA] flex items-center space-x-2">
              <span>Interactive AI Damage Map</span>
            </h3>
            <p className="text-xs text-[#A7B0BD]">
              AI detected <span className="font-semibold text-[#F5F7FA]">{damageMap.totalRegionsDetected || damageMap.regions.length} damage regions</span>. Click a region to inspect details.
            </p>
          </div>
        </div>

        {/* Legend Bar */}
        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#A65D5D]/10 text-[#fca5a5] border border-[#A65D5D]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A65D5D]"></span>
            <span>Primary</span>
          </span>
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#A7834F]/10 text-[#fcd34d] border border-[#A7834F]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A7834F]"></span>
            <span>Secondary</span>
          </span>
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#4F8A68]/10 text-[#86efac] border border-[#4F8A68]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F8A68]"></span>
            <span>Intact</span>
          </span>
        </div>
      </div>

      {/* Image Canvas with Overlay Bounding Reticles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Overlaid Image Container */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-[#0C1015] border border-[#202731] aspect-video sm:aspect-square flex items-center justify-center shadow-lg group">
          <img
            src={damageMap.imageUrl || sampleImage}
            alt="Scanned item with AI damage overlay"
            className="w-full h-full object-cover filter brightness-[0.9]"
          />

          {/* Render bounding reticles over image */}
          {damageMap.regions.map((region) => {
            const isSelected = region.id === selectedRegionId;
            const style = getRegionStyles(region.type);

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
                className={`absolute cursor-pointer rounded-xl border-2 transition-all duration-200 flex flex-col justify-between p-2 group/box ${
                  style.reticleBorder
                } ${isSelected ? 'scale-102 z-20 shadow-lg ring-2 ring-[#8294AA]' : 'opacity-85 hover:opacity-100 hover:scale-101'}`}
              >
                {/* Top Corner Label Badge */}
                <div className={`self-start px-2 py-0.5 rounded text-[10px] font-bold border font-mono flex items-center space-x-1 ${style.labelBg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                  <span className="truncate max-w-[120px]">{region.label}</span>
                </div>

                {/* Center Target Crosshair */}
                <div className="w-6 h-6 border border-white/40 rounded-full mx-auto my-auto flex items-center justify-center pointer-events-none opacity-40 group-hover/box:opacity-80 transition-opacity">
                  <Scan className="w-3.5 h-3.5 text-white/80" />
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-[#07090C]/90 text-[10px] text-[#A7B0BD] border border-[#202731] backdrop-blur">
            Click any reticle box to view region analysis
          </div>
        </div>

        {/* Selected Region Inspection Drawer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#A7B0BD] flex items-center space-x-1.5">
            <Eye className="w-4 h-4 text-[#A7B0BD]" />
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-[#141922] text-[#F5F7FA] border-[#283240] shadow-sm'
                      : 'bg-[#0C1015] text-[#A7B0BD] border-[#202731] hover:bg-[#141922]'
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
              <div className="glass-panel p-5 rounded-2xl border border-[#202731] bg-[#0C1015] space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#202731] pb-3">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5 text-[#A7B0BD]" />
                    <h4 className="font-semibold text-[#F5F7FA] text-sm">{selectedRegion.label}</h4>
                  </div>
                  
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${style.badge}`}>
                    {selectedRegion.type === 'primary' ? 'Primary Damage' : selectedRegion.type === 'secondary' ? 'Secondary Damage' : 'Healthy / Intact'}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#667180] font-medium uppercase tracking-wider text-[10px] block mb-1">
                      AI Visual Findings
                    </span>
                    <p className="text-[#A7B0BD] leading-relaxed">
                      {selectedRegion.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141922] border border-[#202731] space-y-1">
                    <span className="text-[#F5F7FA] font-medium text-[11px] block">
                      Targeted Action Required
                    </span>
                    <p className="text-[#A7B0BD] leading-relaxed">
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
