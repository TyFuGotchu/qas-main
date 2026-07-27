import {
  ACCOUNT_SIZES,
  AUTHORITY_PROP_FIRMS,
  CLUSTER_TOPICS,
  PILLAR_PATHS,
  type AccountSize,
  type AuthorityPropFirm,
  type ClusterTopicSlug,
  dailyLossDollars,
  maxDrawdownDollars,
  profitTargetDollars,
} from "@/lib/seo/prop-firm-authority/data";
import type { AuthoritySection, PropFirmClusterPage } from "@/lib/seo/prop-firm-authority/types";
import {
  PREMIUM_PRICE,
} from "@/lib/pricing-constants";

const PUBLISHED_AT = "2026-07-06";
const PREMIUM_CTA = `Quicksilver Premium (${PREMIUM_PRICE}/mo) unlocks the 7-Day Prop Firm Playbook, Prop Survival Monte Carlo simulator, and all 9 planning tools.`;

function premiumPlaybookLink(): string {
  return PILLAR_PATHS.playbook;
}

function premiumMathLink(): string {
  return PILLAR_PATHS.math;
}

function buildPassIn7Days(firm: AuthorityPropFirm, size: AccountSize): PropFirmClusterPage {
  const target = profitTargetDollars(size);
  const slug = `${firm.slug}-pass-${size.slug}-in-7-days`;
  const h1 = `How to Pass the ${firm.shortName} ${size.label} Challenge in 7 Days`;
  const dailyCap = ((size.typicalProfitTargetPct / 7) * 1.15).toFixed(2);

  const sections: AuthoritySection[] = [
    {
      heading: "Understanding the Problem",
      level: 2,
      paragraphs: [
        `Most ${firm.shortName} ${size.label} failures are not strategy failures — they are distribution failures. Traders hit the ${size.typicalProfitTargetPct}% profit target (${target.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}) in three lucky sessions, then breach ${firm.consistencyRule.toLowerCase()}.`,
        `${firm.shortName} enforces ${firm.dailyLossLimit.toLowerCase()} and ${firm.maxDrawdown.toLowerCase()}. On a ${size.label} account, that means you cannot recover from a single oversize loss day without resetting the challenge.`,
      ],
    },
    {
      heading: "The 7-Day Pass Framework",
      level: 2,
      paragraphs: [
        `The Quicksilver 7-Day Playbook caps each session at ~${dailyCap}% account growth and forces even profit distribution so your consistency score stays under ${firm.consistencyPercent}%.`,
      ],
      orderedItems: [
        `Day 1–2: Establish rhythm — max 2 trades, +1.0% to +1.5% cap, run Edge Confluence (score ≥ 70).`,
        `Day 3–4: Recalculate consistency after every closed trade — stop if best day ÷ total profit exceeds ${firm.consistencyPercent}%.`,
        `Day 5–6: Reduce size 10% after green days; target +1.0% to +1.3% per session.`,
        `Day 7: Only trade if cumulative profit is within ${target.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} reach AND consistency math is green.`,
      ],
    },
    {
      heading: "Daily Profit Cap Math",
      level: 3,
      paragraphs: [
        `Formula: Consistency % = (Best Day Profit ÷ Total Profit) × 100. Keep ≤ ${firm.consistencyPercent}% at all times after Day 1.`,
        `On ${size.label}, a +$${Math.round(size.notional * 0.015).toLocaleString()} day early in the challenge can dominate your tally. The playbook profit cap prevents hero days from failing ${firm.shortName} verification.`,
      ],
    },
    {
      heading: "Risk Boundaries for This Account",
      level: 2,
      paragraphs: [
        `Max risk per trade: 0.5–0.75% of ${size.label} ($${Math.round(size.notional * 0.0075).toLocaleString()} at 0.75%).`,
        `Daily loss budget: ${firm.dailyLossLimit} ≈ $${dailyLossDollars(size).toLocaleString()} on this notional.`,
        `Two consecutive losses ends the session — protect the trailing/static drawdown ceiling of $${maxDrawdownDollars(size).toLocaleString()}.`,
      ],
    },
    {
      heading: "Tools to Run Before Day 1",
      level: 2,
      paragraphs: [PREMIUM_CTA],
      listItems: [
        "Prop Survival Engine — Monte Carlo pass probability at your planned trade frequency",
        "Risk Matrix — lot size from stop distance and daily loss budget",
        "Edge Confluence — filter setups before every entry",
      ],
    },
  ];

  const faqs = [
    {
      question: `Can you pass ${firm.shortName} ${size.label} in exactly 7 days?`,
      answer: `Yes — if your edge supports ≥60% pass probability in Monte Carlo and you cap daily gains. The ${size.typicalProfitTargetPct}% target ($${target.toLocaleString()}) requires ~${(size.typicalProfitTargetPct / 7).toFixed(2)}% average daily growth with buffers for ${firm.consistencyPercent}% consistency.`,
    },
    {
      question: `What is the ${firm.shortName} consistency rule?`,
      answer: firm.consistencyRule,
    },
    {
      question: `What happens if I exceed the daily profit cap?`,
      answer: `Stop trading immediately. Banking oversized gains pushes your best-day ratio above ${firm.consistencyPercent}% and fails most ${firm.shortName} funded verification checks.`,
    },
  ];

  return {
    slug,
    title: `${h1} | Quicksilver`,
    metaDescription: `Step-by-step 7-day plan to pass ${firm.shortName} ${size.label}: profit caps, ${firm.consistencyPercent}% consistency math, and risk boundaries. Free framework + Premium playbook.`,
    h1,
    directAnswer: `Yes — you can pass the ${firm.shortName} ${size.label} challenge in 7 trading days by capping daily profit at ~${dailyCap}%, keeping risk ≤0.75% per trade, and maintaining a consistency score ≤${firm.consistencyPercent}% using the Quicksilver 7-Day Playbook.`,
    format: "guide",
    topic: "pass-in-7-days",
    firmSlug: firm.slug,
    firmName: firm.name,
    sizeSlug: size.slug,
    sizeLabel: size.label,
    toolSlug: "prop-survival",
    intro: `This guide maps the exact 7-day execution plan for ${firm.name} ${size.label} accounts — psychology, profit caps, and consistency math included.`,
    sections,
    faqs,
    relatedSlugs: [],
    publishedAt: PUBLISHED_AT,
  };
}

