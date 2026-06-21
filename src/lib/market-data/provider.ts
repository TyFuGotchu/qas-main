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
  fetchTwelveCandlesSequential,
  fetchTwelveQuotesBatch,
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

function intervalToMinutes(interval: string): number {
  if (interval === "1min") return 1;
  if (interval === "15min") return 15;
  if (interval === "1h") return 60;
  return 5;
}

/** Merge live quotes per symbol; missing symbols fall back to mock individually. */
export async function fetchQuotes(): Promise<Quote[]> {
  const mockQuotes = getMockQuotes();
  const mockBySymbol = Object.fromEntries(mockQuotes.map((q) => [q.symbol, q])) as Record<
    MarketSymbol,
    Quote
  >;

  if (!hasTwelveDataKey()) return mockQuotes;

  const liveMap = await fetchTwelveQuotesBatch(MARKET_SYMBOLS);

  return MARKET_SYMBOLS.map((symbol) => liveMap.get(symbol) ?? mockBySymbol[symbol]);
}

export async function fetchCandles(
  symbol: MarketSymbol,
  count = 120,
  interval = "5min",
  anchorPrice?: number
): Promise<Candle[]> {
  if (hasTwelveDataKey()) {
    const live = await fetchTwelveCandles(symbol, count, interval);
    if (live.length > 0) return live;
  }

  const price =
    anchorPrice ??
    (await fetchQuotes()).find((q) => q.symbol === symbol)?.price;

  return getMockCandles(symbol, count, intervalToMinutes(interval), price);
}

export async function fetchCandlesForSymbols(
  symbols: MarketSymbol[],
  count = 120,
  interval = "5min"
): Promise<Partial<Record<MarketSymbol, Candle[]>>> {
  const quotes = await fetchQuotes();
  const quoteBySymbol = Object.fromEntries(quotes.map((q) => [q.symbol, q])) as Partial<
    Record<MarketSymbol, Quote>
  >;

  if (hasTwelveDataKey()) {
    const live = await fetchTwelveCandlesSequential(symbols, count, interval, 300);
    const result: Partial<Record<MarketSymbol, Candle[]>> = { ...live };

    for (const symbol of symbols) {
      if (!result[symbol]?.length) {
        result[symbol] = getMockCandles(
          symbol,
          count,
          intervalToMinutes(interval),
          quoteBySymbol[symbol]?.price
        );
      }
    }

    return result;
  }

  const result: Partial<Record<MarketSymbol, Candle[]>> = {};
  for (const symbol of symbols) {
    result[symbol] = getMockCandles(
      symbol,
      count,
      intervalToMinutes(interval),
      quoteBySymbol[symbol]?.price
    );
  }
  return result;
}

export async function fetchCorrelationMatrix(): Promise<CorrelationCell[]> {
  if (hasTwelveDataKey()) {
    const candleEntries = await fetchTwelveCandlesSequential(
      [...CORRELATION_SYMBOLS],
      90,
      "5min",
      300
    );

    const entries = CORRELATION_SYMBOLS.map(
      (symbol) => [symbol, candleEntries[symbol] ?? []] as const
    );

    const hasData = entries.every(([, candles]) => candles.length >= 10);
    if (hasData) {
      const candlesBySymbol = Object.fromEntries(entries) as Partial<
        Record<MarketSymbol, Candle[]>
      >;
      const series = Object.fromEntries(
        entries.map(([symbol, candles]) => [symbol, returnsFromCandles(candles)])
      ) as Partial<Record<MarketSymbol, number[]>>;
      return buildCorrelationMatrix(series, CORRELATION_SYMBOLS, candlesBySymbol);
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
  const quotes = await fetchQuotes();
  const quote = quotes.find((q) => q.symbol === symbol);
  const candles = await fetchCandles(symbol, 100, "5min", quote?.price);
  const price = quote?.price ?? candles.at(-1)?.close ?? 0;

  if (candles.length >= 20) {
    return detectLiquidityVoids(candles, price);
  }
  return getMockLiquidityZones(symbol);
}

export async function fetchTrapZones(): Promise<TrapZone[]> {
  const symbols: MarketSymbol[] = ["XAUUSD", "XAGUSD", "NAS100", "US30"];
  const quotes = await fetchQuotes();
  const traps: TrapZone[] = [];

  for (const symbol of symbols) {
    const quote = quotes.find((q) => q.symbol === symbol);
    const candles = await fetchCandles(symbol, 80, "5min", quote?.price);
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
    const xauAtr = await fetchTwelveAtr("XAUUSD");
    const nasAtr = await fetchTwelveAtr("NAS100");
    const xagAtr = await fetchTwelveAtr("XAGUSD");
    const us30Atr = await fetchTwelveAtr("US30");

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