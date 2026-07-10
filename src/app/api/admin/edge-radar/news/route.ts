import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const news = await prisma.edgeRadarNewsItem.findMany({
    orderBy: { publishedAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ news });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { sport, headline, summary, impactScore, source, active } = body as {
    sport: string;
    headline: string;
    summary: string;
    impactScore: number;
    source?: string;
    active?: boolean;
  };

  if (!sport || !headline || !summary || impactScore == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const item = await prisma.edgeRadarNewsItem.create({
    data: {
      sport,
      headline,
      summary,
      impactScore: Math.min(100, Math.max(1, Math.round(impactScore))),
      source: source ?? null,
      active: active ?? true,
    },
  });

  return NextResponse.json({ news: item });
}