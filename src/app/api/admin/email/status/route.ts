import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import {
  getDefaultFromAddress,
  getSupportFromAddress,
  hasResendKey,
} from "@/lib/email/resend";
import { SUPPORT_EMAIL } from "@/lib/support";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [unreadCount, totalInbound, lastCampaign] = await Promise.all([
    prisma.supportInboundEmail.count({ where: { read: false, archived: false } }),
    prisma.supportInboundEmail.count(),
    prisma.adminBulkEmailCampaign.findFirst({ orderBy: { createdAt: "desc" } }),
  ]);

  return NextResponse.json({
    configured: hasResendKey(),
    webhookSecretConfigured: Boolean(process.env.RESEND_WEBHOOK_SECRET?.trim()),
    from: getDefaultFromAddress(),
    supportFrom: getSupportFromAddress(),
    supportInbox: SUPPORT_EMAIL,
    webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://quicksilveralgo.com"}/api/webhooks/resend`,
    unreadCount,
    totalInbound,
    lastCampaign,
  });
}