function buildConsistencyRuleMath(firm: AuthorityPropFirm): PropFirmClusterPage {
  const slug = `${firm.slug}-consistency-rule-math`;
  const h1 = `The Math Behind the ${firm.shortName} Consistency Rule`;

  const sections: AuthoritySection[] = [
    {
      heading: "The Formula",
      level: 2,
      paragraphs: [
        `Consistency % = (Largest Single-Day Profit ÷ Cumulative Profit) × 100`,
        `${firm.shortName} requires this ratio to stay at or below ${firm.consistencyPercent}% on funded payouts and many challenge verifications. ${firm.consistencyRule}.`,
      ],
    },
    {
      heading: "Worked Example",
      level: 3,
      paragraphs: [
        `Suppose you are up $4,000 total and your best day contributed $1,200. Consistency = (1,200 ÷ 4,000) × 100 = 30%. That fails a ${firm.consistencyPercent}% rule even though you are profitable.`,
        `Fix: cap each day at roughly 1/${Math.ceil(100 / firm.consistencyPercent)} of running total profit until the distribution evens out.`,
      ],
    },
    {
      heading: "Why Traders Fail This Rule",
      level: 2,
      paragraphs: [
        "Hero days feel like success but mathematically guarantee payout rejection.",
        "Revenge trading after a red day creates a second spike day when recovery comes too fast.",
        "Oversizing after a win streak concentrates gains into one session.",
      ],
      listItems: [
        "Set a hard session stop in dollars, not just R-multiples",
        "Log cumulative profit before every new entry",
        "Use Prop Survival to simulate pass paths with capped daily gains",
      ],
    },
    {
      heading: "Next Step: The Playbook",
      level: 2,
      paragraphs: [
        `The Ultimate 7-Day Prop Firm Playbook (${premiumPlaybookLink()}) implements daily profit caps so you never breach ${firm.shortName}'s consistency math.`,
        PREMIUM_CTA,
      ],
    },
  ];

  return {
    slug,
    title: `${h1} | Quicksilver`,
    metaDescription: `How ${firm.shortName} calculates consistency score: formula, worked examples, and profit-cap fixes. ${firm.consistencyPercent}% rule explained.`,
    h1,
    directAnswer: `The ${firm.shortName} consistency rule uses: Consistency % = (Best Day Profit ÷ Total Profit) × 100. It must stay ≤${firm.consistencyPercent}%. One oversized winning day fails even when you hit the profit target.`,
    format: "explainer",
    topic: "consistency-rule-math",
    firmSlug: firm.slug,
    firmName: firm.name,
    sizeSlug: null,
    sizeLabel: null,
    toolSlug: "prop-survival",
    intro: `Exact mathematics behind ${firm.name}'s consistency requirement — and how to stay compliant while passing fast.`,
    sections,
    faqs: [
      {
        question: `What is the ${firm.shortName} consistency rule?`,
        answer: firm.consistencyRule,
      },
      {
        question: `How do I lower my consistency score after a spike day?`,
        answer: `Stop trading until additional smaller green days increase total profit without adding to the best-day numerator. Alternatively, cap every session prospectively using the 7-Day Playbook profit caps.`,
      },
    ],
    relatedSlugs: [],
    publishedAt: PUBLISHED_AT,
  };
}

