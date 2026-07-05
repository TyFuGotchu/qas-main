import {
  LOCAL_TOOL_COUNT,
  QS_TOOL_COUNT,
  TOOL_COUNT,
} from "@/lib/tools-registry";
import {
  PREMIUM_PRICE,
  PREMIUM_PROMO_CODE,
  PREMIUM_PROMO_FIRST_MONTH,
  PREMIUM_PROMO_NOTE,
} from "@/lib/pricing-tiers";

export const PREMIUM_VALUE_PILLARS = [
  {
    id: "planning-engines",
    title: `${TOOL_COUNT} Planning Engines`,
    description: `${QS_TOOL_COUNT} QS modules plus ${LOCAL_TOOL_COUNT} proprietary calculators — expectancy, volatility, and prop compounding.`,
  },
  {
    id: "chart-academy",
    title: "Chart Academy",
    description: "89 structured lessons, charting guides, and the prop firm playbook.",
  },
  {
    id: "trade-bot",
    title: "TradeLocker Bot",
    description: "Quicksilver Quant Protocol — algorithmic execution on TradeLocker.",
  },
  {
    id: "live-terminal",
    title: "Live Terminal + Prop Tools",
    description: "Growth dashboard, prop command center, journal, and trade-together.",
  },
  {
    id: "support",
    title: "Priority Support",
    description: "Direct email support at support@quicksilveralgo.com.",
  },
] as const;

export const PREMIUM_HEADLINE =
  "One subscription. The full institutional manual-trading stack.";

export const PREMIUM_SUBHEADLINE = `Premium (${PREMIUM_PRICE}/mo) unlocks every planning engine, Chart Academy, the TradeLocker bot, and priority support. ${PREMIUM_PROMO_NOTE}`;

export const PREMIUM_CTA_LABEL = `Upgrade with ${PREMIUM_PROMO_CODE} — ${PREMIUM_PROMO_FIRST_MONTH} first month`;