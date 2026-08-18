import type { PricingTier } from "@/types";
import { LOCAL_TOOL_COUNT, QS_TOOL_COUNT, TOOL_COUNT } from "@/lib/tools-registry";

export {
  PREMIUM_CHECKOUT_URL,
  PREMIUM_PRICE,
  getPremiumCheckoutUrl,
} from "@/lib/pricing-constants";

import {
  PREMIUM_PRICE,
  getPremiumCheckoutUrl,
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
      "Quicksilver Quant Protocol bot — live on TradeLocker Hub (ready to deploy)",
      `${PROP_FIRM_CHALLENGE_DAYS}-Day Prop Firm Playbook — pass your challenge in one week`,
      `${TOOL_COUNT} planning engines (${QS_TOOL_COUNT} QS modules + ${LOCAL_TOOL_COUNT} calculators)`,
      "Chart Academy — 89 lessons + charting guides",
      "Live TradeLocker terminal + 4 in-terminal pro tools",
      "Priority email support (supportteam@quicksilveralgo.com)",
    ],
    ctaLink: getPremiumCheckoutUrl(),
    recommended: true,
  },
];
