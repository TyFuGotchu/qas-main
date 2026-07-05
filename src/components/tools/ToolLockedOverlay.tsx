import { Lock, ShoppingCart, Zap } from "lucide-react";
import { TIER_LABELS } from "@/lib/accessControl";
import { getPremiumCheckoutUrl, PREMIUM_PROMO_CODE } from "@/lib/pricing-tiers";
import type { ToolDefinition } from "@/lib/tools-registry";
import { isLocalToolDefinition } from "@/lib/tools-registry";
import type { SubscriptionTier } from "@/types";
import Button from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";

interface ToolLockedOverlayProps {
  tool: ToolDefinition;
  requiredTier: SubscriptionTier;
  userTier: SubscriptionTier;
}

export function ToolLockedOverlay({
  tool,
  requiredTier,
  userTier,
}: ToolLockedOverlayProps) {
  const Icon = tool.icon;
  const premiumUrl = getPremiumCheckoutUrl(true);
  const isLocal = isLocalToolDefinition(tool);

  return (
    <div className="relative min-h-[420px]">
      <div className="pointer-events-none select-none space-y-6 opacity-20 blur-[2px]">
        <div className="h-48 rounded-xl border border-slate-800/60 bg-slate-900/40" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-32 rounded-lg border border-slate-800/40 bg-slate-900/30" />
          <div className="h-32 rounded-lg border border-slate-800/40 bg-slate-900/30" />
        </div>
        <div className="h-24 rounded-lg border border-slate-800/40 bg-slate-900/30" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <GlassPanel className="max-w-lg border-cyan-accent/30 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-accent/30 bg-cyan-accent/10">
            <Icon className="h-7 w-7 text-cyan-accent" />
          </div>
          <Badge variant="warning" className="mx-auto mt-4">
            {TIER_LABELS[requiredTier]} Required
          </Badge>
          <h3 className="mt-4 font-mono text-xl font-bold text-slate-100">
            {tool.name} is locked
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {isLocal ? (
              <>
                <strong className="text-slate-300">{tool.shortName}</strong> is included
                free with Premium. Your tier:{" "}
                <strong className="text-slate-300">{TIER_LABELS[userTier]}</strong>.
                Buy this tool standalone or upgrade for all tools + masterclass.
              </>
            ) : (
              <>
                Interactive QS Planning Modules cannot be previewed. Your current
                tier is{" "}
                <strong className="text-slate-300">{TIER_LABELS[userTier]}</strong>.
                Upgrade to unlock {tool.shortName} and run {tool.tag.toLowerCase()}{" "}
                on your own data.
              </>
            )}
          </p>
          <p className="mt-2 font-mono text-xs text-slate-500">{tool.desc}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {isLocal && tool.stripeCheckoutUrl && tool.price ? (
              <a href={tool.stripeCheckoutUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="lg">
                  <ShoppingCart className="h-4 w-4" />
                  Get Instant Access — {tool.price}
                </Button>
              </a>
            ) : null}
            <a href={premiumUrl} target="_blank" rel="noopener noreferrer">
              <Button variant={isLocal ? "secondary" : "primary"} size="lg">
                <Zap className="h-4 w-4" />
                Premium — includes free ({PREMIUM_PROMO_CODE})
              </Button>
            </a>
          </div>
          <p className="mt-4 flex items-center justify-center gap-1 font-mono text-[10px] text-slate-600">
            <Lock className="h-3 w-3" />
            No broker connection — manual planning only
          </p>
        </GlassPanel>
      </div>
    </div>
  );
}