import { PRICING_TIERS } from "@/lib/pricing-tiers";
import type { SubscriptionTier } from "@/types";

export type ResourceType = "lesson" | "guide" | "tool";

export interface ResourceAccessResult {
  allowed: boolean;
  requiredTier: SubscriptionTier;
  userTier: SubscriptionTier;
}

/** Freemium resource IDs — explicit tier gates per spec */
export const FREEMIUM_RESOURCES = {
  lessons: {
    free: "chart-reading-what-is-price-action",
    tier1: "chart-reading-reading-candle-components",
  },
  guides: {
    free: "chart-reading",
    tier1: "candlesticks",
  },
  tools: {
    free: "edge-confluence",
    tier1: "risk-matrix",
    tier2: ["execution-protocol", "alpha-durability", "regime-oracle", "prop-survival"],
  },
} as const;

const TIER_RANK: Record<SubscriptionTier, number> = {
  FREE: 0,
  TIER_1: 1,
  TIER_2: 2,
  LIFETIME: 3,
};

export const TIER_LABELS: Record<SubscriptionTier, string> = {
  FREE: "Free Preview",
  TIER_1: "Bot-Only Access ($24.99/mo)",
  TIER_2: "Premium Quant ($199.99/mo)",
  LIFETIME: "Lifetime Alpha ($1,499.99)",
};

export function getTierRank(tier: SubscriptionTier): number {
  return TIER_RANK[tier];
}

export function tierMeetsRequirement(
  userTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean {
  return getTierRank(userTier) >= getTierRank(requiredTier);
}

/** Resolve effective tier — unauthenticated visitors are FREE */
export function resolveSubscriptionTier(
  user: { subscriptionTier?: SubscriptionTier | string | null } | null | undefined
): SubscriptionTier {
  if (!user?.subscriptionTier) return "FREE";
  return user.subscriptionTier as SubscriptionTier;
}

export function accountTierToSubscriptionTier(
  accountTier: string
): SubscriptionTier {
  switch (accountTier) {
    case "Bot Only":
      return "TIER_1";
    case "Premium Quant":
      return "TIER_2";
    case "Lifetime Alpha":
      return "LIFETIME";
    case "Free":
    default:
      return "FREE";
  }
}

export function subscriptionTierToAccountTier(
  tier: SubscriptionTier
): "Free" | "Bot Only" | "Premium Quant" | "Lifetime Alpha" {
  switch (tier) {
    case "TIER_1":
      return "Bot Only";
    case "TIER_2":
      return "Premium Quant";
    case "LIFETIME":
      return "Lifetime Alpha";
    case "FREE":
    default:
      return "Free";
  }
}

export function getRequiredTierForResource(
  resourceType: ResourceType,
  resourceId: string
): SubscriptionTier {
  if (resourceType === "tool") {
    if (resourceId === FREEMIUM_RESOURCES.tools.free) return "FREE";
    if (resourceId === FREEMIUM_RESOURCES.tools.tier1) return "TIER_1";
    return "TIER_2";
  }

  if (resourceType === "lesson") {
    if (resourceId === FREEMIUM_RESOURCES.lessons.free) return "FREE";
    if (resourceId === FREEMIUM_RESOURCES.lessons.tier1) return "TIER_1";
    return "TIER_2";
  }

  if (resourceType === "guide") {
    if (resourceId === FREEMIUM_RESOURCES.guides.free) return "FREE";
    if (resourceId === FREEMIUM_RESOURCES.guides.tier1) return "TIER_1";
    return "TIER_2";
  }

  return "TIER_2";
}

/**
 * Core access check — takes subscriptionTier and resource slug/id.
 * Setup Scorer (edge-confluence) → FREE
 * Risk Matrix → TIER_1
 * Prop Survival + all other premium assets → TIER_2
 */
export function checkResourceAccess(
  subscriptionTier: SubscriptionTier | null | undefined,
  resourceType: ResourceType,
  resourceId: string
): ResourceAccessResult {
  const userTier = subscriptionTier ?? "FREE";
  const requiredTier = getRequiredTierForResource(resourceType, resourceId);

  return {
    allowed: tierMeetsRequirement(userTier, requiredTier),
    requiredTier,
    userTier,
  };
}

export function canAccessDiscord(subscriptionTier: SubscriptionTier): boolean {
  return tierMeetsRequirement(subscriptionTier, "TIER_2");
}

export function hasUnlimitedAccess(subscriptionTier: SubscriptionTier): boolean {
  return subscriptionTier === "TIER_2" || subscriptionTier === "LIFETIME";
}

export function getTierCheckoutUrl(tier: SubscriptionTier): string {
  switch (tier) {
    case "TIER_1":
      return PRICING_TIERS[0].ctaLink;
    case "TIER_2":
      return PRICING_TIERS[1].ctaLink;
    case "LIFETIME":
      return PRICING_TIERS[2].ctaLink;
    case "FREE":
    default:
      return "/register";
  }
}

/** Extract first N words from paragraph array for faded SEO preview */
export function getPreviewParagraphs(
  paragraphs: string[],
  wordLimit = 300
): { paragraphs: string[]; isTruncated: boolean } {
  let wordCount = 0;
  const result: string[] = [];

  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    if (wordCount + words.length <= wordLimit) {
      result.push(para);
      wordCount += words.length;
    } else {
      const remaining = wordLimit - wordCount;
      if (remaining > 0) {
        result.push(`${words.slice(0, remaining).join(" ")}…`);
      }
      return { paragraphs: result, isTruncated: true };
    }
  }

  return { paragraphs: result, isTruncated: false };
}

export function getPreviewPlainText(
  paragraphs: string[],
  wordLimit = 300
): { text: string; isTruncated: boolean } {
  const { paragraphs: preview, isTruncated } = getPreviewParagraphs(
    paragraphs,
    wordLimit
  );
  return { text: preview.join("\n\n"), isTruncated };
}