import { NextRequest, NextResponse } from "next/server";
import { getResendClient } from "@/lib/email/resend";
import {
  processInboundReceivedEvent,
  type ResendReceivedEvent,
} from "@/lib/email/inbound";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Resend inbound webhook.
 * Configure at https://resend.com/webhooks → email.received
 * URL: https://quicksilveralgo.com/api/webhooks/resend
 * Secret: RESEND_WEBHOOK_SECRET
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  let event: ResendReceivedEvent;

  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  const resend = getResendClient();

  if (webhookSecret && resend) {
    try {
      const verified = resend.webhooks.verify({
        payload: rawBody,
        headers: {
          id: request.headers.get("svix-id") ?? "",
          timestamp: request.headers.get("svix-timestamp") ?? "",
          signature: request.headers.get("svix-signature") ?? "",
        },
        webhookSecret,
      }) as ResendReceivedEvent;
      event = verified;
    } catch (err) {
      console.error("[webhooks/resend] signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else {
    try {
      event = JSON.parse(rawBody) as ResendReceivedEvent;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (process.env.NODE_ENV === "production" && !webhookSecret) {
      console.warn(
        "[webhooks/resend] RESEND_WEBHOOK_SECRET not set — accepting unverified payload"
      );
    }
  }

  try {
    const result = await processInboundReceivedEvent(event);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[webhooks/resend] processing error:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
