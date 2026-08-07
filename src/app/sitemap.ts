import type { MetadataRoute } from "next";
import { CHARTING_GUIDES, PUBLIC_LESSONS } from "@/lib/seo/public-lessons";
import {
  INDEXABLE_LEARN_PAGES,
  INDEXABLE_OFFER_PAGES,
  INDEXABLE_SOLUTION_PAGES,
} from "@/lib/seo/indexing-tiers";
import { LOCAL_TOOLS } from "@/lib/tools-registry";
import {
  PILLAR_PAGES,
  PROP_FIRM_CLUSTER_PAGES,
} from "@/lib/seo/prop-firm-authority";
import { SEO_RECOVERY_REFRESHED } from "@/lib/seo/money-pages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quicksilveralgo.com";

/** Money-page lastmod — bump with SEO_RECOVERY_REFRESHED on authority updates. */
const SITE_UPDATED = new Date(SEO_RECOVERY_REFRESHED);
/** Long-tail programmatic pages — slower churn signal. */
const PROGRAMMATIC_UPDATED = new Date("2026-07-20");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: SITE_UPDATED, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/launch`,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 0.99,
    },
    {
      url: `${SITE_URL}/quant-protocol`,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 0.98,
    },
    {
      url: `${SITE_URL}/guides/break-of-structure`,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 0.98,
    },
    {
      url: `${SITE_URL}/prop-firm`,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 0.96,
    },
    {
      url: `${SITE_URL}/offers`,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 0.92,
    },
    {
      url: `${SITE_URL}/tools/local`,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/lessons`,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/solutions`,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/learn`,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${SITE_URL}/support`,
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const localToolPages: MetadataRoute.Sitemap = LOCAL_TOOLS.map((tool) => ({
    url: `${SITE_URL}${tool.publicHref}`,
    lastModified: SITE_UPDATED,
    changeFrequency: "weekly" as const,
    priority: 0.88,
  }));

  const guidePages: MetadataRoute.Sitemap = CHARTING_GUIDES.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: SITE_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const lessonPages: MetadataRoute.Sitemap = PUBLIC_LESSONS.map((lesson) => ({
    url: `${SITE_URL}/lessons/${lesson.slug}`,
    lastModified: new Date(lesson.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const offerPages: MetadataRoute.Sitemap = INDEXABLE_OFFER_PAGES.map((page) => ({
    url: `${SITE_URL}/offers/${page.slug}`,
    lastModified: PROGRAMMATIC_UPDATED,
    changeFrequency: "monthly" as const,
    priority: page.variant === "bundle" ? 0.9 : 0.75,
  }));

  const solutionPages: MetadataRoute.Sitemap = INDEXABLE_SOLUTION_PAGES.map((page) => ({
    url: `${SITE_URL}/solutions/${page.slug}`,
    lastModified: PROGRAMMATIC_UPDATED,
    changeFrequency: "monthly" as const,
    priority: page.market && page.propFirm === null ? 0.72 : 0.65,
  }));

  const learnPages: MetadataRoute.Sitemap = INDEXABLE_LEARN_PAGES.map((page) => ({
    url: `${SITE_URL}/learn/${page.slug}`,
    lastModified: PROGRAMMATIC_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const pillarPages: MetadataRoute.Sitemap = PILLAR_PAGES.map((pillar) => ({
    url: `${SITE_URL}/guides/pillar/${pillar.slug}`,
    lastModified: SITE_UPDATED,
    changeFrequency: "weekly" as const,
    priority: 0.99,
  }));

  const clusterPages: MetadataRoute.Sitemap = PROP_FIRM_CLUSTER_PAGES.map((page) => ({
    url: `${SITE_URL}/prop-firm/${page.slug}`,
    lastModified: PROGRAMMATIC_UPDATED,
    changeFrequency: "monthly" as const,
    priority: page.topic === "pass-in-7-days" ? 0.88 : 0.78,
  }));

  return [
    ...staticPages,
    ...pillarPages,
    ...localToolPages,
    ...guidePages,
    ...lessonPages,
    ...offerPages,
    ...clusterPages,
    ...solutionPages,
    ...learnPages,
  ];
}
