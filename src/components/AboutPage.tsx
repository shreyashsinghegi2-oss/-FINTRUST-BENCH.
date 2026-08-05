import React from 'react';
import { Shield, Target, Users, Cpu, Compass, AlertTriangle, Code, Heart, Info } from 'lucide-react';
import { CreatorCard } from './CreatorCard';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Open-Source Research Benchmark</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">About FinTrustBench</h2>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
            Evaluating financial AI reliability, numerical calculation accuracy, safety guardrails, regional context, and assumption transparency.
          </p>
        </div>

        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-600/30 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-xl">
          <Shield className="w-10 h-10 text-cyan-400" />
        </div>
      </div>

      {/* 1. What FinTrustBench Is */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl text-xs text-slate-300 leading-relaxed">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>1. What FinTrustBench Is</span>
        </h3>
        <p>
          <strong>FinTrustBench</strong> is an open-source research and benchmarking framework engineered specifically to evaluate the reliability, mathematical accuracy, and safety of artificial intelligence models when answering consumer personal-finance queries.
        </p>
        <p>
          Unlike generic language benchmarks, FinTrustBench measures financial AI performance across 7 rigorous dimensions: Numerical Accuracy, Reasoning Consistency, Safety & Risk Awareness, Explainability, Localization Accuracy, Assumption Transparency, and Contextual Completeness.
        </p>
      </section>

      {/* 2. Why It Was Created */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl text-xs text-slate-300 leading-relaxed">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
          <Target className="w-4 h-4 text-blue-400" />
          <span>2. Why It Was Created</span>
        </h3>
        <p>
          Millions of individuals turn to modern LLMs for personal money management guidance—ranging from retirement projections and debt payoff calculations to loan comparisons and tax planning.
        </p>
        <p>
          However, AI models frequently output confident mathematical hallucinations, overlook regional tax laws, omit mandatory risk disclaimers, or fail to state implicit rate assumptions. FinTrustBench was created to provide a transparent, standardized evaluation framework to detect and correct these vulnerabilities before AI responses reach consumers.
        </p>
      </section>

      {/* 3. Who It Helps */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl text-xs text-slate-300 leading-relaxed">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>3. Who It Helps</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-slate-200 block text-xs">AI Researchers & Evaluators</strong>
            <p className="text-slate-400 text-[11px]">Assess model alignment and financial accuracy against standardized reference test cases.</p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-slate-200 block text-xs">Fintech Developers</strong>
            <p className="text-slate-400 text-[11px]">Verify prompt safety guardrails and regional tax awareness before deploying conversational tools.</p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-slate-200 block text-xs">Consumers & Learners</strong>
            <p className="text-slate-400 text-[11px]">Understand how financial AI operates and learn to recognize missing assumptions and non-guaranteed claims.</p>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl text-xs text-slate-300 leading-relaxed">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>4. How It Works</span>
        </h3>
        <p>
          FinTrustBench uses a hybrid verification pipeline combining deterministic financial calculation modules with structured semantic evaluation:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block text-xs">Deterministic Verification Engine</span>
            <p className="text-slate-400 text-[11px]">Calculates ground-truth mathematical values using exact financial formulas (EMI, annuity, inflation compounding) independent of neural networks.</p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-indigo-400 font-bold block text-xs">Semantic Evaluation Judge</span>
            <p className="text-slate-400 text-[11px]">Analyzes qualitatively whether the response includes required disclaimers, regional tax rules, explicit assumption declarations, and clear explanations.</p>
          </div>
        </div>
      </section>

      {/* 5. Open-Source Vision */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl text-xs text-slate-300 leading-relaxed">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
          <Heart className="w-4 h-4 text-rose-400" />
          <span>5. Open-Source Vision</span>
        </h3>
        <p>
          FinTrustBench is built on an open-source model so that researchers, developers, and consumer advocates worldwide can inspect evaluation methodologies, contribute test scenarios, extend country-specific tax rules, and audit model scoring algorithms transparently.
        </p>
      </section>

      {/* 6. Creator and Project Maintainer */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider px-1">
          6. Creator and Project Maintainer
        </h3>
        <CreatorCard variant="full" />
      </section>

      {/* 7. Research Direction */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl text-xs text-slate-300 leading-relaxed">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <span>7. Research Direction</span>
        </h3>
        <p>
          Ongoing research directions for FinTrustBench include multi-agent evaluator consensus, dynamic web search verification for real-time tax code updates, expanding regional tax coverage to 50+ jurisdictions, and building automated prompt-adversarial stress tests.
        </p>
      </section>

      {/* 8. Limitations */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl text-xs text-slate-300 leading-relaxed">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>8. Limitations</span>
        </h3>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-slate-400">
          <p>
            <strong className="text-slate-200">Educational Benchmark Scope:</strong> FinTrustBench evaluates AI model capabilities; it does not replace certified financial advisors, accountants, or legal counsel.
          </p>
          <p>
            <strong className="text-slate-200">Dynamic Regulatory Shift:</strong> Annual changes in country tax thresholds (e.g. 401k limits, ISA allowances) require periodic rule updates and verification against official tax authority databases.
          </p>
        </div>
      </section>

      {/* 9. Contributing */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl text-xs text-slate-300 leading-relaxed">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <span>9. Contributing</span>
        </h3>
        <p>
          FinTrustBench welcomes open-source contributions! Developers and financial researchers can submit new test scenarios, propose localized tax calculation modules, refine evaluation rubrics, or improve UI verification tools.
        </p>
      </section>
    </div>
  );
};

