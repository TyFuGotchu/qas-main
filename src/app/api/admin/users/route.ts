import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
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

  return NextResponse.json({ users });
}