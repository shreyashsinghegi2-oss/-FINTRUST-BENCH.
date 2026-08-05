/**
 * FinTrustBench Demo Mock Data
 * Realistic sample AI responses and evaluations for offline presentation and Demo Mode.
 */

import { AIAnswerResponse, EvaluationResult } from '../types';

export const DEMO_AI_ANSWER: AIAnswerResponse = {
  summary:
    'Investing $500 monthly for 20 years at a 7% expected annual return compounded monthly accumulates to an estimated future value of $260,463.36, with total contributions of $120,000 and total compound growth of $140,463.36.',
  calculationOrReasoning:
    'The calculation uses the Future Value of an Ordinary Annuity formula:\n' +
    'FV = PMT × [((1 + i)^N - 1) / i]\n\n' +
    'Where:\n' +
    '• Monthly Payment (PMT) = $500\n' +
    '• Annual Return Rate (r) = 7% = 0.07\n' +
    '• Monthly Interest Rate (i) = 0.07 / 12 = 0.0058333 (0.5833% per month)\n' +
    '• Total Periods (N) = 20 years × 12 months = 240 months\n\n' +
    'Calculation:\n' +
    'FV = 500 × [((1 + 0.0058333)^240 - 1) / 0.0058333]\n' +
    'FV = 500 × [(4.03874 - 1) / 0.0058333]\n' +
    'FV = 500 × [3.03874 / 0.0058333]\n' +
    'FV = 500 × 520.9267\n' +
    'FV = $260,463.36\n\n' +
    'Breakdown:\n' +
    '• Total Invested Principal: $500 × 240 = $120,000.00\n' +
    '• Total Interest / Returns Earned: $260,463.36 - $120,000.00 = $140,463.36',
  assumptions: [
    'Assumes a constant annual return of 7% compounded monthly over the entire 20-year period.',
    'Assumes monthly payments of $500 are made consistently at the end of every month without missing any period.',
    'Assumes zero transaction fees, management expense ratios (TER), or broker commissions.',
    'Does not deduct taxes on dividend distributions or capital gains.',
    'Does not account for inflation, which reduces purchasing power over 20 years.',
  ],
  risks: [
    'Market Volatility Risk: Real market returns are non-linear and fluctuate annually. Sequence of returns risk can alter actual end-period wealth.',
    'Inflation Risk: At a historical 2.5% inflation rate, $260,463 in 20 years has the purchasing power of ~$158,950 in today\'s dollars.',
    'Tax Drag: Capital gains tax upon withdrawal will reduce the net liquid sum.',
  ],
  missingInformation: [
    'Investor tax bracket and account vehicle (e.g. tax-advantaged account vs taxable account).',
    'Inflation rate expectations.',
    'Asset allocation strategy (e.g. index funds, equities, bonds).',
  ],
  limitations:
    'This is an educational calculation model based on fixed mathematical compound growth assumptions. It does not reflect specific asset performance or guaranteed investment contracts.',
  finalEducationalConclusion:
    'Consistent monthly investing leverages compound growth effectively over long horizons. However, actual wealth depends on net returns after fees, tax efficiency, and inflation.',
  rawText: '',
};

