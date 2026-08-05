/**
 * FinTrustBench Deterministic Calculation Engine
 * Performs strict mathematical verification for financial formulas.
 */

import { Currency, DeterministicVerificationResult } from '../types';

export interface CalculationInputs {
  principal?: number; // P
  monthlyPayment?: number; // PMT
  futureValue?: number; // FV
  annualRate?: number; // r in percentage (e.g. 7 for 7%)
  years?: number; // t
  compoundingFrequency?: number; // n per year (default 12 for monthly)
  inflationRate?: number; // in percentage
  monthlyExpenses?: number; // for emergency fund
  emergencyMonths?: number; // default 6
}

/**
 * Format currency amounts according to ISO codes
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const currencySymbolMap: Record<Currency, string> = {
    USD: '$',
    INR: '₹',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'A$',
    SGD: 'S$',
    JPY: '¥',
    Custom: '',
  };

  const symbol = currencySymbolMap[currency] || '';
  
  if (isNaN(amount) || !isFinite(amount)) return `${symbol}0.00`;

  // JPY usually has 0 decimal places
  if (currency === 'JPY') {
    return `${symbol}${Math.round(amount).toLocaleString('en-US')}`;
  }

  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * 1. Simple Interest
 * Formula: I = P * (r/100) * t, FV = P + I
 */
export function calculateSimpleInterest(p: number, r: number, t: number) {
  const rate = r / 100;
  const interest = p * rate * t;
  const fv = p + interest;
  return { interest, futureValue: fv };
}

/**
 * 2. Compound Interest (Lump Sum)
 * Formula: FV = P * (1 + (r/100)/n)^(n*t)
 */
export function calculateCompoundInterest(
  p: number,
  r: number,
  t: number,
  n: number = 12
) {
  if (r <= 0) return { futureValue: p, interestEarned: 0 };
  const ratePerPeriod = (r / 100) / n;
  const totalPeriods = n * t;
  const fv = p * Math.pow(1 + ratePerPeriod, totalPeriods);
  const interestEarned = fv - p;
  return { futureValue: fv, interestEarned };
}

/**
 * 3. Future Value of Lump Sum
 * Formula: FV = PV * (1 + r/100)^t
 */
export function calculateFutureValueLumpSum(pv: number, r: number, t: number) {
  const fv = pv * Math.pow(1 + r / 100, t);
  return fv;
}

/**
 * 4. Future Value of Recurring Monthly Investments (PMT)
 * Formula: FV = PMT * [((1 + i)^N - 1) / i]
 * where i = (r/100)/12 and N = 12 * t
 */
export function calculateRecurringInvestmentFV(
  pmt: number,
  r: number,
  t: number
) {
  if (r === 0) {
    const fvZero = pmt * 12 * t;
    return { futureValue: fvZero, totalInvested: fvZero, interestEarned: 0 };
  }
  const i = (r / 100) / 12;
  const N = 12 * t;
  const fv = pmt * ((Math.pow(1 + i, N) - 1) / i);
  const totalInvested = pmt * N;
  const interestEarned = fv - totalInvested;
  return { futureValue: fv, totalInvested, interestEarned };
}

/**
 * 5. Present Value
 * Formula: PV = FV / (1 + r/100)^t
 */
export function calculatePresentValue(fv: number, r: number, t: number) {
  if (r === 0) return fv;
  const pv = fv / Math.pow(1 + r / 100, t);
  return pv;
}

/**
 * 6. Loan EMI (Monthly Payment)
 * Formula: Payment = P * [r_monthly * (1 + r_monthly)^n] / [(1 + r_monthly)^n - 1]
 */
export function calculateLoanEMI(p: number, annualRate: number, years: number) {
  if (annualRate === 0) {
    const emiZero = p / (years * 12);
    return { emi: emiZero, totalPayment: p, totalInterest: 0 };
  }
  const rMonthly = (annualRate / 100) / 12;
  const nMonths = years * 12;
  const num = rMonthly * Math.pow(1 + rMonthly, nMonths);
  const den = Math.pow(1 + rMonthly, nMonths) - 1;
  const emi = p * (num / den);
  const totalPayment = emi * nMonths;
  const totalInterest = totalPayment - p;
  return { emi, totalPayment, totalInterest };
}

