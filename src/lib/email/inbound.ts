import { prisma } from "@/lib/prisma";
import { getResendApiKey, getResendClient } from "@/lib/email/resend";

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

interface ReceivingListItem {
  id: string;
  from?: string;
  to?: string[];
  subject?: string;
  message_id?: string;
  created_at?: string;
}

interface ReceivingEmailDetail extends ReceivingListItem {
  html?: string | null;
  text?: string | null;
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

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (typeof value === "string" && value) return [value];
  return [];
}

/** Direct HTTP list — more reliable than assuming SDK response shape. */
async function listReceivingViaHttp(
  apiKey: string,
  limit: number
): Promise<{ items: ReceivingListItem[]; error?: string; raw?: unknown }> {
  const res = await fetch(
    `https://api.resend.com/emails/receiving?limit=${Math.min(limit, 100)}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const json = (await res.json().catch(() => null)) as unknown;
  if (!res.ok) {
    const msg =
      json &&
      typeof json === "object" &&
      "message" in json &&
      typeof (json as { message: unknown }).message === "string"
        ? (json as { message: string }).message
        : `HTTP ${res.status}`;
    return { items: [], error: msg, raw: json };
  }

  // Possible shapes: { data: [...] } | { data: { data: [...] } } | { object: 'list', data: [...] }
  let items: unknown[] = [];
  if (json && typeof json === "object") {
    const root = json as Record<string, unknown>;
    if (Array.isArray(root.data)) {
      items = root.data;
    } else if (
      root.data &&
      typeof root.data === "object" &&
      Array.isArray((root.data as { data?: unknown }).data)
    ) {
      items = (root.data as { data: unknown[] }).data;
    } else if (Array.isArray(root.emails)) {
      items = root.emails;
    }
  }

  const normalized: ReceivingListItem[] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const id = typeof row.id === "string" ? row.id : null;
    if (!id) continue;
    normalized.push({
      id,
      from: typeof row.from === "string" ? row.from : undefined,
      to: asStringArray(row.to),
      subject: typeof row.subject === "string" ? row.subject : undefined,
      message_id:
        typeof row.message_id === "string" ? row.message_id : undefined,
      created_at:
        typeof row.created_at === "string" ? row.created_at : undefined,
    });
  }

  return { items: normalized, raw: json };
}

async function getReceivingViaHttp(
  apiKey: string,
  emailId: string
): Promise<{ detail: ReceivingEmailDetail | null; error?: string }> {
  const res = await fetch(
    `https://api.resend.com/emails/receiving/${encodeURIComponent(emailId)}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const json = (await res.json().catch(() => null)) as unknown;
  if (!res.ok) {
    const msg =
      json &&
      typeof json === "object" &&
      "message" in json &&
      typeof (json as { message: unknown }).message === "string"
        ? (json as { message: string }).message
        : `HTTP ${res.status}`;
    return { detail: null, error: msg };
  }

  // Unwrap { data: email } or bare email object
  const root =
    json &&
    typeof json === "object" &&
    "data" in json &&
    (json as { data: unknown }).data &&
    typeof (json as { data: unknown }).data === "object"
      ? ((json as { data: Record<string, unknown> }).data as Record<
          string,
          unknown
        >)
      : (json as Record<string, unknown> | null);

  if (!root || typeof root.id !== "string") {
    return { detail: null, error: "unexpected_get_shape" };
  }

  return {
    detail: {
      id: root.id,
      from: typeof root.from === "string" ? root.from : undefined,
      to: asStringArray(root.to),
      subject: typeof root.subject === "string" ? root.subject : undefined,
      message_id:
        typeof root.message_id === "string" ? root.message_id : undefined,
      html: typeof root.html === "string" ? root.html : null,
      text: typeof root.text === "string" ? root.text : null,
      created_at:
        typeof root.created_at === "string" ? root.created_at : undefined,
    },
  };
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
  try {
    const existing = await prisma.supportInboundEmail.findUnique({
      where: { resendEmailId: emailId },
    });
    if (existing) {
      return { stored: false, id: existing.id, reason: "duplicate" };
    }
  } catch (err) {
    console.error("[inbound] DB lookup failed — run prisma db push?", err);
    return {
      stored: false,
      reason:
        "db_error: SupportInboundEmail table missing? Redeploy so prisma db push runs.",
    };
  }

  const apiKey = getResendApiKey();
  if (!apiKey) {
    return { stored: false, reason: "resend_not_configured" };
  }

  // Prefer direct HTTP (clear errors); fall back to SDK
  let detail: ReceivingEmailDetail | null = null;
  const httpGet = await getReceivingViaHttp(apiKey, emailId);
  if (httpGet.detail) {
    detail = httpGet.detail;
  } else {
    const resend = getResendClient();
    if (resend) {
      const { data, error } = await resend.emails.receiving.get(emailId);
      if (data && !error) {
        detail = {
          id: data.id,
          from: data.from,
          to: data.to,
          subject: data.subject,
          message_id: data.message_id,
          html: data.html,
          text: data.text,
          created_at: data.created_at,
        };
      } else {
        console.error("[inbound] SDK get failed:", emailId, error ?? httpGet.error);
      }
    }
  }

  const fromRaw = detail?.from || meta?.from || "unknown";
  const subject =
    detail?.subject || meta?.subject || "(no subject)";
  const toAddresses = detail?.to?.length
    ? detail.to
    : meta?.to ?? [];
  const messageId =
    detail?.message_id ?? meta?.messageId ?? null;
  const textBody = detail?.text ?? null;
  const htmlBody = detail?.html ?? null;

  // Always store when we have an id — even metadata-only
  try {
    const row = await prisma.supportInboundEmail.create({
      data: {
        resendEmailId: emailId,
        messageId,
        fromAddress: extractEmailAddress(fromRaw),
        toAddresses,
        subject,
        textBody,
        htmlBody,
        ...(detail?.created_at
          ? { receivedAt: new Date(detail.created_at) }
          : {}),
      },
    });
    return {
      stored: true,
      id: row.id,
      reason: detail ? "imported" : "metadata_only",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "create_failed";
    console.error("[inbound] create failed:", emailId, err);
    // Unique race
    if (msg.includes("Unique constraint") || msg.includes("unique")) {
      return { stored: false, reason: "duplicate" };
    }
    return { stored: false, reason: `db_create_error:${msg}` };
  }
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
    console.error("[inbound] missing email_id in event:", JSON.stringify(event));
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
 */
export async function syncInboundFromResend(limit = 50): Promise<{
  listed: number;
  imported: number;
  skipped: number;
  errors: string[];
  debug?: string;
}> {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const httpList = await listReceivingViaHttp(apiKey, limit);
  let items = httpList.items;
  let debug = "";

  if (httpList.error || items.length === 0) {
    // Try SDK as second path
    const resend = getResendClient();
    if (resend) {
      const { data, error } = await resend.emails.receiving.list({ limit });
      if (error) {
        debug = `http=${httpList.error ?? "empty"}; sdk=${error.message}`;
      } else if (data) {
        const nested = Array.isArray(data.data) ? data.data : [];
        items = nested.map((item) => ({
          id: item.id,
          from: item.from,
          to: item.to,
          subject: item.subject,
          message_id: item.message_id,
          created_at: item.created_at,
        }));
        debug = `http=${httpList.error ?? `count=${httpList.items.length}`}; sdk=${items.length}`;
      }
    } else {
      debug = `http=${httpList.error ?? "empty"}; sdk=no_client`;
    }
  }

  if (httpList.error && items.length === 0) {
    throw new Error(
      `Failed to list received emails from Resend: ${httpList.error}. Confirm the API key can access Receiving (Emails → Receiving in dashboard).`
    );
  }

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
    debug: debug || undefined,
  };
}
