import { createHash } from "crypto";
import { EncryptJWT, jwtDecrypt } from "jose";
import { cookies } from "next/headers";
import { getAuthSecret, isProduction } from "@/lib/env";
import {
  TOKEN_COOKIE_MAX_AGE,
  TRADELOCKER_COOKIE_ACCESS,
  TRADELOCKER_COOKIE_ENV,
  TRADELOCKER_COOKIE_EXPIRE,
  TRADELOCKER_COOKIE_REFRESH,
  type TradeLockerEnvironment,
  isTradeLockerEnvironment,
} from "@/lib/tradelocker/constants";
import type { TradeLockerTokens } from "@/lib/tradelocker/types";

function getEncryptionKey(): Uint8Array {
  const hash = createHash("sha256").update(getAuthSecret()).digest();
  return new Uint8Array(hash);
}

function cookieBaseOptions() {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? ("strict" as const) : ("lax" as const),
    maxAge: TOKEN_COOKIE_MAX_AGE,
    path: "/",
  };
}

async function encryptValue(value: string): Promise<string> {
  return new EncryptJWT({ v: value })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .encrypt(getEncryptionKey());
}

async function decryptValue(payload: string): Promise<string | null> {
  try {
    const { payload: decoded } = await jwtDecrypt(payload, getEncryptionKey());
    const v = decoded.v;
    return typeof v === "string" ? v : null;
  } catch {
    return null;
  }
}

export async function setTradeLockerTokenCookies(
  tokens: TradeLockerTokens,
  environment: TradeLockerEnvironment
): Promise<void> {
  const cookieStore = await cookies();
  const [accessEnc, refreshEnc] = await Promise.all([
    encryptValue(tokens.accessToken),
    encryptValue(tokens.refreshToken),
  ]);

  const base = cookieBaseOptions();

  cookieStore.set(TRADELOCKER_COOKIE_ACCESS, accessEnc, base);
  cookieStore.set(TRADELOCKER_COOKIE_REFRESH, refreshEnc, base);
  cookieStore.set(TRADELOCKER_COOKIE_EXPIRE, tokens.expireDate, base);
  cookieStore.set(TRADELOCKER_COOKIE_ENV, environment, base);
}

export async function clearTradeLockerTokenCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TRADELOCKER_COOKIE_ACCESS);
  cookieStore.delete(TRADELOCKER_COOKIE_REFRESH);
  cookieStore.delete(TRADELOCKER_COOKIE_EXPIRE);
  cookieStore.delete(TRADELOCKER_COOKIE_ENV);
}

export async function getTradeLockerEnvironmentFromCookies(): Promise<TradeLockerEnvironment> {
  const cookieStore = await cookies();
  const env = cookieStore.get(TRADELOCKER_COOKIE_ENV)?.value ?? "live";
  return isTradeLockerEnvironment(env) ? env : "live";
}

export async function getTradeLockerTokensFromCookies(): Promise<TradeLockerTokens | null> {
  const cookieStore = await cookies();
  const accessEnc = cookieStore.get(TRADELOCKER_COOKIE_ACCESS)?.value;
  const refreshEnc = cookieStore.get(TRADELOCKER_COOKIE_REFRESH)?.value;
  const expireDate = cookieStore.get(TRADELOCKER_COOKIE_EXPIRE)?.value;

  if (!accessEnc || !refreshEnc) return null;

  const [accessToken, refreshToken] = await Promise.all([
    decryptValue(accessEnc),
    decryptValue(refreshEnc),
  ]);

  if (!accessToken || !refreshToken) return null;

  return {
    accessToken,
    refreshToken,
    expireDate: expireDate ?? "",
  };
}

export function isAccessTokenExpired(expireDate: string): boolean {
  if (!expireDate) return false;
  const expires = new Date(expireDate).getTime();
  if (Number.isNaN(expires)) return false;
  return Date.now() >= expires - 60_000;
}