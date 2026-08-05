import React, { useState } from 'react';
import {
  Mail,
  FileSpreadsheet,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Lock,
  Search,
  Eye,
  RefreshCw,
  Info
} from 'lucide-react';

interface SimulatedEmail {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  date: string;
  fullBody: string;
}

export const GoogleConnectionsPage: React.FC = () => {
  const [gmailConnected, setGmailConnected] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<SimulatedEmail | null>(null);
  const [importedText, setImportedText] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sampleEmails: SimulatedEmail[] = [
    {
      id: 'msg-01',
      sender: 'adviser-ai@fintech-demo.com',
      subject: 'Your 20-Year Recurring Investment Calculation Summary',
      date: '2026-08-01',
      snippet: 'Based on $500 monthly investment at 7% expected annual return...',
      fullBody:
        'Hello,\n\nHere is your requested monthly investment breakdown:\nInvesting $500 monthly for 20 years at an expected annual return of 7% compounded monthly results in an estimated future balance of $260,463.33.\n\nAssumptions:\n- End-of-month payments\n- Constant 7% annual rate\n- No taxes or management fees deducted.'
    },
    {
      id: 'msg-02',
      sender: 'wealth-bot@finance-tool.org',
      subject: 'Emergency Fund vs High Yield Savings Advice',
      date: '2026-07-28',
      snippet: 'Recommended maintaining 6 months of expenses in a liquid Hysa...',
      fullBody:
        'To build an emergency fund, save 6 months of living expenses ($3,000 x 6 = $18,000) in a high-yield savings account yielding 4.5% annual interest. Avoid putting emergency reserves into volatile equities.'
    }
  ];

  const handleConnectGmail = () => {
    setGmailConnected(true);
  };

  const handleDisconnectGmail = () => {
    setGmailConnected(false);
    setSelectedEmail(null);
    setImportedText(null);
  };

  const handleImportSelectedEmail = (msg: SimulatedEmail) => {
    setSelectedEmail(msg);
    setImportedText(msg.fullBody);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
          <Mail className="w-4 h-4" /> Workspace Integration Center
        </div>
        <h1 className="text-2xl font-bold text-white">Google Workspace Connections</h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Selectively import financial AI advice or benchmark scenarios from Google Workspace applications. FinTrustBench enforces strict granular consent — signing in with Google does not automatically grant access to Gmail or Drive.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="p-4 bg-blue-950/40 border border-blue-800/60 rounded-xl flex items-start gap-3 text-xs text-blue-200">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-sm text-white block">Strict Privacy & Zero Mailbox Scanning</span>
          <p className="leading-relaxed">
            FinTrustBench never scans your mailbox, reads background emails, or shares your messages. Email imports are user-initiated and require explicit selection of specific messages for evaluation.
          </p>
        </div>
      </div>

      {/* Connection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gmail Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-red-600/20 border border-red-500/30 text-red-400 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Gmail Integration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Import AI-generated financial email responses directly into FinTrustBench for deterministic verification.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Status</span>
              {gmailConnected ? (
                <span className="text-green-400 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected (Selective)
                </span>
              ) : (
                <span className="text-slate-500 font-semibold text-[11px]">Not Connected</span>
              )}
            </div>

            {gmailConnected ? (
              <div className="space-y-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-3.5 h-3.5" /> Select Email Message
                </button>
                <button
                  onClick={handleDisconnectGmail}
                  className="w-full bg-slate-950 hover:bg-red-950/50 text-slate-400 hover:text-red-300 font-medium py-1.5 px-3 rounded-xl text-xs border border-slate-800 transition-colors"
                >
                  Disconnect Gmail
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectGmail}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" /> Connect Gmail
              </button>
            )}
          </div>
        </div>

        {/* Google Drive Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-amber-600/20 border border-amber-500/30 text-amber-400 rounded-xl flex items-center justify-center">
              <HardDrive className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Google Drive</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Import stored benchmark scenarios or report archives directly from Google Drive.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Status</span>
              <span className="text-slate-500 font-semibold text-[11px]">Optional Integration</span>
            </div>
            <button
              disabled
              className="w-full bg-slate-800 text-slate-500 font-bold py-2 px-3 rounded-xl text-xs cursor-not-allowed"
            >
              Available in Sandbox Mode
            </button>
          </div>
        </div>

        {/* Google Sheets Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Google Sheets</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export benchmark evaluation histories automatically to Google Sheets.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Status</span>
              <span className="text-slate-500 font-semibold text-[11px]">Optional Integration</span>
            </div>
            <button
              disabled
              className="w-full bg-slate-800 text-slate-500 font-bold py-2 px-3 rounded-xl text-xs cursor-not-allowed"
            >
              Available in Sandbox Mode
            </button>
          </div>
        </div>
      </div>

      {/* Imported Email Display */}
      {importedText && selectedEmail && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-green-400">
              <CheckCircle2 className="w-4 h-4" /> Imported Email Selection
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{selectedEmail.date}</span>
          </div>
          <div className="text-sm font-bold text-white">{selectedEmail.subject}</div>
          <p className="text-xs text-slate-300 font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed whitespace-pre-wrap">
            {importedText}
          </p>
        </div>
      )}

      {/* Message Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-400" /> Select Message to Import
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Select an email containing an AI-generated financial calculation or recommendation:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {sampleEmails.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleImportSelectedEmail(msg)}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-blue-400">{msg.sender}</span>
                    <span className="text-[10px] text-slate-500">{msg.date}</span>
                  </div>
                  <div className="text-xs font-bold text-white">{msg.subject}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{msg.snippet}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
