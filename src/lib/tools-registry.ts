import {
  Activity,
  BarChart3,
  Clock,
  Crosshair,
  Layers,
  Newspaper,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ToolDefinition {
  slug: string;
  href: string;
  name: string;
  shortName: string;
  desc: string;
  icon: LucideIcon;
  tag: string;
}

export const TOOL_COUNT = 6;

export const TOOLS: ToolDefinition[] = [
  {
    slug: "event-horizon",
    href: "/dashboard/tools/event-horizon",
    name: "Event Horizon News Sentiment Matrix",
    shortName: "Event Horizon",
    desc: "Global macro calendar with AI-derived Volatility Impact Scores and spike vs. flush probability.",
    icon: Newspaper,
    tag: "Macro Intel",
  },
  {
    slug: "decoupling-heatmap",
    href: "/dashboard/tools/decoupling-heatmap",
    name: "Cross-Asset Decoupling Heatmap",
    shortName: "Decoupling Heatmap",
    desc: "Real-time correlation matrix for XAUUSD, XAGUSD, and NAS100 with divergence alerts.",
    icon: Activity,
    tag: "Arbitrage",
  },
  {
    slug: "monte-carlo",
    href: "/dashboard/tools/monte-carlo",
    name: "Monte Carlo Prop Firm Simulator",
    shortName: "Monte Carlo",
    desc: "Probability of Ruin engine with prop-firm drawdown rules and daily lot-size checklist.",
    icon: BarChart3,
    tag: "Risk Engine",
  },
  {
    slug: "liquidity-void",
    href: "/dashboard/tools/liquidity-void",
    name: "Institutional Liquidity Void Map",
    shortName: "Liquidity Void",
    desc: "Order-book derived liquidity void zones rendered on institutional-grade price charts.",
    icon: Layers,
    tag: "Order Flow",
  },
  {
    slug: "session-radar",
    href: "/dashboard/tools/session-radar",
    name: "Session-Overlap Volatility Radar",
    shortName: "Session Radar",
    desc: "London, NY, and Asia session clock with ATR expansion pulses and overlap alerts.",
    icon: Clock,
    tag: "Sessions",
  },
  {
    slug: "trap-detector",
    href: "/dashboard/tools/trap-detector",
    name: "Algorithmic Candlestick Trap Detector",
    shortName: "Trap Detector",
    desc: "Live trap-zone feed flagging retail offside positions on XAUUSD and NAS100.",
    icon: Crosshair,
    tag: "Price Action",
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}