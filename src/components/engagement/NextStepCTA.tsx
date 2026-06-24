"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { getNextPathStep } from "@/lib/academy/learning-path";
import { getLessonProgress } from "@/lib/academy/lesson-progress";
import {
  getTierCheckoutUrl,
  TIER_LABELS,
  tierMeetsRequirement,
} from "@/lib/accessControl";
import type { SubscriptionTier } from "@/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import Button from "@/components/ui/Button";

interface NextStepCTAProps {
  currentSlug: string;
  userTier?: SubscriptionTier;
}

export function NextStepCTA({ currentSlug, userTier = "FREE" }: NextStepCTAProps) {
  const [next, setNext] = useState<ReturnType<typeof getNextPathStep>>(undefined);

  useEffect(() => {
    const progress = getLessonProgress();
    const slugs = [...progress.viewed, ...progress.completed, currentSlug];
    setNext(getNextPathStep(slugs, userTier));
  }, [currentSlug, userTier]);

  if (!next) return null;

  const isLocked = !tierMeetsRequirement(userTier, next.requiredTier);

  return (
    <GlassPanel className="border-cyan-accent/20 p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-accent">
        Your learning path
      </p>
      <h3 className="mt-2 font-mono text-base font-bold text-slate-100">
        {isLocked ? "Next milestone (upgrade to unlock)" : "Up next on your path"}
      </h3>
      <p className="mt-1 text-sm text-slate-400">
        <strong className="text-slate-300">{next.title}</strong> — {next.subtitle}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {isLocked ? (
          <a href={getTierCheckoutUrl()} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm">
              <Zap className="h-3.5 w-3.5" />
              {TIER_LABELS[next.requiredTier].split(" (")[0]}
            </Button>
          </a>
        ) : (
          <Link href={next.href}>
            <Button variant="primary" size="sm">
              Continue path
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        )}
        <Link href="/lessons">
          <Button variant="ghost" size="sm">
            All lessons
          </Button>
        </Link>
      </div>
    </GlassPanel>
  );
}