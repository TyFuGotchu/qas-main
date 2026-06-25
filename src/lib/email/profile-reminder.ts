import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/resend";

const PROFILE_REMINDER_STEP = 0;

export async function triggerProfileSetupReminder(params: {
  userId: string;
  email: string;
  name: string | null;
}): Promise<boolean> {
  const existing = await prisma.onboardingEmailLog.findUnique({
    where: {
      userId_step: { userId: params.userId, step: PROFILE_REMINDER_STEP },
    },
  });

  if (existing) return false;

  const displayName = params.name ?? params.email.split("@")[0];
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "https://quicksilveralgo.com";

  const ok = await sendEmail({
    to: params.email,
    subject: "Finish your trader profile — unlock Prop OS & risk gates",
    html: `
      <div style="font-family:ui-monospace,monospace;color:#e2e8f0;background:#020617;padding:32px;max-width:560px;">
        <h1 style="color:#00e5ff;font-size:20px;">One step left, ${displayName}</h1>
        <p style="color:#94a3b8;line-height:1.6;">You selected your access tier — now set your risk limits to unlock:</p>
        <ul style="color:#94a3b8;line-height:1.8;">
          <li><strong style="color:#e2e8f0;">Prop Command Center</strong> — live risk telemetry</li>
          <li><strong style="color:#e2e8f0;">Pre-trade gate</strong> — blocks revenge trades at your limits</li>
          <li><strong style="color:#e2e8f0;">Trade journal</strong> — Alpha Durability from your history</li>
        </ul>
        <p style="margin-top:24px;">
          <a href="${appUrl}/onboarding/profile" style="display:inline-block;background:rgba(0,229,255,0.15);border:1px solid rgba(0,229,255,0.5);color:#00e5ff;padding:12px 20px;text-decoration:none;border-radius:8px;font-size:14px;">
            Complete trader profile →
          </a>
        </p>
        <p style="color:#64748b;font-size:12px;margin-top:24px;">Takes about 60 seconds. Pick your prop firm preset or set custom limits.</p>
      </div>`,
  });

  if (ok) {
    await prisma.onboardingEmailLog.create({
      data: { userId: params.userId, step: PROFILE_REMINDER_STEP },
    });
  }

  return ok;
}