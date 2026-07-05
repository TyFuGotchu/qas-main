import { PROP_FIRM_ONE_WEEK_GUIDE } from "@/lib/academy/content/prop-firm-one-week";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/resend";
import {
  getDayPlan,
  getDayToolLinks,
  PLAYBOOK_TOTAL_DAYS,
  startPlaybookChallenge,
} from "@/lib/playbook-progress";
import {
  PROP_FIRM_PLAYBOOK_HREF,
  PROP_FIRM_MARKETING_HEADLINE,
} from "@/lib/prop-firm-challenge-marketing";
import {
  getPremiumCheckoutUrl,
  PREMIUM_PROMO_CODE,
} from "@/lib/pricing-tiers";
import { isPremiumTier } from "@/lib/tiers";
import type { AccountTier } from "@/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://quicksilveralgo.com";

function emailShell(body: string): string {
  return `<div style="font-family:ui-monospace,monospace;color:#e2e8f0;background:#020617;padding:32px;max-width:560px;">${body}<p style="color:#475569;font-size:11px;margin-top:32px;">Quicksilver Algo · 7-Day Prop Firm Playbook</p></div>`;
}

function buildDayEmailHtml(params: {
  name: string;
  day: number;
  isPremium: boolean;
}): string {
  const plan = getDayPlan(params.day);
  if (!plan) return "";

  const tools = getDayToolLinks(params.day);
  const playbookUrl = `${SITE_URL}/dashboard/playbook`;
  const guideUrl = `${SITE_URL}${PROP_FIRM_PLAYBOOK_HREF}`;
  const premiumUrl = getPremiumCheckoutUrl(true);

  const tasksHtml = plan.tasks
    .map((t) => `<li style="margin-bottom:8px;">${t}</li>`)
    .join("");

  const toolsHtml = tools
    .map(
      (t) =>
        `<li><a href="${SITE_URL}${t.href}" style="color:#00e5ff;">${t.name}</a></li>`
    )
    .join("");

  const ctaBlock = params.isPremium
    ? `<p style="margin:24px 0;"><a href="${playbookUrl}" style="background:#00e5ff;color:#020617;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Open Day ${params.day} in dashboard →</a></p>`
    : `<p style="margin:24px 0;"><a href="${premiumUrl}" style="background:#10b981;color:#020617;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Unlock Playbook — ${PREMIUM_PROMO_CODE} →</a></p>`;

  return emailShell(`
    <h1 style="color:#00e5ff;font-size:20px;">Day ${params.day}: ${plan.title}</h1>
    <p style="color:#94a3b8;line-height:1.6;">Hi ${params.name}, ${params.isPremium ? "your" : "preview the"} ${PROP_FIRM_MARKETING_HEADLINE.toLowerCase()} — today&apos;s focus: <strong style="color:#e2e8f0;">${plan.focus}</strong></p>
    <p style="color:#64748b;font-size:12px;">Profit cap: +${plan.profitCapPercent}% · Max risk: ${plan.maxRiskPercent}%/trade</p>
    <p style="color:#94a3b8;font-weight:bold;margin-top:16px;">Today&apos;s tasks:</p>
    <ol style="color:#94a3b8;line-height:1.7;padding-left:20px;">${tasksHtml}</ol>
    <p style="color:#fbbf24;font-size:12px;margin-top:16px;"><strong>Consistency check:</strong> ${plan.consistencyCheck}</p>
    ${toolsHtml ? `<p style="color:#94a3b8;margin-top:16px;">Run these tools:</p><ul style="color:#94a3b8;line-height:1.8;">${toolsHtml}</ul>` : ""}
    ${ctaBlock}
    <p style="color:#64748b;font-size:12px;">Full guide: <a href="${guideUrl}" style="color:#00e5ff;">${PROP_FIRM_ONE_WEEK_GUIDE.title}</a></p>
  `);
}

