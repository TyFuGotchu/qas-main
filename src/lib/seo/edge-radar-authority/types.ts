import type { EdgeRadarSportId } from "@/lib/edge-radar";

export type EdgeRadarClusterVariant = "sport" | "topic" | "sport-book";

export interface AuthoritySection {
  heading: string;
  level: 2 | 3 | 4;
  paragraphs: string[];
  listItems?: string[];
  orderedItems?: string[];
}

export interface EdgeRadarClusterPage {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  directAnswer: string;
  variant: EdgeRadarClusterVariant;
  sportId: EdgeRadarSportId | null;
  sportLabel: string | null;
  topicSlug: string | null;
  bookSlug: string | null;
  bookName: string | null;
  intro: string;
  sections: AuthoritySection[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
  publishedAt: string;
  keywords: string[];
}

export interface EdgeRadarPillarPage {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  directAnswer: string;
  sections: AuthoritySection[];
  faqs: { question: string; answer: string }[];
  relatedClusterSlugs: string[];
  publishedAt: string;
}