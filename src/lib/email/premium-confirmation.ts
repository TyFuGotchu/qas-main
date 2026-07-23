import {
  sendEmailDetailed,
  type SendEmailResult,
} from "@/lib/email/resend";
import { SUPPORT_EMAIL } from "@/lib/support";
import { PREMIUM_PRICE } from "@/lib/pricing-constants";
import type { AccountTier } from "@/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://quicksilveralgo.com";

function emailShell(body: string): string {
  return `<div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#e2e8f0;background:#020617;padding:32px;max-width:560px;line-height:1.6;">${body}<p style="color:#475569;font-size:12px;margin-top:32px;">Quicksilver Algo · Premium access confirmation<br/>Questions? Reply to this email or write ${SUPPORT_EMAIL}</p></div>`;
}

/**
 * Sent when Premium is officially granted (admin override or Stripe sync).
 * Clear "you're in" email — not the day-1 playbook drip.
 */
export async function sendPremiumAccessConfirmation(params: {
  userId: string;
  email: string;
  name: string | null;
  accountTier: AccountTier;
}): Promise<SendEmailResult> {
  const displayName = params.name?.trim() || params.email.split("@")[0];
  const dashboardUrl = `${SITE_URL}/dashboard`;
  const botsUrl = `${SITE_URL}/dashboard/trading-bots`;
  const playbookUrl = `${SITE_URL}/dashboard/playbook`;
  const toolsUrl = `${SITE_URL}/dashboard/tools`;
  const quantUrl = `${SITE_URL}/quant-protocol`;

  const html = emailShell(`
    <p style="color:#00e5ff;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px;">Access confirmed</p>
    <h1 style="color:#f8fafc;font-size:22px;margin:0 0 16px;">Welcome to Premium, ${displayName}</h1>
    <p style="color:#94a3b8;margin:0 0 16px;">
      Your Quicksilver Premium access is active. You now have the full stack —
      not just one product.
    </p>
    <ul style="color:#cbd5e1;padding-left:18px;margin:0 0 20px;">
      <li style="margin-bottom:10px;"><strong style="color:#e2e8f0;">Quant Protocol on TradeLocker</strong> — setup in Dashboard → Trading Bots. Requires the TradeLocker <em>desktop</em> app (not TradeLocker Web)</li>
      <li style="margin-bottom:10px;"><strong style="color:#e2e8f0;">7-Day Prop Firm Playbook</strong> — day-by-day challenge plan under consistency rules</li>
      <li style="margin-bottom:10px;"><strong style="color:#e2e8f0;">All planning engines &amp; Trading Tools</strong> — risk, consistency, expectancy, and more</li>
      <li style="margin-bottom:10px;"><strong style="color:#e2e8f0;">Chart Academy</strong> — full lesson library</li>
    </ul>
    <p style="margin:24px 0 12px;">
      <a href="${dashboardUrl}" style="display:inline-block;background:#00e5ff;color:#020617;padding:12px 22px;text-decoration:none;border-radius:6px;font-weight:700;">Open your dashboard →</a>
    </p>
    <p style="color:#64748b;font-size:13px;margin:0 0 8px;">Quick links:</p>
    <p style="font-size:13px;margin:0;">
      <a href="${botsUrl}" style="color:#00e5ff;">Trading Bots</a>
      &nbsp;·&nbsp;
      <a href="${playbookUrl}" style="color:#00e5ff;">Playbook</a>
      &nbsp;·&nbsp;
      <a href="${toolsUrl}" style="color:#00e5ff;">Tools</a>
      &nbsp;·&nbsp;
      <a href="${quantUrl}" style="color:#00e5ff;">Quant Protocol guide</a>
    </p>
    <p style="color:#64748b;font-size:12px;margin-top:24px;">
      Plan: ${params.accountTier} · list price ${PREMIUM_PRICE}/mo when subscribed via Stripe.
    </p>
  `);

  return sendEmailDetailed({
    to: params.email,
    subject: "Premium access confirmed — Quicksilver Algo",
    html,
    // Idempotency is 24h — append date so re-grants after revoke can email again next day
    idempotencyKey: `premium-access/${params.userId}/${new Date().toISOString().slice(0, 10)}`,
    tags: [
      { name: "category", value: "premium-confirmation" },
      { name: "user_id", value: params.userId.slice(0, 256) },
    ],
  });
}
