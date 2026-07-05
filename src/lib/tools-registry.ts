import {
  Activity,
  Brain,
  Crosshair,
  Gauge,
  Layers,
  LineChart,
  Shield,
  Table2,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  LOCAL_TOOL_PRICES,
  LOCAL_TOOL_STRIPE,
  type LocalToolSlug,
} from "@/lib/local-tools-catalog";

export type ToolCategory = "qs-module" | "local-tool";

export interface ToolDefinition {
  slug: string;
  href: string;
  publicHref: string;
  name: string;
  shortName: string;
  desc: string;
  icon: LucideIcon;
  tag: string;
  category: ToolCategory;
  price?: string;
  stripeCheckoutUrl?: string;
}

export const QS_TOOL_COUNT = 6;
export const LOCAL_TOOL_COUNT = 3;
export const TOOL_COUNT = QS_TOOL_COUNT + LOCAL_TOOL_COUNT;

export const QS_TOOLS: ToolDefinition[] = [
  {
    slug: "edge-confluence",
    href: "/dashboard/tools/edge-confluence",
    publicHref: "/tools/edge-confluence",
    name: "QS Edge Confluence Engine™",
    shortName: "Edge Confluence",
    desc: "Score any manual setup across 7 confluence layers — structure, momentum, volatility, and session — before you trade on your platform.",
    icon: Zap,
    tag: "Setup Scoring",
    category: "qs-module",
  },
  {
    slug: "risk-matrix",
    href: "/dashboard/tools/risk-matrix",
    publicHref: "/tools/risk-matrix",
    name: "Quicksilver Risk Matrix™",
    shortName: "Risk Matrix",
    desc: "Plan portfolio heat, Kelly sizing, and correlation-adjusted risk from numbers you enter — works with any broker or prop firm.",
    icon: Shield,
    tag: "Risk Planning",
    category: "qs-module",
  },
  {
    slug: "execution-protocol",
    href: "/dashboard/tools/execution-protocol",
    publicHref: "/tools/execution-protocol",
    name: "QS Manual Trade Planner™",
    shortName: "Trade Planner",
    desc: "Build entry ladders, take-profit tiers, stop guidelines, and time rules for trades you place yourself — no orders sent anywhere.",
    icon: Crosshair,
    tag: "Trade Planning",
    category: "qs-module",
  },
  {
    slug: "alpha-durability",
    href: "/dashboard/tools/alpha-durability",
    publicHref: "/tools/alpha-durability",
    name: "QS Alpha Durability Engine™",
    shortName: "Alpha Durability",
    desc: "Analyze your journal stats for edge confidence, decay, and sample adequacy — purely from trade history you input.",
    icon: Brain,
    tag: "Journal Analytics",
    category: "qs-module",
  },
  {
    slug: "regime-oracle",
    href: "/dashboard/tools/regime-oracle",
    publicHref: "/tools/regime-oracle",
    name: "QS Regime Oracle™",
    shortName: "Regime Oracle",
    desc: "Classify market conditions and get session-aware playbooks to inform manual entries on any charting platform.",
    icon: Layers,
    tag: "Market Context",
    category: "qs-module",
  },
  {
    slug: "prop-survival",
    href: "/dashboard/tools/prop-survival",
    publicHref: "/tools/prop-survival",
    name: "QS Prop Survival Engine™",
    shortName: "Prop Survival",
    desc: "Simulate prop-firm challenge outcomes from your strategy inputs — plan risk rules before you trade manually.",
    icon: Gauge,
    tag: "Challenge Planning",
    category: "qs-module",
  },
];

export const LOCAL_TOOLS: ToolDefinition[] = [
  {
    slug: "expectancy-validator",
    href: "/dashboard/tools/expectancy-validator",
    publicHref: "/tools/expectancy-validator",
    name: "Strategy Expectancy Validator",
    shortName: "Expectancy Validator",
    desc: "Validate whether your win rate and average R:R produce positive mathematical expectancy before you size up.",
    icon: LineChart,
    tag: "Edge Math",
    category: "local-tool",
    price: LOCAL_TOOL_PRICES["expectancy-validator"],
    stripeCheckoutUrl: LOCAL_TOOL_STRIPE["expectancy-validator"],
  },
  {
    slug: "atr-pip-range",
    href: "/dashboard/tools/atr-pip-range",
    publicHref: "/tools/atr-pip-range",
    name: "Dynamic ATR Pip-Range Calculator",
    shortName: "ATR Pip-Range",
    desc: "Measure structural volatility from recent highs and lows — convert to pip ranges for any pair.",
    icon: Activity,
    tag: "Volatility",
    category: "local-tool",
    price: LOCAL_TOOL_PRICES["atr-pip-range"],
    stripeCheckoutUrl: LOCAL_TOOL_STRIPE["atr-pip-range"],
  },
  {
    slug: "compounding-matrix",
    href: "/dashboard/tools/compounding-matrix",
    publicHref: "/tools/compounding-matrix",
    name: "Prop Firm Compounding Matrix",
    shortName: "Compounding Matrix",
    desc: "10-trade lot-sizing progression with win/loss projections for prop-firm challenge planning.",
    icon: Table2,
    tag: "Prop Compounding",
    category: "local-tool",
    price: LOCAL_TOOL_PRICES["compounding-matrix"],
    stripeCheckoutUrl: LOCAL_TOOL_STRIPE["compounding-matrix"],
  },
];

/** @deprecated Use QS_TOOLS — kept for existing imports */
export const TOOLS = QS_TOOLS;

export const ALL_TOOLS: ToolDefinition[] = [...QS_TOOLS, ...LOCAL_TOOLS];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug);
}

export function getLocalToolBySlug(slug: string): ToolDefinition | undefined {
  return LOCAL_TOOLS.find((t) => t.slug === slug);
}

export function isLocalToolDefinition(tool: ToolDefinition): boolean {
  return tool.category === "local-tool";
}

export function asLocalToolSlug(slug: string): LocalToolSlug | null {
  const found = LOCAL_TOOLS.find((t) => t.slug === slug);
  return found ? (found.slug as LocalToolSlug) : null;
}