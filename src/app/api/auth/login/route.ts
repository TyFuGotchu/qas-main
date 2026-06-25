import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, jsonWithSession } from "@/lib/auth";
import { toUserSession } from "@/lib/session-user";
import { normalizeEmail } from "@/lib/security/origin";
import {
  enforceRateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

const LOGIN_LIMIT = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const rateLimit = enforceRateLimit(
      request,
      "auth-login",
      LOGIN_LIMIT,
      LOGIN_WINDOW_MS
    );
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.retryAfterSeconds ?? 60);
    }

    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { traderProfile: { select: { profileComplete: true } } },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const sessionUser = toUserSession(user);
    const token = await createSessionToken(sessionUser);

    return jsonWithSession({ user: sessionUser }, token);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Login error:", message, error);
    return NextResponse.json(
      {
        error: "Internal server error",
        ...(process.env.NODE_ENV === "production"
          ? {}
          : { detail: message }),
      },
      { status: 500 }
    );
  }
}

