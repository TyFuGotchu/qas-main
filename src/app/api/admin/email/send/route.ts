import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import {
  getDefaultFromAddress,
  getSupportFromAddress,
  hasResendKey,
  plainTextToEmailHtml,
  sendEmailDetailed,
} from "@/lib/email/resend";
import { normalizeEmail } from "@/lib/security/origin";

export const dynamic = "force-dynamic";

/**
 * Admin single-recipient email (not bulk campaign).
 * POST { to, subject, body, fromSupport?: boolean }
 */
export async function POST(request: NextRequest) {
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

  const body = await request.json().catch(() => ({}));
  const toRaw = typeof body.to === "string" ? body.to.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.body === "string" ? body.body.trim() : "";
  const fromSupport = Boolean(body.fromSupport);

  if (!toRaw || !subject || !message) {
    return NextResponse.json(
      { error: "to, subject, and body are required" },
      { status: 400 }
    );
  }

  const to = normalizeEmail(toRaw);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: "Invalid recipient email" }, { status: 400 });
  }

  const html = body.bodyIsHtml
    ? message
    : plainTextToEmailHtml(message);

  const result = await sendEmailDetailed({
    to,
    subject,
    html,
    text: body.bodyIsHtml ? undefined : message,
    from: fromSupport ? getSupportFromAddress() : getDefaultFromAddress(),
    tags: [
      { name: "category", value: "admin-single" },
      { name: "admin_id", value: session.id.slice(0, 256) },
    ],
    idempotencyKey: `admin-single/${session.id}/${to}/${Date.now()}`.slice(
      0,
      256
    ),
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.error ?? "Send failed",
        skipped: result.skipped,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    id: result.id,
    to,
    from: fromSupport ? getSupportFromAddress() : getDefaultFromAddress(),
  });
}
