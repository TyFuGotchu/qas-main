export type E8ProductId = "one" | "pro" | "signature";
export type E8Market = "forex" | "crypto";

export const E8_DEFAULT_PRODUCT: E8ProductId = "one";
export const E8_DEFAULT_MARKET: E8Market = "forex";
export const E8_DEFAULT_SIZE = "100K";

export const E8_MARKETS: { id: E8Market; label: string }[] = [
  { id: "forex", label: "Forex" },
  { id: "crypto", label: "Crypto" },
];

export const E8_SIZE_OPTIONS = {
  one: ["5K", "10K", "25K", "50K", "100K", "200K", "400K", "500K"],
  pro: ["5K", "10K", "25K", "50K", "100K", "200K", "400K", "500K"],
  signature: ["25K", "50K", "100K", "150K"],
} as const;

export const E8_CHOOSER: {
  id: E8ProductId;
  label: string;
}[] = [
  { id: "one", label: "I want custom DD / split" },
  { id: "pro", label: "I want daily payouts and a static floor" },
  { id: "signature", label: "I want the cheapest simpler entry" },
];

export interface E8ProductSpec {
  id: E8ProductId;
  name: string;
  drawdownType: string;
  maxDdRange: string;
  dailyDd: string;
  profitTarget: string;
  dailyProfitCap: string;
  pass: string;
  consistency: string;
  firstPayout: string;
  payoutSplit: string;
  activationFee: string;
  presetCode: string;
  preset: string;
  killRule: string;
  bestFor: string;
}

export const E8_PRODUCTS: E8ProductSpec[] = [
  {
    id: "one",
    name: "E8 One",
    drawdownType: "Dynamic drawdown",
    maxDdRange: "4%–14%",
    dailyDd: "Daily DD scales with selected max DD",
    profitTarget: "Target scales with selected max DD",
    dailyProfitCap: "No daily profit cap listed",
    pass: "As little as 1 day",
    consistency: "40%",
    firstPayout: "As little as 3 days",
    payoutSplit: "Configurable",
    activationFee: "None",
    presetCode: "ONE-DYN",
    preset: "Daily Guard + Trailing Guard",
    killRule:
      "Dynamic floor can rise after closed profit. Daily room is the first breach most traders hit.",
    bestFor: "Custom DD / split",
  },
  {
    id: "pro",
    name: "E8 Pro",
    drawdownType: "Static drawdown",
    maxDdRange: "6%–10%",
    dailyDd: "Daily DD scales",
    profitTarget: "Target scales with selected max",
    dailyProfitCap: "Applies",
    pass: "As little as 1 day",
    consistency: "None shown",
    firstPayout: "As little as 0 days",
    payoutSplit: "Configurable",
    activationFee: "None",
    presetCode: "PRO-STATIC",
    preset: "Conservative Evaluation",
    killRule: "Static floor plus daily cap. Do not treat a green day as unlimited room.",
    bestFor: "Daily payouts and a static floor",
  },
  {
    id: "signature",
    name: "E8 Signature",
    drawdownType: "End of Day drawdown",
    maxDdRange: "25K/50K 4% · 100K/150K 3%",
    dailyDd: "Performance daily pause / daily DD applies",
    profitTarget: "Scales with account size",
    dailyProfitCap: "Performance daily pause / daily DD applies",
    pass: "As little as 1 day",
    consistency: "35%",
    firstPayout: "As little as 1 day",
    payoutSplit: "80% on current configurator",
    activationFee: "None",
    presetCode: "SIG-EOD",
    preset: "Funded Survival / EOD Guard",
    killRule:
      "Intraday heat can look fine and still fail the EOD print. Best-day 35% can block payout.",
    bestFor: "Cheapest simpler entry",
  },
];

export function getE8Product(id: E8ProductId): E8ProductSpec {
  return E8_PRODUCTS.find((p) => p.id === id) ?? E8_PRODUCTS[0];
}

export function signatureMaxDd(size: string): string {
  if (size === "25K" || size === "50K") return "4%";
  return "3%";
}

export const E8_RULES_CONFIRM =
  "Official rules are set by E8 Markets. Confirm on E8 before buying.";

export const E8_MARKET_NOTE =
  "Forex and Crypto share the same rule set on the current E8 configurator.";
