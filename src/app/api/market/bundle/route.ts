import { NextRequest, NextResponse } from "next/server";
import {
  MARKET_CANDLE_COUNT,
  MARKET_CANDLE_INTERVAL,
} from "@/lib/market-data/config";
import { fetchCandles, fetchQuotes, getDataSource } from "@/lib/market-data/provider";
import { CORRELATION_SYMBOLS, MARKET_SYMBOLS } from "@/lib/market-data/symbols";
import type { Candle, MarketSymbol, Quote } from "@/lib/market-data/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const candleSymbolsParam = params.get("candleSymbols");
  const fetchAll = params.get("all") === "true";

  const candleSymbols: MarketSymbol[] = fetchAll
    ? [...CORRELATION_SYMBOLS, "BTCUSD"]
    : candleSymbolsParam
    ? (candleSymbolsParam.split(",").filter((s) =>
        MARKET_SYMBOLS.includes(s as MarketSymbol)
      ) as MarketSymbol[])
    : (["XAUUSD"] as MarketSymbol[]);

  const [quotes, ...candleResults] = await Promise.all([
    fetchQuotes(),
    ...candleSymbols.map((symbol) =>
      fetchCandles(symbol, MARKET_CANDLE_COUNT, MARKET_CANDLE_INTERVAL)
    ),
  ]);

  const candles: Partial<Record<MarketSymbol, Candle[]>> = {};
  candleSymbols.forEach((symbol, i) => {
    candles[symbol] = candleResults[i] as Candle[];
  });

  return NextResponse.json({
    quotes: quotes as Quote[],
    candles,
    source: getDataSource(),
    polledAt: Date.now(),
    interval: MARKET_CANDLE_INTERVAL,
  });
}