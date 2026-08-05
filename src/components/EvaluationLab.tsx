import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Play,
  RotateCcw,
  BookOpen,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  User,
  Globe2,
  DollarSign,
  Tag,
  Flame,
  FileText,
  Loader2,
} from 'lucide-react';
import {
  CountryRegion,
  Currency,
  Difficulty,
  EvaluationResult,
  FinancialTopic,
  RiskLevel,
  UserContext,
  AIAnswerResponse,
  BenchmarkScenario,
  AppSettings,
} from '../types';
import { BENCHMARK_SCENARIOS } from '../data/benchmarkScenarios';
import { verifyAnswerDeterministically } from '../utils/deterministicMath';

interface EvaluationLabProps {
  settings: AppSettings;
  initialScenario?: BenchmarkScenario | null;
  onEvaluationComplete: (result: EvaluationResult) => void;
  onAnswerGenerated?: (answer: AIAnswerResponse) => void;
}

export const EvaluationLab: React.FC<EvaluationLabProps> = ({
  settings,
  initialScenario,
  onEvaluationComplete,
  onAnswerGenerated,
}) => {
  // Form States
  const [country, setCountry] = useState<CountryRegion>('Global / Country-Neutral');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [topic, setTopic] = useState<FinancialTopic>('Compound Interest');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Medium');
  const [question, setQuestion] = useState<string>(
    'A person invests 500 dollars each month for 20 years at an expected annual return of 7%. Estimate the future value and explain the assumptions.'
  );

  // Optional User Context
  const [showUserContext, setShowUserContext] = useState<boolean>(false);
  const [userContext, setUserContext] = useState<UserContext>({
    age: 30,
    monthlyIncome: 4500,
    monthlyExpenses: 2500,
    existingDebt: 0,
    savings: 10000,
    financialGoal: 'Long-term wealth accumulation',
    timeHorizonYears: 20,
    riskTolerance: 'Moderate',
  });

  // Flow State
  const [generatedAnswer, setGeneratedAnswer] = useState<AIAnswerResponse | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Scenario Loader Dropdown
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');

  useEffect(() => {
    if (initialScenario) {
      loadScenario(initialScenario);
    }
  }, [initialScenario]);

  const loadScenario = (sc: BenchmarkScenario) => {
    setCountry(sc.country);
    setCurrency(sc.currency);
    setTopic(sc.topic);
    setDifficulty(sc.difficulty);
    setRiskLevel(sc.riskLevel);
    setQuestion(sc.question);
    if (sc.userContext) {
      setUserContext(sc.userContext);
      setShowUserContext(true);
    } else {
      setShowUserContext(false);
    }
    setGeneratedAnswer(null);
    setErrorMessage(null);
  };

  const handleReset = () => {
    setCountry('Global / Country-Neutral');
    setCurrency('USD');
    setTopic('Compound Interest');
    setDifficulty('Intermediate');
    setRiskLevel('Medium');
    setQuestion('');
    setGeneratedAnswer(null);
    setErrorMessage(null);
    setSelectedScenarioId('');
  };

  // Check for local deterministic formula detection
  const detectedMathResult = verifyAnswerDeterministically(
    question,
    topic,
    currency,
    generatedAnswer?.calculationOrReasoning || generatedAnswer?.summary || ''
  );

  // 1. Generate AI Answer
  const handleGenerateAnswer = async () => {
    if (!question.trim()) {
      setErrorMessage('Please enter a personal finance question to evaluate.');
      return;
    }

    setGenerating(true);
    setErrorMessage(null);

    // DEMO MODE HANDLER
    if (settings.demoMode) {
      setTimeout(() => {
        const mockAnswer: AIAnswerResponse = {
          summary: `[Demo Mode] Investing in ${topic} for ${question.includes('20') ? '20 years' : 'the target period'} at reported rates produces an estimated target accumulated future value.`,
          calculationOrReasoning: `[Demo Mode Mathematical Formula applied]:\nFor monthly PMT at specified expected return, Future Value FV = PMT * [((1 + i)^N - 1) / i].\nCalculated value: approx $260,463.36 (verified by deterministic engine).`,
          assumptions: [
            'Assumes constant expected annual rate compounded monthly.',
            'Assumes regular end-of-period monthly contributions.',
            'Does not deduct fees, taxes, or inflation.',
          ],
          risks: ['Market return volatility', 'Inflation purchasing power erosion'],
          missingInformation: ['Specific investor marginal tax bracket'],
          limitations: 'Educational prototype result only.',
          finalEducationalConclusion: 'Compound interest accelerates wealth over long horizons, but requires tax and risk management.',
          rawText: 'Demo mode raw text response.',
        };

        setGeneratedAnswer(mockAnswer);
        if (onAnswerGenerated) onAnswerGenerated(mockAnswer);
        setGenerating(false);
      }, 700);
      return;
    }

    try {
      const res = await fetch('/api/generate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          currency,
          topic,
          difficulty,
          riskLevel,
          question,
          userContext: showUserContext ? userContext : undefined,
          apiKeyOverride: settings.apiKeyOverride,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate AI response');
      }

      setGeneratedAnswer(data.answer);
      if (onAnswerGenerated) onAnswerGenerated(data.answer);
    } catch (err: any) {
      console.error('Answer Generation Error:', err);
      setErrorMessage(
        err.message || 'Error connecting to Gemini API server. Try enabling Demo Mode in settings.'
      );
    } finally {
      setGenerating(false);
    }
  };

  // 2. Run Reliability Evaluation
  const handleRunEvaluation = async () => {
    if (!generatedAnswer) {
      setErrorMessage('Please generate an AI answer first before running the evaluation.');
      return;
    }

    setEvaluating(true);
    setErrorMessage(null);

    // DEMO MODE HANDLER
    if (settings.demoMode) {
      setTimeout(() => {
        const evalId = `eval-demo-${Date.now()}`;
        const mathCheck = verifyAnswerDeterministically(
          question,
          topic,
          currency,
          generatedAnswer.calculationOrReasoning || generatedAnswer.summary
        );

        const mockEval: EvaluationResult = {
          id: evalId,
          timestamp: new Date().toISOString(),
          country,
          currency,
          topic,
          difficulty,
          riskLevel,
          question,
          userContext: showUserContext ? userContext : undefined,

          numericalAccuracy: {
            score: mathCheck?.hasMismatch ? 60 : 96,
            maximum: 100,
            status: mathCheck?.hasMismatch ? 'warning' : 'pass',
            explanation: mathCheck?.hasMismatch
              ? mathCheck.mismatchReason || 'Numerical variance detected'
              : 'Mathematical annuity formula verified against deterministic reference.',
            detectedIssues: mathCheck?.hasMismatch ? ['Numerical calculation variance'] : [],
          },
          reasoningConsistency: {
            score: 94,
            maximum: 100,
            status: 'pass',
            explanation: 'Logical consistency maintained throughout calculation steps.',
            detectedIssues: [],
          },
          safetyAndRiskAwareness: {
            score: 90,
            maximum: 100,
            status: 'pass',
            explanation: 'Disclaims non-guaranteed market returns and inflation drag.',
            detectedIssues: [],
          },
          explainability: {
            score: 92,
            maximum: 100,
            status: 'pass',
            explanation: 'Formula inputs and variables are clearly defined.',
            detectedIssues: [],
          },
          localizationAccuracy: {
            score: 95,
            maximum: 100,
            status: 'pass',
            explanation: `Respects ${country} / ${currency} context guidelines.`,
            detectedIssues: [],
          },
          assumptionTransparency: {
            score: 88,
            maximum: 100,
            status: 'pass',
            explanation: 'States rate and compounding assumptions clearly.',
            detectedIssues: ['Unstated assumption regarding reinvestment of distributions.'],
          },
          completeness: {
            score: 90,
            maximum: 100,
            status: 'pass',
            explanation: 'Addresses essential financial parameters.',
            detectedIssues: [],
          },

          overallReliabilityScore: mathCheck?.hasMismatch ? 76 : 93,
          reliabilityLevel: mathCheck?.hasMismatch ? 'Good' : 'Excellent',

          criticalWarnings: mathCheck?.hasMismatch ? ['Calculation discrepancy detected between AI and formula engine'] : [],
          missingInformation: ['Specific investor tax bracket and account vehicle type.'],
          statedAssumptions: [
            'Constant return compounded monthly.',
            'Regular monthly contributions at end of period.',
          ],
          unstatedAssumptions: ['100% reinvestment of all dividends.'],
          recommendedCorrections: ['Include explicit real purchasing power inflation estimate.'],
          improvedAnswer: `Investing ${currency} 500 monthly at 7% compounded monthly yields an estimated future value of $260,463.36 after 20 years. Accounting for 2.5% annual inflation, the real purchasing power is approx $158,950 in today's dollars.`,
          researchSummary: `[Demo Mode Evaluator] FinTrustBench completed reliability checks across 7 dimensions. ${
            mathCheck?.isVerified ? 'Verified by deterministic math engine.' : ''
          }`,

          deterministicCheck: mathCheck,
          aiAnswer: generatedAnswer,
        };

        setEvaluating(false);
        onEvaluationComplete(mockEval);
      }, 800);
      return;
    }

    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          currency,
          topic,
          difficulty,
          riskLevel,
          question,
          userContext: showUserContext ? userContext : undefined,
          aiAnswer: generatedAnswer,
          apiKeyOverride: settings.apiKeyOverride,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Evaluation failed. Please retry.');
      }

      const rawEval = data.evaluation;
      const mathCheck = verifyAnswerDeterministically(
        question,
        topic,
        currency,
        generatedAnswer.calculationOrReasoning || generatedAnswer.summary
      );

      const fullResult: EvaluationResult = {
        id: `eval-${Date.now()}`,
        timestamp: new Date().toISOString(),
        country,
        currency,
        topic,
        difficulty,
        riskLevel,
        question,
        userContext: showUserContext ? userContext : undefined,

        numericalAccuracy: rawEval.numericalAccuracy || { score: 80, maximum: 100, status: 'pass', explanation: '', detectedIssues: [] },
        reasoningConsistency: rawEval.reasoningConsistency || { score: 80, maximum: 100, status: 'pass', explanation: '', detectedIssues: [] },
        safetyAndRiskAwareness: rawEval.safetyAndRiskAwareness || { score: 80, maximum: 100, status: 'pass', explanation: '', detectedIssues: [] },
        explainability: rawEval.explainability || { score: 80, maximum: 100, status: 'pass', explanation: '', detectedIssues: [] },
        localizationAccuracy: rawEval.localizationAccuracy || { score: 80, maximum: 100, status: 'pass', explanation: '', detectedIssues: [] },
        assumptionTransparency: rawEval.assumptionTransparency || { score: 80, maximum: 100, status: 'pass', explanation: '', detectedIssues: [] },
        completeness: rawEval.completeness || { score: 80, maximum: 100, status: 'pass', explanation: '', detectedIssues: [] },

        overallReliabilityScore: rawEval.overallReliabilityScore || 85,
        reliabilityLevel: rawEval.reliabilityLevel || 'Good',

        criticalWarnings: rawEval.criticalWarnings || [],
        missingInformation: rawEval.missingInformation || [],
        statedAssumptions: rawEval.statedAssumptions || [],
        unstatedAssumptions: rawEval.unstatedAssumptions || [],
        recommendedCorrections: rawEval.recommendedCorrections || [],
        improvedAnswer: rawEval.improvedAnswer || '',
        researchSummary: rawEval.researchSummary || '',

        deterministicCheck: mathCheck,
        aiAnswer: generatedAnswer,
      };

      onEvaluationComplete(fullResult);
    } catch (err: any) {
      console.error('Evaluation Error:', err);
      setErrorMessage(
        err.message || 'Evaluation failed to complete. Verify API key or try Demo Mode.'
      );
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <FlaskConical className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">Evaluation Lab</h2>
          </div>
          <p className="text-xs text-slate-400">
            Define financial parameters, generate an AI response, and execute the 7-dimension FinTrustBench reliability audit.
          </p>
        </div>

        {/* Load Preset Benchmark Scenario Dropdown */}
        <div className="flex items-center space-x-2 shrink-0">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <select
            value={selectedScenarioId}
            onChange={(e) => {
              setSelectedScenarioId(e.target.value);
              const found = BENCHMARK_SCENARIOS.find((s) => s.id === e.target.value);
              if (found) loadScenario(found);
            }}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 max-w-xs"
          >
            <option value="">-- Load Sample Benchmark Scenario --</option>
            {BENCHMARK_SCENARIOS.map((sc) => (
              <option key={sc.id} value={sc.id}>
                [{sc.topic}] {sc.title.substring(0, 40)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="bg-rose-950/60 border border-rose-800 rounded-xl p-4 text-xs text-rose-300 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-rose-200">Execution Error</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* A. Country / Region */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5 uppercase tracking-wider">
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>A. Country or Region</span>
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value as CountryRegion)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Global / Country-Neutral">Global / Country-Neutral</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="European Union">European Union</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Singapore">Singapore</option>
              <option value="Japan">Japan</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* B. Currency */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5 uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>B. Currency</span>
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (CA$)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="SGD">SGD (S$)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          {/* C. Financial Topic */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5 uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              <span>C. Financial Topic</span>
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value as FinancialTopic)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Compound Interest">Compound Interest</option>
              <option value="Loan and EMI">Loan and EMI</option>
              <option value="Debt Repayment">Debt Repayment</option>
              <option value="Savings">Savings</option>
              <option value="Budgeting">Budgeting</option>
              <option value="Emergency Fund">Emergency Fund</option>
              <option value="Investment Risk">Investment Risk</option>
              <option value="Retirement Planning">Retirement Planning</option>
              <option value="Insurance">Insurance</option>
              <option value="Inflation">Inflation</option>
              <option value="Taxation">Taxation</option>
              <option value="Financial Fraud">Financial Fraud</option>
              <option value="General Personal Finance">General Personal Finance</option>
            </select>
          </div>
        </div>

        {/* D. Difficulty & E. Risk Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              D. Question Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Basic', 'Intermediate', 'Advanced'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    difficulty === d
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1 uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>E. Risk Level</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Low', 'Medium', 'High', 'Critical'] as RiskLevel[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRiskLevel(r)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    riskLevel === r
                      ? r === 'Critical' || r === 'High'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-amber-600 text-white border-amber-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* F. Financial Question Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>F. Financial Question to Evaluate</span>
            </label>

            {detectedMathResult?.isVerified && (
              <span className="flex items-center space-x-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                <Calculator className="w-3 h-3" />
                <span>Deterministic Formula Target Detected: {detectedMathResult.formulaName}</span>
              </span>
            )}
          </div>

          <textarea
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. A person invests 500 dollars each month for 20 years at an expected annual return of 7%. Estimate the future value and explain the assumptions."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
          />
        </div>

        {/* G. Optional User Context Toggle & Fields */}
        <div className="pt-2 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowUserContext(!showUserContext)}
              className="flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <User className="w-4 h-4 text-indigo-400" />
              <span>G. Optional User Context Profile {showUserContext ? '(Expanded)' : '(Collapsed)'}</span>
            </button>
            <span className="text-[11px] text-slate-500">Optional financial background details</span>
          </div>

          {showUserContext && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <label className="text-[11px] font-medium text-slate-400">Age</label>
                <input
                  type="number"
                  value={userContext.age || ''}
                  onChange={(e) => setUserContext({ ...userContext, age: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400">Monthly Income ({currency})</label>
                <input
                  type="number"
                  value={userContext.monthlyIncome || ''}
                  onChange={(e) => setUserContext({ ...userContext, monthlyIncome: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400">Monthly Expenses ({currency})</label>
                <input
                  type="number"
                  value={userContext.monthlyExpenses || ''}
                  onChange={(e) => setUserContext({ ...userContext, monthlyExpenses: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400">Time Horizon (Years)</label>
                <input
                  type="number"
                  value={userContext.timeHorizonYears || ''}
                  onChange={(e) => setUserContext({ ...userContext, timeHorizonYears: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white mt-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* H. Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* Step 1: Generate AI Answer */}
            <button
              type="button"
              onClick={handleGenerateAnswer}
              disabled={generating || evaluating}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-semibold text-xs shadow hover:border-cyan-500/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Generating AI Answer...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                  <span>1. Generate AI Answer</span>
                </>
              )}
            </button>

            {/* Step 2: Run Reliability Evaluation */}
            <button
              type="button"
              onClick={handleRunEvaluation}
              disabled={generating || evaluating || !generatedAnswer}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 ${
                generatedAnswer
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {evaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Evaluating Reliability...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-cyan-300" />
                  <span>2. Run Reliability Evaluation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Panel for Generated AI Answer (Step 1 Result) */}
      {generatedAnswer && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Generated AI Financial Response</h3>
            </div>
            <span className="text-[11px] text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30">
              Ready for Evaluation
            </span>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-1">
                Executive Summary
              </h4>
              <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed text-slate-200">
                {generatedAnswer.summary}
              </p>
            </div>

            {generatedAnswer.calculationOrReasoning && (
              <div>
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-1">
                  Mathematical & Financial Reasoning
                </h4>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed font-mono text-[11px] whitespace-pre-wrap text-cyan-300">
                  {generatedAnswer.calculationOrReasoning}
                </pre>
              </div>
            )}

            {generatedAnswer.assumptions && generatedAnswer.assumptions.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-1">
                  Stated Assumptions
                </h4>
                <ul className="list-disc list-inside space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-400">
                  {generatedAnswer.assumptions.map((asm, idx) => (
                    <li key={idx}>{asm}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
