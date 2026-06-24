import type { MetadataRoute } from "next";
import { SEO_LANDING_PAGES } from "@/lib/seo/landing-pages";
import { LESSON_LANDING_PAGES } from "@/lib/seo/lesson-landing-pages";
import { CHARTING_GUIDES, PUBLIC_LESSONS } from "@/lib/seo/public-lessons";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quicksilveralgo.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/lessons`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/solutions`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/onboarding/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const lessonPages: MetadataRoute.Sitemap = PUBLIC_LESSONS.map((lesson) => ({
    url: `${SITE_URL}/lessons/${lesson.slug}`,
    lastModified: new Date(lesson.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const guidePages: MetadataRoute.Sitemap = CHARTING_GUIDES.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const solutionPages: MetadataRoute.Sitemap = SEO_LANDING_PAGES.map((page) => ({
    url: `${SITE_URL}/solutions/${page.slug}`,
    lastModified: new Date(page.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const learnPages: MetadataRoute.Sitemap = LESSON_LANDING_PAGES.map((page) => ({
    url: `${SITE_URL}/learn/${page.slug}`,
    lastModified: new Date(page.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));

  return [...staticPages, ...guidePages, ...lessonPages, ...solutionPages, ...learnPages];
}