export async function sendPlaybookDayEmail(params: {
  userId: string;
  email: string;
  name: string | null;
  day: number;
  isPremium: boolean;
}): Promise<boolean> {
  if (params.day < 1 || params.day > PLAYBOOK_TOTAL_DAYS) return false;

  const existing = await prisma.playbookEmailLog.findUnique({
    where: { userId_day: { userId: params.userId, day: params.day } },
  });
  if (existing) return false;

  const displayName = params.name ?? params.email.split("@")[0];
  const plan = getDayPlan(params.day);
  if (!plan) return false;

  const ok = await sendEmail({
    to: params.email,
    subject: `Day ${params.day}: ${plan.title} — Prop Firm Playbook`,
    html: buildDayEmailHtml({
      name: displayName,
      day: params.day,
      isPremium: params.isPremium,
    }),
  });

  if (ok) {
    await prisma.playbookEmailLog.create({
      data: { userId: params.userId, day: params.day },
    });
  }

  return ok;
}

export async function activatePremiumPlaybook(params: {
  userId: string;
  email: string;
  name: string | null;
  accountTier: AccountTier;
}): Promise<{ started: boolean; emailSent: boolean }> {
  if (!isPremiumTier(params.accountTier)) {
    return { started: false, emailSent: false };
  }

  await startPlaybookChallenge(params.userId);
  const emailSent = await sendPlaybookDayEmail({
    userId: params.userId,
    email: params.email,
    name: params.name,
    day: 1,
    isPremium: true,
  });

  return { started: true, emailSent };
}

export async function onPlaybookDayCompleted(params: {
  userId: string;
  email: string;
  name: string | null;
  completedDay: number;
}): Promise<boolean> {
  if (params.completedDay >= PLAYBOOK_TOTAL_DAYS) return false;

  return sendPlaybookDayEmail({
    userId: params.userId,
    email: params.email,
    name: params.name,
    day: params.completedDay + 1,
    isPremium: true,
  });
}

const NUDGE_HOURS = 20;

export async function runPlaybookNudgeBatch(): Promise<{
  processed: number;
  sent: number;
  skipped: number;
}> {
  const active = await prisma.propFirmPlaybookProgress.findMany({
    where: { status: "active" },
    include: { user: { select: { email: true, name: true, subscriptionTier: true } } },
  });

  let sent = 0;
  let skipped = 0;

  for (const progress of active) {
    if (progress.user.subscriptionTier === "FREE") {
      skipped++;
      continue;
    }

    const completed = Array.isArray(progress.completedDays)
      ? (progress.completedDays as number[])
      : [];
    if (completed.includes(progress.currentDay)) {
      skipped++;
      continue;
    }

    const hoursSinceActive =
      (Date.now() - progress.lastActiveAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceActive < NUDGE_HOURS) {
      skipped++;
      continue;
    }

    const nudgeDay = progress.currentDay + 100;
    const alreadyNudged = await prisma.playbookEmailLog.findUnique({
      where: { userId_day: { userId: progress.userId, day: nudgeDay } },
    });
    if (alreadyNudged) {
      skipped++;
      continue;
    }

    const plan = getDayPlan(progress.currentDay);
    if (!plan) {
      skipped++;
      continue;
    }

    const displayName = progress.user.name ?? progress.user.email.split("@")[0];
    const playbookUrl = `${SITE_URL}/dashboard/playbook`;

    const ok = await sendEmail({
      to: progress.user.email,
      subject: `Reminder: Day ${progress.currentDay} tasks waiting — ${plan.title}`,
      html: emailShell(`
        <h1 style="color:#fbbf24;font-size:18px;">Still on Day ${progress.currentDay}?</h1>
        <p style="color:#94a3b8;line-height:1.6;">${displayName}, you haven&apos;t marked Day ${progress.currentDay} complete yet. Today&apos;s cap is +${plan.profitCapPercent}% — stick to the plan to pass in 7 days.</p>
        <p style="margin:24px 0;"><a href="${playbookUrl}" style="background:#00e5ff;color:#020617;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Continue Day ${progress.currentDay} →</a></p>
      `),
    });

    if (ok) {
      await prisma.playbookEmailLog.create({
        data: { userId: progress.userId, day: nudgeDay },
      });
      sent++;
    } else {
      skipped++;
    }
  }

  return { processed: active.length, sent, skipped };
}