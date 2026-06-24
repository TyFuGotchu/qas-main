import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAllowedOrigin } from "@/lib/security/origin";
import {
  authenticateTradeLocker,
  TradeLockerApiError,
} from "@/lib/tradelocker/client";
import { setTradeLockerTokenCookies } from "@/lib/tradelocker/cookies";
import {
  enforceRateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

const AUTH_LIMIT = 5;
const AUTH_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rateLimit = enforceRateLimit(
      request,
      "tradelocker-auth",
      AUTH_LIMIT,
      AUTH_WINDOW_MS
    );
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.retryAfterSeconds ?? 60);
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const server = typeof body.server === "string" ? body.server.trim() : "";

    if (!email || !password || !server) {
      return NextResponse.json(
        { error: "Email, password, and server are required" },
        { status: 400 }
      );
    }

    const tokens = await authenticateTradeLocker({ email, password, server });
    await setTradeLockerTokenCookies(tokens);

    return NextResponse.json({
      connected: true,
      expireDate: tokens.expireDate,
    });
  } catch (error) {
    if (error instanceof TradeLockerApiError) {
      const message =
        error.status === 400 || error.status === 401
          ? "Invalid TradeLocker credentials or server"
          : error.message;
      return NextResponse.json({ error: message }, { status: error.status });
    }

    console.error("[tradelocker/auth]", error);
    return NextResponse.json(
      { error: "Failed to connect TradeLocker account" },
      { status: 500 }
    );
  }
}