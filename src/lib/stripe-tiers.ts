import { PREMIUM_PRICE } from "@/lib/pricing-tiers";
import { ACCOUNT_TIERS, SUBSCRIPTION_TIERS, type AccountTier, type SubscriptionTier } from "@/types";

export interface StripeTierMapping {
  priceId: string;
  tier: AccountTier;
  subscriptionTier: SubscriptionTier;
  label: string;
}

const PREMIUM_LABEL = `Premium (${PREMIUM_PRICE}/mo)`;

export function getStripeTierMappings(): StripeTierMapping[] {
  const mappings: StripeTierMapping[] = [];

  const premiumPriceId =
    process.env.STRIPE_PRICE_ID_PREMIUM ?? process.env.STRIPE_PRICE_ID_TIER_2;

  if (premiumPriceId) {
    mappings.push({
      priceId: premiumPriceId,
      tier: ACCOUNT_TIERS.PREMIUM_QUANT,
      subscriptionTier: SUBSCRIPTION_TIERS.TIER_2,
      label: PREMIUM_LABEL,
    });
  }

  const legacyTier1 = process.env.STRIPE_PRICE_ID_TIER_1;
  const legacyTier3 = process.env.STRIPE_PRICE_ID_TIER_3;

  if (legacyTier1) {
    mappings.push({
      priceId: legacyTier1,
      tier: ACCOUNT_TIERS.PREMIUM_QUANT,
      subscriptionTier: SUBSCRIPTION_TIERS.TIER_2,
      label: `${PREMIUM_LABEL} (legacy)`,
    });
  }

  if (legacyTier3) {
    mappings.push({
      priceId: legacyTier3,
      tier: ACCOUNT_TIERS.PREMIUM_QUANT,
      subscriptionTier: SUBSCRIPTION_TIERS.TIER_2,
      label: `${PREMIUM_LABEL} (legacy lifetime)`,
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