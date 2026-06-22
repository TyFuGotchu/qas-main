import { ACCOUNT_TIERS, type AccountTier } from "@/types";

export function isPremiumTier(tier: AccountTier): boolean {
  return (
    tier === ACCOUNT_TIERS.PREMIUM_QUANT ||
    tier === ACCOUNT_TIERS.LIFETIME_ALPHA
  );
}

/** Premium Quant ($199.99/mo) and Lifetime Alpha */
export function canAccessTools(tier: AccountTier): boolean {
  return isPremiumTier(tier);
}

/** Lessons, guides, and Chart Academy — $199 tier and above */
export function canAccessAcademy(tier: AccountTier): boolean {
  return isPremiumTier(tier);
}

/** VIP Discord — $199 tier and above only (not Bot Only) */
export function canAccessDiscord(tier: AccountTier): boolean {
  return isPremiumTier(tier);
}

export function canAccessBot(tier: AccountTier): boolean {
  return (
    tier === ACCOUNT_TIERS.BOT_ONLY ||
    tier === ACCOUNT_TIERS.PREMIUM_QUANT ||
    tier === ACCOUNT_TIERS.LIFETIME_ALPHA
  );
}

export function getTierBadgeColor(tier: AccountTier): string {
  switch (tier) {
    case ACCOUNT_TIERS.LIFETIME_ALPHA:
      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    case ACCOUNT_TIERS.PREMIUM_QUANT:
      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/40";
    case ACCOUNT_TIERS.BOT_ONLY:
    default:
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
  }
}

export function getTierLevel(tier: AccountTier): number {
  switch (tier) {
    case ACCOUNT_TIERS.LIFETIME_ALPHA:
      return 3;
    case ACCOUNT_TIERS.PREMIUM_QUANT:
      return 2;
    case ACCOUNT_TIERS.BOT_ONLY:
    default:
      return 1;
  }
}