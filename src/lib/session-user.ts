import { isAdminUser, getAdminEmail } from "@/lib/admin";
import {
  accountTierToSubscriptionTier,
  resolveSubscriptionTier,
} from "@/lib/accessControl";
import type { AccountTier, SubscriptionTier, UserSession } from "@/types";

interface DbUser {
  id: string;
  email: string;
  name: string | null;
  subscriptionTier?: SubscriptionTier | string | null;
  accountTier: string;
  isAdmin: boolean;
  onboardingComplete: boolean;
  traderProfile?: { profileComplete: boolean } | null;
}

export function toUserSession(user: DbUser): UserSession {
  const subscriptionTier =
    (user.subscriptionTier as SubscriptionTier | null) ??
    accountTierToSubscriptionTier(user.accountTier);

  const session: UserSession = {
    id: user.id,
    email: user.email,
    name: user.name,
    subscriptionTier: resolveSubscriptionTier({ subscriptionTier }),
    accountTier: user.accountTier as AccountTier,
    isAdmin: user.isAdmin || user.email === getAdminEmail(),
    onboardingComplete: user.onboardingComplete,
    profileComplete: user.traderProfile?.profileComplete ?? false,
  };
  return session;
}

export function assertAdmin(user: UserSession | null): UserSession {
  if (!user || !isAdminUser(user)) {
    throw new Error("Unauthorized");
  }
  return user;
}