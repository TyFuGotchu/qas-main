import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
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
  const { accountTier, isAdmin } = body as {
    accountTier?: AccountTier;
    isAdmin?: boolean;
  };

  const data: { accountTier?: string; isAdmin?: boolean } = {};

  if (accountTier) {
    const validTiers = Object.values(ACCOUNT_TIERS);
    if (!validTiers.includes(accountTier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }
    data.accountTier = accountTier;
  }

  if (typeof isAdmin === "boolean") {
    data.isAdmin = isAdmin;
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

  return NextResponse.json({ user });
}