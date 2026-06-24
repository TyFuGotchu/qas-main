export type SubscriptionTier = "FREE" | "TIER_1" | "TIER_2" | "LIFETIME";

export type AccountTier = "Free" | "Bot Only" | "Premium Quant" | "Lifetime Alpha";

export interface UserSession {
  id: string;
  email: string;
  name: string | null;
  subscriptionTier: SubscriptionTier;
  accountTier: AccountTier;
  isAdmin: boolean;
  onboardingComplete: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  active: boolean;
  createdAt: string;
  author?: { name: string | null; email: string };
}

export interface PricingTier {
  id: string;
  name: string;
  tier: AccountTier;
  price: string;
  period: string;
  features: string[];
  ctaLink?: string;
  recommended?: boolean;
}

export const ACCOUNT_TIERS = {
  FREE: "Free" as AccountTier,
  BOT_ONLY: "Bot Only" as AccountTier,
  PREMIUM_QUANT: "Premium Quant" as AccountTier,
  LIFETIME_ALPHA: "Lifetime Alpha" as AccountTier,
};

export const SUBSCRIPTION_TIERS = {
  FREE: "FREE" as SubscriptionTier,
  TIER_1: "TIER_1" as SubscriptionTier,
  TIER_2: "TIER_2" as SubscriptionTier,
  LIFETIME: "LIFETIME" as SubscriptionTier,
};

