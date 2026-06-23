import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { getToolBySlug } from "@/lib/tools-registry";
import Button from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";

interface SeoLandingCTAProps {
  toolSlug: string;
  pageTitle: string;
}

export function SeoLandingCTA({ toolSlug, pageTitle }: SeoLandingCTAProps) {
  const tool = getToolBySlug(toolSlug);
  if (!tool) return null;

  const Icon = tool.icon;

  return (
    <GlassPanel className="border-cyan-accent/30 bg-gradient-to-br from-slate-950 to-cyan-accent/5 p-6 sm:p-8">
      <Badge variant="success" className="mb-4">
        Upgrade from demo → full module
      </Badge>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-accent/30 bg-cyan-accent/10">
          <Icon className="h-6 w-6 text-cyan-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-mono text-xl font-bold text-slate-100 sm:text-2xl">
            Unlock the full {tool.shortName} module
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            You tried the free demo on <strong className="text-slate-300">{pageTitle}</strong>.
            Premium members get the complete {tool.name} — {tool.desc}
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/register">
          <Button variant="primary" size="lg">
            <Zap className="h-4 w-4" />
            Create Free Account
          </Button>
        </Link>
        <Link href={`/dashboard/tools/${tool.slug}`}>
          <Button variant="secondary" size="lg">
            Open {tool.shortName}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/onboarding/pricing">
          <Button variant="ghost" size="lg">
            Compare tiers
          </Button>
        </Link>
      </div>
    </GlassPanel>
  );
}