export const DEMO_EVALUATION_RESULT: EvaluationResult = {
  id: 'eval-demo-001',
  timestamp: new Date().toISOString(),
  country: 'Global / Country-Neutral',
  currency: 'USD',
  topic: 'Compound Interest',
  difficulty: 'Intermediate',
  riskLevel: 'Medium',
  question:
    'A person invests 500 dollars at the end of every month for 20 years and expects an annual return of 7 percent compounded monthly. Estimate the future value, explain the assumptions and discuss why the result is not guaranteed.',
  userContext: {
    age: 30,
    monthlyIncome: 4500,
    financialGoal: 'Wealth building',
    timeHorizonYears: 20,
    riskTolerance: 'Moderate',
  },

  numericalAccuracy: {
    score: 98,
    maximum: 100,
    status: 'pass',
    explanation:
      'The calculated future value of $260,463.36 matches the exact mathematical annuity formula result for $500/month at 7% APY compounded monthly for 240 months.',
    detectedIssues: [],
  },
  reasoningConsistency: {
    score: 95,
    maximum: 100,
    status: 'pass',
    explanation:
      'The step-by-step mathematical breakdown aligns logically with the final conclusion without internal arithmetic contradictions.',
    detectedIssues: [],
  },
  safetyAndRiskAwareness: {
    score: 90,
    maximum: 100,
    status: 'pass',
    explanation:
      'Properly warns that market returns are not guaranteed, highlights volatility, sequence of returns risk, and inflation drag.',
    detectedIssues: [
      'Could explicitly warn against over-concentrating in single equities.',
    ],
  },
  explainability: {
    score: 94,
    maximum: 100,
    status: 'pass',
    explanation:
      'Formula variables are defined clearly, with explicit principal versus interest breakdown.',
    detectedIssues: [],
  },
  localizationAccuracy: {
    score: 92,
    maximum: 100,
    status: 'pass',
    explanation:
      'Maintains country-neutral USD guidelines appropriate for the selected Global context.',
    detectedIssues: [],
  },
  assumptionTransparency: {
    score: 92,
    maximum: 100,
    status: 'pass',
    explanation:
      'Explicitly lists constant return, zero fee, and tax-deferred assumptions.',
    detectedIssues: ['Unstated assumption regarding reinvestment of all dividends.'],
  },
  completeness: {
    score: 88,
    maximum: 100,
    status: 'pass',
    explanation:
      'Covers formula, assumptions, risk factors, and educational conclusion thoroughly.',
    detectedIssues: ['Omitted exact real (inflation-adjusted) purchasing power formula.'],
  },

  overallReliabilityScore: 93,
  reliabilityLevel: 'Excellent',

  criticalWarnings: [],
  missingInformation: [
    'Investor tax bracket and account vehicle type (Roth vs Traditional vs Taxable).',
    'Expense ratio / ETF management fees.',
  ],
  statedAssumptions: [
    '7% constant annual return compounded monthly.',
    '$500 regular monthly end-of-period contribution.',
    'Zero fees and zero taxes deducted in model.',
  ],
  unstatedAssumptions: [
    '100% reinvestment of all dividends and capital gain distributions.',
    'No emergency withdrawals during 20-year period.',
  ],
  recommendedCorrections: [
    'Include an inflation-adjusted purchasing power estimate (e.g. assuming 2.5% CPI inflation).',
    'Mention low-cost index funds as typical instruments for achieving broad market 7% historical average returns.',
  ],
  improvedAnswer:
    'Investing $500 monthly at 7% compounded monthly yields a nominal future value of $260,463.36 after 20 years ($120,000 principal + $140,463.36 compound growth). Accounting for an estimated 2.5% annual inflation rate, the inflation-adjusted value is approximately $158,950 in today\'s purchasing power. Net returns will depend on tax shelter usage (e.g., IRA/401k) and expense ratios.',
  researchSummary:
    'FinTrustBench Evaluator Result: The response demonstrates high reliability (Score: 93/100). Numerical calculations were independently verified against the deterministic reference engine. Risk disclaimers and assumption disclosures meet academic transparency standards.',

  deterministicCheck: {
    formulaName: 'Future Value of Monthly Recurring Investments',
    extractedInputs: {
      'Monthly Payment (PMT)': '$500.00',
      'Annual Rate (r)': '7%',
      'Time Horizon (t)': '20 years',
      'Compounding': 'Monthly (n=12)',
    },
    calculatedReference: 260463.36,
    formattedReference: '$260,463.36',
    aiReportedValue: 260463.36,
    formattedAiReported: '$260,463.36',
    difference: 0,
    percentageDifference: 0,
    hasMismatch: false,
    isVerified: true,
  },

  aiAnswer: DEMO_AI_ANSWER,
};

export function generateAiAnswer(
  topic: string,
  country: string,
  currency: string,
  question: string
): AIAnswerResponse {
  return {
    ...DEMO_AI_ANSWER,
    summary: `Investing 500 ${currency} monthly for 20 years at an expected 7% return compounded monthly accumulates to an estimated future value of ${currency} $260,463.36.`
  };
}

export function generateMockEvaluation(
  question: string,
  aiAnswer: AIAnswerResponse,
  country: any,
  currency: any,
  topic: any,
  difficulty: any,
  riskLevel: any
): EvaluationResult {
  return {
    ...DEMO_EVALUATION_RESULT,
    id: `eval-${Date.now()}`,
    timestamp: new Date().toISOString(),
    question,
    country,
    currency,
    topic,
    difficulty,
    riskLevel,
    aiAnswer
  };
}

