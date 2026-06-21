import { getCached, setCached } from "./cache";
import { TWELVE_DATA_SYMBOLS } from "./symbols";
import type { Candle, MarketSymbol, Quote } from "./types";

const BASE_URL = "https://api.twelvedata.com";
const CANDLE_INTERVAL_FALLBACKS = ["5min", "15min", "1h"] as const;

function getApiKey(): string | null {
  return process.env.TWELVE_DATA_API_KEY?.trim().replace(/^["']|["']$/g, "") ?? null;
}

export function hasTwelveDataKey(): boolean {
  return Boolean(getApiKey());
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function twelveFetch<T>(
  path: string,
  params: Record<string, string>,
  retries = 1
): Promise<T | null> {
  const apikey = getApiKey();
  if (!apikey) return null;

  const url = new URL(`${BASE_URL}${path}`);
  Object.entries({ ...params, apikey }).forEach(([k, v]) => url.searchParams.set(k, v));

  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url.toString(), {
      next: { revalidate: 0 },
      headers: { Accept: "application/json" },
    });

    if (res.status === 429) {
      if (attempt < retries) {
        await sleep(1500 * (attempt + 1));
        continue;
      }
      console.error(`[twelve-data] Rate limited for ${path}`);
      return null;
    }

    if (!res.ok) {
      console.error(`[twelve-data] HTTP ${res.status} for ${path}`);
      return null;
    }

    const data = (await res.json()) as T & { status?: string; message?: string; code?: number };
    if (data.status === "error") {
      if (data.code === 429 && attempt < retries) {
        await sleep(1500 * (attempt + 1));
        continue;
      }
      console.error(`[twelve-data] API error: ${data.message}`);
      return null;
    }
    return data;
  }

  return null;
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
  meta?: {
    exchange_timezone?: string;
    symbol?: string;
  };
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

/** Parse Twelve Data datetime into UTC unix seconds. */
function toUnixTime(datetime: string, timezone?: string): number {
  const trimmed = datetime.trim();

  if (trimmed.includes("T")) {
    const iso = trimmed.endsWith("Z") ? trimmed : `${trimmed}Z`;
    const ms = Date.parse(iso);
    return Number.isNaN(ms) ? Math.floor(Date.now() / 1000) : Math.floor(ms / 1000);
  }

  const normalized = trimmed.replace(" ", "T");

  if (timezone && timezone !== "UTC") {
    const ms = Date.parse(`${normalized} GMT`);
    if (!Number.isNaN(ms)) return Math.floor(ms / 1000);
  }

  const ms = Date.parse(`${normalized}Z`);
  return Number.isNaN(ms) ? Math.floor(Date.now() / 1000) : Math.floor(ms / 1000);
}

function mapSymbol(symbol: MarketSymbol): string {
  return TWELVE_DATA_SYMBOLS[symbol];
}

/** Free-tier proxies only — NDX/DJI require paid Twelve Data plans. */
const SYMBOL_FALLBACKS: Partial<Record<MarketSymbol, string[]>> = {
  NAS100: ["QQQ"],
  US30: ["DIA"],
};

async function fetchWithFallback<T>(
  symbol: MarketSymbol,
  fetcher: (twelveSymbol: string) => Promise<T | null>,
  isValid: (data: T | null) => boolean
): Promise<{ data: T | null; twelveSymbol: string | null }> {
  const candidates = SYMBOL_FALLBACKS[symbol] ?? [mapSymbol(symbol)];
  for (const candidate of candidates) {
    const result = await fetcher(candidate);
    if (isValid(result)) return { data: result, twelveSymbol: candidate };
  }
  return { data: null, twelveSymbol: null };
}

function buildQuote(symbol: MarketSymbol, data: TwelveQuoteResponse): Quote {
  const price = parseFloat(data.close);
  const prev = parseFloat(data.previous_close || data.open);
  const change = price - prev;
  const changePercent = prev === 0 ? 0 : (change / prev) * 100;
  const spread = price * 0.00006;

  return {
    symbol,
    price: parseFloat(price.toFixed(symbol === "BTCUSD" ? 1 : 2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(3)),
    bid: parseFloat((price - spread / 2).toFixed(2)),
    ask: parseFloat((price + spread / 2).toFixed(2)),
    timestamp: Date.now(),
  };
}

/** Single API call for all quotes — saves credits vs per-symbol requests. */
export async function fetchTwelveQuotesBatch(
  symbols: MarketSymbol[]
): Promise<Map<MarketSymbol, Quote>> {
  const result = new Map<MarketSymbol, Quote>();

  const uncached: MarketSymbol[] = [];
  for (const symbol of symbols) {
    const cached = getCached<Quote>(`td:quote:${symbol}`);
    if (cached) {
      result.set(symbol, cached);
    } else {
      uncached.push(symbol);
    }
  }

  if (uncached.length === 0) return result;

  const twelveSymbols = uncached.map((s) => mapSymbol(s)).join(",");
  const data = await twelveFetch<Record<string, TwelveQuoteResponse | { status?: string }>>(
    "/quote",
    { symbol: twelveSymbols }
  );

  if (data) {
    for (const symbol of uncached) {
      const twelveSymbol = mapSymbol(symbol);
      const entry = data[twelveSymbol];
      if (entry && "close" in entry && entry.close) {
        const quote = buildQuote(symbol, entry as TwelveQuoteResponse);
        setCached(`td:quote:${symbol}`, quote, 120_000);
        result.set(symbol, quote);
      }
    }
  }

  for (const symbol of uncached) {
    if (result.has(symbol)) continue;

    const single = await fetchTwelveQuote(symbol);
    if (single) result.set(symbol, single);
    await sleep(200);
  }

  return result;
}

export async function fetchTwelveQuote(symbol: MarketSymbol): Promise<Quote | null> {
  const cacheKey = `td:quote:${symbol}`;
  const cached = getCached<Quote>(cacheKey);
  if (cached) return cached;

  const { data } = await fetchWithFallback(
    symbol,
    (twelveSymbol) => twelveFetch<TwelveQuoteResponse>("/quote", { symbol: twelveSymbol }),
    (result) => Boolean(result?.close)
  );
  if (!data) return null;

  const quote = buildQuote(symbol, data);
  return setCached(cacheKey, quote, 120_000);
}

export async function fetchTwelveQuotes(symbols: MarketSymbol[]): Promise<Quote[]> {
  const map = await fetchTwelveQuotesBatch(symbols);
  return symbols
    .map((s) => map.get(s))
    .filter((q): q is Quote => q !== undefined);
}

export async function fetchTwelveCandles(
  symbol: MarketSymbol,
  count = 120,
  interval = "5min"
): Promise<Candle[]> {
  const cacheKey = `td:candles:${symbol}:${count}:${interval}`;
  const cached = getCached<Candle[]>(cacheKey);
  if (cached) return cached;

  const intervalsToTry = [
    interval,
    ...CANDLE_INTERVAL_FALLBACKS.filter((i) => i !== interval),
  ];

  for (const tryInterval of intervalsToTry) {
    const { data } = await fetchWithFallback(
      symbol,
      (twelveSymbol) =>
        twelveFetch<TwelveTimeSeriesResponse>("/time_series", {
          symbol: twelveSymbol,
          interval: tryInterval,
          outputsize: String(count),
          order: "ASC",
        }),
      (result) => Boolean(result?.values?.length)
    );

    if (!data?.values?.length) continue;

    const timezone = data.meta?.exchange_timezone;
    const candles: Candle[] = data.values.map((v) => ({
      time: toUnixTime(v.datetime, timezone),
      open: parseFloat(v.open),
      high: parseFloat(v.high),
      low: parseFloat(v.low),
      close: parseFloat(v.close),
      volume: parseFloat(v.volume ?? "0"),
    }));

    return setCached(cacheKey, candles, 120_000);
  }

  return [];
}

export async function fetchTwelveCandlesSequential(
  symbols: MarketSymbol[],
  count = 120,
  interval = "5min",
  delayMs = 300
): Promise<Partial<Record<MarketSymbol, Candle[]>>> {
  const candles: Partial<Record<MarketSymbol, Candle[]>> = {};

  for (const symbol of symbols) {
    candles[symbol] = await fetchTwelveCandles(symbol, count, interval);
    if (delayMs > 0) await sleep(delayMs);
  }

  return candles;
}

export async function fetchTwelveAtr(symbol: MarketSymbol, period = 14): Promise<number> {
  const cacheKey = `td:atr:${symbol}:${period}`;
  const cached = getCached<number>(cacheKey);
  if (cached !== null) return cached;

  const { data } = await fetchWithFallback(
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