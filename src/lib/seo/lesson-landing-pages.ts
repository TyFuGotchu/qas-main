import { TOOLS } from "@/lib/tools-registry";
import {
  SEO_PROP_FIRMS,
  getLessonLandingMarkets,
  type SeoMarket,
  type SeoPropFirm,
} from "@/lib/seo/landing-data";
import { toolSlugToDemo } from "@/lib/seo/seo-demo";
import type { LandingDemoType } from "@/lib/seo/landing-data";
import { PUBLIC_LESSONS, type PublicLesson } from "@/lib/seo/public-lessons";

export type LessonLandingVariant = "market" | "prop-firm";

export interface LessonLandingPage {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  variant: LessonLandingVariant;
  market: SeoMarket | null;
  propFirm: SeoPropFirm | null;
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
    variant: "market",
    market,
    propFirm: null,
    lessonSlug: lesson.slug,
    lessonTitle: lesson.title,
    categoryTitle: lesson.categoryTitle,
    demo,
    toolSlug: lesson.relatedToolSlug,
    intro,
    sections,
    faqs,
    relatedSlugs: [],
    publishedAt: "2026-06-15",
  };
}

function buildPropFirmLessonPage(
  propFirm: SeoPropFirm,
  lesson: PublicLesson
): LessonLandingPage {
  const slug = `${propFirm.slug}-${lesson.slug}`;
  const tool = TOOLS.find((t) => t.slug === lesson.relatedToolSlug);
  const demo = toolSlugToDemo(lesson.relatedToolSlug);

  const title = `${propFirm.shortName} ${lesson.title} — Prop Firm Lesson Guide | Quicksilver`;
  const metaDescription = `${propFirm.name} traders: learn ${lesson.title.toLowerCase()} with free preview, ${lesson.categoryTitle} workflow, and ${tool?.shortName ?? "planning"} demo. Rules: ${propFirm.profitTarget}.`;
  const h1 = `${lesson.title} for ${propFirm.shortName} Traders`;

  const intro = `Challengers preparing for ${propFirm.name} use ${lesson.title.toLowerCase()} to build repeatable edge while respecting ${propFirm.profitTarget}, ${propFirm.maxDrawdown}, and ${propFirm.consistencyRule.toLowerCase()}. This guide previews the Chart Academy lesson "${lesson.title}" with a free demo and prop-aware workflow.`;

  const sections = [
    {
      heading: `Why ${lesson.title} matters for ${propFirm.shortName}`,
      paragraphs: [
        `${lesson.summary} Prop traders who skip structured ${lesson.categoryTitle.toLowerCase()} training often violate consistency or daily loss rules before they find an edge.`,
        `Preview the lesson below, then upgrade to Premium for the full module and ${tool?.name ?? "QS planning tools"}.`,
      ],
    },
    {
      heading: `${propFirm.shortName} rules reminder`,
      paragraphs: [
        `Profit target: ${propFirm.profitTarget}. Max drawdown: ${propFirm.maxDrawdown}. Daily loss: ${propFirm.dailyLossLimit}. Consistency: ${propFirm.consistencyRule}.`,
        `Apply ${lesson.sectionTitle} concepts in a journal — track win rate, R:R, and best-day share of total profit before scaling size.`,
      ],
    },
    {
      heading: "Free preview → funded trader path",
      paragraphs: [
        `Pair Chart Academy with Prop Survival simulations to stress-test your plan before paying challenge fees. Premium Quant unlocks all lessons and six planning modules.`,
      ],
    },
  ];

  const faqs = [
    {
      question: `Is this ${propFirm.shortName} lesson guide free?`,
      answer: "Yes. Preview content is free. Full lesson access depends on your Quicksilver subscription tier.",
    },
    {
      question: `Does ${lesson.title} help with ${propFirm.name} challenges?`,
      answer: "Strong chart literacy and planning discipline improve consistency — critical for prop firm profit targets and payout rules.",
    },
    {
      question: "Does Quicksilver guarantee a prop firm pass?",
      answer: "No. Quicksilver provides education and planning tools. You execute trades yourself on any platform.",
    },
  ];

  return {
    slug,
    title,
    metaDescription,
    h1,
    variant: "prop-firm",
    market: null,
    propFirm,
    lessonSlug: lesson.slug,
    lessonTitle: lesson.title,
    categoryTitle: lesson.categoryTitle,
    demo,
    toolSlug: lesson.relatedToolSlug,
    intro,
    sections,
    faqs,
    relatedSlugs: [],
    publishedAt: "2026-06-15",
  };
}

function attachRelatedSlugs(pages: LessonLandingPage[]): LessonLandingPage[] {
  const byMarket = new Map<string, LessonLandingPage[]>();
  const byPropFirm = new Map<string, LessonLandingPage[]>();
  const byLesson = new Map<string, LessonLandingPage[]>();

  for (const page of pages) {
    if (page.market) {
      const marketList = byMarket.get(page.market.slug) ?? [];
      marketList.push(page);
      byMarket.set(page.market.slug, marketList);
    }
    if (page.propFirm) {
      const firmList = byPropFirm.get(page.propFirm.slug) ?? [];
      firmList.push(page);
      byPropFirm.set(page.propFirm.slug, firmList);
    }
    const lessonList = byLesson.get(page.lessonSlug) ?? [];
    lessonList.push(page);
    byLesson.set(page.lessonSlug, lessonList);
  }

  return pages.map((page) => {
    const related = new Set<string>();

    if (page.market) {
      for (const p of byMarket.get(page.market.slug) ?? []) {
        if (p.slug !== page.slug && p.lessonSlug !== page.lessonSlug) {
          related.add(p.slug);
        }
      }
    }
    if (page.propFirm) {
      for (const p of byPropFirm.get(page.propFirm.slug) ?? []) {
        if (p.slug !== page.slug && p.lessonSlug !== page.lessonSlug) {
          related.add(p.slug);
        }
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

  for (const propFirm of SEO_PROP_FIRMS) {
    for (const lesson of PUBLIC_LESSONS) {
      pages.push(buildPropFirmLessonPage(propFirm, lesson));
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
  return LESSON_LANDING_PAGES.filter((p) => p.market?.slug === marketSlug);
}

export function getLessonLandingPagesByPropFirm(
  propFirmSlug: string
): LessonLandingPage[] {
  return LESSON_LANDING_PAGES.filter((p) => p.propFirm?.slug === propFirmSlug);
}

export function getLessonLandingPagesForLesson(
  lessonSlug: string
): LessonLandingPage[] {
  return LESSON_LANDING_PAGES.filter((p) => p.lessonSlug === lessonSlug);
}