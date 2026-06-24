import type { LandingDemoType } from "@/lib/seo/landing-data";

const TOOL_DEMO_MAP: Record<string, LandingDemoType> = {
  "edge-confluence": "setup-scorer",
  "risk-matrix": "risk-calc",
  "prop-survival": "consistency-calc",
  "execution-protocol": "rr-planner",
  "regime-oracle": "setup-scorer",
  "alpha-durability": "setup-scorer",
};

export function toolSlugToDemo(toolSlug: string): LandingDemoType {
  return TOOL_DEMO_MAP[toolSlug] ?? "setup-scorer";
}