import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { hasResendKey } from "@/lib/email/resend";
import {
  resolveBulkRecipients,
  runBulkEmailCampaign,
  type BulkAudience,
} from "@/lib/email/bulk-campaign";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const AUDIENCES: BulkAudience[] = [
  "all",
  "free",
  "premium",
  "onboarded",
  "custom",
];

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const campaigns = await prisma.adminBulkEmailCampaign.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return NextResponse.json({ campaigns });
}

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
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.body === "string" ? body.body.trim() : "";
  const audience = body.audience as BulkAudience;
  const previewOnly = Boolean(body.previewOnly);
  const customEmails =
    typeof body.customEmails === "string"
      ? body.customEmails.split(/[\n,;]+/)
      : Array.isArray(body.customEmails)
        ? body.customEmails.map(String)
        : [];

  if (!subject || !message) {
    return NextResponse.json(
      { error: "Subject and body are required" },
      { status: 400 }
    );
  }

  if (!AUDIENCES.includes(audience)) {
    return NextResponse.json({ error: "Invalid audience" }, { status: 400 });
  }

  if (previewOnly) {
    const recipients = await resolveBulkRecipients(audience, customEmails);
    return NextResponse.json({
      preview: true,
      recipientCount: recipients.length,
      sample: recipients.slice(0, 10).map((r) => r.email),
    });
  }

  try {
    const result = await runBulkEmailCampaign({
      subject,
      body: message,
      bodyIsHtml: Boolean(body.bodyIsHtml),
      audience,
      customEmails,
      createdByEmail: session.email,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const messageText =
      err instanceof Error ? err.message : "Bulk send failed";
    return NextResponse.json({ error: messageText }, { status: 400 });
  }
}
