import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PUBLIC_LESSONS,
  getLessonBySlug,
  getLessonsForGuide,
} from "@/lib/seo/public-lessons";
import { articleJsonLd, faqJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { PremiumLessonCTA } from "@/components/seo/PremiumLessonCTA";
import { FadedPreview } from "@/components/seo/FadedPreview";
import { FreemiumTierCTA } from "@/components/seo/FreemiumTierCTA";
import { Badge } from "@/components/ui/Badge";
import { LessonInteractivePanelBySlug } from "@/components/academy/LessonInteractivePanel";
import { LessonEngagementTracker } from "@/components/engagement/LessonEngagementTracker";
import { StickyUpgradeBar } from "@/components/engagement/StickyUpgradeBar";
import { ToolTeaserCard } from "@/components/engagement/ToolTeaserCard";
import { MarkLessonComplete } from "@/components/engagement/MarkLessonComplete";
import { getFreshSession } from "@/lib/access-control";
import {
  checkResourceAccess,
  getPreviewParagraphs,
} from "@/lib/accessControl";

export function generateStaticParams() {
  return PUBLIC_LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const lesson = getLessonBySlug(params.slug);
  if (!lesson) return { title: "Lesson Not Found" };

  return {
    title: `${lesson.title} | Quicksilver Trading Lesson`,
    description: lesson.summary,
    openGraph: {
      title: lesson.title,
      description: lesson.summary,
      type: "article",
    },
  };
}

export default async function LessonPage({
  params,
}: {
  params: { slug: string };
}) {
  const lesson = getLessonBySlug(params.slug);
  if (!lesson) notFound();

  const user = await getFreshSession();
  const access = checkResourceAccess(
    user?.subscriptionTier,
    "lesson",
    params.slug
  );
  const hasFullAccess = access.allowed;

  const related = getLessonsForGuide(lesson.categoryId)
    .filter((l) => l.slug !== lesson.slug)
    .slice(0, 5);

  const jsonLd = [
    articleJsonLd({
      title: lesson.title,
      description: lesson.summary,
      slug: lesson.slug,
      publishedAt: lesson.publishedAt,
      section: lesson.sectionTitle,
    }),
    faqJsonLd(lesson.faqs),
  ];

  const { lesson: content } = lesson;
  const preview = getPreviewParagraphs(content.body, 300);
  const bodyParagraphs = hasFullAccess ? content.body : preview.paragraphs;

  const bodySection = (
    <div className="prose prose-invert max-w-none space-y-4">
      {bodyParagraphs.map((para, i) => (
        <p key={i} className="leading-relaxed text-slate-400">
          {para}
        </p>
      ))}
    </div>
  );

  return (
    <article className="space-y-8 pb-24">
      <JsonLdScript data={jsonLd} />
      <LessonEngagementTracker slug={params.slug} />

      <header>
        <Link
          href={`/guides/${lesson.categoryId}`}
          className="font-mono text-xs text-cyan-accent hover:underline"
        >
          ← {lesson.categoryTitle}
        </Link>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="success">{lesson.sectionTitle}</Badge>
          {content.difficulty && (
            <Badge variant="warning">{content.difficulty}</Badge>
          )}
          {!hasFullAccess && (
            <Badge variant="warning">Preview · {access.requiredTier}</Badge>
          )}
        </div>
        <h1 className="mt-4 font-mono text-2xl font-bold text-slate-100 sm:text-3xl">
          {lesson.title}
        </h1>
        <p className="mt-3 text-lg text-slate-400">{lesson.summary}</p>
      </header>

      <LessonInteractivePanelBySlug slug={params.slug} title={lesson.title} />

      {hasFullAccess ? (
        bodySection
      ) : (
        <>
          <FadedPreview>{bodySection}</FadedPreview>
          <ToolTeaserCard lessonSlug={params.slug} />
          <FreemiumTierCTA
            resourceType="lesson"
            resourceId={params.slug}
            requiredTier={access.requiredTier}
            resourceTitle={lesson.title}
          />
        </>
      )}

      {!hasFullAccess && (
        <StickyUpgradeBar
          requiredTier={access.requiredTier}
          resourceTitle={lesson.title}
        />
      )}

      {hasFullAccess && content.keyPoints && (
        <section className="rounded-lg border border-slate-800/60 bg-slate-900/30 p-6">
          <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
            Key Points
          </h2>
          <ul className="mt-4 space-y-2">
            {content.keyPoints.map((pt) => (
              <li key={pt} className="font-mono text-sm text-slate-400">
                → {pt}
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasFullAccess && content.manualTips && (
        <section className="rounded-lg border border-cyan-accent/20 bg-cyan-accent/5 p-6">
          <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
            Manual Trading Tips
          </h2>
          <ul className="mt-4 space-y-2">
            {content.manualTips.map((tip) => (
              <li key={tip} className="text-sm text-slate-400">
                • {tip}
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasFullAccess && (
        <section>
          <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-slate-500">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {lesson.faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-lg border border-slate-800/40 p-4"
              >
                <h3 className="font-mono text-sm font-semibold text-slate-200">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm text-slate-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {hasFullAccess && (
        <div className="flex flex-wrap items-center gap-4">
          <MarkLessonComplete slug={params.slug} />
        </div>
      )}

      {hasFullAccess && <PremiumLessonCTA lessonSlug={lesson.slug} />}

      {hasFullAccess && related.length > 0 && (
        <section>
          <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
            More in {lesson.categoryTitle}
          </h2>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/lessons/${r.slug}`}
                  className="font-mono text-sm text-cyan-accent hover:underline"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}