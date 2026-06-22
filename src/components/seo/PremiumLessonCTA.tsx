import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { getRelatedTool } from "@/lib/seo/public-lessons";
import Button from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";

interface PremiumLessonCTAProps {
  lessonSlug: string;
}

export function PremiumLessonCTA({ lessonSlug }: PremiumLessonCTAProps) {
  const tool = getRelatedTool(lessonSlug);

  if (!tool) return null;

  const Icon = tool.icon;

  return (
    <GlassPanel className="relative overflow-hidden border-cyan-accent/25 bg-gradient-to-br from-slate-950 via-slate-950 to-cyan-accent/5 p-8">
      <Badge variant="success" className="mb-4">
        QS Planning Module
      </Badge>
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-accent/30 bg-cyan-accent/10">
          <Icon className="h-6 w-6 text-cyan-accent" />
        </div>
        <div className="max-w-xl flex-1">
          <h3 className="font-mono text-xl font-bold text-slate-100">
            Apply this with {tool.shortName}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            You have the theory — now score, plan, and analyze with the
            proprietary <strong className="text-slate-300">{tool.name}</strong>.
            Manual trading only — no broker connection required.
          </p>
          <p className="mt-2 font-mono text-xs text-slate-500">{tool.desc}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/dashboard/tools/${tool.slug}`}>
          <Button variant="primary" size="lg">
            <Zap className="h-4 w-4" />
            Open {tool.shortName}
          </Button>
        </Link>
        <Link href="/dashboard/tools">
          <Button variant="ghost" size="lg">
            <ArrowRight className="h-4 w-4" />
            All Planning Modules
          </Button>
        </Link>
      </div>
    </GlassPanel>
  );
}