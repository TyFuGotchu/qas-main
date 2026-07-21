import { getPremiumCheckoutUrl } from "@/lib/pricing-constants";
import {
  PREMIUM_PRICE,
  PREMIUM_PROMO_CODE,
  PREMIUM_PROMO_FIRST_MONTH,
} from "@/lib/pricing-constants";
import { TRADELOCKER_BOT_URL } from "@/lib/constants";
import { TOOL_COUNT } from "@/lib/tools-registry";
import { CHART_ACADEMY_STATS } from "@/lib/premium-includes";
import { PROP_FIRM_CHALLENGE_DAYS } from "@/lib/prop-firm-challenge-marketing";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://quicksilveralgo.com";

const QUANT_PROTOCOL_PATH = `${SITE_URL.replace(/\/$/, "")}/quant-protocol`;
const LAUNCH_PATH = `${SITE_URL.replace(/\/$/, "")}/launch`;
const CHECKOUT = getPremiumCheckoutUrl(true);

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
   • Connect & enable on your account — no local installs
   • Runs alongside the live terminal and risk tools
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

FIRST MONTH OFFER
Use code ${PREMIUM_PROMO_CODE} for $60 off → ${PREMIUM_PROMO_FIRST_MONTH} your first month
(then ${PREMIUM_PRICE}/mo — cancel anytime)

START HERE
1. Subscribe to Premium Quant (code ${PREMIUM_PROMO_CODE} at checkout)
2. Create / log into your Quicksilver account
3. Open Trading Bots → Quant Protocol for setup + asset settings
4. Connect TradeLocker and enable Quant Protocol on your account

Full details (built for bot access requests):
${QUANT_PROTOCOL_PATH}

Checkout (${PREMIUM_PROMO_CODE} prefilled when supported):
${CHECKOUT}

Launch / playbook overview:
${LAUNCH_PATH}

If you only wanted "a bot," know this: Premium isn't a separate upsell on top of the algo — it's how Quant Protocol fits into a full prop-aware trading system (risk, playbook, education, live tools).

Questions? Reply to this email or write supportteam@quicksilveralgo.com

— Quicksilver Algo`;
}

function tradelockerBotAccessShortBody(): string {
  return `Thanks for requesting the Quicksilver Quant Protocol on TradeLocker.

Access is included with Premium Quant (${PREMIUM_PRICE}/mo — ${PREMIUM_PROMO_FIRST_MONTH} first month with code ${PREMIUM_PROMO_CODE}).

Same subscription also unlocks:
• ${PROP_FIRM_CHALLENGE_DAYS}-Day Prop Firm Playbook + challenge tracker
• Full planning tools (risk, survival sims, confluence, more)
• Live TradeLocker terminal + Risk Guard / Position Sizer
• Chart Academy (${CHART_ACADEMY_STATS.lessonCount} lessons) + Prop OS / journal

1) Details: ${QUANT_PROTOCOL_PATH}
2) Subscribe: ${CHECKOUT}
3) Log in → Trading Bots → Quant Protocol (settings + setup)
4) Enable the bot on your TradeLocker account

Reply if you need help getting live.

— Quicksilver Algo`;
}

function tradelockerBotFollowUpBody(): string {
  return `Quick follow-up on your Quicksilver Quant Protocol (TradeLocker) access request.

Premium Quant = Quant Protocol on TradeLocker + the full prop-firm toolkit (playbook, risk tools, academy, live terminal).

${PREMIUM_PROMO_CODE} → ${PREMIUM_PROMO_FIRST_MONTH} first month:
${CHECKOUT}

Full stack overview:
${QUANT_PROTOCOL_PATH}

Happy to answer one question if something's blocking you — just reply.

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
    subject: `Premium Quant — bot, playbook & tools (${PREMIUM_PROMO_CODE})`,
    body: `Hi,

Premium Quant is the full Quicksilver system for prop-firm and manual traders:

• Quicksilver Quant Protocol on TradeLocker
• ${PROP_FIRM_CHALLENGE_DAYS}-Day Prop Firm Playbook + tracker
• ${TOOL_COUNT} planning engines
• Chart Academy (${CHART_ACADEMY_STATS.lessonCount} lessons)
• Live terminal tools + Prop OS

${PREMIUM_PROMO_CODE} → ${PREMIUM_PROMO_FIRST_MONTH} first month (${PREMIUM_PRICE}/mo after)

${CHECKOUT}

Or read the full stack: ${QUANT_PROTOCOL_PATH}

— Quicksilver Algo`,
  },
];

export function getBulkEmailTemplate(id: string): BulkEmailTemplate | undefined {
  return BULK_EMAIL_TEMPLATES.find((t) => t.id === id);
}

export const QUANT_PROTOCOL_LANDING_PATH = "/quant-protocol";
