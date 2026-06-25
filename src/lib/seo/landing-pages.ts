import { TOOLS } from "@/lib/tools-registry";
import {
  SEO_MARKETS,
  SEO_PROP_FIRMS,
  SEO_TIMEFRAMES,
  SEO_TOPICS,
  getPropMarketTopics,
  getTimeframeTopics,
  type LandingDemoType,
  type SeoMarket,
  type SeoPropFirm,
  type SeoTimeframe,
  type SeoTopic,
} from "@/lib/seo/landing-data";

export type { LandingDemoType, SeoMarket, SeoPropFirm, SeoTimeframe, SeoTopic };
export { SEO_MARKETS, SEO_PROP_FIRMS, SEO_TIMEFRAMES, SEO_TOPICS };

export interface SeoLandingPage {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  market: SeoMarket | null;
  propFirm: SeoPropFirm | null;
  topic: SeoTopic;
  demo: LandingDemoType;
  toolSlug: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
  publishedAt: string;
  timeframe: SeoTimeframe | null;
}

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
        `Free accounts get one lesson, one guide, and the Setup Scorer. Premium ($149.99/mo) unlocks everything — all six planning modules, Chart Academy, TradeLocker bot, and priority email support. Use code FIRST100 for $60 off your first month.`,
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
    propFirm: null,
    topic,
    demo: topic.demo,
    toolSlug: topic.toolSlug,
    intro,
    sections,
    faqs,
    relatedSlugs: [],
    publishedAt: "2026-03-01",
    timeframe: null,
  };
}

function buildMarketTimeframeTopicPage(
  market: SeoMarket,
  timeframe: SeoTimeframe,
  topic: SeoTopic
): SeoLandingPage {
  const slug = `${market.slug}-${timeframe.slug}-${topic.slug}`;
  const tool = TOOLS.find((t) => t.slug === topic.toolSlug);

  const title = `${market.shortName} ${timeframe.label} ${topic.name} — Free Tool | Quicksilver`;
  const metaDescription = `Free ${timeframe.label.toLowerCase()} ${topic.keyword} for ${market.name}. ${topic.name} workflow tuned for ${market.session} — interactive demo and upgrade to ${tool?.shortName ?? "QS"} module.`;
  const h1 = `${market.shortName} ${timeframe.label} ${topic.name}`;

  const intro = `${market.name} traders running ${timeframe.label.toLowerCase()} charts use ${topic.name.toLowerCase()} to stay disciplined during the ${market.session}. This free Quicksilver page includes a ${topic.demo.replace(/-/g, " ")} demo plus a repeatable ${timeframe.shortLabel} workflow — no broker connection required.`;

  const sections = [
    {
      heading: `Why ${timeframe.label} ${topic.name} on ${market.shortName}`,
      paragraphs: [
        `Lower timeframes on ${market.shortName} punish impulsive entries. A structured ${timeframe.label.toLowerCase()} ${topic.name.toLowerCase()} process filters low-quality setups before you risk capital.`,
        `Start with the demo below, then upgrade to ${tool?.name ?? "the full QS module"} for exportable scorecards and deeper analytics.`,
      ],
    },
    {
      heading: `${timeframe.shortLabel} execution checklist`,
      paragraphs: [
        `Mark higher-timeframe bias, drop to the ${timeframe.label.toLowerCase()} chart during ${market.session}, then score every candidate through the widget before entry.`,
        `Log 30+ ${timeframe.shortLabel} trades to validate win rate, average R:R, and daily drawdown against your prop firm or personal rules.`,
      ],
    },
    {
      heading: "Upgrade path",
      paragraphs: [
        `Premium Quant unlocks all six planning modules, Chart Academy, and priority email support — built for manual traders scaling from demo accounts to funded capital.`,
      ],
    },
  ];

  const faqs = [
    {
      question: `Is this ${market.shortName} ${timeframe.label} tool free?`,
      answer: "Yes. The demo on this page is free for all visitors. Full module access requires a matched Quicksilver tier.",
    },
    {
      question: `What timeframe works best for ${market.shortName}?`,
      answer: `Many traders pair ${timeframe.label.toLowerCase()} execution with a higher-timeframe bias, focusing activity around the ${market.session}.`,
    },
    {
      question: "Does Quicksilver place trades?",
      answer: "No. Quicksilver is manual-trading planning software. You execute on any broker or charting platform.",
    },
  ];

  return {
    slug,
    title,
    metaDescription,
    h1,
    market,
    propFirm: null,
    topic,
    demo: topic.demo,
    toolSlug: topic.toolSlug,
    intro,
    sections,
    faqs,
    relatedSlugs: [],
    publishedAt: "2026-06-15",
    timeframe,
  };
}

