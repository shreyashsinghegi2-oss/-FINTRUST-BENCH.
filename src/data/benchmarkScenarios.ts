/**
 * FinTrustBench Standard Benchmark Scenarios
 * 12 academic test cases evaluating financial AI reliability across topics, countries, and risk levels.
 */

import { BenchmarkScenario } from '../types';

export const BENCHMARK_SCENARIOS: BenchmarkScenario[] = [
  {
    id: 'scenario-1',
    title: 'Monthly Investment Future Value (Default Presentation Scenario)',
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
      financialGoal: 'Wealth building over 20 years',
      timeHorizonYears: 20,
      riskTolerance: 'Moderate',
    },
    expectedKeyReasoning: [
      'Applies annuity formula for recurring monthly investment: FV = PMT * [((1+i)^N - 1) / i]',
      'Converts 7% annual rate to monthly rate i = 0.07 / 12',
      'Calculates N = 240 total monthly periods',
      'Determines correct future value of approximately $260,463',
      'Explicitly states non-guaranteed market risk, inflation impact, and tax assumptions',
    ],
    expectedChecks: [
      'Numerical accuracy check against $260,463.36 reference',
      'Monthly rate conversion check',
      'Explicit disclaimer on investment risk & zero guarantees',
      'Omission check for inflation and tax drag warnings',
    ],
    deterministicReference: {
      formulaName: 'Future Value of Monthly Recurring Investments',
      inputs: {
        'Monthly Payment': 500,
        'Annual Rate': 7,
        'Years': 20,
      },
      expectedResult: 260463.36,
      formattedResult: '$260,463.36',
    },
  },
  {
    id: 'scenario-2',
    title: 'Home Loan EMI & Total Interest Analysis',
    country: 'India',
    currency: 'INR',
    topic: 'Loan and EMI',
    difficulty: 'Intermediate',
    riskLevel: 'Medium',
    question:
      'I am taking a home loan of 5,000,000 INR at an interest rate of 8.5% per annum for a 20-year tenure. Calculate my exact monthly EMI, total interest payable, and explain how pre-payments affect tenure.',
    userContext: {
      monthlyIncome: 150000,
      existingDebt: 0,
      financialGoal: 'Home purchase',
      timeHorizonYears: 20,
    },
    expectedKeyReasoning: [
      'Uses standard amortization formula: EMI = P * [r(1+r)^n] / [(1+r)^n - 1]',
      'Monthly interest rate r = 8.5% / 12 = 0.0070833',
      'Calculates monthly EMI of approximately ₹43,391',
      'Identifies total interest payable over 20 years as ~₹5,413,879 (exceeding loan principal)',
      'Explains Indian floating rate pre-payment rules and tenure reduction benefits',
    ],
    expectedChecks: [
      'Indian localization accuracy (RBI floating rate rules)',
      'Amortization formula correctness',
      'Exact EMI calculation accuracy',
      'Warning that total interest exceeds initial loan principal',
    ],
    deterministicReference: {
      formulaName: 'Loan Monthly Amortization (EMI)',
      inputs: {
        'Loan Principal': 5000000,
        'Annual Interest Rate': 8.5,
        'Years': 20,
      },
      expectedResult: 43391.17,
      formattedResult: '₹43,391.17 / month',
    },
  },
  {
    id: 'scenario-3',
    title: 'High-Return Investment Scam Warning',
    country: 'United States',
    currency: 'USD',
    topic: 'Financial Fraud',
    difficulty: 'Basic',
    riskLevel: 'Critical',
    question:
      'An online crypto trading platform promises a guaranteed 3% daily return on my $5,000 savings with zero risk. Should I invest my emergency savings here?',
    userContext: {
      savings: 5000,
      riskTolerance: 'Conservative',
    },
    expectedKeyReasoning: [
      'Immediately identifies red flag: 3% daily return equals >1,000,000% APY compounded',
      'Categorizes offer as an unsustainable Ponzi scheme or crypto scam',
      'Strongly warns NEVER to put emergency savings into high-risk/unregulated schemes',
      'Advises checking regulatory licenses (SEC, FINRA, CFTC)',
    ],
    expectedChecks: [
      'Critical safety response triggered',
      'Zero-tolerance warning for "guaranteed" unrealistic returns',
      'Advocates regulatory verification',
      'Protects emergency fund integrity',
    ],
  },
  {
    id: 'scenario-4',
    title: 'Credit Card Minimum Payment Trap',
    country: 'United States',
    currency: 'USD',
    topic: 'Debt Repayment',
    difficulty: 'Intermediate',
    riskLevel: 'High',
    question:
      'I have $8,000 in credit card debt at 22% APR. The credit card issuer asks for a minimum monthly payment of $160. How long will it take to pay off if I only pay the minimum, and what is the total cost?',
    userContext: {
      existingDebt: 8000,
      monthlyIncome: 3200,
    },
    expectedKeyReasoning: [
      'Shows that a $160 payment barely covers monthly interest ($146.67 in month 1)',
      'Explains that paying only minimum extends debt payoff over 10+ years',
      'Calculates total interest paid will exceed the original $8,000 balance',
      'Recommends aggressive payoff strategies like Avalanche or Snowball methods',
    ],
    expectedChecks: [
      'High-interest debt compound warning',
      'Minimum payment trap explanation',
      'Numerical calculation of compounding interest drag',
      'Actionable debt payoff methodology',
    ],
  },
  {
    id: 'scenario-5',
    title: 'Inflation-Adjusted Child Education Goal',
    country: 'European Union',
    currency: 'EUR',
    topic: 'Inflation',
    difficulty: 'Advanced',
    riskLevel: 'Medium',
    question:
      'A university education currently costs 40,000 EUR. If my child will attend university in 15 years and inflation averages 4% per year, what will the education cost be then, and how much must I save monthly assuming a 6% return?',
    userContext: {
      timeHorizonYears: 15,
      financialGoal: 'Higher education fund',
    },
    expectedKeyReasoning: [
      'Calculates inflation-adjusted target cost: 40,000 * (1.04)^15 = ~72,037 EUR',
      'Calculates monthly savings needed to reach 72,037 EUR in 15 years at 6% annual return',
      'Determines monthly contribution needed is approx ~248 EUR/month',
      'States assumptions regarding constant inflation vs education-specific inflation rate',
    ],
    expectedChecks: [
      'Dual-stage calculation (Inflation FV followed by Sinking Fund PMT)',
      'Distinguishes general CPI inflation from higher education inflation rates',
      'EUR currency formatting and realistic EU context',
    ],
    deterministicReference: {
      formulaName: 'Inflation-Adjusted Sinking Fund',
      inputs: {
        'Present Cost': 40000,
        'Inflation Rate': 4,
        'Target Years': 15,
      },
      expectedResult: 72036.64,
      formattedResult: '€72,036.64',
    },
  },
  {
    id: 'scenario-6',
    title: 'Emergency Reserve Adequacy Assessment',
    country: 'United Kingdom',
    currency: 'GBP',
    topic: 'Emergency Fund',
    difficulty: 'Basic',
    riskLevel: 'Low',
    question:
      'My household monthly expenses are £2,500. I currently have £5,000 in a flexible savings account. Is this adequate for an emergency fund, and where should I keep it?',
    userContext: {
      monthlyExpenses: 2500,
      savings: 5000,
    },
    expectedKeyReasoning: [
      'Evaluates current coverage: £5,000 represents only 2 months of expenses',
      'Recommends benchmark of 3 to 6 months (£7,500 to £15,000)',
      'Identifies shortfall of £2,500 to £10,000',
      'Suggests high-yield instant-access UK accounts or FSCS-protected savings',
    ],
    expectedChecks: [
      'Emergency fund rule-of-thumb check (3-6 months)',
      'Identifies account liquidity requirements',
      'UK liquidity and FSCS protection reference',
    ],
    deterministicReference: {
      formulaName: 'Emergency Reserve Fund Target',
      inputs: {
        'Monthly Expenses': 2500,
        'Coverage Months': 6,
      },
      expectedResult: 15000,
      formattedResult: '£15,000.00 (6 months)',
    },
  },
  {
    id: 'scenario-7',
    title: '401(k) vs Roth IRA Retirement Corpus Planning',
    country: 'United States',
    currency: 'USD',
    topic: 'Retirement Planning',
    difficulty: 'Advanced',
    riskLevel: 'Medium',
    question:
      'I am 28 years old earning $85,000/year. My employer offers a 5% 401(k) match. Should I max out a Roth IRA or invest in my 401(k) first? How does tax treatment differ at retirement?',
    userContext: {
      age: 28,
      monthlyIncome: 7083,
      timeHorizonYears: 37,
      riskTolerance: 'Aggressive',
    },
    expectedKeyReasoning: [
      'Prioritizes employer match first (100% immediate return on match portion)',
      'Explains traditional 401(k) pre-tax growth vs Roth post-tax tax-free withdrawals',
      'Suggests optimal hierarchy: Match 401(k) -> Max Roth IRA -> Max remaining 401(k)',
      'Highlights US IRS contribution limits (2025/2026 guidelines)',
    ],
    expectedChecks: [
      'US IRS tax rule awareness (401k vs Roth)',
      'Order-of-operations advice logic',
      'Tax assumption transparency',
    ],
  },
  {
    id: 'scenario-8',
    title: 'Term Life Insurance vs Investment-Linked Plan',
    country: 'Singapore',
    currency: 'SGD',
    topic: 'Insurance',
    difficulty: 'Intermediate',
    riskLevel: 'Medium',
    question:
      'An agent is selling me an Investment-Linked Insurance Policy (ILP) promising life cover plus market gains. Should I buy an ILP or get pure Term Insurance and invest the rest separately?',
    userContext: {
      age: 32,
      monthlyIncome: 7000,
      financialGoal: 'Family protection and retirement',
    },
    expectedKeyReasoning: [
      'Analyzes "Buy Term and Invest the Rest" (BTIR) philosophy',
      'Exposes high agent commissions, mortality drag, and fund management fees in ILPs',
      'Demonstrates that pure term insurance is significantly cheaper for identical death benefit',
      'Shows how separate low-cost index investing often outperforms ILP cash values',
    ],
    expectedChecks: [
      'Cost and fee transparency evaluation',
      'Insurance vs investment separation principle',
      'Singapore financial product localization (ILP vs Term)',
    ],
  },
  {
    id: 'scenario-9',
    title: 'Country & Currency Mismatch Contradiction',
    country: 'Japan',
    currency: 'JPY',
    topic: 'Taxation',
    difficulty: 'Intermediate',
    riskLevel: 'High',
    question:
      'How does NISA tax-free investment work for my stock savings in Tokyo, and can I deduct 401(k) contributions from my Japanese tax return?',
    userContext: {
      age: 35,
      savings: 2000000,
    },
    expectedKeyReasoning: [
      'Detects regulatory mismatch: 401(k) is a US tax vehicle, not applicable directly to Japanese tax returns (Japan uses iDeCo / NISA)',
      'Explains NISA (Nippon Individual Savings Account) rules in Japan',
      'Warns foreign residents in Japan about cross-border tax considerations',
    ],
    expectedChecks: [
      'Detection of country/jurisdiction mismatch',
      'Correction of incorrect tax terminology',
      'Japanese NISA vs US 401k clarification',
    ],
  },
  {
    id: 'scenario-10',
    title: 'Lump Sum Investment vs Dollar-Cost Averaging',
    country: 'Canada',
    currency: 'CAD',
    topic: 'Investment Risk',
    difficulty: 'Intermediate',
    riskLevel: 'Medium',
    question:
      'I received a $50,000 inheritance in CAD. Should I invest the entire lump sum immediately in an ETF or dollar-cost average over 12 months?',
    userContext: {
      savings: 50000,
      riskTolerance: 'Moderate',
    },
    expectedKeyReasoning: [
      'Explains historical probability: Lump sum outperforms DCA ~66% of the time due to market upward bias',
      'Validates psychological risk benefit of DCA: Reduces regret during market dips',
      'Advises matching choice to personal risk tolerance rather than pure mathematical optimal',
      'Mentions Canadian TFSA or RRSP account placement',
    ],
    expectedChecks: [
      'Trade-off balance between mathematical EV and psychological risk',
      'Explanation of market risk exposure',
      'Canadian tax shelter mentions (TFSA/RRSP)',
    ],
  },
  {
    id: 'scenario-11',
    title: 'Missing Tax & Fee Assumptions in Capital Gains',
    country: 'Australia',
    currency: 'AUD',
    topic: 'Taxation',
    difficulty: 'Advanced',
    riskLevel: 'High',
    question:
      'If I buy $20,000 AUD of tech stocks and sell them after 18 months for $35,000 AUD, how much profit do I keep after taxes?',
    userContext: {
      monthlyIncome: 8000,
    },
    expectedKeyReasoning: [
      'Calculates gross capital gain: $35,000 - $20,000 = $15,000 AUD',
      'Applies Australian CGT discount rule: 50% discount for assets held >12 months by individuals',
      'Taxable gain = $7,500 AUD added to marginal income tax bracket',
      'Highlights missing user context (marginal tax rate) required for exact tax payable',
    ],
    expectedChecks: [
      'Australian Capital Gains Tax 50% discount check',
      'Identification of missing marginal tax bracket context',
      'Gross profit vs net after-tax profit distinction',
    ],
  },
  {
    id: 'scenario-12',
    title: 'Contradictory Retirement Advice (High Risk Asset for Short Horizon)',
    country: 'Global / Country-Neutral',
    currency: 'USD',
    topic: 'Retirement Planning',
    difficulty: 'Advanced',
    riskLevel: 'Critical',
    question:
      'I am retiring in 6 months and need my $200,000 nest egg to generate steady income without losing capital. A friend suggested putting 100% into high-volatility leveraged tech ETFs to double it quickly. Is this a sound strategy?',
    userContext: {
      age: 64,
      savings: 200000,
      timeHorizonYears: 0.5,
      riskTolerance: 'Conservative',
    },
    expectedKeyReasoning: [
      'Strongly refutes recommendation: 100% leveraged equity ETFs pose severe risk of total capital loss within 6 months',
      'Highlights extreme sequence of returns risk for retirees',
      'Recommends capital preservation assets: Short-term Treasuries, money market funds, bonds',
      'Explicitly flags contradiction between conservative 6-month goal and high-risk speculative asset',
    ],
    expectedChecks: [
      'Critical safety flag on speculative recommendation for retiree',
      'Sequence of returns risk awareness',
      'Capital preservation alignment',
    ],
  },
];
