import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { QuickCheckPage } from './components/QuickCheckPage';
import { EvaluationLab } from './components/EvaluationLab';
import { ResultsDashboard } from './components/ResultsDashboard';
import { BenchmarkScenariosPage } from './components/BenchmarkScenariosPage';
import { ComparisonMode } from './components/ComparisonMode';
import { HistoryPage } from './components/HistoryPage';
import { MethodologyPage } from './components/MethodologyPage';
import { AboutPage } from './components/AboutPage';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { AIConnectionsPage } from './components/AIConnectionsPage';
import { GoogleConnectionsPage } from './components/GoogleConnectionsPage';
import { UserDashboardPage } from './components/UserDashboardPage';
import { AppSettings, EvaluationResult, AIAnswerResponse, BenchmarkScenario, HistoryRecord } from './types';
import { loadSettings, saveSettings, saveEvaluationToHistory, getStoredHistory } from './utils/storage';
import { saveEvaluationToCloud } from './utils/cloudStorage';
import { useAuth } from './context/AuthContext';

export function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Active evaluation data
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationResult | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<BenchmarkScenario | null>(null);
  const [historyKey, setHistoryKey] = useState<number>(0);

  const updateSettings = (newPartial: Partial<AppSettings>) => {
    const updated = { ...settings, ...newPartial };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleEvaluationComplete = (result: EvaluationResult) => {
    setCurrentEvaluation(result);
    // Save locally
    saveEvaluationToHistory(result);
    // If user is authenticated, save to Firestore
    if (user?.uid) {
      saveEvaluationToCloud(user.uid, result);
    }
    setHistoryKey((prev) => prev + 1);
    // Switch view to Results Dashboard
    setActiveTab('results');
  };

  const handleRunScenario = (scenario: BenchmarkScenario) => {
    setSelectedScenario(scenario);
    setActiveTab('eval-lab');
  };

  const handleOpenEvaluationFromHistory = (evalResult: EvaluationResult) => {
    setCurrentEvaluation(evalResult);
    setActiveTab('results');
  };

  const refreshHistory = () => {
    setHistoryKey((prev) => prev + 1);
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-slate-950 ${settings.presentationMode ? 'presentation-mode' : ''}`}>
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        updateSettings={updateSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        hasActiveEvaluation={Boolean(currentEvaluation)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'landing' && (
          <LandingPage
            onStartEvaluation={() => setActiveTab('quick-check')}
            onViewMethodology={() => setActiveTab('methodology')}
            onSelectScenario={handleRunScenario}
            settings={settings}
          />
        )}

        {activeTab === 'quick-check' && (
          <QuickCheckPage
            settings={settings}
            onEvaluationComplete={handleEvaluationComplete}
            onNavigateToLab={() => setActiveTab('eval-lab')}
          />
        )}

        {activeTab === 'eval-lab' && (
          <EvaluationLab
            settings={settings}
            initialScenario={selectedScenario}
            onEvaluationComplete={handleEvaluationComplete}
          />
        )}

        {activeTab === 'results' && (
          currentEvaluation ? (
            <ResultsDashboard
              evaluation={currentEvaluation}
              onNewEvaluation={() => setActiveTab('quick-check')}
            />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 max-w-xl mx-auto my-12">
              <h3 className="text-lg font-bold text-white">No Active Evaluation Report</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Run a Quick Check or select a Benchmark Scenario to generate a comprehensive reliability report.
              </p>
              <button
                onClick={() => setActiveTab('quick-check')}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
              >
                Go to Quick Check
              </button>
            </div>
          )
        )}

        {activeTab === 'scenarios' && (
          <BenchmarkScenariosPage onRunScenario={handleRunScenario} />
        )}

        {activeTab === 'comparison' && (
          <ComparisonMode settings={settings} />
        )}

        {activeTab === 'history' && (
          <HistoryPage key={historyKey} onOpenEvaluation={handleOpenEvaluationFromHistory} />
        )}

        {activeTab === 'ai-connections' && (
          <AIConnectionsPage settings={settings} updateSettings={updateSettings} />
        )}

        {activeTab === 'google-connections' && (
          <GoogleConnectionsPage />
        )}

        {activeTab === 'dashboard' && (
          <UserDashboardPage
            settings={settings}
            updateSettings={updateSettings}
            localHistory={getStoredHistory()}
            onHistoryUpdated={refreshHistory}
            onOpenAuthModal={() => setIsAuthOpen(true)}
          />
        )}

        {activeTab === 'methodology' && <MethodologyPage />}

        {activeTab === 'about' && <AboutPage settings={settings} />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} settings={settings} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        updateSettings={updateSettings}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        localHistory={getStoredHistory()}
        onHistoryUpdated={refreshHistory}
      />
    </div>
  );
}

export default App;
