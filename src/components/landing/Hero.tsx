import Link from "next/link";
import Button from "@/components/ui/Button";
import { MoneyBackGuarantee } from "@/components/marketing/MoneyBackGuarantee";
import { TOTAL_SEO_LANDING_PAGES } from "@/lib/seo/seo-index";
import {
  PROP_FIRM_CHALLENGE_DAYS,
  PROP_FIRM_MARKETING_HEADLINE,
  PROP_FIRM_PLAYBOOK_HREF,
} from "@/lib/prop-firm-challenge-marketing";
import {
  PREMIUM_INCLUDES_ANCHOR,
  PREMIUM_INCLUDES_ONE_LINER,
  QUICKSILVER_QUANT_PROTOCOL,
} from "@/lib/premium-includes";
import { PREMIUM_PROMO_CODE, PREMIUM_PROMO_FIRST_MONTH } from "@/lib/pricing-tiers";
import { TOOL_COUNT } from "@/lib/tools-registry";
import {
  BarChart3,
  Bot,
  Calendar,
  LineChart,
  Shield,
  Sparkles,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-qs-header-line opacity-90" />
        <div className="absolute left-1/2 top-28 h-48 w-48 -translate-x-1/2 rounded-full border border-cyan-400/20 opacity-50" />
        <div className="absolute left-1/2 top-28 h-80 w-80 -translate-x-1/2 rounded-full border border-slate-500/10 opacity-40" />
        <div className="absolute left-1/2 top-28 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border border-cyan-500/5 opacity-25" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-cyan-500/5 px-4 py-1.5">
            <Bot className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-amber-200/90">
              {QUICKSILVER_QUANT_PROTOCOL.name} — live on TradeLocker
            </span>
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-gradient-to-r from-emerald-500/10 via-slate-900/60 to-cyan-500/5 px-4 py-1.5 shadow-[0_0_32px_rgba(16,185,129,0.1),inset_0_1px_0_rgba(232,244,252,0.06)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-300">
              Premium · Playbook + {TOOL_COUNT} Tools + Bot + Academy
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl font-mono text-3xl font-bold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
            {PROP_FIRM_MARKETING_HEADLINE}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {PREMIUM_INCLUDES_ONE_LINER} Follow the day-by-day playbook, run the planning
            engines, deploy the in-house algo — one subscription.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/launch">
              <Button variant="primary" size="lg">
                Join the Launch — {PREMIUM_PROMO_CODE} ({PREMIUM_PROMO_FIRST_MONTH})
              </Button>
            </Link>
            <Link href={`/#${PREMIUM_INCLUDES_ANCHOR}`}>
              <Button variant="secondary" size="lg">
                See Everything in Premium
              </Button>
            </Link>
          </div>
          <div className="mx-auto mt-5 max-w-xl">
            <MoneyBackGuarantee variant="inline" />
          </div>
          <p className="mt-4 font-mono text-xs text-slate-500">
            <Link href="/register" className="text-cyan-accent hover:underline">
              Free account
            </Link>
            {" · "}
            <Link href={PROP_FIRM_PLAYBOOK_HREF} className="text-cyan-accent hover:underline">
              Playbook preview
            </Link>
            {" · "}
            <Link href={QUICKSILVER_QUANT_PROTOCOL.href} className="text-cyan-accent hover:underline">
              Quant Protocol bot
            </Link>
            {" · "}
            <Link href="/learn" className="text-cyan-accent hover:underline">
              {TOTAL_SEO_LANDING_PAGES}+ guides
            </Link>
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href={QUICKSILVER_QUANT_PROTOCOL.href}
            target="_blank"
            rel="noopener noreferrer"
            className="qs-panel-shine group rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-slate-950 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:border-amber-400/40 sm:col-span-2 lg:col-span-1 lg:row-span-2"
          >
            <div className="mb-4 inline-flex rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5">
              <Bot className="h-7 w-7 text-amber-400" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-amber-400/90">
              Ready to launch · TradeLocker Hub
            </p>
            <h3 className="mt-2 font-mono text-base font-semibold text-slate-100">
              {QUICKSILVER_QUANT_PROTOCOL.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {QUICKSILVER_QUANT_PROTOCOL.tagline}. Institutional execution with prop-aware
              parameters — included with Premium.
            </p>
            <p className="mt-4 font-mono text-xs text-amber-300/80 group-hover:underline">
              Open TradeLocker Hub →
            </p>
          </a>

          {[
            {
              icon: Calendar,
              title: `${PROP_FIRM_CHALLENGE_DAYS}-Day Playbook`,
              desc: "Profit caps, consistency checks & challenge tracker",
            },
            {
              icon: BarChart3,
              title: `${TOOL_COUNT} Planning Engines`,
              desc: "Confluence, risk matrix, prop survival & more",
            },
            {
              icon: LineChart,
              title: "Live Terminal",
              desc: "TradeLocker connect + 4 in-terminal pro tools",
            },
            {
              icon: Sparkles,
              title: "89 Chart Academy Lessons",
              desc: "Full library wired into playbook workflow",
            },
            {
              icon: Shield,
              title: "Prop OS + Journal",
              desc: "Command center, growth dashboard & community",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="qs-panel-shine group rounded-xl border border-slate-700/30 bg-qs-panel p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/25"
            >
              <div className="mb-3 inline-flex rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-2">
                <feature.icon className="h-5 w-5 text-cyan-300" />
              </div>
              <h3 className="font-mono text-sm font-semibold text-slate-100">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}