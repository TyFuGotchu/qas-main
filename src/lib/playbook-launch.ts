import { PROP_FIRM_ONE_WEEK_GUIDE } from "@/lib/academy/content/prop-firm-one-week";
import {
  PROP_FIRM_CHALLENGE_DAYS,
  PROP_FIRM_MARKETING_HEADLINE,
} from "@/lib/prop-firm-challenge-marketing";
import { PREMIUM_PRICE } from "@/lib/pricing-constants";

export const PLAYBOOK_LAUNCH_PATH = "/launch";

export const PLAYBOOK_LAUNCH_TAGLINE = "Official launch — available now";

export const PLAYBOOK_LAUNCH_HERO =
  "The 7-Day Prop Firm Playbook is live. One week. One plan. One subscription.";

export const PLAYBOOK_LAUNCH_SUBHERO = `Follow daily profit caps and consistency rules to hit your prop target without breaching the 20% best-day rule. Premium unlocks the full execution tracker, 9 planning engines, and daily challenge emails at ${PREMIUM_PRICE}/mo.`;

export const PLAYBOOK_LAUNCH_STEPS = [
  {
    step: 1,
    title: "Preview the plan",
    description:
      "Read Day 1–2 free. See profit caps, tasks, and consistency math before you pay.",
  },
  {
    step: 2,
    title: "Subscribe to Premium Quant",
    description: `${PREMIUM_PRICE}/mo. Challenge auto-starts in your dashboard with Day 1 tasks.`,
  },
  {
    step: 3,
    title: "Execute 7 sessions",
    description:
      "Mark each day complete. Get the next day's tasks by email. Stay inside your firm’s rules.",
  },
] as const;

export const PLAYBOOK_LAUNCH_FAQS = [...PROP_FIRM_ONE_WEEK_GUIDE.faqs];

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
  short: `${PROP_FIRM_MARKETING_HEADLINE} — free preview + Premium tracker → ${getPlaybookLaunchUrl()}`,
  discord: `**${PROP_FIRM_MARKETING_HEADLINE}** is live on Quicksilver.\n\n• Day-by-day profit caps (stay under 20% consistency)\n• ${PROP_FIRM_CHALLENGE_DAYS} sessions to hit a typical 8–10% target\n• Premium includes tracker + 9 planning tools\n\nPreview: ${getPlaybookLaunchUrl()}\nPremium: ${PREMIUM_PRICE}/mo`,
  twitter: `${PROP_FIRM_MARKETING_HEADLINE}\n\nDaily profit caps. 20% consistency guardrails. 7 sessions.\n\nFree preview → Premium tracker + tools at ${PREMIUM_PRICE}/mo\n\n${getPlaybookLaunchUrl()}`,
} as const;
