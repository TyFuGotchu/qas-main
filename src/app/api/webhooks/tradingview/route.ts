import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * TradingView Master Suite → TradeLocker copy webhook.
 * Payload schema is TBD (Ty). This stub authenticates, logs, and returns 200.
 * Does not execute trades until the alert JSON is wired.
 */
export async function POST(request: NextRequest) {
  const expected = process.env.TRADINGVIEW_WEBHOOK_SECRET?.trim();
  const provided =
    request.nextUrl.searchParams.get("secret") ||
    request.headers.get("x-webhook-secret") ||
    "";

  if (expected && provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let raw: unknown = null;
  try {
    raw = await request.json();
  } catch {
    raw = null;
  }

  const keys =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? Object.keys(raw as Record<string, unknown>).slice(0, 24)
      : [];

  console.info("[tradingview-webhook] accepted stub", {
    live: false,
    keys,
    note: "Payload parser waiting on Ty. Flatten wins when armed. Copy off by default.",
  });

  return NextResponse.json({
    ok: true,
    live: false,
    status: "accepted",
    message: "Webhook stub. Alert JSON not wired. No order sent.",
  });
}
