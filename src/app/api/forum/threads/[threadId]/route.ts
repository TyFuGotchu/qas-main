import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireForumSession } from "@/lib/forum/require-auth";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { threadId: string } }
) {
  const auth = await requireForumSession();
  if (auth.error) return auth.error;

  const thread = await prisma.forumThread.findUnique({
    where: { id: params.threadId },
    include: {
      author: { select: { id: true, name: true, email: true } },
      _count: { select: { messages: true } },
    },
  });

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  return NextResponse.json({ thread });
}