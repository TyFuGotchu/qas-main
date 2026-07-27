import type { Metadata } from "next";
import Link from "next/link";
import { LOCAL_TOOL_BENEFITS } from "@/lib/local-tools-catalog";
import { LOCAL_TOOLS, QS_TOOLS, TOOL_COUNT } from "@/lib/tools-registry";
import { PropFirmChallengePromo } from "@/components/marketing/PropFirmChallengePromo";
import { PremiumUpsellBanner } from "@/components/tools/LocalToolsPromo";
import { PremiumValueStack } from "@/components/tools/PremiumValueStack";
import { Badge } from "@/components/ui/Badge";
import { PREMIUM_SUBHEADLINE } from "@/lib/premium-value-stack";
import {
  getPremiumCheckoutUrl,
} from "@/lib/pricing-tiers";

import { rankingPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = rankingPageMetadata({
  title: "Prop Firm Trading Tools: Risk, Consistency & Playbook",
  description:
    "Nine planning tools for prop firm challenges: Risk Matrix, Prop Survival Monte Carlo, Edge Confluence, expectancy, and 7-day playbook execution.",
  path: "/tools",
  keywords: [
    "prop firm risk calculator",
    "prop firm consistency calculator",
    "trading position size tool",
    "Monte Carlo prop firm",
  ],
});

export default function ToolsHubPage() {
  return (
    <div className="space-y-10">
      <header className="text-center">
        <Badge variant="success" className="mb-3">
          Institutional Toolkit
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
          Trading Tools Hub
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          {PREMIUM_SUBHEADLINE}
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total Engines", value: String(TOOL_COUNT) },
          { label: "Proprietary Calculators", value: "3" },
          { label: "QS Planning Modules", value: "6" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-800/60 bg-slate-950/50 p-4 text-center"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
              {stat.label}
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-cyan-accent">{stat.value}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-400">
          Proprietary Calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
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
                <h3 className="font-mono text-sm font-bold text-slate-100 group-hover:text-cyan-accent">
                  {tool.shortName}
                </h3>
                <p className="mt-2 text-xs text-slate-500">{tool.desc}</p>
                <p className="mt-3 font-mono text-xs text-emerald-400">
                  {LOCAL_TOOL_BENEFITS[tool.slug as keyof typeof LOCAL_TOOL_BENEFITS]}
                </p>
                <p className="mt-1 font-mono text-[10px] text-slate-600">Included with Premium</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-400">
          QS Planning Modules
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QS_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.slug}
                className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-accent/20 bg-cyan-accent/5">
                  <Icon className="h-5 w-5 text-cyan-accent/70" />
                </div>
                <h3 className="font-mono text-sm font-bold text-slate-200">{tool.shortName}</h3>
                <p className="mt-2 text-xs text-slate-500">{tool.desc}</p>
                <p className="mt-3 font-mono text-[10px] text-slate-600">Premium · Dashboard</p>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-center font-mono text-xs text-slate-500">
          QS modules run inside your dashboard after upgrading.{" "}
          <Link href="/register" className="text-cyan-accent hover:underline">
            Create account →
          </Link>
        </p>
      </section>

      <div className="space-y-6">
        <PropFirmChallengePromo variant="compact" />
        <PremiumValueStack showToolList />
        <PremiumUpsellBanner />
        <p className="text-center font-mono text-xs text-slate-600">
          Dashboard members:{" "}
          <Link href="/dashboard/tools" className="text-cyan-accent hover:underline">
            Trading Tools section
          </Link>
        </p>
        <p className="text-center">
          <a
            href={getPremiumCheckoutUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-emerald-400 hover:underline"
          >
            Get Premium with  →
          </a>
        </p>
      </div>
    </div>
  );
}