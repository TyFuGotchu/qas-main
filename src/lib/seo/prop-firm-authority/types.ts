import type { ClusterFormat, ClusterTopicSlug } from "@/lib/seo/prop-firm-authority/data";

export interface AuthoritySection {
  heading: string;
  level: 2 | 3 | 4;
  paragraphs: string[];
  listItems?: string[];
  orderedItems?: string[];
}

export interface PropFirmClusterPage {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  directAnswer: string;
  format: ClusterFormat;
  topic: ClusterTopicSlug;
  firmSlug: string;
  firmName: string;
  sizeSlug: string | null;
  sizeLabel: string | null;
  toolSlug: string;
  intro: string;
  sections: AuthoritySection[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
  publishedAt: string;
}

export interface PillarPage {
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