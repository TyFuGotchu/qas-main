import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { accountTierToSubscriptionTier } from "@/lib/accessControl";
import { validatePassword } from "@/lib/security/password";
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
  const { accountTier, isAdmin, password, onboardingComplete } = body as {
    accountTier?: AccountTier;
    isAdmin?: boolean;
    password?: string;
    onboardingComplete?: boolean;
  };

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

  return NextResponse.json({
    user,
    passwordReset: Boolean(data.passwordHash),
  });
}
