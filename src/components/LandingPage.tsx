import React from 'react';
import {
  Shield,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe2,
  LineChart,
  Scale,
  Brain,
  FileCheck,
} from 'lucide-react';
import { BENCHMARK_SCENARIOS } from '../data/benchmarkScenarios';
import { BenchmarkScenario, AppSettings } from '../types';
import { CreatorCard } from './CreatorCard';

interface LandingPageProps {
  onStartEvaluation: () => void;
  onViewMethodology: () => void;
  onSelectScenario: (scenario: BenchmarkScenario) => void;
  settings?: AppSettings;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartEvaluation,
  onViewMethodology,
  onSelectScenario,
  settings,
}) => {
  const isPresentationMode = Boolean(settings?.presentationMode);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800 rounded-3xl">
        {/* Subtle Background Neural Mesh Graphics */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
            <circle cx="200" cy="150" r="3" fill="#38bdf8" />
            <circle cx="400" cy="100" r="4" fill="#6366f1" />
            <circle cx="600" cy="200" r="3" fill="#38bdf8" />
            <circle cx="300" cy="350" r="5" fill="#3b82f6" />
            <circle cx="550" cy="400" r="4" fill="#818cf8" />
            <line x1="200" y1="150" x2="400" y2="100" stroke="#38bdf8" strokeWidth="1" />
            <line x1="400" y1="100" x2="600" y2="200" stroke="#6366f1" strokeWidth="1" />
            <line x1="200" y1="150" x2="300" y2="350" stroke="#3b82f6" strokeWidth="1" />
            <line x1="400" y1="100" x2="300" y2="350" stroke="#38bdf8" strokeWidth="1" />
            <line x1="600" y1="200" x2="550" y2="400" stroke="#818cf8" strokeWidth="1" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          {/* Research Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider shadow-inner">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>FinTrustBench Open-Source Research Benchmark</span>
          </div>

          {/* Logo Concept & Main Headline */}
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-indigo-900/30 border border-cyan-500/30 shadow-xl mb-2">
              <div className="w-16 h-16 rounded-xl bg-slate-950 flex items-center justify-center border border-cyan-500/40">
                <svg
                  className="w-10 h-10 text-cyan-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="text-blue-500 opacity-60" />
                  <path d="M8 12l3 3 5-5" className="text-cyan-400" strokeWidth="2.5" />
                  <circle cx="12" cy="7" r="1.5" className="fill-cyan-400" />
                  <circle cx="7" cy="14" r="1" className="fill-indigo-400" />
                  <circle cx="17" cy="14" r="1" className="fill-blue-400" />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none font-sans">
              FinTrust<span className="text-cyan-400">Bench</span>
            </h1>

            <p className="text-lg sm:text-2xl font-bold text-slate-200 max-w-3xl mx-auto leading-snug">
              A Global Benchmark for Trustworthy AI in Personal Financial Decision-Making
            </p>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
              Evaluate the accuracy, safety, explainability, and consistency of AI-generated personal-finance responses across 7 academic dimensions and deterministic mathematical standards.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onStartEvaluation}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5 text-cyan-300" />
              <span>Start Evaluation</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onViewMethodology}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800/80 text-slate-200 hover:text-white border border-slate-700 hover:bg-slate-700 font-semibold text-base transition-all flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>View Methodology</span>
            </button>
          </div>

          {/* Mandatory Prototype Disclaimer */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-center justify-center space-x-2 text-center">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Disclaimer:</strong> This benchmark evaluates AI-generated financial information. It does not provide certified financial advice.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Section on Homepage */}
      <section className="space-y-4">
        <CreatorCard variant="compact" presentationMode={isPresentationMode} />
      </section>

      {/* 7 Core Evaluation Dimensions */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            The 7 Dimensions of Financial AI Reliability
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            FinTrustBench stress-tests language model answers against scientific and regulatory criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <LineChart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. Numerical Accuracy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verified by a local deterministic mathematical engine against compound interest, loan EMI, inflation, and annuity formulas.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Reasoning Consistency</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects logical contradictions between step-by-step calculations and the model's final conclusion.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Safety & Risk Awareness</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identifies guaranteed-return scams, reckless leverage advice, or lack of emergency fund disclaimers.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">4. Explainability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluates if financial variables, unit definitions, and rate conventions are clearly stated for non-experts.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">5. Localization Accuracy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verifies currency formatting, country-specific tax vehicles (e.g. 401k vs NISA vs TFSA), and regional rules.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">6. Assumption Transparency</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Distinguishes between explicitly stated assumptions and unstated dangerous assumptions (e.g., zero tax/fees).
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl sm:col-span-2 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">7. Completeness & Improved Synthesis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Checks whether all user constraints were addressed and synthesizes an academic-grade improved response.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Launch Benchmark Scenarios */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Built-in Benchmark Scenarios
            </h2>
            <p className="text-sm text-slate-400">
              Pre-built academic test cases to quickly test evaluation pipelines.
            </p>
          </div>
          <button
            onClick={onStartEvaluation}
            className="text-xs text-cyan-400 font-semibold hover:text-cyan-300 flex items-center space-x-1"
          >
            <span>Custom Question</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BENCHMARK_SCENARIOS.slice(0, 3).map((scenario) => (
            <div
              key={scenario.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    {scenario.topic}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                      scenario.riskLevel === 'Critical' || scenario.riskLevel === 'High'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {scenario.riskLevel} Risk
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {scenario.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  "{scenario.question}"
                </p>
              </div>

              <button
                onClick={() => onSelectScenario(scenario)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
              >
                <span>Run This Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Project Maintainer Note */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 text-center space-y-3">
        <h3 className="text-sm font-bold text-slate-200">
          FinTrustBench Open-Source Benchmark
        </h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Created and maintained by <strong>Shreyash Singh</strong> (Creator and Project Maintainer, FinTrustBench Open-Source Project).
        </p>
      </section>
    </div>
  );
};

