import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  authenticateTradeLockerWithFallback,
  TradeLockerApiError,
} from "@/lib/tradelocker/client";
import { setTradeLockerTokenCookies } from "@/lib/tradelocker/cookies";
import {
  isTradeLockerEnvironment,
  type TradeLockerEnvironment,
} from "@/lib/tradelocker/constants";
import {
  enforceRateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

const AUTH_LIMIT = 10;
const AUTH_WINDOW_MS = 15 * 60 * 1000;

function authErrorMessage(
  error: TradeLockerApiError,
  server: string
): string {
  if (error.status === 400 || error.status === 401 || error.status === 403) {
    return (
      `${error.message} — verify your email/password, and enter the exact server ` +
      `name from the TradeLocker login screen (you entered "${server}"). ` +
      `If this is a demo account, select Demo environment.`
    );
  }
  return error.message;
}

export async function POST(request: NextRequest) {
  let serverForErrors = "";

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    serverForErrors = server;
    const environmentInput =
      typeof body.environment === "string" ? body.environment : "live";
    const environment: TradeLockerEnvironment = isTradeLockerEnvironment(
      environmentInput
    )
      ? environmentInput
      : "live";

    if (!email || !password || !server) {
      return NextResponse.json(
        { error: "Email, password, and server are required" },
        { status: 400 }
      );
    }

    const { tokens, environment: resolvedEnvironment } =
      await authenticateTradeLockerWithFallback(
        { email, password, server },
        environment
      );

    await setTradeLockerTokenCookies(tokens, resolvedEnvironment);

    return NextResponse.json({
      connected: true,
      expireDate: tokens.expireDate,
      environment: resolvedEnvironment,
    });
  } catch (error) {
    if (error instanceof TradeLockerApiError) {
      return NextResponse.json(
        {
          error: authErrorMessage(error, serverForErrors),
        },
        { status: error.status >= 400 && error.status < 600 ? error.status : 502 }
      );
    }

    console.error("[tradelocker/auth]", error);
    return NextResponse.json(
      { error: "Failed to connect TradeLocker account" },
      { status: 500 }
    );
  }
}