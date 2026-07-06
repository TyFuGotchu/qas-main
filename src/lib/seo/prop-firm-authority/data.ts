export const PILLAR_PLAYBOOK_SLUG = "ultimate-7-day-prop-firm-playbook";
export const PILLAR_MATH_SLUG = "mathematical-prop-firm-model";

export const PILLAR_PATHS = {
  playbook: `/guides/pillar/${PILLAR_PLAYBOOK_SLUG}`,
  math: `/guides/pillar/${PILLAR_MATH_SLUG}`,
} as const;

export interface AuthorityPropFirm {
  slug: string;
  name: string;
  shortName: string;
  profitTarget: string;
  maxDrawdown: string;
  dailyLossLimit: string;
  consistencyRule: string;
  consistencyPercent: number;
  drawdownType: "trailing" | "static" | "eod";
}

export interface AccountSize {
  slug: string;
  label: string;
  notional: number;
  typicalProfitTargetPct: number;
  typicalDailyLossPct: number;
  typicalMaxLossPct: number;
}

export type ClusterTopicSlug =
  | "pass-in-7-days"
  | "consistency-rule-math"
  | "daily-drawdown"
  | "consistency-score"
  | "drawdown-type"
  | "profit-target"
  | "monte-carlo-risk";

export type ClusterFormat = "guide" | "explainer" | "faq" | "step-by-step" | "listicle";

export const ACCOUNT_SIZES: AccountSize[] = [
  {
    slug: "25k",
    label: "$25K",
    notional: 25_000,
    typicalProfitTargetPct: 8,
    typicalDailyLossPct: 5,
    typicalMaxLossPct: 10,
  },
  {
    slug: "50k",
    label: "$50K",
    notional: 50_000,
    typicalProfitTargetPct: 8,
    typicalDailyLossPct: 5,
    typicalMaxLossPct: 10,
  },
  {
    slug: "100k",
    label: "$100K",
    notional: 100_000,
    typicalProfitTargetPct: 10,
    typicalDailyLossPct: 5,
    typicalMaxLossPct: 10,
  },
  {
    slug: "200k",
    label: "$200K",
    notional: 200_000,
    typicalProfitTargetPct: 10,
    typicalDailyLossPct: 5,
    typicalMaxLossPct: 10,
  },
];

