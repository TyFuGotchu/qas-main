import { ACCOUNT_TIERS, type AccountTier } from "@/types";

export interface StripeTierMapping {
  priceId: string;
  tier: AccountTier;
  label: string;
}

export function getStripeTierMappings(): StripeTierMapping[] {
  const mappings: StripeTierMapping[] = [];

  const tier1PriceId = process.env.STRIPE_PRICE_ID_TIER_1;
  const tier2PriceId = process.env.STRIPE_PRICE_ID_TIER_2;
  const tier3PriceId = process.env.STRIPE_PRICE_ID_TIER_3;

  if (tier1PriceId) {
    mappings.push({
      priceId: tier1PriceId,
      tier: ACCOUNT_TIERS.BOT_ONLY,
      label: "Tier 1 — Bot Only ($24.99/mo)",
    });
  }

  if (tier2PriceId) {
    mappings.push({
      priceId: tier2PriceId,
      tier: ACCOUNT_TIERS.PREMIUM_QUANT,
      label: "Tier 2 — Premium Quant ($199.99/mo)",
    });
  }

  if (tier3PriceId) {
    mappings.push({
      priceId: tier3PriceId,
      tier: ACCOUNT_TIERS.LIFETIME_ALPHA,
      label: "Tier 3 — Lifetime Alpha ($1,499.99)",
    });
  }

  return mappings;
}

export function getTierFromStripePriceId(priceId: string): AccountTier | null {
  const mapping = getStripeTierMappings().find((entry) => entry.priceId === priceId);
  return mapping?.tier ?? null;
}

export function getAllConfiguredStripePriceIds(): string[] {
  return getStripeTierMappings().map((entry) => entry.priceId);
}