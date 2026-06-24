"use client";

import Link from "next/link";
import { X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getTierCheckoutUrl, TIER_LABELS } from "@/lib/accessControl";
import type { SubscriptionTier } from "@/types";
import Button from "@/components/ui/Button";
import { TierValueProps } from "@/components/engagement/TierValueProps";
import { getStickyBarDelayMs } from "@/lib/engagement/ab-test";

interface StickyUpgradeBarProps {
  requiredTier: SubscriptionTier;
  resourceTitle: string;
  dismissedKey?: string;
}

export function StickyUpgradeBar({
  requiredTier,
  resourceTitle,
  dismissedKey = "qs_sticky_upgrade_dismissed",
}: StickyUpgradeBarProps) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(dismissedKey);
    if (!dismissed) {
      const delay = getStickyBarDelayMs();
      const timer = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [dismissedKey]);

  if (!visible) return null;

  const checkoutUrl = getTierCheckoutUrl();
  const tierLabel = TIER_LABELS[requiredTier].split(" (")[0];

  const dismiss = () => {
    sessionStorage.setItem(dismissedKey, "1");
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-cyan-accent/30 bg-slate-950/95 px-4 py-3 shadow-2xl backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-sm font-semibold text-slate-100">
            Unlock full access to {resourceTitle}
          </p>
          <p className="font-mono text-[10px] text-slate-500">
            {expanded
              ? "Everything you need to trade like an institution"
              : `${tierLabel} · 89 lessons · 6 tools`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="font-mono text-[10px] text-cyan-accent hover:underline"
          >
            {expanded ? "Less" : "Why upgrade?"}
          </button>
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm">
              <Zap className="h-3.5 w-3.5" />
              Upgrade
            </Button>
          </a>
          <Link href="/register">
            <Button variant="ghost" size="sm">
              Free account
            </Button>
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="rounded p-1 text-slate-500 hover:text-slate-300"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="mx-auto mt-3 max-w-4xl border-t border-slate-800/60 pt-3">
          <TierValueProps compact />
        </div>
      )}
    </div>
  );
}