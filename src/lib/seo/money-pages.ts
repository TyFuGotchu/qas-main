/**
 * Canonical money-page graph for SEO recovery.
 * Keep this list short and high-quality — authority over volume.
 */

import { PREMIUM_PRICE } from "@/lib/pricing-constants";
import { PROP_FIRM_CHALLENGE_DAYS } from "@/lib/prop-firm-challenge-marketing";
import { TOOL_COUNT } from "@/lib/tools-registry";
import { CHART_ACADEMY_STATS } from "@/lib/premium-includes";

/** Bump when money-page content materially improves (sitemap + schema freshness). */
export const SEO_RECOVERY_REFRESHED = "2026-08-24";

export type MoneyPageLink = {
  href: string;
  title: string;
  description: string;
  priority: "core" | "learn" | "support";
};

/** Primary commercial + ranking URLs Google should re-crawl first. */
export const MONEY_PAGES: MoneyPageLink[] = [
  {
    href: "/",
    title: "Quicksilver Algo home",
    description:
      "Official E8 Markets partner. TradeLocker Desktop trading OS: workflow stack, live growth terminal, E8 Execution Center, optional Quant Protocol.",
    priority: "core",
  },
  {
    href: "/e8",
    title: "E8 Execution Center",
    description:
      "Official E8 Markets partner hub: challenge rules, risk presets, direct signup, and campaign previews.",
    priority: "core",
  },
  {
    href: "/quant-protocol",
    title: "Quicksilver Quant Protocol",
    description:
      "TradeLocker bot access via Premium Quant — desktop required, full prop-aware stack.",
    priority: "core",
  },
  {
    href: "/launch",
    title: "7-Day Prop Firm Playbook",
    description:
      "Day-by-day challenge plan with profit caps, consistency rules, and tracker.",
    priority: "core",
  },
  {
    href: "/prop-firm",
    title: "Prop firm challenge guides",
    description:
      "FTMO, Apex, FundedNext, Topstep and more — pass cleanly with structure and risk math.",
    priority: "core",
  },
  {
    href: "/guides/pillar/ultimate-7-day-prop-firm-playbook",
    title: "Ultimate 7-day prop firm playbook (pillar)",
    description: "Canonical long-form prop firm execution playbook.",
    priority: "core",
  },
  {
    href: "/guides/pillar/mathematical-prop-firm-model",
    title: "Mathematical model for prop firm success",
    description: "Consistency math, Monte Carlo thinking, and risk equations.",
    priority: "core",
  },
  {
    href: "/guides/break-of-structure",
    title: "Break of structure (BOS)",
    description: "What BOS means, BOS vs sweep, and how to trade the retest.",
    priority: "learn",
  },
  {
    href: "/tools",
    title: "Trading tools",
    description: `Risk Matrix, Prop Survival, Edge Confluence, and ${TOOL_COUNT} planning engines.`,
    priority: "core",
  },
  {
    href: "/lessons",
    title: "Chart Academy lessons",
    description: `${CHART_ACADEMY_STATS.lessonCount} structured lessons on structure, price action, and execution.`,
    priority: "learn",
  },
  {
    href: "/solutions",
    title: "Free trading demos",
    description: "Interactive risk, RR, and consistency demos — free preview.",
    priority: "learn",
  },
  {
    href: "/faq",
    title: "FAQ",
    description: "Pricing, Premium access, bots, and account help.",
    priority: "support",
  },
];

export const HOMEPAGE_FAQS: { question: string; answer: string }[] = [
  {
    question: "What is Quicksilver Algo?",
    answer: `Quicksilver is the TradeLocker Desktop operating system for structure, risk, journaling, live growth tracking, and optional supervised automation. It serves live-account traders and prop/evaluation traders. Premium Quant is ${PREMIUM_PRICE}/mo after trial or first-month discount. The 3-day free trial does not include Quant Protocol.`,
  },
  {
    question: "How do I get the Quicksilver Quant Protocol bot on TradeLocker?",
    answer:
      "Subscribe to Premium Quant, install TradeLocker Desktop (the bot is not available on TradeLocker Web), open Quicksilver → Trading Bots → Quant Protocol for settings, then enable the bot from the TradeLocker desktop marketplace.",
  },
  {
    question: "Is the 7-day playbook a guaranteed pass?",
    answer: `No. It is a day-by-day framework: profit caps so no single day becomes more than ~20% of total profit where that rule applies, fixed risk, and a tracker. You can still lose. Confirm your firm’s current rules.`,
  },
  {
    question: "What does break of structure (BOS) mean in trading?",
    answer:
      "BOS means price closes beyond a prior swing high or low in the direction of the existing trend — a continuation structure signal. See our free Break of Structure guide for bullish vs bearish BOS and retest entries.",
  },
  {
    question: "How much is Premium Quant?",
    answer: `Premium Quant is ${PREMIUM_PRICE}/mo after trial or first-month discount. Start with a 3-day free trial of the workflow stack (bot not included) or first month 30% off ($104.99). Quant Protocol is Premium-only.`,
  },
  {
    question: "Can I cancel Premium anytime?",
    answer: `Yes. Premium Quant is ${PREMIUM_PRICE}/mo and you can cancel anytime to stop future billing. Manage via support or your Stripe receipt portal. Trading involves risk — results are never guaranteed.`,
  },
];

export const HOMEPAGE_AUTHORITY_BLOCKS: {
  heading: string;
  paragraphs: string[];
}[] = [
  {
    heading: "Official E8 Markets partner — TradeLocker OS for evaluations and live accounts",
    paragraphs: [
      `Quicksilver is the execution + risk workflow stack for E8 Markets traders on TradeLocker. E8 is the exclusive recommended prop firm. Live-account operators still use the live growth terminal, journal, and review loop. Evaluation traders use the E8 Execution Center, a ${PROP_FIRM_CHALLENGE_DAYS}-day playbook, and E8-mapped risk presets. ${TOOL_COUNT} planning engines and Chart Academy sit in the same desk.`,
      "Quant Protocol is optional and Premium-only. It is not included in the 3-day free trial and does not run on TradeLocker Web. Manual traders can use the full workflow stack without the bot. Quicksilver does not guarantee a pass, payout, or funded account.",
    ],
  },
  {
    heading: "Prop firm challenge math that actually matches the rules",
    paragraphs: [
      "Most failed challenges are not “bad entries” alone — they are consistency breaches, oversized best days, or daily loss hits. Our free guides and tools focus on profit caps, risk per trade, and probability of survival under prop rules used by firms like FTMO, FundedNext, Apex, and Topstep.",
      "Start with the 7-Day Prop Firm Playbook launch page or the prop firm authority hub for firm-specific long-form guides. Free demos on the solutions pages let you test risk and RR ideas before you upgrade.",
    ],
  },
  {
    heading: "Chart structure education traders actually search for",
    paragraphs: [
      "Break of structure (BOS), market structure, Fibonacci, and CFD/forex chart reading are covered in Chart Academy and free public guides. The BOS guide answers high-intent queries in plain language with retest workflow — then links into lessons and Premium tools for execution.",
      "Educational content only. Nothing here is financial advice or a promise of profits. Prop firms set their own rules; always verify your firm’s current challenge terms.",
    ],
  },
];

/** Cross-link set excluding the current path (for internal linking modules). */
export function moneyPagesExcept(currentPath: string): MoneyPageLink[] {
  const normalized =
    currentPath === "" ? "/" : currentPath.endsWith("/") && currentPath !== "/"
      ? currentPath.slice(0, -1)
      : currentPath;
  return MONEY_PAGES.filter((p) => p.href !== normalized);
}
