import { TOOLS } from "@/lib/tools-registry";

export type LandingDemoType =
  | "setup-scorer"
  | "risk-calc"
  | "consistency-calc"
  | "rr-planner";

export interface SeoMarket {
  slug: string;
  name: string;
  shortName: string;
  session: string;
}

export interface SeoTopic {
  slug: string;
  name: string;
  demo: LandingDemoType;
  toolSlug: string;
  keyword: string;
}

export interface SeoLandingPage {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  market: SeoMarket | null;
  topic: SeoTopic;
  demo: LandingDemoType;
  toolSlug: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
  publishedAt: string;
}

export const SEO_MARKETS: SeoMarket[] = [
  { slug: "xauusd", name: "Gold (XAUUSD)", shortName: "Gold", session: "London and New York overlap" },
  { slug: "xagusd", name: "Silver (XAGUSD)", shortName: "Silver", session: "London session" },
  { slug: "nas100", name: "NASDAQ 100 (NAS100)", shortName: "NAS100", session: "New York cash session" },
  { slug: "us30", name: "Dow Jones (US30)", shortName: "US30", session: "New York session" },
  { slug: "spx500", name: "S&P 500 (SPX500)", shortName: "S&P 500", session: "New York session" },
  { slug: "eurusd", name: "Euro / US Dollar (EURUSD)", shortName: "EURUSD", session: "London open" },
  { slug: "gbpusd", name: "British Pound / US Dollar (GBPUSD)", shortName: "GBPUSD", session: "London session" },
  { slug: "usdjpy", name: "US Dollar / Japanese Yen (USDJPY)", shortName: "USDJPY", session: "Tokyo and New York" },
  { slug: "audusd", name: "Australian Dollar / US Dollar (AUDUSD)", shortName: "AUDUSD", session: "Sydney and London" },
  { slug: "usdcad", name: "US Dollar / Canadian Dollar (USDCAD)", shortName: "USDCAD", session: "New York session" },
  { slug: "btcusd", name: "Bitcoin (BTCUSD)", shortName: "Bitcoin", session: "24-hour crypto" },
  { slug: "ethusd", name: "Ethereum (ETHUSD)", shortName: "Ethereum", session: "24-hour crypto" },
  { slug: "oil-wti", name: "Crude Oil WTI", shortName: "Oil", session: "New York energy session" },
  { slug: "natural-gas", name: "Natural Gas", shortName: "Nat Gas", session: "US energy hours" },
  { slug: "dxy", name: "US Dollar Index (DXY)", shortName: "DXY", session: "Global macro sessions" },
];

export const SEO_TOPICS: SeoTopic[] = [
  { slug: "setup-scoring", name: "Setup Scoring", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "trade setup scorecard" },
  { slug: "risk-management", name: "Risk Management", demo: "risk-calc", toolSlug: "risk-matrix", keyword: "position size calculator" },
  { slug: "prop-firm-challenge", name: "Prop Firm Challenge", demo: "consistency-calc", toolSlug: "prop-survival", keyword: "prop firm challenge plan" },
  { slug: "prop-firm-consistency", name: "Prop Firm Consistency Rule", demo: "consistency-calc", toolSlug: "prop-survival", keyword: "20 percent consistency rule" },
  { slug: "trade-planning", name: "Trade Planning", demo: "rr-planner", toolSlug: "execution-protocol", keyword: "manual trade plan template" },
  { slug: "confluence-trading", name: "Confluence Trading", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "confluence trading checklist" },
  { slug: "candlestick-patterns", name: "Candlestick Patterns", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "candlestick pattern scoring" },
  { slug: "market-structure", name: "Market Structure", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "market structure analysis" },
  { slug: "fibonacci-trading", name: "Fibonacci Trading", demo: "rr-planner", toolSlug: "execution-protocol", keyword: "fibonacci trade planning" },
  { slug: "session-trading", name: "Session Trading", demo: "setup-scorer", toolSlug: "regime-oracle", keyword: "session-based trading plan" },
  { slug: "scalping-strategy", name: "Scalping Strategy", demo: "risk-calc", toolSlug: "risk-matrix", keyword: "scalping risk calculator" },
  { slug: "swing-trading", name: "Swing Trading", demo: "rr-planner", toolSlug: "execution-protocol", keyword: "swing trade planner" },
  { slug: "journal-analytics", name: "Journal Analytics", demo: "setup-scorer", toolSlug: "alpha-durability", keyword: "trading journal edge analysis" },
  { slug: "funded-trader", name: "Funded Trader Workflow", demo: "consistency-calc", toolSlug: "prop-survival", keyword: "funded account trading plan" },
];

