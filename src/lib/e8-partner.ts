/**
 * Exclusive E8 Markets partnership.
 * Do not list competing prop firms as recommendations.
 * Do not invent live referral URLs, discount codes, or bundle checkouts.
 */

export const E8_FIRM_NAME = "E8 Markets";
export const E8_PUBLIC_PATH = "/e8";
export const E8_DASHBOARD_PATH = "/dashboard/e8";
export const E8_ALT_PUBLIC_PATH = "/e8-execution-center";

export const E8_POSITIONING = "Quicksilver is a TradeLocker desk for E8 Markets.";

export const E8_HERO_SENTENCE =
  "Quicksilver is a TradeLocker desk for E8 Markets — hard equity-stop and the Rule Desk are built to flatten before E8’s daily or max drawdown can tag the account.";

export const HARD_FLAT_RECOMMENDATION = {
  title: "Recommendation",
  lead: "Always ARM Hard Equity-Stop at least $100–$200 away from E8’s actual drawdown limit.",
  buffer:
    "That buffer is for spread and slippage. The floor should trip before E8’s rule does.",
  caveat: "This is a planning recommendation, not a guarantee.",
  disclaimer:
    "Educational tools only. High risk. No guaranteed pass. Official rules are set by E8 Markets.",
} as const;

export const E8_PARTNER_LINE = "Official E8 Markets Partner";
export const E8_BAR_LINE =
  "E8 Execution Center — Challenges, Rules, Direct Signup";
export const E8_EXCLUSIVE_LINE =
  "E8 Markets is Quicksilver’s exclusive recommended prop firm.";

export const E8_COMPLIANCE = {
  educational: "Educational tools only.",
  highRisk:
    "Trading and prop evaluations are high risk. You can lose the evaluation fee and/or trading capital.",
  noGuarantee:
    "Quicksilver does not guarantee a pass, payout, or funded account.",
  officialRules:
    "Official account rules are set by E8 Markets. Always follow the current terms on E8’s site.",
  bot: "Optional Quant Protocol is operator-supervised, TradeLocker Desktop only, and not set-and-forget. Bot not included in free trial.",
} as const;

export const E8_COMPLIANCE_BLOCK = [
  E8_COMPLIANCE.educational,
  E8_COMPLIANCE.highRisk,
  E8_COMPLIANCE.noGuarantee,
  E8_COMPLIANCE.officialRules,
  E8_COMPLIANCE.bot,
].join(" ");

/** Backend keys only — never render these strings in customer UI. */
export const E8_PLACEHOLDERS = {
  referralLink: "E8_REFERRAL_LINK",
  dailyLossRule: "E8_DAILY_LOSS_RULE",
  trailingRule: "E8_TRAILING_RULE",
  codeQuicksilver: "CODE_QUICKSILVER",
  codeE8Launch: "CODE_E8LAUNCH",
  bundleCheckout: "BUNDLE_CHECKOUT_LINK",
  youtube: "E8_YOUTUBE_LINK",
  x: "E8_X_LINK",
} as const;

export const E8_REFERRAL_LINK_ENV = "NEXT_PUBLIC_E8_REFERRAL_LINK";
export const E8_YOUTUBE_LINK_ENV = "NEXT_PUBLIC_E8_YOUTUBE_LINK";
export const E8_X_LINK_ENV = "NEXT_PUBLIC_E8_X_LINK";
export const E8_BUNDLE_CHECKOUT_ENV = "NEXT_PUBLIC_E8_BUNDLE_CHECKOUT_LINK";

function publicEnv(name: string): string {
  return process.env[name]?.trim() || "";
}

export const E8_AFFILIATE_URL = "https://e8markets.com/d/C19F0A0D";
export const E8_AFFILIATE_CODE = "C19F0A0D";

export function getE8ReferralUrl(): string {
  return publicEnv(E8_REFERRAL_LINK_ENV) || E8_AFFILIATE_URL;
}

export function getE8YoutubeUrl(): string | null {
  return publicEnv(E8_YOUTUBE_LINK_ENV) || null;
}

export function getE8XUrl(): string | null {
  return publicEnv(E8_X_LINK_ENV) || null;
}

export function getE8BundleCheckoutUrl(): string | null {
  return publicEnv(E8_BUNDLE_CHECKOUT_ENV) || null;
}

export type E8CenterTab =
  | "overview"
  | "rules"
  | "signup"
  | "presets"
  | "promos"
  | "content";

