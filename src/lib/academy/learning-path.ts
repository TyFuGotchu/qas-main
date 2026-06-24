import {
  FREEMIUM_RESOURCES,
  getRequiredTierForResource,
  getTierRank,
} from "@/lib/accessControl";
import { PREMIUM_PRICE } from "@/lib/pricing-tiers";
import type { SubscriptionTier } from "@/types";

export type LearningPathItemType = "lesson" | "guide" | "tool";

export interface LearningPathItem {
  id: string;
  type: LearningPathItemType;
  slug: string;
  title: string;
  subtitle: string;
  requiredTier: SubscriptionTier;
  href: string;
}

export const CURATED_LEARNING_PATH: LearningPathItem[] = [
  {
    id: "path-1",
    type: "lesson",
    slug: FREEMIUM_RESOURCES.lessons.free,
    title: "What Is Price Action?",
    subtitle: "Start here — free forever",
    requiredTier: "FREE",
    href: `/lessons/${FREEMIUM_RESOURCES.lessons.free}`,
  },
  {
    id: "path-2",
    type: "tool",
    slug: FREEMIUM_RESOURCES.tools.free,
    title: "Setup Scorer Demo",
    subtitle: "Score your first setup free",
    requiredTier: "FREE",
    href: `/dashboard/tools/${FREEMIUM_RESOURCES.tools.free}`,
  },
  {
    id: "path-3",
    type: "guide",
    slug: FREEMIUM_RESOURCES.guides.free,
    title: "Chart Reading Guide",
    subtitle: "18 lessons on reading charts",
    requiredTier: "FREE",
    href: `/guides/${FREEMIUM_RESOURCES.guides.free}`,
  },
  {
    id: "path-4",
    type: "lesson",
    slug: "chart-reading-reading-candle-components",
    title: "Reading Candle Components",
    subtitle: `Premium (${PREMIUM_PRICE}/mo)`,
    requiredTier: "TIER_2",
    href: "/lessons/chart-reading-reading-candle-components",
  },
  {
    id: "path-5",
    type: "tool",
    slug: "risk-matrix",
    title: "Risk Matrix",
    subtitle: "Size positions with portfolio heat",
    requiredTier: "TIER_2",
    href: "/dashboard/tools/risk-matrix",
  },
  {
    id: "path-6",
    type: "guide",
    slug: "candlesticks",
    title: "Candlesticks Guide",
    subtitle: "19 pattern lessons",
    requiredTier: "TIER_2",
    href: "/guides/candlesticks",
  },
  {
    id: "path-7",
    type: "lesson",
    slug: "candlesticks-doji",
    title: "Doji Patterns",
    subtitle: "Animated walkthrough + live chart",
    requiredTier: getRequiredTierForResource("lesson", "candlesticks-doji"),
    href: "/lessons/candlesticks-doji",
  },
  {
    id: "path-8",
    type: "lesson",
    slug: "market-structure-what-is-bos",
    title: "Break of Structure",
    subtitle: "Core SMC concept",
    requiredTier: getRequiredTierForResource("lesson", "market-structure-what-is-bos"),
    href: "/lessons/market-structure-what-is-bos",
  },
  {
    id: "path-9",
    type: "lesson",
    slug: "fibonacci-fib-basics",
    title: "Fibonacci Basics",
    subtitle: "Golden pocket entries",
    requiredTier: getRequiredTierForResource("lesson", "fibonacci-fib-basics"),
    href: "/lessons/fibonacci-fib-basics",
  },
  {
    id: "path-10",
    type: "tool",
    slug: "prop-survival",
    title: "Prop Survival Engine",
    subtitle: "Monte Carlo challenge sim",
    requiredTier: "TIER_2",
    href: "/dashboard/tools/prop-survival",
  },
  {
    id: "path-11",
    type: "guide",
    slug: "prop-firm-one-week",
    title: "Prop Firm 1-Week Playbook",
    subtitle: "7-day challenge plan",
    requiredTier: getRequiredTierForResource("guide", "prop-firm-one-week"),
    href: "/guides/prop-firm-one-week",
  },
];

export function getNextPathStep(
  completedSlugs: string[],
  userTier: SubscriptionTier
): LearningPathItem | undefined {
  const tierRank = getTierRank(userTier);
  const requiredRank = (t: SubscriptionTier) => getTierRank(t);

  for (const item of CURATED_LEARNING_PATH) {
    const done =
      completedSlugs.includes(item.slug) ||
      completedSlugs.includes(item.href);
    if (!done && requiredRank(item.requiredTier) <= tierRank) {
      return item;
    }
  }

  return CURATED_LEARNING_PATH.find(
    (item) =>
      !completedSlugs.includes(item.slug) &&
      requiredRank(item.requiredTier) > tierRank
  );
}

export function getPathProgress(completedSlugs: string[]): {
  completed: number;
  total: number;
  percent: number;
} {
  const total = CURATED_LEARNING_PATH.length;
  const completed = CURATED_LEARNING_PATH.filter((item) =>
    completedSlugs.includes(item.slug)
  ).length;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}