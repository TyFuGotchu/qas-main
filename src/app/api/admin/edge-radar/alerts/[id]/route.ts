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

  const fields = [
    "sport",
    "player",
    "propType",
    "line",
    "signal",
    "detail",
    "evPercent",
    "books",
    "active",
  ] as const;

  for (const field of fields) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }

  const alert = await prisma.edgeRadarPropAlert.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ alert });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.edgeRadarPropAlert.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}