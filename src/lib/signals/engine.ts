import { MARKET_SYMBOLS } from "@/lib/market-data/symbols";
import type { MarketSymbol } from "@/lib/market-data/types";
import { fetchCandles } from "@/lib/market-data/provider";
import {
  buildSignalPayload,
  evaluatePulseCrossover,
} from "@/lib/signals/pulse-strategy";
import {
  expireActiveSignalsForAsset,
  expireStaleSignals,
  hasCrossoverBeenEmitted,
  markCrossoverEmitted,
  pruneOldSignals,
  upsertSignal,
} from "@/lib/signals/store";

const SCAN_INTERVAL_MS = Number(process.env.SIGNAL_SCAN_INTERVAL_MS) || 60_000;
const SIGNAL_TTL_MS = Number(process.env.SIGNAL_TTL_MS) || 4 * 60 * 60 * 1000;
const CANDLE_INTERVAL = "5min";

const globalForEngine = globalThis as unknown as {
  __qsSignalEngineStarted?: boolean;
  __qsSignalEngineTimer?: ReturnType<typeof setInterval>;
};

async function scanAsset(asset: MarketSymbol): Promise<void> {
  const candles = await fetchCandles(asset, 60, CANDLE_INTERVAL);
  const crossover = evaluatePulseCrossover(candles);

  if (!crossover.isCrossover || !crossover.direction) return;

  const crossoverKey = `${crossover.direction}-${candles[candles.length - 1]?.time ?? "na"}`;
  if (hasCrossoverBeenEmitted(asset, crossoverKey)) return;

  const signal = buildSignalPayload(asset, crossover, candles);
  if (!signal) return;

  expireActiveSignalsForAsset(asset, signal.id);
  upsertSignal(signal);
  markCrossoverEmitted(asset, crossoverKey);

  console.info(
    `[signal-engine] ${signal.direction} ${signal.asset} @ ${signal.entryPrice}`
  );
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
    `[signal-engine] Starting Quicksilver Pulse scanner (${SCAN_INTERVAL_MS}ms interval)`
  );

  void runScan();

  globalForEngine.__qsSignalEngineTimer = setInterval(() => {
    void runScan();
  }, SCAN_INTERVAL_MS);
}

export function stopSignalEngine(): void {
  if (globalForEngine.__qsSignalEngineTimer) {
    clearInterval(globalForEngine.__qsSignalEngineTimer);
    globalForEngine.__qsSignalEngineTimer = undefined;
  }
  globalForEngine.__qsSignalEngineStarted = false;
}