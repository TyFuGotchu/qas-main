import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import {
  getSupportFromAddress,
  hasResendKey,
  plainTextToEmailHtml,
  sendEmailDetailed,
} from "@/lib/email/resend";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const data: { read?: boolean; archived?: boolean } = {};
  if (typeof body.read === "boolean") data.read = body.read;
  if (typeof body.archived === "boolean") data.archived = body.archived;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No updates" }, { status: 400 });
  }

  const email = await prisma.supportInboundEmail.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ email });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const inbound = await prisma.supportInboundEmail.findUnique({
    where: { id: params.id },
  });
  if (!inbound) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const replyText = typeof body.body === "string" ? body.body.trim() : "";
  if (!replyText) {
    return NextResponse.json({ error: "Reply body required" }, { status: 400 });
  }

  const subject = inbound.subject.startsWith("Re:")
    ? inbound.subject
    : `Re: ${inbound.subject}`;

  const result = await sendEmailDetailed({
    to: inbound.fromAddress,
    subject,
    html: plainTextToEmailHtml(replyText),
    text: replyText,
    from: getSupportFromAddress(),
    replyTo: getSupportFromAddress().match(/<([^>]+)>/)?.[1] ?? undefined,
    idempotencyKey: `support-reply/${inbound.id}/${Date.now()}`,
    tags: [
      { name: "category", value: "support-reply" },
      { name: "inbound_id", value: inbound.id.slice(0, 256) },
    ],
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Reply failed" },
      { status: 502 }
    );
  }

  const email = await prisma.supportInboundEmail.update({
    where: { id: params.id },
    data: {
      read: true,
      repliedAt: new Date(),
      replyResendId: result.id ?? null,
    },
  });

  return NextResponse.json({ ok: true, email, resendId: result.id });
}
