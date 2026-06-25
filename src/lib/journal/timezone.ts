export const TRADER_TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "US Eastern" },
  { value: "America/Chicago", label: "US Central" },
  { value: "America/Denver", label: "US Mountain" },
  { value: "America/Los_Angeles", label: "US Pacific" },
  { value: "Europe/London", label: "UK / London" },
  { value: "Europe/Berlin", label: "Europe (CET)" },
  { value: "Asia/Dubai", label: "Dubai" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Australia/Sydney", label: "Sydney" },
] as const;

export const DEFAULT_TRADER_TIMEZONE = "America/New_York";

export function isValidTraderTimezone(value: string): boolean {
  return TRADER_TIMEZONES.some((tz) => tz.value === value);
}

export function normalizeTraderTimezone(value: string | null | undefined): string {
  if (value && isValidTraderTimezone(value)) return value;
  return DEFAULT_TRADER_TIMEZONE;
}

export function formatInTimezone(
  date: Date,
  timezone: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const tz = normalizeTraderTimezone(timezone);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    ...options,
  }).format(date);
}

export function formatUtcHourInTimezone(utcHour: number, timezone: string): string {
  const date = new Date(Date.UTC(2024, 5, 15, utcHour, 0));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: normalizeTraderTimezone(timezone),
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function getTimezoneLabel(timezone: string): string {
  return (
    TRADER_TIMEZONES.find((tz) => tz.value === timezone)?.label ?? timezone
  );
}