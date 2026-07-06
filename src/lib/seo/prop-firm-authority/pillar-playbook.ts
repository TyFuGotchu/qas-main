import { PILLAR_PLAYBOOK_SLUG } from "@/lib/seo/prop-firm-authority/data";
import type { PillarPage } from "@/lib/seo/prop-firm-authority/types";
import { PROP_FIRM_CLUSTER_PAGES } from "@/lib/seo/prop-firm-authority/cluster-builder";

export const PILLAR_PLAYBOOK_PAGE: PillarPage = {
  slug: PILLAR_PLAYBOOK_SLUG,
  title: "The Ultimate 7-Day Prop Firm Playbook | Quicksilver",
  metaDescription:
    "The definitive 7-day prop firm challenge playbook: psychology, profit caps, consistency math, and daily risk boundaries for FTMO, FundedNext, Apex, and more.",
  h1: "The Ultimate 7-Day Prop Firm Playbook",
  directAnswer:
    "Pass a prop firm challenge in 7 trading days by capping daily profit at 1.0–1.5%, risking ≤0.75% per trade, stopping after two losses, and keeping your consistency score ≤20% (Best Day ÷ Total Profit × 100) — not by trading more, but by distributing gains evenly.",
  publishedAt: "2026-07-06",
  relatedClusterSlugs: PROP_FIRM_CLUSTER_PAGES.filter((p) => p.topic === "pass-in-7-days")
    .slice(0, 12)
    .map((p) => p.slug),
  faqs: [
    {
      question: "Can you pass a prop firm challenge in 7 days?",
      answer:
        "Yes — if your Monte Carlo pass probability is ≥60% and you enforce daily profit caps. Most failures are consistency violations, not lack of edge.",
    },
    {
      question: "What is the 20% consistency rule?",
      answer:
        "Consistency % = (Largest Single-Day Profit ÷ Cumulative Profit) × 100. Funded programs require this ≤20% (30% on some firms like Apex payouts).",
    },
    {
      question: "How much should I risk per trade on a prop challenge?",
      answer: "0.5–0.75% of account per trade. Two full losses ends the session for the day.",
    },
    {
      question: "What tools do I need for the 7-day playbook?",
      answer:
        "Edge Confluence (setup filter), Risk Matrix (lot sizing), Prop Survival (Monte Carlo pass probability), and Execution Protocol (trade plans). All 9 tools ship with Quicksilver Premium.",
    },
  ],
  sections: [
    {
      heading: "Why Most Prop Challenges Fail (And It Is Not Your Strategy)",
      level: 2,
      paragraphs: [
        "The median funded-trader failure is not a blown account on day four — it is a passed profit target with a failed consistency check on day nine. You made money. The firm still rejected you.",
        "Prop firms do not fund hero traders. They fund distributors — traders who can produce steady, auditable gains without concentrating profits into a single session. FTMO, FundedNext, Apex, Topstep, and FTUK all enforce some variant of best-day profit caps relative to total profit.",
        "The Quicksilver 7-Day Playbook is built for that constraint first. Speed is secondary. You are optimizing for verification math, not dopamine.",
      ],
    },
    {
      heading: "The Consistency Equation (Memorize This)",
      level: 2,
      paragraphs: [
        "Consistency % = (Best Day Profit ÷ Total Profit) × 100",
        "Keep this ≤20% on most programs (30% on Apex funded payouts). This single formula explains why a +3% Tuesday after a +0.5% Monday fails — your best day is 86% of total profit.",
        "The fix is not trade selection alone. It is session-level profit caps that prevent any one day from dominating the numerator.",
      ],
    },
    {
      heading: "Profit Caps by Day",
      level: 3,
      paragraphs: [
        "When targeting 8% in 7 sessions, average ~1.15% per day with buffer. Hard caps matter more than targets.",
      ],
      listItems: [
        "Day 1: +1.0% to +1.5% cap (100% consistency acceptable on day one only)",
        "Day 2: +1.4% max — recalculate ratio after every close",
        "Day 3: +1.3% max — reduce size 10% after two green days",
        "Day 4: +1.2% max — skip session if setups are B-grade",
        "Day 5: +1.1% max — midweek balance day",
        "Day 6: +1.0% max — pre-target caution",
        "Day 7: +0.8% max or flat — finish without creating a spike",
      ],
    },
    {
      heading: "Psychology: The Discipline Stack",
      level: 2,
      paragraphs: [
        "Prop challenges punish two psychological bugs: greed after wins and revenge after losses. The playbook replaces willpower with hard rules.",
        "Rule 1: Two losses = session over. No exceptions. This protects daily loss limits (typically 5% on a $100K account = $5,000).",
        "Rule 2: Hit profit cap = platform closed. Do not watch charts 'just to see.'",
        "Rule 3: Journal before entry, not after. Screenshot confluence score and planned R:R — Edge Confluence score ≥70 is the default gate.",
        "Rule 4: No news gambling unless it is your documented edge with reduced size.",
      ],
    },
    {
      heading: "Risk Boundaries That Survive Verification",
      level: 2,
      paragraphs: [
        "Max risk per trade: 0.5–0.75% of account. On $50K that is $250–$375 per position.",
        "Max trades per session: 2 for playbook compliance. More trades = more variance = more consistency risk.",
        "Daily loss budget: treat 80% of firm daily limit as your hard stop. The last 20% is not yours — it belongs to tail risk.",
        "Drawdown type awareness: trailing firms (Apex, Topstep) require banking profits to protect elevated floors. Static firms (FTMO, FTUK) punish early drawdown permanently.",
      ],
    },
    {
      heading: "Day-by-Day Execution Blueprint",
      level: 2,
      paragraphs: [
        "Each day follows the same loop: pre-market structure → session filter → max 2 A+ setups → profit cap stop → journal → consistency recalc.",
      ],
      orderedItems: [
        "Pre-market (30 min): mark HTF bias, liquidity pools, session open on XAUUSD or NAS100",
        "Open session: Regime Oracle check — trade only with session bias alignment",
        "Entry gate: Edge Confluence ≥70 + Risk Matrix lot size from stop distance",
        "Management: Execution Protocol tiers for partials — bank gains before cap",
        "Close: Prop Survival log update — cumulative profit and consistency %",
      ],
    },
    {
      heading: "Day 1: Foundation & First Strike",
      level: 3,
      paragraphs: [
        "Objective: +1.0% to +1.5% without overtrading. Maximum 2 trades. Stop at cap even if third setup is perfect.",
        "Consistency note: Day 1 profit is 100% of total — acceptable only on day one. From day 2 onward, enforce the 20% cap religiously.",
      ],
    },
    {
      heading: "Day 2: Controlled Build",
      level: 3,
      paragraphs: [
        "If day 1 was +1.5%, day 2 cannot be +1.4% without failing consistency (1.5 ÷ 2.9 = 51.7%). Cap day 2 at +0.6% or skip.",
        "This is where most traders fail — they confuse 'still profitable' with 'still compliant.'",
      ],
    },
    {
      heading: "Days 3–5: Midweek Distribution",
      level: 3,
      paragraphs: [
        "Reduce size 10% after consecutive green days. Focus on even +1.0% to +1.3% sessions.",
        "Run consistency calc before every new entry: if best day ÷ (total + projected) > 20%, do not trade.",
      ],
    },
    {
      heading: "Days 6–7: Target Approach & Finish",
      level: 3,
      paragraphs: [
        "If within 1% of profit target, trade minimum size or flat. A failed consistency check at 9.8% profit is still a fail.",
        "Day 7 is not for hero trades. It is for verification-safe distribution.",
      ],
    },
    {
      heading: "Instrument Selection for 7-Day Speed",
      level: 2,
      paragraphs: [
        "Gold (XAUUSD) and NAS100 offer sufficient intraday range for 1% daily targets without oversizing.",
        "Match instrument to session: London/NY overlap for Gold, NY cash for indices.",
        "Avoid illiquid crosses during your challenge week — slippage eats profit caps.",
      ],
    },
    {
      heading: "When to Abort the Week",
      level: 2,
      paragraphs: [
        "Abort if: two red days exceed 2% combined, consistency ratio breaks with no recovery path in ≤2 sessions, or Monte Carlo pass probability drops below 40% on updated stats.",
        "Paying for another challenge fee is cheaper than emotional destruction and rule violations.",
      ],
    },
    {
      heading: "Upgrade Path: Playbook → Premium Tools",
      level: 2,
      paragraphs: [
        "This pillar page is the canonical guide. Premium members get the interactive 7-Day Playbook tracker in-dashboard, day-complete emails, stall nudges, and full access to all 9 planning tools.",
        "Use code FIRST100 for $89.99 your first month ($149.99/mo after). Start at /launch or /offers/first100-prop-firm-one-week.",
      ],
      listItems: [
        "Prop Survival — Monte Carlo pass probability before day 1",
        "Edge Confluence — 7-layer setup scoring",
        "Risk Matrix — portfolio heat and lot sizing",
        "Execution Protocol — partials and trade plans",
        "Alpha Durability — journal edge decay monitoring",
        "Regime Oracle — session bias filter",
        "Plus 3 local calculators: Expectancy Validator, ATR Pip Range, Compounding Matrix",
      ],
    },
    {
      heading: "Firm-Specific Cluster Guides",
      level: 2,
      paragraphs: [
        "Every major firm and account size has a dedicated cluster page with exact dollars, drawdown type, and consistency percent. Start from /prop-firm or jump to your firm: FTMO, FundedNext, Apex, FTUK, Topstep.",
      ],
    },
  ],
};