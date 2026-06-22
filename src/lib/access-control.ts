import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getSession,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth";
import { toUserSession } from "@/lib/session-user";
import { canAccessAcademy, canAccessDiscord, canAccessTools } from "@/lib/tiers";
import type { UserSession } from "@/types";

function sessionNeedsRefresh(
  jwtSession: UserSession,
  freshSession: UserSession
): boolean {
  return (
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

/** Premium Quant ($199) and Lifetime Alpha — tools, academy, Discord */
export async function requirePremiumAccess(): Promise<UserSession> {
  const user = await enforceAuthenticatedDashboardAccess();

  if (!canAccessTools(user.accountTier)) {
    redirect("/dashboard/upgrade?paywall=tools");
  }

  return user;
}

/** Chart Academy — lessons and guides ($199 tier and above) */
export async function requireAcademyAccess(): Promise<UserSession> {
  const user = await enforceAuthenticatedDashboardAccess();

  if (!canAccessAcademy(user.accountTier)) {
    redirect("/dashboard/upgrade?paywall=academy");
  }

  return user;
}

/** VIP Discord portal ($199 tier and above) */
export async function requireDiscordAccess(): Promise<UserSession> {
  const user = await enforceAuthenticatedDashboardAccess();

  if (!canAccessDiscord(user.accountTier)) {
    redirect("/dashboard/upgrade?paywall=discord");
  }

  return user;
}

export async function requirePremiumDownloads(): Promise<UserSession> {
  return requirePremiumAccess();
}