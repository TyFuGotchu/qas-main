import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuthSecret, isProduction } from "@/lib/env";
import { type UserSession } from "@/types";

const SESSION_COOKIE = "qs_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction(),
  sameSite: "lax" as const,
  maxAge: SESSION_DURATION,
  path: "/",
};

function getJwtSecret(): Uint8Array {
  return new TextEncoder().encode(getAuthSecret());
}

export async function createSessionToken(user: UserSession): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    subscriptionTier: user.subscriptionTier,
    accountTier: user.accountTier,
    isAdmin: user.isAdmin,
    onboardingComplete: user.onboardingComplete,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getJwtSecret());
}

export async function verifySessionToken(
  token: string
): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: (payload.name as string | null) ?? null,
      subscriptionTier:
        (payload.subscriptionTier as UserSession["subscriptionTier"]) ??
        "FREE",
      accountTier: payload.accountTier as UserSession["accountTier"],
      isAdmin: Boolean(payload.isAdmin),
      onboardingComplete: Boolean(payload.onboardingComplete),
    };
  } catch {
    return null;
  }
}

export function applySessionCookie(
  response: NextResponse,
  token: string
): NextResponse {
  response.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return response;
}

/** Prefer applySessionCookie in route handlers — cookies().set() is unreliable there. */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
}

export async function jsonWithSession(
  body: unknown,
  token: string,
  init?: ResponseInit
): Promise<NextResponse> {
  return applySessionCookie(NextResponse.json(body, init), token);
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}