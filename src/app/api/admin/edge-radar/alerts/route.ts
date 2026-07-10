import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const alerts = await prisma.edgeRadarPropAlert.findMany({
    orderBy: { publishedAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ alerts });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const {
    sport,
    player,
    propType,
    line,
    signal,
    detail,
    evPercent,
    books,
    active,
  } = body as {
    sport: string;
    player: string;
    propType: string;
    line: string;
    signal: string;
    detail: string;
    evPercent?: number;
    books?: string[];
    active?: boolean;
  };

  if (!sport || !player || !propType || !line || !signal || !detail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const alert = await prisma.edgeRadarPropAlert.create({
    data: {
      sport,
      player,
      propType,
      line,
      signal,
      detail,
      evPercent: evPercent ?? null,
      books: books ?? [],
      active: active ?? true,
    },
  });

  return NextResponse.json({ alert });
}