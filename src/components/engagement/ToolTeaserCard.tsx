"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Lock, Zap } from "lucide-react";
import { getRelatedTool } from "@/lib/seo/public-lessons";
import { MiniSetupScorerDemo } from "@/components/seo/landing/MiniSetupScorerDemo";
import { MiniRiskCalculatorDemo } from "@/components/seo/landing/MiniRiskCalculatorDemo";
import { MiniConsistencyDemo } from "@/components/seo/landing/MiniConsistencyDemo";
import { MiniRRPlannerDemo } from "@/components/seo/landing/MiniRRPlannerDemo";
import Button from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";

const TOOL_DEMOS: Record<string, ReactNode> = {
  "edge-confluence": <MiniSetupScorerDemo />,
  "risk-matrix": <MiniRiskCalculatorDemo />,
  "prop-survival": <MiniConsistencyDemo />,
  "execution-protocol": <MiniRRPlannerDemo />,
  "regime-oracle": <MiniSetupScorerDemo marketName="Session regime" />,
  "alpha-durability": <MiniSetupScorerDemo marketName="Edge durability" />,
};

interface ToolTeaserCardProps {
  lessonSlug: string;
}

export function ToolTeaserCard({ lessonSlug }: ToolTeaserCardProps) {
  const tool = getRelatedTool(lessonSlug);
  if (!tool) return null;

  const Icon = tool.icon;
  const demo = TOOL_DEMOS[tool.slug] ?? <MiniSetupScorerDemo />;

  return (
    <GlassPanel className="relative overflow-hidden border-cyan-accent/25 p-0">
      <div className="border-b border-slate-800/60 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-accent/30 bg-cyan-accent/10">
            <Icon className="h-5 w-5 text-cyan-accent" />
          </div>
          <div>
            <Badge variant="warning" className="mb-1">
              Try before you upgrade
            </Badge>
            <h3 className="font-mono text-sm font-bold text-slate-100">
              Preview {tool.shortName}
            </h3>
            <p className="font-mono text-[10px] text-slate-500">{tool.desc}</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none select-none blur-[2px] opacity-80">
          {demo}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/60 p-6">
          <Lock className="h-8 w-8 text-cyan-accent/60" />
          <p className="max-w-xs text-center text-sm text-slate-300">
            Unlock the full <strong className="text-cyan-accent">{tool.shortName}</strong> with
            interactive charts, exports, and challenge simulations.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href={`/dashboard/tools/${tool.slug}`}>
              <Button variant="primary" size="sm">
                <Zap className="h-3.5 w-3.5" />
                Open Tool
              </Button>
            </Link>
            <Link href="/onboarding/pricing">
              <Button variant="ghost" size="sm">
                Compare tiers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}