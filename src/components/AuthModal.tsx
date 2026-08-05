import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Shield, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, LogIn, UserPlus, KeyRound } from 'lucide-react';
import { HistoryRecord } from '../types';
import { migrateGuestDataToCloud } from '../utils/cloudStorage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  localHistory?: HistoryRecord[];
  onHistoryUpdated?: () => void;
}

type AuthTab = 'login' | 'signup' | 'forgot' | 'migration';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  localHistory = [],
  onHistoryUpdated
}) => {
  const {
    user,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    authError,
    clearAuthError
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [migrationPromptPending, setMigrationPromptPending] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    clearAuthError();
    try {
      await signInWithGoogle();
      if (localHistory.length > 0) {
        setMigrationPromptPending(true);
        setActiveTab('migration');
      } else {
        onClose();
      }
    } catch (e) {
      // Handled in authContext
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    clearAuthError();
    try {
      if (activeTab === 'login') {
        await signInWithEmail(email, password);
        if (localHistory.length > 0) {
          setMigrationPromptPending(true);
          setActiveTab('migration');
        } else {
          onClose();
        }
      } else if (activeTab === 'signup') {
        await signUpWithEmail(email, password, displayName);
        if (localHistory.length > 0) {
          setMigrationPromptPending(true);
          setActiveTab('migration');
        } else {
          onClose();
        }
      } else if (activeTab === 'forgot') {
        await sendPasswordReset(email);
        setResetSent(true);
      }
    } catch (e) {
      // Error in auth context
    } finally {
      setLoading(false);
    }
  };

  const handleMigrationChoice = async (choice: 'import' | 'keep_local' | 'discard') => {
    if (user?.uid) {
      await migrateGuestDataToCloud(user.uid, localHistory, choice);
      if (onHistoryUpdated) onHistoryUpdated();
    }
    setMigrationPromptPending(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">FinTrustBench Account</h3>
            <p className="text-xs text-slate-400">Secure Cloud Synchronization & Integrations</p>
          </div>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Authentication Notice</span>
              <span>{authError}</span>
            </div>
            <button onClick={clearAuthError} className="text-red-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Migration View */}
        {activeTab === 'migration' ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-950/40 border border-blue-800/50 rounded-xl text-center space-y-2">
              <RefreshCw className="w-8 h-8 text-blue-400 mx-auto animate-spin" style={{ animationDuration: '3s' }} />
              <h4 className="font-bold text-sm text-white">Import Local History to Account?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                You have {localHistory.length} local evaluation record(s) on this device. Would you like to synchronize them with your secure cloud profile?
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleMigrationChoice('import')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Import Local History to Cloud Account
              </button>
              <button
                onClick={() => handleMigrationChoice('keep_local')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
              >
                Keep Local Only (Do Not Import)
              </button>
              <button
                onClick={() => handleMigrationChoice('discard')}
                className="w-full bg-slate-900 hover:bg-red-950/50 text-slate-400 hover:text-red-300 font-medium py-2 px-4 rounded-xl text-xs border border-slate-800 transition-colors"
              >
                Discard Local History
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Primary Google Auth Button */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-3 border border-slate-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center my-4">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  Or Email
                </span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 mb-5 text-xs font-semibold">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setResetSent(false);
                }}
                className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                  activeTab === 'login'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab('signup');
                  setResetSent(false);
                }}
                className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                  activeTab === 'signup'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            {activeTab === 'forgot' ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="text-xs text-slate-400 leading-relaxed">
                  Enter your registered email address to receive a password reset link.
                </div>

                {resetSent ? (
                  <div className="p-3 bg-green-950/50 border border-green-800 rounded-xl text-xs text-green-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <span>Password reset email sent! Check your inbox.</span>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                      <span>Send Reset Link</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="w-full text-center text-xs text-slate-400 hover:text-slate-200 pt-2 block"
                >
                  Return to Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                {activeTab === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                    {activeTab === 'login' && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('forgot')}
                        className="text-[11px] text-blue-400 hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-600/20"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : activeTab === 'login' ? (
                    <LogIn className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  <span>{activeTab === 'login' ? 'Sign In with Email' : 'Create Account'}</span>
                </button>
              </form>
            )}

            {/* Guest Option Notice */}
            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white font-medium underline underline-offset-4"
              >
                Continue as Guest (No account required for Quick Check)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
