import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  computeJournalStats,
  computeSessionStats,
  journalStatsToAlphaInput,
} from "@/lib/journal/stats";
import {
  normalizeSessionInput,
  resolveTradingSession,
} from "@/lib/journal/trading-session";
import { computeAlphaDurability } from "@/lib/quicksilver/alpha-durability";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await prisma.tradeJournalEntry.findMany({
      where: { userId: session.id },
      orderBy: { entryTime: "desc" },
      take: 500,
    });

    const stats = computeJournalStats(entries);
    const sessionStats = computeSessionStats(entries);
    const alpha =
      stats.closedTrades > 0
        ? computeAlphaDurability(journalStatsToAlphaInput(stats))
        : null;

    return NextResponse.json({ entries, stats, sessionStats, alpha });
  } catch (error) {
    console.error("[journal GET]", error);
    return NextResponse.json(
      { error: "Failed to load journal" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const raw = body as Record<string, unknown>;
    const symbol = typeof raw.symbol === "string" ? raw.symbol.trim() : "";
    const direction =
      raw.direction === "long" || raw.direction === "short"
        ? raw.direction
        : null;
    const entryTime = raw.entryTime ? new Date(String(raw.entryTime)) : null;

    if (!symbol || !direction || !entryTime || Number.isNaN(entryTime.getTime())) {
      return NextResponse.json(
        { error: "symbol, direction, and entryTime are required" },
        { status: 400 }
      );
    }

    const exitTime = raw.exitTime
      ? new Date(String(raw.exitTime))
      : null;
    if (exitTime && Number.isNaN(exitTime.getTime())) {
      return NextResponse.json({ error: "Invalid exitTime" }, { status: 400 });
    }

    const sessionTag =
      normalizeSessionInput(
        typeof raw.session === "string" ? raw.session : null
      ) ?? resolveTradingSession(entryTime);

    const entry = await prisma.tradeJournalEntry.create({
      data: {
        userId: session.id,
        symbol,
        direction,
        entryTime,
        exitTime,
        pnl: raw.pnl != null ? Number(raw.pnl) : null,
        rMultiple: raw.rMultiple != null ? Number(raw.rMultiple) : null,
        session: sessionTag,
        setupType: typeof raw.setupType === "string" ? raw.setupType : null,
        notes: typeof raw.notes === "string" ? raw.notes : null,
        source: "manual",
      },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    console.error("[journal POST]", error);
    return NextResponse.json(
      { error: "Failed to create journal entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const existing = await prisma.tradeJournalEntry.findFirst({
      where: { id, userId: session.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    await prisma.tradeJournalEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[journal DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}