import type { Metadata } from "next";
import type { SeoLandingPage } from "@/lib/seo/landing-pages";
import type { LessonLandingPage } from "@/lib/seo/lesson-landing-pages";
import type { PromoLandingPage } from "@/lib/seo/promo-landing-pages";
import { SEO_LANDING_PAGES } from "@/lib/seo/landing-pages";
import { LESSON_LANDING_PAGES } from "@/lib/seo/lesson-landing-pages";
import { PROMO_LANDING_PAGES } from "@/lib/seo/promo-landing-pages";

/** High-volume markets — used to cap learn landing indexing */
export const INDEXABLE_MARKET_SLUGS = new Set([
  "xauusd",
  "nas100",
  "eurusd",
  "gbpusd",
  "usdjpy",
  "btcusd",
  "spx500",
  "us30",
  "oil-wti",
  "ethusd",
  "ger40",
  "audusd",
]);

export function isIndexableMarket(slug: string | null | undefined): boolean {
  return slug != null && INDEXABLE_MARKET_SLUGS.has(slug);
}

/**
 * Core solution pages only — ranking quality over volume.
 * Mass thin long-tail diluted average position (~55); keep high-intent combos.
 */
export function isIndexableSolution(page: SeoLandingPage): boolean {
  if (page.timeframe) return false;
  if (page.propFirm && page.market) return false;

  // Prop firm × topic: only challenge-critical topics
  if (page.propFirm && page.topic && !page.market) {
    return ["prop-firm-challenge", "prop-firm-consistency", "risk-management"].includes(
      page.topic.slug
    );
  }

  // Market × topic: high-volume markets only
  if (page.market && page.topic) {
    return isIndexableMarket(page.market.slug);
  }

  // Topic-only or market-only hubs
  return true;
}

export function isIndexableLearn(page: LessonLandingPage): boolean {
  if (page.variant === "prop-firm") return false;
  // Only top markets — reduce thin learn URLs in the index
  return isIndexableMarket(page.market?.slug);
}

/** Money pages only — bundles & deal hubs, not 15k promo duplicates */
export function isIndexableOffer(page: PromoLandingPage): boolean {
  return (
    page.variant === "bundle" ||
    page.variant === "topic-deal" ||
    page.variant === "market-deal" ||
    page.variant === "prop-deal"
  );
}

export const INDEXABLE_SOLUTION_PAGES = SEO_LANDING_PAGES.filter(isIndexableSolution);
export const INDEXABLE_LEARN_PAGES = LESSON_LANDING_PAGES.filter(isIndexableLearn);
export const INDEXABLE_OFFER_PAGES = PROMO_LANDING_PAGES.filter(isIndexableOffer);

export const NOINDEX_SOLUTION_COUNT =
  SEO_LANDING_PAGES.length - INDEXABLE_SOLUTION_PAGES.length;
export const NOINDEX_LEARN_COUNT =
  LESSON_LANDING_PAGES.length - INDEXABLE_LEARN_PAGES.length;
export const NOINDEX_OFFER_COUNT =
  PROMO_LANDING_PAGES.length - INDEXABLE_OFFER_PAGES.length;

export const TOTAL_INDEXABLE_PROGRAMMATIC =
  INDEXABLE_SOLUTION_PAGES.length +
  INDEXABLE_LEARN_PAGES.length +
  INDEXABLE_OFFER_PAGES.length;

export const TOTAL_NOINDEX_PROGRAMMATIC =
  NOINDEX_SOLUTION_COUNT + NOINDEX_LEARN_COUNT + NOINDEX_OFFER_COUNT;

export function pageRobotsMetadata(indexable: boolean): Pick<Metadata, "robots"> {
  if (indexable) return {};
  return { robots: { index: false, follow: true } };
}