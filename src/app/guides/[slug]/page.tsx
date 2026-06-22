import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CHARTING_GUIDES,
  getGuideBySlug,
  getLessonsForGuide,
} from "@/lib/seo/public-lessons";
import { guideArticleJsonLd, faqJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { PremiumLessonCTA } from "@/components/seo/PremiumLessonCTA";
import { TOOLS } from "@/lib/tools-registry";

const GUIDE_TOOL_MAP: Record<string, string> = {
  "chart-reading": "edge-confluence",
  candlesticks: "edge-confluence",
  "trading-styles": "regime-oracle",
  fibonacci: "execution-protocol",
  "market-structure": "regime-oracle",
};

export function generateStaticParams() {
  return CHARTING_GUIDES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return { title: "Guide Not Found" };
  return {
    title: `${guide.title} | Quicksilver Charting Guide`,
    description: guide.description,
  };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  const lessons = getLessonsForGuide(guide.slug);
  const toolSlug = GUIDE_TOOL_MAP[guide.slug] ?? "edge-confluence";
  const sampleLesson = lessons[0]?.slug ?? `${guide.slug}-intro`;

  const jsonLd = [
    guideArticleJsonLd({
      title: guide.title,
      description: guide.description,
      slug: guide.slug,
    }),
    faqJsonLd(guide.faqs),
  ];

  const tool = TOOLS.find((t) => t.slug === toolSlug);

  return (
    <div className="space-y-8">
      <JsonLdScript data={jsonLd} />

      <header>
        <Link href="/guides" className="font-mono text-xs text-cyan-accent hover:underline">
          ← All Guides
        </Link>
        <h1 className="mt-4 font-mono text-3xl font-bold text-slate-100">
          {guide.title}
        </h1>
        <p className="mt-3 text-lg text-slate-400">{guide.description}</p>
        <p className="mt-2 font-mono text-xs text-slate-600">
          {guide.sectionCount} sections · {guide.lessonCount} lessons
        </p>
      </header>

      <section>
        <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Topics Covered
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {guide.highlights.map((h) => (
            <li
              key={h}
              className="rounded border border-slate-800/40 px-3 py-2 font-mono text-xs text-slate-400"
            >
              {h}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Lessons in This Guide
        </h2>
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/lessons/${lesson.slug}`}
              className="block rounded-lg border border-slate-800/40 px-4 py-3 hover:border-cyan-accent/20"
            >
              <p className="font-mono text-sm text-slate-200">{lesson.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{lesson.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {tool && (
        <PremiumLessonCTA lessonSlug={sampleLesson} />
      )}

      <section>
        <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-slate-500">
          FAQ
        </h2>
        <div className="space-y-4">
          {guide.faqs.map((faq) => (
            <div key={faq.question} className="rounded-lg border border-slate-800/40 p-4">
              <h3 className="font-mono text-sm font-semibold text-slate-200">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}