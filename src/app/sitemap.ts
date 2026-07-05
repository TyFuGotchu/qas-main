import type { MetadataRoute } from "next";
import { CHARTING_GUIDES, PUBLIC_LESSONS } from "@/lib/seo/public-lessons";
import {
  INDEXABLE_LEARN_PAGES,
  INDEXABLE_OFFER_PAGES,
  INDEXABLE_SOLUTION_PAGES,
} from "@/lib/seo/indexing-tiers";
import { LOCAL_TOOLS } from "@/lib/tools-registry";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quicksilveralgo.com";

const SITEMAP_IDS = {
  core: 0,
  solutions: 1,
  learn: 2,
} as const;

export async function generateSitemaps() {
  return [
    { id: SITEMAP_IDS.core },
    { id: SITEMAP_IDS.solutions },
    { id: SITEMAP_IDS.learn },
  ];
}

function coreSitemapEntries(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/launch`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.98 },
    { url: `${SITE_URL}/lessons`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/solutions`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/offers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.92 },
    { url: `${SITE_URL}/tools/local`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/support`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/onboarding/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const lessonPages: MetadataRoute.Sitemap = PUBLIC_LESSONS.map((lesson) => ({
    url: `${SITE_URL}/lessons/${lesson.slug}`,
    lastModified: new Date(lesson.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const guidePages: MetadataRoute.Sitemap = CHARTING_GUIDES.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const offerPages: MetadataRoute.Sitemap = INDEXABLE_OFFER_PAGES.map((page) => ({
    url: `${SITE_URL}/offers/${page.slug}`,
    lastModified: new Date(page.publishedAt),
    changeFrequency: "weekly" as const,
    priority: page.variant === "bundle" ? 0.95 : 0.82,
  }));

  const localToolPages: MetadataRoute.Sitemap = LOCAL_TOOLS.map((tool) => ({
    url: `${SITE_URL}${tool.publicHref}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.88,
  }));

  return [...staticPages, ...localToolPages, ...guidePages, ...lessonPages, ...offerPages];
}

export default function sitemap({
  id,
}: {
  id: number;
}): MetadataRoute.Sitemap {
  if (id === SITEMAP_IDS.core) {
    return coreSitemapEntries();
  }

  if (id === SITEMAP_IDS.solutions) {
    return INDEXABLE_SOLUTION_PAGES.map((page) => ({
      url: `${SITE_URL}/solutions/${page.slug}`,
      lastModified: new Date(page.publishedAt),
      changeFrequency: "monthly" as const,
      priority: page.market && page.propFirm === null ? 0.78 : 0.72,
    }));
  }

  if (id === SITEMAP_IDS.learn) {
    return INDEXABLE_LEARN_PAGES.map((page) => ({
      url: `${SITE_URL}/learn/${page.slug}`,
      lastModified: new Date(page.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  }

  return [];
}