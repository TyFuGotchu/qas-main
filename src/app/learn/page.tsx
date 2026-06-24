import type { Metadata } from "next";
import Link from "next/link";
import {
  LESSON_LANDING_COUNT,
  LESSON_LANDING_PAGES,
  getLessonLandingPagesByMarket,
} from "@/lib/seo/lesson-landing-pages";
import { getLessonLandingMarkets } from "@/lib/seo/landing-data";
import { PUBLIC_LESSONS } from "@/lib/seo/public-lessons";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Free Trading Lesson Guides by Market | Quicksilver Algo",
  description: `${LESSON_LANDING_COUNT}+ free lesson landing pages for gold, forex, indices, and crypto — chart reading, candlesticks, Fibonacci, and prop firm workflows.`,
};

export default function LearnHubPage() {
  const markets = getLessonLandingMarkets();

  return (
    <div className="space-y-12">
      <header>
        <Badge variant="success" className="mb-3">
          {LESSON_LANDING_COUNT} lesson guides
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
          Market-Specific Lesson Guides
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Free SEO lesson landing pages pairing Chart Academy modules with
          real instruments — Gold, EURUSD, NAS100, Bitcoin, and more. Each page
          includes a demo widget and links to the full lesson.
        </p>
      </header>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Browse by market
        </h2>
        <div className="space-y-8">
          {markets.map((market) => {
            const pages = getLessonLandingPagesByMarket(market.slug).slice(0, 6);
            return (
              <div key={market.slug}>
                <h3 className="font-mono text-base font-semibold text-slate-200">
                  {market.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{market.session}</p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {pages.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/learn/${p.slug}`}
                        className="block rounded-lg border border-slate-800/40 px-3 py-2 text-sm text-cyan-accent hover:border-cyan-accent/30"
                      >
                        {p.lessonTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/learn/${market.slug}-${PUBLIC_LESSONS[0]?.slug ?? ""}`}
                  className="mt-2 inline-block font-mono text-xs text-slate-500 hover:text-cyan-accent"
                >
                  View all {market.shortName} lesson guides →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Popular lessons across markets
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PUBLIC_LESSONS.slice(0, 12).map((lesson) => {
            const first = LESSON_LANDING_PAGES.find(
              (p) => p.lessonSlug === lesson.slug
            );
            if (!first) return null;
            return (
              <Link
                key={lesson.slug}
                href={`/learn/${first.slug}`}
                className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-4 hover:border-cyan-accent/30"
              >
                <p className="font-mono text-sm font-semibold text-slate-200">
                  {lesson.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {lesson.categoryTitle} · {markets.length} market guides
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}