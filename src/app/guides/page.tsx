import type { Metadata } from "next";
import Link from "next/link";
import { CHARTING_GUIDES } from "@/lib/seo/public-lessons";

export const metadata: Metadata = {
  title: "Free Charting Guides | Quicksilver Algo",
  description:
    "Comprehensive free charting guides: candlestick patterns, Fibonacci zones, market structure, and trading styles for manual traders.",
};

export default function GuidesIndexPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-mono text-3xl font-bold text-slate-100">
          Charting Guides
        </h1>
        <p className="mt-3 text-slate-400">
          Category overviews with deep lesson libraries — free for every trader.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {CHARTING_GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-6 transition-all hover:border-cyan-accent/30"
          >
            <h2 className="font-mono text-lg font-semibold text-slate-200">
              {guide.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500">{guide.description}</p>
            <p className="mt-3 font-mono text-[10px] text-slate-600">
              {guide.sectionCount} sections · {guide.lessonCount} lessons
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}