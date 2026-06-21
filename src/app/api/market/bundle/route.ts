import { NextRequest, NextResponse } from "next/server";
import {
  MARKET_CANDLE_COUNT,
  MARKET_CANDLE_INTERVAL,
} from "@/lib/market-data/config";
import {
  fetchCandlesForSymbols,
  fetchQuotes,
  getDataSource,
} from "@/lib/market-data/provider";
import { CORRELATION_SYMBOLS, MARKET_SYMBOLS } from "@/lib/market-data/symbols";
import type { MarketSymbol } from "@/lib/market-data/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const candleSymbolsParam = params.get("candleSymbols");
  const fetchAll = params.get("all") === "true";

  const candleSymbols: MarketSymbol[] = fetchAll
    ? (Array.from(new Set([...CORRELATION_SYMBOLS, "BTCUSD"])) as MarketSymbol[])
    : candleSymbolsParam
    ? (candleSymbolsParam.split(",").filter((s) =>
        MARKET_SYMBOLS.includes(s as MarketSymbol)
      ) as MarketSymbol[])
    : (["XAUUSD"] as MarketSymbol[]);

  const [quotes, candles] = await Promise.all([
    fetchQuotes(),
    fetchCandlesForSymbols(candleSymbols, MARKET_CANDLE_COUNT, MARKET_CANDLE_INTERVAL),
  ]);

  return NextResponse.json({
    quotes,
    candles,
    source: getDataSource(),
    polledAt: Date.now(),
    interval: MARKET_CANDLE_INTERVAL,
  });
}