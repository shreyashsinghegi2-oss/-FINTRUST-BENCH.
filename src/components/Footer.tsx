import React from 'react';
import { Shield, AlertCircle, Award } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">FinTrustBench</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A Global Benchmark for Trustworthy AI in Personal Financial Decision-Making.
              Evaluating numerical accuracy, safety, explainability, and regional compliance across financial AI responses.
            </p>
            <div className="flex items-center space-x-2 text-xs text-cyan-400 pt-1">
              <Award className="w-4 h-4" />
              <span>FinTrustBench Open-Source Project</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Benchmark Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('eval-lab')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Evaluation Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('scenarios')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Benchmark Scenarios
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Comparison Mode
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('methodology')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Research Methodology
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Creator & Maintainer
                </button>
              </li>
            </ul>
          </div>

          {/* Creator & Project Maintainer Information */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Project Maintainer
            </h4>
            <div className="text-xs space-y-1 text-slate-400">
              <p className="font-bold text-slate-200 text-sm">Shreyash Singh</p>
              <p className="text-slate-300 font-semibold">Computer Science and Engineering</p>
              <p className="text-blue-400 font-semibold">Creator and Project Maintainer</p>
              <p className="text-slate-400">FinTrustBench Open-Source Project</p>
            </div>
          </div>
        </div>

        {/* Mandatory Research Disclaimer Box */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-start space-x-3 text-xs text-slate-400">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-200">Mandatory Research Disclaimer:</strong> FinTrustBench is an open-source research benchmark framework. It evaluates AI-generated financial information and does not provide certified financial, investment, legal or tax advice.
          </p>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 space-y-2 sm:space-y-0">
          <p>© {new Date().getFullYear()} FinTrustBench. Created and maintained by Shreyash Singh.</p>
          <p className="flex items-center space-x-1">
            <span>Computer Science and Engineering | Powered by Gemini 3.6 Flash & Deterministic Math Engine</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

