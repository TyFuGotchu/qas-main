/**
 * Internal social marketing kit — copy, hooks, carousels, UTMs.
 * Served at /social-kit (noindex).
 */

import { PREMIUM_PRICE } from "@/lib/pricing-constants";
import { PROP_FIRM_CHALLENGE_DAYS } from "@/lib/prop-firm-challenge-marketing";
import { TOOL_COUNT } from "@/lib/tools-registry";

const SITE = "https://quicksilveralgo.com";

export function socialLink(
  path: string,
  source: "x" | "instagram" | "tiktok" | "link_in_bio",
  campaign: string
): string {
  const base = path.startsWith("http") ? path : `${SITE}${path.startsWith("/") ? path : `/${path}`}`;
  const url = new URL(base);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}

export const SOCIAL_PRIMARY_PATH = "/quant-protocol";
export const SOCIAL_PLAYBOOK_PATH = "/launch";

export const SOCIAL_LINKS = {
  quantX: socialLink(SOCIAL_PRIMARY_PATH, "x", "full_stack_push"),
  quantIg: socialLink(SOCIAL_PRIMARY_PATH, "instagram", "full_stack"),
  quantTt: socialLink(SOCIAL_PRIMARY_PATH, "tiktok", "full_stack"),
  quantBio: socialLink(SOCIAL_PRIMARY_PATH, "link_in_bio", "profile"),
  launchX: socialLink(SOCIAL_PLAYBOOK_PATH, "x", "playbook_stack"),
  launchIg: socialLink(SOCIAL_PLAYBOOK_PATH, "instagram", "playbook_stack"),
  launchTt: socialLink(SOCIAL_PLAYBOOK_PATH, "tiktok", "playbook_stack"),
  home: SITE,
  youtubeSample: "https://www.youtube.com/live/ASDcrpFfJ5k?si=yKN7np7g8tKOB6CS",
} as const;

export const PROFILE_BIOS = {
  short: `Prop firm playbook · risk tools · academy
+ Quant Protocol on TradeLocker Desktop
Full trader stack — not bot-only
↓ start here`,
  medium: `Quicksilver Algo — full trader arsenal
${PROP_FIRM_CHALLENGE_DAYS}-Day Playbook · ${TOOL_COUNT} tools · Chart Academy · live terminal
Quant Protocol on TradeLocker Desktop (Premium)
Not a bot-only product · ${PREMIUM_PRICE}/mo
↓ link`,
} as const;

export const HASHTAG_SETS = {
  core: "#PropFirm #FundedTrader #TradingTools #TradingEducation #RiskManagement",
  tradelocker: "#TradeLocker #AlgoTrading #PropFirm #FundedTrader #TradingTools",
  education: "#PriceAction #MarketStructure #BOS #TradingEducation #ForexEducation",
  short: "#PropFirm #TradingTools #FundedTrader",
} as const;

export const POSITIONING = {
  oneLiner:
    "Quicksilver is a full trader operating system — playbook, tools, academy, terminal, guidance — with Quant Protocol on TradeLocker Desktop as the automation layer.",
  notThis: "Not a free MT5-style demo EA. Not bot-only. Not guaranteed returns.",
  rule: "Lead with arsenal (playbook / tools / academy / guidance). Mention TradeLocker bot as one module — never the whole story.",
} as const;

export const X_POSTS: { id: string; label: string; body: string }[] = [
  {
    id: "short-arsenal",
    label: "Short arsenal (reach)",
    body: `Most platforms sell you a bot.

We built the system around it:

Playbook · Risk tools · Academy · Live terminal · Guidance
+ Quant Protocol on TradeLocker Desktop if you run automation

Full arsenal →
${SOCIAL_LINKS.quantX}

${HASHTAG_SETS.short}`,
  },
  {
    id: "desktop",
    label: "Desktop vs Web",
    body: `Requested a bot on TradeLocker?

It won’t show on TradeLocker Web.
Desktop only — and access is Premium (bot + playbook + tools).

How the full stack works →
${SOCIAL_LINKS.quantX}

${HASHTAG_SETS.tradelocker}`,
  },
  {
    id: "prop-firm",
    label: "Prop firm process",
    body: `Passing a prop challenge isn’t one indicator.

It’s daily caps, consistency rules, risk, and process.

Quicksilver Premium = ${PROP_FIRM_CHALLENGE_DAYS}-Day Playbook + tools + academy + terminal
(+ Quant Protocol on TradeLocker Desktop if you automate)

${SOCIAL_LINKS.launchX}

${HASHTAG_SETS.core}`,
  },
];

