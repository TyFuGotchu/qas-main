import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireForumSession } from "@/lib/forum/require-auth";
import { FORUM_TOPICS } from "@/lib/forum/topics";

export const dynamic = "force-dynamic";

const VALID_TOPICS = new Set(FORUM_TOPICS.map((t) => t.id));

export async function GET(request: NextRequest) {
  const auth = await requireForumSession();
  if (auth.error) return auth.error;

  const topic = request.nextUrl.searchParams.get("topic");

  const threads = await prisma.forumThread.findMany({
    where: topic && VALID_TOPICS.has(topic as never) ? { topic } : undefined,
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    take: 50,
    include: {
      author: { select: { id: true, name: true, email: true } },
      _count: { select: { messages: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true, content: true },
      },
    },
  });

  return NextResponse.json({ threads });
}

export async function POST(request: NextRequest) {
  const auth = await requireForumSession();
  if (auth.error) return auth.error;

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const topic = String(body.topic ?? "general").trim();
  const description = body.description
    ? String(body.description).trim()
    : null;

  if (title.length < 3 || title.length > 120) {
    return NextResponse.json(
      { error: "Title must be 3–120 characters" },
      { status: 400 }
    );
  }

  if (!VALID_TOPICS.has(topic as never)) {
    return NextResponse.json({ error: "Invalid topic" }, { status: 400 });
  }

  const thread = await prisma.forumThread.create({
    data: {
      title,
      topic,
      description,
      authorId: auth.session.id,
    },
    include: {
      author: { select: { id: true, name: true, email: true } },
      _count: { select: { messages: true } },
    },
  });

  return NextResponse.json({ thread }, { status: 201 });
}