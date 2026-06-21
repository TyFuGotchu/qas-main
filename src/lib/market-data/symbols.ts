import type { MarketSymbol } from "./types";

export const MARKET_SYMBOLS: MarketSymbol[] = [
  "XAUUSD",
  "XAGUSD",
  "NAS100",
  "US30",
  "BTCUSD",
];

export const TWELVE_DATA_SYMBOLS: Record<MarketSymbol, string> = {
  XAUUSD: "XAU/USD",
  XAGUSD: "XAG/USD",
  NAS100: "QQQ",
  US30: "DIA",
  BTCUSD: "BTC/USD",
};

export const CORRELATION_SYMBOLS: MarketSymbol[] = [
  "XAUUSD",
  "XAGUSD",
  "NAS100",
  "US30",
];

export const SYMBOL_LABELS: Record<MarketSymbol, string> = {
  XAUUSD: "Gold",
  XAGUSD: "Silver",
  NAS100: "Nasdaq 100",
  US30: "Dow 30",
  BTCUSD: "Bitcoin",
};

export const SYMBOL_META: Record<
  MarketSymbol,
  { label: string; basePrice: number; volatility: number }
> = {
  XAUUSD: { label: "Gold", basePrice: 2342.5, volatility: 0.0012 },
  XAGUSD: { label: "Silver", basePrice: 27.85, volatility: 0.0018 },
  NAS100: { label: "Nasdaq 100", basePrice: 18245.0, volatility: 0.0009 },
  US30: { label: "Dow 30", basePrice: 39500.0, volatility: 0.0008 },
  BTCUSD: { label: "Bitcoin", basePrice: 67250.0, volatility: 0.0025 },
};