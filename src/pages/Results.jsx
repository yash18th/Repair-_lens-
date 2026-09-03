import React from 'react';
import AnalysisCard from '../components/AnalysisCard';
import { ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
import { ANGLE_TYPES } from '../services/api';

export default function Results({ analysisResult, angles, onReset, onUploadTargetAngle }) {
  if (!analysisResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-400">No multi-angle analysis results found.</p>
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Diagnose Another Component</span>
        </button>

        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <span>Report ID: <span className="font-mono text-slate-200">#RL-MULTI-{Math.floor(100000 + Math.random() * 900000)}</span></span>
          <span>•</span>
          <span>Angles Processed: <span className="font-bold text-purple-400">{uploadedAngles.length} Photos</span></span>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Multi-Angle Gallery Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 sticky top-24">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Multi-Angle Input Pack ({uploadedAngles.length})</span>
            </h3>

            {/* Uploaded Damage Photo Display */}
            <div className="space-y-3">
              {uploadedAngles.length > 0 ? (
                uploadedAngles.map((item, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700 p-2 space-y-2">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950">
                      <img
                        src={item.photo.previewUrl}
                        alt={item.photo.name || 'Damage Photo'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[11px] font-mono font-bold text-purple-300 border border-purple-500/30">
                        {item.photo.name || 'Damage Photo'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span>Size: <strong className="text-slate-200">{item.photo.size || '1.4 MB'}</strong></span>
                      <span className="text-emerald-400 font-bold">✓ Analyzed</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 text-center">
                  Damage Photo Processed
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">Vision Engine</span>
                <span className="font-semibold text-purple-400">AI Guided Angle Pipeline</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">OCR Model</span>
                <span className="font-mono text-slate-200">Active (Photo 3)</span>
              </div>
            </div>

            <button
              onClick={onReset}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4 text-purple-400" />
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
            onUploadTargetAngle={onUploadTargetAngle}
          />
        </div>

      </div>

    </div>
  );
}