function buildMarketTopicPage(market: SeoMarket, topic: SeoTopic): SeoLandingPage {
  const slug = `${market.slug}-${topic.slug}`;
  const tool = TOOLS.find((t) => t.slug === topic.toolSlug);

  const title = `${market.shortName} ${topic.name} — Free Manual Trading Tool | Quicksilver`;
  const metaDescription = `Free ${topic.keyword} for ${market.name} manual traders. Try the interactive demo, learn ${topic.name.toLowerCase()} workflows, and upgrade to the full ${tool?.shortName ?? "QS"} module.`;
  const h1 = `${market.shortName} ${topic.name} for Manual Traders`;

  const intro = `Manual traders on ${market.name} use ${topic.name.toLowerCase()} to filter noise during the ${market.session}. This free Quicksilver landing page includes an interactive ${topic.demo.replace("-", " ")} demo plus a practical workflow you can run on any charting platform — no broker connection required.`;

  const sections = [
    {
      heading: `Why ${topic.name} matters on ${market.shortName}`,
      paragraphs: [
        `${market.name} moves fast around the ${market.session}. Without a structured ${topic.name.toLowerCase()} process, discretionary traders overtrade, oversize positions, and break prop firm consistency rules.`,
        `Quicksilver's approach combines chart literacy with proprietary planning modules. Start with the free demo below, then graduate to the full ${tool?.name ?? "QS Planning Module"} when you need institutional-grade scoring and risk planning.`,
      ],
    },
    {
      heading: `How to use this ${market.shortName} ${topic.keyword}`,
      paragraphs: [
        `Mark your higher-timeframe bias on ${market.shortName}, wait for session liquidity (${market.session}), then run every candidate setup through the demo widget before committing capital.`,
        `Log outcomes in a simple journal — win rate, average R:R, and max daily drawdown. After 30+ trades, you'll know whether your edge supports a prop firm challenge or needs refinement.`,
      ],
    },
    {
      heading: "Upgrade path: free demo → full QS module",
      paragraphs: [
        `The demo on this page is a lightweight preview. Premium members unlock the complete ${tool?.shortName ?? "planning tool"} with exportable scorecards, portfolio heat maps, and challenge survival simulations.`,
        `Free accounts get one lesson, one guide, and the Setup Scorer. Tier 1 ($24.99/mo) adds Risk Matrix. Premium Quant ($199.99/mo) unlocks all six planning modules plus Chart Academy and VIP Discord.`,
      ],
    },
  ];

  const faqs = [
    {
      question: `Is this ${market.shortName} ${topic.name.toLowerCase()} tool free?`,
      answer: `Yes. The interactive demo on this page is free for all visitors. Full ${tool?.shortName ?? "module"} access requires a Quicksilver subscription tier matched to the tool.`,
    },
    {
      question: `Does Quicksilver connect to my broker for ${market.name}?`,
      answer: "No. Quicksilver is manual-trading planning software only. You analyze and plan on any platform, then execute trades yourself.",
    },
    {
      question: `What is the best session to trade ${market.shortName}?`,
      answer: `Most ${market.shortName} traders focus on the ${market.session} when liquidity and volatility align with their playbook.`,
    },
  ];

  return {
    slug,
    title,
    metaDescription,
    h1,
    market,
    topic,
    demo: topic.demo,
    toolSlug: topic.toolSlug,
    intro,
    sections,
    faqs,
    relatedSlugs: [],
    publishedAt: "2026-03-01",
  };
}

