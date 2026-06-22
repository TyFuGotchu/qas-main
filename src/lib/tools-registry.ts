import {
  Brain,
  Crosshair,
  Gauge,
  Layers,
  Shield,
  Zap,
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
    slug: "edge-confluence",
    href: "/dashboard/tools/edge-confluence",
    name: "QS Edge Confluence Engine™",
    shortName: "Edge Confluence",
    desc: "Score any manual setup across 7 confluence layers — structure, momentum, volatility, and session — before you trade on your platform.",
    icon: Zap,
    tag: "Setup Scoring",
  },
  {
    slug: "risk-matrix",
    href: "/dashboard/tools/risk-matrix",
    name: "Quicksilver Risk Matrix™",
    shortName: "Risk Matrix",
    desc: "Plan portfolio heat, Kelly sizing, and correlation-adjusted risk from numbers you enter — works with any broker or prop firm.",
    icon: Shield,
    tag: "Risk Planning",
  },
  {
    slug: "execution-protocol",
    href: "/dashboard/tools/execution-protocol",
    name: "QS Manual Trade Planner™",
    shortName: "Trade Planner",
    desc: "Build entry ladders, take-profit tiers, stop guidelines, and time rules for trades you place yourself — no orders sent anywhere.",
    icon: Crosshair,
    tag: "Trade Planning",
  },
  {
    slug: "alpha-durability",
    href: "/dashboard/tools/alpha-durability",
    name: "QS Alpha Durability Engine™",
    shortName: "Alpha Durability",
    desc: "Analyze your journal stats for edge confidence, decay, and sample adequacy — purely from trade history you input.",
    icon: Brain,
    tag: "Journal Analytics",
  },
  {
    slug: "regime-oracle",
    href: "/dashboard/tools/regime-oracle",
    name: "QS Regime Oracle™",
    shortName: "Regime Oracle",
    desc: "Classify market conditions and get session-aware playbooks to inform manual entries on any charting platform.",
    icon: Layers,
    tag: "Market Context",
  },
  {
    slug: "prop-survival",
    href: "/dashboard/tools/prop-survival",
    name: "QS Prop Survival Engine™",
    shortName: "Prop Survival",
    desc: "Simulate prop-firm challenge outcomes from your strategy inputs — plan risk rules before you trade manually.",
    icon: Gauge,
    tag: "Challenge Planning",
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}