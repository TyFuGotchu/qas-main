import type { Metadata } from "next";
import Link from "next/link";
import { LOCAL_TOOLS } from "@/lib/tools-registry";
import { LocalToolsPromo, PremiumUpsellBanner } from "@/components/tools/LocalToolsPromo";
import { Badge } from "@/components/ui/Badge";
import { getPremiumCheckoutUrl, PREMIUM_PRICE, PREMIUM_PROMO_CODE } from "@/lib/pricing-tiers";

export const metadata: Metadata = {
  title: "Local Trading Tools — Expectancy, ATR & Compounding | Quicksilver",
  description:
    "Three standalone trading calculators. Free for Premium members. Strategy Expectancy ($6.99), ATR Pip-Range ($12.99), Prop Compounding Matrix ($14.99).",
};

export default function ToolsHubPage() {
  return (
    <div className="space-y-10">
      <header className="text-center">
        <Badge variant="success" className="mb-3">
          Local Trading Tools
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
          Trading Tools Hub
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Interactive calculators hosted on Quicksilver.{" "}
          <strong className="text-emerald-400">Premium members get all three free.</strong> Or buy
          individually — upgrade to Premium ({PREMIUM_PRICE}/mo) with code {PREMIUM_PROMO_CODE} for
          $60 off.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {LOCAL_TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.slug}
              href={tool.publicHref}
              className="group rounded-xl border border-slate-800/60 bg-slate-950/50 p-5 transition-all hover:border-cyan-accent/40 hover:shadow-[0_0_30px_rgba(0,229,255,0.1)]"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-accent/30 bg-cyan-accent/10">
                <Icon className="h-5 w-5 text-cyan-accent" />
              </div>
              <h2 className="font-mono text-sm font-bold text-slate-100 group-hover:text-cyan-accent">
                {tool.shortName}
              </h2>
              <p className="mt-2 text-xs text-slate-500">{tool.desc}</p>
              <p className="mt-3 font-mono text-xs text-emerald-400">
                {tool.price} · Free with Premium
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 space-y-6">
        <LocalToolsPromo />
        <PremiumUpsellBanner />
        <p className="text-center font-mono text-xs text-slate-600">
          Dashboard members:{" "}
          <Link href="/dashboard/tools" className="text-cyan-accent hover:underline">
            Trading Tools section
          </Link>
        </p>
        <p className="text-center">
          <a
            href={getPremiumCheckoutUrl(true)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-emerald-400 hover:underline"
          >
            Get Premium with {PREMIUM_PROMO_CODE} →
          </a>
        </p>
      </div>
    </div>
  );
}