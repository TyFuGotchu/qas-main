import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { hasResendKey } from "@/lib/email/resend";
import { syncInboundFromResend } from "@/lib/email/inbound";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Pull recent inbound messages from Resend Receiving API into admin inbox.
 * Use when webhooks didn't deliver but emails appear under Resend → Receiving.
 */
export async function POST() {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!hasResendKey()) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured" },
      { status: 503 }
    );
  }

  try {
    const result = await syncInboundFromResend(50);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    console.error("[admin/email/inbox/sync]", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
