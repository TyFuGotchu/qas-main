import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, createSessionToken, setSessionCookie } from "@/lib/auth";
import { toUserSession } from "@/lib/session-user";


export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.update({
      where: { id: session.id },
      data: {
        onboardingComplete: true,
      },
    });

    const sessionUser = toUserSession(user);
    const token = await createSessionToken(sessionUser);
    await setSessionCookie(token);

    return NextResponse.json({ user: sessionUser });
  } catch (error) {
    console.error("Onboarding complete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}