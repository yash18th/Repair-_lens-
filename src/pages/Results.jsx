import React from 'react';
import AnalysisCard from '../components/AnalysisCard';
import { ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
import { ANGLE_TYPES } from '../services/api';

export default function Results({ analysisResult, angles, onReset, onRetry, onUploadTargetAngle }) {
  if (!analysisResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-[#A7B0BD]">No multi-angle analysis results found.</p>
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-lg bg-[#141922] hover:bg-[#252E3B] text-[#F5F7FA] border border-[#283240] font-medium text-xs transition-colors cursor-pointer"
        >
          Return to Studio
        </button>
      </div>
    );
  }

  const uploadedAngles = ANGLE_TYPES.map(a => ({
    ...a,
    photo: angles[a.id]
  })).filter(item => item.photo);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#202731]">
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-2 text-xs font-medium text-[#A7B0BD] hover:text-[#F5F7FA] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Diagnose Another Component</span>
        </button>

        <div className="flex items-center space-x-3 text-xs text-[#A7B0BD]">
          <span>Report ID: <span className="font-mono text-[#F5F7FA]">#{analysisResult.reportId || 'RL-REPORT'}</span></span>
          <span>•</span>
          <span>Images analyzed: <span className="font-semibold text-[#F5F7FA]">{analysisResult.imageCount || uploadedAngles.length}</span></span>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Multi-Angle Gallery Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-[#202731] bg-[#10141A] space-y-4 sticky top-24">
            <h3 className="text-xs font-bold text-[#A7B0BD] uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#4F8A68]" />
              <span>Multi-Angle Input Pack ({uploadedAngles.length})</span>
            </h3>

            {/* Uploaded Damage Photo Display */}
            <div className="space-y-3">
              {uploadedAngles.length > 0 ? (
                uploadedAngles.map((item, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden bg-[#0C1015] border border-[#202731] p-2 space-y-2">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-[#07090C]">
                      <img
                        src={item.photo.previewUrl}
                        alt={item.photo.name || 'Damage Photo'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#07090C]/90 text-[10px] font-mono text-[#A7B0BD] border border-[#202731]">
                        {item.photo.name || 'Damage Photo'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#A7B0BD] px-1">
                      <span>Size: <strong className="text-[#F5F7FA]">{item.photo.size || '1.4 MB'}</strong></span>
                      <span className="text-[#4F8A68] font-medium">✓ Analyzed</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#0C1015] border border-[#202731] text-xs text-[#A7B0BD] text-center">
                  Damage Photo Processed
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between py-1 border-b border-[#202731]">
                <span className="text-[#667180]">Vision Engine</span>
                <span className="font-medium text-[#A7B0BD]">AI Guided Angle Pipeline</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#202731]">
                <span className="text-[#667180]">OCR Model</span>
                <span className="font-mono text-[#F5F7FA]">Active (Photo 3)</span>
              </div>
            </div>

            <button
              onClick={onReset}
              className="w-full mt-4 py-2.5 px-4 rounded-lg bg-[#141922] hover:bg-[#141922] text-[#F5F7FA] font-medium text-xs border border-[#202731] hover:border-[#283240] transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#A7B0BD]" />
              <span>Start New Diagnosis</span>
            </button>
          </div>
        </div>

        {/* Right Column: Unified Diagnostic Report */}
        <div className="lg:col-span-8">
          <AnalysisCard
            result={analysisResult}
            angles={angles}
            onReset={onReset}
            onRetry={onRetry}
            onUploadTargetAngle={onUploadTargetAngle}
          />
        </div>

      </div>

    </div>
  );
}
