import Link from "next/link";
import { Zap } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { LOCAL_TOOLS } from "@/lib/tools-registry";
import {
  getPremiumCheckoutUrl,
  PREMIUM_PRICE,
  PREMIUM_PROMO_CODE,
} from "@/lib/pricing-tiers";

interface LocalToolsPromoProps {
  variant?: "compact" | "full";
  className?: string;
}

export function LocalToolsPromo({ variant = "full", className }: LocalToolsPromoProps) {
  const premiumUrl = getPremiumCheckoutUrl(true);

  if (variant === "compact") {
    return (
      <GlassPanel className={`border-emerald-500/20 p-4 ${className ?? ""}`}>
        <p className="font-mono text-xs text-slate-400">
          <strong className="text-emerald-400">Local Trading Tools</strong> — Expectancy, ATR
          Pip-Range & Compounding Matrix.{" "}
          <strong className="text-slate-200">Free with Premium</strong> ({PREMIUM_PRICE}/mo, code{" "}
          {PREMIUM_PROMO_CODE}).
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
            Local Trading Tools
          </Badge>
          <h3 className="font-mono text-lg font-bold text-slate-100">
            3 Standalone Calculators — Free for Premium
          </h3>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Validate expectancy, measure structural pip ranges, and plan prop-firm compounding.
            Premium members get all three included — or purchase individually via Stripe.
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
              Premium — {PREMIUM_PROMO_CODE}
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
              {tool.price} · Premium free
            </p>
          </Link>
        ))}
      </div>
    </GlassPanel>
  );
}

export function PremiumUpsellBanner() {
  const premiumUrl = getPremiumCheckoutUrl(true);

  return (
    <div className="rounded-xl border border-emerald-500/35 bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 px-6 py-8 text-center">
      <h3 className="font-mono text-xl font-bold text-emerald-100">
        Get Everything — Save $60 with {PREMIUM_PROMO_CODE}
      </h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-emerald-200/80">
        All local tools, 6 core QS frameworks, Chart Academy masterclass, TradeLocker bot, and
        priority support for {PREMIUM_PRICE}/mo. Use code <strong>{PREMIUM_PROMO_CODE}</strong> at
        checkout.
      </p>
      <a
        href={premiumUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex rounded-lg bg-emerald-600 px-6 py-3 font-mono text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
      >
        Upgrade to Premium
      </a>
    </div>
  );
}