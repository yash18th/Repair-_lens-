import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Results from './pages/Results';
import HistoryPage from './pages/History';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';
import { analyzeImage } from './services/api';

const INITIAL_ANGLES = {
  closeup: null,
  fullView: null,
  label: null,
  altAngle: null
};

export default function App() {
  const [activeTab, setActiveTab] = useState('studio');
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'studio-category' | 'results'
  const [selectedCategory, setSelectedCategory] = useState('phone');
  const [angles, setAngles] = useState(INITIAL_ANGLES);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [presetUsed, setPresetUsed] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
      setIsAnalyzing(false);
      setCurrentView('results');
    } catch (error) {
      console.error('Failed to re-analyze guided photo:', error);
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeWithPreset = async (presetAngles, presetId, category) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(presetAngles, presetId, category);
      setAnalysisResult(result);
      setIsAnalyzing(false);
      setCurrentView('results');
    } catch (error) {
      console.error('Failed to analyze images:', error);
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async () => {
    const hasAnyPhoto = Object.values(angles).some(Boolean);
    if (!hasAnyPhoto) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(angles, presetUsed, selectedCategory);
      setAnalysisResult(result);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        
        <Navbar
          activeTab={activeTab}
          onReset={handleReset}
          currentView={currentView}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1">
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
                isAnalyzing={isAnalyzing}
              />
            )
          )}

          {activeTab === 'history' && (
            <HistoryPage
              onSelectPreset={handleSelectSamplePreset}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'profile' && (
            <Profile
              onSelectCategoryAndNavigate={handleSelectCategoryAndNavigate}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>

        <footer className="glass-panel border-t border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-200">RepairLens Dashboard</span>
              <span>— AI-Guided Camera Engine</span>
            </div>
            <div className="text-slate-500 text-[11px]">
              Vite + React 18 + Tailwind CSS
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
