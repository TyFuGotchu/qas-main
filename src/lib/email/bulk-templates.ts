import { getPremiumCheckoutUrl, PREMIUM_PRICE } from "@/lib/pricing-constants";
import { SUPPORT_EMAIL } from "@/lib/support";
import {
  E8_AFFILIATE_CODE,
  E8_PUBLIC_PATH,
  getE8ReferralUrl,
  getLiveE8Discounts,
} from "@/lib/e8-partner";

const SITE_URL = "https://quicksilveralgo.com";
const E8_CENTER = `${SITE_URL}${E8_PUBLIC_PATH}`;
const LOGIN = `${SITE_URL}/login`;
const CHECKOUT = getPremiumCheckoutUrl();
const E8_SIGNUP = getE8ReferralUrl();

export interface BulkEmailTemplate {
  id: string;
  label: string;
  description: string;
  /** Prefer custom list for TradeLocker bot requesters */
  defaultAudience: "all" | "free" | "premium" | "onboarded" | "custom";
  subject: string;
  body: string;
}

function signOff(): string {
  return `Ty
Quicksilver Algo Systems

Educational tools only. High risk. Official E8 rules are set by E8 Markets. Quicksilver does not guarantee a pass or payout.`;
}

function e8DiscountLines(): string {
  const live = getLiveE8Discounts();
  if (live.length === 0) {
    return `Open an E8 account through our path:
${E8_SIGNUP}

If E8 shows a code field, use ${E8_AFFILIATE_CODE}.`;
  }
  const lines = live.map((item) => `• ${item.line}`).join("\n");
  return `${lines}

Open through our link (not the E8 homepage):
${E8_SIGNUP}

If E8 shows a code field, use ${E8_AFFILIATE_CODE}.
Do not use Stripe code E8 on E8 checkout. That code is Quicksilver Premium only (first month 30% off).`;
}

function tradelockerBotAccessFullBody(): string {
  return `Hi,

You asked about the bot.

Quicksilver is a TradeLocker desk for traders. You do not need an E8 account to use it.

Quant Protocol is Premium only. It is not in any free trial. It needs TradeLocker Desktop, not Web.

If you want a prop firm, E8 Markets is the one we recommend:
${E8_SIGNUP}
If E8 shows a code field, use ${E8_AFFILIATE_CODE}. Do not put Stripe code E8 on E8 checkout.

Premium is ${PREMIUM_PRICE}/mo. First month 30% off with code E8 on Quicksilver checkout only:
${CHECKOUT}

Login: ${LOGIN}

Questions? Reply or write ${SUPPORT_EMAIL}.

${signOff()}`;
}

function tradelockerBotAccessShortBody(): string {
  return `Thanks for the bot request.

Quicksilver is a TradeLocker desk. The bot is Premium, Desktop only, not in a trial. No E8 account required.

Premium (${PREMIUM_PRICE}/mo, code E8 = first month 30% off on Quicksilver only): ${CHECKOUT}

Want E8 as the prop path? ${E8_SIGNUP}

Reply or ${SUPPORT_EMAIL} if you get stuck.

${signOff()}`;
}

function tradelockerBotFollowUpBody(): string {
  return `Following up on your Quant Protocol request.

The bot is optional Premium on TradeLocker Desktop. The rest of the desk works for any TradeLocker trader.

Premium: ${CHECKOUT}

If you want a recommended prop firm, E8 is the partner: ${E8_SIGNUP}

One question blocking you? Reply or ${SUPPORT_EMAIL}.

${signOff()}`;
}

