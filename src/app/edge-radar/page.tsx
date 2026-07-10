import type { Metadata } from "next";
import { Activity, Lock, Radar, TrendingUp, Zap } from "lucide-react";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import {
  EDGE_RADAR_CHECKOUT_URL,
  EDGE_RADAR_FAQ,
  EDGE_RADAR_FEATURES,
  EDGE_RADAR_HOOK,
  EDGE_RADAR_MARKETS,
  EDGE_RADAR_META_DESCRIPTION,
  EDGE_RADAR_NAME,
  EDGE_RADAR_PATH,
  EDGE_RADAR_PRICE,
  EDGE_RADAR_PRICE_AMOUNT,
  EDGE_RADAR_PUBLISHED_AT,
  EDGE_RADAR_SAMPLE_ALERTS,
  EDGE_RADAR_SEO_KEYWORDS,
  EDGE_RADAR_TAGLINE,
  EDGE_RADAR_USE_CASES,
} from "@/lib/edge-radar";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  productWebPageJsonLd,
  subscriptionProductJsonLd,
} from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quicksilveralgo.com";

export const metadata: Metadata = {
  title: `${EDGE_RADAR_NAME} — +EV Sports Props & XAUUSD Sentiment Scanner`,
  description: EDGE_RADAR_META_DESCRIPTION,
  keywords: [...EDGE_RADAR_SEO_KEYWORDS],
  alternates: {
    canonical: `${SITE_URL}${EDGE_RADAR_PATH}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}${EDGE_RADAR_PATH}`,
    title: `${EDGE_RADAR_NAME} — Live Edge Scanner`,
    description: EDGE_RADAR_META_DESCRIPTION,
    siteName: "Quicksilver Algo Systems",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: EDGE_RADAR_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${EDGE_RADAR_NAME} — ${EDGE_RADAR_PRICE}`,
    description: EDGE_RADAR_META_DESCRIPTION,
    images: ["/icon.png"],
  },
};

const FEATURE_ICONS = [TrendingUp, Activity, Radar] as const;

const KIND_STYLES = {
  sports: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
  macro: "border-cyan-500/30 bg-cyan-500/5 text-cyan-400",
} as const;

function EdgeRadarAlertRow({
  alert,
  blurred,
}: {
  alert: (typeof EDGE_RADAR_SAMPLE_ALERTS)[number];
  blurred?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-2 border-b border-slate-800/50 px-4 py-3 sm:grid-cols-[4.5rem_1fr_auto] sm:items-center sm:gap-4",
        blurred && "select-none blur-[3px]"
      )}
    >
      <span className="font-mono text-[10px] text-slate-600">{alert.timestamp}</span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-semibold text-slate-200">{alert.asset}</span>
          <span
            className={cn(
              "rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider",
              KIND_STYLES[alert.kind]
            )}
          >
            {alert.signal}
          </span>
        </div>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-slate-500">{alert.detail}</p>
      </div>
      {alert.ev && (
        <span className="font-mono text-xs font-semibold text-amber-400 sm:text-right">
          {alert.ev}
        </span>
      )}
    </div>
  );
}

export default function EdgeRadarPage() {
  const visibleAlerts = EDGE_RADAR_SAMPLE_ALERTS.filter((a) => !a.locked);
  const lockedAlerts = EDGE_RADAR_SAMPLE_ALERTS.filter((a) => a.locked);

  const jsonLd = [
    productWebPageJsonLd({
      name: EDGE_RADAR_NAME,
      description: EDGE_RADAR_META_DESCRIPTION,
      path: EDGE_RADAR_PATH,
      datePublished: EDGE_RADAR_PUBLISHED_AT,
    }),
    subscriptionProductJsonLd({
      name: EDGE_RADAR_NAME,
      description: EDGE_RADAR_META_DESCRIPTION,
      path: EDGE_RADAR_PATH,
      price: EDGE_RADAR_PRICE_AMOUNT,
      checkoutUrl: EDGE_RADAR_CHECKOUT_URL,
      category: "FinanceApplication",
      datePublished: EDGE_RADAR_PUBLISHED_AT,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: EDGE_RADAR_NAME, path: EDGE_RADAR_PATH },
    ]),
    faqJsonLd([...EDGE_RADAR_FAQ]),
  ];

  return (
    <article className="space-y-12">
      <JsonLdScript data={jsonLd} />

      <header className="text-center">
        <Badge variant="warning" className="mb-4">
          Dual-market edge engine
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-50 sm:text-4xl lg:text-5xl">
          {EDGE_RADAR_NAME}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-mono text-sm uppercase tracking-widest text-cyan-accent/90">
          {EDGE_RADAR_TAGLINE}
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
          {EDGE_RADAR_HOOK}
        </p>
        <p className="mt-6 font-mono text-2xl font-bold text-slate-100">
          {EDGE_RADAR_PRICE}
        </p>
        <a
          href={EDGE_RADAR_CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block"
        >
          <Button variant="primary" size="lg">
            <Zap className="h-4 w-4" aria-hidden />
            Subscribe — Unlock Live Dashboard
          </Button>
        </a>
        <p className="mt-4 font-mono text-xs text-slate-600">
          Cancel anytime · Instant access after checkout
        </p>
      </header>

      <section aria-labelledby="edge-radar-capabilities">
        <h2
          id="edge-radar-capabilities"
          className="mb-6 text-center font-mono text-sm font-semibold uppercase tracking-widest text-slate-400"
        >
          Core capabilities
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {EDGE_RADAR_FEATURES.map((feature, index) => {
            const Icon = FEATURE_ICONS[index];
            const accentRing =
              feature.accent === "emerald"
                ? "border-emerald-500/25 hover:border-emerald-500/40"
                : feature.accent === "cyan"
                  ? "border-cyan-500/25 hover:border-cyan-500/40"
                  : "border-amber-500/25 hover:border-amber-500/40";
            const accentIcon =
              feature.accent === "emerald"
                ? "text-emerald-400"
                : feature.accent === "cyan"
                  ? "text-cyan-400"
                  : "text-amber-400";

            return (
              <div
                key={feature.title}
                className={cn(
                  "rounded-xl border bg-slate-950/50 p-5 transition-colors",
                  accentRing
                )}
              >
                <Icon className={cn("h-5 w-5", accentIcon)} aria-hidden />
                <h3 className="mt-3 font-mono text-sm font-semibold text-slate-200">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="edge-radar-markets">
        <h2
          id="edge-radar-markets"
          className="mb-6 text-center font-mono text-sm font-semibold uppercase tracking-widest text-slate-400"
        >
          Markets & books scanned
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {EDGE_RADAR_MARKETS.map((group) => (
            <div
              key={group.category}
              className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-5"
            >
              <h3 className="font-mono text-sm font-semibold text-slate-200">{group.category}</h3>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 font-mono text-xs text-slate-500"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-accent/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="edge-radar-use-cases">
        <h2
          id="edge-radar-use-cases"
          className="mb-6 text-center font-mono text-sm font-semibold uppercase tracking-widest text-slate-400"
        >
          Built for
        </h2>
        <div className="space-y-4">
          {EDGE_RADAR_USE_CASES.map((useCase) => (
            <div
              key={useCase.title}
              className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-5"
            >
              <h3 className="font-mono text-sm font-semibold text-slate-200">{useCase.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{useCase.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="edge-radar-terminal">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="edge-radar-terminal" className="font-mono text-lg font-bold text-slate-200">
              Live Edge Terminal
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Preview of the hosted feed — subscribers get the full real-time stream.
            </p>
          </div>
          <Badge variant="success">Sample feed</Badge>
        </div>

        <div className="relative overflow-hidden rounded-lg">
          <TerminalPanel title="QS Edge Radar · Live Feed" status="online" className="!p-0">
            <div className="border-b border-slate-800/60 bg-slate-900/40 px-4 py-2">
              <div className="hidden font-mono text-[10px] uppercase tracking-widest text-slate-600 sm:grid sm:grid-cols-[4.5rem_1fr_auto] sm:gap-4">
                <span>Time</span>
                <span>Alert</span>
                <span className="text-right">Edge</span>
              </div>
            </div>

            {visibleAlerts.map((alert) => (
              <EdgeRadarAlertRow key={alert.id} alert={alert} />
            ))}

            {lockedAlerts.length > 0 && (
              <div className="relative">
                {lockedAlerts.map((alert) => (
                  <EdgeRadarAlertRow key={alert.id} alert={alert} blurred />
                ))}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/70 to-slate-950/95" />

                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end px-4 pb-8 pt-16 text-center">
                  <div className="pointer-events-auto flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/30 bg-slate-950/90 shadow-[0_0_24px_rgba(0,229,255,0.15)]">
                      <Lock className="h-5 w-5 text-cyan-accent" aria-hidden />
                    </div>
                    <p className="mt-4 font-mono text-sm font-semibold text-slate-200">
                      Live alerts are subscriber-only
                    </p>
                    <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
                      Unlock the full terminal with real-time sports prop lags and macro sentiment
                      spikes — hosted on-site, no setup required.
                    </p>
                    <a
                      href={EDGE_RADAR_CHECKOUT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5"
                    >
                      <Button variant="primary" size="lg">
                        Subscribe to Unlock Live Dashboard
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </TerminalPanel>
        </div>
      </section>

      <section aria-labelledby="edge-radar-faq">
        <h2
          id="edge-radar-faq"
          className="mb-6 text-center font-mono text-lg font-bold text-slate-200"
        >
          Edge Radar FAQ
        </h2>
        <div className="space-y-4">
          {EDGE_RADAR_FAQ.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-5"
            >
              <h3 className="font-mono text-sm font-semibold text-slate-200">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 to-slate-950/80 px-6 py-10 text-center">
        <h2 className="font-mono text-2xl font-bold text-slate-100">
          Catch the lag before the market does
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
          Edge Radar runs 24/7 on Quicksilver infrastructure. One subscription — sports props and
          macro volatility in a single live terminal.
        </p>
        <a
          href={EDGE_RADAR_CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block"
        >
          <Button variant="primary" size="lg">
            Get Edge Radar — {EDGE_RADAR_PRICE}
          </Button>
        </a>
      </section>
    </article>
  );
}