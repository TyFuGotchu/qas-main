import type { PricingTier } from "@/types";
import { LOCAL_TOOL_COUNT, QS_TOOL_COUNT, TOOL_COUNT } from "@/lib/tools-registry";
import { PROP_FIRM_CHALLENGE_DAYS } from "@/lib/prop-firm-challenge-marketing";

export const PREMIUM_CHECKOUT_URL =
  "https://buy.stripe.com/fZufZhcWo4XY4L7727co00c";

export const PREMIUM_PROMO_CODE = "FIRST100";

export const PREMIUM_PROMO_STRIPE_ID = "promo_1TlzBjDUxwVQyisqks4CyIKy";

export const PREMIUM_PRICE = "$149.99";

export const PREMIUM_PROMO_DISCOUNT = "$60";

export const PREMIUM_PROMO_FIRST_MONTH = "$89.99";

export const PREMIUM_PROMO_NOTE =
  "Use code FIRST100 for $60 off your first month (first 100 users)";

export function getPremiumCheckoutUrl(withPromo = true): string {
  if (!withPromo) return PREMIUM_CHECKOUT_URL;
  const url = new URL(PREMIUM_CHECKOUT_URL);
  url.searchParams.set("prefilled_promo_code", PREMIUM_PROMO_CODE);
  return url.toString();
}

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
      `${PROP_FIRM_CHALLENGE_DAYS}-Day Prop Firm Playbook — pass your challenge in one week`,
      `${TOOL_COUNT} planning engines (${QS_TOOL_COUNT} QS modules + ${LOCAL_TOOL_COUNT} calculators)`,
      "Chart Academy — 89 lessons + charting guides",
      "TradeLocker Quicksilver Quant Protocol bot",
      "Priority email support (support@quicksilveralgo.com)",
      "Live trading terminal + 4 account pro tools",
      PREMIUM_PROMO_NOTE,
    ],
    ctaLink: PREMIUM_CHECKOUT_URL,
    recommended: true,
  },
];