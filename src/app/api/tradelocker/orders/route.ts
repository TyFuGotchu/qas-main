import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { placeOrder, TradeLockerApiError } from "@/lib/tradelocker/client";
import {
  enforceRateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

const ORDER_LIMIT = 30;
const ORDER_WINDOW_MS = 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = enforceRateLimit(
      request,
      "tradelocker-orders",
      ORDER_LIMIT,
      ORDER_WINDOW_MS
    );
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.retryAfterSeconds ?? 60);
    }

    const body = await request.json();
    const accountId =
      typeof body.accountId === "string" ? body.accountId.trim() : "";
    const accNum = typeof body.accNum === "string" ? body.accNum.trim() : "";
    const side = body.side === "buy" || body.side === "sell" ? body.side : null;
    const qty = Number(body.qty);
    const tradableInstrumentId = Number(body.tradableInstrumentId);
    const routeId = Number(body.routeId);

    if (!accountId || !accNum) {
      return NextResponse.json(
        { error: "accountId and accNum are required" },
        { status: 400 }
      );
    }

    if (!side) {
      return NextResponse.json(
        { error: "side must be buy or sell" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(qty) || qty <= 0) {
      return NextResponse.json(
        { error: "qty must be a positive number" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(tradableInstrumentId) || tradableInstrumentId <= 0) {
      return NextResponse.json(
        { error: "tradableInstrumentId is required" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(routeId) || routeId <= 0) {
      return NextResponse.json(
        { error: "routeId is required" },
        { status: 400 }
      );
    }

    const result = await placeOrder(accountId, accNum, {
      side,
      qty,
      routeId,
      tradableInstrumentId,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    if (error instanceof TradeLockerApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[tradelocker/orders]", error);
    return NextResponse.json(
      { error: "Failed to place TradeLocker order" },
      { status: 500 }
    );
  }
}