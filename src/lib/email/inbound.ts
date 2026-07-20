import { prisma } from "@/lib/prisma";
import { getResendClient } from "@/lib/email/resend";

export interface ResendReceivedEvent {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    message_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
    attachments?: unknown[];
  };
}

function extractEmailAddress(from: string): string {
  const match = from.match(/<([^>]+)>/);
  return (match?.[1] ?? from).trim().toLowerCase();
}

/**
 * Handle Resend email.received webhook: fetch full body and store in support inbox.
 */
export async function processInboundReceivedEvent(
  event: ResendReceivedEvent
): Promise<{ stored: boolean; id?: string; reason?: string }> {
  if (event.type !== "email.received") {
    return { stored: false, reason: "ignored_event_type" };
  }

  const emailId = event.data?.email_id;
  if (!emailId) {
    return { stored: false, reason: "missing_email_id" };
  }

  const existing = await prisma.supportInboundEmail.findUnique({
    where: { resendEmailId: emailId },
  });
  if (existing) {
    return { stored: false, id: existing.id, reason: "duplicate" };
  }

  const resend = getResendClient();
  if (!resend) {
    return { stored: false, reason: "resend_not_configured" };
  }

  const { data, error } = await resend.emails.receiving.get(emailId);
  if (error || !data) {
    console.error("[inbound] failed to fetch received email:", error);
    // Still store metadata so admin sees the message arrived
    const row = await prisma.supportInboundEmail.create({
      data: {
        resendEmailId: emailId,
        messageId: event.data?.message_id ?? null,
        fromAddress: event.data?.from
          ? extractEmailAddress(event.data.from)
          : "unknown",
        toAddresses: event.data?.to ?? [],
        subject: event.data?.subject ?? "(no subject)",
        textBody: null,
        htmlBody: null,
      },
    });
    return { stored: true, id: row.id, reason: "metadata_only" };
  }

  const fromRaw =
    (typeof data.from === "string" ? data.from : "") ||
    event.data?.from ||
    "unknown";

  const row = await prisma.supportInboundEmail.create({
    data: {
      resendEmailId: emailId,
      messageId:
        (typeof data.message_id === "string" ? data.message_id : null) ??
        event.data?.message_id ??
        null,
      fromAddress: extractEmailAddress(fromRaw),
      toAddresses: Array.isArray(data.to) ? data.to : event.data?.to ?? [],
      subject:
        (typeof data.subject === "string" ? data.subject : null) ??
        event.data?.subject ??
        "(no subject)",
      textBody: typeof data.text === "string" ? data.text : null,
      htmlBody: typeof data.html === "string" ? data.html : null,
    },
  });

  return { stored: true, id: row.id };
}
