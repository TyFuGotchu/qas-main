import Link from "next/link";
import {
  Bot,
  BookOpen,
  Check,
  ExternalLink,
  Gauge,
  LineChart,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import {
  CHART_ACADEMY_STATS,
  LIVE_TERMINAL_TOOLS,
  PREMIUM_INCLUDE_CATEGORIES,
  PREMIUM_INCLUDES_ANCHOR,
  PREMIUM_INCLUDES_HEADLINE,
  PREMIUM_INCLUDES_SUBHEADLINE,
  PROP_OS_FEATURES,
  QUICKSILVER_QUANT_PROTOCOL,
} from "@/lib/premium-includes";
import { getPremiumCheckoutUrl } from "@/lib/pricing-constants";
import { ALL_TOOLS } from "@/lib/tools-registry";

interface PremiumEverythingIncludedProps {
  className?: string;
  /** @deprecated Guarantee removed — kept for call-site compatibility */
  showGuarantee?: boolean;
}

export function PremiumEverythingIncluded({
  className,
  showGuarantee: _showGuarantee = false,
}: PremiumEverythingIncludedProps) {
  void _showGuarantee;
  const checkoutUrl = getPremiumCheckoutUrl();

  return (
    <section
      id={PREMIUM_INCLUDES_ANCHOR}
      className={`scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          <Badge variant="success" className="mb-4">
            Quicksilver Premium — full stack
          </Badge>
          <h2 className="font-mono text-2xl font-bold text-slate-50 sm:text-4xl">
            {PREMIUM_INCLUDES_HEADLINE}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {PREMIUM_INCLUDES_SUBHEADLINE}
          </p>
        </header>

        {/* Flagship bot spotlight */}
        <GlassPanel
          className="mt-10 overflow-hidden border-amber-500/25 bg-gradient-to-br from-amber-500/5 via-slate-950 to-cyan-500/5 p-6 sm:p-8"
          glow
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/10 shadow-[0_0_40px_rgba(245,158,11,0.12)]">
              <Bot className="h-10 w-10 text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="warning">Largest Feature · Ready to Launch</Badge>
                <Badge variant="success">TradeLocker Hub</Badge>
              </div>
              <h3 className="mt-3 font-mono text-xl font-bold text-slate-100 sm:text-2xl">
                {QUICKSILVER_QUANT_PROTOCOL.name}
              </h3>
              <p className="font-mono text-sm text-amber-200/80">
                {QUICKSILVER_QUANT_PROTOCOL.subtitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {QUICKSILVER_QUANT_PROTOCOL.description}
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {QUICKSILVER_QUANT_PROTOCOL.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 font-mono text-xs text-slate-400"
                  >
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
              <a
                href={QUICKSILVER_QUANT_PROTOCOL.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  <ExternalLink className="h-4 w-4" />
                  Open on TradeLocker
                </Button>
              </a>
              <Link href={QUICKSILVER_QUANT_PROTOCOL.dashboardHref}>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Terminal className="h-4 w-4" />
                  Dashboard Setup
                </Button>
              </Link>
            </div>
          </div>
        </GlassPanel>

        {/* Category grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PREMIUM_INCLUDE_CATEGORIES.map((cat) => {
            const inner = (
              <>
                {cat.badge && (
                  <Badge variant="success" className="mb-2">
                    {cat.badge}
                  </Badge>
                )}
                <p className="font-mono text-sm font-semibold text-cyan-accent">{cat.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{cat.description}</p>
              </>
            );

            if (cat.href) {
              const cardClass =
                "rounded-xl border border-slate-800/60 bg-slate-950/50 p-5 transition-colors hover:border-cyan-accent/25";

              if (cat.href.startsWith("http")) {
                return (
                  <a
                    key={cat.id}
                    href={cat.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClass}
                  >
                    {inner}
                  </a>
                );
              }

              return (
                <Link key={cat.id} href={cat.href} className={cardClass}>
                  {inner}
                </Link>
              );
            }

            return (
              <div
                key={cat.id}
                className="rounded-xl border border-slate-800/60 bg-slate-950/50 p-5"
              >
                {inner}
              </div>
            );
          })}
        </div>

        {/* All 9 tools */}
        <div className="mt-10">
          <h3 className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest text-slate-400">
            <Gauge className="h-4 w-4 text-cyan-accent" />
            All {ALL_TOOLS.length} Planning Engines
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.slug}
                  className="flex items-start gap-3 rounded-lg border border-slate-800/50 bg-slate-950/40 px-4 py-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-accent/20 bg-cyan-accent/5">
                    <Icon className="h-4 w-4 text-cyan-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-semibold text-slate-200">
                      {tool.shortName}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                      {tool.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academy + Live terminal row */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800/60 bg-slate-950/50 p-5">
            <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
              <BookOpen className="h-4 w-4 text-cyan-accent" />
              {CHART_ACADEMY_STATS.label}
            </h3>
            <p className="mt-2 text-sm text-slate-500">{CHART_ACADEMY_STATS.description}</p>
            <p className="mt-3 font-mono text-2xl font-bold text-cyan-accent">
              {CHART_ACADEMY_STATS.lessonCount}{" "}
              <span className="text-sm font-normal text-slate-500">lessons</span>
            </p>
          </div>
          <div className="rounded-xl border border-slate-800/60 bg-slate-950/50 p-5">
            <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
              <LineChart className="h-4 w-4 text-cyan-accent" />
              In-Terminal Pro Tools
            </h3>
            <ul className="mt-3 space-y-2">
              {LIVE_TERMINAL_TOOLS.map((t) => (
                <li key={t.name} className="flex items-start gap-2 text-xs text-slate-400">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-terminal" />
                  <span>
                    <strong className="text-slate-300">{t.name}</strong> — {t.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Prop OS */}
        <div className="mt-6 rounded-xl border border-slate-800/60 bg-slate-950/50 p-5">
          <h3 className="font-mono text-sm font-semibold text-slate-200">Prop OS Included</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {PROP_OS_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 font-mono text-xs text-slate-400">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-terminal" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="lg">
              <Zap className="h-4 w-4" />
              Unlock Everything — Premium
            </Button>
          </a>
          <Link href="/register">
            <Button variant="secondary" size="lg">
              Start Free Preview
            </Button>
          </Link>
          <Link href="/tools">
            <Button variant="ghost" size="lg">
              Browse Tools
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}