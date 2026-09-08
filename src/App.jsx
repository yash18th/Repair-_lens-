import React, { useEffect, useState, useRef } from 'react';
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
import { getCurrentPositionPromise } from './services/locationService';
import { getApiBaseUrl } from './services/config';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-[#202731] bg-[#10141A] shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
        <div className="border-b border-[#202731] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#202731] bg-[#141922] text-[#A7B0BD]">
                <LockKeyhole className="h-4 w-4 text-[#F5F7FA]" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8294AA]">Secure Access</div>
                <h3 className="mt-0.5 text-base font-bold tracking-tight text-[#F5F7FA]">Sign in to start your diagnosis</h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#202731] bg-[#0C1015] p-1.5 text-[#667180] transition-colors hover:text-[#F5F7FA] hover:border-[#283240]"
              aria-label="Close authentication prompt"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="rounded-lg border border-[#202731] bg-[#0C1015] px-3.5 py-2.5 text-xs text-[#A7B0BD] leading-relaxed">
            Create an account or sign in to save your diagnostic reports and scan history.
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
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
            className="w-full rounded-lg border border-[#202731] bg-[#141922] px-3 py-2 text-xs font-medium text-[#A7B0BD] transition-colors hover:text-[#F5F7FA] hover:border-[#283240]"
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
  const [diagnosticStage, setDiagnosticStage] = useState('idle');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState('');
  const [presetUsed, setPresetUsed] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const [pendingDiagnosisTarget, setPendingDiagnosisTarget] = useState(null);
  const activeRequestIdRef = useRef(0);
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    try {
      const storedTarget = window.sessionStorage.getItem('repairlens.pendingDiagnosis');
      if (storedTarget) {
        const parsed = JSON.parse(storedTarget);
        if (parsed?.category) {
          setSelectedCategory(parsed.category);
          setCurrentView(parsed.view || 'studio-category');
          setActiveTab('studio');
        }
        window.sessionStorage.removeItem('repairlens.pendingDiagnosis');
      }

      const redirectTarget = window.sessionStorage.getItem('repairlens.redirectAfterAuth');
      if (redirectTarget) {
        const parsedRedirect = JSON.parse(redirectTarget);
        if (parsedRedirect?.tab) {
          setActiveTab(parsedRedirect.tab);
          if (parsedRedirect.tab === 'studio' && parsedRedirect.category) {
            setSelectedCategory(parsedRedirect.category);
            setCurrentView(parsedRedirect.view || 'studio-category');
          }
        }
        window.sessionStorage.removeItem('repairlens.redirectAfterAuth');
      }
    } catch (error) {
      console.warn('Unable to restore saved auth target:', error.message);
      window.sessionStorage.removeItem('repairlens.pendingDiagnosis');
      window.sessionStorage.removeItem('repairlens.redirectAfterAuth');
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
    activeRequestIdRef.current += 1;
    setSelectedCategory(catId);
    setAngles(INITIAL_ANGLES);
    setAnalysisResult(null);
    setAnalysisError('');
    setPresetUsed(null);
    setCurrentView('studio-category');
  };

  const handleBackToCategories = () => {
    setCurrentView('home');
  };

  const handleAngleUpdated = (slotId, fileData) => {
    activeRequestIdRef.current += 1;
    setAngles(prev => ({
      ...prev,
      [slotId]: fileData
    }));
    setPresetUsed(null);
    setAnalysisResult(null);
    setAnalysisError('');
  };

  const handleRemoveAngle = (slotId) => {
    activeRequestIdRef.current += 1;
    setAngles(prev => ({
      ...prev,
      [slotId]: null
    }));
    setPresetUsed(null);
    setAnalysisResult(null);
    setAnalysisError('');
  };

  const handleClearAllAngles = () => {
    activeRequestIdRef.current += 1;
    setAngles(INITIAL_ANGLES);
    setAnalysisResult(null);
    setAnalysisError('');
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
    setDiagnosticStage('validating');

    try {
      const location = await Promise.race([
        getCurrentPositionPromise(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Location timeout')), 1000))
      ]).catch(() => null);
      const result = await analyzeImage(updatedAngles, null, selectedCategory, location, (stage) => setDiagnosticStage(stage));
      setAnalysisResult(result);
      setIsAnalyzing(false);
      setDiagnosticStage('complete');
      setCurrentView('results');
    } catch (error) {
      console.error('Failed to re-analyze guided photo:', error);
      setIsAnalyzing(false);
      setDiagnosticStage('error');
    }
  };

  const handleAnalyzeWithPreset = async (presetAngles, presetId, category) => {
    if (!isAuthenticated) {
      openAuthGate({ category: category || selectedCategory, view: 'studio-category' });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError('');
    setDiagnosticStage('validating');
    try {
      const result = await analyzeImage(presetAngles, presetId, category, null, (stage) => setDiagnosticStage(stage));
      setAnalysisResult(result);
      setIsAnalyzing(false);
      setDiagnosticStage('complete');
      setCurrentView('results');
    } catch (error) {
      console.error('Failed to analyze images:', error);
      setAnalysisError(error.message || 'AI diagnosis failed. Please try again.');
      setIsAnalyzing(false);
      setDiagnosticStage('error');
    }
  };

  const saveDiagnosisHistory = async (result, category = selectedCategory) => {
    if (!result || !result.success || !result.problemTitle || !isAuthenticated) {
      return;
    }

    try {
      const apiBase = getApiBaseUrl();

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

    const requestId = ++activeRequestIdRef.current;
    setAnalysisResult(null);
    setAnalysisError('');
    setIsAnalyzing(true);
    setDiagnosticStage('validating');
    try {
      const location = await Promise.race([
        getCurrentPositionPromise(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Location timeout')), 1000))
      ]).catch(() => null);
      const result = await analyzeImage(angles, presetUsed, selectedCategory, location, (stage) => setDiagnosticStage(stage));
      if (activeRequestIdRef.current === requestId) {
        setAnalysisResult(result);
        setIsAnalyzing(false);
        setDiagnosticStage('complete');
        setCurrentView('results');
      }
    } catch (error) {
      if (activeRequestIdRef.current === requestId) {
        console.error('Failed to analyze images:', error);
        setAnalysisError(error.message || 'AI diagnosis failed. Please try again.');
        setIsAnalyzing(false);
        setDiagnosticStage('error');
      }
    }
  };

  const handleReset = () => {
    activeRequestIdRef.current += 1;
    setAngles(INITIAL_ANGLES);
    setAnalysisResult(null);
    setAnalysisError('');
    setIsAnalyzing(false);
    setDiagnosticStage('idle');
    setPresetUsed(null);
    setCurrentView('home');
    setActiveTab('studio');
  };

  const handleTabChange = (tabId) => {
    if ((tabId === 'history' || tabId === 'profile' || tabId === 'settings') && !isAuthenticated) {
      window.sessionStorage.setItem('repairlens.redirectAfterAuth', JSON.stringify({ path: '/dashboard', tab: tabId }));
      navigate('/login', { replace: false });
      return;
    }

    setActiveTab(tabId);

    if (tabId === 'studio') {
      setCurrentView('home');
      return;
    }

    if (tabId === 'phone' || tabId === 'computer' || tabId === 'electronics' || tabId === 'appliance' || tabId === 'vehicles' || tabId === 'other') {
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
    navigate('/dashboard', { replace: true });
  };

  const handleStartDiagnosisRequest = (category = selectedCategory) => {
    openAuthGate({ category, view: 'studio-category' });
  };

  const handleNewDiagnosis = () => {
    if (!isAuthenticated) {
      const target = { category: selectedCategory, view: 'studio-category' };
      window.sessionStorage.setItem('repairlens.pendingDiagnosis', JSON.stringify(target));
      window.sessionStorage.setItem('repairlens.redirectAfterAuth', JSON.stringify({
        path: '/dashboard',
        tab: 'studio',
        category: target.category,
        view: target.view,
      }));
      navigate('/login', { replace: false });
      return;
    }

    setSelectedCategory(selectedCategory);
    setAngles(INITIAL_ANGLES);
    setAnalysisResult(null);
    setPresetUsed(null);
    setCurrentView('studio-category');
    setActiveTab('studio');
  };

  return (
    <div className="premium-shell min-h-screen flex flex-col selection:bg-[#8294AA]/30 selection:text-[#F5F7FA]">
      <AuthGateModal
        isOpen={authGateOpen}
        pendingTarget={pendingDiagnosisTarget || { category: selectedCategory, view: 'studio-category' }}
        onClose={() => setAuthGateOpen(false)}
        onSelectAuthMode={(route) => {
          const target = pendingDiagnosisTarget || { category: selectedCategory, view: 'studio-category' };
          window.sessionStorage.setItem('repairlens.redirectAfterAuth', JSON.stringify({ path: '/dashboard', tab: 'studio', category: target.category, view: target.view }));
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
          isAuthenticated={isAuthenticated}
          currentView={currentView}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          onNewDiagnosis={handleNewDiagnosis}
          onSignIn={() => navigate('/login', { replace: false })}
          onOpenProfile={() => {
            setActiveTab('profile');
            setCurrentView('home');
          }}
        />

        <main className="flex-1 bg-[var(--bg-primary)]">
          {(activeTab === 'studio' || activeTab === 'phone' || activeTab === 'computer' || activeTab === 'electronics' || activeTab === 'appliance' || activeTab === 'vehicles' || activeTab === 'other') && (
            currentView === 'results' ? (
              <Results
                analysisResult={analysisResult}
                angles={angles}
                onReset={handleReset}
                onRetry={handleAnalyze}
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
                analysisError={analysisError}
                onSelectSamplePreset={handleSelectSamplePreset}
                onStartDiagnosisRequest={handleStartDiagnosisRequest}
                isAnalyzing={isAnalyzing}
                diagnosticStage={diagnosticStage}
                analysisResult={analysisResult}
              />
            )
          )}

          {activeTab === 'history' && (
            <HistoryPage
              onSelectPreset={handleSelectSamplePreset}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
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
              <span className="font-semibold text-[var(--text-primary)]">RepairLens Diagnostic Workspace</span>
              <span className="text-[var(--text-secondary)]">— Precision Diagnostics Platform</span>
            </div>
            <div className="text-[var(--text-muted)] text-[11px]">
              Technician Operations Edition
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleButtonClick = (e) => {
      const target = e.target.closest(
        'button, .premium-button, .premium-button-secondary, .category-card, [data-glow], [role="button"]'
      );
      if (!target || target.disabled) return;

      target.classList.remove('button-light-pulse');
      void target.offsetWidth; // trigger reflow for instant optical animation
      target.classList.add('button-light-pulse');

      setTimeout(() => {
        target.classList.remove('button-light-pulse');
      }, 600);
    };

    document.addEventListener('click', handleButtonClick, true);
    return () => document.removeEventListener('click', handleButtonClick, true);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<RepairLensDashboard />} />
      <Route path="/" element={<RepairLensDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
