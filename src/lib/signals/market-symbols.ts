import { MARKET_SYMBOLS } from "@/lib/market-data/symbols";
import type { MarketSymbol } from "@/lib/market-data/types";

export function resolveMarketSymbol(instrumentName: string): MarketSymbol | null {
  const normalized = instrumentName.toUpperCase().replace(/[^A-Z0-9]/g, "");

  for (const symbol of MARKET_SYMBOLS) {
    if (normalized.includes(symbol)) return symbol;
  }

  if (normalized.includes("GOLD") || normalized.includes("XAU")) return "XAUUSD";
  if (normalized.includes("SILVER") || normalized.includes("XAG")) return "XAGUSD";
  if (
    normalized.includes("NAS") ||
    normalized.includes("US100") ||
    normalized.includes("NDX") ||
    normalized.includes("QQQ")
  ) {
    return "NAS100";
  }
  if (normalized.includes("DOW") || normalized.includes("US30")) return "US30";
  if (normalized.includes("BTC")) return "BTCUSD";

  return null;
}

export function defaultPipValue(symbol: MarketSymbol): number {
  switch (symbol) {
    case "XAUUSD":
      return 10;
    case "XAGUSD":
      return 5;
    case "BTCUSD":
      return 1;
    case "NAS100":
    case "US30":
      return 1;
    default:
      return 10;
  }
}

export function defaultStopPips(symbol: MarketSymbol): number {
  switch (symbol) {
    case "XAUUSD":
      return 20;
    case "XAGUSD":
      return 25;
    case "BTCUSD":
      return 50;
    case "NAS100":
    case "US30":
      return 15;
    default:
      return 20;
  }
}