import React, { useState } from 'react';
import {
  Shield,
  Activity,
  Sliders,
  Sun,
  Moon,
  Tv,
  FlaskConical,
  BookOpen,
  GitCompare,
  History as HistoryIcon,
  Info,
  Menu,
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Cpu,
  Mail,
  User,
  LayoutDashboard
} from 'lucide-react';
import { AppSettings } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  openSettingsModal?: () => void;
  onOpenSettings?: () => void;
  onOpenAuthModal?: () => void;
  hasActiveEvaluation?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  settings,
  updateSettings,
  openSettingsModal,
  onOpenSettings,
  onOpenAuthModal,
  hasActiveEvaluation = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile } = useAuth();
  const handleOpenSettings = onOpenSettings || openSettingsModal || (() => {});

  const navItems = [
    { id: 'landing', label: 'Home', icon: Shield },
    { id: 'quick-check', label: 'Quick Check', icon: Zap },
    { id: 'eval-lab', label: 'Research Lab', icon: FlaskConical },
    { id: 'scenarios', label: 'Scenarios', icon: Activity },
    ...(hasActiveEvaluation ? [{ id: 'results', label: 'Results', icon: CheckCircle2 }] : []),
    { id: 'comparison', label: 'Compare', icon: GitCompare },
    { id: 'history', label: 'History', icon: HistoryIcon },
    { id: 'ai-connections', label: 'AI Connections', icon: Cpu },
    { id: 'google-connections', label: 'Google Connections', icon: Mail },
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'methodology', label: 'Methodology', icon: BookOpen },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top Public Status Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 py-1 text-xs text-slate-300 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
            Open-Source Financial AI Reliability Platform
          </span>
          <span className="hidden sm:inline text-slate-400 font-medium text-[11px]">
            Evaluate AI-generated personal-finance responses with deterministic verification and structured reliability analysis.
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px] shrink-0">
          {settings.demoMode && (
            <span className="flex items-center space-x-1 text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
              <AlertTriangle className="w-3 h-3" />
              <span>Demo Mode</span>
            </span>
          )}
          {user ? (
            <span className="text-green-400 font-medium flex items-center gap-1 text-[11px]">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              {profile?.displayName || 'Signed In'}
            </span>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="text-blue-400 hover:text-white text-[11px] font-semibold underline underline-offset-2"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick('landing')}
          >
            <div className="relative w-9 h-9 rounded-xl bg-blue-600 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                  Fin<span className="text-blue-500">Trust</span>Bench
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider font-semibold uppercase hidden lg:block">
                Open-Source Financial AI Benchmark
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Medium Screens Compact Nav */}
          <nav className="hidden md:flex xl:hidden items-center space-x-1">
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                  className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </nav>

          {/* Action Toggles & Settings */}
          <div className="flex items-center space-x-2">
            {/* User Avatar / Auth Button */}
            <button
              onClick={() => {
                if (user) {
                  handleNavClick('dashboard');
                } else if (onOpenAuthModal) {
                  onOpenAuthModal();
                }
              }}
              title={user ? 'User Dashboard' : 'Sign In'}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700 flex items-center gap-1.5 text-xs font-semibold"
            >
              <User className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">{user ? profile?.displayName?.split(' ')[0] || 'Account' : 'Sign In'}</span>
            </button>

            {/* Demo Mode Toggle Button */}
            <button
              onClick={() => updateSettings({ demoMode: !settings.demoMode })}
              title="Toggle Demo Mode (Run without API key)"
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                settings.demoMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${settings.demoMode ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Demo</span>
            </button>

            {/* Settings Modal Icon */}
            <button
              onClick={handleOpenSettings}
              title="Settings & API Configuration"
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <Sliders className="w-4 h-4 text-blue-400" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
