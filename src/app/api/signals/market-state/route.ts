import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { canAccessBot } from "@/lib/tiers";
import { MARKET_SYMBOLS } from "@/lib/market-data/symbols";
import type { MarketSymbol } from "@/lib/market-data/types";
import { startSignalEngine } from "@/lib/signals/engine";
import { getMarketState } from "@/lib/signals/store";

function parseAsset(value: string | null): MarketSymbol | null {
  if (!value) return null;
  const upper = value.toUpperCase() as MarketSymbol;
  return MARKET_SYMBOLS.includes(upper) ? upper : null;
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canAccessBot(session.subscriptionTier)) {
    return NextResponse.json(
      { error: "Premium required for live trade signals" },
      { status: 403 }
    );
  }

  startSignalEngine();

  const asset = parseAsset(request.nextUrl.searchParams.get("asset"));
  if (!asset) {
    return NextResponse.json(
      { error: "Valid asset query param required (e.g. XAUUSD)" },
      { status: 400 }
    );
  }

  const state = getMarketState(asset);
  if (!state) {
    return NextResponse.json({
      state: {
        asset,
        timestamp: new Date().toISOString(),
        price: 0,
        changePercent: 0,
        confluenceScore: 0,
        bias: "NEUTRAL",
        trend: "ranging",
        setupStatus: "scanning",
        ema21: 0,
        ema55: 0,
        rsi: 50,
        atr: 0,
        support: 0,
        resistance: 0,
        reasons: ["Initializing live feed…"],
      },
    });
  }

  return NextResponse.json({ state });
}