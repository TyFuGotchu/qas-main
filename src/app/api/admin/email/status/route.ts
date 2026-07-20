import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import {
  getDefaultFromAddress,
  getResendKeyDiagnostics,
  getSupportFromAddress,
  hasResendKey,
} from "@/lib/email/resend";
import { SUPPORT_EMAIL } from "@/lib/support";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const diagnostics = getResendKeyDiagnostics();

  let unreadCount = 0;
  let totalInbound = 0;
  let lastCampaign = null;
  try {
    [unreadCount, totalInbound, lastCampaign] = await Promise.all([
      prisma.supportInboundEmail.count({
        where: { read: false, archived: false },
      }),
      prisma.supportInboundEmail.count(),
      prisma.adminBulkEmailCampaign.findFirst({
        orderBy: { createdAt: "desc" },
      }),
    ]);
  } catch (err) {
    console.error("[admin/email/status] DB read failed (tables may need migrate):", err);
  }

  return NextResponse.json({
    configured: hasResendKey(),
    diagnostics,
    webhookSecretConfigured: Boolean(
      process.env.RESEND_WEBHOOK_SECRET?.trim()?.replace(/^["']|["']$/g, "")
    ),
    from: getDefaultFromAddress(),
    supportFrom: getSupportFromAddress(),
    supportInbox: SUPPORT_EMAIL,
    webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://quicksilveralgo.com"}/api/webhooks/resend`,
    unreadCount,
    totalInbound,
    lastCampaign,
  });
}
