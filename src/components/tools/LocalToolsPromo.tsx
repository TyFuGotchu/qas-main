import Link from "next/link";
import { Zap } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { LOCAL_TOOL_BENEFITS } from "@/lib/local-tools-catalog";
import { LOCAL_TOOLS } from "@/lib/tools-registry";
import { PropFirmChallengePromo } from "@/components/marketing/PropFirmChallengePromo";
import {
  getPremiumCheckoutUrl,
  PREMIUM_PRICE,
} from "@/lib/pricing-tiers";

interface LocalToolsPromoProps {
  variant?: "compact" | "full";
  className?: string;
}

export function LocalToolsPromo({ variant = "full", className }: LocalToolsPromoProps) {
  const premiumUrl = getPremiumCheckoutUrl();

  if (variant === "compact") {
    return (
      <GlassPanel className={`border-emerald-500/20 p-4 ${className ?? ""}`}>
        <p className="font-mono text-xs text-slate-400">
          <strong className="text-emerald-400">Premium Trading Tools</strong> — Expectancy,
          ATR Pip-Range & Compounding Matrix included with Premium ({PREMIUM_PRICE}/mo). Code{" "}
          <strong className="text-slate-200"></strong> →{" "}
          {PREMIUM_PRICE} first month.
        </p>
        <Link href="/tools" className="mt-2 inline-block font-mono text-xs text-cyan-accent hover:underline">
          Browse tools →
        </Link>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className={`border-emerald-500/25 p-6 ${className ?? ""}`} glow>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="success" className="mb-2">
            Premium Trading Tools
          </Badge>
          <h3 className="font-mono text-lg font-bold text-slate-100">
            3 Proprietary Calculators — Included with Premium
          </h3>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Validate expectancy, measure structural pip ranges, and plan prop-firm compounding.
            All three unlock with one Premium subscription — alongside 6 QS modules, Chart
            Academy, and the TradeLocker bot.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/tools">
            <Button variant="secondary" size="sm">
              View All Tools
            </Button>
          </Link>
          <a href={premiumUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm">
              <Zap className="h-3.5 w-3.5" />
              Premium — 
            </Button>
          </a>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {LOCAL_TOOLS.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.publicHref}
            className="rounded-lg border border-slate-800/60 bg-slate-950/40 px-3 py-3 transition-colors hover:border-cyan-accent/30"
          >
            <p className="font-mono text-xs font-semibold text-slate-200">{tool.shortName}</p>
            <p className="mt-1 font-mono text-[10px] text-emerald-400">
              {LOCAL_TOOL_BENEFITS[tool.slug as keyof typeof LOCAL_TOOL_BENEFITS]}
            </p>
          </Link>
        ))}
      </div>
    </GlassPanel>
  );
}

export function PremiumUpsellBanner() {
  return <PropFirmChallengePromo variant="banner" />;
}