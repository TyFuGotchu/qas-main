import { prisma } from "@/lib/prisma";
import { getResendClient } from "@/lib/email/resend";

export interface ResendReceivedEvent {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    emailId?: string;
    id?: string;
    message_id?: string;
    messageId?: string;
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

function resolveEmailId(event: ResendReceivedEvent): string | null {
  const d = event.data;
  if (!d) return null;
  return d.email_id ?? d.emailId ?? d.id ?? null;
}

/**
 * Upsert a single received email into SupportInboundEmail by Resend id.
 */
export async function importReceivedEmailById(
  emailId: string,
  meta?: {
    from?: string;
    to?: string[];
    subject?: string;
    messageId?: string | null;
  }
): Promise<{ stored: boolean; id?: string; reason?: string }> {
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
    console.error("[inbound] failed to fetch received email:", emailId, error);
    // Store webhook metadata so the admin at least sees the message arrived
    if (meta?.from || meta?.subject) {
      const row = await prisma.supportInboundEmail.create({
        data: {
          resendEmailId: emailId,
          messageId: meta.messageId ?? null,
          fromAddress: meta.from ? extractEmailAddress(meta.from) : "unknown",
          toAddresses: meta.to ?? [],
          subject: meta.subject ?? "(no subject)",
          textBody: null,
          htmlBody: null,
        },
      });
      return { stored: true, id: row.id, reason: "metadata_only" };
    }
    return {
      stored: false,
      reason: error?.message ?? "fetch_failed",
    };
  }

  const fromRaw =
    (typeof data.from === "string" ? data.from : "") || meta?.from || "unknown";

  const row = await prisma.supportInboundEmail.create({
    data: {
      resendEmailId: emailId,
      messageId:
        (typeof data.message_id === "string" ? data.message_id : null) ??
        meta?.messageId ??
        null,
      fromAddress: extractEmailAddress(fromRaw),
      toAddresses: Array.isArray(data.to) ? data.to : meta?.to ?? [],
      subject:
        (typeof data.subject === "string" ? data.subject : null) ??
        meta?.subject ??
        "(no subject)",
      textBody: typeof data.text === "string" ? data.text : null,
      htmlBody: typeof data.html === "string" ? data.html : null,
    },
  });

  return { stored: true, id: row.id };
}

/**
 * Handle Resend email.received webhook payload.
 */
export async function processInboundReceivedEvent(
  event: ResendReceivedEvent
): Promise<{ stored: boolean; id?: string; reason?: string }> {
  if (event.type !== "email.received") {
    return { stored: false, reason: `ignored_event_type:${event.type}` };
  }

  const emailId = resolveEmailId(event);
  if (!emailId) {
    return { stored: false, reason: "missing_email_id" };
  }

  return importReceivedEmailById(emailId, {
    from: event.data?.from,
    to: event.data?.to,
    subject: event.data?.subject,
    messageId: event.data?.message_id ?? event.data?.messageId ?? null,
  });
}

/**
 * Pull recent inbound emails from Resend Receiving API into the admin inbox.
 * Use this when webhooks didn't fire (MX/webhook misconfig) but mail is in Resend.
 */
export async function syncInboundFromResend(limit = 50): Promise<{
  listed: number;
  imported: number;
  skipped: number;
  errors: string[];
}> {
  const resend = getResendClient();
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const { data, error } = await resend.emails.receiving.list({ limit });
  if (error || !data) {
    throw new Error(
      error?.message ??
        "Failed to list received emails. Confirm domain Receiving is enabled and MX is verified in Resend."
    );
  }

  const items = Array.isArray(data.data) ? data.data : [];
  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const item of items) {
    try {
      const result = await importReceivedEmailById(item.id, {
        from: item.from,
        to: item.to,
        subject: item.subject,
        messageId: item.message_id ?? null,
      });
      if (result.stored) imported++;
      else skipped++;
      if (result.reason && result.reason !== "duplicate" && !result.stored) {
        errors.push(`${item.id}: ${result.reason}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "import failed";
      errors.push(`${item.id}: ${msg}`);
    }
  }

  return {
    listed: items.length,
    imported,
    skipped,
    errors: errors.slice(0, 20),
  };
}
