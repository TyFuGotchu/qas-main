import Link from "next/link";
import { Lock, Zap } from "lucide-react";
import {
  getTierCheckoutUrl,
  TIER_LABELS,
  type ResourceType,
} from "@/lib/accessControl";
import type { SubscriptionTier } from "@/types";
import Button from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { getRelatedTool } from "@/lib/seo/public-lessons";
import { getToolBySlug } from "@/lib/tools-registry";
import { TierValueProps } from "@/components/engagement/TierValueProps";

interface FreemiumTierCTAProps {
  resourceType: ResourceType;
  resourceId: string;
  requiredTier: SubscriptionTier;
  resourceTitle?: string;
}

export function FreemiumTierCTA({
  resourceType,
  resourceId,
  requiredTier,
  resourceTitle,
}: FreemiumTierCTAProps) {
  const checkoutUrl = getTierCheckoutUrl();
  const tierLabel = TIER_LABELS[requiredTier];

  const relatedTool =
    resourceType === "tool"
      ? getToolBySlug(resourceId)
      : getRelatedTool(resourceId);

  const Icon = relatedTool?.icon ?? Lock;

  return (
    <GlassPanel className="relative overflow-hidden border-cyan-accent/25 bg-gradient-to-br from-slate-950 via-slate-950 to-cyan-accent/5 p-8">
      <div className="absolute right-4 top-4 opacity-15">
        <Lock className="h-20 w-20 text-cyan-accent" />
      </div>

      <Badge variant="warning" className="mb-4">
        {tierLabel} Required
      </Badge>

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-accent/30 bg-cyan-accent/10">
          <Icon className="h-6 w-6 text-cyan-accent" />
        </div>
        <div className="max-w-xl flex-1">
          <h3 className="font-mono text-xl font-bold text-slate-100">
            Unlock the full{" "}
            {resourceTitle ??
              (resourceType === "tool"
                ? relatedTool?.shortName
                : resourceType === "guide"
                  ? "guide"
                  : "lesson")}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            You are viewing a free preview. Upgrade to{" "}
            <strong className="text-slate-300">{tierLabel}</strong> to read the
            complete {resourceType}, access all sections, and use the
            interactive{" "}
            {relatedTool ? (
              <strong className="text-slate-300">{relatedTool.shortName}</strong>
            ) : (
              "planning module"
            )}{" "}
            behind this content.
          </p>
          {relatedTool && (
            <p className="mt-2 font-mono text-xs text-slate-500">
              {relatedTool.desc}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-slate-800/60 pt-6">
        <TierValueProps />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="lg">
            <Zap className="h-4 w-4" />
            Upgrade to {tierLabel.split(" (")[0]}
          </Button>
        </a>
        <Link href="/register">
          <Button variant="ghost" size="lg">
            Create Free Account
          </Button>
        </Link>
        <Link href="/onboarding/pricing">
          <Button variant="secondary" size="lg">
            View Premium Plan
          </Button>
        </Link>
      </div>
    </GlassPanel>
  );
}