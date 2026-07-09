import { TRADELOCKER_BOT_URL } from "@/lib/constants";
import { GUARANTEE_HEADLINE } from "@/lib/money-back-guarantee";
import {
  PROP_FIRM_CHALLENGE_DAYS,
  PROP_FIRM_PLAYBOOK_HREF,
} from "@/lib/prop-firm-challenge-marketing";
import {
  PREMIUM_PRICE,
  PREMIUM_PROMO_CODE,
  PREMIUM_PROMO_FIRST_MONTH,
} from "@/lib/pricing-constants";
import { LOCAL_TOOL_COUNT, QS_TOOL_COUNT, TOOL_COUNT } from "@/lib/tools-registry";

export const PREMIUM_INCLUDES_ANCHOR = "premium-includes";

export const QUICKSILVER_QUANT_PROTOCOL = {
  name: "Quicksilver Quant Protocol",
  subtitle: "Apex Institutional Engine",
  tagline: "Ready to launch on TradeLocker — no local installs",
  description:
    "Our flagship in-house algorithm on the TradeLocker marketplace. Subscribe through the hub, enable it on your account, and run institutional-grade execution alongside your live terminal — prop-firm-aware risk parameters built in.",
  href: TRADELOCKER_BOT_URL,
  dashboardHref: "/dashboard/bot",
  highlights: [
    "Live on TradeLocker Hub today",
    "Connect & deploy in minutes",
    "Runs with your live terminal + 4 pro tools",
    "Premium members get full access workflow",
  ],
} as const;

export const LIVE_TERMINAL_TOOLS = [
  { name: "Live Signal Terminal", desc: "Real-time positions, orders & P&L" },
  { name: "Live Risk Guard", desc: "Daily loss & drawdown enforcement" },
  { name: "Live Position Sizer", desc: "Lot sizing from live account equity" },
  { name: "Live Growth Coach", desc: "Scale plan aligned to prop rules" },
  { name: "Live Exposure Scanner", desc: "Portfolio heat & correlation view" },
] as const;

export const PROP_OS_FEATURES = [
  "Prop Command Center — challenge survival outlook",
  "7-Day Playbook tracker with day-complete emails",
  "Trade journal with auto-log from terminal",
  "Trade Together community hub",
  "Live account growth dashboard",
] as const;

export const CHART_ACADEMY_STATS = {
  lessonCount: 89,
  guideCount: 6,
  label: "Chart Academy",
  description:
    "Structured lessons on price action, market structure, Fibonacci, candlesticks, trading styles — wired into the playbook workflow.",
} as const;

export interface PremiumIncludeCategory {
  id: string;
  title: string;
  description: string;
  href?: string;
  badge?: string;
}

export const PREMIUM_INCLUDE_CATEGORIES: PremiumIncludeCategory[] = [
  {
    id: "playbook",
    title: `${PROP_FIRM_CHALLENGE_DAYS}-Day Prop Firm Playbook`,
    description:
      "Daily profit caps, consistency checks, session tasks, and in-dashboard challenge tracker — pass in one week without breaching the 20% rule.",
    href: PROP_FIRM_PLAYBOOK_HREF,
    badge: "Flagship",
  },
  {
    id: "planning",
    title: `${TOOL_COUNT} Planning Engines`,
    description: `${QS_TOOL_COUNT} QS modules + ${LOCAL_TOOL_COUNT} proprietary calculators — scoring, risk, survival sims, expectancy & compounding.`,
    href: "/tools",
  },
  {
    id: "academy",
    title: CHART_ACADEMY_STATS.label,
    description: `${CHART_ACADEMY_STATS.lessonCount} lessons and ${CHART_ACADEMY_STATS.guideCount} charting guides — from basics to prop firm execution.`,
    href: "/lessons",
  },
  {
    id: "terminal",
    title: "Live TradeLocker Terminal",
    description:
      "Connect your TradeLocker account — live positions, pre-trade gate, and four in-terminal pro tools included with Premium.",
    href: "/dashboard/bot",
  },
  {
    id: "prop-os",
    title: "Prop OS + Growth Dashboard",
    description:
      "Prop command center, journal, playbook progress, trade-together hub, and live growth analytics — one operating system for funded traders.",
    href: "/dashboard",
  },
  {
    id: "support",
    title: "Priority Email Support",
    description: "Direct line to support@quicksilveralgo.com — 1 business day SLA for Premium members.",
    href: "/support",
  },
];

/** Compact chips for site-wide marquee strip */
export const PREMIUM_INCLUDE_STRIP_ITEMS = [
  "Quicksilver Quant Protocol Bot",
  `${PROP_FIRM_CHALLENGE_DAYS}-Day Playbook`,
  `${TOOL_COUNT} Planning Engines`,
  `${CHART_ACADEMY_STATS.lessonCount} Academy Lessons`,
  "Live TradeLocker Terminal",
  "Prop OS + Journal",
  GUARANTEE_HEADLINE,
] as const;

export const PREMIUM_INCLUDES_HEADLINE = "Everything in Premium — One Subscription";

export const PREMIUM_INCLUDES_SUBHEADLINE = `One ${PREMIUM_PRICE}/mo plan (${PREMIUM_PROMO_CODE} → ${PREMIUM_PROMO_FIRST_MONTH} first month) unlocks the full institutional stack — flagship TradeLocker bot, playbook, tools, academy, and live terminal.`;

export const PREMIUM_INCLUDES_ONE_LINER =
  `Premium includes: Quicksilver Quant Protocol bot, ${PROP_FIRM_CHALLENGE_DAYS}-day playbook, ${TOOL_COUNT} tools, ${CHART_ACADEMY_STATS.lessonCount} lessons, live terminal & Prop OS.`;