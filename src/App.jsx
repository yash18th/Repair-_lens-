import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { LockKeyhole, Sparkles, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Results from './pages/Results';
import HistoryPage from './pages/History';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';
import { analyzeImage } from './services/api';

const INITIAL_ANGLES = {
  closeup: null,
  fullView: null,
  label: null,
  altAngle: null
};

function AuthGateModal({ isOpen, onClose, onSelectAuthMode, pendingTarget, onContinueAfterAuth }) {
  if (!isOpen) {
    return null;
  }

  const handleAuthRoute = (route) => {
    const payload = pendingTarget || { category: 'phone', view: 'studio-category' };
    window.sessionStorage.setItem('repairlens.pendingDiagnosis', JSON.stringify(payload));
    onClose();
    onSelectAuthMode(route);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-[26px] border border-[rgba(99,102,241,0.3)] bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(8,11,22,0.98))] shadow-[0_30px_80px_rgba(15,23,42,0.7)]">
        <div className="border-b border-[rgba(148,163,184,0.18)] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/30 bg-[rgba(139,92,246,0.12)] text-purple-300">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">Secure Access</div>
                <h3 className="mt-1 text-xl font-bold tracking-[-0.05em] text-white">Sign in to start your diagnosis</h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[rgba(148,163,184,0.2)] bg-white/5 p-2 text-slate-300 transition-colors hover:text-white"
              aria-label="Close authentication prompt"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="flex items-center gap-2 rounded-2xl border border-violet-500/20 bg-[rgba(59,130,246,0.08)] px-3 py-2 text-sm text-slate-200">
            <Sparkles className="h-4 w-4 text-violet-300" />
            <span>Create an account or sign in to save your diagnostic reports and scan history.</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleAuthRoute('/login')}
              className="premium-button justify-center"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleAuthRoute('/register')}
              className="premium-button-secondary justify-center"
            >
              Create Account
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-[rgba(148,163,184,0.2)] bg-transparent px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}

