import { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanupExpired(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  store.forEach((entry, key) => {
    if (entry.resetAt <= now) store.delete(key);
  });
}

/**
 * Resolve client IP behind Railway / reverse proxies.
 * Never collapse all traffic into a single "unknown" bucket — that locks the whole site out.
 */
export function getClientIp(request: NextRequest): string {
  const headers = [
    request.headers.get("cf-connecting-ip"),
    request.headers.get("true-client-ip"),
    request.headers.get("x-real-ip"),
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim(),
  ];

  for (const value of headers) {
    if (value && value.length > 0 && value.toLowerCase() !== "unknown") {
      return value;
    }
  }

  // Isolate unknown clients instead of sharing one global key
  const ua = request.headers.get("user-agent")?.slice(0, 48) ?? "na";
  return `unknown:${ua}`;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
  remaining?: number;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  cleanupExpired();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
      remaining: 0,
    };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

/** Peek without incrementing — for fail-only rate limits. */
export function peekRateLimit(key: string, limit: number): RateLimitResult {
  cleanupExpired();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    return { allowed: true, remaining: limit };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
      remaining: 0,
    };
  }

  return { allowed: true, remaining: limit - entry.count };
}

export function resetRateLimit(key: string): void {
  store.delete(key);
}

export function rateLimitResponse(retryAfterSeconds: number): Response {
  return new Response(
    JSON.stringify({
      error: `Too many attempts. Please wait ${retryAfterSeconds} seconds and try again.`,
      code: "RATE_LIMITED",
      retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}

export function enforceRateLimit(
  request: NextRequest,
  action: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const ip = getClientIp(request);
  return checkRateLimit(`${action}:${ip}`, limit, windowMs);
}

/** Fail-only login limits: check before attempt, increment only after bad credentials. */
export function checkLoginRateLimits(
  request: NextRequest,
  email: string
): RateLimitResult {
  const ip = getClientIp(request);
  const normalizedEmail = email.trim().toLowerCase();

  const ipCheck = peekRateLimit(`auth-login-fail-ip:${ip}`, 30);
  if (!ipCheck.allowed) return ipCheck;

  const emailCheck = peekRateLimit(`auth-login-fail-email:${normalizedEmail}`, 12);
  if (!emailCheck.allowed) return emailCheck;

  // Soft ceiling on total login POSTs (success or fail) per IP — abuse protection only
  const volumeCheck = peekRateLimit(`auth-login-volume:${ip}`, 80);
  if (!volumeCheck.allowed) return volumeCheck;

  return { allowed: true };
}

export function recordLoginAttempt(
  request: NextRequest,
  email: string,
  success: boolean
): void {
  const ip = getClientIp(request);
  const normalizedEmail = email.trim().toLowerCase();
  const windowMs = 15 * 60 * 1000;

  // Always count volume for DoS protection
  checkRateLimit(`auth-login-volume:${ip}`, 80, windowMs);

  if (success) {
    resetRateLimit(`auth-login-fail-email:${normalizedEmail}`);
    return;
  }

  checkRateLimit(`auth-login-fail-ip:${ip}`, 30, windowMs);
  checkRateLimit(`auth-login-fail-email:${normalizedEmail}`, 12, windowMs);
}
