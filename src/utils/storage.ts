/**
 * FinTrustBench Storage & Export Utility
 * Handles LocalStorage history, settings persistence, and CSV/JSON exports.
 */

import { AppSettings, EvaluationResult, HistoryRecord } from '../types';

const HISTORY_KEY = 'fintrustbench_eval_history_v1';
const SETTINGS_KEY = 'fintrustbench_app_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  demoMode: false,
  presentationMode: false,
  theme: 'light',
  model: 'gemini-3.6-flash',
  temperatureAnswer: 0.4,
  temperatureEval: 0.1,
};

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export const loadSettings = getStoredSettings;
export const saveSettings = saveStoredSettings;
export const getStoredHistory = getEvaluationHistory;

export function saveStoredSettings(settings: AppSettings): void {
  try {
    // SECURITY REQUIREMENT: Never store the API key in localStorage
    const safeSettings = { ...settings };
    delete safeSettings.apiKeyOverride;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(safeSettings));
  } catch (err) {
    console.error('Failed to save settings to localStorage:', err);
  }
}

export function getEvaluationHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveEvaluationToHistory(evalResult: EvaluationResult): HistoryRecord[] {
  try {
    const history = getEvaluationHistory();
    const newRecord: HistoryRecord = {
      id: evalResult.id || `eval-${Date.now()}`,
      date: evalResult.timestamp || new Date().toISOString(),
      country: evalResult.country,
      currency: evalResult.currency,
      topic: evalResult.topic,
      question: evalResult.question,
      overallScore: evalResult.overallReliabilityScore,
      reliabilityLevel: evalResult.reliabilityLevel,
      shortSummary: evalResult.researchSummary || evalResult.improvedAnswer?.substring(0, 120) || 'Evaluation completed',
      fullEvaluation: evalResult,
    };

    // Unshift to place latest first
    const updated = [newRecord, ...history.filter((h) => h.id !== newRecord.id)].slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save evaluation history:', err);
    return getEvaluationHistory();
  }
}

export function deleteHistoryItem(id: string): HistoryRecord[] {
  try {
    const history = getEvaluationHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getEvaluationHistory();
  }
}

export function clearAllHistory(): HistoryRecord[] {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return [];
  } catch {
    return [];
  }
}

/**
 * Export evaluation or history to JSON
 */
export function exportToJSON(data: any, filename: string): void {
  // SECURITY REQUIREMENT: Scrub any potential API key field before export
  const cleanData = JSON.parse(JSON.stringify(data, (key, value) => {
    if (key.toLowerCase().includes('apikey') || key.toLowerCase().includes('secret')) {
      return undefined;
    }
    return value;
  }));

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(cleanData, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `${filename}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Export history array to CSV file format
 */
export function exportHistoryToCSV(history: HistoryRecord[]): void {
  if (!history || history.length === 0) return;

  const headers = ['Date', 'Country', 'Currency', 'Topic', 'Overall Score', 'Reliability Level', 'Question', 'Summary'];
  const rows = history.map((item) => [
    `"${new Date(item.date).toLocaleString().replace(/"/g, '""')}"`,
    `"${item.country.replace(/"/g, '""')}"`,
    `"${item.currency.replace(/"/g, '""')}"`,
    `"${item.topic.replace(/"/g, '""')}"`,
    item.overallScore,
    `"${item.reliabilityLevel.replace(/"/g, '""')}"`,
    `"${item.question.replace(/"/g, '""')}"`,
    `"${item.shortSummary.replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `FinTrustBench_Evaluation_History_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
