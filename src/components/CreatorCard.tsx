import React, { useState } from 'react';
import { Shield } from 'lucide-react';

interface CreatorCardProps {
  variant?: 'full' | 'compact';
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  variant = 'full',
}) => {
  const [imageError, setImageError] = useState(false);
  const imagePath = '/assets/creator/shreyash-singh-creator-original-verified.jpg';

  if (variant === 'compact') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center gap-5">
        {/* Creator Portrait Frame */}
        <div className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-2xl overflow-hidden bg-white border border-slate-700 shrink-0 shadow-md">
          {!imageError ? (
            <img
              src={imagePath}
              alt="Shreyash Singh, creator and project maintainer of FinTrustBench"
              onError={() => setImageError(true)}
              className="w-full h-full object-contain object-top"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-800 text-white">
              <span className="font-black text-2xl font-mono">SS</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-wider">
            <Shield className="w-3 h-3" /> Creator & Maintainer
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Shreyash Singh</h3>
          <p className="text-xs font-semibold text-blue-400">
            Creator and Project Maintainer
          </p>
          <p className="text-xs text-slate-400">
            FinTrustBench Open-Source Project
          </p>
          <p className="text-xs text-slate-400 pt-1 leading-relaxed max-w-lg italic">
            “Shreyash Singh is the creator and project maintainer of FinTrustBench. His work focuses on trustworthy artificial intelligence, financial technology, deterministic financial verification, AI evaluation, responsible system design and user-centered software development.”
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Creator and Project Maintainer
          </h3>
        </div>
        <span className="text-xs font-semibold text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-500/30">
          Open-Source Project
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Creator Portrait Frame */}
        <div className="flex justify-center md:justify-start">
          <div className="relative w-44 h-60 sm:w-52 sm:h-72 rounded-2xl overflow-hidden bg-white border border-slate-700 shadow-2xl">
            {!imageError ? (
              <img
                src={imagePath}
                alt="Shreyash Singh, creator and project maintainer of FinTrustBench"
                onError={() => setImageError(true)}
                className="w-full h-full object-contain object-top"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 text-white p-4 text-center">
                <span className="font-black text-4xl sm:text-5xl tracking-widest font-mono">SS</span>
                <span className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider mt-2">Shreyash Singh</span>
              </div>
            )}
          </div>
        </div>

        {/* Creator Bio & Info */}
        <div className="md:col-span-2 space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Shreyash Singh
            </h2>
            <p className="text-sm font-bold text-blue-400">
              Creator and Project Maintainer
            </p>
            <p className="text-xs font-semibold text-slate-400">
              FinTrustBench Open-Source Project
            </p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            “Shreyash Singh designed FinTrustBench as an open-source platform for evaluating the reliability of AI-generated personal-finance responses. The project combines deterministic financial calculations with structured assessment of numerical accuracy, reasoning consistency, safety, explainability, localization, assumption transparency and completeness.”
          </p>

          <p className="text-xs text-slate-400 leading-relaxed max-w-xl italic">
            “Shreyash Singh is the creator and project maintainer of FinTrustBench. His work focuses on trustworthy artificial intelligence, financial technology, deterministic financial verification, AI evaluation, responsible system design and user-centered software development.”
          </p>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 block uppercase font-semibold text-[10px]">Project Leadership</span>
              <span className="text-slate-200 font-bold">Architecture & Benchmarking</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 block uppercase font-semibold text-[10px]">Open-Source Status</span>
              <span className="text-emerald-400 font-bold">Active Maintainer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
