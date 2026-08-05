/**
 * FinTrustBench Type Definitions
 * Global Benchmark for Trustworthy AI in Personal Financial Decision-Making
 */

export type CountryRegion =
  | 'Global / Country-Neutral'
  | 'India'
  | 'United States'
  | 'United Kingdom'
  | 'European Union'
  | 'Canada'
  | 'Australia'
  | 'Singapore'
  | 'Japan'
  | 'Other';

export type Currency =
  | 'USD'
  | 'INR'
  | 'EUR'
  | 'GBP'
  | 'CAD'
  | 'AUD'
  | 'SGD'
  | 'JPY'
  | 'Custom';

export type FinancialTopic =
  | 'Budgeting'
  | 'Savings'
  | 'Emergency Fund'
  | 'Compound Interest'
  | 'Loan and EMI'
  | 'Debt Repayment'
  | 'Investment Risk'
  | 'Retirement Planning'
  | 'Insurance'
  | 'Inflation'
  | 'Taxation'
  | 'Financial Fraud'
  | 'General Personal Finance';

export type Difficulty = 'Basic' | 'Intermediate' | 'Advanced';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface UserContext {
  age?: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  existingDebt?: number;
  savings?: number;
  financialGoal?: string;
  timeHorizonYears?: number;
  riskTolerance?: 'Conservative' | 'Moderate' | 'Aggressive' | 'Very Aggressive';
}

export interface MetricResult {
  score: number; // 0 - 100
  maximum: number; // 100
  status: 'pass' | 'warning' | 'fail' | 'not_applicable';
  explanation: string;
  detectedIssues: string[];
}

export interface DeterministicVerificationResult {
  formulaName: string;
  extractedInputs: Record<string, number | string>;
  calculatedReference: number;
  formattedReference: string;
  aiReportedValue?: number;
  formattedAiReported?: string;
  difference?: number;
  percentageDifference?: number;
  hasMismatch: boolean;
  mismatchReason?: string;
  isVerified: boolean;
}

export interface EvaluationResult {
  id: string;
  timestamp: string;
  country: CountryRegion;
  currency: Currency;
  topic: FinancialTopic;
  difficulty: Difficulty;
  riskLevel: RiskLevel;
  question: string;
  userContext?: UserContext;

  // Evaluator dimensions
  numericalAccuracy: MetricResult;
  reasoningConsistency: MetricResult;
  safetyAndRiskAwareness: MetricResult;
  explainability: MetricResult;
  localizationAccuracy: MetricResult;
  assumptionTransparency: MetricResult;
  completeness: MetricResult;

  overallReliabilityScore: number; // 0 - 100
  reliabilityLevel: 'Excellent' | 'Good' | 'Moderate' | 'Weak' | 'Unsafe';

  criticalWarnings: string[];
  missingInformation: string[];
  statedAssumptions: string[];
  unstatedAssumptions: string[];
  recommendedCorrections: string[];
  improvedAnswer: string;
  researchSummary: string;

  // Local deterministic calculation verification
  deterministicCheck?: DeterministicVerificationResult;

  // Stored AI Response details
  aiAnswer?: {
    summary: string;
    calculationOrReasoning: string;
    assumptions: string[];
    risks: string[];
    missingInformation: string[];
    limitations: string;
    finalEducationalConclusion: string;
    rawText: string;
  };
}

export interface AIAnswerResponse {
  summary: string;
  calculationOrReasoning: string;
  assumptions: string[];
  risks: string[];
  missingInformation: string[];
  limitations: string;
  finalEducationalConclusion: string;
  rawText: string;
}

export interface BenchmarkScenario {
  id: string;
  title: string;
  country: CountryRegion;
  currency: Currency;
  topic: FinancialTopic;
  difficulty: Difficulty;
  riskLevel: RiskLevel;
  question: string;
  userContext?: UserContext;
  expectedKeyReasoning: string[];
  expectedChecks: string[];
  deterministicReference?: {
    formulaName: string;
    inputs: Record<string, number>;
    expectedResult: number;
    formattedResult: string;
  };
}

export interface HistoryRecord {
  id: string;
  date: string;
  country: CountryRegion;
  currency: Currency;
  topic: FinancialTopic;
  question: string;
  overallScore: number;
  reliabilityLevel: 'Excellent' | 'Good' | 'Moderate' | 'Weak' | 'Unsafe';
  shortSummary: string;
  fullEvaluation: EvaluationResult;
}

export interface AppSettings {
  demoMode: boolean;
  presentationMode: boolean;
  theme: 'light' | 'dark';
  model: string;
  temperatureAnswer: number;
  temperatureEval: number;
  apiKeyOverride?: string;
}

export type ReportType = 'standard' | 'personalized';

export type ReportStatus = 'draft' | 'generated' | 'downloaded' | 'deleted' | 'superseded';

export interface DownloadAuditRecord {
  id: string;
  reportId: string;
  userUid: string;
  downloadedAt: string;
  reportVersion: string;
  applicationVersion: string;
  downloadResult: 'success' | 'failed';
  requestId?: string;
}

export interface ReportSnapshot {
  reportId: string;
  schemaVersion: string;
  applicationVersion: string;
  evaluationEngineVersion: string;
  deterministicEngineVersion: string;
  userUid: string;
  reportDisplayName: string;
  photoStoragePath?: string;
  photoDataUrl?: string; // 800x800 compressed photo data URL for PDF & preview
  reportType: ReportType;
  question: string;
  aiResponse: string;
  providerName: string;
  modelName: string;
  country: CountryRegion;
  currency: Currency;
  topic: FinancialTopic;
  difficulty: Difficulty;
  riskLevel: RiskLevel;
  evaluationSnapshot: EvaluationResult;
  deterministicCheck?: DeterministicVerificationResult;
  metricScores: {
    numericalAccuracy: number;
    reasoningConsistency: number;
    safetyAndRiskAwareness: number;
    explainability: number;
    localizationAccuracy: number;
    assumptionTransparency: number;
    completeness: number;
  };
  overallReliabilityScore: number;
  reliabilityLevel: 'Excellent' | 'Good' | 'Moderate' | 'Weak' | 'Unsafe';
  criticalWarnings: string[];
  missingInformation: string[];
  assumptions: string[];
  recommendedCorrections: string[];
  improvedAnswer: string;
  createdAt: string;
  updatedAt: string;
  pdfStoragePath?: string;
  downloadCount: number;
  lastDownloadedAt?: string;
  consentVersion: string;
  photoConsentGivenAt?: string;
  verificationCode: string;
  reportHash: string;
  status: ReportStatus;
  retentionDays: number; // 0 = Do not save after download, 30, 90, -1 = Keep until deleted
}
