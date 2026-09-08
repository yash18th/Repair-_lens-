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
          badge: 'bg-[#B36262]/15 text-[#B36262] border-[#B36262]/30',
          dot: 'bg-[#B36262]',
          reticleBorder: 'border-[#B36262] bg-[#B36262]/10',
          labelBg: 'bg-[#0D1118] text-[#B36262] border-[#B36262]/40',
          icon: ShieldAlert
        };
      case 'secondary':
        return {
          badge: 'bg-[#B28A50]/15 text-[#B28A50] border-[#B28A50]/30',
          dot: 'bg-[#B28A50]',
          reticleBorder: 'border-[#B28A50] bg-[#B28A50]/10',
          labelBg: 'bg-[#0D1118] text-[#B28A50] border-[#B28A50]/40',
          icon: AlertTriangle
        };
      case 'intact':
      default:
        return {
          badge: 'bg-[#55A477]/15 text-[#55A477] border-[#55A477]/30',
          dot: 'bg-[#55A477]',
          reticleBorder: 'border-[#55A477] bg-[#55A477]/10',
          labelBg: 'bg-[#0D1118] text-[#55A477] border-[#55A477]/40',
          icon: CheckCircle2
        };
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-xl border border-[#232B36] bg-[#121720] space-y-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.4)] relative overflow-hidden">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232B36] pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#161C25] border border-[#232B36] flex items-center justify-center">
            <Layers className="w-4 h-4 text-[#7D91AA]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#F4F6F8] flex items-center space-x-2">
              <span>Interactive AI Damage Map</span>
            </h3>
            <p className="text-xs text-[#A7B0BC]">
              AI detected <span className="font-semibold text-[#F4F6F8]">{damageMap.totalRegionsDetected || damageMap.regions.length} damage regions</span>. Click a region to inspect details.
            </p>
          </div>
        </div>

        {/* Legend Bar */}
        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#B36262]/10 text-[#B36262] border border-[#B36262]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B36262]"></span>
            <span>Primary</span>
          </span>
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#B28A50]/10 text-[#B28A50] border border-[#B28A50]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B28A50]"></span>
            <span>Secondary</span>
          </span>
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#55A477]/10 text-[#55A477] border border-[#55A477]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#55A477]"></span>
            <span>Intact</span>
          </span>
        </div>
      </div>

      {/* Image Canvas with Overlay Bounding Reticles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Overlaid Image Container */}
        <div className="lg:col-span-7 relative rounded-xl overflow-hidden bg-[#0D1118] border border-[#232B36] aspect-video sm:aspect-square flex items-center justify-center shadow-lg group">
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
                className={`absolute cursor-pointer rounded-lg border-2 transition-all duration-200 flex flex-col justify-between p-2 group/box ${
                  style.reticleBorder
                } ${isSelected ? 'scale-102 z-20 shadow-lg ring-2 ring-[#7D91AA]' : 'opacity-85 hover:opacity-100 hover:scale-101'}`}
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

          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-[#080B10]/90 text-[10px] text-[#A7B0BC] border border-[#232B36] backdrop-blur font-mono">
            Click any reticle box to view region analysis
          </div>
        </div>

        {/* Selected Region Inspection Drawer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#A7B0BC] flex items-center space-x-1.5">
            <Eye className="w-4 h-4 text-[#7D91AA]" />
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#161C25] text-[#F4F6F8] border-[#232B36] shadow-sm font-semibold'
                      : 'bg-[#0D1118] text-[#A7B0BC] border-[#232B36] hover:bg-[#161C25]'
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
              <div className="p-5 rounded-xl border border-[#232B36] bg-[#0D1118] space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-[#7D91AA]" />
                    <h4 className="font-semibold text-[#F4F6F8] text-sm">{selectedRegion.label}</h4>
                  </div>
                  
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${style.badge}`}>
                    {selectedRegion.type === 'primary' ? 'Primary Damage' : selectedRegion.type === 'secondary' ? 'Secondary Damage' : 'Healthy / Intact'}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#687382] font-medium uppercase tracking-wider text-[10px] block mb-1">
                      AI Visual Findings
                    </span>
                    <p className="text-[#A7B0BC] leading-relaxed">
                      {selectedRegion.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#161C25] border border-[#232B36] space-y-1">
                    <span className="text-[#F4F6F8] font-medium text-[11px] block">
                      Targeted Action Required
                    </span>
                    <p className="text-[#A7B0BC] leading-relaxed">
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
