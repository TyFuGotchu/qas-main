import { SUPPORT_EMAIL } from "@/lib/support";
import {
  E8_AFFILIATE_CODE,
  E8_PUBLIC_PATH,
  getE8ReferralUrl,
} from "@/lib/e8-partner";

const SITE_URL = "https://quicksilveralgo.com";
const LOGIN = `${SITE_URL}/login`;
const PRICING = `${SITE_URL}/pricing`;
const DESK = `${SITE_URL}/desk`;
const ARSENAL = `${SITE_URL}/arsenal`;
const E8_HUB = `${SITE_URL}${E8_PUBLIC_PATH}`;
const E8_SIGNUP = getE8ReferralUrl();

export interface BulkEmailTemplate {
  id: string;
  label: string;
  description: string;
  defaultAudience: "all" | "free" | "premium" | "onboarded" | "custom";
  subject: string;
  body: string;
}

function signOff(): string {
  return `Ty
Quicksilver Algo Systems

Educational tools only. High risk. Official E8 rules are set by E8 Markets. Quicksilver does not guarantee a pass or payout.`;
}

function e8Ps(): string {
  return `P.S. If you want an E8 account, use this link only: ${E8_SIGNUP}
If E8 shows a code field, use ${E8_AFFILIATE_CODE}.`;
}

export const BULK_EMAIL_TEMPLATES: BulkEmailTemplate[] = [
  {
    id: "tradelocker-bot-access",
    label: "TradeLocker bot requesters (full)",
    description: "Desk + pricing. Bot is Premium Desktop. E8 is optional P.S.",
    defaultAudience: "custom",
    subject: "Quant Protocol is Desktop + a paid Desk flag",
    body: `Hi,

You asked about the bot.

Quicksilver is a TradeLocker desk for traders. You do not need an E8 account.

Quant Protocol needs TradeLocker Desktop. It is not in Tools ($39.99). Plans: Tools $39.99, Copy $99, Full $119.99.

Desk: ${DESK}
Pricing: ${PRICING}
Login: ${LOGIN}

${e8Ps()}

Reply or ${SUPPORT_EMAIL}.

${signOff()}`,
  },
  {
    id: "tradelocker-bot-short",
    label: "TradeLocker bot requesters (short)",
    description: "Short bot reply.",
    defaultAudience: "custom",
    subject: "Bot = Desktop. Desk does not require E8.",
    body: `Thanks for the bot request.

Desk first: ${DESK}
Pricing: ${PRICING}
Bot is TradeLocker Desktop, not inside Tools $39.99.

${e8Ps()}

${signOff()}`,
  },
  {
    id: "tradelocker-bot-followup",
    label: "TradeLocker bot follow-up (day 3–4)",
    description: "Follow-up.",
    defaultAudience: "custom",
    subject: "Following up on the bot request",
    body: `Following up.

The desk works for any TradeLocker trader. Bot is optional Desktop.

${PRICING}

${e8Ps()}

${signOff()}`,
  },
  {
    id: "premium-general",
    label: "Premium stack overview",
    description: "New consumer plans.",
    defaultAudience: "custom",
    subject: "Tools $39.99 / Copy $99 / Full $119.99",
    body: `Hi,

Quicksilver is a TradeLocker desk. Plans:

• Tools $39.99 — risk desk (flatten, presets, journal, live terminal). Bot not included.
• Copy $99 — TV Master Suite → TradeLocker webhook (not live until alert JSON is wired). Or a split by request.
• Full $119.99 — Tools + Copy.

${PRICING}

E8 Execution Center is optional if you want that firm path: ${E8_HUB}

${signOff()}`,
  },
  {
    id: "welcome-premium",
    label: "Welcome — Premium access confirmed",
    description: "After access grant.",
    defaultAudience: "custom",
    subject: "Your Desk is on",
    body: `Hi,

Access is live. You do not need an E8 account.

1) Desk — ${SITE_URL}/dashboard/desk
2) Live terminal / journal in the dashboard
3) Copy page if you bought Copy or Full — not live until the webhook JSON is wired
4) E8 pack only if you want it — ${SITE_URL}/dashboard/firms/e8

Login: ${LOGIN}

${signOff()}`,
  },
  {
    id: "bot-desktop-reminder",
    label: "Bot — desktop app required",
    description: "Desktop only.",
    defaultAudience: "custom",
    subject: "Quant Protocol needs TradeLocker Desktop",
    body: `Hi,

The bot will not run on TradeLocker Web. Desktop only. Any TradeLocker account.

${signOff()}`,
  },
  {
    id: "support-received",
    label: "Support — we got your message",
    description: "Ack.",
    defaultAudience: "custom",
    subject: "Got it — we'll reply",
    body: `Hi,

Got your message. Reply on this thread with the account email or a screenshot if you have more.

${signOff()}`,
  },
  {
    id: "billing-help",
    label: "Billing — how to manage subscription",
    description: "Stripe billing.",
    defaultAudience: "custom",
    subject: "Billing — Stripe",
    body: `Hi,

Consumer plans are Tools $39.99, Copy $99, Full $119.99 on Stripe. Manage from your Stripe receipt portal, or reply with the email on the account.

${PRICING}

${signOff()}`,
  },
  {
    id: "access-login-help",
    label: "Access — login / password help",
    description: "Login.",
    defaultAudience: "custom",
    subject: "Login help",
    body: `Hi,

${LOGIN} with the email you registered.

Need a reset? Reply with that email.

${signOff()}`,
  },
  {
    id: "e8-center-start",
    label: "E8 Execution Center — start here",
    description: "Optional firm pack.",
    defaultAudience: "custom",
    subject: "E8 pack — optional",
    body: `Hi,

If you want the E8 path:

Hub: ${E8_HUB}
Signup: ${E8_SIGNUP}
Code if shown: ${E8_AFFILIATE_CODE}

You do not need E8 to use the Desk.

${signOff()}`,
  },
  {
    id: "e8-account-path",
    label: "E8 account path / discounts",
    description: "Affiliate only.",
    defaultAudience: "custom",
    subject: "E8 account — use our link",
    body: `Hi,

Open E8 only through:

${E8_SIGNUP}

If a code field shows, use ${E8_AFFILIATE_CODE}.

${signOff()}`,
  },
  {
    id: "arsenal-ack",
    label: "Arsenal inbound auto-ack",
    description: "Confirm we received a firm pack request.",
    defaultAudience: "custom",
    subject: "Arsenal request received",
    body: `Hi,

Got the Arsenal request. We’ll come back with a quote (setup + monthly; modules extra). No pass-rate promise.

Catalog: ${ARSENAL}

${signOff()}`,
  },
];

export function getBulkEmailTemplate(id: string): BulkEmailTemplate | undefined {
  return BULK_EMAIL_TEMPLATES.find((t) => t.id === id);
}

export const QUANT_PROTOCOL_LANDING_PATH = "/quant-protocol";
