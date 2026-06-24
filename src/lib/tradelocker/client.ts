import {
  TRADELOCKER_API_BASE,
} from "@/lib/tradelocker/constants";
import {
  clearTradeLockerTokenCookies,
  getTradeLockerTokensFromCookies,
  isAccessTokenExpired,
  setTradeLockerTokenCookies,
} from "@/lib/tradelocker/cookies";
import type { TradeLockerCredentials, TradeLockerTokens } from "@/lib/tradelocker/types";

export class TradeLockerApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "TradeLockerApiError";
  }
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.error === "string") return data.error;
    return `TradeLocker request failed (${res.status})`;
  } catch {
    return `TradeLocker request failed (${res.status})`;
  }
}

export async function authenticateTradeLocker(
  credentials: TradeLockerCredentials
): Promise<TradeLockerTokens> {
  const res = await fetch(`${TRADELOCKER_API_BASE}/auth/jwt/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: credentials.email.trim(),
      password: credentials.password,
      server: credentials.server.trim(),
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new TradeLockerApiError(await parseErrorMessage(res), res.status);
  }

  const data = (await res.json()) as TradeLockerTokens;
  if (!data.accessToken || !data.refreshToken) {
    throw new TradeLockerApiError("Invalid token response from TradeLocker", 502);
  }

  return data;
}

async function refreshTradeLockerTokens(
  refreshToken: string
): Promise<TradeLockerTokens> {
  const res = await fetch(`${TRADELOCKER_API_BASE}/auth/jwt/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new TradeLockerApiError(await parseErrorMessage(res), res.status);
  }

  const data = (await res.json()) as TradeLockerTokens;
  if (!data.accessToken || !data.refreshToken) {
    throw new TradeLockerApiError("Invalid refresh response from TradeLocker", 502);
  }

  return data;
}

export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await getTradeLockerTokensFromCookies();
  if (!tokens) return null;

  if (!isAccessTokenExpired(tokens.expireDate)) {
    return tokens.accessToken;
  }

  try {
    const refreshed = await refreshTradeLockerTokens(tokens.refreshToken);
    await setTradeLockerTokenCookies(refreshed);
    return refreshed.accessToken;
  } catch {
    await clearTradeLockerTokenCookies();
    return null;
  }
}

export async function tradeLockerFetch(
  path: string,
  init: RequestInit & { accNum?: string } = {}
): Promise<Response> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new TradeLockerApiError("TradeLocker session expired. Please reconnect.", 401);
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  if (init.accNum) {
    headers.set("accNum", init.accNum);
  }

  return fetch(`${TRADELOCKER_API_BASE}${path}`, {
    method: init.method,
    body: init.body,
    headers,
    cache: "no-store",
  });
}

export async function fetchAllAccounts(): Promise<unknown> {
  const res = await tradeLockerFetch("/auth/jwt/all-accounts");
  if (!res.ok) {
    throw new TradeLockerApiError(await parseErrorMessage(res), res.status);
  }
  return res.json();
}

export async function fetchTradeConfig(accNum: string): Promise<unknown> {
  const res = await tradeLockerFetch("/trade/config", { accNum });
  if (!res.ok) {
    throw new TradeLockerApiError(await parseErrorMessage(res), res.status);
  }
  return res.json();
}

export async function fetchAccountState(
  accountId: string,
  accNum: string
): Promise<unknown> {
  const res = await tradeLockerFetch(
    `/trade/accounts/${accountId}/state`,
    { accNum }
  );
  if (!res.ok) {
    throw new TradeLockerApiError(await parseErrorMessage(res), res.status);
  }
  return res.json();
}

export async function fetchOpenPositions(
  accountId: string,
  accNum: string
): Promise<unknown> {
  const res = await tradeLockerFetch(
    `/trade/accounts/${accountId}/positions`,
    { accNum }
  );
  if (!res.ok) {
    throw new TradeLockerApiError(await parseErrorMessage(res), res.status);
  }
  return res.json();
}

export async function fetchOrdersHistory(
  accountId: string,
  accNum: string
): Promise<unknown> {
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const res = await tradeLockerFetch(
    `/trade/accounts/${accountId}/ordersHistory?from=${ninetyDaysAgo}`,
    { accNum }
  );
  if (!res.ok) {
    throw new TradeLockerApiError(await parseErrorMessage(res), res.status);
  }
  return res.json();
}