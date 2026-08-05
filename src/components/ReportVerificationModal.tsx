import React, { useState } from 'react';
import { X, ShieldCheck, Search, CheckCircle2, AlertTriangle, FileText, Lock } from 'lucide-react';
import { ReportSnapshot } from '../types';
import { useAuth } from '../context/AuthContext';
import { fetchUserReportsFromCloud } from '../utils/reportService';

interface ReportVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportVerificationModal: React.FC<ReportVerificationModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [codeInput, setCodeInput] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [verifiedReport, setVerifiedReport] = useState<ReportSnapshot | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) return;

    setIsSearching(true);
    setNotFound(false);
    setVerifiedReport(null);

    const cleanCode = codeInput.trim().toUpperCase();

    try {
      const reports = await fetchUserReportsFromCloud(user?.uid || 'guest');
      const found = reports.find(
        (r) =>
          r.verificationCode.toUpperCase() === cleanCode ||
          r.reportId.toUpperCase() === cleanCode ||
          r.reportHash.toUpperCase().includes(cleanCode)
      );

      if (found) {
        setVerifiedReport(found);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Report Verification Portal</h3>
              <p className="text-xs text-slate-400">Verify FinTrustBench report authenticity and cryptographic hash</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Enter Verification Code or Report ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="e.g. FTB-V2-8K92-X7M4"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={isSearching || !codeInput.trim()}
                className="absolute right-2 top-1.5 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {verifiedReport && (
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-800/80 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> VERIFIED GENUINE FINTRUSTBENCH REPORT
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                {verifiedReport.verificationCode}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {verifiedReport.photoDataUrl && (
                <img src={verifiedReport.photoDataUrl} alt="Report User" className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
              )}
              <div>
                <h4 className="font-bold text-sm text-white">{verifiedReport.reportDisplayName}</h4>
                <p className="text-xs text-slate-400">Type: {verifiedReport.reportType === 'personalized' ? 'Personalized Report' : 'Standard Private Report'}</p>
                <p className="text-[10px] text-slate-500 font-mono">Created: {new Date(verifiedReport.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-400 block">Overall Score:</span>
                <span className="font-bold text-cyan-400 text-sm">{verifiedReport.overallReliabilityScore}/100</span>
              </div>
              <div>
                <span className="text-slate-400 block">Reliability Level:</span>
                <span className="font-bold text-white text-sm">{verifiedReport.reliabilityLevel}</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-blue-950/40 border border-blue-900/60 text-[11px] text-blue-200/90 leading-relaxed">
              Disclaimer: The personalized report links the user-supplied name and photograph to the generated FinTrustBench report. It does not perform legal identity verification or biometric authentication.
            </div>
          </div>
        )}

        {notFound && (
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-800/80 text-amber-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
            <span>No matching report record found for this verification code in active session or account history.</span>
          </div>
        )}
      </div>
    </div>
  );
};
