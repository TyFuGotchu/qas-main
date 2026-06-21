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
    desc: "Proprietary 7-layer confluence scoring system — structure, momentum, volatility, session, and asymmetry fused into a single QS Edge Index.",
    icon: Zap,
    tag: "QS Exclusive",
  },
  {
    slug: "risk-matrix",
    href: "/dashboard/tools/risk-matrix",
    name: "Quicksilver Risk Matrix™",
    shortName: "Risk Matrix",
    desc: "Institutional portfolio heat governance with Kelly criterion, correlation penalties, and breach detection — exclusive to QS capital protocols.",
    icon: Shield,
    tag: "Risk Engine",
  },
  {
    slug: "execution-protocol",
    href: "/dashboard/tools/execution-protocol",
    name: "QS Execution Protocol™",
    shortName: "Execution Protocol",
    desc: "Full trade lifecycle planner — entry ladders, scale-out tiers, break-even triggers, trailing rules, and time stops.",
    icon: Crosshair,
    tag: "Execution",
  },
  {
    slug: "alpha-durability",
    href: "/dashboard/tools/alpha-durability",
    name: "QS Alpha Durability Engine™",
    shortName: "Alpha Durability",
    desc: "Statistical edge validation with z-score confidence, alpha half-life modeling, and decay detection — no external data required.",
    icon: Brain,
    tag: "Edge Science",
  },
  {
    slug: "regime-oracle",
    href: "/dashboard/tools/regime-oracle",
    name: "QS Regime Oracle™",
    shortName: "Regime Oracle",
    desc: "Proprietary 6-state market regime classifier with risk multipliers, playbooks, and session-aware protocol directives.",
    icon: Layers,
    tag: "Regime Intel",
  },
  {
    slug: "prop-survival",
    href: "/dashboard/tools/prop-survival",
    name: "QS Prop Survival Engine™",
    shortName: "Prop Survival",
    desc: "10,000-path Monte Carlo prop firm survival simulator with pass-rate analysis, ruin probability, and daily lot-size governance.",
    icon: Gauge,
    tag: "Prop Firm",
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}