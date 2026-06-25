import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  getSession,
  jsonWithSession,
} from "@/lib/auth";
import { toUserSession } from "@/lib/session-user";
import {
  toTraderProfileView,
  validateTraderProfilePayload,
} from "@/lib/trader-profile";
import { getOrCreateTraderProfileView } from "@/lib/trader-profile-db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await getOrCreateTraderProfileView(session.id);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("[trader-profile GET]", error);
    return NextResponse.json(
      { error: "Failed to load trader profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const validated = validateTraderProfilePayload(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const { data } = validated;
    const profileComplete = data.profileComplete ?? true;

    const profile = await prisma.traderProfile.upsert({
      where: { userId: session.id },
      create: {
        userId: session.id,
        accountType: data.accountType,
        tradingStyle: data.tradingStyle,
        primaryMarkets: data.primaryMarkets,
        propFirmPreset: data.propFirmPreset,
        dailyLossLimitPct: data.dailyLossLimitPct,
        maxDrawdownPct: data.maxDrawdownPct,
        riskPerTradePct: data.riskPerTradePct,
        maxTradesPerDay: data.maxTradesPerDay,
        strictPreTradeGate: data.strictPreTradeGate,
        timezone: data.timezone,
        profileComplete,
      },
      update: {
        accountType: data.accountType,
        tradingStyle: data.tradingStyle,
        primaryMarkets: data.primaryMarkets,
        propFirmPreset: data.propFirmPreset,
        dailyLossLimitPct: data.dailyLossLimitPct,
        maxDrawdownPct: data.maxDrawdownPct,
        riskPerTradePct: data.riskPerTradePct,
        maxTradesPerDay: data.maxTradesPerDay,
        strictPreTradeGate: data.strictPreTradeGate,
        timezone: data.timezone,
        profileComplete,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { traderProfile: { select: { profileComplete: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sessionUser = toUserSession(user);
    const token = await createSessionToken(sessionUser);

    return jsonWithSession(
      { profile: toTraderProfileView(profile), user: sessionUser },
      token
    );
  } catch (error) {
    console.error("[trader-profile PUT]", error);
    return NextResponse.json(
      { error: "Failed to save trader profile" },
      { status: 500 }
    );
  }
}