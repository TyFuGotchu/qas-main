import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const { title, content, active } = body as {
    title?: string;
    content?: string;
    active?: boolean;
  };

  const data: { title?: string; content?: string; active?: boolean } = {};

  if (typeof title === "string") {
    if (!title.trim()) {
      return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
    }
    data.title = title.trim();
  }

  if (typeof content === "string") {
    if (!content.trim()) {
      return NextResponse.json(
        { error: "Content cannot be empty" },
        { status: 400 }
      );
    }
    data.content = content.trim();
  }

  if (typeof active === "boolean") {
    data.active = active;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  try {
    const announcement = await prisma.announcement.update({
      where: { id: params.id },
      data,
      include: {
        author: { select: { name: true, email: true } },
      },
    });
    return NextResponse.json({ announcement });
  } catch {
    return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.announcement.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
  }
}
