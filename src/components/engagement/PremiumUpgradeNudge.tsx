"use client";

import Link from "next/link";
import { ArrowUpCircle } from "lucide-react";
import { useSession } from "@/providers/SessionProvider";
import { canAccessToolsBySubscription } from "@/lib/tiers";
import { PREMIUM_PROMO_CODE, PREMIUM_PROMO_FIRST_MONTH } from "@/lib/pricing-tiers";
import Button from "@/components/ui/Button";

interface PremiumUpgradeNudgeProps {
  feature: string;
  compact?: boolean;
}

export function PremiumUpgradeNudge({
  feature,
  compact = false,
}: PremiumUpgradeNudgeProps) {
  const { user } = useSession();

  if (!user || canAccessToolsBySubscription(user.subscriptionTier)) {
    return null;
  }

  if (compact) {
    return (
      <p className="font-mono text-[10px] text-slate-500">
        <Link
          href="/dashboard/upgrade"
          className="text-amber-400 hover:text-amber-300"
        >
          Upgrade
        </Link>{" "}
        to unlock full {feature} · code {PREMIUM_PROMO_CODE} —{" "}
        {PREMIUM_PROMO_FIRST_MONTH} month one
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-amber-200">
            Unlock {feature} with Premium
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-slate-500">
            Chart Academy, Prop OS, journal analytics, live terminal & all tools
            · {PREMIUM_PROMO_CODE} — {PREMIUM_PROMO_FIRST_MONTH} first month
          </p>
        </div>
        <Link href="/dashboard/upgrade">
          <Button variant="primary" size="sm">
            <ArrowUpCircle className="h-3.5 w-3.5" />
            Upgrade
          </Button>
        </Link>
      </div>
    </div>
  );
}