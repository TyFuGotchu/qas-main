import { ACADEMY_CATEGORIES } from "@/lib/academy/content";
import { PROP_FIRM_ONE_WEEK_GUIDE } from "@/lib/academy/content/prop-firm-one-week";
import type { AcademyLesson } from "@/lib/academy/types";
import { TOOLS } from "@/lib/tools-registry";

export { PROP_FIRM_ONE_WEEK_GUIDE };

export interface PublicLesson {
  slug: string;
  title: string;
  summary: string;
  categoryId: string;
  categoryTitle: string;
  sectionId: string;
  sectionTitle: string;
  lesson: AcademyLesson;
  relatedToolSlug: string;
  faqs: { question: string; answer: string }[];
  publishedAt: string;
}

const CATEGORY_TOOL_MAP: Record<string, string> = {
  "chart-reading": "edge-confluence",
  candlesticks: "edge-confluence",
  "trading-styles": "regime-oracle",
  fibonacci: "execution-protocol",
  "market-structure": "regime-oracle",
};

const LESSON_TOOL_OVERRIDES: Record<string, string> = {
  "prop-firm-one-week": "prop-survival",
  "prop-firm": "prop-survival",
  journal: "alpha-durability",
  risk: "risk-matrix",
  kelly: "risk-matrix",
  monte: "prop-survival",
};

function resolveToolSlug(categoryId: string, lessonId: string): string {
  for (const [key, slug] of Object.entries(LESSON_TOOL_OVERRIDES)) {
    if (lessonId.includes(key)) return slug;
  }
  return CATEGORY_TOOL_MAP[categoryId] ?? "edge-confluence";
}

function buildFaqs(lesson: AcademyLesson, categoryTitle: string) {
  return [
    {
      question: `What is ${lesson.title} in manual trading?`,
      answer: lesson.summary,
    },
    {
      question: `How do I apply ${lesson.title} on my charting platform?`,
      answer:
        lesson.manualTips?.[0] ??
        `Study ${lesson.title} on a clean chart in the ${categoryTitle} category before risking capital.`,
    },
    {
      question: `Is ${lesson.title} suitable for beginners?`,
      answer: `This lesson is rated ${lesson.difficulty ?? "beginner"} level and is designed for manual traders on any broker or platform.`,
    },
  ];
}

function buildAllLessons(): PublicLesson[] {
  const lessons: PublicLesson[] = [];

  for (const category of ACADEMY_CATEGORIES) {
    for (const section of category.sections) {
      for (const lesson of section.lessons) {
        const slug = `${category.id}-${lesson.id}`;
        lessons.push({
          slug,
          title: lesson.title,
          summary: lesson.summary,
          categoryId: category.id,
          categoryTitle: category.title,
          sectionId: section.id,
          sectionTitle: section.title,
          lesson,
          relatedToolSlug: resolveToolSlug(category.id, lesson.id),
          faqs: buildFaqs(lesson, category.title),
          publishedAt: "2026-01-15",
        });
      }
    }
  }

  return lessons;
}

export const PUBLIC_LESSONS = buildAllLessons();

export function getLessonBySlug(slug: string): PublicLesson | undefined {
  return PUBLIC_LESSONS.find((l) => l.slug === slug);
}

export function getRelatedTool(slug: string) {
  const lesson = getLessonBySlug(slug);
  if (lesson) {
    return TOOLS.find((t) => t.slug === lesson.relatedToolSlug);
  }
  for (const [key, toolSlug] of Object.entries(LESSON_TOOL_OVERRIDES)) {
    if (slug === key || slug.includes(key)) {
      return TOOLS.find((t) => t.slug === toolSlug);
    }
  }
  return undefined;
}

export interface ChartingGuide {
  slug: string;
  title: string;
  description: string;
  sectionCount: number;
  lessonCount: number;
  highlights: string[];
  faqs: { question: string; answer: string }[];
  featured?: boolean;
  badge?: string;
}

const CATEGORY_GUIDES: ChartingGuide[] = ACADEMY_CATEGORIES.map((cat) => ({
  slug: cat.id,
  title: cat.title,
  description: cat.description,
  sectionCount: cat.sections.length,
  lessonCount: cat.sections.reduce((n, s) => n + s.lessons.length, 0),
  highlights: cat.sections.map((s) => s.title),
  faqs: [
    {
      question: `What will I learn in the ${cat.title} guide?`,
      answer: cat.description,
    },
    {
      question: `How many lessons are in ${cat.title}?`,
      answer: `${cat.sections.length} sections with ${cat.sections.reduce((n, s) => n + s.lessons.length, 0)} in-depth lessons for manual traders.`,
    },
    {
      question: `Who can access the ${cat.title} guide?`,
      answer:
        "Preview any guide for free (first 300 words). Free tier unlocks 1 guide; Premium ($149.99/mo) unlocks the full library.",
    },
  ],
}));

const PROP_FIRM_GUIDE_ENTRY: ChartingGuide = {
  slug: PROP_FIRM_ONE_WEEK_GUIDE.slug,
  title: PROP_FIRM_ONE_WEEK_GUIDE.title,
  description: PROP_FIRM_ONE_WEEK_GUIDE.description,
  sectionCount: 1,
  lessonCount: 7,
  highlights: PROP_FIRM_ONE_WEEK_GUIDE.dailyPlans.map(
    (d) => `Day ${d.day}: ${d.title}`
  ),
  faqs: PROP_FIRM_ONE_WEEK_GUIDE.faqs,
  featured: true,
  badge: "Prop Challenge",
};

export const CHARTING_GUIDES: ChartingGuide[] = [
  PROP_FIRM_GUIDE_ENTRY,
  ...CATEGORY_GUIDES,
];

export function getGuideBySlug(slug: string): ChartingGuide | undefined {
  return CHARTING_GUIDES.find((g) => g.slug === slug);
}

export function getLessonsForGuide(guideSlug: string): PublicLesson[] {
  return PUBLIC_LESSONS.filter((l) => l.categoryId === guideSlug);
}