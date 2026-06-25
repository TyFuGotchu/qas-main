import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { parseJournalCsv } from "@/lib/journal/csv-parser";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") ?? "";
    let csvText = "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "CSV file required" }, { status: 400 });
      }
      csvText = await file.text();
    } else {
      const body = await request.json().catch(() => null);
      csvText =
        body && typeof body.csv === "string" ? body.csv : "";
    }

    if (!csvText.trim()) {
      return NextResponse.json({ error: "Empty CSV" }, { status: 400 });
    }

    const parsed = parseJournalCsv(csvText);
    if (parsed.rows.length === 0) {
      return NextResponse.json(
        {
          error: "No valid rows imported",
          details: parsed.errors,
          skipped: parsed.skipped,
        },
        { status: 400 }
      );
    }

    const created = await prisma.$transaction(
      parsed.rows.map((row) =>
        prisma.tradeJournalEntry.create({
          data: {
            userId: session.id,
            symbol: row.symbol,
            direction: row.direction,
            entryTime: row.entryTime,
            exitTime: row.exitTime,
            pnl: row.pnl,
            rMultiple: row.rMultiple,
            session: row.session,
            setupType: row.setupType,
            notes: row.notes,
            source: "csv",
          },
        })
      )
    );

    return NextResponse.json({
      imported: created.length,
      skipped: parsed.skipped,
      warnings: parsed.errors,
    });
  } catch (error) {
    console.error("[journal/import]", error);
    return NextResponse.json(
      { error: "Failed to import CSV" },
      { status: 500 }
    );
  }
}