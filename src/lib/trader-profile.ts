import type { TraderProfile } from "@prisma/client";
import {
  DEFAULT_TRADER_TIMEZONE,
  normalizeTraderTimezone,
} from "@/lib/journal/timezone";
import { limitsFromPreset, type PropFirmPresetId } from "@/lib/prop-firms";

export type AccountType = "personal" | "prop" | "funded";
export type TradingStyle = "scalp" | "day" | "swing" | "position";

export const ACCOUNT_TYPES: { id: AccountType; label: string }[] = [
  { id: "personal", label: "Live personal account" },
  { id: "prop", label: "Prop evaluation" },
  { id: "funded", label: "Funded / live capital" },
];

export const TRADING_STYLES: { id: TradingStyle; label: string }[] = [
  { id: "scalp", label: "Scalping" },
  { id: "day", label: "Day trading" },
  { id: "swing", label: "Swing trading" },
  { id: "position", label: "Position / macro" },
];

export const MARKET_OPTIONS = [
  "Forex",
  "Indices",
  "Crypto",
  "Commodities",
  "Futures",
  "Stocks",
] as const;

export type MarketOption = (typeof MARKET_OPTIONS)[number];

export interface TraderProfilePayload {
  accountType: AccountType;
  tradingStyle: TradingStyle;
  primaryMarkets: MarketOption[];
  propFirmPreset: PropFirmPresetId;
  dailyLossLimitPct: number;
  maxDrawdownPct: number;
  riskPerTradePct: number;
  maxTradesPerDay: number;
  strictPreTradeGate: boolean;
  timezone: string;
  profileComplete?: boolean;
}

export interface TraderProfileView extends TraderProfilePayload {
  id: string;
  profileComplete: boolean;
}

export function parsePrimaryMarkets(value: unknown): MarketOption[] {
  if (!Array.isArray(value)) return [];
  return value.filter((m): m is MarketOption =>
    MARKET_OPTIONS.includes(m as MarketOption)
  );
}

export function toTraderProfileView(profile: TraderProfile): TraderProfileView {
  return {
    id: profile.id,
    accountType: profile.accountType as AccountType,
    tradingStyle: profile.tradingStyle as TradingStyle,
    primaryMarkets: parsePrimaryMarkets(profile.primaryMarkets),
    propFirmPreset: (profile.propFirmPreset ?? "generic") as PropFirmPresetId,
    dailyLossLimitPct: profile.dailyLossLimitPct,
    maxDrawdownPct: profile.maxDrawdownPct,
    riskPerTradePct: profile.riskPerTradePct,
    maxTradesPerDay: profile.maxTradesPerDay,
    strictPreTradeGate: profile.strictPreTradeGate,
    timezone: normalizeTraderTimezone(profile.timezone),
    profileComplete: profile.profileComplete,
  };
}

export function defaultTraderProfilePayload(): TraderProfilePayload {
  const limits = limitsFromPreset("generic");
  return {
    accountType: "personal",
    tradingStyle: "day",
    primaryMarkets: ["Forex"],
    propFirmPreset: "generic",
    ...limits,
    strictPreTradeGate: true,
    timezone: DEFAULT_TRADER_TIMEZONE,
  };
}

export function validateTraderProfilePayload(
  body: unknown
): { ok: true; data: TraderProfilePayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid payload" };
  }

  const raw = body as Record<string, unknown>;
  const accountType = raw.accountType as AccountType;
  const tradingStyle = raw.tradingStyle as TradingStyle;

  if (!ACCOUNT_TYPES.some((t) => t.id === accountType)) {
    return { ok: false, error: "Invalid account type" };
  }
  if (!TRADING_STYLES.some((t) => t.id === tradingStyle)) {
    return { ok: false, error: "Invalid trading style" };
  }

  const primaryMarkets = Array.isArray(raw.primaryMarkets)
    ? parsePrimaryMarkets(raw.primaryMarkets)
    : [];
  if (primaryMarkets.length === 0) {
    return { ok: false, error: "Select at least one market" };
  }

  const dailyLossLimitPct = Number(raw.dailyLossLimitPct);
  const maxDrawdownPct = Number(raw.maxDrawdownPct);
  const riskPerTradePct = Number(raw.riskPerTradePct);
  const maxTradesPerDay = Number(raw.maxTradesPerDay);

  if (
    !Number.isFinite(dailyLossLimitPct) ||
    dailyLossLimitPct < 1 ||
    dailyLossLimitPct > 20
  ) {
    return { ok: false, error: "Daily loss limit must be 1–20%" };
  }
  if (
    !Number.isFinite(maxDrawdownPct) ||
    maxDrawdownPct < 2 ||
    maxDrawdownPct > 30
  ) {
    return { ok: false, error: "Max drawdown must be 2–30%" };
  }
  if (
    !Number.isFinite(riskPerTradePct) ||
    riskPerTradePct < 0.1 ||
    riskPerTradePct > 5
  ) {
    return { ok: false, error: "Risk per trade must be 0.1–5%" };
  }
  if (
    !Number.isInteger(maxTradesPerDay) ||
    maxTradesPerDay < 1 ||
    maxTradesPerDay > 50
  ) {
    return { ok: false, error: "Max trades per day must be 1–50" };
  }

  const timezone =
    typeof raw.timezone === "string"
      ? normalizeTraderTimezone(raw.timezone)
      : DEFAULT_TRADER_TIMEZONE;

  return {
    ok: true,
    data: {
      accountType,
      tradingStyle,
      primaryMarkets,
      propFirmPreset: (raw.propFirmPreset as PropFirmPresetId) ?? "generic",
      dailyLossLimitPct,
      maxDrawdownPct,
      riskPerTradePct,
      maxTradesPerDay,
      strictPreTradeGate: Boolean(raw.strictPreTradeGate ?? true),
      timezone,
      profileComplete: Boolean(raw.profileComplete ?? true),
    },
  };
}