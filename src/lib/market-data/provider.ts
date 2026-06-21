import type {
  Candle,
  CorrelationCell,
  LiquidityZone,
  MacroEvent,
  MarketSessions,
  MarketSymbol,
  Quote,
  TrapZone,
} from "./types";
import {
  getMockCandles,
  getMockCorrelationMatrix,
  getMockLiquidityZones,
  getMockMacroCalendar,
  getMockQuotes,
  getMockSessions,
  getMockTrapZones,
} from "./mock-provider";

export type DataProvider = "mock" | "twelve_data" | "finnhub";

function getProvider(): DataProvider {
  const configured = process.env.MARKET_DATA_PROVIDER as DataProvider | undefined;
  const hasKey = Boolean(process.env.MARKET_DATA_API_KEY);
  if (hasKey && configured && configured !== "mock") {
    return configured;
  }
  return "mock";
}

export async function fetchQuotes(): Promise<Quote[]> {
  // Live provider integration point — swap mock when API key is set
  return getMockQuotes();
}

export async function fetchCandles(
  symbol: MarketSymbol,
  count = 120
): Promise<Candle[]> {
  void getProvider();
  return getMockCandles(symbol, count);
}

export async function fetchCorrelationMatrix(): Promise<CorrelationCell[]> {
  return getMockCorrelationMatrix();
}

export async function fetchMacroCalendar(): Promise<MacroEvent[]> {
  return getMockMacroCalendar();
}

export async function fetchLiquidityZones(
  symbol: MarketSymbol
): Promise<LiquidityZone[]> {
  return getMockLiquidityZones(symbol);
}

export async function fetchTrapZones(): Promise<TrapZone[]> {
  return getMockTrapZones();
}

export async function fetchSessions(): Promise<MarketSessions> {
  return getMockSessions();
}