function buildDailyDrawdown(firm: AuthorityPropFirm, size: AccountSize): PropFirmClusterPage {
  const slug = `${firm.slug}-${size.slug}-daily-drawdown`;
  const dailyLimit = dailyLossDollars(size);
  const h1 = `${firm.shortName} ${size.label} Daily Drawdown: Limits & Risk Calculator`;

  const sections: AuthoritySection[] = [
    {
      heading: "Your Daily Loss Budget",
      level: 2,
      paragraphs: [
        `${firm.shortName} enforces ${firm.dailyLossLimit.toLowerCase()}. On ${size.label}, ${size.typicalDailyLossPct}% ≈ $${dailyLimit.toLocaleString()} maximum intraday loss before breach.`,
      ],
    },
    {
      heading: "Step 1: Convert Stop Distance to Lot Size",
      level: 3,
      paragraphs: [
        "Measure stop distance in points or pips on your instrument.",
        "Divide daily loss budget by (stop distance × point value) to get maximum contracts/lots.",
      ],
    },
    {
      heading: "Step 2: Apply the Two-Loss Rule",
      level: 3,
      paragraphs: [
        `If each trade risks 0.5% ($${Math.round(size.notional * 0.005).toLocaleString()}), two full losses = 1.0% — still inside the daily cap.`,
        `Three marginal losses without adjustment is how ${size.label} accounts fail before lunch.`,
      ],
    },
    {
      heading: "Step 3: Session Hard Stop",
      level: 3,
      paragraphs: [
        `Set a platform alert at -$${Math.round(dailyLimit * 0.8).toLocaleString()} (80% of daily limit). Walk away — ${firm.drawdownType} drawdown does not forgive revenge entries.`,
      ],
    },
  ];

  return {
    slug,
    title: `${h1} | Quicksilver`,
    metaDescription: `Calculate ${firm.shortName} ${size.label} daily drawdown limits. Step-by-step lot sizing from a $${dailyLimit.toLocaleString()} daily loss budget.`,
    h1,
    directAnswer: `On a ${firm.shortName} ${size.label} account, the daily drawdown limit is approximately $${dailyLimit.toLocaleString()} (${size.typicalDailyLossPct}% of ${size.label}). Risk 0.5% per trade, stop after two losses, and hard-stop at 80% of the daily budget.`,
    format: "step-by-step",
    topic: "daily-drawdown",
    firmSlug: firm.slug,
    firmName: firm.name,
    sizeSlug: size.slug,
    sizeLabel: size.label,
    toolSlug: "risk-matrix",
    intro: `Practical daily drawdown math for ${firm.name} ${size.label} traders — from dollars to lot size.`,
    sections,
    faqs: [
      {
        question: `Does ${firm.shortName} use trailing or static daily drawdown?`,
        answer: `${firm.shortName} uses ${firm.drawdownType} drawdown on max loss (${firm.maxDrawdown.toLowerCase()}). Daily limits are evaluated per session calendar day on most plans.`,
      },
    ],
    relatedSlugs: [],
    publishedAt: PUBLISHED_AT,
  };
}

