import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/resend";
import { TOOLS } from "@/lib/tools-registry";
import { isPremiumTier } from "@/lib/tiers";
import type { AccountTier } from "@/types";

const ONBOARDING_STEPS = [
  {
    step: 1,
    subject: "Welcome to Quicksilver Premium — Your 6 Planning Modules",
    buildHtml: (name: string) => `
      <div style="font-family:ui-monospace,monospace;color:#e2e8f0;background:#020617;padding:32px;max-width:560px;">
        <h1 style="color:#00e5ff;font-size:20px;">Welcome${name ? `, ${name}` : ""}</h1>
        <p style="color:#94a3b8;line-height:1.6;">Your premium subscription is active. You now have access to all 6 QS Planning Modules — manual decision-support tools with no broker connection.</p>
        <ul style="color:#94a3b8;line-height:1.8;">
          ${TOOLS.map((t) => `<li><strong style="color:#e2e8f0;">${t.shortName}</strong> — ${t.tag}</li>`).join("")}
        </ul>
        <p style="color:#64748b;font-size:12px;">Start at your dashboard → Trading Tools. Export any module output as a PNG to share manually.</p>
      </div>`,
  },
  {
    step: 2,
    subject: "Day 2: Score setups with Edge Confluence + Risk Matrix",
    buildHtml: (name: string) => `
      <div style="font-family:ui-monospace,monospace;color:#e2e8f0;background:#020617;padding:32px;max-width:560px;">
        <h1 style="color:#00e5ff;font-size:20px;">Build your manual workflow</h1>
        <p style="color:#94a3b8;line-height:1.6;">Hi${name ? ` ${name}` : ""}, today's focus: run every setup through <strong>Edge Confluence</strong> before planning size in the <strong>Risk Matrix</strong>.</p>
        <ol style="color:#94a3b8;line-height:1.8;">
          <li>Score your setup (7 confluence layers)</li>
          <li>Check portfolio heat and Kelly-adjusted risk</li>
          <li>Build your trade plan in the Manual Trade Planner</li>
        </ol>
        <p style="color:#64748b;font-size:12px;">Chart Academy and the prop firm 1-week guide are in your dashboard → Chart Academy</p>
      </div>`,
  },
  {
    step: 3,
    subject: "Day 3: Journal analytics + Prop Survival planning",
    buildHtml: (name: string) => `
      <div style="font-family:ui-monospace,monospace;color:#e2e8f0;background:#020617;padding:32px;max-width:560px;">
        <h1 style="color:#00e5ff;font-size:20px;">Validate your edge</h1>
        <p style="color:#94a3b8;line-height:1.6;">${name ? `${name}, ` : ""}use <strong>Alpha Durability</strong> with your journal stats and <strong>Prop Survival</strong> before any challenge.</p>
        <p style="color:#94a3b8;line-height:1.6;">Join <strong>Trade Together</strong> in your dashboard to discuss setups with other manual traders — no automated bots, no external broadcasts.</p>
        <p style="color:#64748b;font-size:12px;">Questions? Reply to this email — we're here to help you maximize the toolkit.</p>
      </div>`,
  },
];

export async function triggerOnboardingSequence(params: {
  userId: string;
  email: string;
  name: string | null;
  accountTier: AccountTier;
}): Promise<{ sent: number; skipped: number }> {
  if (!isPremiumTier(params.accountTier)) {
    return { sent: 0, skipped: ONBOARDING_STEPS.length };
  }

  let sent = 0;
  let skipped = 0;
  const displayName = params.name ?? params.email.split("@")[0];

  for (const item of ONBOARDING_STEPS) {
    const existing = await prisma.onboardingEmailLog.findUnique({
      where: {
        userId_step: { userId: params.userId, step: item.step },
      },
    });

    if (existing) {
      skipped++;
      continue;
    }

    const ok = await sendEmail({
      to: params.email,
      subject: item.subject,
      html: item.buildHtml(displayName),
    });

    if (ok) {
      await prisma.onboardingEmailLog.create({
        data: { userId: params.userId, step: item.step },
      });
      sent++;
    } else {
      skipped++;
    }
  }

  return { sent, skipped };
}