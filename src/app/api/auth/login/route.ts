import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, jsonWithSession } from "@/lib/auth";
import { toUserSession } from "@/lib/session-user";
import { triggerProfileSetupReminder } from "@/lib/email/profile-reminder";
import { normalizeEmail } from "@/lib/security/origin";
import {
  checkLoginRateLimits,
  rateLimitResponse,
  recordLoginAttempt,
} from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);

    const rateLimit = checkLoginRateLimits(request, normalizedEmail);
    if (!rateLimit.allowed) {
      console.warn(
        `[auth/login] rate limited for ${normalizedEmail} (retry ${rateLimit.retryAfterSeconds}s)`
      );
      return rateLimitResponse(rateLimit.retryAfterSeconds ?? 60);
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { traderProfile: { select: { profileComplete: true } } },
    });

    if (!user) {
      recordLoginAttempt(request, normalizedEmail, false);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.passwordHash) {
      console.error(`[auth/login] user ${user.id} has empty passwordHash`);
      recordLoginAttempt(request, normalizedEmail, false);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    let valid = false;
    try {
      valid = await bcrypt.compare(password, user.passwordHash);
    } catch (err) {
      console.error("[auth/login] bcrypt.compare failed:", err);
      recordLoginAttempt(request, normalizedEmail, false);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!valid) {
      recordLoginAttempt(request, normalizedEmail, false);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    recordLoginAttempt(request, normalizedEmail, true);

    const sessionUser = toUserSession(user);

    if (sessionUser.onboardingComplete && !sessionUser.profileComplete) {
      void triggerProfileSetupReminder({
        userId: user.id,
        email: user.email,
        name: user.name,
      }).catch((err) =>
        console.error("[auth/login] profile reminder failed:", err)
      );
    }

    const token = await createSessionToken(sessionUser);

    return jsonWithSession({ user: sessionUser }, token);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Login error:", message, error);
    return NextResponse.json(
      {
        error: "Internal server error",
        ...(process.env.NODE_ENV === "production" ? {} : { detail: message }),
      },
      { status: 500 }
    );
  }
}