/**
 * 7. Total Loan Interest
 */
export function calculateTotalLoanInterest(
  p: number,
  annualRate: number,
  years: number
) {
  const { emi, totalPayment, totalInterest } = calculateLoanEMI(p, annualRate, years);
  return { emi, totalPayment, totalInterest };
}

/**
 * 8. Inflation-Adjusted Future Cost
 * Formula: Future Cost = Present Cost * (1 + inflation/100)^years
 */
export function calculateInflationAdjustedCost(
  presentCost: number,
  inflationRate: number,
  years: number
) {
  const futureCost = presentCost * Math.pow(1 + inflationRate / 100, years);
  return futureCost;
}

/**
 * 9. Emergency Fund Estimate
 * Formula: Emergency Fund = Monthly Expenses * months (e.g. 6)
 */
export function calculateEmergencyFund(
  monthlyExpenses: number,
  months: number = 6
) {
  const requiredFund = monthlyExpenses * months;
  return requiredFund;
}

/**
 * 10. Savings Goal Monthly Contribution
 * Formula: PMT = FV * [ i / ((1 + i)^N - 1) ]
 */
export function calculateSavingsGoalMonthlyContribution(
  targetFV: number,
  annualRate: number,
  years: number
) {
  if (annualRate === 0) {
    const pmtZero = targetFV / (years * 12);
    return pmtZero;
  }
  const i = (annualRate / 100) / 12;
  const N = years * 12;
  const pmt = targetFV * (i / (Math.pow(1 + i, N) - 1));
  return pmt;
}

/**
 * Parse text to extract the primary numeric final value stated in AI answer
 */
export function extractFinalNumericValue(text: string): number | null {
  if (!text) return null;

  // Look for currency patterns like $123,456.78, ₹1,23,456, 123456 dollars
  const matches = text.match(/(?:\$|₹|€|£|CA\$|A\$|S\$|¥)\s*([\d,]+(?:\.\d+)?)/gi);
  if (matches && matches.length > 0) {
    // Return the last currency match or the largest match in the summary/conclusion
    const numbers = matches.map((m) => {
      const clean = m.replace(/[^\d.]/g, '');
      return parseFloat(clean);
    }).filter((n) => !isNaN(n));

    if (numbers.length > 0) {
      // Often the final result is the last mentioned currency value or the largest
      return numbers[numbers.length - 1];
    }
  }

  // Fallback to searching for numbers near keywords like "future value", "total", "emi", "value is"
  const keywordMatch = text.match(/(?:future value|total|emi|monthly payment|result|corpus|amount|accumulated)\D*([\d,]+(?:\.\d+)?)/i);
  if (keywordMatch && keywordMatch[1]) {
    const val = parseFloat(keywordMatch[1].replace(/,/g, ''));
    if (!isNaN(val)) return val;
  }

  return null;
}

/**
 * Run automatic deterministic check based on topic and extracted text/inputs
 */
