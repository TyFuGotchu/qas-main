import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { hasResendKey } from "@/lib/email/resend";
import { syncInboundFromResend } from "@/lib/email/inbound";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * List support inbox. Pass ?sync=1 to pull latest from Resend Receiving first.
 */
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const shouldSync =
    request.nextUrl.searchParams.get("sync") === "1" ||
    request.nextUrl.searchParams.get("sync") === "true";

  let syncResult: Awaited<ReturnType<typeof syncInboundFromResend>> | null =
    null;
  let syncError: string | null = null;

  if (shouldSync && hasResendKey()) {
    try {
      syncResult = await syncInboundFromResend(50);
    } catch (err) {
      syncError = err instanceof Error ? err.message : "Sync failed";
      console.error("[admin/email/inbox] auto-sync failed:", err);
    }
  }

  try {
    const emails = await prisma.supportInboundEmail.findMany({
      where: { archived: false },
      orderBy: { receivedAt: "desc" },
      take: 100,
    });

    const unreadCount = await prisma.supportInboundEmail.count({
      where: { read: false, archived: false },
    });

    return NextResponse.json({
      emails,
      unreadCount,
      sync: syncResult,
      syncError,
    });
  } catch (err) {
    console.error("[admin/email/inbox] DB error:", err);
    return NextResponse.json(
      {
        error:
          "Support inbox database table missing or broken. Redeploy so `prisma db push` creates SupportInboundEmail.",
        detail: err instanceof Error ? err.message : "unknown",
        sync: syncResult,
        syncError,
      },
      { status: 503 }
    );
  }
}