function buildConsistencyScore(firm: AuthorityPropFirm): PropFirmClusterPage {
  const slug = `${firm.slug}-consistency-score-impossible`;
  const h1 = `Is the ${firm.consistencyPercent}% Consistency Score on ${firm.shortName} Impossible?`;

  const sections: AuthoritySection[] = [
    {
      heading: "Short Answer",
      level: 2,
      paragraphs: [
        `No — the ${firm.consistencyPercent}% consistency score is mathematically straightforward when you cap daily gains. It feels impossible only when traders optimize for speed instead of distribution.`,
      ],
    },
    {
      heading: "When It Actually Fails",
      level: 2,
      paragraphs: [
        "You stack multiple winning days unevenly (e.g. +3%, +0.2%, +0.1%).",
        "You swing oversized after news events.",
        "You count open P&L spikes as 'the day' without closing partials strategically.",
      ],
    },
    {
      heading: "Three Fixes That Work",
      level: 2,
      listItems: [
        `Profit cap per session: ~${(8 / 7).toFixed(1)}% of account when targeting 8% in 7 days`,
        "Close partials to bank gains before session end",
        "Run Prop Survival Monte Carlo with capped daily returns before day 1",
      ],
      paragraphs: [],
    },
  ];

  return {
    slug,
    title: `${h1} | Quicksilver`,
    metaDescription: `Is ${firm.shortName}'s ${firm.consistencyPercent}% consistency score impossible? No — here's the math and the profit-cap system that passes verification.`,
    h1,
    directAnswer: `No — the ${firm.consistencyPercent}% consistency score on ${firm.shortName} is not impossible. It fails traders who stack profits unevenly. Capping each day at ~1.1–1.5% account growth while targeting 8–10% total keeps the ratio compliant.`,
    format: "faq",
    topic: "consistency-score",
    firmSlug: firm.slug,
    firmName: firm.name,
    sizeSlug: null,
    sizeLabel: null,
    toolSlug: "prop-survival",
    intro: `Direct answer to the most common ${firm.shortName} consistency objection — with math, not motivation.`,
    sections,
    faqs: [
      {
        question: h1,
        answer: `Not impossible. The formula is (Best Day ÷ Total Profit) × 100 ≤ ${firm.consistencyPercent}%. Profit caps and the 7-Day Playbook keep you compliant.`,
      },
      {
        question: `What is ${firm.shortName}'s consistency rule?`,
        answer: firm.consistencyRule,
      },
    ],
    relatedSlugs: [],
    publishedAt: PUBLISHED_AT,
  };
}

function buildDrawdownType(firm: AuthorityPropFirm): PropFirmClusterPage {
  const slug = `${firm.slug}-drawdown-type`;
  const h1 = `${firm.shortName} Drawdown Type: ${firm.drawdownType === "trailing" ? "Trailing vs Static" : "Static vs Trailing"} Explained`;

  const sections: AuthoritySection[] = [
    {
      heading: "How This Firm Measures Drawdown",
      level: 2,
      paragraphs: [
        `${firm.shortName} uses a ${firm.drawdownType} drawdown model: ${firm.maxDrawdown}.`,
        firm.drawdownType === "trailing"
          ? "Trailing means your loss limit rises with equity peaks — you cannot give back new highs without shrinking available room."
          : "Static means the floor is fixed from starting balance or a defined baseline — easier to model but less forgiving of early drawdown.",
      ],
    },
    {
      heading: "Trading Implications",
      level: 2,
      listItems: [
        firm.drawdownType === "trailing"
          ? "Bank profits regularly — unrealized peaks raise your floor"
          : "Treat early drawdown as permanent capacity loss",
        `Respect ${firm.dailyLossLimit.toLowerCase()} independently of max loss`,
        "Simulate paths in Prop Survival before increasing size",
      ],
      paragraphs: [],
    },
  ];

  return {
    slug,
    title: `${h1} | Quicksilver`,
    metaDescription: `${firm.shortName} ${firm.drawdownType} drawdown explained: how max loss is calculated and how to trade around it.`,
    h1,
    directAnswer: `${firm.shortName} uses ${firm.drawdownType} drawdown — ${firm.maxDrawdown.toLowerCase()}. ${firm.drawdownType === "trailing" ? "Your loss limit trails equity highs, so banking profits protects headroom." : "Your loss floor is static relative to the challenge baseline — early losses permanently reduce margin for error."}`,
    format: "explainer",
    topic: "drawdown-type",
    firmSlug: firm.slug,
    firmName: firm.name,
    sizeSlug: null,
    sizeLabel: null,
    toolSlug: "prop-survival",
    intro: `Developer-trader breakdown of ${firm.name} drawdown mechanics.`,
    sections,
    faqs: [
      {
        question: `Is ${firm.shortName} drawdown trailing or static?`,
        answer: `${firm.drawdownType.charAt(0).toUpperCase() + firm.drawdownType.slice(1)} — ${firm.maxDrawdown}.`,
      },
    ],
    relatedSlugs: [],
    publishedAt: PUBLISHED_AT,
  };
}

