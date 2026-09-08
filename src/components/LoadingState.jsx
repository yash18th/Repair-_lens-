import React from 'react';
import DiagnosticTelemetryScan from './DiagnosticTelemetryScan';

export default function LoadingState({ angles = {}, stage = 'analyzing', category = 'phone' }) {
  return (
    <div className="w-full max-w-2xl mx-auto my-4 animate-fadeIn">
      <DiagnosticTelemetryScan
        stage={stage}
        isAnalyzing={true}
        angles={angles}
        selectedCategory={category}
      />
    </div>
  );
}
