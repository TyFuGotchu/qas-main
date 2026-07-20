import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const emails = await prisma.supportInboundEmail.findMany({
    where: { archived: false },
    orderBy: { receivedAt: "desc" },
    take: 100,
  });

  const unreadCount = await prisma.supportInboundEmail.count({
    where: { read: false, archived: false },
  });

  return NextResponse.json({ emails, unreadCount });
}
