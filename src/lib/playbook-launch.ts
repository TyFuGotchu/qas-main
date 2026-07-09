import { PROP_FIRM_ONE_WEEK_GUIDE } from "@/lib/academy/content/prop-firm-one-week";
import {
  PROP_FIRM_CHALLENGE_DAYS,
  PROP_FIRM_MARKETING_HEADLINE,
} from "@/lib/prop-firm-challenge-marketing";
import { GUARANTEE_FAQ } from "@/lib/money-back-guarantee";
import {
  PREMIUM_PROMO_CODE,
  PREMIUM_PROMO_FIRST_MONTH,
  PREMIUM_PROMO_NOTE,
  PREMIUM_PRICE,
} from "@/lib/pricing-constants";

export const PLAYBOOK_LAUNCH_PATH = "/launch";
export const PLAYBOOK_LAUNCH_OFFER_PATH = "/offers/first100-prop-firm-one-week";

export const PLAYBOOK_LAUNCH_TAGLINE = "Official launch — limited to the first 100 traders";

export const PLAYBOOK_LAUNCH_HERO =
  "The 7-Day Prop Firm Playbook is live. One week. One plan. One subscription.";

export const PLAYBOOK_LAUNCH_SUBHERO = `Follow daily profit caps and consistency rules to hit your prop target without breaching the 20% best-day rule. Premium unlocks the full execution tracker, 9 planning engines, and daily challenge emails. ${PREMIUM_PROMO_NOTE}`;

export const PLAYBOOK_LAUNCH_STEPS = [
  {
    step: 1,
    title: "Preview the plan",
    description: "Read Day 1–2 free. See profit caps, tasks, and consistency math before you pay.",
  },
  {
    step: 2,
    title: "Upgrade with FIRST100",
    description: `${PREMIUM_PROMO_FIRST_MONTH} first month (${PREMIUM_PRICE}/mo after). Challenge auto-starts in your dashboard.`,
  },
  {
    step: 3,
    title: "Execute 7 sessions",
    description: "Mark each day complete. Get the next day's tasks by email. Pass cleanly.",
  },
] as const;

export const PLAYBOOK_LAUNCH_FAQS = [
  GUARANTEE_FAQ[0],
  ...PROP_FIRM_ONE_WEEK_GUIDE.faqs,
  GUARANTEE_FAQ[1],
];

/** Share this URL everywhere for the launch */
export function getPlaybookLaunchUrl(siteUrl?: string): string {
  const base =
    siteUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://quicksilveralgo.com";
  return `${base.replace(/\/$/, "")}${PLAYBOOK_LAUNCH_PATH}`;
}

export const PLAYBOOK_LAUNCH_SHARE_LINES = {
  short: `${PROP_FIRM_MARKETING_HEADLINE} — free preview + ${PREMIUM_PROMO_CODE} launch offer → ${getPlaybookLaunchUrl()}`,
  discord: `**${PROP_FIRM_MARKETING_HEADLINE}** is live on Quicksilver.\n\n• Day-by-day profit caps (stay under 20% consistency)\n• ${PROP_FIRM_CHALLENGE_DAYS} sessions to hit a typical 8–10% target\n• Premium includes tracker + 9 planning tools\n\nPreview: ${getPlaybookLaunchUrl()}\nCode **${PREMIUM_PROMO_CODE}** → ${PREMIUM_PROMO_FIRST_MONTH} month one`,
  twitter: `${PROP_FIRM_MARKETING_HEADLINE} 🎯\n\nDaily profit caps. 20% consistency guardrails. 7 sessions.\n\nFree preview → Premium tracker + tools\n${PREMIUM_PROMO_CODE} = ${PREMIUM_PROMO_FIRST_MONTH} first month\n\n${getPlaybookLaunchUrl()}`,
} as const;