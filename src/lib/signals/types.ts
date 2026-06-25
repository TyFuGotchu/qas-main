import type { MarketSymbol } from "@/lib/market-data/types";

export type SignalDirection = "BUY" | "SELL";

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
}

export type SignalStreamEvent =
  | { type: "connected"; signals: LiveTradeSignal[] }
  | { type: "signal"; signal: LiveTradeSignal }
  | { type: "signal_update"; signal: LiveTradeSignal }
  | { type: "heartbeat"; at: string };