import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/resend";
import { CURATED_LEARNING_PATH } from "@/lib/academy/learning-path";
import {
  PROP_FIRM_PLAYBOOK_HREF,
  PROP_FIRM_MARKETING_HEADLINE,
  PROP_FIRM_MARKETING_SUBHEADLINE,
} from "@/lib/prop-firm-challenge-marketing";
import {
  getPremiumCheckoutUrl,
  PREMIUM_PRICE,
  PREMIUM_PROMO_CODE,
  PREMIUM_PROMO_NOTE,
} from "@/lib/pricing-tiers";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://quicksilveralgo.com";

const PREMIUM_CHECKOUT = getPremiumCheckoutUrl(true);

const DRIP_STEPS = [
  {
    step: 1,
    daysAfterSignup: 0,
    subject: `${PROP_FIRM_MARKETING_HEADLINE} — free preview inside`,
    buildHtml: () => {
      const guideUrl = `${SITE_URL}${PROP_FIRM_PLAYBOOK_HREF}`;
      return dripShell(`
        <h1 style="color:#00e5ff;font-size:20px;">Pass your challenge in 7 days</h1>
        <p style="color:#94a3b8;line-height:1.6;">${PROP_FIRM_MARKETING_SUBHEADLINE}</p>
        <p style="color:#94a3b8;line-height:1.6;">Preview the day-by-day plan free — Premium unlocks full tasks, tools, and daily challenge emails.</p>
        <p style="margin:24px 0;"><a href="${guideUrl}" style="background:#00e5ff;color:#020617;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Preview the playbook →</a></p>
        <p style="color:#64748b;font-size:12px;">${PREMIUM_PROMO_NOTE}</p>
      `);
    },
  },
  {
    step: 2,
    daysAfterSignup: 1,
    subject: "Day 1 tasks: profit caps & consistency rules",
    buildHtml: () => {
      const guideUrl = `${SITE_URL}${PROP_FIRM_PLAYBOOK_HREF}`;
      return dripShell(`
        <h1 style="color:#00e5ff;font-size:20px;">What Day 1 looks like</h1>
        <p style="color:#94a3b8;line-height:1.6;">Foundation day: max 2 trades, +1.0–1.5% cap, full confluence before every entry. Premium tracks your progress and emails each day&apos;s tasks.</p>
        <p style="margin:24px 0;"><a href="${PREMIUM_CHECKOUT}" style="background:#10b981;color:#020617;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Start challenge — ${PREMIUM_PROMO_CODE} →</a></p>
        <p style="color:#64748b;font-size:12px;"><a href="${guideUrl}" style="color:#00e5ff;">Read Day 1 preview</a></p>
      `);
    },
  },
  {
    step: 3,
    daysAfterSignup: 3,
    subject: "Day 3: Why the 20% consistency rule fails most traders",
    buildHtml: (_unused: string, lessons: string[]) => {
      const guideUrl = `${SITE_URL}${PROP_FIRM_PLAYBOOK_HREF}`;
      const lessonUrl = lessons.length
        ? `${SITE_URL}/lessons/${lessons[lessons.length - 1]}`
        : `${SITE_URL}/lessons/${CURATED_LEARNING_PATH[0].slug}`;
      return dripShell(`
        <h1 style="color:#00e5ff;font-size:20px;">Don&apos;t fail after hitting target</h1>
        <p style="color:#94a3b8;line-height:1.6;">One hero day can void your challenge. The playbook caps daily gains so best-day ÷ total profit stays ≤ 20%.</p>
        <p style="margin:16px 0;"><a href="${guideUrl}" style="color:#00e5ff;">See the 7-day plan →</a></p>
        <p style="color:#94a3b8;">Keep learning: <a href="${lessonUrl}" style="color:#00e5ff;">Continue chart academy</a></p>
        <p style="margin:24px 0;"><a href="${PREMIUM_CHECKOUT}" style="background:#00e5ff;color:#020617;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Unlock full playbook (${PREMIUM_PRICE}/mo) →</a></p>
      `);
    },
  },
  {
    step: 4,
    daysAfterSignup: 5,
    subject: "Prop Survival + Risk Matrix — run before your challenge",
    buildHtml: () => {
      const solutions = `${SITE_URL}/solutions/ftmo-prop-firm-challenge`;
      return dripShell(`
        <h1 style="color:#00e5ff;font-size:20px;">Validate before you risk capital</h1>
        <p style="color:#94a3b8;line-height:1.6;">Premium includes Prop Survival Monte Carlo sims, Risk Matrix heat maps, and the full 7-day execution tracker in your dashboard.</p>
        <ul style="color:#94a3b8;line-height:1.8;">
          <li><a href="${solutions}" style="color:#00e5ff;">Free prop firm calculators</a></li>
          <li><a href="${SITE_URL}${PROP_FIRM_PLAYBOOK_HREF}" style="color:#00e5ff;">Playbook preview</a></li>
        </ul>
        <p style="margin:24px 0;"><a href="${PREMIUM_CHECKOUT}" style="background:#00e5ff;color:#020617;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Go Premium — ${PREMIUM_PROMO_CODE} →</a></p>
      `);
    },
  },
  {
    step: 5,
    daysAfterSignup: 7,
    subject: "Last call: 7 days to pass — are you ready?",
    buildHtml: (_unused: string, lessons: string[]) => {
      const guideUrl = `${SITE_URL}${PROP_FIRM_PLAYBOOK_HREF}`;
      return dripShell(`
        <h1 style="color:#00e5ff;font-size:20px;">One week. One plan. One subscription.</h1>
        <p style="color:#94a3b8;line-height:1.6;">You&apos;ve explored ${lessons.length} lesson${lessons.length === 1 ? "" : "s"}. Traders who follow the Quicksilver playbook get daily caps, tool workflows, and consistency guardrails — not guesswork.</p>
        <p style="margin:24px 0;"><a href="${PREMIUM_CHECKOUT}" style="background:#10b981;color:#020617;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Start your 7-day challenge →</a></p>
        <p style="color:#64748b;font-size:12px;"><a href="${guideUrl}" style="color:#00e5ff;">${PROP_FIRM_MARKETING_HEADLINE}</a></p>
      `);
    },
  },
];

