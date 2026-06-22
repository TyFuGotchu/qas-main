import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quicksilveralgo.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: [
        "/lessons",
        "/guides",
        "/dashboard",
        "/dashboard/tools",
        "/api/",
        "/admin",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}