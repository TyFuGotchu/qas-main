"use client";

import { useEffect, useState } from "react";
import { BarChart3, Layers, PlayCircle } from "lucide-react";
import { LessonWalkthrough } from "@/components/academy/LessonWalkthrough";
import { LessonLiveChart } from "@/components/academy/LessonLiveChart";
import { CandlestickDiagram } from "@/components/academy/visuals/CandlestickDiagram";
import { ChartDiagram } from "@/components/academy/visuals/ChartDiagram";
import { getLessonVisual } from "@/lib/academy/visual-registry";
import { hasEmailCapture } from "@/lib/academy/lesson-progress";
import { EmailCaptureGate } from "@/components/engagement/EmailCaptureGate";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";

type Tab = "walkthrough" | "chart" | "diagram";

interface LessonInteractivePanelProps {
  categoryId: string;
  lessonId: string;
  title?: string;
  lessonSlug: string;
  isLoggedIn?: boolean;
}

export function LessonInteractivePanel({
  categoryId,
  lessonId,
  title,
  lessonSlug,
  isLoggedIn = false,
}: LessonInteractivePanelProps) {
  const [tab, setTab] = useState<Tab>("walkthrough");
  const [unlocked, setUnlocked] = useState(isLoggedIn);

  useEffect(() => {
    if (isLoggedIn || hasEmailCapture()) {
      setUnlocked(true);
    }
  }, [isLoggedIn]);

  const config = getLessonVisual(categoryId, lessonId);
  const gatedTab = tab === "walkthrough" || tab === "chart";

  const tabs: { id: Tab; label: string; icon: typeof PlayCircle; gated?: boolean }[] = [
    { id: "walkthrough", label: "Walkthrough", icon: PlayCircle, gated: true },
    { id: "chart", label: "Live Chart", icon: BarChart3, gated: true },
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
                {t.gated && !unlocked && (
                  <span className="text-amber-400">*</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {gatedTab && !unlocked ? (
        <EmailCaptureGate
          lessonSlug={lessonSlug}
          onUnlocked={() => setUnlocked(true)}
        />
      ) : (
        <>
          {tab === "walkthrough" && (
            <LessonWalkthrough categoryId={categoryId} lessonId={lessonId} />
          )}
          {tab === "chart" && (
            <LessonLiveChart categoryId={categoryId} lessonId={lessonId} />
          )}
        </>
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

      {!unlocked && (
        <p className="mt-3 text-center font-mono text-[10px] text-slate-600">
          * Walkthrough & live chart require free email signup to save progress
        </p>
      )}
    </GlassPanel>
  );
}

export function LessonInteractivePanelBySlug({
  slug,
  title,
  isLoggedIn,
}: {
  slug: string;
  title?: string;
  isLoggedIn?: boolean;
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
      lessonSlug={slug}
      isLoggedIn={isLoggedIn}
    />
  );
}