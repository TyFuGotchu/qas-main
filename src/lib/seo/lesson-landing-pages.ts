import { TOOLS } from "@/lib/tools-registry";
import {
  getLessonLandingMarkets,
  type SeoMarket,
} from "@/lib/seo/landing-data";
import { toolSlugToDemo } from "@/lib/seo/seo-demo";
import type { LandingDemoType } from "@/lib/seo/landing-data";
import { PUBLIC_LESSONS, type PublicLesson } from "@/lib/seo/public-lessons";

export interface LessonLandingPage {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  market: SeoMarket;
  lessonSlug: string;
  lessonTitle: string;
  categoryTitle: string;
  demo: LandingDemoType;
  toolSlug: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
  publishedAt: string;
}

function buildMarketLessonPage(
  market: SeoMarket,
  lesson: PublicLesson
): LessonLandingPage {
  const slug = `${market.slug}-${lesson.slug}`;
  const tool = TOOLS.find((t) => t.slug === lesson.relatedToolSlug);
  const demo = toolSlugToDemo(lesson.relatedToolSlug);

  const title = `${market.shortName} ${lesson.title} — Free Lesson Preview | Quicksilver`;
  const metaDescription = `Learn ${lesson.title.toLowerCase()} applied to ${market.name}. Free lesson preview, ${lesson.categoryTitle} workflow, and interactive ${tool?.shortName ?? "planning"} demo for manual traders.`;
  const h1 = `${lesson.title} on ${market.shortName}`;

  const intro = `Manual traders studying ${lesson.title.toLowerCase()} on ${market.name} need examples tied to real session flow — especially during the ${market.session}. This free Quicksilver lesson landing page previews the ${lesson.categoryTitle} module "${lesson.title}" with a hands-on demo and a practical workflow you can run on any charting platform.`;

  const sections = [
    {
      heading: `Why ${lesson.title} matters on ${market.shortName}`,
      paragraphs: [
        `${market.name} reacts to liquidity differently across sessions. ${lesson.summary}`,
        `Use this page to preview the lesson, test the free ${tool?.shortName ?? "planning"} demo, then open the full Chart Academy module when you are ready to go deeper.`,
      ],
    },
    {
      heading: `How to practice on ${market.shortName}`,
      paragraphs: [
        `Mark your higher-timeframe bias on ${market.shortName}, focus on the ${market.session}, then apply the ${lesson.sectionTitle} concepts from this lesson before every entry.`,
        `Journal each setup — context, trigger, stop, target, and outcome. After 20–30 reps you will know whether this lesson fits your ${market.shortName} playbook.`,
      ],
    },
    {
      heading: "Free preview → full lesson unlock",
      paragraphs: [
        `Every visitor can preview the first section free. Create a Quicksilver profile to track progress — Free tier unlocks 1 lesson, Tier 1 ($24.99) unlocks 2, Premium Quant ($199.99) unlocks all ${PUBLIC_LESSONS.length} lessons plus six planning modules.`,
        `Pair this lesson with the ${tool?.name ?? "QS Planning Module"} for institutional-grade scoring, risk planning, and prop firm survival simulations.`,
      ],
    },
  ];

  const faqs = [
    {
      question: `Is the ${market.shortName} ${lesson.title} lesson free?`,
      answer: `Yes — you can preview this lesson for free. Full access depends on your Quicksilver tier. Premium unlocks the complete ${lesson.categoryTitle} library.`,
    },
    {
      question: `What session is best for ${lesson.title} on ${market.shortName}?`,
      answer: `Most ${market.shortName} traders align this lesson with the ${market.session} when liquidity and volatility match their playbook.`,
    },
    {
      question: `Does Quicksilver execute trades on ${market.name}?`,
      answer: "No. Quicksilver is manual-trading education and planning software. You analyze and execute on any broker or charting platform.",
    },
  ];

  return {
    slug,
    title,
    metaDescription,
    h1,
    market,
    lessonSlug: lesson.slug,
    lessonTitle: lesson.title,
    categoryTitle: lesson.categoryTitle,
    demo,
    toolSlug: lesson.relatedToolSlug,
    intro,
    sections,
    faqs,
    relatedSlugs: [],
    publishedAt: "2026-06-01",
  };
}

function attachRelatedSlugs(pages: LessonLandingPage[]): LessonLandingPage[] {
  const byMarket = new Map<string, LessonLandingPage[]>();
  const byLesson = new Map<string, LessonLandingPage[]>();

  for (const page of pages) {
    const marketList = byMarket.get(page.market.slug) ?? [];
    marketList.push(page);
    byMarket.set(page.market.slug, marketList);

    const lessonList = byLesson.get(page.lessonSlug) ?? [];
    lessonList.push(page);
    byLesson.set(page.lessonSlug, lessonList);
  }

  return pages.map((page) => {
    const related = new Set<string>();

    for (const p of byMarket.get(page.market.slug) ?? []) {
      if (p.slug !== page.slug && p.lessonSlug !== page.lessonSlug) {
        related.add(p.slug);
      }
    }
    for (const p of byLesson.get(page.lessonSlug) ?? []) {
      if (p.slug !== page.slug) related.add(p.slug);
    }

    return {
      ...page,
      relatedSlugs: Array.from(related).slice(0, 6),
    };
  });
}

function buildAllLessonLandingPages(): LessonLandingPage[] {
  const pages: LessonLandingPage[] = [];
  const markets = getLessonLandingMarkets();

  for (const market of markets) {
    for (const lesson of PUBLIC_LESSONS) {
      pages.push(buildMarketLessonPage(market, lesson));
    }
  }

  return attachRelatedSlugs(pages);
}

export const LESSON_LANDING_PAGES = buildAllLessonLandingPages();

export const LESSON_LANDING_COUNT = LESSON_LANDING_PAGES.length;

export function getLessonLandingPageBySlug(
  slug: string
): LessonLandingPage | undefined {
  return LESSON_LANDING_PAGES.find((p) => p.slug === slug);
}

export function getLessonLandingPagesByMarket(
  marketSlug: string
): LessonLandingPage[] {
  return LESSON_LANDING_PAGES.filter((p) => p.market.slug === marketSlug);
}

export function getLessonLandingPagesForLesson(
  lessonSlug: string
): LessonLandingPage[] {
  return LESSON_LANDING_PAGES.filter((p) => p.lessonSlug === lessonSlug);
}