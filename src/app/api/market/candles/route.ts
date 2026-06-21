import { NextRequest, NextResponse } from "next/server";
import { fetchCandles } from "@/lib/market-data/provider";
import { MARKET_SYMBOLS } from "@/lib/market-data/symbols";
import type { MarketSymbol } from "@/lib/market-data/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") as MarketSymbol | null;
  const count = Number(request.nextUrl.searchParams.get("count") ?? 120);

  if (!symbol || !MARKET_SYMBOLS.includes(symbol)) {
    return NextResponse.json({ error: "Invalid symbol" }, { status: 400 });
  }

  const candles = await fetchCandles(symbol, count);
  return NextResponse.json({ symbol, candles });
}