/** Focus firms for authority clusters — exact long-tail targets */
export const AUTHORITY_PROP_FIRMS: AuthorityPropFirm[] = [
  {
    slug: "ftmo",
    name: "FTMO",
    shortName: "FTMO",
    profitTarget: "10% Phase 1, 5% Phase 2",
    maxDrawdown: "10% maximum account loss",
    dailyLossLimit: "5% daily loss limit",
    consistencyRule: "Best day cannot exceed 20% of total profit toward target",
    consistencyPercent: 20,
    drawdownType: "static",
  },
  {
    slug: "fundednext",
    name: "FundedNext",
    shortName: "FundedNext",
    profitTarget: "8–10% depending on Stellar vs Evaluation plan",
    maxDrawdown: "Maximum loss limit — static or trailing by plan",
    dailyLossLimit: "Daily loss limits on Stellar and Evaluation plans",
    consistencyRule: "Consistency score on funded withdrawals — best day capped",
    consistencyPercent: 20,
    drawdownType: "trailing",
  },
  {
    slug: "apex",
    name: "Apex Trader Funding",
    shortName: "Apex",
    profitTarget: "Varies by account size (e.g. $3,000 on $50K Rithmic)",
    maxDrawdown: "Trailing drawdown on Rithmic evaluation plans",
    dailyLossLimit: "No hard daily cap on most evaluation plans",
    consistencyRule: "30% consistency rule on funded payouts",
    consistencyPercent: 30,
    drawdownType: "trailing",
  },
  {
    slug: "ftuk",
    name: "FTUK",
    shortName: "FTUK",
    profitTarget: "10% single-phase challenge target",
    maxDrawdown: "10% maximum drawdown",
    dailyLossLimit: "5% daily loss limit",
    consistencyRule: "Consistency requirements on funded account payouts",
    consistencyPercent: 20,
    drawdownType: "static",
  },
  {
    slug: "topstep",
    name: "Topstep",
    shortName: "Topstep",
    profitTarget: "Varies by Trading Combine size",
    maxDrawdown: "Trailing Maximum Loss Limit",
    dailyLossLimit: "Daily loss limits on Express Funded accounts",
    consistencyRule: "Consistency Target — cap best-day share of total profit",
    consistencyPercent: 20,
    drawdownType: "trailing",
  },
  {
    slug: "the5ers",
    name: "The5ers",
    shortName: "The5ers",
    profitTarget: "Varies by bootcamp and high-stakes program",
    maxDrawdown: "Maximum drawdown per program tier",
    dailyLossLimit: "Program-specific daily loss caps",
    consistencyRule: "Consistency requirements on profit splits",
    consistencyPercent: 20,
    drawdownType: "static",
  },
  {
    slug: "myfundedfx",
    name: "MyFundedFX",
    shortName: "MyFundedFX",
    profitTarget: "8–10% two-step challenge targets",
    maxDrawdown: "Overall max loss and daily drawdown rules",
    dailyLossLimit: "Daily drawdown limits on evaluation accounts",
    consistencyRule: "Best trading day caps on payout requests",
    consistencyPercent: 20,
    drawdownType: "trailing",
  },
  {
    slug: "e8-funding",
    name: "E8 Funding",
    shortName: "E8",
    profitTarget: "8% evaluation profit target (plan dependent)",
    maxDrawdown: "Trailing or static max drawdown by account",
    dailyLossLimit: "Daily loss limits on most challenge tiers",
    consistencyRule: "Consistency rule on funded payout eligibility",
    consistencyPercent: 20,
    drawdownType: "trailing",
  },
  {
    slug: "lucid-trading",
    name: "Lucid Trading",
    shortName: "Lucid",
    profitTarget: "Varies by LucidDirect and evaluation plans",
    maxDrawdown: "End-of-day or trailing drawdown by product",
    dailyLossLimit: "Daily loss limits on evaluation paths",
    consistencyRule: "Payout consistency thresholds on funded accounts",
    consistencyPercent: 20,
    drawdownType: "trailing",
  },
  {
    slug: "take-profit-trader",
    name: "Take Profit Trader",
    shortName: "TPT",
    profitTarget: "Varies by test account size",
    maxDrawdown: "Maximum trailing drawdown on funded plans",
    dailyLossLimit: "Daily loss limits on evaluation accounts",
    consistencyRule: "Consistency caps on profit withdrawals",
    consistencyPercent: 20,
    drawdownType: "trailing",
  },
  {
    slug: "tradeify",
    name: "Tradeify",
    shortName: "Tradeify",
    profitTarget: "Varies by evaluation and funded plan",
    maxDrawdown: "Trailing drawdown on funded accounts",
    dailyLossLimit: "Daily loss limits on evaluation tiers",
    consistencyRule: "Consistency requirements on payouts",
    consistencyPercent: 20,
    drawdownType: "trailing",
  },
  {
    slug: "alpha-futures",
    name: "Alpha Futures",
    shortName: "Alpha Futures",
    profitTarget: "Program-specific profit targets",
    maxDrawdown: "Maximum loss limits by account size",
    dailyLossLimit: "Daily loss caps during evaluation",
    consistencyRule: "Payout consistency thresholds",
    consistencyPercent: 20,
    drawdownType: "trailing",
  },
  {
    slug: "maven-trading",
    name: "Maven Trading",
    shortName: "Maven",
    profitTarget: "Varies by challenge tier",
    maxDrawdown: "Static or trailing max drawdown",
    dailyLossLimit: "Daily loss limits on evaluation",
    consistencyRule: "Best-day consistency on withdrawals",
    consistencyPercent: 20,
    drawdownType: "static",
  },
  {
    slug: "bulenox",
    name: "Bulenox",
    shortName: "Bulenox",
    profitTarget: "Evaluation profit targets by plan",
    maxDrawdown: "Trailing drawdown on funded accounts",
    dailyLossLimit: "Daily loss limits during challenges",
    consistencyRule: "Consistency rules on profit splits",
    consistencyPercent: 20,
    drawdownType: "trailing",
  },
  {
    slug: "surge-trader",
    name: "Surge Trader",
    shortName: "Surge",
    profitTarget: "Varies by audition and funded program",
    maxDrawdown: "Maximum account drawdown limits",
    dailyLossLimit: "Daily loss limits on evaluation",
    consistencyRule: "Consistency caps on funded payouts",
    consistencyPercent: 20,
    drawdownType: "trailing",
  },
];

export const CLUSTER_TOPICS: {
  slug: ClusterTopicSlug;
  format: ClusterFormat;
  needsSize: boolean;
  toolSlug: string;
}[] = [
  { slug: "pass-in-7-days", format: "guide", needsSize: true, toolSlug: "prop-survival" },
  { slug: "consistency-rule-math", format: "explainer", needsSize: false, toolSlug: "prop-survival" },
  { slug: "daily-drawdown", format: "step-by-step", needsSize: true, toolSlug: "risk-matrix" },
  { slug: "consistency-score", format: "faq", needsSize: false, toolSlug: "prop-survival" },
  { slug: "drawdown-type", format: "explainer", needsSize: false, toolSlug: "prop-survival" },
  { slug: "profit-target", format: "guide", needsSize: true, toolSlug: "execution-protocol" },
  { slug: "monte-carlo-risk", format: "step-by-step", needsSize: true, toolSlug: "prop-survival" },
];

export function getAuthorityFirm(slug: string): AuthorityPropFirm | undefined {
  return AUTHORITY_PROP_FIRMS.find((f) => f.slug === slug);
}

export function getAccountSize(slug: string): AccountSize | undefined {
  return ACCOUNT_SIZES.find((s) => s.slug === slug);
}

export function profitTargetDollars(size: AccountSize): number {
  return Math.round((size.notional * size.typicalProfitTargetPct) / 100);
}

export function dailyLossDollars(size: AccountSize): number {
  return Math.round((size.notional * size.typicalDailyLossPct) / 100);
}

export function maxDrawdownDollars(size: AccountSize): number {
  return Math.round((size.notional * size.typicalMaxLossPct) / 100);
}