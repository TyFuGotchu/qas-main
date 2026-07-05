import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  onPlaybookDayCompleted,
  sendPlaybookDayEmail,
} from "@/lib/email/playbook-drip";
import { prisma } from "@/lib/prisma";
import {
  completePlaybookDay,
  ensurePlaybookProgress,
  serializePlaybookProgress,
  startPlaybookChallenge,
  touchPlaybookActivity,
} from "@/lib/playbook-progress";
import { canAccessToolsBySubscription } from "@/lib/tiers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await ensurePlaybookProgress(session.id);
    const hasPremium = canAccessToolsBySubscription(session.subscriptionTier);

    return NextResponse.json({
      hasPremium,
      progress: serializePlaybookProgress(progress),
    });
  } catch (error) {
    console.error("[playbook-progress GET]", error);
    return NextResponse.json({ error: "Failed to load progress" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      action?: "start" | "complete_day" | "touch";
      day?: number;
    };

    const hasPremium = canAccessToolsBySubscription(session.subscriptionTier);

    if (body.action === "touch") {
      const progress = await touchPlaybookActivity(session.id);
      return NextResponse.json({
        hasPremium,
        progress: serializePlaybookProgress(progress),
      });
    }

    if (!hasPremium) {
      return NextResponse.json(
        { error: "Premium required to run the 7-day playbook" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { email: true, name: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (body.action === "start") {
      const progress = await startPlaybookChallenge(session.id);
      await sendPlaybookDayEmail({
        userId: session.id,
        email: user.email,
        name: user.name,
        day: 1,
        isPremium: true,
      });

      return NextResponse.json({
        hasPremium: true,
        progress: serializePlaybookProgress(progress),
      });
    }

    if (body.action === "complete_day" && typeof body.day === "number") {
      const progress = await completePlaybookDay(session.id, body.day);
      await onPlaybookDayCompleted({
        userId: session.id,
        email: user.email,
        name: user.name,
        completedDay: body.day,
      });

      return NextResponse.json({
        hasPremium: true,
        progress: serializePlaybookProgress(progress),
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[playbook-progress PATCH]", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}