import { MARKET_SYMBOLS } from "@/lib/market-data/symbols";
import type { MarketSymbol } from "@/lib/market-data/types";
import { fetchCandles, fetchQuotes } from "@/lib/market-data/provider";
import {
  analyzeConfluence,
  buildConfluenceSignal,
} from "@/lib/signals/confluence-strategy";
import {
  expireActiveSignalsForAsset,
  expireStaleSignals,
  hasTriggerBeenEmitted,
  markTriggerEmitted,
  pruneOldSignals,
  setMarketState,
  upsertSignal,
} from "@/lib/signals/store";
import type { AssetLiveState } from "@/lib/signals/types";

const SCAN_INTERVAL_MS = Number(process.env.SIGNAL_SCAN_INTERVAL_MS) || 45_000;
const QUOTE_INTERVAL_MS = Number(process.env.SIGNAL_QUOTE_INTERVAL_MS) || 8_000;
const SIGNAL_TTL_MS = Number(process.env.SIGNAL_TTL_MS) || 4 * 60 * 60 * 1000;
const CANDLE_INTERVAL = "5min";

const globalForEngine = globalThis as unknown as {
  __qsSignalEngineStarted?: boolean;
  __qsSignalEngineTimer?: ReturnType<typeof setInterval>;
  __qsQuoteTimer?: ReturnType<typeof setInterval>;
  __qsLastCandles?: Map<MarketSymbol, Awaited<ReturnType<typeof fetchCandles>>>;
};

function analysisToLiveState(
  asset: MarketSymbol,
  analysis: ReturnType<typeof analyzeConfluence>
): AssetLiveState {
  return {
    asset,
    timestamp: new Date().toISOString(),
    price: analysis.price,
    changePercent: analysis.changePercent,
    confluenceScore: analysis.score,
    bias: analysis.bias,
    trend: analysis.trend,
    setupStatus: analysis.setupStatus,
    ema21: analysis.ema21,
    ema55: analysis.ema55,
    rsi: analysis.rsi,
    atr: analysis.atr,
    support: analysis.support,
    resistance: analysis.resistance,
    reasons: analysis.reasons,
  };
}

async function scanAsset(asset: MarketSymbol): Promise<void> {
  const candles = await fetchCandles(asset, 80, CANDLE_INTERVAL);
  if (!globalForEngine.__qsLastCandles) {
    globalForEngine.__qsLastCandles = new Map();
  }
  globalForEngine.__qsLastCandles.set(asset, candles);

  const analysis = analyzeConfluence(asset, candles);
  setMarketState(analysisToLiveState(asset, analysis));

  if (!analysis.isTriggered || !analysis.direction) return;

  const triggerKey = `${analysis.direction}-${candles[candles.length - 1]?.time ?? "na"}-${analysis.score}`;
  if (hasTriggerBeenEmitted(asset, triggerKey)) return;

  const signal = buildConfluenceSignal(asset, analysis);
  if (!signal) return;

  expireActiveSignalsForAsset(asset, signal.id);
  upsertSignal(signal);
  markTriggerEmitted(asset, triggerKey);

  console.info(
    `[signal-engine] ${signal.direction} ${signal.asset} @ ${signal.entryPrice} (score ${analysis.score})`
  );
}

async function refreshQuotes(): Promise<void> {
  try {
    const quotes = await fetchQuotes();
    const quoteMap = new Map(quotes.map((q) => [q.symbol, q]));
    const candleCache = globalForEngine.__qsLastCandles;

    for (const asset of MARKET_SYMBOLS) {
      const quote = quoteMap.get(asset);
      if (!quote) continue;

      const candles = candleCache?.get(asset);
      if (candles && candles.length >= 60) {
        const patched = [...candles];
        const last = patched[patched.length - 1];
        if (last) {
          patched[patched.length - 1] = {
            ...last,
            close: quote.price,
            high: Math.max(last.high, quote.price),
            low: Math.min(last.low, quote.price),
          };
        }
        const analysis = analyzeConfluence(asset, patched);
        setMarketState({
          ...analysisToLiveState(asset, analysis),
          price: quote.price,
          changePercent: quote.changePercent,
        });
      } else {
        setMarketState({
          asset,
          timestamp: new Date().toISOString(),
          price: quote.price,
          changePercent: quote.changePercent,
          confluenceScore: 0,
          bias: "NEUTRAL",
          trend: "ranging",
          setupStatus: "scanning",
          ema21: quote.price,
          ema55: quote.price,
          rsi: 50,
          atr: 0,
          support: quote.price,
          resistance: quote.price,
          reasons: ["Loading confluence model…"],
        });
      }
    }
  } catch (error) {
    console.error("[signal-engine] quote refresh failed:", error);
  }
}

async function runScan(): Promise<void> {
  expireStaleSignals(SIGNAL_TTL_MS);
  pruneOldSignals();

  await Promise.all(
    MARKET_SYMBOLS.map((asset) =>
      scanAsset(asset).catch((error) => {
        console.error(`[signal-engine] scan failed for ${asset}:`, error);
      })
    )
  );
}

export function startSignalEngine(): void {
  if (globalForEngine.__qsSignalEngineStarted) return;
  globalForEngine.__qsSignalEngineStarted = true;

  console.info(
    `[signal-engine] Starting Quicksilver Confluence scanner (${SCAN_INTERVAL_MS}ms)`
  );

  void runScan();
  void refreshQuotes();

  globalForEngine.__qsSignalEngineTimer = setInterval(() => {
    void runScan();
  }, SCAN_INTERVAL_MS);

  globalForEngine.__qsQuoteTimer = setInterval(() => {
    void refreshQuotes();
  }, QUOTE_INTERVAL_MS);
}

export function stopSignalEngine(): void {
  if (globalForEngine.__qsSignalEngineTimer) {
    clearInterval(globalForEngine.__qsSignalEngineTimer);
    globalForEngine.__qsSignalEngineTimer = undefined;
  }
  if (globalForEngine.__qsQuoteTimer) {
    clearInterval(globalForEngine.__qsQuoteTimer);
    globalForEngine.__qsQuoteTimer = undefined;
  }
  globalForEngine.__qsSignalEngineStarted = false;
}