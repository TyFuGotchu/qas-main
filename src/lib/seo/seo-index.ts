import { LESSON_LANDING_COUNT } from "@/lib/seo/lesson-landing-pages";
import { SEO_LANDING_COUNT } from "@/lib/seo/landing-pages";
import { CHARTING_GUIDES, PUBLIC_LESSONS } from "@/lib/seo/public-lessons";

export const TOTAL_SEO_LANDING_PAGES =
  SEO_LANDING_COUNT + LESSON_LANDING_COUNT;

export const TOTAL_INDEXED_CONTENT_PAGES =
  TOTAL_SEO_LANDING_PAGES +
  PUBLIC_LESSONS.length +
  CHARTING_GUIDES.length;