import type { Metadata } from "next";
import { Newspaper, Radar, TrendingUp, Zap } from "lucide-react";
import { EdgeRadarDashboard } from "@/components/edge-radar/EdgeRadarDashboard";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
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
  title: `${EDGE_RADAR_NAME} — +EV Sports Props & News Impact Scanner`,
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

const FEATURE_ICONS = [TrendingUp, Newspaper, Radar] as const;

export default function EdgeRadarPage() {
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
          Sports props edge engine
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

        <EdgeRadarDashboard />
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
          Edge Radar runs 24/7 on Quicksilver infrastructure. One subscription — every major sport,
          live prop alerts, and news impact scores in a single terminal.
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