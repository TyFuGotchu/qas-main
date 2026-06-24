import type { PricingTier } from "@/types";

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
      "Upgrade anytime for full academy access",
    ],
  },
  {
    id: "tier-1",
    name: "Bot-Only Access",
    tier: "Bot Only",
    price: "$24.99",
    period: "/ Month",
    features: [
      "Tradelocker Exclusive bot Quicksilver Quant Protocol",
      "Optimized runtime parameters",
    ],
    ctaLink: "https://buy.stripe.com/bJeaEX6y00HIgtP5Y3co00b",
  },
  {
    id: "tier-2",
    name: "Premium Quant Suite",
    tier: "Premium Quant",
    price: "$199.99",
    period: "/ Month",
    features: [
      "Full bot access",
      "Chart Academy — 89 lessons + prop firm 1-week guide",
      "6 institutional trading toolkit widgets",
      "VIP Discord integration",
      "Live trading guidance",
      "Pre-programmed setting presets",
      "MQL5 source & config file access",
    ],
    ctaLink: "https://buy.stripe.com/aFa8wP8G8766cdzcmrco007",
    recommended: true,
  },
  {
    id: "tier-3",
    name: "Lifetime Alpha",
    tier: "Lifetime Alpha",
    price: "$1,499.99",
    period: "One-Time Payment",
    features: [
      "Everything in Tier 2",
      "Perpetual access with zero recurring fees",
      "1-on-1 priority support",
      "Dedicated training sessions",
    ],
    ctaLink: "https://buy.stripe.com/6oUfZhbSkeyyelH1HNco00a",
  },
];