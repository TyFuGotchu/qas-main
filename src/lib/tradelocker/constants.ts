export const TRADELOCKER_API_BASE =
  process.env.TRADELOCKER_API_BASE ?? "https://live.tradelocker.com/backend-api";

export const DEFAULT_TRADELOCKER_SERVERS = [
  "HeroFX",
  "HeroFX-Demo",
] as const;

export const TRADELOCKER_COOKIE_ACCESS = "tl_access_enc";
export const TRADELOCKER_COOKIE_REFRESH = "tl_refresh_enc";
export const TRADELOCKER_COOKIE_EXPIRE = "tl_expire_at";

export const TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days