function buildTopicOnlyPage(topic: SeoTopic): SeoLandingPage {
  const slug = topic.slug;
  const tool = TOOLS.find((t) => t.slug === topic.toolSlug);

  return {
    slug,
    title: `Free ${topic.name} Tool — ${topic.keyword} | Quicksilver Algo`,
    metaDescription: `Free ${topic.keyword} demo for manual traders. Interactive ${topic.name.toLowerCase()} widget, FAQs, and upgrade path to ${tool?.shortName ?? "premium tools"}.`,
    h1: `Free ${topic.name} Demo`,
    market: null,
    topic,
    demo: topic.demo,
    toolSlug: topic.toolSlug,
    intro: `Use this free ${topic.name.toLowerCase()} demo to score setups, plan risk, or check prop firm consistency before you trade. Built for manual traders on any broker or charting platform.`,
    sections: [
      {
        heading: `What is ${topic.name}?`,
        paragraphs: [
          `${topic.name} is a core discipline in the Quicksilver manual trading workflow. This page gives you a hands-on preview plus clear upgrade paths to the full ${tool?.name ?? "QS module"}.`,
        ],
      },
      {
        heading: "Try the demo below",
        paragraphs: [
          "Adjust the inputs and watch the output update instantly. When you need saved exports, deeper analytics, and all six planning modules, upgrade to Premium Quant.",
        ],
      },
    ],
    faqs: [
      {
        question: `Who is the ${topic.name} demo for?`,
        answer: "Any manual trader evaluating setups before entry — scalpers, swing traders, and prop firm challengers.",
      },
      {
        question: "Do I need an account?",
        answer: "No account is required to use the demo on this page. Create a free profile to save progress and unlock tier-matched tools.",
      },
    ],
    relatedSlugs: [],
    publishedAt: "2026-03-01",
  };
}

function attachRelatedSlugs(pages: SeoLandingPage[]): SeoLandingPage[] {
  const byMarket = new Map<string, SeoLandingPage[]>();
  const byTopic = new Map<string, SeoLandingPage[]>();

  for (const page of pages) {
    if (page.market) {
      const list = byMarket.get(page.market.slug) ?? [];
      list.push(page);
      byMarket.set(page.market.slug, list);
    }
    const tList = byTopic.get(page.topic.slug) ?? [];
    tList.push(page);
    byTopic.set(page.topic.slug, tList);
  }

  return pages.map((page) => {
    const related = new Set<string>();
    if (page.market) {
      for (const p of byMarket.get(page.market.slug) ?? []) {
        if (p.slug !== page.slug) related.add(p.slug);
      }
    }
    for (const p of byTopic.get(page.topic.slug) ?? []) {
      if (p.slug !== page.slug) related.add(p.slug);
    }
    return {
      ...page,
      relatedSlugs: Array.from(related).slice(0, 6),
    };
  });
}

function buildAllLandingPages(): SeoLandingPage[] {
  const pages: SeoLandingPage[] = [];

  for (const market of SEO_MARKETS) {
    for (const topic of SEO_TOPICS) {
      pages.push(buildMarketTopicPage(market, topic));
    }
  }

  for (const topic of SEO_TOPICS) {
    pages.push(buildTopicOnlyPage(topic));
  }

  return attachRelatedSlugs(pages);
}

export const SEO_LANDING_PAGES = buildAllLandingPages();

export const SEO_LANDING_COUNT = SEO_LANDING_PAGES.length;

export function getLandingPageBySlug(slug: string): SeoLandingPage | undefined {
  return SEO_LANDING_PAGES.find((p) => p.slug === slug);
}

export function getLandingPagesByMarket(marketSlug: string): SeoLandingPage[] {
  return SEO_LANDING_PAGES.filter((p) => p.market?.slug === marketSlug);
}

export function getLandingPagesByTopic(topicSlug: string): SeoLandingPage[] {
  return SEO_LANDING_PAGES.filter(
    (p) => p.topic.slug === topicSlug && p.market !== null
  );
}