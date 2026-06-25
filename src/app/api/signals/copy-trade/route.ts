import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { canAccessBot } from "@/lib/tiers";
import { placeOrder, TradeLockerApiError } from "@/lib/tradelocker/client";
import { computePositionSize } from "@/lib/tradelocker/account-tools";
import { defaultPipValue, defaultStopPips } from "@/lib/signals/market-symbols";
import {
  getSignalById,
  markSignalExecuted,
} from "@/lib/signals/store";
import {
  enforceRateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

const COPY_TRADE_LIMIT = 15;
const COPY_TRADE_WINDOW_MS = 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canAccessBot(session.subscriptionTier)) {
      return NextResponse.json(
        { error: "Premium required for copy trade execution" },
        { status: 403 }
      );
    }

    const rateLimit = enforceRateLimit(
      request,
      "signals-copy-trade",
      COPY_TRADE_LIMIT,
      COPY_TRADE_WINDOW_MS
    );
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.retryAfterSeconds ?? 60);
    }

    const body = await request.json().catch(() => ({}));
    const signalId =
      typeof body.signalId === "string" ? body.signalId.trim() : "";
    const accountId =
      typeof body.accountId === "string" ? body.accountId.trim() : "";
    const accNum = typeof body.accNum === "string" ? body.accNum.trim() : "";
    const tradableInstrumentId = Number(body.tradableInstrumentId);
    const routeId = Number(body.routeId);
    const balance = Number(body.balance);
    const riskPerTradePct = Math.min(
      5,
      Math.max(0.25, Number(body.riskPerTradePct) || 1)
    );

    if (!signalId || !accountId || !accNum) {
      return NextResponse.json(
        { error: "signalId, accountId, and accNum are required" },
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

    const signal = getSignalById(signalId);
    if (!signal) {
      return NextResponse.json({ error: "Signal not found" }, { status: 404 });
    }

    if (signal.status !== "active") {
      return NextResponse.json(
        { error: `Signal is ${signal.status} — cannot copy trade` },
        { status: 409 }
      );
    }

    const sizing = computePositionSize(
      Number.isFinite(balance) && balance > 0 ? balance : 10_000,
      [],
      {
        riskPerTradePct,
        stopLossPips: defaultStopPips(signal.asset),
        pipValuePerLot: defaultPipValue(signal.asset),
      }
    );

    const qty = Math.max(0.01, sizing.suggestedLots);
    const side = signal.direction === "BUY" ? "buy" : "sell";

    await placeOrder(accountId, accNum, {
      side,
      qty,
      routeId,
      tradableInstrumentId,
    });

    const executed = markSignalExecuted(signalId);

    return NextResponse.json({
      success: true,
      executedQty: qty,
      side,
      signal: executed,
    });
  } catch (error) {
    if (error instanceof TradeLockerApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[signals/copy-trade]", error);
    return NextResponse.json(
      { error: "Copy trade execution failed" },
      { status: 500 }
    );
  }
}