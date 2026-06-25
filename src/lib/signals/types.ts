import type { MarketSymbol } from "@/lib/market-data/types";

export type SignalDirection = "BUY" | "SELL";

export type TrendBias = "bullish" | "bearish" | "ranging";
export type SetupStatus = "scanning" | "forming" | "ready" | "triggered";
export type MarketBias = "BUY" | "SELL" | "NEUTRAL";

export type SignalStatus = "active" | "expired" | "executed";

export interface LiveTradeSignal {
  id: string;
  timestamp: string;
  asset: MarketSymbol;
  direction: SignalDirection;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  status: SignalStatus;
  strategy?: string;
  reason?: string;
  confluenceScore?: number;
}

export interface AssetLiveState {
  asset: MarketSymbol;
  timestamp: string;
  price: number;
  changePercent: number;
  confluenceScore: number;
  bias: MarketBias;
  trend: TrendBias;
  setupStatus: SetupStatus;
  ema21: number;
  ema55: number;
  rsi: number;
  atr: number;
  support: number;
  resistance: number;
  reasons: string[];
}

export type SignalStreamEvent =
  | { type: "connected"; signals: LiveTradeSignal[]; marketState: AssetLiveState | null }
  | { type: "signal"; signal: LiveTradeSignal }
  | { type: "signal_update"; signal: LiveTradeSignal }
  | { type: "market_state"; state: AssetLiveState }
  | { type: "heartbeat"; at: string };