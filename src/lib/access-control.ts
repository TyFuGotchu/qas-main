import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getSession,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth";
import { toUserSession } from "@/lib/session-user";
import { canAccessToolsBySubscription } from "@/lib/tiers";
import type { UserSession } from "@/types";

function sessionNeedsRefresh(
  jwtSession: UserSession,
  freshSession: UserSession
): boolean {
  return (
    jwtSession.subscriptionTier !== freshSession.subscriptionTier ||
    jwtSession.accountTier !== freshSession.accountTier ||
    jwtSession.onboardingComplete !== freshSession.onboardingComplete ||
    jwtSession.isAdmin !== freshSession.isAdmin
  );
}

export async function getFreshSession(): Promise<UserSession | null> {
  const jwtSession = await getSession();
  if (!jwtSession) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: jwtSession.id },
  });

  if (!dbUser) return null;

  const freshSession = toUserSession(dbUser);

  if (sessionNeedsRefresh(jwtSession, freshSession)) {
    const token = await createSessionToken(freshSession);
    await setSessionCookie(token);
  }

  return freshSession;
}

export async function enforceAuthenticatedDashboardAccess(): Promise<UserSession> {
  const user = await getFreshSession();

  if (!user) {
    redirect("/login");
  }

  if (!user.onboardingComplete) {
    redirect("/onboarding/pricing");
  }

  return user;
}

/** Unlimited tools access — TIER_2 and LIFETIME */
export async function requirePremiumAccess(): Promise<UserSession> {
  const user = await enforceAuthenticatedDashboardAccess();

  if (!canAccessToolsBySubscription(user.subscriptionTier)) {
    redirect("/dashboard/upgrade?paywall=tools");
  }

  return user;
}

export async function requirePremiumDownloads(): Promise<UserSession> {
  return requirePremiumAccess();
}