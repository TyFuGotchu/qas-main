import { ACCOUNT_TIERS, SUBSCRIPTION_TIERS, type AccountTier, type SubscriptionTier } from "@/types";

export interface StripeTierMapping {
  priceId: string;
  tier: AccountTier;
  subscriptionTier: SubscriptionTier;
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
      subscriptionTier: SUBSCRIPTION_TIERS.TIER_1,
      label: "Tier 1 — Bot Only ($24.99/mo)",
    });
  }

  if (tier2PriceId) {
    mappings.push({
      priceId: tier2PriceId,
      tier: ACCOUNT_TIERS.PREMIUM_QUANT,
      subscriptionTier: SUBSCRIPTION_TIERS.TIER_2,
      label: "Tier 2 — Premium Quant ($199.99/mo)",
    });
  }

  if (tier3PriceId) {
    mappings.push({
      priceId: tier3PriceId,
      tier: ACCOUNT_TIERS.LIFETIME_ALPHA,
      subscriptionTier: SUBSCRIPTION_TIERS.LIFETIME,
      label: "Tier 3 — Lifetime Alpha ($1,499.99)",
    });
  }

  return mappings;
}

export function getTierFromStripePriceId(priceId: string): AccountTier | null {
  const mapping = getStripeTierMappings().find((entry) => entry.priceId === priceId);
  return mapping?.tier ?? null;
}

export function getSubscriptionTierFromStripePriceId(
  priceId: string
): SubscriptionTier | null {
  const mapping = getStripeTierMappings().find((entry) => entry.priceId === priceId);
  return mapping?.subscriptionTier ?? null;
}

export function getStripeMappingFromPriceId(
  priceId: string
): StripeTierMapping | null {
  return getStripeTierMappings().find((entry) => entry.priceId === priceId) ?? null;
}

export function getAllConfiguredStripePriceIds(): string[] {
  return getStripeTierMappings().map((entry) => entry.priceId);
}