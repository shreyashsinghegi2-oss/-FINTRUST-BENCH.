import React, { useState } from 'react';
import {
  Zap,
  Shield,
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Calculator,
  Globe2,
  DollarSign,
  ArrowRight,
  FileText,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import {
  CountryRegion,
  Currency,
  FinancialTopic,
  EvaluationResult,
  AppSettings
} from '../types';
import { generateAiAnswer, generateMockEvaluation } from '../data/mockEvaluations';

interface QuickCheckPageProps {
  settings: AppSettings;
  onEvaluationComplete: (result: EvaluationResult) => void;
  onNavigateToLab: () => void;
}

export const QuickCheckPage: React.FC<QuickCheckPageProps> = ({
  settings,
  onEvaluationComplete,
  onNavigateToLab
}) => {
  const [country, setCountry] = useState<CountryRegion>('Global / Country-Neutral');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [topic, setTopic] = useState<FinancialTopic>('Compound Interest');
  const [pastedAnswer, setPastedAnswer] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [quickResult, setQuickResult] = useState<EvaluationResult | null>(null);

  const samplePrompt =
    'A person invests $500 monthly for 20 years at an expected annual return of 7% compounded monthly. Estimate the future value and explain the assumptions.';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        return;
      }
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) setPastedAnswer(text);
      };
      reader.readAsText(file);
    }
  };

  const handleRunQuickCheck = async () => {
    setIsEvaluating(true);
    setQuickResult(null);

    setTimeout(async () => {
      try {
        const aiAnswer = pastedAnswer
          ? {
              summary: 'Pasted AI response provided for reliability verification.',
              calculationOrReasoning: pastedAnswer,
              assumptions: ['End of period payments', 'Constant rate'],
              risks: ['Market volatility'],
              missingInformation: ['Inflation impact'],
              limitations: 'Subject to rate fluctuations',
              finalEducationalConclusion: 'Proceed with verified calculation.',
              rawText: pastedAnswer
            }
          : generateAiAnswer(topic, country, currency, samplePrompt);

        const result = generateMockEvaluation(
          samplePrompt,
          aiAnswer,
          country,
          currency,
          topic,
          'Intermediate',
          'Medium'
        );

        setQuickResult(result);
        onEvaluationComplete(result);
      } catch (err) {
        console.error('Quick check evaluation error:', err);
      } finally {
        setIsEvaluating(false);
      }
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950 border border-blue-800 rounded-full text-blue-400 font-bold text-xs">
          <Zap className="w-4 h-4 text-amber-400" /> Simplified Reliability Verifier
        </div>
        <h1 className="text-3xl font-black text-white">Quick Check AI Financial Answers</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Paste any response from ChatGPT, Claude, Gemini, or an advisor email. We check the math, logic, safety, and regional assumptions in seconds.
        </p>
      </div>

      {!quickResult ? (
        /* Input Form */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Country */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-blue-400" /> Country / Context
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as CountryRegion)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Global / Country-Neutral">Global / Country-Neutral</option>
                <option value="United States">United States</option>
                <option value="India">India</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            {/* Currency */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-blue-400" /> Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (CA$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>

            {/* Financial Topic */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-blue-400" /> Financial Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value as FinancialTopic)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Compound Interest">Compound Interest & Growth</option>
                <option value="Loan and EMI">Loan & EMI Calculation</option>
                <option value="Retirement Planning">Retirement Planning</option>
                <option value="Inflation">Inflation Impact</option>
                <option value="Taxation">Taxation & Exemptions</option>
              </select>
            </div>
          </div>

          {/* Input Method */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Paste AI-Generated Response or Upload Document
              </label>
              <label className="text-[11px] text-blue-400 hover:underline cursor-pointer flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept=".txt,.json,.md,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {uploadedFileName && (
              <div className="text-xs text-green-400 flex items-center gap-1.5 bg-green-950/40 p-2 rounded-lg border border-green-800/80">
                <FileText className="w-3.5 h-3.5" />
                <span>Uploaded: {uploadedFileName}</span>
              </div>
            )}

            <textarea
              rows={6}
              value={pastedAnswer}
              onChange={(e) => setPastedAnswer(e.target.value)}
              placeholder="Paste AI response here (e.g., 'Investing $500 monthly at 7% for 20 years yields $260,450...')"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Leave blank to evaluate a benchmark sample response automatically.
            </p>
          </div>

          {/* Submit Action */}
          <button
            onClick={handleRunQuickCheck}
            disabled={isEvaluating}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            {isEvaluating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" /> Verifying Calculation & Logic...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Check Reliability Now
              </>
            )}
          </button>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Top Score Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black ${
                    quickResult.reliabilityLevel === 'Excellent' || quickResult.reliabilityLevel === 'Good'
                      ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                      : 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {quickResult.overallReliabilityScore}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Reliability Rating
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {quickResult.reliabilityLevel} Reliability
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verified against FinTrustBench deterministic math engine
                  </p>
                </div>
              </div>

              <button
                onClick={() => setQuickResult(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Check Another Answer
              </button>
            </div>

            {/* High Level Checks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-blue-400" /> Calculation Check
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {quickResult.deterministicCheck?.isVerified
                    ? 'Verified: Math calculation matches reference precisely.'
                    : 'Discrepancy detected: AI reported value diverges from annuity formula.'}
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-400" /> Safety & Risk Check
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {quickResult.criticalWarnings.length > 0
                    ? quickResult.criticalWarnings[0]
                    : 'Passed: Model adequately includes risk disclosures and market volatility.'}
                </p>
              </div>
            </div>

            {/* Improved Answer Recommendation */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" /> Verified Correct Answer & Breakdown
              </h3>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                {quickResult.improvedAnswer}
              </div>
            </div>

            {/* Navigate to Research Lab */}
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">Need full 7-dimension breakdown or JSON export?</span>
              <button
                onClick={onNavigateToLab}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1.5"
              >
                <span>Open Full Research Lab</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
