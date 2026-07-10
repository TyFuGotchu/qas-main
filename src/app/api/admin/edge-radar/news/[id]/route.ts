import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.sport !== undefined) data.sport = body.sport;
  if (body.headline !== undefined) data.headline = body.headline;
  if (body.summary !== undefined) data.summary = body.summary;
  if (body.source !== undefined) data.source = body.source;
  if (body.active !== undefined) data.active = body.active;
  if (body.impactScore !== undefined) {
    data.impactScore = Math.min(100, Math.max(1, Math.round(body.impactScore)));
  }

  const news = await prisma.edgeRadarNewsItem.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ news });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.edgeRadarNewsItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}