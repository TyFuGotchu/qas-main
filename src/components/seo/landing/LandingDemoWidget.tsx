import type { LandingDemoType } from "@/lib/seo/landing-pages";
import { MiniSetupScorerDemo } from "@/components/seo/landing/MiniSetupScorerDemo";
import { MiniRiskCalculatorDemo } from "@/components/seo/landing/MiniRiskCalculatorDemo";
import { MiniConsistencyDemo } from "@/components/seo/landing/MiniConsistencyDemo";
import { MiniRRPlannerDemo } from "@/components/seo/landing/MiniRRPlannerDemo";

interface LandingDemoWidgetProps {
  demo: LandingDemoType;
  marketName?: string;
}

export function LandingDemoWidget({ demo, marketName }: LandingDemoWidgetProps) {
  switch (demo) {
    case "risk-calc":
      return <MiniRiskCalculatorDemo />;
    case "consistency-calc":
      return <MiniConsistencyDemo />;
    case "rr-planner":
      return <MiniRRPlannerDemo />;
    case "setup-scorer":
    default:
      return <MiniSetupScorerDemo marketName={marketName} />;
  }
}