/** Saved bulk-email templates for Admin Email Center */
export const BULK_EMAIL_TEMPLATES: BulkEmailTemplate[] = [
  {
    id: "tradelocker-bot-access",
    label: "TradeLocker bot requesters (full)",
    description:
      "Primary template for people who requested Quant Protocol. Desk first, bot second.",
    defaultAudience: "custom",
    subject: "Bot is Premium, Desktop only — desk is for any TradeLocker trader",
    body: tradelockerBotAccessFullBody(),
  },
  {
    id: "tradelocker-bot-short",
    label: "TradeLocker bot requesters (short)",
    description: "Short version of the same offer.",
    defaultAudience: "custom",
    subject: "Bot is Premium. Desk does not require E8.",
    body: tradelockerBotAccessShortBody(),
  },
  {
    id: "tradelocker-bot-followup",
    label: "TradeLocker bot follow-up (day 3–4)",
    description: "Follow-up for bot-request list.",
    defaultAudience: "custom",
    subject: "Quick follow-up on your bot request",
    body: tradelockerBotFollowUpBody(),
  },
  {
    id: "premium-general",
    label: "Premium stack overview",
    description: "Premium as the full desk, not a bot SKU.",
    defaultAudience: "custom",
    subject: "What's in Premium — TradeLocker desk, growth, optional bot",
    body: `Hi,

Premium is the full Quicksilver desk for TradeLocker traders. You do not need an E8 account.

You get live growth, journal, playbook, and tools. Quant Protocol is included. It needs TradeLocker Desktop. It is not in any free trial.

If you want the E8 path, the Execution Center is here:
${E8_CENTER}

${PREMIUM_PRICE}/mo. First month 30% off with code E8 on Quicksilver checkout only:
${CHECKOUT}

Reply or ${SUPPORT_EMAIL} if you need a straight answer.

${signOff()}`,
  },
  {
    id: "welcome-premium",
    label: "Welcome — Premium access confirmed",
    description: "After you grant Premium in admin.",
    defaultAudience: "custom",
    subject: "Premium is on — your TradeLocker desk is live",
    body: `Hi,

Premium is live on your account. You do not need an E8 account to use it.

Start here:
1) Dashboard — live growth, journal, tools
   ${SITE_URL}/dashboard
2) Quant Protocol if you want the bot — TradeLocker Desktop required
   ${SITE_URL}/dashboard/trading-bots
3) E8 Execution Center only if you want that partner path
   ${SITE_URL}/dashboard/e8

Login: ${LOGIN}

If something's missing, reply or write ${SUPPORT_EMAIL}.

${signOff()}`,
  },
  {
    id: "bot-desktop-reminder",
    label: "Bot — desktop app required",
    description: "Quant Protocol needs TradeLocker Desktop, not web.",
    defaultAudience: "custom",
    subject: "Quant Protocol needs TradeLocker Desktop",
    body: `Hi,

Quant Protocol will not show up or run on TradeLocker Web. Desktop only.

1) Install TradeLocker Desktop
2) Log in with your TradeLocker account
3) Enable Quant Protocol from desktop
4) Use Quicksilver → Trading Bots for settings

Works with any TradeLocker account. E8 is optional.

${SUPPORT_EMAIL} if you're stuck.

${signOff()}`,
  },
  {
    id: "support-received",
    label: "Support — we got your message",
    description: "Acknowledge inbound support.",
    defaultAudience: "custom",
    subject: "Got it — we'll reply",
    body: `Hi,

Got your message. I'll come back as soon as I can.

If you have the account email, a screenshot, or more detail, reply on this thread.

${signOff()}`,
  },
  {
    id: "billing-help",
    label: "Billing — how to manage subscription",
    description: "Cancel / change / invoice.",
    defaultAudience: "custom",
    subject: "Billing — Quicksilver is Stripe",
    body: `Hi,

Quicksilver Premium is billed on Stripe. Cancel or update the card from the portal link on your Stripe receipt, or reply with the email on your Quicksilver account.

Code E8 is first month 30% off Quicksilver Premium on our checkout only. It is not an E8 Markets code.

${signOff()}`,
  },
  {
    id: "access-login-help",
    label: "Access — login / password help",
    description: "Can't get into the dashboard.",
    defaultAudience: "custom",
    subject: "Login help",
    body: `Hi,

Try ${LOGIN} with the exact email you registered.

Need a reset? Reply with that email and I'll set a temporary password (min 10 characters, upper + lower + number).

If you paid and still see Free, reply with the payment email and I'll switch Premium from admin.

${signOff()}`,
  },
  {
    id: "e8-center-start",
    label: "E8 Execution Center — start here",
    description: "Partner hub for people who want the E8 path.",
    defaultAudience: "custom",
    subject: "Start at the E8 Execution Center",
    body: `Hi,

If you want the E8 path, start here:

${E8_CENTER}

That's the Rule Desk, risk presets, and hard equity-stop flatten.

You do not need E8 to use the rest of Quicksilver. Flatten on this desk is for TradeLocker FX, metals, and indices. Perps and E8 Futures are on E8 Terminal.

Open an E8 account through our link:
${E8_SIGNUP}
If E8 shows a code field, use ${E8_AFFILIATE_CODE}.

Reply or ${SUPPORT_EMAIL} if you want a walkthrough.

${signOff()}`,
  },
  {
    id: "e8-account-path",
    label: "E8 account path / discounts",
    description: "Affiliate path only. Live E8 checkout discounts, not Stripe.",
    defaultAudience: "custom",
    subject: "E8 account — use our link",
    body: `Hi,

Open your E8 account through this path only.

${e8DiscountLines()}

The Quicksilver desk (flatten, presets, Rule Desk) is at:
${E8_CENTER}

${signOff()}`,
  },
];

export function getBulkEmailTemplate(id: string): BulkEmailTemplate | undefined {
  return BULK_EMAIL_TEMPLATES.find((t) => t.id === id);
}

export const QUANT_PROTOCOL_LANDING_PATH = "/quant-protocol";
