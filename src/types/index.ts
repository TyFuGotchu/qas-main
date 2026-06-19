export type AccountTier = "Bot Only" | "Premium Quant" | "Lifetime Alpha";

export interface UserSession {
  id: string;
  email: string;
  name: string | null;
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
  ctaLink: string;
  recommended?: boolean;
}

export const ACCOUNT_TIERS = {
  BOT_ONLY: "Bot Only" as AccountTier,
  PREMIUM_QUANT: "Premium Quant" as AccountTier,
  LIFETIME_ALPHA: "Lifetime Alpha" as AccountTier,
};