function RepairLensDashboard() {
  const [activeTab, setActiveTab] = useState('studio');
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('phone');
  const [angles, setAngles] = useState(INITIAL_ANGLES);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [presetUsed, setPresetUsed] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const [pendingDiagnosisTarget, setPendingDiagnosisTarget] = useState(null);
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    try {
      const storedTarget = window.sessionStorage.getItem('repairlens.pendingDiagnosis');
      if (!storedTarget) {
        return;
      }

      const parsed = JSON.parse(storedTarget);
      if (parsed?.category) {
        setSelectedCategory(parsed.category);
        setCurrentView(parsed.view || 'studio-category');
        setActiveTab('studio');
      }

      window.sessionStorage.removeItem('repairlens.pendingDiagnosis');
    } catch (error) {
      console.warn('Unable to restore pending diagnosis target:', error.message);
      window.sessionStorage.removeItem('repairlens.pendingDiagnosis');
    }
  }, []);

  const openAuthGate = (target = { category: selectedCategory, view: 'studio-category' }) => {
    if (isAuthenticated) {
      setSelectedCategory(target.category || selectedCategory);
      setCurrentView(target.view || 'studio-category');
      setActiveTab('studio');
      return;
    }

    setPendingDiagnosisTarget(target);
    setAuthGateOpen(true);
  };

  const handleSelectCategoryAndNavigate = (catId) => {
    setSelectedCategory(catId);
    setAngles(INITIAL_ANGLES);
    setAnalysisResult(null);
    setPresetUsed(null);
    setCurrentView('studio-category');
  };

  const handleBackToCategories = () => {
    setCurrentView('home');
  };

  const handleAngleUpdated = (slotId, fileData) => {
    setAngles(prev => ({
      ...prev,
      [slotId]: fileData
    }));
    setPresetUsed(null);
  };

  const handleRemoveAngle = (slotId) => {
    setAngles(prev => ({
      ...prev,
      [slotId]: null
    }));
    setPresetUsed(null);
  };

  const handleClearAllAngles = () => {
    setAngles(INITIAL_ANGLES);
    setAnalysisResult(null);
    setPresetUsed(null);
  };

  const handleSelectSamplePreset = (preset) => {
    if (!isAuthenticated) {
      openAuthGate({ category: preset.category || 'phone', view: 'studio-category' });
      return;
    }

    const formattedAngles = {
      closeup: preset.angles.closeup ? { name: preset.angles.closeup.name, previewUrl: preset.angles.closeup.url, type: 'JPG' } : null,
      fullView: preset.angles.fullView ? { name: preset.angles.fullView.name, previewUrl: preset.angles.fullView.url, type: 'JPG' } : null,
      label: preset.angles.label ? { name: preset.angles.label.name, previewUrl: preset.angles.label.url, type: 'JPG' } : null,
      altAngle: preset.angles.altAngle ? { name: preset.angles.altAngle.name, previewUrl: preset.angles.altAngle.url, type: 'JPG' } : null,
    };
    setAngles(formattedAngles);
    setSelectedCategory(preset.category || 'phone');
    setPresetUsed(preset.id);
    setActiveTab('studio');

    handleAnalyzeWithPreset(formattedAngles, preset.id, preset.category);
  };

  const handleUploadTargetAngle = async (slotId) => {
    if (!isAuthenticated) {
      openAuthGate({ category: selectedCategory, view: 'studio-category' });
      return;
    }

    const categoryTargetPhotos = {
      phone: {
        name: 'Phone Side Frame Angle.jpg',
        previewUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&q=80&w=800',
        type: 'JPG'
      },
      electronics: {
        name: 'PCB Solder Side Angle.jpg',
        previewUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
        type: 'JPG'
      },
      auto: {
        name: 'Bumper Depth Angle.jpg',
        previewUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
        type: 'JPG'
      },
      appliance: {
        name: 'Appliance Rear Hose.jpg',
        previewUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        type: 'JPG'
      },
      general: {
        name: 'Hardware Side Perspective.jpg',
        previewUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
        type: 'JPG'
      }
    };

    const targetPhoto = categoryTargetPhotos[selectedCategory] || categoryTargetPhotos.phone;

    const updatedAngles = {
      ...angles,
      [slotId || 'altAngle']: targetPhoto
    };

    setAngles(updatedAngles);
    setIsAnalyzing(true);

    try {
      const result = await analyzeImage(updatedAngles, null, selectedCategory);
      setAnalysisResult(result);
      await saveDiagnosisHistory(result, selectedCategory);
      setIsAnalyzing(false);
      setCurrentView('results');
    } catch (error) {
      console.error('Failed to re-analyze guided photo:', error);
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeWithPreset = async (presetAngles, presetId, category) => {
    if (!isAuthenticated) {
      openAuthGate({ category: category || selectedCategory, view: 'studio-category' });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(presetAngles, presetId, category);
      setAnalysisResult(result);
      await saveDiagnosisHistory(result, category || selectedCategory);
      setIsAnalyzing(false);
      setCurrentView('results');
    } catch (error) {
      console.error('Failed to analyze images:', error);
      setIsAnalyzing(false);
    }
  };

  const saveDiagnosisHistory = async (result, category = selectedCategory) => {
    if (!result || !result.success || !result.problemTitle || !isAuthenticated) {
      return;
    }

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || (
        typeof window !== 'undefined' && window.location.hostname !== 'localhost'
          ? '/api'
          : 'http://localhost:4000'
      );

      const categoryLabel = {
        phone: 'Smartphone & Tablet',
        electronics: 'Electronics & PCB',
        appliance: 'Home Appliance',
        auto: 'Automotive Bodywork',
      }[category] || 'Smartphone & Tablet';

      const imageCount = Object.values(angles || {}).filter(Boolean).length || 1;
      const firstImage = Object.values(angles || {}).find(Boolean);
      const estimateString = result.estimatedCost?.formatted || (typeof result.estimatedCost === 'string' ? result.estimatedCost : null);
      const costMin = typeof result.estimatedCost?.min === 'number' ? String(result.estimatedCost.min) : null;
      const costMax = typeof result.estimatedCost?.max === 'number' ? String(result.estimatedCost.max) : null;
      const reportId = result.reportId || `RL-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const payload = {
        reportId,
        category: categoryLabel,
        deviceType: result.extractedModel?.modelName || 'Unknown device',
        deviceName: result.extractedModel?.modelName || result.problemTitle || 'Unknown device',
        issueDescription: result.problemDescription || result.problemTitle || 'Issue detected',
        problemDescription: result.problemDescription || result.problemTitle || 'Issue detected',
        diagnosis: result.problemTitle || result.detectedDamage || 'Diagnostic completed',
        severity: result.severity || 'Medium',
        confidence: typeof result.confidenceEngine?.diagnosisConfidence === 'number' ? result.confidenceEngine.diagnosisConfidence : (result.confidence ?? 0),
        recommendation: result.recommendation || null,
        estimatedRepairCost: estimateString,
        estimatedCost: estimateString,
        costMin,
        costMax,
        diySuitability: typeof result.diySuitabilityScore === 'number' ? result.diySuitabilityScore : null,
        imageCount,
        uploadedImageUrl: firstImage?.previewUrl || null,
        analysisData: {
          presetUsed: presetUsed || null,
          selectedCategory: category,
          timestamp: result.timestamp || new Date().toISOString(),
          detectedDamage: result.detectedDamage || null,
          damageMap: result.damageMap || null,
          extractedModel: result.extractedModel || null,
          recommendation: result.recommendation || null,
        },
      };

      const response = await fetch(`${apiBase}/api/scans`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('Unable to save diagnostic history:', responseData.message || 'Save failed');
      }
    } catch (error) {
      console.warn('Unable to save diagnostic history:', error.message);
    }
  };

  const handleAnalyze = async () => {
    if (!isAuthenticated) {
      openAuthGate({ category: selectedCategory, view: 'studio-category' });
      return;
    }

    const hasAnyPhoto = Object.values(angles).some(Boolean);
    if (!hasAnyPhoto) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(angles, presetUsed, selectedCategory);
      setAnalysisResult(result);
      await saveDiagnosisHistory(result, selectedCategory);
      setIsAnalyzing(false);
      setCurrentView('results');
    } catch (error) {
      console.error('Failed to analyze images:', error);
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAngles(INITIAL_ANGLES);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setPresetUsed(null);
    setCurrentView('home');
    setActiveTab('studio');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    if (tabId === 'studio') {
      setCurrentView('home');
      return;
    }

    if (tabId === 'phone' || tabId === 'electronics' || tabId === 'appliance') {
      setSelectedCategory(tabId);
      setAngles(INITIAL_ANGLES);
      setAnalysisResult(null);
      setPresetUsed(null);
      setCurrentView('studio-category');
      return;
    }

    if (!analysisResult) {
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleStartDiagnosisRequest = (category = selectedCategory) => {
    openAuthGate({ category, view: 'studio-category' });
  };

  return (
    <div className="premium-shell min-h-screen flex flex-col selection:bg-[#b08a4a] selection:text-[#252321]">
      <AuthGateModal
        isOpen={authGateOpen}
        pendingTarget={pendingDiagnosisTarget || { category: selectedCategory, view: 'studio-category' }}
        onClose={() => setAuthGateOpen(false)}
        onSelectAuthMode={(route) => {
          navigate(route, { replace: false });
        }}
        onContinueAfterAuth={() => {
          setAuthGateOpen(false);
        }}
      />
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
        <Navbar
          activeTab={activeTab}
          onReset={handleReset}
          currentView={currentView}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 bg-[var(--bg-primary)]">
          {(activeTab === 'studio' || activeTab === 'phone' || activeTab === 'electronics' || activeTab === 'appliance') && (
            currentView === 'results' ? (
              <Results
                analysisResult={analysisResult}
                angles={angles}
                onReset={handleReset}
                onUploadTargetAngle={handleUploadTargetAngle}
              />
            ) : (
              <Home
                currentView={currentView}
                angles={angles}
                selectedCategory={selectedCategory}
                onSelectCategoryAndNavigate={handleSelectCategoryAndNavigate}
                onBackToCategories={handleBackToCategories}
                onAngleUpdated={handleAngleUpdated}
                onRemoveAngle={handleRemoveAngle}
                onClearAllAngles={handleClearAllAngles}
                onAnalyze={handleAnalyze}
                onSelectSamplePreset={handleSelectSamplePreset}
                onStartDiagnosisRequest={handleStartDiagnosisRequest}
                isAnalyzing={isAnalyzing}
              />
            )
          )}

          {activeTab === 'history' && (
            <HistoryPage
              onSelectPreset={handleSelectSamplePreset}
              searchQuery={searchQuery}
              onStartDiagnosis={handleStartDiagnosisRequest}
            />
          )}

          {activeTab === 'profile' && (
            <Profile
              onSelectCategoryAndNavigate={handleSelectCategoryAndNavigate}
              onLogout={handleLogout}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>

        <footer className="border-t border-[var(--border-soft)] bg-[var(--bg-secondary)] py-6 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-[var(--text-secondary)]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-[var(--text-primary)]">RepairLens Dashboard</span>
              <span className="text-[var(--text-secondary)]">— Diagnostic Platform</span>
            </div>
            <div className="text-[var(--text-muted)] text-[11px]">
              Vite + React 18 + Tailwind CSS
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<RepairLensDashboard />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
