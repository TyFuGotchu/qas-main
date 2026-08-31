import type { PricingTier } from "@/types";
import { LOCAL_TOOL_COUNT, QS_TOOL_COUNT, TOOL_COUNT } from "@/lib/tools-registry";

export {
  PREMIUM_CHECKOUT_URL,
  PREMIUM_PRICE,
  getPremiumCheckoutUrl,
} from "@/lib/pricing-constants";

import {
  PREMIUM_PRICE,
  getDiscountCheckoutUrl,
} from "@/lib/pricing-constants";

const PROP_FIRM_CHALLENGE_DAYS = 7;

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "tier-free",
    name: "Free Access",
    tier: "Free",
    price: "$0",
    period: "Forever",
    features: [
      "1 lesson preview + 1 charting guide",
      "Setup Scorer planning module",
      "Browse all lesson & tool previews",
      "Upgrade anytime for full access",
    ],
  },
  {
    id: "tier-premium",
    name: "Premium",
    tier: "Premium Quant",
    price: PREMIUM_PRICE,
    period: "/ Month",
    features: [
      "Workflow stack: plan, risk, journal, and session review",
      "Live growth terminal tools for live-account operators",
      `Prop module: ${PROP_FIRM_CHALLENGE_DAYS}-Day Playbook, tracker, consistency framework`,
      "Quant Protocol access request on TradeLocker Desktop (not in free trial)",
      `${TOOL_COUNT} planning engines (${QS_TOOL_COUNT} QS modules + ${LOCAL_TOOL_COUNT} calculators)`,
      "Chart Academy — 89 lessons + charting guides",
      "Priority email support (supportteam@quicksilveralgo.com)",
    ],
    ctaLink: getDiscountCheckoutUrl(),
    recommended: true,
  },
];
