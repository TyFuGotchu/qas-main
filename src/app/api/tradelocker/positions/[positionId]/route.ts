import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { closePosition, TradeLockerApiError } from "@/lib/tradelocker/client";
import {
  enforceRateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

const CLOSE_LIMIT = 30;
const CLOSE_WINDOW_MS = 60 * 1000;

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ positionId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = enforceRateLimit(
      request,
      "tradelocker-close",
      CLOSE_LIMIT,
      CLOSE_WINDOW_MS
    );
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.retryAfterSeconds ?? 60);
    }

    const { positionId } = await params;
    if (!positionId) {
      return NextResponse.json(
        { error: "positionId is required" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const accNum =
      typeof body.accNum === "string" ? body.accNum.trim() : "";
    const qtyRaw = body.qty;
    const qty = qtyRaw === undefined || qtyRaw === null ? 0 : Number(qtyRaw);

    if (!accNum) {
      return NextResponse.json({ error: "accNum is required" }, { status: 400 });
    }

    if (!Number.isFinite(qty) || qty < 0) {
      return NextResponse.json(
        { error: "qty must be 0 (full close) or a positive number" },
        { status: 400 }
      );
    }

    const result = await closePosition(positionId, accNum, qty);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    if (error instanceof TradeLockerApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[tradelocker/positions/close]", error);
    return NextResponse.json(
      { error: "Failed to close TradeLocker position" },
      { status: 500 }
    );
  }
}