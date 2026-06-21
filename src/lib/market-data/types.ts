export type MarketSymbol = "XAUUSD" | "XAGUSD" | "NAS100" | "BTCUSD";

export interface Quote {
  symbol: MarketSymbol;
  price: number;
  change: number;
  changePercent: number;
  bid: number;
  ask: number;
  timestamp: number;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MacroEvent {
  id: string;
  title: string;
  currency: string;
  impact: "low" | "medium" | "high";
  scheduledAt: string;
  volatilityImpactScore: number;
  spikeProbability: number;
  flushProbability: number;
  sentiment: "bullish" | "bearish" | "neutral";
}

export interface CorrelationCell {
  assetA: MarketSymbol;
  assetB: MarketSymbol;
  correlation: number;
  previousCorrelation: number;
  decoupled: boolean;
}

export interface LiquidityZone {
  priceLow: number;
  priceHigh: number;
  intensity: number;
  label: string;
}

export interface TrapZone {
  id: string;
  symbol: MarketSymbol;
  price: number;
  direction: "long_trap" | "short_trap";
  strength: number;
  detectedAt: string;
  description: string;
}

export interface SessionState {
  name: "Asia" | "London" | "NewYork";
  open: boolean;
  atr: number;
  volatilityRank: number;
}

export interface MarketSessions {
  utcHour: number;
  sessions: SessionState[];
  overlapActive: boolean;
  overlapLabel: string | null;
  compositeAtr: number;
}