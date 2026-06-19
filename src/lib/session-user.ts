import { isAdminUser, getAdminEmail } from "@/lib/admin";
import type { AccountTier, UserSession } from "@/types";

interface DbUser {
  id: string;
  email: string;
  name: string | null;
  accountTier: string;
  isAdmin: boolean;
  onboardingComplete: boolean;
}

export function toUserSession(user: DbUser): UserSession {
  const session: UserSession = {
    id: user.id,
    email: user.email,
    name: user.name,
    accountTier: user.accountTier as AccountTier,
    isAdmin: user.isAdmin || user.email === getAdminEmail(),
    onboardingComplete: user.onboardingComplete,
  };
  return session;
}

export function assertAdmin(user: UserSession | null): UserSession {
  if (!user || !isAdminUser(user)) {
    throw new Error("Unauthorized");
  }
  return user;
}