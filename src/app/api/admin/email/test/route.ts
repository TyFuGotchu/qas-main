import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import {
  getDefaultFromAddress,
  hasResendKey,
  sendEmailDetailed,
} from "@/lib/email/resend";

export const dynamic = "force-dynamic";

/**
 * Admin-only Resend smoke test.
 * POST { "to"?: "you@domain.com" } — defaults to the admin session email.
 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!hasResendKey()) {
    return NextResponse.json(
      {
        error: "RESEND_API_KEY is not set on this environment",
        configured: false,
      },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const to =
    typeof body.to === "string" && body.to.includes("@")
      ? body.to.trim().toLowerCase()
      : session.email;

  const result = await sendEmailDetailed({
    to,
    subject: "Quicksilver Resend test — inbox confirmed",
    html: `
      <div style="font-family:ui-monospace,monospace;color:#e2e8f0;background:#020617;padding:32px;max-width:560px;">
        <h1 style="color:#00e5ff;font-size:18px;">Resend is connected</h1>
        <p style="color:#94a3b8;line-height:1.6;">
          This message was sent via the official Resend Node SDK from
          <strong style="color:#e2e8f0;">${getDefaultFromAddress()}</strong>.
        </p>
        <p style="color:#64748b;font-size:12px;margin-top:24px;">
          Sent at ${new Date().toISOString()} · admin smoke test
        </p>
      </div>
    `,
    idempotencyKey: `admin-email-test/${session.id}/${Date.now()}`,
    tags: [
      { name: "category", value: "admin-test" },
      { name: "user_id", value: session.id.slice(0, 256) },
    ],
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.error ?? "Send failed",
        from: getDefaultFromAddress(),
        to,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    id: result.id,
    from: getDefaultFromAddress(),
    to,
  });
}

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    configured: hasResendKey(),
    from: getDefaultFromAddress(),
  });
}
