import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calculator,
  FileCheck,
  Copy,
  Download,
  Printer,
  Sparkles,
  Info,
  RotateCcw,
  Check,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';
import { EvaluationResult, MetricResult } from '../types';
import { exportToJSON } from '../utils/storage';
import { PersonalizedReportWizardModal } from './PersonalizedReportWizardModal';
import { ReportVerificationModal } from './ReportVerificationModal';

interface ResultsDashboardProps {
  evaluation: EvaluationResult;
  onNewEvaluation: () => void;
  onOpenAuthModal?: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  evaluation,
  onNewEvaluation,
  onOpenAuthModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return { text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/40', badge: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
    if (score >= 75) return { text: 'text-cyan-400', bg: 'bg-cyan-500', border: 'border-cyan-500/40', badge: 'bg-cyan-950 text-cyan-300 border-cyan-800' };
    if (score >= 60) return { text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/40', badge: 'bg-amber-950 text-amber-300 border-amber-800' };
    if (score >= 40) return { text: 'text-orange-400', bg: 'bg-orange-500', border: 'border-orange-500/40', badge: 'bg-orange-950 text-orange-300 border-orange-800' };
    return { text: 'text-rose-400', bg: 'bg-rose-500', border: 'border-rose-500/40', badge: 'bg-rose-950 text-rose-300 border-rose-800' };
  };

  const getStatusBadge = (status: MetricResult['status']) => {
    switch (status) {
      case 'pass':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Pass</span>
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Warning</span>
          </span>
        );
      case 'fail':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700">
            <XCircle className="w-3 h-3 text-rose-400" />
            <span>Fail</span>
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            N/A
          </span>
        );
    }
  };

  const overallStyle = getScoreColor(evaluation.overallReliabilityScore);

  // Radar chart dataset
  const radarData = [
    { subject: 'Numerical Acc.', value: evaluation.numericalAccuracy.score, fullMark: 100 },
    { subject: 'Consistency', value: evaluation.reasoningConsistency.score, fullMark: 100 },
    { subject: 'Safety & Risk', value: evaluation.safetyAndRiskAwareness.score, fullMark: 100 },
    { subject: 'Explainability', value: evaluation.explainability.score, fullMark: 100 },
    { subject: 'Localization', value: evaluation.localizationAccuracy.score, fullMark: 100 },
    { subject: 'Assumptions', value: evaluation.assumptionTransparency.score, fullMark: 100 },
    { subject: 'Completeness', value: evaluation.completeness.score, fullMark: 100 },
  ];

  const metricsList = [
    { label: 'Numerical Accuracy', metric: evaluation.numericalAccuracy },
    { label: 'Reasoning Consistency', metric: evaluation.reasoningConsistency },
    { label: 'Safety & Risk Awareness', metric: evaluation.safetyAndRiskAwareness },
    { label: 'Explainability', metric: evaluation.explainability },
    { label: 'Localization Accuracy', metric: evaluation.localizationAccuracy },
    { label: 'Assumption Transparency', metric: evaluation.assumptionTransparency },
    { label: 'Completeness', metric: evaluation.completeness },
  ];

  const handleCopyReport = () => {
    const reportText = `=== FINTRUSTBENCH RELIABILITY EVALUATION REPORT ===
Timestamp: ${evaluation.timestamp}
Question: ${evaluation.question}
Topic: ${evaluation.topic} | Country: ${evaluation.country} | Currency: ${evaluation.currency}

OVERALL RELIABILITY SCORE: ${evaluation.overallReliabilityScore}/100 (${evaluation.reliabilityLevel})

DIMENSION SCORES:
- Numerical Accuracy: ${evaluation.numericalAccuracy.score}/100 [${evaluation.numericalAccuracy.status}]
- Reasoning Consistency: ${evaluation.reasoningConsistency.score}/100 [${evaluation.reasoningConsistency.status}]
- Safety & Risk Awareness: ${evaluation.safetyAndRiskAwareness.score}/100 [${evaluation.safetyAndRiskAwareness.status}]
- Explainability: ${evaluation.explainability.score}/100 [${evaluation.explainability.status}]
- Localization Accuracy: ${evaluation.localizationAccuracy.score}/100 [${evaluation.localizationAccuracy.status}]
- Assumption Transparency: ${evaluation.assumptionTransparency.score}/100 [${evaluation.assumptionTransparency.status}]
- Completeness: ${evaluation.completeness.score}/100 [${evaluation.completeness.status}]

DETERMINISTIC MATHEMATICAL CHECK:
${evaluation.deterministicCheck ? `${evaluation.deterministicCheck.formulaName}: Calculated Reference = ${evaluation.deterministicCheck.formattedReference}` : 'No deterministic formula match'}

CRITICAL WARNINGS:
${evaluation.criticalWarnings.length > 0 ? evaluation.criticalWarnings.join('\n') : 'None'}

IMPROVED SYNTHESIS:
${evaluation.improvedAnswer}

RESEARCH SUMMARY:
${evaluation.researchSummary}
`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 print:text-black print:bg-white">
      {/* Action Controls & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">Results Dashboard</h2>
          </div>
          <p className="text-xs text-slate-400">
            Detailed 7-dimension reliability score card and structured evaluation report.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Generate PDF Report</span>
          </button>

          <button
            onClick={() => setIsVerifyOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify Report</span>
          </button>

          <button
            onClick={onNewEvaluation}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Evaluation</span>
          </button>

          <button
            onClick={handleCopyReport}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={() => exportToJSON(evaluation, `FinTrustBench_Report_${evaluation.id}`)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Grid: Circular Gauge & Metric Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Score Card & Gauge */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Overall Reliability
            </span>
            <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded border ${overallStyle.badge}`}>
              {evaluation.reliabilityLevel}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center my-4 space-y-3">
            {/* SVG Gauge */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="text-slate-800"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={overallStyle.text}
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * evaluation.overallReliabilityScore) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>

              <div className="absolute text-center">
                <span className={`text-4xl font-black ${overallStyle.text}`}>
                  {evaluation.overallReliabilityScore}
                </span>
                <span className="text-xs text-slate-400 font-semibold block uppercase">/ 100</span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Reliability Assessment</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Evaluated against numerical accuracy, safety, and regional compliance guidelines.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Country Context</span>
              <span className="text-slate-200 font-bold">{evaluation.country}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Topic</span>
              <span className="text-slate-200 font-bold">{evaluation.topic}</span>
            </div>
          </div>
        </div>

        {/* Metric Radar Chart */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              7-Dimension Metric Profile Radar
            </h3>
            <span className="text-xs text-cyan-400 font-semibold">Conservative Benchmark Scoring</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Radar
                  name="Reliability Score"
                  dataKey="value"
                  stroke="#38bdf8"
                  fill="#0284c7"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-400 text-center italic">
            Visualizing model score distribution across accuracy, safety, explainability, assumptions, and localization.
          </p>
        </div>
      </div>

      {/* Critical Warnings Box (If any) */}
      {evaluation.criticalWarnings && evaluation.criticalWarnings.length > 0 && (
        <div className="bg-rose-950/70 border border-rose-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center space-x-2 text-rose-300 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>Critical Safety / Calculation Warnings Detected</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs text-rose-200">
            {evaluation.criticalWarnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Local Deterministic Math Engine Verification Panel */}
      {evaluation.deterministicCheck && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Deterministic Formula Engine Verification
              </h3>
            </div>
            <span
              className={`text-xs font-bold uppercase px-2.5 py-1 rounded border ${
                evaluation.deterministicCheck.hasMismatch
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}
            >
              {evaluation.deterministicCheck.hasMismatch ? 'Numerical Mismatch Flagged' : 'Verified by Formula Engine'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-slate-300 block text-xs uppercase tracking-wider">
                Formula Target: {evaluation.deterministicCheck.formulaName}
              </span>
              <div className="space-y-1 text-slate-400 font-mono text-[11px]">
                {Object.entries(evaluation.deterministicCheck.extractedInputs).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-slate-900 py-0.5">
                    <span>{k}:</span>
                    <span className="text-cyan-300 font-bold">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Deterministic Reference Value
                </span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {evaluation.deterministicCheck.formattedReference}
                </span>
              </div>

              {evaluation.deterministicCheck.aiReportedValue && (
                <div className="pt-2 border-t border-slate-900 flex justify-between text-xs">
                  <span className="text-slate-400">AI Reported Value:</span>
                  <span className="font-bold text-cyan-300 font-mono">
                    {evaluation.deterministicCheck.formattedAiReported}
                  </span>
                </div>
              )}

              {evaluation.deterministicCheck.hasMismatch && (
                <p className="text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-800/60">
                  {evaluation.deterministicCheck.mismatchReason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Metric Progress Bars */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Detailed Dimension Scorecards
        </h3>

        <div className="space-y-4">
          {metricsList.map(({ label, metric }) => {
            const style = getScoreColor(metric.score);
            return (
              <div key={label} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-200">{label}</span>
                    {getStatusBadge(metric.status)}
                  </div>
                  <span className={`font-mono font-bold ${style.text}`}>{metric.score} / 100</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full ${style.bg} transition-all duration-500`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pt-1">{metric.explanation}</p>

                {metric.detectedIssues && metric.detectedIssues.length > 0 && (
                  <div className="pt-1 text-[11px] text-amber-300 flex items-start space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                    <span>Issues: {metric.detectedIssues.join(', ')}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Assumptions & Missing Info Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assumptions Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>Assumptions Audit</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-300 block mb-1">Stated Assumptions</span>
              {evaluation.statedAssumptions && evaluation.statedAssumptions.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {evaluation.statedAssumptions.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 italic">No stated assumptions identified.</p>
              )}
            </div>

            <div>
              <span className="font-bold text-amber-300 block mb-1">Unstated / Hidden Assumptions</span>
              {evaluation.unstatedAssumptions && evaluation.unstatedAssumptions.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-amber-200/80 bg-amber-950/30 p-3 rounded-xl border border-amber-900/50">
                  {evaluation.unstatedAssumptions.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 italic">No unstated assumptions flagged.</p>
              )}
            </div>
          </div>
        </div>

        {/* Missing Info & Recommended Corrections */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Info className="w-4 h-4 text-indigo-400" />
            <span>Missing Information & Corrections</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-300 block mb-1">Missing Context Parameters</span>
              {evaluation.missingInformation && evaluation.missingInformation.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {evaluation.missingInformation.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 italic">All context parameters provided.</p>
              )}
            </div>

            <div>
              <span className="font-bold text-cyan-300 block mb-1">Recommended Corrections</span>
              {evaluation.recommendedCorrections && evaluation.recommendedCorrections.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-cyan-200/80 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {evaluation.recommendedCorrections.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 italic">No specific corrections recommended.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Improved Response Synthesis */}
      {evaluation.improvedAnswer && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              FinTrustBench Improved Response Synthesis
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800 font-sans">
            {evaluation.improvedAnswer}
          </p>
        </div>
      )}

      {/* Research Summary Statement */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-xs text-slate-400 space-y-2">
        <span className="font-bold text-slate-200 block uppercase tracking-wider text-[11px]">
          Research Executive Summary
        </span>
        <p className="leading-relaxed">{evaluation.researchSummary}</p>
      </div>

      {/* Report Generation & Verification Modals */}
      <PersonalizedReportWizardModal
        evaluation={evaluation}
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onOpenAuthModal={onOpenAuthModal}
      />

      <ReportVerificationModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
      />
    </div>
  );
};
