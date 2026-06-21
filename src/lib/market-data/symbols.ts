import type { MarketSymbol } from "./types";

export const MARKET_SYMBOLS: MarketSymbol[] = [
  "XAUUSD",
  "XAGUSD",
  "NAS100",
  "BTCUSD",
];

export const SYMBOL_META: Record<
  MarketSymbol,
  { label: string; basePrice: number; volatility: number }
> = {
  XAUUSD: { label: "Gold", basePrice: 2342.5, volatility: 0.0012 },
  XAGUSD: { label: "Silver", basePrice: 27.85, volatility: 0.0018 },
  NAS100: { label: "Nasdaq 100", basePrice: 18245.0, volatility: 0.0009 },
  BTCUSD: { label: "Bitcoin", basePrice: 67250.0, volatility: 0.0025 },
};