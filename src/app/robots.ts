import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quicksilveralgo.com";

/**
 * Keep crawl rules simple. Explicit Allow lists without a root allow can confuse
 * some bots; default-allow + targeted disallow is the standard SEO pattern.
 */
const DISALLOW = [
  "/api/",
  "/admin",
  "/admin/",
  "/dashboard",
  "/dashboard/",
  "/onboarding",
  "/onboarding/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/icon.png", "/apple-icon.png", "/"],
        disallow: DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL.replace(/^https?:\/\//, ""),
  };
}
