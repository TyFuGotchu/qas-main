import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { type AccountTier, type SubscriptionTier } from "@/types";
import { getAuthSecret, validateCoreProductionEnv } from "@/lib/env";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/support", "/faq"];
const SEO_PUBLIC_PREFIXES = ["/lessons", "/guides", "/solutions", "/offers"];
const AUTH_ROUTES = ["/login", "/register"];
const ONBOARDING_ROUTES_PREFIX = "/onboarding";

interface SessionPayload {
  subscriptionTier: SubscriptionTier;
  accountTier: AccountTier;
  isAdmin: boolean;
  onboardingComplete: boolean;
}

function getJwtSecret(): Uint8Array {
  return new TextEncoder().encode(getAuthSecret());
}

function productionConfigErrorResponse(
  request: NextRequest,
  message: string
): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Server misconfiguration", message },
      { status: 503 }
    );
  }

  return new NextResponse(
    `Service Unavailable: ${message}`,
    { status: 503, headers: { "Content-Type": "text/plain" } }
  );
}

async function getSessionFromRequest(
  request: NextRequest
): Promise<SessionPayload | null> {
  const token = request.cookies.get("qs_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      subscriptionTier:
        (payload.subscriptionTier as SubscriptionTier) ?? "FREE",
      accountTier: payload.accountTier as AccountTier,
      isAdmin: Boolean(payload.isAdmin),
      onboardingComplete: Boolean(payload.onboardingComplete),
    };
  } catch {
    return null;
  }
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

function isSeoPublicRoute(pathname: string): boolean {
  return SEO_PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route);
}

function isOnboardingRoute(pathname: string): boolean {
  return (
    pathname === ONBOARDING_ROUTES_PREFIX ||
    pathname.startsWith(`${ONBOARDING_ROUTES_PREFIX}/`)
  );
}

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith("/dashboard");
}

function isLegacyPricingRoute(pathname: string): boolean {
  return pathname === "/pricing" || pathname.startsWith("/pricing/");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const envCheck = validateCoreProductionEnv();
  if (!envCheck.valid && envCheck.message) {
    console.error("[middleware] Production env validation failed:", envCheck.message);
    return productionConfigErrorResponse(request, envCheck.message);
  }

  const session = await getSessionFromRequest(request);

  if (
    pathname === "/dashboard/discord" ||
    pathname.startsWith("/dashboard/discord/")
  ) {
    return NextResponse.redirect(new URL("/dashboard/support", request.url));
  }

  if (isSeoPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/webhooks/stripe") ||
    pathname.startsWith("/api/engagement/capture")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/engagement/drip")) {
    return NextResponse.next();
  }

  if (isLegacyPricingRoute(pathname)) {
    if (!session) {
      return NextResponse.redirect(new URL("/register", request.url));
    }
    if (!session.onboardingComplete) {
      return NextResponse.redirect(
        new URL("/onboarding/pricing", request.url)
      );
    }
    return NextResponse.redirect(new URL("/dashboard/upgrade", request.url));
  }

  if (isAdminRoute(pathname)) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!session.isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (isPublicRoute(pathname) && !isDashboardRoute(pathname) && !isOnboardingRoute(pathname)) {
    if (session && isAuthRoute(pathname)) {
      const dest = session.onboardingComplete
        ? "/dashboard"
        : "/onboarding/pricing";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  if (isOnboardingRoute(pathname)) {
    if (!session) {
      return NextResponse.redirect(new URL("/register", request.url));
    }
    if (session.onboardingComplete) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/onboarding")) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (isDashboardRoute(pathname) || pathname.startsWith("/api/")) {
    if (!session) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Onboarding gate is enforced in dashboard layout via DB-backed session.
    // JWT cookie can lag after register/onboarding; blocking here caused redirect loops.
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};