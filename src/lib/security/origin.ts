import { NextRequest } from "next/server";
import { isProduction } from "@/lib/env";

function getAllowedOrigins(): string[] {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://quicksilveralgo.com";

  const origins = new Set<string>();

  try {
    const parsed = new URL(siteUrl);
    origins.add(parsed.origin);
  } catch {
    // ignore invalid env URL
  }

  if (!isProduction()) {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
  }

  return Array.from(origins);
}

function originFromUrl(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

export function isAllowedOrigin(request: NextRequest): boolean {
  if (!isProduction()) return true;

  const allowed = getAllowedOrigins();
  const origin = request.headers.get("origin");
  if (origin && allowed.includes(origin)) return true;

  const referer = request.headers.get("referer");
  if (referer) {
    const refererOrigin = originFromUrl(referer);
    if (refererOrigin && allowed.includes(refererOrigin)) return true;
  }

  return false;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}