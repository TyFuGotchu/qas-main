import type {
  AssetLiveState,
  LiveTradeSignal,
  SignalStreamEvent,
} from "@/lib/signals/types";
import type { MarketSymbol } from "@/lib/market-data/types";

type Listener = (event: SignalStreamEvent) => void;

interface SignalStoreState {
  signals: Map<string, LiveTradeSignal>;
  marketStates: Map<MarketSymbol, AssetLiveState>;
  listeners: Set<Listener>;
  lastTriggerKey: Map<string, string>;
}

const globalForSignals = globalThis as unknown as {
  __qsSignalStore?: SignalStoreState;
};

function getStore(): SignalStoreState {
  if (!globalForSignals.__qsSignalStore) {
    globalForSignals.__qsSignalStore = {
      signals: new Map(),
      marketStates: new Map(),
      listeners: new Set(),
      lastTriggerKey: new Map(),
    };
  }
  return globalForSignals.__qsSignalStore;
}

function broadcast(event: SignalStreamEvent): void {
  for (const listener of Array.from(getStore().listeners)) {
    try {
      listener(event);
    } catch (error) {
      console.error("[signal-store] listener error:", error);
    }
  }
}

export function subscribeToSignals(listener: Listener): () => void {
  const store = getStore();
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
}

export function getActiveSignals(asset?: MarketSymbol): LiveTradeSignal[] {
  return Array.from(getStore().signals.values())
    .filter((s) => s.status === "active" && (!asset || s.asset === asset))
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}

export function getMarketState(asset: MarketSymbol): AssetLiveState | null {
  return getStore().marketStates.get(asset) ?? null;
}

export function setMarketState(state: AssetLiveState): void {
  getStore().marketStates.set(state.asset, state);
  broadcast({ type: "market_state", state });
}

export function getSignalById(id: string): LiveTradeSignal | undefined {
  return getStore().signals.get(id);
}

export function hasTriggerBeenEmitted(
  asset: string,
  triggerKey: string
): boolean {
  return getStore().lastTriggerKey.get(asset) === triggerKey;
}

export function markTriggerEmitted(asset: string, triggerKey: string): void {
  getStore().lastTriggerKey.set(asset, triggerKey);
}

export function upsertSignal(signal: LiveTradeSignal): void {
  const store = getStore();
  const existing = store.signals.get(signal.id);
  store.signals.set(signal.id, signal);

  if (!existing) {
    broadcast({ type: "signal", signal });
  } else if (existing.status !== signal.status) {
    broadcast({ type: "signal_update", signal });
  }
}

export function expireActiveSignalsForAsset(
  asset: string,
  exceptId?: string
): void {
  for (const signal of Array.from(getStore().signals.values())) {
    if (
      signal.asset === asset &&
      signal.status === "active" &&
      signal.id !== exceptId
    ) {
      const expired: LiveTradeSignal = { ...signal, status: "expired" };
      getStore().signals.set(signal.id, expired);
      broadcast({ type: "signal_update", signal: expired });
    }
  }
}

export function markSignalExecuted(id: string): LiveTradeSignal | null {
  const signal = getStore().signals.get(id);
  if (!signal) return null;

  const executed: LiveTradeSignal = { ...signal, status: "executed" };
  getStore().signals.set(id, executed);
  broadcast({ type: "signal_update", signal: executed });
  return executed;
}

export function expireStaleSignals(maxAgeMs: number): void {
  const cutoff = Date.now() - maxAgeMs;
  for (const signal of Array.from(getStore().signals.values())) {
    if (
      signal.status === "active" &&
      new Date(signal.timestamp).getTime() < cutoff
    ) {
      const expired: LiveTradeSignal = { ...signal, status: "expired" };
      getStore().signals.set(signal.id, expired);
      broadcast({ type: "signal_update", signal: expired });
    }
  }
}

export function pruneOldSignals(maxCount = 200): void {
  const all = Array.from(getStore().signals.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  if (all.length <= maxCount) return;

  const store = getStore();
  for (const signal of all.slice(maxCount)) {
    store.signals.delete(signal.id);
  }
}