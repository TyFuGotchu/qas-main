import { PROP_FIRM_ONE_WEEK_GUIDE } from "@/lib/academy/content/prop-firm-one-week";
import { prisma } from "@/lib/prisma";
import { getToolBySlug } from "@/lib/tools-registry";

export type PlaybookStatus = "not_started" | "active" | "completed" | "paused";

export const PLAYBOOK_TOTAL_DAYS = PROP_FIRM_ONE_WEEK_GUIDE.dailyPlans.length;

export const PLAYBOOK_DAY_TOOLS: Record<number, string[]> = {
  1: ["edge-confluence", "risk-matrix"],
  2: ["edge-confluence", "compounding-matrix"],
  3: ["regime-oracle", "prop-survival"],
  4: ["prop-survival", "alpha-durability"],
  5: ["edge-confluence", "risk-matrix"],
  6: ["risk-matrix", "execution-protocol"],
  7: ["prop-survival", "expectancy-validator"],
};

export function parseCompletedDays(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((d): d is number => typeof d === "number" && d >= 1 && d <= 7);
}

export function getDayPlan(day: number) {
  return PROP_FIRM_ONE_WEEK_GUIDE.dailyPlans.find((d) => d.day === day) ?? null;
}

export function getDayToolLinks(day: number) {
  const slugs = PLAYBOOK_DAY_TOOLS[day] ?? [];
  return slugs
    .map((slug) => {
      const tool = getToolBySlug(slug);
      if (!tool) return null;
      return { slug, name: tool.shortName, href: tool.href };
    })
    .filter(Boolean) as { slug: string; name: string; href: string }[];
}

export function computePlaybookPercentComplete(completedDays: number[]): number {
  return Math.round((completedDays.length / PLAYBOOK_TOTAL_DAYS) * 100);
}

export async function getPlaybookProgress(userId: string) {
  return prisma.propFirmPlaybookProgress.findUnique({ where: { userId } });
}

export async function ensurePlaybookProgress(userId: string) {
  const existing = await getPlaybookProgress(userId);
  if (existing) return existing;

  return prisma.propFirmPlaybookProgress.create({
    data: { userId },
  });
}

export async function startPlaybookChallenge(userId: string) {
  const now = new Date();
  const progress = await prisma.propFirmPlaybookProgress.upsert({
    where: { userId },
    create: {
      userId,
      status: "active",
      currentDay: 1,
      startedAt: now,
      lastActiveAt: now,
    },
    update: {
      status: "active",
      currentDay: 1,
      completedDays: [],
      startedAt: now,
      completedAt: null,
      lastActiveAt: now,
    },
  });

  return progress;
}

export async function completePlaybookDay(userId: string, day: number) {
  const progress = await ensurePlaybookProgress(userId);
  const completed = parseCompletedDays(progress.completedDays);

  if (!completed.includes(day)) {
    completed.push(day);
    completed.sort((a, b) => a - b);
  }

  const allDone = completed.length >= PLAYBOOK_TOTAL_DAYS;
  const nextDay = Math.min(day + 1, PLAYBOOK_TOTAL_DAYS);
  const status: PlaybookStatus = allDone ? "completed" : "active";

  return prisma.propFirmPlaybookProgress.update({
    where: { userId },
    data: {
      status,
      currentDay: allDone ? PLAYBOOK_TOTAL_DAYS : Math.max(progress.currentDay, nextDay),
      completedDays: completed,
      completedAt: allDone ? new Date() : null,
      startedAt: progress.startedAt ?? new Date(),
      lastActiveAt: new Date(),
    },
  });
}

export async function touchPlaybookActivity(userId: string) {
  const progress = await getPlaybookProgress(userId);
  if (!progress) return null;

  return prisma.propFirmPlaybookProgress.update({
    where: { userId },
    data: { lastActiveAt: new Date() },
  });
}

export function serializePlaybookProgress(
  progress: Awaited<ReturnType<typeof getPlaybookProgress>>
) {
  if (!progress) return null;

  const completedDays = parseCompletedDays(progress.completedDays);
  const dayPlan = getDayPlan(progress.currentDay);

  return {
    status: progress.status as PlaybookStatus,
    currentDay: progress.currentDay,
    completedDays,
    percentComplete: computePlaybookPercentComplete(completedDays),
    startedAt: progress.startedAt?.toISOString() ?? null,
    completedAt: progress.completedAt?.toISOString() ?? null,
    lastActiveAt: progress.lastActiveAt.toISOString(),
    dayPlan,
    dayTools: getDayToolLinks(progress.currentDay),
    guideHref: "/guides/prop-firm-one-week",
    totalDays: PLAYBOOK_TOTAL_DAYS,
  };
}