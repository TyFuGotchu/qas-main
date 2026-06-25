import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { createSessionToken, getSession, jsonWithSession } from "@/lib/auth";
import { toUserSession } from "@/lib/session-user";

export async function POST() {
  try {
    const jwtSession = await getSession();
    if (!jwtSession) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: jwtSession.id },
    });

    if (!dbUser) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const freshSession = toUserSession(dbUser);
    const token = await createSessionToken(freshSession);

    return jsonWithSession({ user: freshSession }, token);
  } catch (error) {
    console.error("[auth/refresh-session]", error);
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    );
  }
}