function buildProfitTarget(firm: AuthorityPropFirm, size: AccountSize): PropFirmClusterPage {
  const target = profitTargetDollars(size);
  const slug = `${firm.slug}-${size.slug}-profit-target`;
  const h1 = `${firm.shortName} ${size.label} Profit Target: ${size.typicalProfitTargetPct}% Breakdown`;

  const sections: AuthoritySection[] = [
    {
      heading: "Target in Dollars",
      level: 2,
      paragraphs: [
        `${firm.shortName} ${size.label}: ${size.typicalProfitTargetPct}% profit target = $${target.toLocaleString()} on ${size.label} notional. ${firm.profitTarget}.`,
      ],
    },
    {
      heading: "7-Day Distribution Table",
      level: 2,
      paragraphs: ["Even distribution beats speed when consistency rules apply:"],
      listItems: [
        `Day 1: +1.5% ($${Math.round(size.notional * 0.015).toLocaleString()})`,
        `Day 2: +1.2% ($${Math.round(size.notional * 0.012).toLocaleString()})`,
        `Day 3: +1.1% ($${Math.round(size.notional * 0.011).toLocaleString()})`,
        `Day 4–7: +1.0% per day — total ≈ ${size.typicalProfitTargetPct}% with buffer`,
      ],
    },
    {
      heading: "Consistency Check at Target",
      level: 3,
      paragraphs: [
        `At $${target.toLocaleString()} total, best day must stay ≤ $${Math.round(target * (firm.consistencyPercent / 100)).toLocaleString()} (${firm.consistencyPercent}% of profit) to pass ${firm.shortName} verification.`,
      ],
    },
  ];

  return {
    slug,
    title: `${h1} | Quicksilver`,
    metaDescription: `${firm.shortName} ${size.label} profit target: $${target.toLocaleString()} (${size.typicalProfitTargetPct}%). 7-day distribution plan with consistency math.`,
    h1,
    directAnswer: `The ${firm.shortName} ${size.label} profit target is ${size.typicalProfitTargetPct}% — $${target.toLocaleString()}. Spread gains across 7 sessions (~1.1% daily average) to satisfy ${firm.consistencyPercent}% consistency.`,
    format: "guide",
    topic: "profit-target",
    firmSlug: firm.slug,
    firmName: firm.name,
    sizeSlug: size.slug,
    sizeLabel: size.label,
    toolSlug: "execution-protocol",
    intro: `Dollar and percentage breakdown of the ${firm.name} ${size.label} profit objective.`,
    sections,
    faqs: [
      {
        question: `What is the profit target on ${firm.shortName} ${size.label}?`,
        answer: `${size.typicalProfitTargetPct}% ($${target.toLocaleString()}). ${firm.profitTarget}.`,
      },
    ],
    relatedSlugs: [],
    publishedAt: PUBLISHED_AT,
  };
}

