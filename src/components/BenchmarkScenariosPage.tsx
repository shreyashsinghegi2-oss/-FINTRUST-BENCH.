import React, { useState } from 'react';
import {
  Activity,
  Play,
  Globe2,
  DollarSign,
  Search,
  ChevronDown,
  ChevronUp,
  Calculator,
} from 'lucide-react';
import { BENCHMARK_SCENARIOS } from '../data/benchmarkScenarios';
import { BenchmarkScenario, FinancialTopic, RiskLevel } from '../types';

interface BenchmarkScenariosPageProps {
  onRunScenario: (scenario: BenchmarkScenario) => void;
}

export const BenchmarkScenariosPage: React.FC<BenchmarkScenariosPageProps> = ({
  onRunScenario,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [expandedScenarioId, setExpandedScenarioId] = useState<string | null>(null);

  const filteredScenarios = BENCHMARK_SCENARIOS.filter((sc) => {
    const matchesSearch =
      sc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sc.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sc.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === 'All' || sc.topic === selectedTopic;
    const matchesRisk = selectedRisk === 'All' || sc.riskLevel === selectedRisk;
    return matchesSearch && matchesTopic && matchesRisk;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Page Title */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">
              Standard Benchmark Scenarios
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            12 standard evaluation test cases designed to benchmark financial AI reliability across topics, country contexts, and risk levels.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search scenarios or questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter by Topic */}
        <div>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Topics ({BENCHMARK_SCENARIOS.length})</option>
            {Array.from(new Set(BENCHMARK_SCENARIOS.map((s) => s.topic))).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Risk Level */}
        <div>
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
            <option value="Critical">Critical Risk</option>
          </select>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredScenarios.map((sc) => {
          const isExpanded = expandedScenarioId === sc.id;

          return (
            <div
              key={sc.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div className="space-y-3">
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/30">
                      {sc.topic}
                    </span>
                    <span className="text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {sc.difficulty}
                    </span>
                  </div>

                  <span
                    className={`font-semibold uppercase px-2 py-0.5 rounded ${
                      sc.riskLevel === 'Critical' || sc.riskLevel === 'High'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {sc.riskLevel} Risk
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {sc.title}
                </h3>

                {/* Country & Currency */}
                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{sc.country}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{sc.currency}</span>
                  </span>
                </div>

                {/* Question Quote */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 italic leading-relaxed">
                  "{sc.question}"
                </div>

                {/* Deterministic Reference Pill (If present) */}
                {sc.deterministicReference && (
                  <div className="bg-emerald-950/40 border border-emerald-900/60 p-2.5 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-semibold">{sc.deterministicReference.formulaName}</span>
                    </span>
                    <span className="font-mono font-bold">{sc.deterministicReference.formattedResult}</span>
                  </div>
                )}

                {/* Expected Checks Accordion */}
                {isExpanded && (
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 text-xs animate-fade-in pt-3">
                    <div>
                      <span className="font-bold text-slate-200 block mb-1">Expected Key Reasoning:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-400">
                        {sc.expectedKeyReasoning.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-bold text-cyan-300 block mb-1">Expected Evaluator Checks:</span>
                      <ul className="list-disc list-inside space-y-1 text-cyan-200/80">
                        {sc.expectedChecks.map((chk, i) => (
                          <li key={i}>{chk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setExpandedScenarioId(isExpanded ? null : sc.id)}
                  className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 font-semibold transition-colors"
                >
                  <span>{isExpanded ? 'Hide Expected Checks' : 'View Expected Checks'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => onRunScenario(sc)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Run Scenario</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
