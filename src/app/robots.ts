import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quicksilveralgo.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/lessons",
        "/lessons/",
        "/guides",
        "/guides/",
        "/solutions",
        "/solutions/",
        "/learn",
        "/learn/",
        "/offers",
        "/offers/",
        "/support",
        "/faq",
      ],
      disallow: ["/dashboard/tools", "/api/", "/admin"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}