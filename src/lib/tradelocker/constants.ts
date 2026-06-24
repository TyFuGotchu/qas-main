export const TRADELOCKER_API_BASES = {
  live: "https://live.tradelocker.com/backend-api",
  demo: "https://demo.tradelocker.com/backend-api",
} as const;

export type TradeLockerEnvironment = keyof typeof TRADELOCKER_API_BASES;

export const TRADELOCKER_COOKIE_ACCESS = "tl_access_enc";
export const TRADELOCKER_COOKIE_REFRESH = "tl_refresh_enc";
export const TRADELOCKER_COOKIE_EXPIRE = "tl_expire_at";
export const TRADELOCKER_COOKIE_ENV = "tl_api_env";

export const TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function resolveTradeLockerApiBase(
  environment: TradeLockerEnvironment
): string {
  const override = process.env.TRADELOCKER_API_BASE?.replace(/\/$/, "");
  if (override && environment === "live") {
    return override;
  }
  return TRADELOCKER_API_BASES[environment];
}

export function isTradeLockerEnvironment(
  value: string
): value is TradeLockerEnvironment {
  return value === "live" || value === "demo";
}