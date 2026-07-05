import { CHARTING_GUIDES, PUBLIC_LESSONS } from "@/lib/seo/public-lessons";
import {
  TOTAL_INDEXABLE_PROGRAMMATIC,
  TOTAL_NOINDEX_PROGRAMMATIC,
} from "@/lib/seo/indexing-tiers";
import { LESSON_LANDING_COUNT } from "@/lib/seo/lesson-landing-pages";
import { PROMO_LANDING_COUNT } from "@/lib/seo/promo-landing-pages";
import { SEO_LANDING_COUNT } from "@/lib/seo/landing-pages";
import { LOCAL_TOOLS } from "@/lib/tools-registry";

export const TOTAL_SEO_LANDING_PAGES =
  SEO_LANDING_COUNT + LESSON_LANDING_COUNT + PROMO_LANDING_COUNT;

export const TOTAL_INDEXED_CONTENT_PAGES =
  TOTAL_INDEXABLE_PROGRAMMATIC +
  PUBLIC_LESSONS.length +
  CHARTING_GUIDES.length;

export const TOTAL_NOINDEX_CONTENT_PAGES = TOTAL_NOINDEX_PROGRAMMATIC;

export const SITEMAP_URL_COUNT =
  TOTAL_INDEXABLE_PROGRAMMATIC +
  PUBLIC_LESSONS.length +
  CHARTING_GUIDES.length +
  13 +
  LOCAL_TOOLS.length;