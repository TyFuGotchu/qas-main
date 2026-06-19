import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, createSessionToken, setSessionCookie } from "@/lib/auth";
import { toUserSession } from "@/lib/session-user";
import { ACCOUNT_TIERS, type AccountTier } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { accountTier } = body as { accountTier: AccountTier };

    const validTiers: AccountTier[] = [
      ACCOUNT_TIERS.BOT_ONLY,
      ACCOUNT_TIERS.PREMIUM_QUANT,
      ACCOUNT_TIERS.LIFETIME_ALPHA,
    ];

    if (!validTiers.includes(accountTier)) {
      return NextResponse.json({ error: "Invalid tier selection" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.id },
      data: {
        accountTier,
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