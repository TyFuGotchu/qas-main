import type { Metadata } from "next";
import Link from "next/link";
import {
  SEO_LANDING_COUNT,
  SEO_LANDING_PAGES,
  SEO_MARKETS,
  SEO_TOPICS,
  getLandingPagesByMarket,
} from "@/lib/seo/landing-pages";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Free Manual Trading Tools & SEO Solutions | Quicksilver Algo",
  description: `${SEO_LANDING_COUNT}+ free trading calculators and setup scoring demos for forex, gold, indices, and crypto manual traders.`,
};

export default function SolutionsHubPage() {
  return (
    <div className="space-y-12">
      <header>
        <Badge variant="success" className="mb-3">
          {SEO_LANDING_COUNT} programmatic SEO pages
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
          Manual Trading Solutions Hub
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Free interactive demos for setup scoring, risk sizing, prop firm
          consistency, and trade planning — organized by market and strategy topic.
        </p>
      </header>

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

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          All landing pages
        </h2>
        <div className="max-h-96 space-y-1 overflow-y-auto rounded-lg border border-slate-800/40 p-4">
          {SEO_LANDING_PAGES.map((p) => (
            <Link
              key={p.slug}
              href={`/solutions/${p.slug}`}
              className="block font-mono text-xs text-slate-500 hover:text-cyan-accent"
            >
              {p.h1}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}