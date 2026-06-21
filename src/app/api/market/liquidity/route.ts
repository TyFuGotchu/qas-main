import { NextRequest, NextResponse } from "next/server";
import { fetchLiquidityZones } from "@/lib/market-data/provider";
import { MARKET_SYMBOLS } from "@/lib/market-data/symbols";
import type { MarketSymbol } from "@/lib/market-data/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const symbol = (request.nextUrl.searchParams.get("symbol") ?? "XAUUSD") as MarketSymbol;

  if (!MARKET_SYMBOLS.includes(symbol)) {
    return NextResponse.json({ error: "Invalid symbol" }, { status: 400 });
  }

  const zones = await fetchLiquidityZones(symbol);
  return NextResponse.json({ symbol, zones });
}