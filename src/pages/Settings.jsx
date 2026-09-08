import React from 'react';
import { Settings, Cpu } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      <div className="border-b border-[#202731] pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#141922] text-[#A7B0BD] text-xs font-semibold border border-[#202731] mb-1">
          <Settings className="w-3.5 h-3.5 text-[#A7B0BD]" />
          <span>Platform Preferences</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#F5F7FA]">System Settings</h1>
        <p className="text-xs text-[#A7B0BD]">Configure AI vision pipeline preferences, camera resolution, and notification alerts.</p>
      </div>

      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-2xl border border-[#202731] bg-[#10141A] space-y-4">
          <h3 className="text-sm font-semibold text-[#F5F7FA] flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[#A7B0BD]" />
            <span>AI Vision Pipeline Settings</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-[#202731]">
              <div>
                <span className="font-medium text-[#F5F7FA] block">Cross-Image Vision Fusion</span>
                <span className="text-[#A7B0BD] text-[11px]">Combine 4-angle photo inputs into a single diagnostic report</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#8294AA] rounded" />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#202731]">
              <div>
                <span className="font-medium text-[#F5F7FA] block">Evidence & Uncertainty Layer</span>
                <span className="text-[#A7B0BD] text-[11px]">Display "What We Cannot See" transparent risk callouts</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#8294AA] rounded" />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-medium text-[#F5F7FA] block">OCR Model Identification</span>
                <span className="text-[#A7B0BD] text-[11px]">Automatically scan serial numbers & model tags from Photo 3</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#8294AA] rounded" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
