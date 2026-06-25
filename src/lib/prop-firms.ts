export type PropFirmPresetId =
  | "generic"
  | "ftmo"
  | "mff"
  | "fundednext"
  | "custom";

export interface PropFirmPreset {
  id: PropFirmPresetId;
  name: string;
  dailyLossLimitPct: number;
  maxDrawdownPct: number;
  riskPerTradePct: number;
  maxTradesPerDay: number;
  profitTargetPct?: number;
  description: string;
}

export const PROP_FIRM_PRESETS: PropFirmPreset[] = [
  {
    id: "generic",
    name: "Generic Prop Rules",
    dailyLossLimitPct: 5,
    maxDrawdownPct: 10,
    riskPerTradePct: 1,
    maxTradesPerDay: 10,
    profitTargetPct: 10,
    description: "Balanced defaults for most evaluation accounts.",
  },
  {
    id: "ftmo",
    name: "FTMO-style",
    dailyLossLimitPct: 5,
    maxDrawdownPct: 10,
    riskPerTradePct: 0.75,
    maxTradesPerDay: 8,
    profitTargetPct: 10,
    description: "5% daily loss, 10% max loss — conservative sizing.",
  },
  {
    id: "mff",
    name: "MyFundedFutures-style",
    dailyLossLimitPct: 4,
    maxDrawdownPct: 8,
    riskPerTradePct: 0.5,
    maxTradesPerDay: 6,
    profitTargetPct: 8,
    description: "Tighter daily cap for futures-style evaluations.",
  },
  {
    id: "fundednext",
    name: "FundedNext-style",
    dailyLossLimitPct: 5,
    maxDrawdownPct: 10,
    riskPerTradePct: 1,
    maxTradesPerDay: 12,
    profitTargetPct: 10,
    description: "Standard challenge limits with moderate trade count.",
  },
  {
    id: "custom",
    name: "Custom limits",
    dailyLossLimitPct: 5,
    maxDrawdownPct: 10,
    riskPerTradePct: 1,
    maxTradesPerDay: 10,
    description: "Set your own risk parameters manually.",
  },
];

export function getPropFirmPreset(id: string | null | undefined): PropFirmPreset {
  return (
    PROP_FIRM_PRESETS.find((p) => p.id === id) ??
    PROP_FIRM_PRESETS[0]!
  );
}

export function limitsFromPreset(
  presetId: string | null | undefined,
  overrides?: Partial<
    Pick<
      PropFirmPreset,
      | "dailyLossLimitPct"
      | "maxDrawdownPct"
      | "riskPerTradePct"
      | "maxTradesPerDay"
    >
  >
) {
  const preset = getPropFirmPreset(presetId);
  return {
    dailyLossLimitPct:
      overrides?.dailyLossLimitPct ?? preset.dailyLossLimitPct,
    maxDrawdownPct: overrides?.maxDrawdownPct ?? preset.maxDrawdownPct,
    riskPerTradePct: overrides?.riskPerTradePct ?? preset.riskPerTradePct,
    maxTradesPerDay: overrides?.maxTradesPerDay ?? preset.maxTradesPerDay,
    profitTargetPct: preset.profitTargetPct,
  };
}