function buildPropFirmMarketTopicPage(
  propFirm: SeoPropFirm,
  market: SeoMarket,
  topic: SeoTopic
): SeoLandingPage {
  const slug = `${propFirm.slug}-${market.slug}-${topic.slug}`;
  const tool = TOOLS.find((t) => t.slug === topic.toolSlug);

  const title = `${propFirm.shortName} ${market.shortName} ${topic.name} — Prop Firm Tool | Quicksilver`;
  const metaDescription = `${propFirm.name} traders on ${market.name}: free ${topic.keyword}. Profit target ${propFirm.profitTarget}. Try the demo and upgrade to ${tool?.shortName ?? "QS"} challenge tools.`;
  const h1 = `${propFirm.shortName} ${market.shortName} ${topic.name}`;

  const intro = `Traders attempting ${propFirm.name} while trading ${market.name} need ${topic.name.toLowerCase()} aligned to firm rules (${propFirm.profitTarget}, ${propFirm.maxDrawdown}) and ${market.shortName} session flow (${market.session}). This page includes a free demo and a pre-session workflow.`;

  const sections = [
    {
      heading: `${propFirm.shortName} + ${market.shortName} at a glance`,
      paragraphs: [
        `Firm rules: ${propFirm.profitTarget}. Drawdown: ${propFirm.maxDrawdown}. Daily loss: ${propFirm.dailyLossLimit}. Consistency: ${propFirm.consistencyRule}.`,
        `Instrument focus: ${market.name} during the ${market.session}. Run every setup through the demo before committing risk.`,
      ],
    },
    {
      heading: `Applying ${topic.name} under prop constraints`,
      paragraphs: [
        `Oversizing on ${market.shortName} is the fastest way to breach ${propFirm.shortName} daily loss limits. Use ${topic.name.toLowerCase()} to standardize risk and document consistency for payouts.`,
        `Upgrade to ${tool?.name ?? "QS Prop Survival"} for Monte Carlo challenge simulations and exportable scorecards.`,
      ],
    },
    {
      heading: "Upgrade path",
      paragraphs: [
        "Free accounts get lesson previews and the Setup Scorer. Premium Quant unlocks all planning modules and the full Chart Academy.",
      ],
    },
  ];

  const faqs = [
    {
      question: `Can I pass ${propFirm.shortName} trading only ${market.shortName}?`,
      answer: "Many traders specialize in one or two instruments. Success depends on edge quality, risk sizing, and consistency — not instrument count.",
    },
    {
      question: `What are ${propFirm.name}'s key rules?`,
      answer: `${propFirm.profitTarget}; ${propFirm.maxDrawdown}; ${propFirm.dailyLossLimit}. Verify current rules on the firm's official site.`,
    },
    {
      question: "Is the demo free?",
      answer: "Yes. Full prop survival and planning modules require a Quicksilver subscription tier.",
    },
  ];

  return {
    slug,
    title,
    metaDescription,
    h1,
    market,
    propFirm,
    topic,
    demo: topic.demo,
    toolSlug: topic.toolSlug,
    intro,
    sections,
    faqs,
    relatedSlugs: [],
    publishedAt: "2026-06-15",
    timeframe: null,
  };
}

