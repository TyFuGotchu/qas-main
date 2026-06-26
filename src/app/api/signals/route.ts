import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { canAccessBot } from "@/lib/tiers";
import { MARKET_SYMBOLS } from "@/lib/market-data/symbols";
import type { MarketSymbol } from "@/lib/market-data/types";
import { isLiveSignalsEnabled } from "@/lib/signals/feature";
import { startSignalEngine } from "@/lib/signals/engine";
import { getActiveSignals, getMarketState } from "@/lib/signals/store";

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

  if (!isLiveSignalsEnabled()) {
    return NextResponse.json(
      { error: "Live trade signals are temporarily unavailable" },
      { status: 503 }
    );
  }

  startSignalEngine();

  const asset = parseAsset(request.nextUrl.searchParams.get("asset"));

  return NextResponse.json({
    signals: getActiveSignals(asset ?? undefined),
    marketState: asset ? getMarketState(asset) : null,
  });
}