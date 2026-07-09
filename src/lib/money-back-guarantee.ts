import { PROP_FIRM_CHALLENGE_DAYS } from "@/lib/prop-firm-challenge-marketing";
import { PREMIUM_PROMO_FIRST_MONTH, PREMIUM_PRICE } from "@/lib/pricing-constants";
import { SUPPORT_EMAIL } from "@/lib/support";

export const GUARANTEE_PATH = "/guarantee";

export const GUARANTEE_WINDOW_DAYS = 30;

export const GUARANTEE_HEADLINE = "30-Day Playbook Money-Back Guarantee";

export const GUARANTEE_TAGLINE =
  "Follow the system. Complete all 7 days. Not satisfied? Full first-month refund.";

export const GUARANTEE_SHORT =
  `${GUARANTEE_WINDOW_DAYS}-day money-back guarantee when you complete the full ${PROP_FIRM_CHALLENGE_DAYS}-Day Playbook in your dashboard tracker.`;

export const GUARANTEE_CTA_LINE = `Risk-free first month — ${GUARANTEE_HEADLINE}`;

export const GUARANTEE_ELIGIBILITY_STEPS = [
  `Subscribe to Premium (${PREMIUM_PROMO_FIRST_MONTH} first month with FIRST100, then ${PREMIUM_PRICE}/mo).`,
  `Start the 7-Day Prop Firm Playbook in Dashboard → Playbook and mark all ${PROP_FIRM_CHALLENGE_DAYS} days complete.`,
  "Run Prop Survival (Monte Carlo) before Day 1 and respect daily profit caps from the playbook.",
  "Use Edge Confluence + Risk Matrix on every trade session as outlined in each day's tasks.",
  `Email ${SUPPORT_EMAIL} within ${GUARANTEE_WINDOW_DAYS} days of your first Premium charge with subject line "Guarantee Claim".`,
] as const;

export const GUARANTEE_EXCLUSIONS = [
  "Refund applies to your first Premium month only — not renewals.",
  "Partial completion (fewer than 7 marked playbook days) does not qualify.",
  "Guarantee covers subscription satisfaction — not prop firm challenge fees, broker losses, or trading P&L.",
  "Abuse (multiple accounts, chargeback fraud) voids eligibility.",
] as const;

export const GUARANTEE_FAQ = [
  {
    question: "What is the Quicksilver money-back guarantee?",
    answer: `${GUARANTEE_HEADLINE}: complete the full 7-Day Playbook in your Premium dashboard tracker within ${GUARANTEE_WINDOW_DAYS} days of subscribing. If the system is not right for you, email ${SUPPORT_EMAIL} for a full refund of your first month.`,
  },
  {
    question: "Do I need to pass my prop firm challenge to get a refund?",
    answer:
      "No. The guarantee is satisfaction-based after you follow the protocol — complete all 7 playbook days as designed. We do not guarantee trading profits or challenge passes (markets involve risk).",
  },
  {
    question: "How fast are guarantee refunds processed?",
    answer:
      "Approved claims are refunded to your original payment method within 5–7 business days via Stripe.",
  },
  {
    question: "Why require completing all 7 playbook days?",
    answer:
      "Traders who follow the profit caps, consistency math, and tool workflow see the edge. The guarantee proves we stand behind the system — but only after you actually run it.",
  },
] as const;

export const GUARANTEE_POLICY_SECTIONS = [
  {
    heading: "Our Promise",
    paragraphs: [
      `Quicksilver Premium is built around one outcome: pass prop firm challenges mathematically — not emotionally. Traders who complete the ${PROP_FIRM_CHALLENGE_DAYS}-Day Playbook with daily profit caps, consistency guardrails, and our 9 planning tools have a structured edge most retail traders never get.`,
      `If you execute the full protocol in your dashboard and decide Premium is not for you, we will refund your first month in full. No arguments. No hoops beyond proving you ran the system.`,
    ],
  },
  {
    heading: "Who Qualifies",
    paragraphs: [
      "First-time Premium subscribers only. You must complete every requirement below within 30 days of your initial Stripe charge.",
    ],
    listItems: [...GUARANTEE_ELIGIBILITY_STEPS],
  },
  {
    heading: "How to Claim",
    paragraphs: [
      `Email ${SUPPORT_EMAIL} with subject line "Guarantee Claim". Include your Quicksilver account email and the date of your first Premium payment. We verify playbook completion in your dashboard (all 7 days marked complete) and process eligible refunds within 5–7 business days.`,
    ],
  },
  {
    heading: "What Is Not Covered",
    paragraphs: ["The guarantee protects your subscription investment — not trading outcomes."],
    listItems: [...GUARANTEE_EXCLUSIONS],
  },
  {
    heading: "Why We Offer This",
    paragraphs: [
      "Most traders fail prop challenges because of consistency math and oversizing — not because they lack information. The playbook fixes that. We are confident that traders who follow it will see clearer pass paths in Prop Survival and cleaner execution in live sessions.",
      "If you do the work and disagree, we do not want your money.",
    ],
  },
] as const;