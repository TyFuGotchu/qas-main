import {
  getPremiumCheckoutUrl,
  PREMIUM_PRICE,
} from "@/lib/pricing-constants";
import { TRADELOCKER_BOT_URL } from "@/lib/constants";
import { TOOL_COUNT } from "@/lib/tools-registry";
import { CHART_ACADEMY_STATS } from "@/lib/premium-includes";
import { PROP_FIRM_CHALLENGE_DAYS } from "@/lib/prop-firm-challenge-marketing";
import { SUPPORT_EMAIL } from "@/lib/support";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://quicksilveralgo.com";

const QUANT_PROTOCOL_PATH = `${SITE_URL.replace(/\/$/, "")}/quant-protocol`;
const LAUNCH_PATH = `${SITE_URL.replace(/\/$/, "")}/launch`;
const CHECKOUT = getPremiumCheckoutUrl();

export interface BulkEmailTemplate {
  id: string;
  label: string;
  description: string;
  /** Prefer custom list for TradeLocker bot requesters */
  defaultAudience: "all" | "free" | "premium" | "onboarded" | "custom";
  subject: string;
  body: string;
}

function tradelockerBotAccessFullBody(): string {
  return `Hi,

Thanks for requesting access to the Quicksilver Quant Protocol (Apex Institutional Engine) on TradeLocker.

Here's how access works:

Premium Quant unlocks the full Quicksilver stack — including the path to run Quant Protocol on your TradeLocker account — plus the prop-firm tools built around it.

WHAT YOU GET WITH PREMIUM QUANT (${PREMIUM_PRICE}/mo)

1) Quicksilver Quant Protocol (TradeLocker)
   • Flagship algo on the TradeLocker marketplace
   • IMPORTANT: requires the TradeLocker DESKTOP app (not TradeLocker Web)
   • Request access / enable the bot from desktop only
   • Marketplace: ${TRADELOCKER_BOT_URL}

2) ${PROP_FIRM_CHALLENGE_DAYS}-Day Prop Firm Playbook
   • Day-by-day profit caps and consistency rules
   • In-dashboard challenge tracker + daily task emails
   • Built to hit target without blowing the 20% best-day rule

3) Full planning toolkit (${TOOL_COUNT} engines)
   • Risk Matrix, Prop Survival (Monte Carlo), Edge Confluence
   • Expectancy, compounding, execution tools, and more

4) Live TradeLocker terminal tools
   • Live positions & P&L
   • Risk Guard, Position Sizer, Growth Coach, Exposure Scanner

5) Chart Academy + Prop OS
   • ${CHART_ACADEMY_STATS.lessonCount} structured lessons
   • Prop Command Center, journal, growth dashboard
   • Trade Together community

6) Priority support
   • Direct email help when you're stuck

PRICING
${PREMIUM_PRICE}/mo — cancel anytime

START HERE
1. Subscribe to Premium Quant at checkout
2. Create / log into your Quicksilver account
3. Install TradeLocker Desktop (required — bot not on web platform)
4. Open Trading Bots → Quant Protocol for setup + asset settings
5. From desktop, enable Quant Protocol on your TradeLocker account

Full details (built for bot access requests):
${QUANT_PROTOCOL_PATH}

Checkout:
${CHECKOUT}

Launch / playbook overview:
${LAUNCH_PATH}

If you only wanted "a bot," know this: Premium isn't a separate upsell on top of the algo — it's how Quant Protocol fits into a full prop-aware trading system (risk, playbook, education, live tools).

Questions? Reply to this email or write ${SUPPORT_EMAIL}

— Quicksilver Algo`;
}

function tradelockerBotAccessShortBody(): string {
  return `Thanks for requesting the Quicksilver Quant Protocol on TradeLocker.

Access is included with Premium Quant (${PREMIUM_PRICE}/mo).

Same subscription also unlocks:
• ${PROP_FIRM_CHALLENGE_DAYS}-Day Prop Firm Playbook + challenge tracker
• Full planning tools (risk, survival sims, confluence, more)
• Live TradeLocker terminal + Risk Guard / Position Sizer
• Chart Academy (${CHART_ACADEMY_STATS.lessonCount} lessons) + Prop OS / journal

1) Details: ${QUANT_PROTOCOL_PATH}
2) Subscribe: ${CHECKOUT}
3) Install TradeLocker Desktop (required — not web)
4) Log in → Trading Bots → Quant Protocol (settings + setup)
5) From desktop, enable the bot on your TradeLocker account

Reply if you need help getting live, or write ${SUPPORT_EMAIL}.

— Quicksilver Algo`;
}

function tradelockerBotFollowUpBody(): string {
  return `Quick follow-up on your Quicksilver Quant Protocol (TradeLocker) access request.

Premium Quant = Quant Protocol on TradeLocker + the full prop-firm toolkit (playbook, risk tools, academy, live terminal).

Reminder: the bot requires the TradeLocker desktop app — it will not appear or run on TradeLocker Web.

 ${PREMIUM_PRICE}/mo:
${CHECKOUT}

Full stack overview:
${QUANT_PROTOCOL_PATH}

Happy to answer one question if something's blocking you — reply or write ${SUPPORT_EMAIL}.

— Quicksilver`;
}

