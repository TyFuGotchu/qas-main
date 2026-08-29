/**
 * Exclusive E8 Markets partnership.
 * Do not list competing prop firms as recommendations.
 * Do not invent live referral URLs, discount codes, or bundle checkouts.
 */

export const E8_FIRM_NAME = "E8 Markets";
export const E8_PUBLIC_PATH = "/e8";
export const E8_DASHBOARD_PATH = "/dashboard/e8";
export const E8_ALT_PUBLIC_PATH = "/e8-execution-center";

export const E8_POSITIONING =
  "Quicksilver is the execution + risk workflow stack for E8 Markets traders on TradeLocker.";

export const E8_PARTNER_LINE = "Official E8 Markets Partner";
export const E8_BAR_LINE =
  "E8 Execution Center — Challenges, Rules, Direct Signup";
export const E8_EXCLUSIVE_LINE =
  "E8 Markets is the exclusive recommended prop firm.";

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

/** Placeholders until live partner assets exist. */
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

export function getE8ReferralUrl(): string | null {
  return publicEnv(E8_REFERRAL_LINK_ENV) || null;
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
    "Exclusive prop partner. Account rules, direct registration, and preset risk configurations.",
  body: [
    "E8 Markets is the exclusive recommended prop firm on Quicksilver.",
    "Quicksilver provides the workflow, risk presets, journal, playbook, live growth terminal, and optional Quant Protocol bot.",
    "The goal is structured evaluation trading and funded-account survival — not hype, not a guaranteed pass.",
  ],
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
  frames: [
    {
      id: "daily",
      title: "Daily loss awareness",
      placeholder: E8_PLACEHOLDERS.dailyLossRule,
      text: "Know the remaining daily-loss room before you size a trade. Quicksilver surfaces daily-loss pressure so you can stop before a breach — you still supervise the session.",
    },
    {
      id: "trailing",
      title: "Dynamic / trailing drawdown awareness",
      placeholder: E8_PLACEHOLDERS.trailingRule,
      text: "Trailing or dynamic drawdown can move as the account grows. Plan as if the floor can rise. Do not treat a green day as unlimited room.",
    },
    {
      id: "presets",
      title: "Pre-configured risk presets",
      placeholder: null,
      text: "Use E8 Daily Guard, E8 Trailing Guard, Conservative Evaluation, and Funded Survival as planning presets. They are software tools, not a pass certificate.",
    },
  ],
} as const;

export const E8_SIGNUP = {
  cta: "Open E8 Account",
  attribution:
    "Signup through this center uses unique Quicksilver referral attribution when the live partner link is connected.",
  comingSoon:
    "Direct signup is Partner Preview until E8_REFERRAL_LINK is live. Do not use a guessed URL.",
} as const;

export const E8_PRESETS = [
  {
    id: "daily-guard",
    name: "E8 Daily Guard",
    intent: "Keep session risk inside a daily-loss awareness band.",
    live: true,
    kind: "planning",
  },
  {
    id: "trailing-guard",
    name: "E8 Trailing Guard",
    intent: "Plan as if trailing / dynamic drawdown can tighten after gains.",
    live: true,
    kind: "planning",
  },
  {
    id: "conservative-eval",
    name: "Conservative Evaluation",
    intent: "Smaller size, fewer trades, evaluation-first discipline.",
    live: true,
    kind: "planning",
  },
  {
    id: "funded-survival",
    name: "Funded Survival",
    intent: "Lower heat after payout eligibility — survive, then scale.",
    live: true,
    kind: "planning",
  },
  {
    id: "hard-equity-stop",
    name: "Hard equity-stop automation",
    intent: "Forced flatten at a desk-defined equity floor.",
    live: false,
    kind: "coming-soon",
  },
] as const;

export const E8_GIVEAWAYS = [
  {
    id: "zero-to-funded",
    name: "Zero-to-Funded Suite Pack",
    blurb: "Campaign pack for evaluation-to-funded process coverage.",
  },
  {
    id: "risk-discipline",
    name: "Risk Discipline Showdown",
    blurb: "Public discipline contest framed around preset adherence, not P&L bragging.",
  },
  {
    id: "flash-sprint",
    name: "48-Hour Volatility Flash Sprint",
    blurb: "Short window campaign for structured session execution.",
  },
  {
    id: "live-drops",
    name: "Live Session Execution Drops",
    blurb: "Drop-style live session notes tied to the journal + presets.",
  },
  {
    id: "zero-violation",
    name: "Zero-Violation Monthly Raffle",
    blurb: "Raffle for operators who keep a clean rule month in the journal.",
  },
] as const;

export const E8_DISCOUNTS = [
  {
    id: "software-rebate",
    name: "Dual-Platform Software Rebate",
    blurb:
      "50% off Quicksilver when an E8 challenge is purchased with code QUICKSILVER.",
    codePlaceholder: E8_PLACEHOLDERS.codeQuicksilver,
  },
  {
    id: "milestone-credit",
    name: "Funded Milestone Credit",
    blurb:
      "Pass using Quicksilver risk presets → software fee credit/refund. Not a funded-account guarantee.",
    codePlaceholder: null,
  },
  {
    id: "launch-code",
    name: "Tiered Launch Code E8LAUNCH",
    blurb:
      "25% off Quicksilver for the first 50 E8 signups via the partner link.",
    codePlaceholder: E8_PLACEHOLDERS.codeE8Launch,
  },
  {
    id: "bundle",
    name: "Co-Branded Checkout Bundle",
    blurb: "Combined Quicksilver + E8 challenge offer when live.",
    codePlaceholder: E8_PLACEHOLDERS.bundleCheckout,
  },
] as const;

export const E8_SERIES = {
  title: "Challenge to Funded",
  blurb:
    "Public educational series: live process, journal, risk presets, TradeLocker execution. Not a pass promise.",
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
      title: "E8-mapped presets",
      text: "Daily-loss and trailing-drawdown awareness as software guardrails.",
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
