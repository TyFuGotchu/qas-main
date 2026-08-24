import { PROP_FIRM_ONE_WEEK_GUIDE } from "@/lib/academy/content/prop-firm-one-week";
import {
  PREMIUM_PRICE,
} from "@/lib/pricing-constants";
import { TOOL_COUNT } from "@/lib/tools-registry";

export const PROP_FIRM_PLAYBOOK_SLUG = PROP_FIRM_ONE_WEEK_GUIDE.slug;
export const PROP_FIRM_PLAYBOOK_HREF = `/guides/${PROP_FIRM_PLAYBOOK_SLUG}`;
export const PROP_FIRM_PLAYBOOK_TITLE = PROP_FIRM_ONE_WEEK_GUIDE.title;
export const PROP_FIRM_PLAYBOOK_DESCRIPTION = PROP_FIRM_ONE_WEEK_GUIDE.description;
export const PROP_FIRM_CHALLENGE_DAYS = 7;
export const PROP_FIRM_CONSISTENCY_TARGET =
  PROP_FIRM_ONE_WEEK_GUIDE.consistencyTargetPercent;

export const PROP_FIRM_MARKETING_HEADLINE =
  "7-Day Prop Firm Playbook";

export const PROP_FIRM_MARKETING_SUBHEADLINE =
  "A day-by-day framework for common evaluation windows — profit caps, consistency awareness, and QS tool integration. Not a guaranteed pass. Confirm your firm’s current rules.";

export const PROP_FIRM_MARKETING_TAGLINE =
  "The 7-Day Prop Firm Playbook is the core of Quicksilver Premium.";

export const PROP_FIRM_PREMIUM_PITCH = `Premium (${PREMIUM_PRICE}/mo) unlocks the full ${PROP_FIRM_CHALLENGE_DAYS}-day execution plan, all ${TOOL_COUNT} planning engines, Chart Academy, and the TradeLocker bot. `;

export const PROP_FIRM_PLAYBOOK_CTA = `Start the 7-Day Plan — `;

export const PROP_FIRM_DAY_PREVIEW = PROP_FIRM_ONE_WEEK_GUIDE.dailyPlans.map(
  (day) => ({
    day: day.day,
    title: day.title,
    focus: day.focus,
    profitCap: day.profitCapPercent,
  })
);

export const PROP_FIRM_PLAYBOOK_HIGHLIGHTS = [
  "Day-by-day profit caps so you never breach the 20% consistency rule",
  "Pre-session tasks tied to Edge Confluence, Risk Matrix & Prop Survival",
  "Built for 8–10% profit targets with 5% daily loss limits",
  "Red-day protocol and finish-day audit before you submit",
] as const;

export const PROP_FIRM_PREMIUM_FEATURES_LEAD = [
  "Quicksilver Quant Protocol bot — ready to launch on TradeLocker Hub",
  `Full ${PROP_FIRM_CHALLENGE_DAYS}-Day Prop Firm Playbook with daily execution plan`,
  `${TOOL_COUNT} planning engines to score setups, plan risk & simulate survival`,
  "89 Chart Academy lessons + live terminal + prop command center + priority support",
] as const;