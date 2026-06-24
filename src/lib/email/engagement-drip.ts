import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/resend";
import { CURATED_LEARNING_PATH } from "@/lib/academy/learning-path";
import {
  PREMIUM_CHECKOUT_URL,
  PREMIUM_PRICE,
  PREMIUM_PROMO_NOTE,
} from "@/lib/pricing-tiers";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://quicksilveralgo.com";

const PREMIUM_CHECKOUT = PREMIUM_CHECKOUT_URL;

const DRIP_STEPS = [
  {
    step: 1,
    daysAfterSignup: 0,
    subject: "Your Quicksilver lesson progress is saved",
    buildHtml: (email: string, lessons: string[]) => {
      const lastLesson = lessons[lessons.length - 1];
      const lessonUrl = lastLesson
        ? `${SITE_URL}/lessons/${lastLesson}`
        : `${SITE_URL}/lessons`;
      const pathStart = `${SITE_URL}/lessons/${CURATED_LEARNING_PATH[0].slug}`;
      return dripShell(`
        <h1 style="color:#00e5ff;font-size:20px;">You're on the path</h1>
        <p style="color:#94a3b8;line-height:1.6;">Thanks for saving your progress. Pick up where you left off — animated walkthroughs and live chart overlays are waiting.</p>
        <p style="margin:24px 0;"><a href="${lessonUrl}" style="background:#00e5ff;color:#020617;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Continue last lesson →</a></p>
        <p style="color:#64748b;font-size:12px;">Or start the curated path: <a href="${pathStart}" style="color:#00e5ff;">${CURATED_LEARNING_PATH[0].title}</a></p>
      `);
    },
  },
  {
    step: 2,
    daysAfterSignup: 2,
    subject: "Day 2: Unlock the full academy + Risk Matrix",
    buildHtml: () => {
      const lesson = `${SITE_URL}/lessons/chart-reading-reading-candle-components`;
      const riskTool = `${SITE_URL}/dashboard/tools/risk-matrix`;
      return dripShell(`
        <h1 style="color:#00e5ff;font-size:20px;">Level up your edge</h1>
        <p style="color:#94a3b8;line-height:1.6;">You've explored free lessons — Premium (${PREMIUM_PRICE}/mo) unlocks all 89 lessons, 6 planning modules, TradeLocker bot access, and VIP Discord. ${PREMIUM_PROMO_NOTE}</p>
        <ol style="color:#94a3b8;line-height:1.8;">
          <li><a href="${lesson}" style="color:#00e5ff;">Reading Candle Components</a></li>
          <li><a href="${riskTool}" style="color:#00e5ff;">Risk Matrix</a></li>
        </ol>
        <p style="margin:24px 0;"><a href="${PREMIUM_CHECKOUT}" style="background:#00e5ff;color:#020617;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Go Premium →</a></p>
      `);
    },
  },
  {
    step: 3,
    daysAfterSignup: 4,
    subject: "Day 4: BOS, Fibonacci & your viewed lessons",
    buildHtml: (_unused: string, lessons: string[]) => {
      const viewedLinks = lessons
        .slice(-3)
        .map(
          (s) =>
            `<li><a href="${SITE_URL}/lessons/${s}" style="color:#00e5ff;">${s.replace(/-/g, " ")}</a></li>`
        )
        .join("");
      const bos = `${SITE_URL}/lessons/market-structure-what-is-bos`;
      return dripShell(`
        <h1 style="color:#00e5ff;font-size:20px;">Structure + Fib = confluence</h1>
        <p style="color:#94a3b8;line-height:1.6;">Premium (${PREMIUM_PRICE}/mo) unlocks all 89 lessons, live chart overlays, and 6 planning modules.</p>
        ${viewedLinks ? `<p style="color:#94a3b8;">Continue lessons you started:</p><ul style="color:#94a3b8;">${viewedLinks}</ul>` : ""}
        <p style="color:#94a3b8;">Next recommended: <a href="${bos}" style="color:#00e5ff;">Break of Structure</a></p>
        <p style="margin:24px 0;"><a href="${PREMIUM_CHECKOUT}" style="background:#00e5ff;color:#020617;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Go Premium →</a></p>
      `);
    },
  },
  {
    step: 4,
    daysAfterSignup: 7,
    subject: "Day 7: Prop firm playbook + survival simulator",
    buildHtml: (_unused: string, lessons: string[]) => {
      const propGuide = `${SITE_URL}/guides/prop-firm-one-week`;
      const propTool = `${SITE_URL}/dashboard/tools/prop-survival`;
      const solutions = `${SITE_URL}/solutions/ftmo-prop-firm-challenge`;
      return dripShell(`
        <h1 style="color:#00e5ff;font-size:20px;">Ready for a prop challenge?</h1>
        <p style="color:#94a3b8;line-height:1.6;">You've viewed ${lessons.length} lesson${lessons.length === 1 ? "" : "s"}. Run 10,000 Monte Carlo simulations before risking capital.</p>
        <ul style="color:#94a3b8;line-height:1.8;">
          <li><a href="${propGuide}" style="color:#00e5ff;">1-Week Prop Firm Playbook</a></li>
          <li><a href="${propTool}" style="color:#00e5ff;">Prop Survival Engine</a></li>
          <li><a href="${solutions}" style="color:#00e5ff;">FTMO challenge tools</a></li>
        </ul>
        <p style="margin:24px 0;"><a href="${PREMIUM_CHECKOUT}" style="background:#00e5ff;color:#020617;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Unlock everything — ${PREMIUM_PRICE}/mo →</a></p>
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