export const IG_TT_CAPTIONS: { id: string; label: string; body: string }[] = [
  {
    id: "arsenal",
    label: "Full arsenal",
    body: `Most platforms sell a bot.

We built the system around it:
Playbook · Risk tools · Academy · Live terminal · Guidance
(+ Quant Protocol on TradeLocker Desktop if you automate)

Full arsenal → link in bio

${HASHTAG_SETS.core}`,
  },
  {
    id: "consistency",
    label: "Consistency rule",
    body: `Most prop firm failures aren’t “bad entries.”

They’re consistency breaches — one oversized green day that kills the account.

Process > hero trades.
Playbook + risk tools → link in bio

${HASHTAG_SETS.core}`,
  },
  {
    id: "no-demo",
    label: "No free bot demo",
    body: `“Can I try the bot free on demo first?”

Unlike free MT5 EAs, Quant Protocol access is Premium-first — then TradeLocker Desktop.

You get the full arsenal with it, not a bare bot trial.

Details → link in bio

${HASHTAG_SETS.tradelocker}`,
  },
];

export const REEL_SCRIPTS: {
  id: string;
  title: string;
  duration: string;
  onScreen: string[];
  vo: string;
  cta: string;
}[] = [
  {
    id: "r1",
    title: "Bot is one module",
    duration: "12–15s",
    onScreen: [
      "A bot without a system…",
      "Playbook · Tools · Academy · Terminal",
      "Quant Protocol = automation layer",
      "Link in bio",
    ],
    vo: "Most platforms sell you a bot. We built the system around it — playbook, risk tools, academy, live terminal, guidance. Quant Protocol on TradeLocker Desktop is the automation layer, not the whole product.",
    cta: "Full arsenal — link in bio",
  },
  {
    id: "r2",
    title: "Desktop not Web",
    duration: "10–12s",
    onScreen: [
      "TradeLocker Web?",
      "Bot won’t show.",
      "Desktop required",
      "Premium unlocks the stack",
    ],
    vo: "If you requested Quant Protocol on TradeLocker, use the desktop app — not the web platform. Premium unlocks the bot workflow and the full trader stack.",
    cta: "Setup path — link in bio",
  },
  {
    id: "r3",
    title: "Consistency kills accounts",
    duration: "12–15s",
    onScreen: [
      "Prop firm tip",
      "Green days can still fail you",
      "Consistency rule",
      "Daily profit caps",
    ],
    vo: "You can hit the profit target and still fail. One oversized day breaks consistency. Cap daily profits. Follow a plan. That’s what the seven-day playbook is for.",
    cta: "Playbook overview — link in bio",
  },
  {
    id: "r4",
    title: "Win rate is a trap",
    duration: "10–12s",
    onScreen: [
      "What’s the win rate?",
      "Wrong question",
      "Risk · R-multiples · drawdown",
      "Process over screenshots",
    ],
    vo: "Stop asking only for win rate. Without risk, R-multiples, and drawdown, that number is marketing. We don’t sell guaranteed results — we sell a full stack and a process.",
    cta: "See what’s included — link in bio",
  },
  {
    id: "r5",
    title: "No free MT5-style trial",
    duration: "10–12s",
    onScreen: [
      "Free demo bot first?",
      "Not how this works",
      "Premium → Desktop → deploy",
      "Full arsenal included",
    ],
    vo: "This isn’t a free MT5 market EA you test before paying. Premium first, then TradeLocker Desktop. You get the full arsenal — not a bare trial bot.",
    cta: "How access works — link in bio",
  },
  {
    id: "r6",
    title: "Five percent per week",
    duration: "12–15s",
    onScreen: [
      "$5k/week on $100k?",
      "That’s 5% per week",
      "Stretch goal ≠ bot KPI",
      "Compound with controlled risk",
    ],
    vo: "Five thousand a week on a hundred K is five percent a week. That’s a stretch ambition, not a sane weekly bot KPI. Use controlled size and compound. Process first.",
    cta: "Risk-first stack — link in bio",
  },
  {
    id: "r7",
    title: "Arsenal walkthrough",
    duration: "15s",
    onScreen: [
      "Premium Quant includes",
      "1 Playbook",
      "2 Risk tools",
      "3 Academy",
      "4 Live terminal",
      "5 Guidance + Quant Protocol",
    ],
    vo: "Premium Quant: seven-day prop firm playbook, planning and risk engines, chart academy, live terminal tools, one-on-one guidance, and Quant Protocol on TradeLocker Desktop.",
    cta: "Full list — link in bio",
  },
  {
    id: "r8",
    title: "Personal vs prop",
    duration: "12s",
    onScreen: [
      "Personal account?",
      "Prop challenge?",
      "Same stack — different risk rules",
      "Tools for both",
    ],
    vo: "Personal account or prop challenge — the stack still fits. Prop needs consistency and daily caps. Personal needs hard loss limits and sizing. Same arsenal, different rules.",
    cta: "Start here — link in bio",
  },
  {
    id: "r9",
    title: "BOS education hook",
    duration: "12–15s",
    onScreen: [
      "What is BOS?",
      "Break of structure",
      "Trend continuation signal",
      "Free guide on site",
    ],
    vo: "Break of structure means price closes beyond a swing in the trend’s direction — continuation, not automatic reversal. We teach structure in academy and free guides, then tie it to risk.",
    cta: "Guides + full stack — link in bio",
  },
  {
    id: "r10",
    title: "Soft CTA closer",
    duration: "8–10s",
    onScreen: [
      "Quicksilver Algo",
      "Full trader arsenal",
      "quicksilveralgo.com",
      "Link in bio",
    ],
    vo: "Quicksilver Algo — full trader arsenal. Playbook, tools, academy, terminal, guidance, and Quant Protocol if you automate. Link in bio.",
    cta: "Link in bio",
  },
];

