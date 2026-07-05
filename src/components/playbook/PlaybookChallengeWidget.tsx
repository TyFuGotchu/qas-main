"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Check,
  ChevronRight,
  Loader2,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PropFirmTimeline } from "@/components/academy/PropFirmTimeline";
import { PROP_FIRM_MARKETING_HEADLINE } from "@/lib/prop-firm-challenge-marketing";
import { getPremiumCheckoutUrl, PREMIUM_PROMO_CODE } from "@/lib/pricing-tiers";

interface DayPlan {
  day: number;
  title: string;
  profitCapPercent: number;
  maxRiskPercent: number;
  focus: string;
  tasks: string[];
  consistencyCheck: string;
}

interface PlaybookProgressData {
  status: string;
  currentDay: number;
  completedDays: number[];
  percentComplete: number;
  dayPlan: DayPlan | null;
  dayTools: { slug: string; name: string; href: string }[];
  guideHref: string;
  totalDays: number;
}

interface PlaybookResponse {
  hasPremium: boolean;
  progress: PlaybookProgressData | null;
}

interface PlaybookChallengeWidgetProps {
  variant?: "full" | "compact";
  className?: string;
}

export function PlaybookChallengeWidget({
  variant = "full",
  className,
}: PlaybookChallengeWidgetProps) {
  const [data, setData] = useState<PlaybookResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const premiumUrl = getPremiumCheckoutUrl(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/playbook-progress");
      if (res.ok) {
        setData(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async (action: "start" | "complete_day", day?: number) => {
    setActing(true);
    try {
      const res = await fetch("/api/playbook-progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, day }),
      });
      if (res.ok) {
        setData(await res.json());
      }
    } finally {
      setActing(false);
    }
  };

  if (loading) {
    return (
      <GlassPanel className={`flex items-center justify-center p-8 ${className ?? ""}`}>
        <Loader2 className="h-6 w-6 animate-spin text-cyan-accent" />
      </GlassPanel>
    );
  }

  const hasPremium = data?.hasPremium ?? false;
  const progress = data?.progress;
  const isNotStarted = !progress || progress.status === "not_started";
  const isCompleted = progress?.status === "completed";
  const currentDay = progress?.currentDay ?? 1;
  const dayPlan = progress?.dayPlan;
  const dayComplete = progress?.completedDays.includes(currentDay) ?? false;

  if (variant === "compact") {
    return (
      <GlassPanel className={`border-cyan-accent/25 p-4 ${className ?? ""}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs font-semibold text-cyan-accent">
              7-Day Prop Firm Challenge
            </p>
            <p className="mt-1 font-mono text-[10px] text-slate-500">
              {isCompleted
                ? "Challenge complete — submit when consistency checks out"
                : isNotStarted
                  ? "Start your playbook to track daily progress"
                  : `Day ${currentDay} of ${progress?.totalDays ?? 7} · ${progress?.percentComplete ?? 0}% done`}
            </p>
          </div>
          <Link href="/dashboard/playbook">
            <Button variant="secondary" size="sm">
              Open Playbook
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className={`border-cyan-accent/30 p-6 sm:p-8 ${className ?? ""}`} glow>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="success" className="mb-2">
            Your Challenge Tracker
          </Badge>
          <h2 className="font-mono text-xl font-bold text-slate-100">
            {PROP_FIRM_MARKETING_HEADLINE}
          </h2>
          {progress && !isNotStarted ? (
            <p className="mt-2 font-mono text-sm text-slate-400">
              {progress.percentComplete}% complete · {progress.completedDays.length}/
              {progress.totalDays} days logged
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-400">
              Follow the day-by-day plan, mark each session complete, and pass your challenge in
              one week.
            </p>
          )}
        </div>
        {isCompleted ? (
          <Badge variant="success" className="gap-1">
            <Trophy className="h-3.5 w-3.5" />
            Challenge Complete
          </Badge>
        ) : null}
      </div>

      <div className="mt-6">
        <PropFirmTimeline days={7} />
      </div>

      <div className="mt-4 flex gap-1">
        {Array.from({ length: 7 }, (_, i) => {
          const day = i + 1;
          const done = progress?.completedDays.includes(day);
          const current = !isNotStarted && day === currentDay && !isCompleted;
          return (
            <div
              key={day}
              className={`h-2 flex-1 rounded-full transition-colors ${
                done
                  ? "bg-emerald-500"
                  : current
                    ? "bg-cyan-accent"
                    : "bg-slate-800"
              }`}
              title={`Day ${day}`}
            />
          );
        })}
      </div>

      {!hasPremium ? (
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
          <p className="text-sm text-amber-200/90">
            Premium unlocks the full 7-day execution plan, daily emails, and all planning tools.
          </p>
          <a href={premiumUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
            <Button variant="primary">
              <Zap className="h-4 w-4" />
              Upgrade — {PREMIUM_PROMO_CODE}
            </Button>
          </a>
          <p className="mt-3">
            <Link href={progress?.guideHref ?? "/guides/prop-firm-one-week"} className="font-mono text-xs text-cyan-accent hover:underline">
              Preview playbook free →
            </Link>
          </p>
        </div>
      ) : isNotStarted ? (
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Ready to run your prop firm challenge? Day 1 email hits your inbox when you start.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="mt-4"
            disabled={acting}
            onClick={() => runAction("start")}
          >
            {acting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
            Start 7-Day Challenge
          </Button>
        </div>
      ) : isCompleted ? (
        <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
          <p className="font-mono text-sm text-emerald-300">
            All 7 days logged. Run your final consistency audit before submitting.
          </p>
          <Link href="/dashboard/tools/prop-survival" className="mt-4 inline-block">
            <Button variant="secondary" size="sm">
              Final Prop Survival Check
            </Button>
          </Link>
        </div>
      ) : dayPlan ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-cyan-accent/20 bg-cyan-accent/5 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">Day {dayPlan.day}</Badge>
              <span className="font-mono text-sm font-bold text-slate-100">{dayPlan.title}</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{dayPlan.focus}</p>
            <p className="mt-2 font-mono text-xs text-emerald-400">
              Cap +{dayPlan.profitCapPercent}% · Risk {dayPlan.maxRiskPercent}%/trade
            </p>
            <ul className="mt-4 space-y-2">
              {dayPlan.tasks.map((task) => (
                <li key={task} className="flex items-start gap-2 text-sm text-slate-400">
                  <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-accent" />
                  {task}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/80">
              <strong>Consistency:</strong> {dayPlan.consistencyCheck}
            </p>
          </div>

          {progress?.dayTools.length ? (
            <div className="flex flex-wrap gap-2">
              {progress.dayTools.map((tool) => (
                <Link key={tool.slug} href={tool.href}>
                  <Button variant="secondary" size="sm">
                    {tool.name}
                  </Button>
                </Link>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {!dayComplete ? (
              <Button
                variant="primary"
                disabled={acting}
                onClick={() => runAction("complete_day", currentDay)}
              >
                {acting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Mark Day {currentDay} Complete
              </Button>
            ) : (
              <Badge variant="success" className="px-3 py-2">
                Day {currentDay} logged ✓
              </Badge>
            )}
            <Link href={progress?.guideHref ?? "/guides/prop-firm-one-week"}>
              <Button variant="ghost" size="sm">
                Full guide
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </GlassPanel>
  );
}