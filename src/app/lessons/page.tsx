import type { Metadata } from "next";
import Link from "next/link";
import { CHARTING_GUIDES, PUBLIC_LESSONS } from "@/lib/seo/public-lessons";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Free Trading Lessons | Quicksilver Algo Lesson Center",
  description:
    "Free chart reading, candlestick pattern, Fibonacci, and trading style lessons for manual traders. Learn on any platform — unlock premium QS Planning Modules when ready.",
};

export default function LessonsIndexPage() {
  return (
    <div className="space-y-10">
      <header>
        <Badge variant="success" className="mb-3">
          Free · SEO Lesson Center
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
          Quicksilver Lesson Center
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          {PUBLIC_LESSONS.length} free lessons on chart reading, candlesticks,
          Fibonacci zones, and trading styles — built for manual traders on any
          broker or charting platform.
        </p>
      </header>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Charting Guides
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {CHARTING_GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-4 transition-colors hover:border-cyan-accent/30"
            >
              <h3 className="font-mono text-sm font-semibold text-slate-200">
                {guide.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500">{guide.lessonCount} lessons</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          All Lessons
        </h2>
        <div className="space-y-2">
          {PUBLIC_LESSONS.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/lessons/${lesson.slug}`}
              className="block rounded-lg border border-slate-800/40 px-4 py-3 transition-colors hover:border-cyan-accent/20 hover:bg-slate-900/30"
            >
              <p className="font-mono text-sm text-slate-200">{lesson.title}</p>
              <p className="mt-0.5 font-mono text-[10px] text-slate-600">
                {lesson.categoryTitle} · {lesson.sectionTitle}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}