export const CAROUSEL_STACK: { slide: number; title: string; body: string }[] = [
  {
    slide: 1,
    title: "Not bot-only",
    body: "Quicksilver Premium is a full trader arsenal — automation is one module.",
  },
  {
    slide: 2,
    title: `${PROP_FIRM_CHALLENGE_DAYS}-Day Playbook`,
    body: "Daily profit caps, consistency rules, challenge tracker, session tasks.",
  },
  {
    slide: 3,
    title: `${TOOL_COUNT} planning engines`,
    body: "Risk, survival sims, confluence, expectancy, compounding, and more.",
  },
  {
    slide: 4,
    title: "Chart Academy",
    body: "Structure, price action, forex/CFDs, execution education.",
  },
  {
    slide: 5,
    title: "Live terminal tools",
    body: "Risk Guard, Position Sizer, exposure, live account context.",
  },
  {
    slide: 6,
    title: "1:1 guidance",
    body: "Setup and stack support for Premium members.",
  },
  {
    slide: 7,
    title: "Quant Protocol",
    body: "TradeLocker Desktop bot layer — when you want automation.",
  },
  {
    slide: 8,
    title: "Start here",
    body: "Link in bio → full arsenal breakdown · quicksilveralgo.com",
  },
];

export const CONTENT_PILLARS: {
  name: string;
  pct: string;
  ideas: string[];
}[] = [
  {
    name: "Prop firm process",
    pct: "30%",
    ideas: [
      "Consistency rule in plain English",
      "Daily profit caps",
      "Why green days still fail challenges",
    ],
  },
  {
    name: "Risk / tools",
    pct: "20%",
    ideas: ["Win rate is a weak KPI", "Risk units not dollar fantasies", "Personal account loss limits"],
  },
  {
    name: "Education",
    pct: "20%",
    ideas: ["BOS meaning", "Structure basics", "Session awareness"],
  },
  {
    name: "Product / stack",
    pct: "20%",
    ideas: ["Arsenal walkthrough", "What Premium includes", "Guidance vs custom bot"],
  },
  {
    name: "TradeLocker / setup",
    pct: "10%",
    ideas: ["Desktop not Web", "Premium-first access", "No free MT5-style demo"],
  },
];

export const WEEKLY_CADENCE = [
  { day: "Mon", post: "Arsenal / stack Reel (pillar: product)" },
  { day: "Tue", post: "Prop firm process Reel or carousel" },
  { day: "Wed", post: "Education (BOS / structure)" },
  { day: "Thu", post: "Desktop vs Web or access path" },
  { day: "Fri", post: "Risk / expectations (no guarantee energy)" },
  { day: "Sat", post: "Repurpose best performer" },
  { day: "Sun", post: "Optional Stories/poll + rest" },
] as const;

export const COMPLIANCE_LINES = [
  "No guaranteed profits or fixed win rates in captions.",
  "Live performance always varies — past results ≠ future results.",
  "No free pre-Premium bot trial claims.",
  "Desktop required for Quant Protocol — not TradeLocker Web.",
  "Custom bots / 1-on-1 trading capital = after Premium, separate paid work.",
] as const;
