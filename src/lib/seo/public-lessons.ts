import { ACADEMY_CATEGORIES } from "@/lib/academy/content";
import type { AcademyLesson } from "@/lib/academy/types";
import { TOOLS } from "@/lib/tools-registry";

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
  if (!lesson) return undefined;
  return TOOLS.find((t) => t.slug === lesson.relatedToolSlug);
}

export interface ChartingGuide {
  slug: string;
  title: string;
  description: string;
  sectionCount: number;
  lessonCount: number;
  highlights: string[];
  faqs: { question: string; answer: string }[];
}

export const CHARTING_GUIDES: ChartingGuide[] = ACADEMY_CATEGORIES.map(
  (cat) => ({
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
        question: `Do I need a paid subscription to read ${cat.title}?`,
        answer:
          "No. All charting guides and lessons are free. Premium unlocks interactive QS Planning Modules for setup scoring, risk planning, and trade planning.",
      },
    ],
  })
);

export function getGuideBySlug(slug: string): ChartingGuide | undefined {
  return CHARTING_GUIDES.find((g) => g.slug === slug);
}

export function getLessonsForGuide(guideSlug: string): PublicLesson[] {
  return PUBLIC_LESSONS.filter((l) => l.categoryId === guideSlug);
}