import { getCached, setCached } from "./cache";
import { TWELVE_DATA_SYMBOLS } from "./symbols";
import type { Candle, MarketSymbol, Quote } from "./types";

const BASE_URL = "https://api.twelvedata.com";

function getApiKey(): string | null {
  return process.env.TWELVE_DATA_API_KEY ?? null;
}

export function hasTwelveDataKey(): boolean {
  return Boolean(getApiKey());
}

async function twelveFetch<T>(path: string, params: Record<string, string>): Promise<T | null> {
  const apikey = getApiKey();
  if (!apikey) return null;

  const url = new URL(`${BASE_URL}${path}`);
  Object.entries({ ...params, apikey }).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    next: { revalidate: 0 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    console.error(`[twelve-data] HTTP ${res.status} for ${path}`);
    return null;
  }

  const data = (await res.json()) as T & { status?: string; message?: string };
  if (data.status === "error") {
    console.error(`[twelve-data] API error: ${data.message}`);
    return null;
  }
  return data;
}

interface TwelveQuoteResponse {
  symbol: string;
  close: string;
  previous_close: string;
  open: string;
  high: string;
  low: string;
}

interface TwelveTimeSeriesResponse {
  values?: Array<{
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume?: string;
  }>;
}

interface TwelveAtrResponse {
  values?: Array<{ datetime: string; atr: string }>;
}

function toUnixTime(datetime: string): number {
  const ms = Date.parse(datetime.replace(" ", "T") + "Z");
  return Number.isNaN(ms) ? Math.floor(Date.now() / 1000) : Math.floor(ms / 1000);
}

function mapSymbol(symbol: MarketSymbol): string {
  return TWELVE_DATA_SYMBOLS[symbol];
}

const SYMBOL_FALLBACKS: Partial<Record<MarketSymbol, string[]>> = {
  NAS100: ["QQQ", "NDX"],
  US30: ["DIA", "DJI"],
};

async function fetchWithFallback<T>(
  symbol: MarketSymbol,
  fetcher: (twelveSymbol: string) => Promise<T | null>,
  isValid: (data: T | null) => boolean
): Promise<T | null> {
  const candidates = SYMBOL_FALLBACKS[symbol] ?? [mapSymbol(symbol)];
  for (const candidate of candidates) {
    const result = await fetcher(candidate);
    if (isValid(result)) return result;
  }
  return null;
}

export async function fetchTwelveQuote(symbol: MarketSymbol): Promise<Quote | null> {
  const cacheKey = `td:quote:${symbol}`;
  const cached = getCached<Quote>(cacheKey);
  if (cached) return cached;

  const data = await fetchWithFallback(
    symbol,
    (twelveSymbol) => twelveFetch<TwelveQuoteResponse>("/quote", { symbol: twelveSymbol }),
    (result) => Boolean(result?.close)
  );
  if (!data) return null;

  const price = parseFloat(data.close);
  const prev = parseFloat(data.previous_close || data.open);
  const change = price - prev;
  const changePercent = prev === 0 ? 0 : (change / prev) * 100;
  const spread = price * 0.00006;

  const quote: Quote = {
    symbol,
    price: parseFloat(price.toFixed(symbol === "BTCUSD" ? 1 : 2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(3)),
    bid: parseFloat((price - spread / 2).toFixed(2)),
    ask: parseFloat((price + spread / 2).toFixed(2)),
    timestamp: Date.now(),
  };

  return setCached(cacheKey, quote, 120_000);
}

export async function fetchTwelveQuotes(
  symbols: MarketSymbol[]
): Promise<Quote[]> {
  const results = await Promise.all(symbols.map(fetchTwelveQuote));
  return results.filter((q): q is Quote => q !== null);
}

export async function fetchTwelveCandles(
  symbol: MarketSymbol,
  count = 120,
  interval = "5min"
): Promise<Candle[]> {
  const cacheKey = `td:candles:${symbol}:${count}:${interval}`;
  const cached = getCached<Candle[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchWithFallback(
    symbol,
    (twelveSymbol) =>
      twelveFetch<TwelveTimeSeriesResponse>("/time_series", {
        symbol: twelveSymbol,
        interval,
        outputsize: String(count),
        order: "ASC",
      }),
    (result) => Boolean(result?.values?.length)
  );

  if (!data?.values?.length) return [];

  const candles: Candle[] = data.values.map((v) => ({
    time: toUnixTime(v.datetime),
    open: parseFloat(v.open),
    high: parseFloat(v.high),
    low: parseFloat(v.low),
    close: parseFloat(v.close),
    volume: parseFloat(v.volume ?? "0"),
  }));

  return setCached(cacheKey, candles, 120_000);
}

export async function fetchTwelveAtr(symbol: MarketSymbol, period = 14): Promise<number> {
  const cacheKey = `td:atr:${symbol}:${period}`;
  const cached = getCached<number>(cacheKey);
  if (cached !== null) return cached;

  const data = await fetchWithFallback(
    symbol,
    (twelveSymbol) =>
      twelveFetch<TwelveAtrResponse>("/atr", {
        symbol: twelveSymbol,
        interval: "1h",
        time_period: String(period),
        outputsize: "1",
      }),
    (result) => Boolean(result?.values?.[0]?.atr)
  );

  const atr = parseFloat(data?.values?.[0]?.atr ?? "0");
  return setCached(cacheKey, atr, 300_000);
}