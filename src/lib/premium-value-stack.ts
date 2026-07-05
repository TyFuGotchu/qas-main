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
import {
  PROP_FIRM_CHALLENGE_DAYS,
  PROP_FIRM_MARKETING_HEADLINE,
  PROP_FIRM_MARKETING_SUBHEADLINE,
  PROP_FIRM_PLAYBOOK_HREF,
  PROP_FIRM_PREMIUM_FEATURES_LEAD,
} from "@/lib/prop-firm-challenge-marketing";

export const PREMIUM_VALUE_PILLARS = [
  {
    id: "prop-playbook",
    title: `${PROP_FIRM_CHALLENGE_DAYS}-Day Prop Firm Playbook`,
    description:
      "Day-by-day profit caps, consistency rules, and session tasks — pass your challenge in one week without breaching the 20% rule.",
    href: PROP_FIRM_PLAYBOOK_HREF,
  },
  {
    id: "planning-engines",
    title: `${TOOL_COUNT} Planning Engines`,
    description: `${QS_TOOL_COUNT} QS modules plus ${LOCAL_TOOL_COUNT} proprietary calculators — expectancy, volatility, prop compounding & survival sims.`,
  },
  {
    id: "chart-academy",
    title: "Chart Academy",
    description: "89 structured lessons and charting guides that feed directly into the playbook workflow.",
  },
  {
    id: "trade-bot",
    title: "TradeLocker Bot",
    description: "Quicksilver Quant Protocol — algorithmic execution with prop-firm-aware parameters.",
  },
  {
    id: "live-terminal",
    title: "Live Terminal + Prop OS",
    description: "Growth dashboard, prop command center, journal, and trade-together community.",
  },
  {
    id: "support",
    title: "Priority Support",
    description: "Direct email support at support@quicksilveralgo.com.",
  },
] as const;

export const PREMIUM_HEADLINE = PROP_FIRM_MARKETING_HEADLINE;

export const PREMIUM_SUBHEADLINE = `${PROP_FIRM_MARKETING_SUBHEADLINE} Premium (${PREMIUM_PRICE}/mo) unlocks the full playbook plus every tool. ${PREMIUM_PROMO_NOTE}`;

export const PREMIUM_CTA_LABEL = `Get the Playbook — ${PREMIUM_PROMO_CODE} (${PREMIUM_PROMO_FIRST_MONTH})`;

export { PROP_FIRM_PREMIUM_FEATURES_LEAD };