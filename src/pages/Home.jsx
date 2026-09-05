import React from 'react';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import LoadingState from '../components/LoadingState';
import { ITEM_CATEGORIES } from '../services/api';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';

const CATEGORY_INFO = {
  phone: {
    title: 'Smartphone & Tablet',
    icon: '📱',
    badge: 'Display & component diagnostics',
    description: 'Inspect display damage, battery faults, charging issues, and frame stress with structured multi-angle analysis.',
    whatToCapture: [
      'Close-up of glass crack or display shatter',
      'Clear overview of the device face',
      'Model number sticker or rear label',
      'Good lighting with minimal glare',
    ],
  },
  electronics: {
    title: 'Electronics & PCB',
    icon: '💻',
    badge: 'Circuit board diagnostics',
    description: 'Assess burned components, capacitor faults, VRM failure, and board-level issues through focused imaging.',
    whatToCapture: [
      'Close-up of burnt IC    ii.  or charred component',
      'Top-down PCB layout photo',
      'Silkscreen part number or board revision tag',
      'Clear focus on damaged traces',
    ],
  },
  computer: { title: 'Computers & Laptops', icon: '💻', badge: 'Computer diagnostics', description: 'Assess visible screen, keyboard, hinge, casing, port and board damage.', whatToCapture: ['Close-up of damaged area', 'Full device view', 'Model label', 'Side angle'] },
  vehicles: {
    title: 'Vehicles',
    icon: '🚗',
    badge: 'Paint & panel evaluation',
    description: 'Review visible body, bumper, light, glass and tyre damage. Hidden mechanical faults require physical inspection.',
    whatToCapture: [
      'Close-up of scratch or dent',
      'Overview of the panel surface',
      'VIN tag or paint-code reference',
      'Side angle for depth evaluation',
    ],
  },
  other: { title: 'Other', icon: '📦', badge: 'Visual repair assessment', description: 'Assess visibly damaged repairable items.', whatToCapture: ['Close-up', 'Full object', 'Model label if available', 'Another angle'] },
  appliance: {
    title: 'Home Appliance',
    icon: '🔌',
    badge: 'Motor and electrical diagnostics',
    description: 'Examine seals, wiring, leakage points, and component wear for practical repair recommendations.',
    whatToCapture: [
      'Close-up of sealed joint or rust',
      'Front overview of the appliance',
      'Model label with ratings',
      'Clear lighting on the affected area',
    ],
  },
};

export default function Home({
  currentView,
  angles,
  selectedCategory,
  onSelectCategoryAndNavigate,
  onBackToCategories,
  onAngleUpdated,
  onRemoveAngle,
  onClearAllAngles,
  onAnalyze,
  onStartDiagnosisRequest,
  isAnalyzing,
}) {
  const hasAnyPhoto = Object.values(angles).some(Boolean);
  const activeCategoryInfo = CATEGORY_INFO[selectedCategory] || CATEGORY_INFO.phone;

  if (currentView === 'home') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fadeIn">
        <section className="hero-panel premium-panel tech-grid relative overflow-hidden rounded-[22px] p-6 sm:p-8 lg:p-10">
          <div className="relative z-10 space-y-6">
            <div className="eyebrow">
              <span className="gold-dot"></span>
              <span>Diagnostic Workspace</span>
            </div>

            <div className="max-w-4xl space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.9] text-[var(--text-primary)] tracking-[-0.07em] font-black">
                Diagnose with
                <span className="block bg-[linear-gradient(135deg,#f8fafc_0%,#c7d2fe_28%,#8b5cf6_62%,#22d3ee_100%)] bg-clip-text text-transparent">
                  precision engineered. ⚡.
                </span>
              </h1>
              <p className="max-w-xl text-base text-[var(--text-secondary)] leading-7">
                Professional device diagnostics, repair intelligence, and actionable insights for the real-world issues your team needs to solve.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  className="premium-button"
                  onClick={() => (onStartDiagnosisRequest ? onStartDiagnosisRequest('phone') : onSelectCategoryAndNavigate('phone'))}
                >
                  Start a diagnosis
                </button>
                <button type="button" className="premium-button-secondary" onClick={() => onSelectCategoryAndNavigate('electronics')}>
                  View categories
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6 pt-2">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Primary modules
            </div>
          </div>

          <div className="space-y-4">
            {ITEM_CATEGORIES.map((category, index) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategoryAndNavigate(category.id)}
                className="category-card group w-full px-4 sm:px-5 py-4 sm:py-5 text-left transition-all duration-180"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="text-[13px] font-semibold bg-[linear-gradient(135deg,#22d3ee,#8b5cf6)] bg-clip-text text-transparent tracking-[0.14em] uppercase pt-1">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl sm:text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                        {category.label}
                      </div>
                      <div className="mt-1 text-sm text-[var(--text-secondary)] leading-6 max-w-2xl">
                        {category.desc}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[var(--text-primary)]">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">View category</span>
                    <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-transform duration-180 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-6 border-t border-[var(--border-soft)]">
          <div className="small-stat p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)] mb-3">Recent activity</div>
            <div className="text-sm text-[var(--text-primary)]">No recent scans</div>
          </div>

          <div className="small-stat p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)] mb-3">Quick actions</div>
            <div className="space-y-2 text-sm text-[var(--text-primary)]">
              <div>Start new diagnosis</div>
              <div>Review saved reports</div>
            </div>
          </div>

          <div className="small-stat p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)] mb-3">Status</div>
            <div className="text-sm text-[var(--text-primary)]">Ready for inspection</div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-soft)]">
        <button
          onClick={onBackToCategories}
          className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to categories</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <span>Active context:</span>
          <span className="px-2.5 py-1 border border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-primary)] flex items-center gap-2">
            <span>{activeCategoryInfo.icon}</span>
            <span>{activeCategoryInfo.badge}</span>
          </span>
        </div>
      </div>

      <div className="premium-panel p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-soft)] flex items-center justify-center text-3xl flex-shrink-0">
            {activeCategoryInfo.icon}
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl text-[var(--text-primary)] display-serif">
              {activeCategoryInfo.title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-1 max-w-3xl">
              {activeCategoryInfo.description}
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            <span className="w-5 h-5 rounded-full border border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-primary)] flex items-center justify-center">2</span>
            <span>Upload damage photo</span>
          </div>
        </div>

        {isAnalyzing ? (
          <LoadingState angles={angles} />
        ) : (
          <div className="space-y-6">
            <div className="premium-panel p-6 sm:p-8">
              <ImageUploader
                angles={angles}
                selectedCategory={selectedCategory}
                onAngleUpdated={onAngleUpdated}
                onRemoveAngle={onRemoveAngle}
              />
            </div>

            {hasAnyPhoto && (
              <ImagePreview
                angles={angles}
                onAnalyze={onAnalyze}
                onRemoveAngle={onRemoveAngle}
                onClearAll={onClearAllAngles}
              />
            )}
          </div>
        )}
      </section>
    </div>
  );
}