/** Saved bulk-email templates for Admin Email Center */
export const BULK_EMAIL_TEMPLATES: BulkEmailTemplate[] = [
  {
    id: "tradelocker-bot-access",
    label: "TradeLocker bot requesters (full)",
    description:
      "Primary template for people who requested Quant Protocol access on TradeLocker.",
    defaultAudience: "custom",
    subject: "Your Quicksilver Quant Protocol access request",
    body: tradelockerBotAccessFullBody(),
  },
  {
    id: "tradelocker-bot-short",
    label: "TradeLocker bot requesters (short)",
    description: "Shorter version — higher skim rate for the same offer.",
    defaultAudience: "custom",
    subject: "Re: Quicksilver Quant Protocol (TradeLocker access)",
    body: tradelockerBotAccessShortBody(),
  },
  {
    id: "tradelocker-bot-followup",
    label: "TradeLocker bot follow-up (day 3–4)",
    description: "Soft follow-up for non-converters from the bot-request list.",
    defaultAudience: "custom",
    subject: "Still need Quant Protocol on TradeLocker?",
    body: tradelockerBotFollowUpBody(),
  },
  {
    id: "premium-general",
    label: "Premium stack overview",
    description: "General Premium pitch (not specific to bot requesters).",
    defaultAudience: "custom",
    subject: `Premium Quant — bot, playbook & tools`,
    body: `Hi,

Premium Quant is the full Quicksilver system for prop-firm and manual traders:

• Quicksilver Quant Protocol on TradeLocker
• ${PROP_FIRM_CHALLENGE_DAYS}-Day Prop Firm Playbook + tracker
• ${TOOL_COUNT} planning engines
• Chart Academy (${CHART_ACADEMY_STATS.lessonCount} lessons)
• Live terminal tools + Prop OS

${PREMIUM_PRICE}/mo

${CHECKOUT}

Or read the full stack: ${QUANT_PROTOCOL_PATH}

Questions? Reply or write ${SUPPORT_EMAIL}

— Quicksilver Algo`,
  },
  {
    id: "welcome-premium",
    label: "Welcome — Premium access confirmed",
    description: "Single or small-batch note after you grant Premium in admin.",
    defaultAudience: "custom",
    subject: "Welcome to Premium — your access is live",
    body: `Hi,

Your Quicksilver Premium access is confirmed.

What's unlocked:
• Quant Protocol on TradeLocker (desktop app required — not web)
• ${PROP_FIRM_CHALLENGE_DAYS}-Day Prop Firm Playbook
• All planning engines + Trading Tools
• Chart Academy + live terminal tools

Start here:
1) Dashboard → Trading Bots → Quant Protocol (settings)
2) Dashboard → Playbook
3) Dashboard → Tools

Login: ${SITE_URL.replace(/\/$/, "")}/login

If anything looks wrong, reply to this email or write ${SUPPORT_EMAIL}.

— Quicksilver Algo`,
  },
  {
    id: "bot-desktop-reminder",
    label: "Bot — desktop app required",
    description: "Clarify Quant Protocol needs TradeLocker Desktop, not web.",
    defaultAudience: "custom",
    subject: "Important: TradeLocker Desktop required for Quant Protocol",
    body: `Hi,

Quick clarification on Quicksilver Quant Protocol:

The bot is only available through the TradeLocker DESKTOP application.
It will not appear or run on TradeLocker Web.

Steps:
1) Download / install TradeLocker Desktop
2) Log in with your broker / prop account
3) Request or enable Quant Protocol from the desktop marketplace
4) Use Quicksilver → Trading Bots for asset settings

Marketplace: ${TRADELOCKER_BOT_URL}
Setup guide: ${QUANT_PROTOCOL_PATH}

Questions? Reply or write ${SUPPORT_EMAIL}

— Quicksilver Algo`,
  },
  {
    id: "support-received",
    label: "Support — we got your message",
    description: "Acknowledge an inbound support ticket while you dig in.",
    defaultAudience: "custom",
    subject: "We received your message — Quicksilver Support",
    body: `Hi,

Thanks for writing in. We received your message and will get back to you as soon as we can.

If you have screenshots, account email, or more detail, reply to this thread so everything stays in one place.

— Quicksilver Support (${SUPPORT_EMAIL})`,
  },
  {
    id: "billing-help",
    label: "Billing — how to manage subscription",
    description: "Common reply for cancel / change / invoice questions.",
    defaultAudience: "custom",
    subject: "Re: billing / subscription help",
    body: `Hi,

Happy to help with billing.

Premium is billed through Stripe. To cancel or update payment:
1) Reply with the email on your Quicksilver account (subject: Billing), or
2) Use the customer portal link from your Stripe receipt email if you have one

We can also confirm whether a promo applied to your first invoice.

— Quicksilver Support (${SUPPORT_EMAIL})`,
  },
  {
    id: "access-login-help",
    label: "Access — login / password help",
    description: "When someone can't get into the dashboard.",
    defaultAudience: "custom",
    subject: "Re: login help",
    body: `Hi,

Sorry you're stuck on login.

Try:
1) https://quicksilveralgo.com/login with the exact email you registered
2) If you need a password reset, reply with that email and we'll set a temporary password for you (min 10 chars, upper + lower + number)

If you paid but still see Free tier, reply with the payment email — we can grant Premium from admin.

— Quicksilver Support (${SUPPORT_EMAIL})`,
  },
];

export function getBulkEmailTemplate(id: string): BulkEmailTemplate | undefined {
  return BULK_EMAIL_TEMPLATES.find((t) => t.id === id);
}

export const QUANT_PROTOCOL_LANDING_PATH = "/quant-protocol";
