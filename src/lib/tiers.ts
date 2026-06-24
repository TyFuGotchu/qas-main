import {
  canAccessDiscord as canAccessDiscordTier,
  hasUnlimitedAccess,
  tierMeetsRequirement,
} from "@/lib/accessControl";
import { ACCOUNT_TIERS, type AccountTier, type SubscriptionTier } from "@/types";

export function isPremiumTier(tier: AccountTier): boolean {
  return tier === ACCOUNT_TIERS.PREMIUM_QUANT;
}

export function isPremiumSubscription(tier: SubscriptionTier): boolean {
  return tierMeetsRequirement(tier, "TIER_2");
}

export function canAccessTools(tier: AccountTier | SubscriptionTier): boolean {
  if (typeof tier === "string" && tier.startsWith("TIER")) {
    return hasUnlimitedAccess(tier as SubscriptionTier);
  }
  return isPremiumTier(tier as AccountTier);
}

export function canAccessToolsBySubscription(tier: SubscriptionTier): boolean {
  return hasUnlimitedAccess(tier);
}

export function canAccessAcademy(tier: SubscriptionTier): boolean {
  return tierMeetsRequirement(tier, "FREE");
}

export function canAccessDiscord(tier: SubscriptionTier): boolean {
  return canAccessDiscordTier(tier);
}

export function canAccessBot(tier: AccountTier | SubscriptionTier): boolean {
  if (typeof tier === "string" && ["FREE", "TIER_1", "TIER_2", "LIFETIME"].includes(tier)) {
    return tierMeetsRequirement(tier as SubscriptionTier, "TIER_2");
  }
  return tier === ACCOUNT_TIERS.PREMIUM_QUANT;
}

export function getTierBadgeColor(tier: AccountTier): string {
  switch (tier) {
    case ACCOUNT_TIERS.PREMIUM_QUANT:
      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/40";
    case ACCOUNT_TIERS.FREE:
    default:
      return "bg-slate-500/20 text-slate-400 border-slate-500/40";
  }
}

export function getTierLevel(tier: AccountTier): number {
  switch (tier) {
    case ACCOUNT_TIERS.PREMIUM_QUANT:
      return 2;
    case ACCOUNT_TIERS.FREE:
    default:
      return 1;
  }
}