import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CHARTING_GUIDES,
  getGuideBySlug,
  getLessonsForGuide,
  PROP_FIRM_ONE_WEEK_GUIDE,
} from "@/lib/seo/public-lessons";
import { guideArticleJsonLd, faqJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { PremiumLessonCTA } from "@/components/seo/PremiumLessonCTA";
import { FadedPreview } from "@/components/seo/FadedPreview";
import { FreemiumTierCTA } from "@/components/seo/FreemiumTierCTA";
import { PropFirmOneWeekGuide } from "@/components/academy/PropFirmOneWeekGuide";
import { TOOLS } from "@/lib/tools-registry";
import { Badge } from "@/components/ui/Badge";
import { getFreshSession } from "@/lib/access-control";
import {
  checkResourceAccess,
  getPreviewParagraphs,
} from "@/lib/accessControl";

const GUIDE_TOOL_MAP: Record<string, string> = {
  "prop-firm-one-week": "prop-survival",
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

export default async function GuidePage({
  params,
}: {
  params: { slug: string };
}) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  const user = await getFreshSession();
  const access = checkResourceAccess(
    user?.subscriptionTier,
    "guide",
    params.slug
  );
  const hasFullAccess = access.allowed;

  if (params.slug === PROP_FIRM_ONE_WEEK_GUIDE.slug) {
    return (
      <PropFirmOneWeekGuide
        hasFullAccess={hasFullAccess}
        requiredTier={access.requiredTier}
      />
    );
  }

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
  const previewSource = [
    guide.description,
    ...guide.highlights,
    ...lessons.slice(0, 3).map((l) => `${l.title}: ${l.summary}`),
  ];
  const preview = getPreviewParagraphs(previewSource, 300);

  const previewContent = (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Topics Covered
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {(hasFullAccess ? guide.highlights : preview.paragraphs).map((h) => (
            <li
              key={h}
              className="rounded border border-slate-800/40 px-3 py-2 font-mono text-xs text-slate-400"
            >
              {h}
            </li>
          ))}
        </ul>
      </section>
      {hasFullAccess && (
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
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <JsonLdScript data={jsonLd} />

      <header>
        <Link href="/guides" className="font-mono text-xs text-cyan-accent hover:underline">
          ← All Guides
        </Link>
        {guide.badge && (
          <Badge variant="warning" className="mt-3">
            {guide.badge}
          </Badge>
        )}
        {!hasFullAccess && (
          <Badge variant="warning" className="mt-3 ml-2">
            Preview · {access.requiredTier}
          </Badge>
        )}
        <h1 className="mt-4 font-mono text-3xl font-bold text-slate-100">
          {guide.title}
        </h1>
        <p className="mt-3 text-lg text-slate-400">{guide.description}</p>
        <p className="mt-2 font-mono text-xs text-slate-600">
          {guide.sectionCount} sections · {guide.lessonCount} lessons
        </p>
      </header>

      {hasFullAccess ? (
        previewContent
      ) : (
        <>
          <FadedPreview>{previewContent}</FadedPreview>
          <FreemiumTierCTA
            resourceType="guide"
            resourceId={params.slug}
            requiredTier={access.requiredTier}
            resourceTitle={guide.title}
          />
        </>
      )}

      {hasFullAccess && tool && <PremiumLessonCTA lessonSlug={sampleLesson} />}

      {hasFullAccess && (
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
      )}
    </div>
  );
}