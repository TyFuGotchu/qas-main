"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MARKET_CANDLE_INTERVAL,
  MARKET_POLL_INTERVAL_MS,
} from "@/lib/market-data/config";
import { CORRELATION_SYMBOLS, MARKET_SYMBOLS } from "@/lib/market-data/symbols";
import type { Candle, MarketSymbol, Quote } from "@/lib/market-data/types";

type DataSource = "live" | "mock" | "hybrid";

interface BundleResponse {
  quotes: Quote[];
  candles: Partial<Record<MarketSymbol, Candle[]>>;
  source: DataSource;
  polledAt: number;
  interval: string;
}

interface MarketDataCache {
  quotes: Quote[];
  candles: Partial<Record<MarketSymbol, Candle[]>>;
  source: DataSource;
  lastUpdated: number;
}

const clientCache: MarketDataCache = {
  quotes: [],
  candles: {},
  source: "mock",
  lastUpdated: 0,
};

let inflight: Promise<void> | null = null;

async function fetchBundle(
  activeSymbol: MarketSymbol,
  includeCorrelation: boolean
): Promise<MarketDataCache> {
  const symbols = includeCorrelation
    ? Array.from(new Set([activeSymbol, ...CORRELATION_SYMBOLS, "BTCUSD"]))
    : [activeSymbol];

  const url = includeCorrelation
    ? "/api/market/bundle?all=true"
    : `/api/market/bundle?candleSymbols=${symbols.join(",")}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Market bundle fetch failed");

  const data: BundleResponse = await res.json();

  return {
    quotes: data.quotes,
    candles: { ...clientCache.candles, ...data.candles },
    source: data.source,
    lastUpdated: data.polledAt,
  };
}

export interface UseMarketDataOptions {
  /** Poll correlation assets for decoupling heatmap */
  includeCorrelation?: boolean;
  /** Override default 90s poll interval */
  pollIntervalMs?: number;
  /** Initial active chart symbol */
  initialSymbol?: MarketSymbol;
}

export function useMarketData(options: UseMarketDataOptions = {}) {
  const {
    includeCorrelation = false,
    pollIntervalMs = MARKET_POLL_INTERVAL_MS,
    initialSymbol = "XAUUSD",
  } = options;

  const [quotes, setQuotes] = useState<Quote[]>(clientCache.quotes);
  const [candles, setCandles] = useState<Partial<Record<MarketSymbol, Candle[]>>>(
    clientCache.candles
  );
  const [activeSymbol, setActiveSymbol] = useState<MarketSymbol>(initialSymbol);
  const [source, setSource] = useState<DataSource>(clientCache.source);
  const [loading, setLoading] = useState(clientCache.quotes.length === 0);
  const [lastUpdated, setLastUpdated] = useState(clientCache.lastUpdated);
  const activeRef = useRef(activeSymbol);
  const correlationRef = useRef(includeCorrelation);

  activeRef.current = activeSymbol;
  correlationRef.current = includeCorrelation;

  const refresh = useCallback(async (force = false) => {
    const now = Date.now();
    if (
      !force &&
      clientCache.lastUpdated > 0 &&
      now - clientCache.lastUpdated < pollIntervalMs - 2000
    ) {
      setQuotes(clientCache.quotes);
      setCandles(clientCache.candles);
      setSource(clientCache.source);
      setLastUpdated(clientCache.lastUpdated);
      setLoading(false);
      return;
    }

    if (inflight) {
      await inflight;
      setQuotes(clientCache.quotes);
      setCandles(clientCache.candles);
      setSource(clientCache.source);
      setLastUpdated(clientCache.lastUpdated);
      setLoading(false);
      return;
    }

    setLoading(true);
    inflight = (async () => {
      try {
        const result = await fetchBundle(
          activeRef.current,
          correlationRef.current
        );
        clientCache.quotes = result.quotes;
        clientCache.candles = result.candles;
        clientCache.source = result.source;
        clientCache.lastUpdated = result.lastUpdated;

        setQuotes(result.quotes);
        setCandles(result.candles);
        setSource(result.source);
        setLastUpdated(result.lastUpdated);
      } catch (err) {
        console.error("[useMarketData]", err);
      } finally {
        setLoading(false);
        inflight = null;
      }
    })();

    await inflight;
  }, [pollIntervalMs]);

  useEffect(() => {
    refresh(true);
    const id = setInterval(() => refresh(), pollIntervalMs);
    return () => clearInterval(id);
  }, [refresh, pollIntervalMs]);

  useEffect(() => {
    refresh(true);
  }, [activeSymbol, includeCorrelation, refresh]);

  const activeCandles = candles[activeSymbol] ?? [];
  const activeQuote = quotes.find((q) => q.symbol === activeSymbol);

  return {
    quotes,
    candles,
    activeSymbol,
    setActiveSymbol,
    activeCandles,
    activeQuote,
    source,
    loading,
    lastUpdated,
    refresh,
    symbols: MARKET_SYMBOLS,
    interval: MARKET_CANDLE_INTERVAL,
  };
}