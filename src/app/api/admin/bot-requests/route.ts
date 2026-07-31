import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/security/origin";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "emailed", "converted", "dismissed"] as const;

function parseEmails(input: unknown): string[] {
  if (typeof input === "string") {
    return input
      .split(/[\n,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes("@"));
  }
  if (Array.isArray(input)) {
    return input
      .map((e) => String(e).trim().toLowerCase())
      .filter((e) => e.includes("@"));
  }
  return [];
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const status = request.nextUrl.searchParams.get("status");
  const where =
    status && STATUSES.includes(status as (typeof STATUSES)[number])
      ? { status }
      : {};

  const [requests, counts] = await Promise.all([
    prisma.tradeLockerBotRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 1000,
    }),
    prisma.tradeLockerBotRequest.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  return NextResponse.json({
    requests,
    counts: Object.fromEntries(
      counts.map((c) => [c.status, c._count])
    ) as Record<string, number>,
  });
}

/** Bulk import emails (CSV paste or list). Upserts — keeps existing status if already present. */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const source =
    typeof body.source === "string" && body.source.trim()
      ? body.source.trim().slice(0, 80)
      : "csv_import";
  const status =
    typeof body.status === "string" &&
    STATUSES.includes(body.status as (typeof STATUSES)[number])
      ? body.status
      : "pending";
  const notes =
    typeof body.notes === "string" ? body.notes.trim().slice(0, 500) : null;

  // Support raw CSV rows or plain email list
  let emails = parseEmails(body.emails ?? body.emailList ?? body.text);
  if (typeof body.csv === "string" && body.csv.includes("@")) {
    const lines = body.csv.split(/\r?\n/).filter(Boolean);
    const header = lines[0]?.toLowerCase() ?? "";
    const start = header.includes("email") ? 1 : 0;
    for (let i = start; i < lines.length; i++) {
      const parts = lines[i].split(",");
      // Resend export: id,created_at,first_name,last_name,email,unsubscribed
      let email = "";
      let unsubscribed = false;
      if (parts.length >= 6 && parts[4]?.includes("@")) {
        email = parts[4].trim().toLowerCase();
        unsubscribed = parts[5]?.trim().toLowerCase() === "true";
      } else {
        const found = parts.find((p: string) => p.includes("@"));
        if (found) email = found.trim().toLowerCase();
      }
      if (email && !unsubscribed) emails.push(email);
    }
  }

  emails = Array.from(
    new Set(
      emails
        .map((e) => normalizeEmail(e))
        .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
    )
  );

  if (emails.length === 0) {
    return NextResponse.json(
      { error: "No valid emails provided" },
      { status: 400 }
    );
  }

  let created = 0;
  let skipped = 0;

  for (const email of emails) {
    try {
      const existing = await prisma.tradeLockerBotRequest.findUnique({
        where: { email },
      });
      if (existing) {
        skipped += 1;
        continue;
      }
      await prisma.tradeLockerBotRequest.create({
        data: {
          email,
          status,
          source,
          notes,
        },
      });
      created += 1;
    } catch {
      skipped += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    created,
    skipped,
    total: emails.length,
  });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const id = typeof body.id === "string" ? body.id : "";
  const ids = Array.isArray(body.ids)
    ? body.ids.map(String)
    : id
      ? [id]
      : [];

  if (ids.length === 0) {
    return NextResponse.json({ error: "id or ids required" }, { status: 400 });
  }

  const data: {
    status?: string;
    notes?: string | null;
    emailedAt?: Date | null;
  } = {};

  if (
    typeof body.status === "string" &&
    STATUSES.includes(body.status as (typeof STATUSES)[number])
  ) {
    data.status = body.status;
    if (body.status === "emailed") {
      data.emailedAt = new Date();
    }
  }
  if (typeof body.notes === "string") {
    data.notes = body.notes.trim().slice(0, 500) || null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No updates" }, { status: 400 });
  }

  const result = await prisma.tradeLockerBotRequest.updateMany({
    where: { id: { in: ids } },
    data,
  });

  return NextResponse.json({ ok: true, updated: result.count });
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const ids = Array.isArray(body.ids) ? body.ids.map(String) : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: "ids required" }, { status: 400 });
  }

  const result = await prisma.tradeLockerBotRequest.deleteMany({
    where: { id: { in: ids } },
  });

  return NextResponse.json({ ok: true, deleted: result.count });
}
