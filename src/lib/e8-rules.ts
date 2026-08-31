export type E8ProductId = "one" | "pro" | "signature";
export type E8Market = "forex" | "crypto";

export const E8_MARKETS: { id: E8Market; label: string }[] = [
  { id: "forex", label: "Forex" },
  { id: "crypto", label: "Crypto" },
];

export const E8_SIZE_OPTIONS = {
  one: ["25K", "50K", "100K", "150K", "250K", "500K"],
  pro: ["25K", "50K", "100K", "150K", "250K", "500K"],
  signature: ["25K", "50K", "100K", "150K"],
} as const;

export const E8_MAX_DD_OPTIONS = {
  one: ["4%", "6%", "8%", "10%", "14%"],
  pro: ["6%", "8%", "10%"],
} as const;

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
  preset: string;
  extra?: string;
}

export const E8_PRODUCTS: E8ProductSpec[] = [
  {
    id: "one",
    name: "E8 One",
    drawdownType: "Dynamic drawdown",
    maxDdRange: "4%–14%",
    dailyDd: "Daily DD scales with selected max DD",
    profitTarget: "Profit target scales with selected max DD",
    dailyProfitCap: "Not listed as a hard daily profit cap",
    pass: "Pass: as little as 1 day",
    consistency: "Performance consistency: 40%",
    firstPayout: "First payout: as little as 3 days",
    payoutSplit: "Payout split configurable",
    activationFee: "No activation fee",
    preset: "E8 Daily Guard + E8 Trailing Guard",
  },
  {
    id: "pro",
    name: "E8 Pro",
    drawdownType: "Static drawdown",
    maxDdRange: "6%–10%",
    dailyDd: "Daily DD scales with size / selected max",
    profitTarget: "Profit target scales with selected max",
    dailyProfitCap: "Daily profit cap: yes",
    pass: "Pass: as little as 1 day",
    consistency: "Consistency: none shown",
    firstPayout: "First payout: as little as 0 days",
    payoutSplit: "Payout split configurable",
    activationFee: "No activation fee",
    preset: "Conservative Evaluation",
  },
  {
    id: "signature",
    name: "E8 Signature",
    drawdownType: "End of Day drawdown",
    maxDdRange: "$25K / $50K: 4% · $100K / $150K: 3%",
    dailyDd: "Performance daily DD / pause applies",
    profitTarget: "Target scales with account size",
    dailyProfitCap: "Performance daily DD / pause applies",
    pass: "Pass: as little as 1 day",
    consistency: "Consistency: 35%",
    firstPayout: "First payout: as little as 1 day",
    payoutSplit: "Payout split 80% on current configurator",
    activationFee: "No activation fee",
    preset: "Funded Survival / EOD Guard",
    extra: "Performance daily DD / pause applies",
  },
];

export function getE8Product(id: E8ProductId): E8ProductSpec {
  return E8_PRODUCTS.find((p) => p.id === id) ?? E8_PRODUCTS[0];
}

export function signatureMaxDd(size: string): string {
  if (size === "25K" || size === "50K") return "4%";
  return "3%";
}

export function getWorkedExample(
  product: E8ProductId,
  size: string,
  maxDd: string
): string | null {
  if (product === "one" && size === "500K" && maxDd === "6%") {
    return "Reference only: One $500K at 6% max — target $45,000 / max DD $30,000 / daily DD $20,000 / dynamic / 40% / first payout 3 days.";
  }
  if (product === "pro" && size === "500K" && maxDd === "6%") {
    return "Reference only: Pro $500K at 6% max — target $30,000 / max DD $30,000 / daily DD $12,500 / daily profit cap $10,000 / static / first payout 0 days.";
  }
  if (product === "signature" && size === "150K") {
    return "Reference only: Signature $150K — target $9,000 / max DD $4,500 (3%) / daily DD $3,000 performance / EOD / 35% / first payout 1 day.";
  }
  return null;
}

export const E8_RULES_CONFIRM =
  "Official rules are set by E8 Markets. Confirm on E8 before buying.";

export const E8_MARKET_NOTE =
  "Forex and Crypto share the same rule set on the current E8 configurator.";
