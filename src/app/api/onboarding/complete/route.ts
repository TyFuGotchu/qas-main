import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, createSessionToken, setSessionCookie } from "@/lib/auth";
import { toUserSession } from "@/lib/session-user";
import { accountTierToSubscriptionTier } from "@/lib/accessControl";
import type { AccountTier } from "@/types";

const VALID_ACCOUNT_TIERS: AccountTier[] = ["Free", "Premium Quant"];

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const accountTier = body.accountTier as AccountTier | undefined;

    if (!accountTier || !VALID_ACCOUNT_TIERS.includes(accountTier)) {
      return NextResponse.json(
        { error: "Select a valid access tier to continue" },
        { status: 400 }
      );
    }

    const subscriptionTier = accountTierToSubscriptionTier(accountTier);

    const user = await prisma.user.update({
      where: { id: session.id },
      data: {
        accountTier,
        subscriptionTier,
        onboardingComplete: true,
      },
    });

    const sessionUser = toUserSession(user);
    const token = await createSessionToken(sessionUser);
    await setSessionCookie(token);

    return NextResponse.json({ user: sessionUser });
  } catch (error) {
    console.error("Onboarding complete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}