import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { accountTierToSubscriptionTier } from "@/lib/accessControl";
import { validatePassword } from "@/lib/security/password";
import { sendPremiumAccessConfirmation } from "@/lib/email/premium-confirmation";
import { triggerOnboardingSequence } from "@/lib/email/onboarding-sequence";
import { isPremiumTier } from "@/lib/tiers";
import { ACCOUNT_TIERS, type AccountTier } from "@/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const {
    accountTier,
    isAdmin,
    password,
    onboardingComplete,
    sendAccessEmail,
  } = body as {
    accountTier?: AccountTier;
    isAdmin?: boolean;
    password?: string;
    onboardingComplete?: boolean;
    /** When true and user becomes Premium, send confirmation email. Default true for upgrades. */
    sendAccessEmail?: boolean;
  };

  const existing = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      email: true,
      name: true,
      accountTier: true,
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const data: {
    accountTier?: string;
    subscriptionTier?: "FREE" | "TIER_1" | "TIER_2" | "LIFETIME";
    isAdmin?: boolean;
    passwordHash?: string;
    onboardingComplete?: boolean;
  } = {};

  if (accountTier) {
    const validTiers = Object.values(ACCOUNT_TIERS);
    if (!validTiers.includes(accountTier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }
    data.accountTier = accountTier;
    data.subscriptionTier = accountTierToSubscriptionTier(accountTier);

    // Granting Premium should unlock the dashboard without a stuck onboarding loop
    if (isPremiumTier(accountTier) && onboardingComplete === undefined) {
      data.onboardingComplete = true;
    }
  }

  if (typeof isAdmin === "boolean") {
    data.isAdmin = isAdmin;
  }

  if (typeof onboardingComplete === "boolean") {
    data.onboardingComplete = onboardingComplete;
  }

  if (typeof password === "string" && password.length > 0) {
    const check = validatePassword(password);
    if (!check.valid) {
      return NextResponse.json({ error: check.error }, { status: 400 });
    }
    data.passwordHash = await bcrypt.hash(password, 12);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      accountTier: true,
      isAdmin: true,
      onboardingComplete: true,
      createdAt: true,
    },
  });

  const previousTier = existing.accountTier as AccountTier;
  const nextTier = user.accountTier as AccountTier;
  const becamePremium =
    isPremiumTier(nextTier) && !isPremiumTier(previousTier);

  let accessEmail: {
    attempted: boolean;
    ok: boolean;
    error?: string;
    skipped?: boolean;
  } = { attempted: false, ok: false };

  // Default: email on first grant to Premium. Admin can force resend with sendAccessEmail: true
  // even if already premium (e.g. paid but never got mail).
  const shouldSendAccessEmail =
    sendAccessEmail === true ||
    (becamePremium && sendAccessEmail !== false);

  if (shouldSendAccessEmail && isPremiumTier(nextTier)) {
    accessEmail.attempted = true;
    try {
      const result = await sendPremiumAccessConfirmation({
        userId: user.id,
        email: user.email,
        name: user.name,
        accountTier: nextTier,
      });
      accessEmail = {
        attempted: true,
        ok: result.ok,
        error: result.error,
        skipped: result.skipped,
      };

      // Playbook Day-1 drip after access email (confirmation already sent above)
      if (becamePremium) {
        triggerOnboardingSequence({
          userId: user.id,
          email: user.email,
          name: user.name,
          accountTier: nextTier,
          skipConfirmation: true,
        }).catch((err) =>
          console.error("[admin] playbook onboarding after grant:", err)
        );
      }
    } catch (err) {
      console.error("[admin] premium confirmation email failed:", err);
      accessEmail = {
        attempted: true,
        ok: false,
        error: err instanceof Error ? err.message : "Email send failed",
      };
    }
  }

  return NextResponse.json({
    user,
    passwordReset: Boolean(data.passwordHash),
    premiumGranted: becamePremium,
    accessEmail,
  });
}
