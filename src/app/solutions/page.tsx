import type { Metadata } from "next";
import Link from "next/link";
import {
  SEO_MARKETS,
  SEO_PROP_FIRMS,
  SEO_TIMEFRAMES,
  SEO_TOPICS,
  getLandingPagesByMarket,
  getLandingPagesByPropFirm,
} from "@/lib/seo/landing-pages";
import { Badge } from "@/components/ui/Badge";
import {
  PREMIUM_PROMO_FIRST_MONTH,
  PREMIUM_PROMO_CODE,
} from "@/lib/pricing-tiers";

export const metadata: Metadata = {
  title: "Free Manual Trading Tools & Calculators | Quicksilver Algo",
  description:
    "Free trading calculators and planning tools for forex, gold, indices, and crypto — browse by market, timeframe, prop firm, and topic.",
};

export default function SolutionsHubPage() {
  return (
    <div className="space-y-12">
      <header>
        <Badge variant="success" className="mb-3">
          Free tools & calculators
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
          Manual Trading Solutions Hub
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Setup scorers, risk calculators, and planning modules for manual
          traders — organized by market, timeframe, prop firm, and topic.
        </p>
      </header>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Browse by timeframe
        </h2>
        <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {SEO_TIMEFRAMES.map((tf) => (
            <Link
              key={tf.slug}
              href={`/solutions/xauusd-${tf.slug}-setup-scoring`}
              className="rounded-lg border border-slate-800/60 bg-slate-900/40 px-3 py-2 text-center hover:border-cyan-accent/30"
            >
              <p className="font-mono text-xs font-semibold text-slate-200">
                {tf.shortLabel}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Browse by market
        </h2>
        <div className="space-y-8">
          {SEO_MARKETS.map((market) => {
            const pages = getLandingPagesByMarket(market.slug).slice(0, 5);
            return (
              <div key={market.slug}>
                <h3 className="font-mono text-base font-semibold text-slate-200">
                  {market.name}
                </h3>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {pages.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/solutions/${p.slug}`}
                        className="block rounded-lg border border-slate-800/40 px-3 py-2 text-sm text-cyan-accent hover:border-cyan-accent/30"
                      >
                        {p.topic.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/solutions/${market.slug}-setup-scoring`}
                  className="mt-2 inline-block font-mono text-xs text-slate-500 hover:text-cyan-accent"
                >
                  View all {market.shortName} tools →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Browse by prop firm
        </h2>
        <div className="space-y-8">
          {SEO_PROP_FIRMS.map((firm) => {
            const pages = getLandingPagesByPropFirm(firm.slug).slice(0, 5);
            return (
              <div key={firm.slug}>
                <h3 className="font-mono text-base font-semibold text-slate-200">
                  {firm.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {firm.profitTarget} · {firm.maxDrawdown}
                </p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {pages.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/solutions/${p.slug}`}
                        className="block rounded-lg border border-slate-800/40 px-3 py-2 text-sm text-cyan-accent hover:border-cyan-accent/30"
                      >
                        {p.topic.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/solutions/${firm.slug}-setup-scoring`}
                  className="mt-2 inline-block font-mono text-xs text-slate-500 hover:text-cyan-accent"
                >
                  View all {firm.shortName} tools →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Browse by topic
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {SEO_TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              href={`/solutions/${topic.slug}`}
              className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-4 hover:border-cyan-accent/30"
            >
              <p className="font-mono text-sm font-semibold text-slate-200">
                {topic.name}
              </p>
              <p className="mt-1 text-xs text-slate-500">{topic.keyword}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-800/40 p-6 text-center">
        <p className="font-mono text-sm text-slate-400">
          Ready for full platform access?
        </p>
        <div className="mt-3 flex flex-col items-center gap-2">
          <Link
            href="/offers"
            className="font-mono text-xs text-emerald-400 hover:underline"
          >
            {PREMIUM_PROMO_CODE} promo — {PREMIUM_PROMO_FIRST_MONTH} first month →
          </Link>
          <Link
            href="/learn"
            className="font-mono text-xs text-cyan-accent hover:underline"
          >
            Explore free lesson guides →
          </Link>
        </div>
      </section>
    </div>
  );
}