function buildMonteCarloRisk(firm: AuthorityPropFirm, size: AccountSize): PropFirmClusterPage {
  const slug = `${firm.slug}-${size.slug}-monte-carlo-risk`;
  const h1 = `How to Calculate Risk on a ${size.label} ${firm.shortName} Account Using Monte Carlo`;

  const sections: AuthoritySection[] = [
    {
      heading: "What Monte Carlo Answers",
      level: 2,
      paragraphs: [
        `Given your win rate, average R:R, and trades-per-week, what is the probability of reaching $${profitTargetDollars(size).toLocaleString()} on ${size.label} without breaching $${maxDrawdownDollars(size).toLocaleString()} max loss?`,
        `Quicksilver Prop Survival runs thousands of simulated challenge paths with ${firm.drawdownType} drawdown rules applied.`,
      ],
    },
    {
      heading: "Step 1: Input Your Stats",
      level: 3,
      orderedItems: [
        "Win rate from last 50+ journaled trades",
        "Average winner and loser in R-multiples",
        "Planned trades per day (max 2 for playbook compliance)",
        `${firm.shortName} ${size.label} notional and ${size.typicalProfitTargetPct}% target`,
      ],
      paragraphs: [],
    },
    {
      heading: "Step 2: Read Pass Probability",
      level: 3,
      paragraphs: [
        "≥60% pass probability: proceed with 7-Day Playbook caps.",
        "40–60%: reduce frequency or improve R:R before paying challenge fee.",
        "<40%: fix the edge first — no risk model saves a negative expectancy system.",
      ],
    },
    {
      heading: "Step 3: Map Dollars to Risk Per Trade",
      level: 3,
      paragraphs: [
        `On ${size.label}, 0.5% risk = $${Math.round(size.notional * 0.005).toLocaleString()} per trade. At 2 trades/day max, daily risk exposure stays inside ${firm.dailyLossLimit.toLowerCase()}.`,
        `See also: ${premiumMathLink()} for full probability framework.`,
      ],
    },
  ];

  return {
    slug,
    title: `${h1} | Quicksilver`,
    metaDescription: `Monte Carlo risk calculation for ${firm.shortName} ${size.label}: pass probability, lot sizing, and drawdown simulation with Prop Survival.`,
    h1,
    directAnswer: `To calculate risk on a ${firm.shortName} ${size.label} account: input win rate, R:R, and trade frequency into a Monte Carlo simulator (Quicksilver Prop Survival), target ≥60% pass probability, then risk 0.5–0.75% ($${Math.round(size.notional * 0.005).toLocaleString()}–$${Math.round(size.notional * 0.0075).toLocaleString()}) per trade with max 2 trades per session.`,
    format: "step-by-step",
    topic: "monte-carlo-risk",
    firmSlug: firm.slug,
    firmName: firm.name,
    sizeSlug: size.slug,
    sizeLabel: size.label,
    toolSlug: "prop-survival",
    intro: `Step-by-step Monte Carlo workflow for ${firm.name} ${size.label} challenge risk planning.`,
    sections,
    faqs: [
      {
        question: `What pass probability should I target on ${firm.shortName}?`,
        answer: "≥60% in Monte Carlo before funding a challenge. Below that, refine frequency, R:R, or win rate first.",
      },
    ],
    relatedSlugs: [],
    publishedAt: PUBLISHED_AT,
  };
}

const BUILDERS: Record<
  ClusterTopicSlug,
  (firm: AuthorityPropFirm, size?: AccountSize) => PropFirmClusterPage
> = {
  "pass-in-7-days": (firm, size) => buildPassIn7Days(firm, size!),
  "consistency-rule-math": (firm) => buildConsistencyRuleMath(firm),
  "daily-drawdown": (firm, size) => buildDailyDrawdown(firm, size!),
  "consistency-score": (firm) => buildConsistencyScore(firm),
  "drawdown-type": (firm) => buildDrawdownType(firm),
  "profit-target": (firm, size) => buildProfitTarget(firm, size!),
  "monte-carlo-risk": (firm, size) => buildMonteCarloRisk(firm, size!),
};

function attachRelatedSlugs(pages: PropFirmClusterPage[]): PropFirmClusterPage[] {
  const byFirm = new Map<string, PropFirmClusterPage[]>();
  for (const page of pages) {
    const list = byFirm.get(page.firmSlug) ?? [];
    list.push(page);
    byFirm.set(page.firmSlug, list);
  }

  return pages.map((page) => {
    const firmPages = byFirm.get(page.firmSlug) ?? [];
    const related = firmPages
      .filter((p) => p.slug !== page.slug && p.topic !== page.topic)
      .slice(0, 6)
      .map((p) => p.slug);
    return { ...page, relatedSlugs: related };
  });
}

function buildAllClusterPages(): PropFirmClusterPage[] {
  const pages: PropFirmClusterPage[] = [];

  for (const firm of AUTHORITY_PROP_FIRMS) {
    for (const topic of CLUSTER_TOPICS) {
      if (topic.needsSize) {
        for (const size of ACCOUNT_SIZES) {
          pages.push(BUILDERS[topic.slug](firm, size));
        }
      } else {
        pages.push(BUILDERS[topic.slug](firm));
      }
    }
  }

  return attachRelatedSlugs(pages);
}

export const PROP_FIRM_CLUSTER_PAGES = buildAllClusterPages();
export const PROP_FIRM_CLUSTER_COUNT = PROP_FIRM_CLUSTER_PAGES.length;

export function getClusterPageBySlug(slug: string): PropFirmClusterPage | undefined {
  return PROP_FIRM_CLUSTER_PAGES.find((p) => p.slug === slug);
}

export function getClustersByFirm(firmSlug: string): PropFirmClusterPage[] {
  return PROP_FIRM_CLUSTER_PAGES.filter((p) => p.firmSlug === firmSlug);
}