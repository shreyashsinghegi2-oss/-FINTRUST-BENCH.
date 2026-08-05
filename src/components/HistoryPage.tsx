import React, { useState, useEffect } from 'react';
import {
  History as HistoryIcon,
  Trash2,
  Download,
  FileSpreadsheet,
  Eye,
  Search,
} from 'lucide-react';
import { EvaluationResult, HistoryRecord } from '../types';
import {
  getEvaluationHistory,
  deleteHistoryItem,
  clearAllHistory,
  exportToJSON,
  exportHistoryToCSV,
} from '../utils/storage';

interface HistoryPageProps {
  onOpenEvaluation: (evalResult: EvaluationResult) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onOpenEvaluation }) => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setHistory(getEvaluationHistory());
  }, []);

  const handleDelete = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all evaluation history records?')) {
      const updated = clearAllHistory();
      setHistory(updated);
    }
  };

  const filteredHistory = history.filter((h) => {
    return (
      h.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <HistoryIcon className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">
              Evaluation History Archive
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Stored local evaluation reports, score logs, and benchmark records.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => exportHistoryToCSV(history)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => exportToJSON(history, `FinTrustBench_History_${new Date().toISOString().slice(0, 10)}`)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleClearAll}
              className="px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-rose-800"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      {history.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search saved evaluations by question or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow"
          />
        </div>
      )}

      {/* History List or Empty State */}
      {filteredHistory.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <HistoryIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Evaluation History Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Run reliability tests in the Evaluation Lab or Benchmark Scenarios page to populate your persistent local archive.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center space-x-2 text-xs">
                  <span className="font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/30">
                    {item.topic}
                  </span>
                  <span className="text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.country} ({item.currency})
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {new Date(item.date).toLocaleString()}
                  </span>
                </div>

                <p className="text-sm font-bold text-white line-clamp-2 leading-snug">
                  "{item.question}"
                </p>

                <p className="text-xs text-slate-400 line-clamp-1 italic">
                  {item.shortSummary}
                </p>
              </div>

              {/* Score Badge & Actions */}
              <div className="flex items-center space-x-4 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Reliability Score</span>
                  <span
                    className={`text-xl font-black ${
                      item.overallScore >= 90
                        ? 'text-emerald-400'
                        : item.overallScore >= 75
                        ? 'text-cyan-400'
                        : item.overallScore >= 60
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {item.overallScore} / 100
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenEvaluation(item.fullEvaluation)}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-1 shadow transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View Details</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
