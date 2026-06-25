import { PREMIUM_CHECKOUT_URL, PREMIUM_PRICE } from "@/lib/pricing-tiers";
import type { SubscriptionTier } from "@/types";

export type ResourceType = "lesson" | "guide" | "tool";

export interface ResourceAccessResult {
  allowed: boolean;
  requiredTier: SubscriptionTier;
  userTier: SubscriptionTier;
}

/** Freemium resource IDs — free tier only; everything else requires Premium */
export const FREEMIUM_RESOURCES = {
  lessons: {
    free: "chart-reading-what-is-price-action",
  },
  guides: {
    free: "chart-reading",
  },
  tools: {
    free: "edge-confluence",
  },
} as const;

const TIER_RANK: Record<SubscriptionTier, number> = {
  FREE: 0,
  TIER_1: 2,
  TIER_2: 2,
  LIFETIME: 2,
};

export const TIER_LABELS: Record<SubscriptionTier, string> = {
  FREE: "Free Preview",
  TIER_1: `Premium (${PREMIUM_PRICE}/mo)`,
  TIER_2: `Premium (${PREMIUM_PRICE}/mo)`,
  LIFETIME: `Premium (${PREMIUM_PRICE}/mo)`,
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
    case "Premium Quant":
      return "TIER_2";
    case "Bot Only":
    case "Lifetime Alpha":
      return "TIER_2";
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
    case "TIER_2":
    case "LIFETIME":
      return "Premium Quant";
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
    return "TIER_2";
  }

  if (resourceType === "lesson") {
    if (resourceId === FREEMIUM_RESOURCES.lessons.free) return "FREE";
    return "TIER_2";
  }

  if (resourceType === "guide") {
    if (resourceId === FREEMIUM_RESOURCES.guides.free) return "FREE";
    return "TIER_2";
  }

  return "TIER_2";
}

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

export function hasUnlimitedAccess(subscriptionTier: SubscriptionTier): boolean {
  return tierMeetsRequirement(subscriptionTier, "TIER_2");
}

export function getTierCheckoutUrl(): string {
  return PREMIUM_CHECKOUT_URL;
}

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