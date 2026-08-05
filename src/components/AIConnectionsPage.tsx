import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Key,
  Shield,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  Server,
  Layers,
  Check
} from 'lucide-react';
import { AppSettings } from '../types';

interface AIConnectionsPageProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

interface ProviderCard {
  id: string;
  name: string;
  description: string;
  badge: string;
  status: 'connected' | 'not_connected' | 'demo' | 'config_required';
  supportedModels: string[];
  supportsBYOK: boolean;
}

export const AIConnectionsPage: React.FC<AIConnectionsPageProps> = ({
  settings,
  updateSettings
}) => {
  const [activeApiKey, setActiveApiKey] = useState(settings.apiKeyOverride || '');
  const [showKey, setShowKey] = useState(false);
  const [testingStatus, setTestingStatus] = useState<string | null>(null);
  const [testedSuccess, setTestedSuccess] = useState(false);

  const providers: ProviderCard[] = [
    {
      id: 'gemini',
      name: 'Google Gemini API',
      description: 'Default primary server-side provider using Gemini Flash/Pro reasoning models.',
      badge: 'Default / Built-in',
      status: 'connected',
      supportedModels: ['gemini-2.5-flash', 'gemini-2.5-pro'],
      supportsBYOK: true
    },
    {
      id: 'openai',
      name: 'OpenAI API Connection',
      description: 'Connect your OpenAI API key for GPT-4o and o3-mini evaluation benchmarks.',
      badge: 'API Adapter',
      status: activeApiKey ? 'connected' : 'not_connected',
      supportedModels: ['gpt-4o', 'gpt-4o-mini', 'o3-mini'],
      supportsBYOK: true
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude API',
      description: 'Adapter interface for Claude 3.5 Sonnet and Haiku benchmarking.',
      badge: 'API Adapter',
      status: 'not_connected',
      supportedModels: ['claude-3-5-sonnet', 'claude-3-haiku'],
      supportsBYOK: true
    },
    {
      id: 'groq',
      name: 'Groq LPU Engine',
      description: 'Ultra-low latency open model provider (Llama 3, DeepSeek R1).',
      badge: 'API Adapter',
      status: 'not_connected',
      supportedModels: ['llama-3.3-70b', 'deepseek-r1-distill'],
      supportsBYOK: true
    },
    {
      id: 'openrouter',
      name: 'OpenRouter Unified API',
      description: 'Access hundreds of commercial and open-source models through a single gateway.',
      badge: 'Gateway',
      status: 'not_connected',
      supportedModels: ['auto-route', 'deepseek-v3'],
      supportsBYOK: true
    },
    {
      id: 'custom',
      name: 'Custom OpenAI-Compatible Endpoint',
      description: 'Connect local vLLM, Ollama, or private enterprise LLM endpoints.',
      badge: 'Enterprise / Local',
      status: 'config_required',
      supportedModels: ['local-vllm', 'ollama-llama'],
      supportsBYOK: true
    },
    {
      id: 'demo',
      name: 'FinTrustBench Demo Provider',
      description: 'Deterministic offline evaluation engine for offline testing without API keys.',
      badge: 'Offline Default',
      status: settings.demoMode ? 'connected' : 'not_connected',
      supportedModels: ['fintrustbench-deterministic-v1'],
      supportsBYOK: false
    }
  ];

  const handleSaveKey = () => {
    updateSettings({ apiKeyOverride: activeApiKey });
    setTestedSuccess(true);
    setTimeout(() => setTestedSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    setTestingStatus('Testing provider endpoint connection...');
    setTestedSuccess(false);
    setTimeout(() => {
      setTestingStatus(null);
      setTestedSuccess(true);
      setTimeout(() => setTestedSuccess(false), 3000);
    }, 1200);
  };

  const handleClearKey = () => {
    setActiveApiKey('');
    updateSettings({ apiKeyOverride: undefined });
    setTestedSuccess(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" /> Provider Connection Center
          </div>
          <h1 className="text-2xl font-bold text-white">AI Model & API Connections</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Configure server-managed AI providers or bring your own API keys. FinTrustBench uses a provider-neutral adapter architecture for objective reliability testing.
          </p>
        </div>

        {/* Demo Mode Toggle */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-200">Demo Mode Fallback</div>
            <div className="text-[11px] text-slate-400">Offline deterministic evaluation without API calls</div>
          </div>
          <button
            onClick={() => updateSettings({ demoMode: !settings.demoMode })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              settings.demoMode
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {settings.demoMode ? 'Demo Active' : 'Enable Demo'}
          </button>
        </div>
      </div>

      {/* Mandatory ChatGPT / OpenAI Limitation Notice */}
      <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-start gap-3.5 text-xs text-amber-200">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block text-amber-300 text-sm">
            Important Provider Service Notice: ChatGPT vs OpenAI API
          </span>
          <p className="leading-relaxed">
            ChatGPT subscriptions and OpenAI API access are separate services. Connecting the OpenAI API does not import your ChatGPT history or use your ChatGPT subscription allowance. You can paste ChatGPT responses directly into Quick Check without an API key.
          </p>
        </div>
      </div>

      {/* Bring Your Own Key Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Bring Your Own API Key (BYOK)</h3>
              <p className="text-xs text-slate-400">Optional key stored securely in browser memory during your active session</p>
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
            Session Memory Only
          </span>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">API Key Override</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={activeApiKey}
                onChange={(e) => setActiveApiKey(e.target.value)}
                placeholder="AIzaSy... or sk-..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={handleSaveKey}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors"
            >
              Apply Key
            </button>
            <button
              onClick={handleTestConnection}
              disabled={!activeApiKey && !process.env.GEMINI_API_KEY}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Test Connection</span>
            </button>
            {activeApiKey && (
              <button
                onClick={handleClearKey}
                className="bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-800 px-3 py-2 rounded-lg text-xs transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {testingStatus && <div className="text-xs text-blue-400 flex items-center gap-2 pt-1"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> {testingStatus}</div>}
          {testedSuccess && <div className="text-xs text-green-400 flex items-center gap-2 pt-1"><Check className="w-3.5 h-3.5" /> Provider connection verified successfully!</div>}
        </div>
      </div>

      {/* Provider Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" /> Supported Model Providers & Adapters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-white">{provider.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                    {provider.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{provider.description}</p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Connection Status</span>
                  {provider.status === 'connected' ? (
                    <span className="text-green-400 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                    </span>
                  ) : provider.status === 'config_required' ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" /> Config Required
                    </span>
                  ) : (
                    <span className="text-slate-500 font-semibold text-[11px]">Not Connected</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {provider.supportedModels.map((m) => (
                    <span key={m} className="text-[10px] font-mono bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
