import { NextRequest, NextResponse } from "next/server";
import { getResendApiKey, getResendClient, hasResendKey } from "@/lib/email/resend";
import {
  processInboundReceivedEvent,
  type ResendReceivedEvent,
} from "@/lib/email/inbound";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function cleanSecret(value: string | undefined): string {
  if (!value) return "";
  let v = value.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

/**
 * Resend inbound webhook.
 * Configure at https://resend.com/webhooks → email.received
 * URL: https://quicksilveralgo.com/api/webhooks/resend
 * Secret: RESEND_WEBHOOK_SECRET
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  let event: ResendReceivedEvent;

  const webhookSecret = cleanSecret(process.env.RESEND_WEBHOOK_SECRET);
  const resend = getResendClient();

  const svixId = request.headers.get("svix-id") ?? "";
  const svixTimestamp = request.headers.get("svix-timestamp") ?? "";
  const svixSignature = request.headers.get("svix-signature") ?? "";

  if (webhookSecret) {
    if (!resend) {
      console.error("[webhooks/resend] webhook secret set but RESEND_API_KEY missing");
      return NextResponse.json(
        { error: "Resend API key missing on server" },
        { status: 503 }
      );
    }

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("[webhooks/resend] missing svix headers");
      return NextResponse.json(
        { error: "Missing webhook signature headers" },
        { status: 401 }
      );
    }

    try {
      const verified = resend.webhooks.verify({
        payload: rawBody,
        headers: {
          id: svixId,
          timestamp: svixTimestamp,
          signature: svixSignature,
        },
        webhookSecret,
      }) as ResendReceivedEvent;
      event = verified;
    } catch (err) {
      console.error("[webhooks/resend] signature verification failed:", err);
      return NextResponse.json(
        {
          error: "Invalid signature",
          hint: "RESEND_WEBHOOK_SECRET must match the signing secret for this webhook in Resend → Webhooks",
        },
        { status: 401 }
      );
    }
  } else {
    try {
      event = JSON.parse(rawBody) as ResendReceivedEvent;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    console.warn(
      "[webhooks/resend] RESEND_WEBHOOK_SECRET not set — accepting unverified payload"
    );
  }

  console.info(
    `[webhooks/resend] event type=${event.type} email_id=${
      event.data?.email_id ?? event.data?.emailId ?? event.data?.id ?? "n/a"
    }`
  );

  try {
    const result = await processInboundReceivedEvent(event);
    console.info("[webhooks/resend] process result:", result);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[webhooks/resend] processing error:", err);
    return NextResponse.json(
      {
        error: "Processing failed",
        detail: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 }
    );
  }
}

/** Health check — confirms the endpoint is public and env flags (no secrets). */
export async function GET() {
  const key = getResendApiKey();
  return NextResponse.json({
    ok: true,
    endpoint: "resend-inbound-webhook",
    hasApiKey: hasResendKey(),
    apiKeyPrefix: key ? `${key.slice(0, 5)}…` : null,
    hasWebhookSecret: Boolean(cleanSecret(process.env.RESEND_WEBHOOK_SECRET)),
    expectedUrl: "https://quicksilveralgo.com/api/webhooks/resend",
    event: "email.received",
  });
}
