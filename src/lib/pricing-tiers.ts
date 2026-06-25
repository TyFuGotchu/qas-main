import type { PricingTier } from "@/types";

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
      "Everything included — one price",
      "TradeLocker Quicksilver Quant Protocol bot",
      "Chart Academy — 89 lessons + prop firm guide",
      "All 6 institutional planning modules",
      "Priority email support (support@quicksilveralgo.com)",
      "TradeLocker live dashboard + 3 account pro tools",
      PREMIUM_PROMO_NOTE,
    ],
    ctaLink: PREMIUM_CHECKOUT_URL,
    recommended: true,
  },
];