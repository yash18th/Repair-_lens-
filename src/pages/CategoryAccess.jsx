import React from 'react';
import { ChevronRight, Smartphone, Laptop, Cpu, Plug, Car, Package, Wrench } from 'lucide-react';
import { ITEM_CATEGORIES } from '../services/api';

const CATEGORY_ICON_COMPONENTS = {
  phone: Smartphone,
  computer: Laptop,
  electronics: Cpu,
  appliance: Plug,
  vehicles: Car,
  other: Package,
};

export default function CategoryAccess({ onSelectCategoryAndNavigate }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-[#A7B0BD]">
          <span className="w-5 h-5 rounded-md bg-[#141922] border border-[#202731] text-[#8294AA] flex items-center justify-center text-[10px] font-bold">2</span>
          <span>CATEGORY ACCESS // TARGET HARDWARE</span>
        </div>
        <span className="text-[10px] font-mono uppercase text-[#667180]">SELECT MODULE</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ITEM_CATEGORIES.map((cat, idx) => {
          const IconComponent = CATEGORY_ICON_COMPONENTS[cat.id] || Wrench;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategoryAndNavigate(cat.id)}
              className="group flex items-center justify-between gap-4 rounded-xl border border-[#202731] bg-[#10141A] px-5 py-4 text-left transition-all duration-180 hover:border-[#283240] hover:bg-[#141922] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#0C1015] border border-[#202731] flex items-center justify-center text-[#8294AA] group-hover:text-[#F5F7FA] transition-colors flex-shrink-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#667180]">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="font-bold text-[#F5F7FA] text-base group-hover:text-white transition-colors">{cat.label}</span>
                  </div>
                  <div className="text-xs text-[#A7B0BD] truncate mt-0.5">{cat.desc}</div>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#0C1015] text-[#A7B0BD] border border-[#202731] px-3 py-1.5 text-xs font-medium group-hover:text-[#F5F7FA] group-hover:border-[#283240] flex-shrink-0 transition-colors">
                <span>Select</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
