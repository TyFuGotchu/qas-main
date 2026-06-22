import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireForumSession } from "@/lib/forum/require-auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const auth = await requireForumSession();
  if (auth.error) return auth.error;

  const since = request.nextUrl.searchParams.get("since");

  const messages = await prisma.forumMessage.findMany({
    where: {
      threadId: params.threadId,
      ...(since ? { createdAt: { gt: new Date(since) } } : {}),
    },
    orderBy: { createdAt: "asc" },
    take: since ? 100 : 200,
    include: {
      author: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json({ messages });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const auth = await requireForumSession();
  if (auth.error) return auth.error;

  const thread = await prisma.forumThread.findUnique({
    where: { id: params.threadId },
  });

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const body = await request.json();
  const content = String(body.content ?? "").trim();

  if (content.length < 1 || content.length > 4000) {
    return NextResponse.json(
      { error: "Message must be 1–4000 characters" },
      { status: 400 }
    );
  }

  const [message] = await prisma.$transaction([
    prisma.forumMessage.create({
      data: {
        threadId: params.threadId,
        authorId: auth.session.id,
        content,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.forumThread.update({
      where: { id: params.threadId },
      data: { updatedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ message }, { status: 201 });
}