export const E8_CENTER_TABS: { id: E8CenterTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "rules", label: "Challenge Rules" },
  { id: "signup", label: "Direct Signup" },
  { id: "presets", label: "Risk Presets" },
  { id: "promos", label: "Giveaways / Promos" },
  { id: "content", label: "Content / Challenge-to-Funded" },
];

export const E8_CARD_TABS: E8CenterTab[] = [
  "overview",
  "rules",
  "signup",
  "presets",
];

export const E8_OVERVIEW = {
  title: "E8 Execution Center",
  subtitle:
    "Hard equity-stop flatten, Rule Desk, and E8-mapped risk presets. Not a guaranteed pass.",
  stack: [
    "Plan → execute → enforce risk → journal → review",
    "E8-mapped risk presets (software guardrails)",
    "Live growth terminal for funded / live-account operators",
    "Optional Quant Protocol on Premium — not the whole product",
  ],
} as const;

export const E8_RULES = {
  intro:
    "These are educational E8-style risk frames for planning inside Quicksilver. They are not official E8 legal terms. Confirm current rules on E8 Markets before you trade an evaluation.",
  officialClose: "Official rules are on E8’s site.",
  frames: [
    {
      id: "daily",
      title: "Daily loss awareness",
      text: "Know the remaining daily-loss room before you size a trade. Quicksilver surfaces daily-loss pressure so you can stop before a breach — you still supervise the session.",
    },
    {
      id: "trailing",
      title: "Trailing / dynamic drawdown awareness",
      text: "Trailing or dynamic drawdown can move as the account grows. Plan as if the floor can rise. Do not treat a green day as unlimited room.",
    },
    {
      id: "presets",
      title: "Pre-configured risk presets",
      text: "Use E8 Daily Guard, E8 Trailing Guard, Conservative Evaluation, and Funded Survival as planning presets. They are software tools, not a pass certificate.",
    },
  ],
} as const;

export const E8_SIGNUP = {
  cta: "Open E8 Account",
  liveBody:
    "Open your E8 account through the official Quicksilver referral path so attribution stays on this desk.",
  codeHint: `Use code ${E8_AFFILIATE_CODE} at checkout if shown.`,
} as const;

export const E8_OVERVIEW_CHIPS = [
  {
    id: "playbook",
    text: "Plan → execute → enforce risk → journal → review",
    hrefPublic: "/launch",
    hrefDash: "/dashboard/playbook",
  },
  {
    id: "presets",
    text: "E8-mapped risk presets (software guardrails)",
    tab: "presets" as const,
  },
  {
    id: "growth",
    text: "Live growth terminal for funded / live-account operators",
    hrefPublic: "/dashboard/live-growth",
    hrefDash: "/dashboard/live-growth",
  },
  {
    id: "quant",
    text: "Optional Quant Protocol on Premium — not the whole product",
    hrefPublic: "/quant-protocol",
    hrefDash: "/quant-protocol",
  },
] as const;

export const E8_PRESETS = [
  {
    id: "daily-guard",
    name: "E8 Daily Guard",
    intent: "Keep session risk inside a daily-loss awareness band.",
    live: true,
    kind: "planning",
    productId: "one",
    productName: "E8 One",
    code: "ONE-DYN",
    defaultDailyPct: 4,
    defaultDdPct: 8,
    hasDailyCap: false,
    eod: false,
    warning:
      "Dynamic floor can rise after closed profit. Daily room is the first breach most traders hit.",
  },
  {
    id: "trailing-guard",
    name: "E8 Trailing Guard",
    intent: "Plan as if trailing / dynamic drawdown can tighten after gains.",
    live: true,
    kind: "planning",
    productId: "one",
    productName: "E8 One",
    code: "ONE-DYN",
    defaultDailyPct: 3.5,
    defaultDdPct: 8,
    hasDailyCap: false,
    eod: false,
    warning:
      "Trailing / dynamic drawdown can tighten after gains. Do not spend yesterday’s cushion.",
  },
  {
    id: "conservative-eval",
    name: "Conservative Evaluation",
    intent: "Smaller size, fewer trades, evaluation-first discipline.",
    live: true,
    kind: "planning",
    productId: "pro",
    productName: "E8 Pro",
    code: "PRO-STATIC",
    defaultDailyPct: 3,
    defaultDdPct: 8,
    hasDailyCap: true,
    defaultDailyCapPct: 2,
    eod: false,
    warning: "Static floor plus daily cap. Do not treat a green day as unlimited room.",
  },
  {
    id: "funded-survival",
    name: "Funded Survival",
    intent: "Lower heat after payout eligibility — survive, then scale.",
    live: true,
    kind: "planning",
    productId: "signature",
    productName: "E8 Signature",
    code: "SIG-EOD",
    defaultDailyPct: 2.5,
    defaultDdPct: 3,
    hasDailyCap: false,
    eod: true,
    warning:
      "Intraday heat can look fine and still fail the EOD print. Best-day 35% can block payout. 25K/50K max DD 4%; 100K/150K max DD 3%.",
  },
  {
    id: "hard-equity-stop",
    name: "Hard equity-stop automation",
    intent: "Forced flatten at a desk-defined equity floor.",
    live: true,
    kind: "flatten",
    productId: "one",
    productName: "E8 One",
    code: "HARD-FLAT",
    defaultDailyPct: 4,
    defaultDdPct: 8,
    hasDailyCap: false,
    eod: false,
    warning:
      "Hard equity-stop flatten is live. Forced flatten at the desk-defined equity floor. This does not guarantee an E8 pass. Official rules are set by E8 Markets.",
  },
] as const;

