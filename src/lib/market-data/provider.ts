import {
  buildCorrelationMatrix,
  detectLiquidityVoids,
  detectTrapZones,
  returnsFromCandles,
} from "./analytics";
import { fetchFinnhubMacroCalendar, hasFinnhubKey } from "./finnhub";
import {
  getMockCandles,
  getMockCorrelationMatrix,
  getMockLiquidityZones,
  getMockMacroCalendar,
  getMockQuotes,
  getMockSessions,
  getMockTrapZones,
} from "./mock-provider";
import {
  CORRELATION_SYMBOLS,
  MARKET_SYMBOLS,
} from "./symbols";
import {
  fetchTwelveAtr,
  fetchTwelveCandles,
  fetchTwelveQuotes,
  hasTwelveDataKey,
} from "./twelve-data";
import type {
  Candle,
  CorrelationCell,
  LiquidityZone,
  MacroEvent,
  MarketSessions,
  MarketSymbol,
  Quote,
  TrapZone,
} from "./types";

export type DataSource = "live" | "mock" | "hybrid";

export function getDataSource(): DataSource {
  if (hasTwelveDataKey() && hasFinnhubKey()) return "live";
  if (hasTwelveDataKey() || hasFinnhubKey()) return "hybrid";
  return "mock";
}

export async function fetchQuotes(): Promise<Quote[]> {
  if (hasTwelveDataKey()) {
    const live = await fetchTwelveQuotes(MARKET_SYMBOLS);
    if (live.length > 0) return live;
  }
  return getMockQuotes();
}

export async function fetchCandles(
  symbol: MarketSymbol,
  count = 120,
  interval = "5min"
): Promise<Candle[]> {
  if (hasTwelveDataKey()) {
    const live = await fetchTwelveCandles(symbol, count, interval);
    if (live.length > 0) return live;
  }
  const intervalMinutes = interval === "1min" ? 1 : 5;
  return getMockCandles(symbol, count, intervalMinutes);
}

export async function fetchCorrelationMatrix(): Promise<CorrelationCell[]> {
  if (hasTwelveDataKey()) {
    const candleEntries = await Promise.all(
      CORRELATION_SYMBOLS.map(async (symbol) => {
        const candles = await fetchTwelveCandles(symbol, 90, "5min");
        return [symbol, candles] as const;
      })
    );

    const hasData = candleEntries.every(([, candles]) => candles.length >= 10);
    if (hasData) {
      const candlesBySymbol = Object.fromEntries(candleEntries) as Partial<
        Record<MarketSymbol, Candle[]>
      >;
      const series = Object.fromEntries(
        candleEntries.map(([symbol, candles]) => [
          symbol,
          returnsFromCandles(candles),
        ])
      ) as Partial<Record<MarketSymbol, number[]>>;
      return buildCorrelationMatrix(
        series,
        CORRELATION_SYMBOLS,
        candlesBySymbol
      );
    }
  }
  return getMockCorrelationMatrix();
}

export async function fetchMacroCalendar(): Promise<MacroEvent[]> {
  if (hasFinnhubKey()) {
    const live = await fetchFinnhubMacroCalendar();
    if (live.length > 0) return live;
  }
  return getMockMacroCalendar();
}

export async function fetchLiquidityZones(
  symbol: MarketSymbol
): Promise<LiquidityZone[]> {
  const candles = await fetchCandles(symbol, 100);
  const quotes = await fetchQuotes();
  const quote = quotes.find((q) => q.symbol === symbol);
  const price = quote?.price ?? candles.at(-1)?.close ?? 0;

  if (candles.length >= 20) {
    return detectLiquidityVoids(candles, price);
  }
  return getMockLiquidityZones(symbol);
}

export async function fetchTrapZones(): Promise<TrapZone[]> {
  const symbols: MarketSymbol[] = ["XAUUSD", "XAGUSD", "NAS100", "US30"];
  const traps: TrapZone[] = [];

  for (const symbol of symbols) {
    const candles = await fetchCandles(symbol, 80);
    if (candles.length >= 15) {
      traps.push(...detectTrapZones(symbol, candles));
    }
  }

  if (traps.length > 0) {
    return traps.sort((a, b) => b.strength - a.strength).slice(0, 8);
  }
  return getMockTrapZones();
}

export async function fetchSessions(): Promise<MarketSessions> {
  const utcHour = new Date().getUTCHours();
  const asiaOpen = utcHour >= 0 && utcHour < 8;
  const londonOpen = utcHour >= 7 && utcHour < 16;
  const nyOpen = utcHour >= 13 && utcHour < 22;
  const overlapActive = londonOpen && nyOpen;

  let compositeAtr = 0;
  let asiaAtr = 0;
  let londonAtr = 0;
  let nyAtr = 0;

  if (hasTwelveDataKey()) {
    const [xauAtr, nasAtr, xagAtr, us30Atr] = await Promise.all([
      fetchTwelveAtr("XAUUSD"),
      fetchTwelveAtr("NAS100"),
      fetchTwelveAtr("XAGUSD"),
      fetchTwelveAtr("US30"),
    ]);
    londonAtr = Math.round(xauAtr || 0);
    nyAtr = Math.round(((nasAtr || 0) + (us30Atr || 0)) / 2);
    asiaAtr = Math.round(xagAtr || xauAtr * 0.6 || 0);
    compositeAtr = Math.round((londonAtr + nyAtr + asiaAtr) / 3);
  }

  if (compositeAtr === 0) {
    return getMockSessions();
  }

  const overlapBoost = overlapActive ? 1.35 : 1;
  compositeAtr = Math.round(compositeAtr * overlapBoost);

  return {
    utcHour,
    sessions: [
      {
        name: "Asia",
        open: asiaOpen,
        atr: asiaAtr,
        volatilityRank: asiaOpen ? 2 : 0,
      },
      {
        name: "London",
        open: londonOpen,
        atr: londonAtr,
        volatilityRank: londonOpen ? 3 : 0,
      },
      {
        name: "NewYork",
        open: nyOpen,
        atr: nyAtr,
        volatilityRank: nyOpen ? 3 : 0,
      },
    ],
    overlapActive,
    overlapLabel: overlapActive ? "London × New York" : null,
    compositeAtr,
  };
}