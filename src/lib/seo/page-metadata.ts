import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://quicksilveralgo.com";

/** Content freshness signal for Google (update when money pages materially improve). */
export const SEO_CONTENT_REFRESHED = "2026-08-03";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL.replace(/\/$/, "")}${normalized}`;
}

/**
 * Metadata for commercial / ranking-priority pages.
 * - Absolute title (avoids template dilution)
 * - Self-referencing canonical
 * - Indexable robots + large snippets
 * - OG/Twitter cards for share + discovery
 */
export function rankingPageMetadata(params: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedAt?: string;
  modifiedAt?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(params.path);
  const title = params.title.slice(0, 70);
  const description = params.description.slice(0, 160);
  const modified = params.modifiedAt ?? params.publishedAt ?? SEO_CONTENT_REFRESHED;

  return {
    title: { absolute: title },
    description,
    keywords: params.keywords,
    alternates: { canonical: url },
    robots: params.noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: params.type ?? "website",
      url,
      title,
      description,
      siteName: "Quicksilver Algo Systems",
      locale: "en_US",
      images: [
        {
          url: absoluteUrl("/icon.png"),
          width: 512,
          height: 512,
          alt: "Quicksilver Algo Systems",
        },
      ],
      ...(params.publishedAt ? { publishedTime: params.publishedAt } : {}),
      ...(modified ? { modifiedTime: modified } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/icon.png")],
    },
  };
}
