"use client";

import { useState } from "react";
import { BarChart3, Layers, PlayCircle } from "lucide-react";
import { LessonWalkthrough } from "@/components/academy/LessonWalkthrough";
import { LessonLiveChart } from "@/components/academy/LessonLiveChart";
import { CandlestickDiagram } from "@/components/academy/visuals/CandlestickDiagram";
import { ChartDiagram } from "@/components/academy/visuals/ChartDiagram";
import { getLessonVisual } from "@/lib/academy/visual-registry";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";

type Tab = "walkthrough" | "chart" | "diagram";

interface LessonInteractivePanelProps {
  categoryId: string;
  lessonId: string;
  title?: string;
}

export function LessonInteractivePanel({
  categoryId,
  lessonId,
  title,
}: LessonInteractivePanelProps) {
  const [tab, setTab] = useState<Tab>("walkthrough");
  const config = getLessonVisual(categoryId, lessonId);

  const tabs: { id: Tab; label: string; icon: typeof PlayCircle }[] = [
    { id: "walkthrough", label: "Walkthrough", icon: PlayCircle },
    { id: "chart", label: "Live Chart", icon: BarChart3 },
    { id: "diagram", label: "Diagram", icon: Layers },
  ];

  return (
    <GlassPanel className="border-cyan-accent/20 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-accent">
          Interactive lesson{title ? ` · ${title}` : ""}
        </p>
        <div className="flex gap-1 rounded-lg border border-slate-800/60 bg-slate-900/50 p-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[10px] uppercase transition-all",
                  tab === t.id
                    ? "bg-cyan-accent/15 text-cyan-accent"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                <Icon className="h-3 w-3" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "walkthrough" && (
        <LessonWalkthrough categoryId={categoryId} lessonId={lessonId} />
      )}
      {tab === "chart" && (
        <LessonLiveChart categoryId={categoryId} lessonId={lessonId} />
      )}
      {tab === "diagram" && (
        <div>
          {config.kind === "candle" ? (
            <CandlestickDiagram pattern={config.pattern} />
          ) : (
            <ChartDiagram
              kind={
                config.kind === "structure"
                  ? "structure"
                  : config.kind === "fib"
                    ? "fib"
                    : config.kind === "style"
                      ? "style"
                      : "chart"
              }
              variant={config.variant}
            />
          )}
        </div>
      )}
    </GlassPanel>
  );
}

export function LessonInteractivePanelBySlug({
  slug,
  title,
}: {
  slug: string;
  title?: string;
}) {
  const prefix = [
    "chart-reading",
    "market-structure",
    "trading-styles",
    "candlesticks",
    "fibonacci",
  ].find((c) => slug.startsWith(`${c}-`));

  if (!prefix) return null;
  return (
    <LessonInteractivePanel
      categoryId={prefix}
      lessonId={slug.slice(prefix.length + 1)}
      title={title}
    />
  );
}