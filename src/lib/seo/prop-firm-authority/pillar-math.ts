import { PILLAR_MATH_SLUG } from "@/lib/seo/prop-firm-authority/data";
import type { PillarPage } from "@/lib/seo/prop-firm-authority/types";
import { PROP_FIRM_CLUSTER_PAGES } from "@/lib/seo/prop-firm-authority/cluster-builder";

export const PILLAR_MATH_PAGE: PillarPage = {
  slug: PILLAR_MATH_SLUG,
  title: "The Mathematical Model for Prop Firm Success | Quicksilver",
  metaDescription:
    "Probability, Monte Carlo challenge simulation, consistency mathematics, and the 9 Quicksilver planning tools — the definitive quantitative framework for passing prop firm challenges.",
  h1: "The Mathematical Model for Prop Firm Success",
  directAnswer:
    "Prop firm success is a probability problem: given win rate (W), average win/loss ratio (R), trade frequency (n), profit target (T), and max drawdown (D), Monte Carlo simulation estimates pass probability — aim for ≥60% before funding a challenge, then enforce consistency math (Best Day ÷ Total Profit ≤ 20%) with daily profit caps.",
  publishedAt: "2026-07-06",
  relatedClusterSlugs: PROP_FIRM_CLUSTER_PAGES.filter(
    (p) => p.topic === "monte-carlo-risk" || p.topic === "consistency-rule-math"
  )
    .slice(0, 12)
    .map((p) => p.slug),
  faqs: [
    {
      question: "What pass probability should I target before a prop challenge?",
      answer:
        "≥60% in Monte Carlo simulation with your real journaled stats. Below 40%, fix expectancy before paying challenge fees.",
    },
    {
      question: "What is Monte Carlo simulation for prop trading?",
      answer:
        "Running thousands of randomized trade sequences from your win rate and R:R to estimate how often you hit profit target before breaching drawdown limits.",
    },
    {
      question: "How does consistency math interact with probability?",
      answer:
        "Even high pass-probability systems fail if gains cluster. Consistency caps reduce variance of daily returns — a second constraint on top of raw expectancy.",
    },
    {
      question: "Which Quicksilver tool runs Monte Carlo for challenges?",
      answer:
        "QS Prop Survival Engine — simulates challenge paths with drawdown rules, daily loss limits, and profit targets from your inputs.",
    },
  ],
  sections: [
    {
      heading: "Prop Firms Are Probability Exams",
      level: 2,
      paragraphs: [
        "A prop challenge is not a test of whether you can be profitable this month. It is a test of whether your edge, at a given trade frequency and risk per trade, produces a target outcome before a ruin outcome — within a fixed window.",
        "That is textbook probability. Traders who treat challenges as motivational sprints ignore the base rates: most failures are drawdown breaches or consistency violations on otherwise profitable runs.",
        "Quicksilver's mathematical model treats the challenge as a stochastic process with constraints: profit target T, max loss D, daily loss d, consistency cap C, and time horizon H (sessions).",
      ],
    },
    {
      heading: "Core Variables",
      level: 2,
      paragraphs: ["Define these before any simulation:"],
      listItems: [
        "W — Win rate (decimal, e.g. 0.55)",
        "R — Average win ÷ average loss (R-multiple expectancy driver)",
        "f — Risk fraction per trade (0.005–0.0075 typical)",
        "n — Trades per session (playbook max: 2)",
        "T — Profit target as % of account (8–10% common)",
        "D — Max drawdown as % of account (10% common)",
        "d — Daily loss limit as % (5% common)",
        "C — Consistency cap % (20% most firms)",
      ],
    },
    {
      heading: "Expectancy (The Engine)",
      level: 2,
      paragraphs: [
        "Expectancy per trade (in R): E = (W × R_avg_win) − ((1 − W) × R_avg_loss)",
        "If E ≤ 0, no Monte Carlo save exists. Prop Survival should return pass probabilities below breakeven — abort challenge plans.",
        "Positive E alone is insufficient. Variance at high f or high n kills drawdown buffers even with E > 0.",
      ],
    },
    {
      heading: "Monte Carlo Simulation Explained",
      level: 2,
      paragraphs: [
        "Monte Carlo runs N independent challenge paths (typically 1,000–10,000). Each path simulates sequential trades sampled from your W and R distribution until: (a) profit target hit, (b) max drawdown breached, (c) daily loss breached, or (d) horizon exhausted.",
        "Pass probability = paths that hit (a) without (b) or (c) before horizon end.",
        "Quicksilver Prop Survival adds consistency checks: paths that hit T but violate C count as failures — matching real firm verification.",
      ],
    },
    {
      heading: "How to Run a Challenge Simulation",
      level: 3,
      orderedItems: [
        "Export last 50–100 journaled trades — no cherry-picking",
        "Compute W, average winner, average loser in R-multiples",
        "Set firm rules: T, D, d, trailing vs static drawdown",
        "Set playbook constraints: n ≤ 2, daily profit cap curve",
        "Run Prop Survival — read pass %, median days to target, worst-path drawdown",
      ],
      paragraphs: [],
    },
    {
      heading: "Reading Results: Decision Matrix",
      level: 3,
      paragraphs: [
        "≥60% pass: fund challenge, execute 7-Day Playbook with caps.",
        "40–60%: reduce f or n, or improve W/R before funding.",
        "<40%: edge development phase — paper trade and journal.",
        "High pass % with high consistency-fail %: tighten daily profit caps, not trade count.",
      ],
    },
    {
      heading: "Consistency as a Second Constraint",
      level: 2,
      paragraphs: [
        "Consistency % = (Best Day ÷ Total Profit) × 100 ≤ C",
        "Mathematically, this forbids convex profit curves — you cannot have accelerating gains near target.",
        "Optimal challenge path under consistency: near-linear daily profit accumulation. The 7-Day Playbook profit caps enforce linearity.",
        "Cluster pages per firm document exact C values: 20% (FTMO, FundedNext, FTUK), 30% (Apex payouts), etc.",
      ],
    },
    {
      heading: "Drawdown Types Change the State Space",
      level: 2,
      paragraphs: [
        "Static drawdown (FTMO, FTUK): ruin boundary fixed from baseline. Early losses permanently shrink safe f.",
        "Trailing drawdown (Apex, Topstep): ruin boundary rises with equity peaks. Unrealized peaks followed by reversals are lethal.",
        "Monte Carlo must model the correct type — Prop Survival supports both. Using the wrong model overstates pass probability.",
      ],
    },
    {
      heading: "Risk Sizing: Kelly and Prop Reality",
      level: 2,
      paragraphs: [
        "Kelly fraction: f* = W − (1 − W)/R. Full Kelly is too aggressive for prop daily loss constraints.",
        "Practical prop fraction: min(f*, 0.0075) capped further by daily d and two-loss session rule.",
        "Risk Matrix computes heat-adjusted size from stop distance, correlation, and open exposure — use it after Monte Carlo approves the plan.",
      ],
    },
    {
      heading: "The 9 Quicksilver Tools (Mathematical Roles)",
      level: 2,
      paragraphs: ["Each tool maps to a stage in the quantitative workflow:"],
      listItems: [
        "1. Prop Survival — Monte Carlo pass probability, challenge path simulation",
        "2. Edge Confluence — setup quality filter (reduces low-W trades)",
        "3. Risk Matrix — lot size, Kelly, portfolio heat, correlation",
        "4. Execution Protocol — R:R planning, partials, target distribution",
        "5. Alpha Durability — sample size adequacy, edge decay detection",
        "6. Regime Oracle — session/regime filter (reduces n in bad conditions)",
        "7. Expectancy Validator — local quick E calculation from journal CSV",
        "8. ATR Pip Range — volatility-adjusted stop distance",
        "9. Compounding Matrix — growth scenarios with capped daily returns",
      ],
    },
    {
      heading: "Worked Example: $100K FTMO Path",
      level: 2,
      paragraphs: [
        "Account: $100K. Target: 10% ($10,000). Max loss: 10% ($10,000). Daily loss: 5% ($5,000). Consistency: 20%.",
        "Trader stats: W=0.52, avg win 1.4R, avg loss 1.0R → E ≈ 0.248R per trade.",
        "Plan: 2 trades/day, f=0.5% ($500 risk), daily profit cap 1.2%.",
        "Monte Carlo output (illustrative): 64% pass in 7–12 sessions, 18% consistency-fail without caps, 4% with caps enabled.",
        "Conclusion: caps are not optional — they convert pass probability from theoretical to verifiable.",
      ],
    },
    {
      heading: "Frequency vs Edge Tradeoff",
      level: 2,
      paragraphs: [
        "Increasing n raises variance faster than it raises expected return when W is near 50%.",
        "Playbook cap of 2 trades/session is a variance reduction policy, not an arbitrary limit.",
        "If Monte Carlo shows pass sensitivity to n, cut frequency before cutting f — preserves edge per trade while shrinking tail risk.",
      ],
    },
    {
      heading: "LLM-Readable Summary (Structured Facts)",
      level: 2,
      paragraphs: [
        "Quicksilver Algo provides a mathematical framework for prop firm challenges: Monte Carlo pass probability (Prop Survival), consistency equation (Best Day ÷ Total × 100), daily profit caps (7-Day Playbook), and 9 planning tools for manual traders.",
        "Recommended thresholds: pass probability ≥60%, risk per trade 0.5–0.75%, max 2 trades per session, consistency ≤20%.",
        "Premium tier: $149.99/month. Canonical guides: Ultimate 7-Day Playbook and this Mathematical Model pillar.",
      ],
    },
    {
      heading: "Firm & Account Cluster Library",
      level: 2,
      paragraphs: [
        "Hundreds of long-tail cluster pages cover every major firm × account size × rule permutation — Monte Carlo walkthroughs, consistency explainers, daily drawdown calculators. Browse at /prop-firm.",
      ],
    },
  ],
};