import { prisma } from "@/lib/prisma";
import {
  defaultTraderProfilePayload,
  toTraderProfileView,
  type TraderProfileView,
} from "@/lib/trader-profile";

export async function getTraderProfileView(
  userId: string
): Promise<TraderProfileView | null> {
  const profile = await prisma.traderProfile.findUnique({
    where: { userId },
  });
  if (!profile) return null;
  return toTraderProfileView(profile);
}

export async function getOrCreateTraderProfileView(
  userId: string
): Promise<TraderProfileView> {
  const existing = await prisma.traderProfile.findUnique({
    where: { userId },
  });
  if (existing) return toTraderProfileView(existing);

  const defaults = defaultTraderProfilePayload();
  const created = await prisma.traderProfile.create({
    data: {
      userId,
      accountType: defaults.accountType,
      tradingStyle: defaults.tradingStyle,
      primaryMarkets: defaults.primaryMarkets,
      propFirmPreset: defaults.propFirmPreset,
      dailyLossLimitPct: defaults.dailyLossLimitPct,
      maxDrawdownPct: defaults.maxDrawdownPct,
      riskPerTradePct: defaults.riskPerTradePct,
      maxTradesPerDay: defaults.maxTradesPerDay,
      strictPreTradeGate: defaults.strictPreTradeGate,
      profileComplete: false,
    },
  });
  return toTraderProfileView(created);
}