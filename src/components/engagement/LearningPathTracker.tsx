"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Lock, Zap } from "lucide-react";
import {
  CURATED_LEARNING_PATH,
  getPathProgress,
  type LearningPathItem,
} from "@/lib/academy/learning-path";
import { getLessonProgress } from "@/lib/academy/lesson-progress";
import { getTierCheckoutUrl, TIER_LABELS, tierMeetsRequirement } from "@/lib/accessControl";
import type { SubscriptionTier } from "@/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface LearningPathTrackerProps {
  userTier?: SubscriptionTier;
  compact?: boolean;
}

function stepStatus(
  item: LearningPathItem,
  completed: string[],
  userTier: SubscriptionTier
): "done" | "available" | "locked" {
  if (completed.includes(item.slug)) return "done";
  if (tierMeetsRequirement(userTier, item.requiredTier)) return "available";
  return "locked";
}

export function LearningPathTracker({
  userTier = "FREE",
  compact = false,
}: LearningPathTrackerProps) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const progress = getLessonProgress();
    setCompleted([...progress.viewed, ...progress.completed]);
  }, []);

  const { completed: doneCount, total, percent } = getPathProgress(completed);
  const items = compact ? CURATED_LEARNING_PATH.slice(0, 6) : CURATED_LEARNING_PATH;

  return (
    <GlassPanel className="border-cyan-accent/20 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-accent">
            Curated learning path
          </p>
          <h3 className="mt-1 font-mono text-lg font-bold text-slate-100">
            Free → Bot-Only → Premium
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {doneCount} of {total} milestones · {percent}% complete
          </p>
        </div>
        <Badge variant="success">{percent}%</Badge>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-accent transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="mt-6 space-y-2">
        {items.map((item, index) => {
          const status = stepStatus(item, completed, userTier);
          const Icon =
            status === "done"
              ? CheckCircle2
              : status === "locked"
                ? Lock
                : Circle;

          return (
            <li key={item.id}>
              <Link
                href={status === "locked" ? "/onboarding/pricing" : item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                  status === "done"
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : status === "available"
                      ? "border-cyan-accent/20 bg-slate-900/40 hover:border-cyan-accent/40"
                      : "border-slate-800/60 bg-slate-900/20 opacity-70"
                )}
              >
                <span className="font-mono text-[10px] text-slate-600 w-4">
                  {index + 1}
                </span>
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    status === "done"
                      ? "text-emerald-400"
                      : status === "available"
                        ? "text-cyan-accent"
                        : "text-slate-600"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-xs font-semibold text-slate-200">
                    {item.title}
                  </p>
                  <p className="truncate font-mono text-[10px] text-slate-500">
                    {item.subtitle}
                  </p>
                </div>
                {status === "locked" && (
                  <Badge variant="warning" className="shrink-0 text-[9px]">
                    {TIER_LABELS[item.requiredTier].split(" (")[0]}
                  </Badge>
                )}
              </Link>
            </li>
          );
        })}
      </ol>

      {!compact && userTier === "FREE" && (
        <div className="mt-5 flex flex-wrap gap-2">
          <a href={getTierCheckoutUrl("TIER_2")} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm">
              <Zap className="h-3.5 w-3.5" />
              Unlock full path
            </Button>
          </a>
          <Link href="/register">
            <Button variant="ghost" size="sm">
              Create free account
            </Button>
          </Link>
        </div>
      )}
    </GlassPanel>
  );
}