function buildPropFirmTopicPage(propFirm: SeoPropFirm, topic: SeoTopic): SeoLandingPage {
  const slug = `${propFirm.slug}-${topic.slug}`;
  const tool = TOOLS.find((t) => t.slug === topic.toolSlug);

  const title = `${propFirm.shortName} ${topic.name} — Free Prop Firm Trading Tool | Quicksilver`;
  const metaDescription = `Free ${topic.keyword} tailored for ${propFirm.name} challengers. Profit target: ${propFirm.profitTarget}. Drawdown: ${propFirm.maxDrawdown}. Try the demo and upgrade to full QS planning modules.`;
  const h1 = `${propFirm.shortName} ${topic.name} for Prop Firm Traders`;

  const intro = `Traders preparing for ${propFirm.name} use ${topic.name.toLowerCase()} to stay inside firm rules: ${propFirm.profitTarget} profit target, ${propFirm.maxDrawdown}, and ${propFirm.consistencyRule.toLowerCase()}. This free Quicksilver page includes an interactive ${topic.demo.replace(/-/g, " ")} demo plus a workflow you can run before every session — no broker connection required.`;

  const sections = [
    {
      heading: `Why ${topic.name} matters on ${propFirm.shortName}`,
      paragraphs: [
        `${propFirm.name} enforces strict risk parameters. Without structured ${topic.name.toLowerCase()}, traders blow accounts on oversizing, revenge trades, or violating the ${propFirm.consistencyRule.toLowerCase()}.`,
        `Quicksilver combines chart literacy with proprietary planning modules. Start with the free demo below, then graduate to the full ${tool?.name ?? "QS Planning Module"} for challenge survival simulations and exportable scorecards.`,
      ],
    },
    {
      heading: `${propFirm.shortName} rules at a glance`,
      paragraphs: [
        `Profit target: ${propFirm.profitTarget}. Maximum drawdown: ${propFirm.maxDrawdown}. Daily loss limit: ${propFirm.dailyLossLimit}. Consistency: ${propFirm.consistencyRule}.`,
        `Run every candidate trade through the demo widget before committing capital. Log outcomes in a journal — win rate, average R:R, and max daily drawdown — so you know whether your edge supports a ${propFirm.shortName} challenge.`,
      ],
    },
    {
      heading: "Upgrade path: free demo → full QS module",
      paragraphs: [
        `The demo on this page is a lightweight preview. Premium members unlock the complete ${tool?.shortName ?? "planning tool"} with exportable scorecards, portfolio heat maps, and challenge survival simulations calibrated to prop firm rules.`,
        `Free accounts get one lesson, one guide, and the Setup Scorer. Premium ($149.99/mo) unlocks everything — all six planning modules, Chart Academy, TradeLocker bot, and priority email support. Use code FIRST100 for $60 off your first month.`,
      ],
    },
  ];

  const faqs = [
    {
      question: `Is this ${propFirm.shortName} ${topic.name.toLowerCase()} tool free?`,
      answer: `Yes. The interactive demo on this page is free for all visitors. Full ${tool?.shortName ?? "module"} access requires a Quicksilver subscription tier matched to the tool.`,
    },
    {
      question: `What are ${propFirm.name}'s main challenge rules?`,
      answer: `Key rules: ${propFirm.profitTarget} profit target, ${propFirm.maxDrawdown}, ${propFirm.dailyLossLimit}, and ${propFirm.consistencyRule}. Always verify current rules on the firm's official site before trading.`,
    },
    {
      question: `Does Quicksilver guarantee a ${propFirm.shortName} pass?`,
      answer: "No. Quicksilver is manual-trading planning software only. It helps you size risk, score setups, and track consistency — you execute trades yourself on any platform.",
    },
  ];

  return {
    slug,
    title,
    metaDescription,
    h1,
    market: null,
    propFirm,
    topic,
    demo: topic.demo,
    toolSlug: topic.toolSlug,
    intro,
    sections,
    faqs,
    relatedSlugs: [],
    publishedAt: "2026-03-01",
    timeframe: null,
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
    propFirm: null,
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
    timeframe: null,
  };
}

function attachRelatedSlugs(pages: SeoLandingPage[]): SeoLandingPage[] {
  const byMarket = new Map<string, SeoLandingPage[]>();
  const byPropFirm = new Map<string, SeoLandingPage[]>();
  const byTopic = new Map<string, SeoLandingPage[]>();

  for (const page of pages) {
    if (page.market) {
      const list = byMarket.get(page.market.slug) ?? [];
      list.push(page);
      byMarket.set(page.market.slug, list);
    }
    if (page.propFirm) {
      const list = byPropFirm.get(page.propFirm.slug) ?? [];
      list.push(page);
      byPropFirm.set(page.propFirm.slug, list);
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
    if (page.propFirm) {
      for (const p of byPropFirm.get(page.propFirm.slug) ?? []) {
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

  for (const propFirm of SEO_PROP_FIRMS) {
    for (const topic of SEO_TOPICS) {
      pages.push(buildPropFirmTopicPage(propFirm, topic));
    }
  }

  for (const topic of SEO_TOPICS) {
    pages.push(buildTopicOnlyPage(topic));
  }

  const timeframeTopics = getTimeframeTopics();
  for (const market of SEO_MARKETS) {
    for (const timeframe of SEO_TIMEFRAMES) {
      for (const topic of timeframeTopics) {
        pages.push(buildMarketTimeframeTopicPage(market, timeframe, topic));
      }
    }
  }

  const propMarketTopics = getPropMarketTopics();
  for (const propFirm of SEO_PROP_FIRMS) {
    for (const market of SEO_MARKETS) {
      for (const topic of propMarketTopics) {
        pages.push(buildPropFirmMarketTopicPage(propFirm, market, topic));
      }
    }
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

export function getLandingPagesByPropFirm(propFirmSlug: string): SeoLandingPage[] {
  return SEO_LANDING_PAGES.filter((p) => p.propFirm?.slug === propFirmSlug);
}