export type E8Preset = (typeof E8_PRESETS)[number];
export type LiveE8Preset = Exclude<E8Preset, { live: false }>;

export function isLiveE8Preset(preset: E8Preset): preset is LiveE8Preset {
  return preset.live === true;
}

export const E8_GIVEAWAYS = [
  {
    id: "zero-to-funded",
    name: "Zero-to-Funded Suite Pack",
    blurb: "Campaign pack for evaluation-to-funded process coverage.",
    live: false,
  },
  {
    id: "risk-discipline",
    name: "Risk Discipline Showdown",
    blurb: "Public discipline contest framed around preset adherence, not P&L bragging.",
    live: false,
  },
  {
    id: "flash-sprint",
    name: "48-Hour Volatility Flash Sprint",
    blurb: "Short window campaign for structured session execution.",
    live: false,
  },
  {
    id: "live-drops",
    name: "Live Session Execution Drops",
    blurb: "Drop-style live session notes tied to the journal + presets.",
    live: false,
  },
  {
    id: "zero-violation",
    name: "Zero-Violation Monthly Raffle",
    blurb: "Raffle for operators who keep a clean rule month in the journal.",
    live: false,
  },
] as const;

export const E8_DISCOUNTS = [
  {
    id: "software-rebate",
    name: "Dual-Platform Software Rebate",
    blurb: "Software rebate when an E8 challenge is purchased through the official path.",
    live: false,
  },
  {
    id: "milestone-credit",
    name: "Funded Milestone Credit",
    blurb:
      "Pass using Quicksilver risk presets → software fee credit/refund. Not a funded-account guarantee.",
    live: false,
  },
  {
    id: "launch-code",
    name: "Tiered Launch Code",
    blurb: "Launch discount for the first E8 signups via the partner link.",
    live: false,
  },
  {
    id: "bundle",
    name: "Co-Branded Checkout Bundle",
    blurb: "Combined Quicksilver + E8 challenge offer.",
    live: false,
  },
] as const;

export function getLiveGiveaways() {
  return E8_GIVEAWAYS.filter((item) => item.live);
}

export function getLiveDiscounts() {
  return E8_DISCOUNTS.filter((item) => item.live);
}

export const E8_SERIES = {
  title: "Challenge to Funded",
  empty: "Series links will appear here when the first episode is published.",
  watchCta: "Watch / Follow",
} as const;

export const E8_WHY = {
  title: "Why E8 + Quicksilver together",
  points: [
    {
      title: "Exclusive routing",
      text: "One recommended prop firm. No generic multi-firm marketplace.",
    },
    {
      title: "Structure first",
      text: "Plan, risk, journal, and review in one TradeLocker workflow stack.",
    },
    {
      title: "Flatten first",
      text: "Hard equity-stop and the Rule Desk are built to trip before E8’s daily or max drawdown tags the account. Not a guarantee.",
    },
    {
      title: "Manual traders welcome",
      text: "The core desk is built for discretionary operators. The bot is optional Premium.",
    },
    {
      title: "Live growth stays first-class",
      text: "Funded and live-account operators keep the growth terminal — this is not evaluation-only software.",
    },
  ],
} as const;