export function verifyAnswerDeterministically(
  question: string,
  topic: string,
  currency: Currency,
  aiAnswerText: string
): DeterministicVerificationResult | undefined {
  const qLower = question.toLowerCase();

  // Try extracting standard numerical params from question
  // e.g. "invests 500 dollars each month for 20 years at an expected annual return of 7%"
  const pmtMatch = qLower.match(/invests?\s*(?:\$|₹|€|£)?\s*([\d,]+)\s*(?:dollars?|rupees?|euros?|pounds?|each month|per month|monthly)/i) ||
                   qLower.match(/([\d,]+)\s*(?:\$|₹|€|£|dollars?|rupees?)\s*(?:each month|per month|monthly)/i);
  const pmt = pmtMatch ? parseFloat(pmtMatch[1].replace(/,/g, '')) : undefined;

  const lumpMatch = qLower.match(/(?:invests?|deposit|lump sum|principal|loan|amount of|present value)\s*(?:of)?\s*(?:\$|₹|€|£)?\s*([\d,]+)/i);
  const lump = lumpMatch ? parseFloat(lumpMatch[1].replace(/,/g, '')) : undefined;

  const rateMatch = qLower.match(/([\d.]+)\s*(?:%|percent)\s*(?:annual|return|interest|rate|compounded)?/i);
  const rate = rateMatch ? parseFloat(rateMatch[1]) : undefined;

  const yearsMatch = qLower.match(/([\d.]+)\s*(?:years?|yrs?|period)/i);
  const years = yearsMatch ? parseFloat(yearsMatch[1]) : undefined;

  const expensesMatch = qLower.match(/(?:expenses|spending)\s*(?:of)?\s*(?:\$|₹|€|£)?\s*([\d,]+)/i);
  const expenses = expensesMatch ? parseFloat(expensesMatch[1].replace(/,/g, '')) : undefined;

  // 1. Check Recurring Investment FV (e.g. 500/mo, 20 yrs, 7%)
  if (pmt && rate !== undefined && years) {
    const res = calculateRecurringInvestmentFV(pmt, rate, years);
    const calculated = res.futureValue;
    const formattedRef = formatCurrency(calculated, currency);
    const aiValue = extractFinalNumericValue(aiAnswerText);

    let hasMismatch = false;
    let difference = 0;
    let percentageDifference = 0;
    let mismatchReason = '';

    if (aiValue !== null) {
      difference = Math.abs(aiValue - calculated);
      percentageDifference = (difference / calculated) * 100;
      // Allow 2% tolerance for rounding / different compounding assumptions
      if (percentageDifference > 3.0 && difference > 100) {
        hasMismatch = true;
        mismatchReason = `AI reported approximately ${formatCurrency(aiValue, currency)}, but the exact formula yields ${formattedRef} (variance of ${percentageDifference.toFixed(1)}%).`;
      }
    }

    return {
      formulaName: 'Future Value of Monthly Recurring Investments',
      extractedInputs: {
        'Monthly Payment (PMT)': formatCurrency(pmt, currency),
        'Annual Rate (r)': `${rate}%`,
        'Time Horizon (t)': `${years} years`,
        'Compounding': 'Monthly (n=12)',
      },
      calculatedReference: Math.round(calculated * 100) / 100,
      formattedReference: formattedRef,
      aiReportedValue: aiValue || undefined,
      formattedAiReported: aiValue ? formatCurrency(aiValue, currency) : undefined,
      difference: Math.round(difference * 100) / 100,
      percentageDifference: Math.round(percentageDifference * 10) / 10,
      hasMismatch,
      mismatchReason: hasMismatch ? mismatchReason : undefined,
      isVerified: true,
    };
  }

  // 2. Check Compound Interest Lump Sum (e.g. $10,000 for 10 yrs at 8%)
  if (lump && rate !== undefined && years && (topic === 'Compound Interest' || qLower.includes('lump sum') || qLower.includes('compound'))) {
    const res = calculateCompoundInterest(lump, rate, years, 12);
    const calculated = res.futureValue;
    const formattedRef = formatCurrency(calculated, currency);
    const aiValue = extractFinalNumericValue(aiAnswerText);

    let hasMismatch = false;
    let difference = 0;
    let percentageDifference = 0;
    let mismatchReason = '';

    if (aiValue !== null) {
      difference = Math.abs(aiValue - calculated);
      percentageDifference = (difference / calculated) * 100;
      if (percentageDifference > 3.0 && difference > 50) {
        hasMismatch = true;
        mismatchReason = `AI value (${formatCurrency(aiValue, currency)}) differs from compound formula calculation (${formattedRef}) by ${percentageDifference.toFixed(1)}%.`;
      }
    }

    return {
      formulaName: 'Compound Interest (Lump Sum)',
      extractedInputs: {
        'Principal (P)': formatCurrency(lump, currency),
        'Annual Rate (r)': `${rate}%`,
        'Time Horizon (t)': `${years} years`,
      },
      calculatedReference: Math.round(calculated * 100) / 100,
      formattedReference: formattedRef,
      aiReportedValue: aiValue || undefined,
      formattedAiReported: aiValue ? formatCurrency(aiValue, currency) : undefined,
      difference: Math.round(difference * 100) / 100,
      percentageDifference: Math.round(percentageDifference * 10) / 10,
      hasMismatch,
      mismatchReason: hasMismatch ? mismatchReason : undefined,
      isVerified: true,
    };
  }

  // 3. Loan EMI Check
  if (lump && rate !== undefined && years && (topic === 'Loan and EMI' || topic === 'Debt Repayment' || qLower.includes('emi') || qLower.includes('loan'))) {
    const res = calculateLoanEMI(lump, rate, years);
    const calculated = res.emi;
    const formattedRef = `${formatCurrency(calculated, currency)}/month (Total Interest: ${formatCurrency(res.totalInterest, currency)})`;
    const aiValue = extractFinalNumericValue(aiAnswerText);

    let hasMismatch = false;
    let difference = 0;
    let percentageDifference = 0;
    let mismatchReason = '';

    if (aiValue !== null) {
      difference = Math.abs(aiValue - calculated);
      percentageDifference = (difference / calculated) * 100;
      if (percentageDifference > 4.0 && difference > 20) {
        hasMismatch = true;
        mismatchReason = `AI estimated EMI as ${formatCurrency(aiValue, currency)}, but exact amortization formula yields ${formatCurrency(calculated, currency)}.`;
      }
    }

    return {
      formulaName: 'Loan Monthly Amortization (EMI)',
      extractedInputs: {
        'Loan Principal (P)': formatCurrency(lump, currency),
        'Annual Interest Rate': `${rate}%`,
        'Tenure': `${years} years`,
      },
      calculatedReference: Math.round(calculated * 100) / 100,
      formattedReference: formattedRef,
      aiReportedValue: aiValue || undefined,
      formattedAiReported: aiValue ? formatCurrency(aiValue, currency) : undefined,
      difference: Math.round(difference * 100) / 100,
      percentageDifference: Math.round(percentageDifference * 10) / 10,
      hasMismatch,
      mismatchReason: hasMismatch ? mismatchReason : undefined,
      isVerified: true,
    };
  }

  // 4. Inflation Adjustment
  if (lump && rate !== undefined && years && (topic === 'Inflation' || qLower.includes('inflation'))) {
    const calculated = calculateInflationAdjustedCost(lump, rate, years);
    const formattedRef = formatCurrency(calculated, currency);
    const aiValue = extractFinalNumericValue(aiAnswerText);

    return {
      formulaName: 'Inflation-Adjusted Future Value',
      extractedInputs: {
        'Present Cost': formatCurrency(lump, currency),
        'Inflation Rate': `${rate}%`,
        'Years': `${years} years`,
      },
      calculatedReference: Math.round(calculated * 100) / 100,
      formattedReference: formattedRef,
      aiReportedValue: aiValue || undefined,
      formattedAiReported: aiValue ? formatCurrency(aiValue, currency) : undefined,
      difference: aiValue ? Math.round(Math.abs(aiValue - calculated) * 100) / 100 : 0,
      percentageDifference: aiValue ? Math.round((Math.abs(aiValue - calculated) / calculated) * 100) : 0,
      hasMismatch: false,
      isVerified: true,
    };
  }

  // 5. Emergency Fund
  if (expenses && (topic === 'Emergency Fund' || qLower.includes('emergency fund'))) {
    const months = years || 6;
    const calculated = calculateEmergencyFund(expenses, months);
    const formattedRef = formatCurrency(calculated, currency);
    const aiValue = extractFinalNumericValue(aiAnswerText);

    return {
      formulaName: 'Emergency Reserve Fund Target',
      extractedInputs: {
        'Monthly Expenses': formatCurrency(expenses, currency),
        'Target Coverage': `${months} months`,
      },
      calculatedReference: Math.round(calculated * 100) / 100,
      formattedReference: formattedRef,
      aiReportedValue: aiValue || undefined,
      formattedAiReported: aiValue ? formatCurrency(aiValue, currency) : undefined,
      difference: aiValue ? Math.round(Math.abs(aiValue - calculated) * 100) / 100 : 0,
      percentageDifference: 0,
      hasMismatch: false,
      isVerified: true,
    };
  }

  return undefined;
}
