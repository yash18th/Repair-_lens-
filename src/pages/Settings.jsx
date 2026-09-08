import React from 'react';
import { Settings, Cpu } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      <div className="border-b border-[#232B36] pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#161C25] text-[#A7B0BC] text-xs font-semibold border border-[#232B36] mb-1 font-mono uppercase tracking-wider">
          <Settings className="w-3.5 h-3.5 text-[#7D91AA]" />
          <span>Platform Preferences</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#F4F6F8]">System Settings</h1>
        <p className="text-xs text-[#A7B0BC]">Configure AI vision pipeline preferences, camera resolution, and notification alerts.</p>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-xl border border-[#232B36] bg-[#121720] space-y-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.4)]">
          <h3 className="text-sm font-semibold text-[#F4F6F8] flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[#7D91AA]" />
            <span>AI Vision Pipeline Settings</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-2.5 border-b border-[#232B36]">
              <div>
                <span className="font-medium text-[#F4F6F8] block">Cross-Image Vision Fusion</span>
                <span className="text-[#A7B0BC] text-[11px]">Combine 4-angle photo inputs into a single diagnostic report</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#7D91AA] rounded cursor-pointer" />
            </div>

            <div className="flex items-center justify-between py-2.5 border-b border-[#232B36]">
              <div>
                <span className="font-medium text-[#F4F6F8] block">Evidence & Uncertainty Layer</span>
                <span className="text-[#A7B0BC] text-[11px]">Display transparent confidence and risk verification callouts</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#7D91AA] rounded cursor-pointer" />
            </div>

            <div className="flex items-center justify-between py-2.5">
              <div>
                <span className="font-medium text-[#F4F6F8] block">OCR Model Identification</span>
                <span className="text-[#A7B0BC] text-[11px]">Automatically scan serial numbers & model tags from Photo 3</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#7D91AA] rounded cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
