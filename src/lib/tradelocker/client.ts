import {
  resolveTradeLockerApiBase,
  type TradeLockerEnvironment,
} from "@/lib/tradelocker/constants";
import {
  clearTradeLockerTokenCookies,
  getTradeLockerEnvironmentFromCookies,
  getTradeLockerTokensFromCookies,
  isAccessTokenExpired,
  setTradeLockerTokenCookies,
} from "@/lib/tradelocker/cookies";
import type {
  TradeLockerCredentials,
  TradeLockerTokens,
} from "@/lib/tradelocker/types";

export class TradeLockerApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "TradeLockerApiError";
  }
}

function tradeLockerHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const devKey = process.env.TRADELOCKER_DEVELOPER_API_KEY;
  if (devKey) {
    headers["tl-developer-api-key"] = devKey;
  }

  return headers;
}

async function parseErrorMessage(res: Response): Promise<string> {
  const fallback = `TradeLocker request failed (${res.status})`;

  try {
    const text = await res.text();
    if (!text) return fallback;

    const data = JSON.parse(text) as Record<string, unknown>;

    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error;
    }
    if (typeof data.detail === "string" && data.detail.trim()) {
      return data.detail;
    }
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const first = data.errors[0] as Record<string, unknown>;
      if (typeof first.message === "string") return first.message;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

function normalizeTokens(data: unknown): TradeLockerTokens | null {
  if (!data || typeof data !== "object") return null;

  const root = data as Record<string, unknown>;
  const nested =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  const accessToken =
    typeof nested.accessToken === "string" ? nested.accessToken : null;
  const refreshToken =
    typeof nested.refreshToken === "string" ? nested.refreshToken : null;
  const expireDate =
    typeof nested.expireDate === "string" ? nested.expireDate : "";

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken, expireDate };
}

async function requestTradeLockerToken(
  apiBase: string,
  credentials: TradeLockerCredentials
): Promise<TradeLockerTokens> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const res = await fetch(`${apiBase}/auth/jwt/token`, {
      method: "POST",
      headers: tradeLockerHeaders(),
      body: JSON.stringify({
        email: credentials.email.trim(),
        password: credentials.password,
        server: credentials.server.trim(),
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new TradeLockerApiError(await parseErrorMessage(res), res.status);
    }

    const raw = await res.json();
    const tokens = normalizeTokens(raw);

    if (!tokens) {
      throw new TradeLockerApiError(
        "Invalid token response from TradeLocker",
        502
      );
    }

    return tokens;
  } catch (error) {
    if (error instanceof TradeLockerApiError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new TradeLockerApiError(
        "TradeLocker API timed out. Please try again.",
        504
      );
    }
    throw new TradeLockerApiError(
      "Could not reach TradeLocker API. Check your connection and try again.",
      503
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function authenticateTradeLocker(
  credentials: TradeLockerCredentials,
  environment: TradeLockerEnvironment
): Promise<TradeLockerTokens> {
  const apiBase = resolveTradeLockerApiBase(environment);
  return requestTradeLockerToken(apiBase, credentials);
}

export async function authenticateTradeLockerWithFallback(
  credentials: TradeLockerCredentials,
  preferredEnvironment: TradeLockerEnvironment
): Promise<{ tokens: TradeLockerTokens; environment: TradeLockerEnvironment }> {
  const order: TradeLockerEnvironment[] =
    preferredEnvironment === "live" ? ["live", "demo"] : ["demo", "live"];

  let lastError: TradeLockerApiError | null = null;

  for (const environment of order) {
    try {
      const tokens = await authenticateTradeLocker(credentials, environment);
      return { tokens, environment };
    } catch (error) {
      if (error instanceof TradeLockerApiError) {
        lastError = error;
        if (error.status === 400 || error.status === 401 || error.status === 403) {
          continue;
        }
        throw error;
      }
      throw error;
    }
  }

  throw (
    lastError ??
    new TradeLockerApiError(
      "Invalid TradeLocker credentials or server name. Use the exact server shown on the TradeLocker login screen.",
      401
    )
  );
}

async function refreshTradeLockerTokens(
  apiBase: string,
  refreshToken: string
): Promise<TradeLockerTokens> {
  const res = await fetch(`${apiBase}/auth/jwt/refresh`, {
    method: "POST",
    headers: tradeLockerHeaders(),
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new TradeLockerApiError(await parseErrorMessage(res), res.status);
  }

  const raw = await res.json();
  const tokens = normalizeTokens(raw);

  if (!tokens) {
    throw new TradeLockerApiError(
      "Invalid refresh response from TradeLocker",
      502
    );
  }

  return tokens;
}

export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await getTradeLockerTokensFromCookies();
  if (!tokens) return null;

  if (!isAccessTokenExpired(tokens.expireDate)) {
    return tokens.accessToken;
  }

  try {
    const environment = await getTradeLockerEnvironmentFromCookies();
    const apiBase = resolveTradeLockerApiBase(environment);
    const refreshed = await refreshTradeLockerTokens(
      apiBase,
      tokens.refreshToken
    );
    await setTradeLockerTokenCookies(refreshed, environment);
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
    throw new TradeLockerApiError(
      "TradeLocker session expired. Please reconnect.",
      401
    );
  }

  const environment = await getTradeLockerEnvironmentFromCookies();
  const apiBase = resolveTradeLockerApiBase(environment);

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  headers.set("Accept", "application/json");
  if (init.accNum) {
    headers.set("accNum", init.accNum);
  }

  const devKey = process.env.TRADELOCKER_DEVELOPER_API_KEY;
  if (devKey) {
    headers.set("tl-developer-api-key", devKey);
  }

  return fetch(`${apiBase}${path}`, {
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

export async function fetchInstruments(
  accountId: string,
  accNum: string
): Promise<unknown> {
  const res = await tradeLockerFetch(
    `/trade/accounts/${accountId}/instruments`,
    { accNum }
  );
  if (!res.ok) {
    throw new TradeLockerApiError(await parseErrorMessage(res), res.status);
  }
  return res.json();
}

export async function placeOrder(
  accountId: string,
  accNum: string,
  order: {
    side: "buy" | "sell";
    qty: number;
    routeId: number;
    tradableInstrumentId: number;
  }
): Promise<unknown> {
  const res = await tradeLockerFetch(
    `/trade/accounts/${accountId}/orders`,
    {
      method: "POST",
      accNum,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        side: order.side,
        type: "market",
        validity: "IOC",
        qty: order.qty,
        routeId: order.routeId,
        tradableInstrumentId: order.tradableInstrumentId,
      }),
    }
  );
  if (!res.ok) {
    throw new TradeLockerApiError(await parseErrorMessage(res), res.status);
  }
  return res.json();
}

export async function closePosition(
  positionId: string,
  accNum: string,
  qty: number
): Promise<unknown> {
  const res = await tradeLockerFetch(`/trade/positions/${positionId}`, {
    method: "DELETE",
    accNum,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qty }),
  });
  if (!res.ok) {
    throw new TradeLockerApiError(await parseErrorMessage(res), res.status);
  }
  return res.json();
}