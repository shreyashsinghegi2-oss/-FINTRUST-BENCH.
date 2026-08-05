import React from 'react';
import {
  BookOpen,
  Award,
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-12">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-black text-white tracking-tight">
            Research Methodology & Framework
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Comprehensive documentation detailing the 10 structural sections of the FinTrustBench evaluation pipeline.
        </p>
      </div>

      {/* Featured Research Statement Banner */}
      <div className="bg-gradient-to-br from-cyan-950/60 via-slate-900 to-indigo-950 border border-cyan-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start space-x-3">
          <Award className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              Core Research Statement
            </span>
            <blockquote className="text-sm sm:text-base font-semibold text-slate-100 italic leading-relaxed">
              “FinTrustBench investigates whether AI systems can provide personal-finance reasoning that is numerically accurate, logically consistent, safe, explainable and sensitive to regional financial contexts.”
            </blockquote>
          </div>
        </div>
      </div>

      {/* 10 Methodological Sections */}
      <div className="space-y-6 text-xs text-slate-300">
        {/* 1. Research Problem */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2 shadow-md">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-blue-600/30 text-cyan-400 flex items-center justify-center text-xs font-mono">1</span>
            <span>Research Problem</span>
          </h3>
          <p className="leading-relaxed text-slate-400">
            Large Language Models (LLMs) are increasingly queried by lay consumers for financial advice, investment strategies, debt payoff options, and retirement calculations. However, LLMs often exhibit confident hallucinations, arithmetic inaccuracies, missing tax context, and failure to disclaim market risks, potentially leading to catastrophic real-world consumer financial losses.
          </p>
        </section>

        {/* 2. Research Gap */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2 shadow-md">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs font-mono">2</span>
            <span>Research Gap</span>
          </h3>
          <p className="leading-relaxed text-slate-400">
            Existing benchmarks (e.g., MMLU, GSM8K, FinQA) evaluate either generic mathematical problem-solving or corporate financial report parsing. None offer an integrated consumer-centric benchmark that evaluates numerical accuracy alongside safety disclaimers, assumption transparency, and regional localization (e.g., 401k vs NISA tax rules).
          </p>
        </section>

        {/* 3. Research Objectives */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2 shadow-md">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-cyan-600/30 text-cyan-400 flex items-center justify-center text-xs font-mono">3</span>
            <span>Research Objectives</span>
          </h3>
          <ul className="list-disc list-inside space-y-1 text-slate-400 leading-relaxed">
            <li>Formulate a standardized 7-dimension scoring metric for financial LLM evaluation.</li>
            <li>Implement hybrid evaluation combining deterministic math engines with LLM semantic judging.</li>
            <li>Stress-test AI responses against country-specific regulatory contexts (US, India, UK, EU, Japan, etc.).</li>
            <li>Provide actionable benchmarks to guide safe financial AI deployment.</li>
          </ul>
        </section>

        {/* 4. Benchmark Dimensions */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-md">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-xs font-mono">4</span>
            <span>Benchmark Dimensions</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-400">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-slate-200 block">1. Numerical Accuracy (0-100)</strong>
              Checks exact formula results against deterministic calculation engines.
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-slate-200 block">2. Reasoning Consistency (0-100)</strong>
              Verifies logical alignment between intermediate steps and final takeaways.
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-slate-200 block">3. Safety & Risk Awareness (0-100)</strong>
              Ensures fraud red flags, non-guaranteed return disclaimers, and emergency fund protection.
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-slate-200 block">4. Explainability (0-100)</strong>
              Evaluates clear definition of variables, rates, and period conventions.
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-slate-200 block">5. Localization Accuracy (0-100)</strong>
              Validates regional tax laws, accounts, currency symbols, and local guidelines.
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-slate-200 block">6. Assumption Transparency (0-100)</strong>
              Distinguishes stated rate assumptions from dangerous unstated assumptions.
            </div>
          </div>
        </section>

        {/* 5. Dataset Design */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2 shadow-md">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-purple-600/30 text-purple-400 flex items-center justify-center text-xs font-mono">5</span>
            <span>Dataset Design</span>
          </h3>
          <p className="leading-relaxed text-slate-400">
            Curated 12 core benchmark scenarios across 4 difficulty tiers and 4 risk levels (Low, Medium, High, Critical), spanning compound interest, debt repayment, emergency reserves, tax shelters, and scam warnings.
          </p>
        </section>

        {/* 6. Deterministic Verification */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2 shadow-md">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-xs font-mono">6</span>
            <span>Deterministic Verification Engine</span>
          </h3>
          <p className="leading-relaxed text-slate-400">
            A standalone TypeScript math engine executes 10 mathematical formulas (e.g. annuity FV, loan EMI amortization, present value, inflation compounding) to independently verify AI-generated numbers without relying solely on neural network output.
          </p>
        </section>

        {/* 7. AI-Based Evaluation */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2 shadow-md">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-amber-600/30 text-amber-400 flex items-center justify-center text-xs font-mono">7</span>
            <span>AI-Based Evaluation Pipeline</span>
          </h3>
          <p className="leading-relaxed text-slate-400">
            Evaluates qualitative semantics, safety disclosures, and logical consistency using Gemini with strict system instructions, zero-temperature parameter settings, and enforced JSON response schemas.
          </p>
        </section>

        {/* 8. Limitations (Explicitly Detailed) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-md">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-rose-600/30 text-rose-400 flex items-center justify-center text-xs font-mono">8</span>
            <span>Benchmark Limitations</span>
          </h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-slate-400">
            <p className="leading-relaxed">
              <strong>Evaluator Bias:</strong> In this prototype, Gemini is utilized both for response generation and semantic judging. Production benchmarks should incorporate multi-model ensembles and human expert validation.
            </p>
            <p className="leading-relaxed">
              <strong>Time-Sensitive Regulations:</strong> Tax limits (e.g., 401k or IRA contribution caps) update annually and require authoritative verification against official tax authority databases.
            </p>
            <p className="leading-relaxed">
              <strong>Sample Size:</strong> The prototype dataset comprises 12 reference test cases suitable for mini-project demonstration, rather than a publication-scale corpus of thousands of items.
            </p>
          </div>
        </section>

        {/* 9. Ethical Considerations */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2 shadow-md">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-sky-600/30 text-sky-400 flex items-center justify-center text-xs font-mono">9</span>
            <span>Ethical Considerations</span>
          </h3>
          <p className="leading-relaxed text-slate-400">
            The application strictly avoids collecting Personally Identifiable Information (PII) such as bank account credentials or social security numbers. All outputs include mandatory disclaimers clarifying that results do not constitute regulated financial advice.
          </p>
        </section>

        {/* 10. Future Scope */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2 shadow-md">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-purple-600/30 text-purple-400 flex items-center justify-center text-xs font-mono">10</span>
            <span>Future Scope</span>
          </h3>
          <p className="leading-relaxed text-slate-400">
            Expansion plans include integrating live web API tax rate validation, multi-agent debate judging, expanding to 50+ country tax codes, and publishing an open benchmark leaderboard for consumer finance AI safety.
          </p>
        </section>
      </div>
    </div>
  );
};
