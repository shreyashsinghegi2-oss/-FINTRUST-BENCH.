import React, { useState, useEffect } from 'react';
import { X, Sliders, Key, CheckCircle2, AlertTriangle, RefreshCw, Cpu, Lock } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  updateSettings,
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState(settings.apiKeyOverride || '');

  useEffect(() => {
    if (isOpen) {
      testBackendHealth();
    }
  }, [isOpen]);

  const testBackendHealth = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data.status === 'ok') {
        if (data.hasApiKey) {
          setTestResult({
            success: true,
            message: `Connected to Gemini API server (${data.model}). Environment API key detected.`,
          });
        } else {
          setTestResult({
            success: false,
            message: 'Server online, but GEMINI_API_KEY environment variable is missing on server. Enable Demo Mode or provide key override.',
          });
        }
      } else {
        setTestResult({ success: false, message: 'Server health check returned error.' });
      }
    } catch {
      setTestResult({
        success: false,
        message: 'Could not reach server endpoint. App will use Demo Mode fallback.',
      });
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold">FinTrustBench Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Health Status */}
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Backend & Gemini API Status</span>
            </span>
            <button
              onClick={testBackendHealth}
              disabled={testing}
              className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-medium"
            >
              <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing...' : 'Test'}</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg text-xs flex items-start space-x-2 ${
                testResult.success
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-950/50 text-amber-300 border border-amber-500/30'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Settings Form */}
        <div className="space-y-4 text-sm">
          {/* Demo Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700">
            <div>
              <span className="font-medium text-white block">Demo Mode (Offline Evaluation)</span>
              <span className="text-xs text-slate-400 block">
                Uses pre-configured financial responses and deterministic calculations without calling Gemini API.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.demoMode}
                onChange={(e) => updateSettings({ demoMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Presentation Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700">
            <div>
              <span className="font-medium text-white block">Presentation Mode</span>
              <span className="text-xs text-slate-400 block">
                Optimizes UI text scaling and layouts for large screens, live demonstrations, and benchmark displays.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.presentationMode}
                onChange={(e) => updateSettings({ presentationMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          {/* Model Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Gemini Model Selection
            </label>
            <select
              value={settings.model}
              onChange={(e) => updateSettings({ model: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 text-sm"
            >
              <option value="gemini-3.6-flash">gemini-3.6-flash (Recommended Default)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Advanced Reasoning)</option>
            </select>
          </div>

          {/* Answer Generation Temperature */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Answer Generation Temperature</span>
              <span className="text-cyan-400 font-mono">{settings.temperatureAnswer}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.1"
              value={settings.temperatureAnswer}
              onChange={(e) => updateSettings({ temperatureAnswer: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-950 rounded-lg h-2"
            />
            <span className="text-[11px] text-slate-400 block">
              Recommended: 0.3 - 0.5 for educational reasoning clarity.
            </span>
          </div>

          {/* Evaluator Temperature */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Evaluator Temperature (Strict Reliability)</span>
              <span className="text-cyan-400 font-mono">{settings.temperatureEval}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.5"
              step="0.05"
              value={settings.temperatureEval}
              onChange={(e) => updateSettings({ temperatureEval: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-950 rounded-lg h-2"
            />
            <span className="text-[11px] text-slate-400 block">
              Recommended: 0.0 - 0.2 for strict academic consistency.
            </span>
          </div>

          {/* Development API Key Override */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center space-x-1">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Development API Key Override (Optional)</span>
              </span>
            </div>
            <input
              type="password"
              placeholder="Paste GEMINI_API_KEY for testing..."
              value={apiKeyInput}
              onChange={(e) => {
                setApiKeyInput(e.target.value);
                updateSettings({ apiKeyOverride: e.target.value });
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs font-mono"
            />
            <div className="flex items-start space-x-1.5 text-[11px] text-slate-400">
              <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>
                Key overrides are stored only in volatile React memory for testing. Never stored in LocalStorage or exported. Production applications use server proxy environment variables.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              updateSettings({
                demoMode: false,
                presentationMode: false,
                model: 'gemini-3.6-flash',
                temperatureAnswer: 0.4,
                temperatureEval: 0.1,
                apiKeyOverride: '',
              });
              setApiKeyInput('');
            }}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Reset Defaults
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs shadow-md hover:from-blue-500 hover:to-indigo-500 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
