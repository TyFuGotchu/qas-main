"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { CandlestickDiagram } from "@/components/academy/visuals/CandlestickDiagram";
import { ChartDiagram } from "@/components/academy/visuals/ChartDiagram";
import { getLessonVisual } from "@/lib/academy/visual-registry";
import {
  getWalkthroughSteps,
  getWalkthroughTitle,
  isCandleWalkthrough,
} from "@/lib/academy/walkthrough-steps";
import type { CandleHighlight } from "@/components/academy/visuals/CandlestickDiagram";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface LessonWalkthroughProps {
  categoryId: string;
  lessonId: string;
}

export function LessonWalkthrough({ categoryId, lessonId }: LessonWalkthroughProps) {
  const steps = getWalkthroughSteps(categoryId, lessonId);
  const config = getLessonVisual(categoryId, lessonId);
  const isCandle = isCandleWalkthrough(categoryId);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const step = steps[stepIndex];

  const next = useCallback(() => {
    setStepIndex((i) => (i + 1) % steps.length);
  }, [steps.length]);

  const prev = useCallback(() => {
    setStepIndex((i) => (i - 1 + steps.length) % steps.length);
  }, [steps.length]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [playing, next]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-accent">
          {getWalkthroughTitle(categoryId, lessonId)}
        </p>
        <div className="flex items-center gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStepIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === stepIndex ? "w-6 bg-cyan-accent" : "w-1.5 bg-slate-700"
              )}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {isCandle && config.kind === "candle" ? (
        <CandlestickDiagram
          pattern={config.pattern}
          highlightIndex={step.candleIndex}
          highlightPart={(step.highlight as CandleHighlight) ?? "full"}
        />
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
          variant={
            config.kind === "candle"
              ? "candle-anatomy"
              : config.variant
          }
        />
      )}

      <div className="rounded-lg border border-cyan-accent/20 bg-cyan-accent/5 p-4 transition-all">
        <p className="font-mono text-xs font-semibold text-cyan-accent">
          Step {stepIndex + 1}/{steps.length}: {step.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={prev}>
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setPlaying((p) => !p)}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Pause" : "Play"}
        </Button>
        <Button variant="secondary" size="sm" onClick={next}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}