function dripShell(body: string): string {
  return `<div style="font-family:ui-monospace,monospace;color:#e2e8f0;background:#020617;padding:32px;max-width:560px;">${body}<p style="color:#475569;font-size:11px;margin-top:32px;">Quicksilver Algo · Manual trading planning</p></div>`;
}

function parseViewedLessons(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((x) => typeof x === "string");
  return [];
}

async function isPayingEmail(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { subscriptionTier: true },
  });
  if (!user) return false;
  return user.subscriptionTier !== "FREE";
}

export async function sendEngagementDripStep(params: {
  leadId: string;
  email: string;
  step: number;
  viewedLessons: unknown;
}): Promise<boolean> {
  const drip = DRIP_STEPS.find((d) => d.step === params.step);
  if (!drip) return false;

  if (await isPayingEmail(params.email)) return false;

  const lessons = parseViewedLessons(params.viewedLessons);
  const ok = await sendEmail({
    to: params.email,
    subject: drip.subject,
    html: drip.buildHtml(params.email, lessons),
  });

  if (ok) {
    await prisma.engagementDripLog.create({
      data: { leadId: params.leadId, step: params.step },
    });
    await prisma.engagementLead.update({
      where: { id: params.leadId },
      data: { dripStep: params.step, lastDripAt: new Date() },
    });
  }

  return ok;
}

export async function captureEngagementLead(params: {
  email: string;
  viewedLessons: string[];
  source?: string;
  abStickyBucket?: string;
}): Promise<{ id: string; isNew: boolean }> {
  const email = params.email.trim().toLowerCase();
  const existing = await prisma.engagementLead.findUnique({ where: { email } });

  const mergedLessons = Array.from(
    new Set([
      ...parseViewedLessons(existing?.viewedLessons),
      ...params.viewedLessons,
    ])
  );

  if (existing) {
    await prisma.engagementLead.update({
      where: { email },
      data: {
        viewedLessons: mergedLessons,
        source: params.source ?? existing.source,
        abStickyBucket: params.abStickyBucket ?? existing.abStickyBucket,
      },
    });
    return { id: existing.id, isNew: false };
  }

  const lead = await prisma.engagementLead.create({
    data: {
      email,
      viewedLessons: mergedLessons,
      source: params.source,
      abStickyBucket: params.abStickyBucket,
    },
  });

  if (!(await isPayingEmail(email))) {
    await sendEngagementDripStep({
      leadId: lead.id,
      email,
      step: 1,
      viewedLessons: mergedLessons,
    });
  }

  return { id: lead.id, isNew: true };
}

export async function runEngagementDripBatch(): Promise<{
  processed: number;
  sent: number;
  skipped: number;
}> {
  const leads = await prisma.engagementLead.findMany({
    where: { dripStep: { lt: DRIP_STEPS.length } },
  });

  let sent = 0;
  let skipped = 0;

  for (const lead of leads) {
    if (await isPayingEmail(lead.email)) {
      skipped++;
      continue;
    }

    const nextStep = lead.dripStep + 1;
    const dripConfig = DRIP_STEPS.find((d) => d.step === nextStep);
    if (!dripConfig) {
      skipped++;
      continue;
    }

    const eligibleAt = new Date(lead.createdAt);
    eligibleAt.setDate(eligibleAt.getDate() + dripConfig.daysAfterSignup);

    if (Date.now() < eligibleAt.getTime()) {
      skipped++;
      continue;
    }

    const alreadySent = await prisma.engagementDripLog.findUnique({
      where: { leadId_step: { leadId: lead.id, step: nextStep } },
    });
    if (alreadySent) {
      skipped++;
      continue;
    }

    const ok = await sendEngagementDripStep({
      leadId: lead.id,
      email: lead.email,
      step: nextStep,
      viewedLessons: lead.viewedLessons,
    });
    if (ok) sent++;
    else skipped++;
  }

  return { processed: leads.length, sent, skipped };
}