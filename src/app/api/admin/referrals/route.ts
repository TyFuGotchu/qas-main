import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/referrals";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [payouts, recentRewards, totals] = await Promise.all([
    prisma.referralPayoutRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: { select: { email: true, name: true, referralCreditCents: true } },
      },
    }),
    prisma.referralReward.findMany({
      orderBy: { createdAt: "desc" },
      take: 40,
      include: {
        referrer: { select: { email: true } },
        referredUser: { select: { email: true } },
      },
    }),
    prisma.referralPayoutRequest.groupBy({
      by: ["status"],
      _sum: { amountCents: true },
      _count: true,
    }),
  ]);

  return NextResponse.json({
    payouts: payouts.map((p) => ({
      id: p.id,
      amountCents: p.amountCents,
      amountFormatted: formatCents(p.amountCents),
      paypalEmail: p.paypalEmail,
      status: p.status,
      adminNote: p.adminNote,
      createdAt: p.createdAt,
      processedAt: p.processedAt,
      userEmail: p.user.email,
      userName: p.user.name,
      remainingCreditCents: p.user.referralCreditCents,
    })),
    rewards: recentRewards.map((r) => ({
      id: r.id,
      amountCents: r.amountCents,
      status: r.status,
      availableAt: r.availableAt,
      createdAt: r.createdAt,
      referrerEmail: r.referrer.email,
      referredEmail: r.referredUser.email,
    })),
    totals: totals.map((t) => ({
      status: t.status,
      count: t._count,
      amountCents: t._sum.amountCents ?? 0,
    })),
  });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const id = typeof body.id === "string" ? body.id : "";
  const action = body.action as "paid" | "rejected" | undefined;
  const adminNote =
    typeof body.adminNote === "string" ? body.adminNote.trim() : undefined;

  if (!id || !action || !["paid", "rejected"].includes(action)) {
    return NextResponse.json(
      { error: "id and action (paid|rejected) required" },
      { status: 400 }
    );
  }

  const existing = await prisma.referralPayoutRequest.findUnique({
    where: { id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.status !== "pending") {
    return NextResponse.json(
      { error: "Request already processed" },
      { status: 400 }
    );
  }

  if (action === "rejected") {
    // Return credit to user
    await prisma.$transaction([
      prisma.referralPayoutRequest.update({
        where: { id },
        data: {
          status: "rejected",
          adminNote: adminNote ?? "Rejected by admin",
          processedAt: new Date(),
          processedBy: session.email,
        },
      }),
      prisma.user.update({
        where: { id: existing.userId },
        data: { referralCreditCents: { increment: existing.amountCents } },
      }),
    ]);
  } else {
    await prisma.referralPayoutRequest.update({
      where: { id },
      data: {
        status: "paid",
        adminNote: adminNote ?? "Marked paid via PayPal",
        processedAt: new Date(),
        processedBy: session.email,
      },
    });
  }

  return NextResponse.json({ ok: true, action });
}
