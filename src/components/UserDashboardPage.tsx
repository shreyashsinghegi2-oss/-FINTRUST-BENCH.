import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Shield,
  Clock,
  Download,
  Trash2,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Mail,
  LogOut,
  X,
  Lock,
  Globe2,
  DollarSign,
  FileCheck,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { AppSettings, HistoryRecord, BenchmarkScenario, ReportSnapshot } from '../types';
import {
  fetchUserEvaluationsFromCloud,
  fetchUserScenariosFromCloud,
  clearAllCloudEvaluations,
  exportUserDataJSON
} from '../utils/cloudStorage';
import { fetchUserReportsFromCloud, deleteReportFromCloud } from '../utils/reportService';
import { generateFinTrustBenchPDF } from '../utils/pdfGenerator';
import { ReportVerificationModal } from './ReportVerificationModal';

interface UserDashboardPageProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  localHistory: HistoryRecord[];
  onHistoryUpdated: () => void;
  onOpenAuthModal: () => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  settings,
  updateSettings,
  localHistory,
  onHistoryUpdated,
  onOpenAuthModal
}) => {
  const { user, profile, signOutUser, deleteAccount, updateProfileData } = useAuth();
  const [cloudEvaluations, setCloudEvaluations] = useState<HistoryRecord[]>([]);
  const [cloudScenarios, setCloudScenarios] = useState<BenchmarkScenario[]>([]);
  const [userReports, setUserReports] = useState<ReportSnapshot[]>([]);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  useEffect(() => {
    setLoadingCloud(true);
    Promise.all([
      fetchUserEvaluationsFromCloud(user?.uid || 'guest'),
      fetchUserScenariosFromCloud(user?.uid || 'guest'),
      fetchUserReportsFromCloud(user?.uid || 'guest')
    ])
      .then(([evals, scenarios, reports]) => {
        setCloudEvaluations(evals);
        setCloudScenarios(scenarios);
        setUserReports(reports);
      })
      .finally(() => setLoadingCloud(false));
  }, [user?.uid]);

  const handleDownloadExistingReport = async (report: ReportSnapshot) => {
    try {
      const { pdfBlob, fileName } = await generateFinTrustBenchPDF(report);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error re-downloading report:', err);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    await deleteReportFromCloud(user?.uid || null, reportId);
    setUserReports((prev) => prev.filter((r) => r.reportId !== reportId));
  };

  const displayedHistory = user ? cloudEvaluations : localHistory;

  const handleExportData = async () => {
    await exportUserDataJSON(user?.uid || null, profile, settings, localHistory);
  };

  const handleClearHistory = async () => {
    if (user?.uid) {
      await clearAllCloudEvaluations(user.uid);
      setCloudEvaluations([]);
    } else {
      localStorage.removeItem('fintrustbench_history');
    }
    onHistoryUpdated();
    setShowClearConfirm(false);
  };

  const handleDeleteAccountConfirm = async () => {
    try {
      if (user?.uid) {
        await clearAllCloudEvaluations(user.uid);
      }
      await deleteAccount();
      setShowDeleteConfirm(false);
      onHistoryUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to delete account. Please re-authenticate and try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
            <User className="w-4 h-4" /> Account & Cloud Dashboard
          </div>
          <h1 className="text-2xl font-bold text-white">
            {user ? (profile?.displayName || 'Signed In User') : 'Guest User Overview'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your FinTrustBench profile, synchronized evaluation records, connected AI providers, and privacy exports.
          </p>
        </div>

        {user ? (
          <button
            onClick={() => signOutUser()}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold py-2 px-4 rounded-xl text-xs border border-slate-800 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4 text-slate-400" /> Sign Out
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <User className="w-4 h-4" /> Sign In / Create Account
          </button>
        )}
      </div>

      {/* Mandatory Financial Data Privacy Banner */}
      <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 block text-sm">
            Strict Personal Financial Data Guardrail
          </span>
          <p className="leading-relaxed">
            Do not enter passwords, account numbers, card details, government identifiers or brokerage credentials into FinTrustBench. Evaluations are designed for testing math, logic, and safety — never store confidential credentials.
          </p>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Details Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center font-bold text-lg">
              {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {user ? profile?.displayName || 'User Profile' : 'Guest Account'}
              </h3>
              <p className="text-xs text-slate-400">{user ? profile?.email : 'Local Session Only'}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Account Role</span>
              <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px] px-2 py-0.5 bg-blue-950 border border-blue-800/80 rounded">
                {profile?.role || 'guest'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Default Country</span>
              <span className="font-semibold text-slate-300">{profile?.preferredCountry || 'Global / Country-Neutral'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Default Currency</span>
              <span className="font-semibold text-slate-300">{profile?.preferredCurrency || 'USD ($)'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Cloud Sync Status</span>
              {user ? (
                <span className="text-green-400 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Firestore Active
                </span>
              ) : (
                <span className="text-slate-500 font-medium text-[11px]">Local Only</span>
              )}
            </div>
          </div>
        </div>

        {/* Activity & Stats Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Evaluation Activity Summary
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Evaluations</span>
                <span className="text-2xl font-black text-white">{displayedHistory.length}</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Generated Reports</span>
                <span className="text-2xl font-black text-cyan-400">{userReports.length}</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Saved Scenarios</span>
                <span className="text-2xl font-black text-blue-400">{cloudScenarios.length}</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Avg Score</span>
                <span className="text-2xl font-black text-green-400">
                  {displayedHistory.length > 0
                    ? Math.round(
                        displayedHistory.reduce((acc, curr) => acc + curr.overallScore, 0) / displayedHistory.length
                      )
                    : 'N/A'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              Note: FinTrustBench evaluation reliability scores measure model logic and calculation precision. They do not represent individual credit scores or financial health certifications.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setIsVerifyOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-md shadow-cyan-600/20"
            >
              <ShieldCheck className="w-4 h-4" /> Verify Report Code
            </button>

            <button
              onClick={handleExportData}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-md shadow-blue-600/20"
            >
              <Download className="w-4 h-4" /> Export All User Data (JSON)
            </button>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold py-2 px-4 rounded-xl text-xs border border-slate-800 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4 text-slate-400" /> Clear Evaluation History
            </button>

            {user && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-950/40 hover:bg-red-900/60 text-red-300 font-semibold py-2 px-4 rounded-xl text-xs border border-red-800/80 transition-colors flex items-center gap-2 ml-auto"
              >
                Delete Account
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Generated Reports & Verification List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white">My FinTrustBench Reports</h3>
          </div>
          <span className="text-xs text-slate-400">{userReports.length} saved report(s)</span>
        </div>

        {userReports.length > 0 ? (
          <div className="space-y-3">
            {userReports.map((rep) => (
              <div key={rep.reportId} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  {rep.photoDataUrl ? (
                    <img src={rep.photoDataUrl} alt="User" className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-white">{rep.reportDisplayName}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-semibold">
                        {rep.reportType === 'personalized' ? 'Personalized' : 'Standard Private'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{rep.question}</p>
                    <p className="text-[10px] text-cyan-400 font-mono mt-1">
                      Code: <span className="font-bold">{rep.verificationCode}</span> | Downloads: {rep.downloadCount || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleDownloadExistingReport(rep)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-bold flex items-center space-x-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => handleDeleteReport(rep.reportId)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 transition-colors"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-500 text-xs space-y-1">
            <p className="font-semibold text-slate-400">No generated reports yet.</p>
            <p>Run a FinTrustBench evaluation and click "Generate PDF Report" to create your first report.</p>
          </div>
        )}
      </div>

      <ReportVerificationModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
      />

      {/* Clear History Confirm Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 text-slate-100">
            <h3 className="text-base font-bold text-white">Clear All Evaluation History?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This action will permanently delete all stored evaluation records from {user ? 'your cloud account' : 'local storage'}. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-xl text-xs"
              >
                Confirm Delete History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-red-900/80 rounded-2xl w-full max-w-md p-6 space-y-4 text-slate-100">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" /> Confirm Account & Cloud Data Deletion
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete your FinTrustBench user account and all cloud-stored evaluation history?
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccountConfirm}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-xl text-xs"
              >
                Delete Account & Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
