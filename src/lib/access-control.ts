import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { toUserSession } from "@/lib/session-user";
import { canAccessToolsBySubscription } from "@/lib/tiers";
import type { UserSession } from "@/types";

export async function getFreshSession(): Promise<UserSession | null> {
  const jwtSession = await getSession();
  if (!jwtSession) return null;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: jwtSession.id },
      include: { traderProfile: { select: { profileComplete: true } } },
    });

    if (!dbUser) return null;

    return toUserSession(dbUser);
  } catch (error) {
    console.error("[getFreshSession] Database lookup failed:", error);
    return jwtSession;
  }
}

export async function enforceAuthenticatedDashboardAccess(): Promise<UserSession> {
  const user = await getFreshSession();

  if (!user) {
    redirect("/login");
  }

  if (!user.onboardingComplete) {
    redirect("/onboarding/pricing");
  }

  if (!user.profileComplete) {
    redirect("/onboarding/profile");
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