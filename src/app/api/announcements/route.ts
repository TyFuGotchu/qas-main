import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      author: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json({ announcements });
}