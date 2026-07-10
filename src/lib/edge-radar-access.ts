import { prisma } from "@/lib/prisma";
import { isAdminUser } from "@/lib/admin";
import type { UserSession } from "@/types";

export async function userHasEdgeRadarAccess(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      edgeRadarAccess: true,
      isAdmin: true,
      email: true,
    },
  });

  if (!user) return false;

  const sessionLike: UserSession = {
    id: userId,
    email: user.email,
    name: null,
    subscriptionTier: "FREE",
    accountTier: "Free",
    isAdmin: user.isAdmin,
    onboardingComplete: true,
    profileComplete: true,
    edgeRadarAccess: user.edgeRadarAccess,
  };

  return user.edgeRadarAccess || isAdminUser(sessionLike);
}

export function sessionHasEdgeRadarAccess(session: UserSession): boolean {
  return Boolean(session.edgeRadarAccess || isAdminUser(session));
}