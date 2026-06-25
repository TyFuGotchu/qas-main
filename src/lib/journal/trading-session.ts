import { formatUtcHourInTimezone, normalizeTraderTimezone } from "@/lib/journal/timezone";

export const TRADING_SESSIONS = [
  { id: "asia", label: "Asia", utcWindow: "00:00–08:00 UTC" },
  { id: "london", label: "London", utcWindow: "08:00–13:00 UTC" },
  { id: "london-ny", label: "London–NY", utcWindow: "13:00–16:00 UTC" },
  { id: "ny", label: "New York", utcWindow: "16:00–21:00 UTC" },
  { id: "off-hours", label: "Off-hours", utcWindow: "21:00–00:00 UTC" },
] as const;

export type TradingSessionId = (typeof TRADING_SESSIONS)[number]["id"];

const SESSION_UTC_RANGES: Record<
  TradingSessionId,
  { startHour: number; endHour: number }
> = {
  asia: { startHour: 0, endHour: 8 },
  london: { startHour: 8, endHour: 13 },
  "london-ny": { startHour: 13, endHour: 16 },
  ny: { startHour: 16, endHour: 21 },
  "off-hours": { startHour: 21, endHour: 0 },
};

const SESSION_LABEL_TO_ID: Record<string, TradingSessionId> = {
  asia: "asia",
  tokyo: "asia",
  sydney: "asia",
  london: "london",
  eu: "london",
  europe: "london",
  ny: "ny",
  newyork: "ny",
  "new-york": "ny",
  us: "ny",
  "london-ny": "london-ny",
  londonny: "london-ny",
  overlap: "london-ny",
  "off-hours": "off-hours",
  offhours: "off-hours",
};

export function getSessionLabel(sessionId: string): string {
  const found = TRADING_SESSIONS.find((s) => s.id === sessionId);
  return found?.label ?? sessionId;
}

export function normalizeSessionInput(
  value: string | null | undefined
): TradingSessionId | null {
  if (!value?.trim()) return null;
  const key = value.trim().toLowerCase().replace(/[^a-z]/g, "");
  return SESSION_LABEL_TO_ID[key] ?? null;
}

/** Classify entry time into a major FX session bucket (UTC). */
export function resolveTradingSession(entryTime: Date): TradingSessionId {
  const hour =
    entryTime.getUTCHours() + entryTime.getUTCMinutes() / 60;

  if (hour >= 13 && hour < 16) return "london-ny";
  if (hour >= 8 && hour < 13) return "london";
  if (hour >= 16 && hour < 21) return "ny";
  if (hour >= 0 && hour < 8) return "asia";
  return "off-hours";
}

export function resolveEntrySession(entry: {
  session: string | null;
  entryTime: Date;
}): TradingSessionId {
  const stored = normalizeSessionInput(entry.session);
  if (stored) return stored;
  return resolveTradingSession(entry.entryTime);
}

export function sessionTagForEntry(entry: {
  session: string | null;
  entryTime: Date;
}): string {
  return resolveEntrySession(entry);
}

/** Active FX session bucket from current UTC time. */
export function resolveCurrentTradingSession(): TradingSessionId {
  return resolveTradingSession(new Date());
}

export function formatSessionWindowLocal(
  sessionId: TradingSessionId,
  timezone: string
): string {
  const tz = normalizeTraderTimezone(timezone);
  const range = SESSION_UTC_RANGES[sessionId];
  const start = formatUtcHourInTimezone(range.startHour, tz);
  const end = formatUtcHourInTimezone(range.endHour, tz);
  return `${start}–${end}`;
}

export function getSessionDisplay(
  sessionId: TradingSessionId,
  timezone?: string
): { label: string; window: string; utcWindow: string } {
  const session = TRADING_SESSIONS.find((s) => s.id === sessionId);
  const tz = timezone ? normalizeTraderTimezone(timezone) : null;
  return {
    label: session?.label ?? sessionId,
    window: tz ? formatSessionWindowLocal(sessionId, tz) : session?.utcWindow ?? "",
    utcWindow: session?.utcWindow ?? "",
  };
}