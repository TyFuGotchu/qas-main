/**
 * Founder personal profiles (TyFuGotchu) — used in footer, schema sameAs, social kit.
 * Keep URLs clean (no tracking query params).
 */

export const FOUNDER = {
  handle: "TyFuGotchu",
  displayName: "TyFuGotchu",
  role: "Founder of Quicksilver Algo Systems",
  shortBio: "Founder · Quicksilver Algo Systems",
} as const;

export type FounderSocialPlatform =
  | "x"
  | "tiktok"
  | "youtube"
  | "instagram";

export interface FounderSocialLink {
  id: FounderSocialPlatform;
  label: string;
  href: string;
  /** @handle style for captions */
  handle: string;
}

export const FOUNDER_SOCIAL_LINKS: FounderSocialLink[] = [
  {
    id: "x",
    label: "X (Twitter)",
    href: "https://x.com/tyfugotchu",
    handle: "@tyfugotchu",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@tyfugotchu",
    handle: "@tyfugotchu",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@tyfugotchu",
    handle: "@tyfugotchu",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/tyfugotchu",
    handle: "@tyfugotchu",
  },
];

/** Absolute profile URLs for Organization / Person schema sameAs */
export const FOUNDER_SAME_AS: string[] = FOUNDER_SOCIAL_LINKS.map((l) => l.href);
