import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { triggerOnboardingSequence } from "@/lib/email/onboarding-sequence";
import { getSession } from "@/lib/auth";
import type { AccountTier } from "@/types";

export const dynamic = "force-dynamic";

function verifyInternalSecret(request: NextRequest): boolean {
  const secret = process.env.ONBOARDING_INTERNAL_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get("x-qs-internal-secret") === secret;
}

export async function POST(request: NextRequest) {
  const isInternal = verifyInternalSecret(request);
  const session = await getSession();

  let userId: string;
  let email: string;
  let name: string | null;
  let accountTier: AccountTier;

  if (isInternal) {
    const body = await request.json();
    userId = String(body.userId ?? "");
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    email = user.email;
    name = user.name;
    accountTier = user.accountTier as AccountTier;
  } else if (session) {
    userId = session.id;
    email = session.email;
    name = session.name;
    accountTier = session.accountTier;
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await triggerOnboardingSequence({
    userId,
    email,
    name,
    accountTier,
  });

  return NextResponse.json({
    ok: true,
    ...result,
  });
}