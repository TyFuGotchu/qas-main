import { NextRequest, NextResponse } from "next/server";
import { captureEngagementLead } from "@/lib/email/engagement-drip";
import { normalizeEmail } from "@/lib/security/origin";
import {
  enforceRateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

const CAPTURE_LIMIT = 10;
const CAPTURE_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const rateLimit = enforceRateLimit(
      request,
      "engagement-capture",
      CAPTURE_LIMIT,
      CAPTURE_WINDOW_MS
    );
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.retryAfterSeconds ?? 60);
    }

    const body = await request.json();
    const rawEmail = typeof body.email === "string" ? body.email : "";
    const email = normalizeEmail(rawEmail);
    const viewedLessons = Array.isArray(body.viewedLessons)
      ? body.viewedLessons.filter((x: unknown) => typeof x === "string")
      : [];
    const source = typeof body.source === "string" ? body.source : undefined;
    const abStickyBucket =
      typeof body.abStickyBucket === "string" ? body.abStickyBucket : undefined;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const result = await captureEngagementLead({
      email,
      viewedLessons,
      source,
      abStickyBucket,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[engagement/capture]", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}