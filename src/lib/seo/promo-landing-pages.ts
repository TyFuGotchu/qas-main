import { TOOLS } from "@/lib/tools-registry";
import {
  PREMIUM_PRICE,
  PREMIUM_PROMO_CODE,
  PREMIUM_PROMO_DISCOUNT,
  PREMIUM_PROMO_FIRST_MONTH,
  PREMIUM_PROMO_NOTE,
} from "@/lib/pricing-tiers";
import {
  SEO_MARKETS,
  SEO_PROP_FIRMS,
  SEO_TOPICS,
  getPropMarketTopics,
  type LandingDemoType,
  type SeoMarket,
  type SeoPropFirm,
  type SeoTopic,
} from "@/lib/seo/landing-data";
import { PUBLIC_LESSONS, type PublicLesson } from "@/lib/seo/public-lessons";
import { toolSlugToDemo } from "@/lib/seo/seo-demo";

export type PromoLandingVariant =
  | "market-topic"
  | "prop-topic"
  | "prop-market-topic"
  | "market-lesson"
  | "prop-lesson"
  | "topic-deal"
  | "market-deal"
  | "prop-deal"
  | "bundle";

export interface PromoLandingPage {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  variant: PromoLandingVariant;
  market: SeoMarket | null;
  propFirm: SeoPropFirm | null;
  topic: SeoTopic | null;
  lessonSlug: string | null;
  lessonTitle: string | null;
  demo: LandingDemoType | null;
  toolSlug: string | null;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
  publishedAt: string;
}

const PROMO_PREFIX = "first100";
const PUBLISHED_AT = "2026-06-24";

function promoSlug(...parts: string[]): string {
  return [PROMO_PREFIX, ...parts].join("-");
}

function basePromoFaqs(context: string): { question: string; answer: string }[] {
  return [
    {
      question: `What is the ${PREMIUM_PROMO_CODE} promo code?`,
      answer: `${PREMIUM_PROMO_CODE} takes ${PREMIUM_PROMO_DISCOUNT} off your first month of Quicksilver Premium (${PREMIUM_PRICE}/mo). Your first month is ${PREMIUM_PROMO_FIRST_MONTH}. Limited to the first 100 users.`,
    },
    {
      question: `How do I redeem ${PREMIUM_PROMO_CODE} for ${context}?`,
      answer: `Click Subscribe on this page, enter code ${PREMIUM_PROMO_CODE} at Stripe checkout, and unlock Premium instantly — Chart Academy, all six planning modules, TradeLocker bot, and VIP Discord.`,
    },
    {
      question: "What does Premium include?",
      answer:
        "Everything in one subscription: 89 Chart Academy lessons, prop firm playbook, six QS Planning Modules, TradeLocker Quicksilver Quant Protocol bot, live dashboard, and VIP Discord with live guidance.",
    },
    {
      question: `Is there a free tier before using ${PREMIUM_PROMO_CODE}?`,
      answer:
        "Yes. Free accounts get one lesson, one guide, and the Setup Scorer. Upgrade with FIRST100 when you are ready for full access.",
    },
  ];
}

function premiumUnlockSection(toolName?: string): {
  heading: string;
  paragraphs: string[];
} {
  return {
    heading: `Unlock with ${PREMIUM_PROMO_CODE} — ${PREMIUM_PROMO_FIRST_MONTH} first month`,
    paragraphs: [
      `Premium is normally ${PREMIUM_PRICE}/mo. Code ${PREMIUM_PROMO_CODE} drops your first month to ${PREMIUM_PROMO_FIRST_MONTH} (${PREMIUM_PROMO_DISCOUNT} off). ${PREMIUM_PROMO_NOTE}.`,
      toolName
        ? `This offer unlocks the full ${toolName} plus every other Premium feature — no upsells, no tier confusion.`
        : "One price unlocks Chart Academy, all planning tools, the TradeLocker bot, and VIP Discord.",
    ],
  };
}

function buildMarketTopicPromo(
  market: SeoMarket,
  topic: SeoTopic
): PromoLandingPage {
  const slug = promoSlug(market.slug, topic.slug);
  const tool = TOOLS.find((t) => t.slug === topic.toolSlug);
  const context = `${market.shortName} ${topic.name.toLowerCase()}`;

  return {
    slug,
    title: `${PREMIUM_PROMO_CODE}: ${market.shortName} ${topic.name} — ${PREMIUM_PROMO_DISCOUNT} Off Premium | Quicksilver`,
    metaDescription: `Use code ${PREMIUM_PROMO_CODE} for ${PREMIUM_PROMO_FIRST_MONTH} first month on ${market.name} ${topic.name.toLowerCase()}. Free demo + full ${tool?.shortName ?? "QS"} module, Chart Academy, and TradeLocker bot.`,
    h1: `${PREMIUM_PROMO_CODE} — ${market.shortName} ${topic.name}`,
    variant: "market-topic",
    market,
    propFirm: null,
    topic,
    lessonSlug: null,
    lessonTitle: null,
    demo: topic.demo,
    toolSlug: topic.toolSlug,
    intro: `Manual traders on ${market.name} use ${topic.name.toLowerCase()} during the ${market.session}. Start with the free demo below, then use promo code ${PREMIUM_PROMO_CODE} to unlock Premium for ${PREMIUM_PROMO_FIRST_MONTH} your first month — full ${tool?.shortName ?? "planning tools"}, Chart Academy, and VIP Discord included.`,
    sections: [
      {
        heading: `Why ${topic.name} + ${PREMIUM_PROMO_CODE} on ${market.shortName}`,
        paragraphs: [
          `${market.name} moves fast without structured ${topic.keyword}. Quicksilver Premium bundles ${topic.name.toLowerCase()}, risk planning, and prop firm survival tools in one subscription.`,
          `Code ${PREMIUM_PROMO_CODE} is limited to the first 100 traders — ${PREMIUM_PROMO_DISCOUNT} off month one so you can test the full ${tool?.name ?? "QS module"} on ${market.shortName} before paying full price.`,
        ],
      },
      {
        heading: `Free demo → ${PREMIUM_PROMO_CODE} upgrade workflow`,
        paragraphs: [
          `Run the ${topic.demo.replace(/-/g, " ")} demo on this page, journal 10–20 ${market.shortName} setups, then subscribe with ${PREMIUM_PROMO_CODE} when you want exportable scorecards and unlimited access.`,
          `Premium members also get the TradeLocker Quicksilver Quant Protocol bot and live dashboard — same code, same ${PREMIUM_PROMO_FIRST_MONTH} intro price.`,
        ],
      },
      premiumUnlockSection(tool?.name),
    ],
    faqs: [
      ...basePromoFaqs(context),
      {
        question: `Is the ${market.shortName} ${topic.name.toLowerCase()} demo free?`,
        answer: `Yes. The demo is free for all visitors. ${PREMIUM_PROMO_CODE} unlocks the complete ${tool?.shortName ?? "module"} and all Premium features.`,
      },
    ],
    relatedSlugs: [],
    publishedAt: PUBLISHED_AT,
  };
}

function buildPropTopicPromo(
  propFirm: SeoPropFirm,
  topic: SeoTopic
): PromoLandingPage {
  const slug = promoSlug(propFirm.slug, topic.slug);
  const tool = TOOLS.find((t) => t.slug === topic.toolSlug);
  const context = `${propFirm.shortName} ${topic.name.toLowerCase()}`;

  return {
    slug,
    title: `${PREMIUM_PROMO_CODE}: ${propFirm.shortName} ${topic.name} — ${PREMIUM_PROMO_FIRST_MONTH} First Month | Quicksilver`,
    metaDescription: `${propFirm.name} traders: code ${PREMIUM_PROMO_CODE} for ${PREMIUM_PROMO_DISCOUNT} off Premium. ${topic.name} tools, prop survival sims, Chart Academy — ${PREMIUM_PROMO_FIRST_MONTH} month one.`,
    h1: `${PREMIUM_PROMO_CODE} for ${propFirm.shortName} ${topic.name}`,
    variant: "prop-topic",
    market: null,
    propFirm,
    topic,
    lessonSlug: null,
    lessonTitle: null,
    demo: topic.demo,
    toolSlug: topic.toolSlug,
    intro: `${propFirm.name} challengers need ${topic.name.toLowerCase()} that respects ${propFirm.profitTarget}, ${propFirm.maxDrawdown}, and ${propFirm.consistencyRule.toLowerCase()}. Use code ${PREMIUM_PROMO_CODE} for ${PREMIUM_PROMO_FIRST_MONTH} your first Premium month — full ${tool?.shortName ?? "QS tools"}, Chart Academy, and challenge survival simulations.`,
    sections: [
      {
        heading: `${propFirm.shortName} rules + ${PREMIUM_PROMO_CODE} bundle`,
        paragraphs: [
          `Profit target: ${propFirm.profitTarget}. Max drawdown: ${propFirm.maxDrawdown}. Daily loss: ${propFirm.dailyLossLimit}. Consistency: ${propFirm.consistencyRule}.`,
          `Premium bundles ${topic.name.toLowerCase()}, Prop Survival Monte Carlo, and six planning modules. ${PREMIUM_PROMO_CODE} saves ${PREMIUM_PROMO_DISCOUNT} on month one while you validate edge.`,
        ],
      },
      {
        heading: "Prop firm workflow with Quicksilver Premium",
        paragraphs: [
          `Score every setup with the demo below, log best-day share of profit, then upgrade with ${PREMIUM_PROMO_CODE} for exportable reports and unlimited challenge simulations.`,
          `VIP Discord access is included — ask questions during live sessions while you prep for ${propFirm.shortName}.`,
        ],
      },
      premiumUnlockSection(tool?.name),
    ],
    faqs: [
      ...basePromoFaqs(context),
      {
        question: `Does ${PREMIUM_PROMO_CODE} guarantee a ${propFirm.shortName} pass?`,
        answer:
          "No. Quicksilver is planning and education software. FIRST100 discounts Premium access — you execute trades yourself on any platform.",
      },
    ],
    relatedSlugs: [],
    publishedAt: PUBLISHED_AT,
  };
}

function buildPropMarketTopicPromo(
  propFirm: SeoPropFirm,
  market: SeoMarket,
  topic: SeoTopic
): PromoLandingPage {
  const slug = promoSlug(propFirm.slug, market.slug, topic.slug);
  const tool = TOOLS.find((t) => t.slug === topic.toolSlug);
  const context = `${propFirm.shortName} ${market.shortName} ${topic.name.toLowerCase()}`;

  return {
    slug,
    title: `${PREMIUM_PROMO_CODE}: ${propFirm.shortName} ${market.shortName} ${topic.name} | Quicksilver`,
    metaDescription: `${propFirm.name} + ${market.name}: ${PREMIUM_PROMO_CODE} = ${PREMIUM_PROMO_FIRST_MONTH} first month. ${topic.keyword}, prop rules, Chart Academy, and TradeLocker bot.`,
    h1: `${PREMIUM_PROMO_CODE} — ${propFirm.shortName} × ${market.shortName} ${topic.name}`,
    variant: "prop-market-topic",
    market,
    propFirm,
    topic,
    lessonSlug: null,
    lessonTitle: null,
    demo: topic.demo,
    toolSlug: topic.toolSlug,
    intro: `Traders targeting ${propFirm.name} on ${market.name} combine ${topic.name.toLowerCase()} with strict risk rules. Promo code ${PREMIUM_PROMO_CODE} unlocks Premium for ${PREMIUM_PROMO_FIRST_MONTH} month one — ${tool?.shortName ?? "planning tools"}, prop survival engine, and VIP Discord.`,
    sections: [
      {
        heading: `${market.shortName} session + ${propFirm.shortName} compliance`,
        paragraphs: [
          `Focus on the ${market.session} for ${market.shortName} liquidity. ${propFirm.consistencyRule} means you cannot rely on one lucky ${market.shortName} day.`,
          `Use the demo to score setups, then apply ${PREMIUM_PROMO_CODE} for full ${topic.name.toLowerCase()} analytics and challenge stress-tests.`,
        ],
      },
      premiumUnlockSection(tool?.name),
    ],
    faqs: basePromoFaqs(context),
    relatedSlugs: [],
    publishedAt: PUBLISHED_AT,
  };
}

function buildMarketLessonPromo(
  market: SeoMarket,
  lesson: PublicLesson
): PromoLandingPage {
  const slug = promoSlug(market.slug, lesson.slug);
  const tool = TOOLS.find((t) => t.slug === lesson.relatedToolSlug);
  const demo = toolSlugToDemo(lesson.relatedToolSlug);
  const context = `${market.shortName} ${lesson.title.toLowerCase()}`;

  return {
    slug,
    title: `${PREMIUM_PROMO_CODE}: ${market.shortName} ${lesson.title} Lesson — ${PREMIUM_PROMO_DISCOUNT} Off | Quicksilver`,
    metaDescription: `Learn ${lesson.title.toLowerCase()} on ${market.name}. Code ${PREMIUM_PROMO_CODE} for ${PREMIUM_PROMO_FIRST_MONTH} Premium — full Chart Academy, ${tool?.shortName ?? "tools"}, and VIP Discord.`,
    h1: `${PREMIUM_PROMO_CODE} — ${lesson.title} on ${market.shortName}`,
    variant: "market-lesson",
    market,
    propFirm: null,
    topic: null,
    lessonSlug: lesson.slug,
    lessonTitle: lesson.title,
    demo,
    toolSlug: lesson.relatedToolSlug,
    intro: `Studying ${lesson.title.toLowerCase()} on ${market.name}? Preview the lesson free, then use ${PREMIUM_PROMO_CODE} to unlock all ${PUBLIC_LESSONS.length} Chart Academy lessons for ${PREMIUM_PROMO_FIRST_MONTH} your first month — plus ${tool?.shortName ?? "planning modules"} and the TradeLocker bot.`,
    sections: [
      {
        heading: `Why ${lesson.title} matters on ${market.shortName}`,
        paragraphs: [
          lesson.summary,
          `During the ${market.session}, apply ${lesson.sectionTitle} concepts with the free demo, then upgrade with ${PREMIUM_PROMO_CODE} when you want the full ${lesson.categoryTitle} library.`,
        ],
      },
      premiumUnlockSection("Chart Academy"),
    ],
    faqs: [
      ...basePromoFaqs(context),
      {
        question: `Can I preview ${lesson.title} before using ${PREMIUM_PROMO_CODE}?`,
        answer:
          "Yes. Every lesson has a free preview. FIRST100 applies when you upgrade to Premium for full access.",
      },
    ],
    relatedSlugs: [],
    publishedAt: PUBLISHED_AT,
  };
}

function buildPropLessonPromo(
  propFirm: SeoPropFirm,
  lesson: PublicLesson
): PromoLandingPage {
  const slug = promoSlug(propFirm.slug, lesson.slug);
  const tool = TOOLS.find((t) => t.slug === lesson.relatedToolSlug);
  const demo = toolSlugToDemo(lesson.relatedToolSlug);
  const context = `${propFirm.shortName} ${lesson.title.toLowerCase()}`;

  return {
    slug,
    title: `${PREMIUM_PROMO_CODE}: ${propFirm.shortName} ${lesson.title} — Prop Firm Lesson Deal`,
    metaDescription: `${propFirm.name} traders learning ${lesson.title.toLowerCase()}: ${PREMIUM_PROMO_CODE} = ${PREMIUM_PROMO_FIRST_MONTH} first month. Chart Academy + ${tool?.shortName ?? "prop tools"}.`,
    h1: `${PREMIUM_PROMO_CODE} — ${lesson.title} for ${propFirm.shortName}`,
    variant: "prop-lesson",
    market: null,
    propFirm,
    topic: null,
    lessonSlug: lesson.slug,
    lessonTitle: lesson.title,
    demo,
    toolSlug: lesson.relatedToolSlug,
    intro: `${propFirm.name} challengers studying ${lesson.title.toLowerCase()} need chart literacy before paying challenge fees. Code ${PREMIUM_PROMO_CODE} unlocks Premium for ${PREMIUM_PROMO_FIRST_MONTH} — all lessons, Prop Survival sims, and VIP Discord.`,
    sections: [
      {
        heading: `${propFirm.shortName} + ${lesson.categoryTitle}`,
        paragraphs: [
          `${lesson.summary} Pair with ${propFirm.profitTarget} targets and ${propFirm.consistencyRule.toLowerCase()} discipline.`,
          `Subscribe with ${PREMIUM_PROMO_CODE} to unlock the complete ${lesson.categoryTitle} track and six planning modules.`,
        ],
      },
      premiumUnlockSection("Chart Academy + Prop Survival"),
    ],
    faqs: basePromoFaqs(context),
    relatedSlugs: [],
    publishedAt: PUBLISHED_AT,
  };
}

function buildTopicDealPromo(topic: SeoTopic): PromoLandingPage {
  const slug = promoSlug(topic.slug, "deal");
  const tool = TOOLS.find((t) => t.slug === topic.toolSlug);

  return {
    slug,
    title: `${PREMIUM_PROMO_CODE} ${topic.name} Deal — ${PREMIUM_PROMO_FIRST_MONTH} Premium | Quicksilver`,
    metaDescription: `${topic.keyword} traders: code ${PREMIUM_PROMO_CODE} for ${PREMIUM_PROMO_DISCOUNT} off. Full ${tool?.shortName ?? "QS module"}, Chart Academy, bot access — ${PREMIUM_PROMO_FIRST_MONTH} month one.`,
    h1: `${PREMIUM_PROMO_CODE} ${topic.name} Deal`,
    variant: "topic-deal",
    market: null,
    propFirm: null,
    topic,
    lessonSlug: null,
    lessonTitle: null,
    demo: topic.demo,
    toolSlug: topic.toolSlug,
    intro: `Looking for ${topic.keyword} software with a launch discount? ${PREMIUM_PROMO_CODE} takes ${PREMIUM_PROMO_DISCOUNT} off your first Premium month (${PREMIUM_PROMO_FIRST_MONTH}) and unlocks the full ${tool?.name ?? "QS module"} plus every other Premium feature.`,
    sections: [
      {
        heading: `What ${topic.name} traders get with ${PREMIUM_PROMO_CODE}`,
        paragraphs: [
          `Free demo on this page, then Premium with ${PREMIUM_PROMO_CODE} for exportable scorecards, portfolio heat maps, and unlimited ${topic.name.toLowerCase()} workflows.`,
          "No tier confusion — one subscription includes Chart Academy, TradeLocker bot, and VIP Discord.",
        ],
      },
      premiumUnlockSection(tool?.name),
    ],
    faqs: basePromoFaqs(topic.name.toLowerCase()),
    relatedSlugs: [],
    publishedAt: PUBLISHED_AT,
  };
}

function buildMarketDealPromo(market: SeoMarket): PromoLandingPage {
  const slug = promoSlug(market.slug, "premium-deal");

  return {
    slug,
    title: `${PREMIUM_PROMO_CODE}: ${market.shortName} Trading Premium — ${PREMIUM_PROMO_FIRST_MONTH}/mo`,
    metaDescription: `${market.name} traders: use ${PREMIUM_PROMO_CODE} for ${PREMIUM_PROMO_DISCOUNT} off Premium. Chart Academy, 6 planning modules, TradeLocker bot — ${PREMIUM_PROMO_FIRST_MONTH} first month.`,
    h1: `${PREMIUM_PROMO_CODE} — ${market.shortName} Premium Deal`,
    variant: "market-deal",
    market,
    propFirm: null,
    topic: null,
    lessonSlug: null,
    lessonTitle: null,
    demo: "setup-scorer",
    toolSlug: "edge-confluence",
    intro: `Trading ${market.name} manually? ${PREMIUM_PROMO_CODE} unlocks the full Quicksilver Premium stack for ${PREMIUM_PROMO_FIRST_MONTH} your first month — optimized for the ${market.session} with setup scoring, risk planning, and live bot access.`,
    sections: [
      {
        heading: `Built for ${market.shortName} session flow`,
        paragraphs: [
          `Mark bias on ${market.shortName}, wait for ${market.session} liquidity, score setups with QS tools, and journal outcomes.`,
          `${PREMIUM_PROMO_CODE} is limited to 100 redemptions — ${PREMIUM_PROMO_DISCOUNT} off before you commit to full ${PREMIUM_PRICE}/mo.`,
        ],
      },
      premiumUnlockSection(),
    ],
    faqs: basePromoFaqs(`${market.shortName} trading`),
    relatedSlugs: [],
    publishedAt: PUBLISHED_AT,
  };
}

function buildPropDealPromo(propFirm: SeoPropFirm): PromoLandingPage {
  const slug = promoSlug(propFirm.slug, "premium-deal");

  return {
    slug,
    title: `${PREMIUM_PROMO_CODE}: ${propFirm.shortName} Prop Firm Premium — ${PREMIUM_PROMO_FIRST_MONTH}`,
    metaDescription: `${propFirm.name} challenge prep with code ${PREMIUM_PROMO_CODE}. ${PREMIUM_PROMO_DISCOUNT} off Premium — Prop Survival, Chart Academy, consistency tools. First month ${PREMIUM_PROMO_FIRST_MONTH}.`,
    h1: `${PREMIUM_PROMO_CODE} — ${propFirm.shortName} Challenge Bundle`,
    variant: "prop-deal",
    market: null,
    propFirm,
    topic: null,
    lessonSlug: null,
    lessonTitle: null,
    demo: "consistency-calc",
    toolSlug: "prop-survival",
    intro: `Preparing for ${propFirm.name}? Code ${PREMIUM_PROMO_CODE} saves ${PREMIUM_PROMO_DISCOUNT} on your first Premium month (${PREMIUM_PROMO_FIRST_MONTH}). Get Prop Survival simulations, consistency calculators, Chart Academy, and VIP Discord in one subscription.`,
    sections: [
      {
        heading: `${propFirm.shortName} rules at a glance`,
        paragraphs: [
          `${propFirm.profitTarget}. ${propFirm.maxDrawdown}. ${propFirm.dailyLossLimit}. ${propFirm.consistencyRule}.`,
          `Stress-test your plan with Premium tools before paying ${propFirm.shortName} challenge fees. ${PREMIUM_PROMO_CODE} makes month one ${PREMIUM_PROMO_FIRST_MONTH}.`,
        ],
      },
      premiumUnlockSection("Prop Survival Engine"),
    ],
    faqs: basePromoFaqs(`${propFirm.shortName} prop firm`),
    relatedSlugs: [],
    publishedAt: PUBLISHED_AT,
  };
}

const BUNDLE_PAGES: Omit<PromoLandingPage, "relatedSlugs">[] = [
  {
    slug: promoSlug("premium"),
    title: `${PREMIUM_PROMO_CODE} Promo — ${PREMIUM_PROMO_DISCOUNT} Off Quicksilver Premium | ${PREMIUM_PROMO_FIRST_MONTH} First Month`,
    metaDescription: `Limited launch offer: code ${PREMIUM_PROMO_CODE} for ${PREMIUM_PROMO_DISCOUNT} off Premium (${PREMIUM_PROMO_FIRST_MONTH} month one). Chart Academy, 6 tools, TradeLocker bot, VIP Discord. First 100 users.`,
    h1: `${PREMIUM_PROMO_CODE} — Premium Launch Offer`,
    variant: "bundle",
    market: null,
    propFirm: null,
    topic: null,
    lessonSlug: null,
    lessonTitle: null,
    demo: "setup-scorer",
    toolSlug: "edge-confluence",
    intro: `Quicksilver Premium is ${PREMIUM_PRICE}/mo for everything — no tier confusion. Launch promo ${PREMIUM_PROMO_CODE} drops your first month to ${PREMIUM_PROMO_FIRST_MONTH}. Limited to the first 100 subscribers.`,
    sections: [
      {
        heading: "What FIRST100 unlocks",
        paragraphs: [
          "89 Chart Academy lessons + prop firm playbook, six QS Planning Modules, TradeLocker Quicksilver Quant Protocol bot, live dashboard, and VIP Discord with live guidance.",
          `${PREMIUM_PROMO_DISCOUNT} off month one. Cancel anytime. Free tier still available with one lesson, one guide, and Setup Scorer.`,
        ],
      },
      premiumUnlockSection(),
    ],
    faqs: basePromoFaqs("Quicksilver Premium"),
    publishedAt: PUBLISHED_AT,
  },
  {
    slug: promoSlug("chart-academy"),
    title: `${PREMIUM_PROMO_CODE}: Chart Academy — ${PREMIUM_PROMO_FIRST_MONTH} First Month | Quicksilver`,
    metaDescription: `89 trading lessons + prop firm guide. Code ${PREMIUM_PROMO_CODE} = ${PREMIUM_PROMO_DISCOUNT} off Premium. ${PREMIUM_PROMO_FIRST_MONTH} month one, first 100 users.`,
    h1: `${PREMIUM_PROMO_CODE} — Chart Academy Bundle`,
    variant: "bundle",
    market: null,
    propFirm: null,
    topic: null,
    lessonSlug: null,
    lessonTitle: null,
    demo: "setup-scorer",
    toolSlug: "edge-confluence",
    intro: `Chart Academy includes ${PUBLIC_LESSONS.length} interactive lessons across chart reading, candlesticks, market structure, Fibonacci, and more. ${PREMIUM_PROMO_CODE} unlocks the full library for ${PREMIUM_PROMO_FIRST_MONTH} your first month.`,
    sections: [
      {
        heading: "Lessons + tools in one Premium sub",
        paragraphs: [
          "Every lesson pairs with QS Planning Modules — score setups, plan risk, and run prop survival sims from the same dashboard.",
          `Enter ${PREMIUM_PROMO_CODE} at checkout for ${PREMIUM_PROMO_DISCOUNT} off month one.`,
        ],
      },
      premiumUnlockSection("Chart Academy"),
    ],
    faqs: basePromoFaqs("Chart Academy"),
    publishedAt: PUBLISHED_AT,
  },
  {
    slug: promoSlug("trading-bot"),
    title: `${PREMIUM_PROMO_CODE}: TradeLocker Bot Access — ${PREMIUM_PROMO_FIRST_MONTH} | Quicksilver`,
    metaDescription: `TradeLocker Quicksilver Quant Protocol bot + live dashboard. Code ${PREMIUM_PROMO_CODE} for ${PREMIUM_PROMO_DISCOUNT} off Premium. ${PREMIUM_PROMO_FIRST_MONTH} first month.`,
    h1: `${PREMIUM_PROMO_CODE} — TradeLocker Bot Deal`,
    variant: "bundle",
    market: null,
    propFirm: null,
    topic: null,
    lessonSlug: null,
    lessonTitle: null,
    demo: "risk-calc",
    toolSlug: "risk-matrix",
    intro: `Premium includes TradeLocker bot access, live dashboard, and open/close position tools. ${PREMIUM_PROMO_CODE} makes your first month ${PREMIUM_PROMO_FIRST_MONTH} — also unlocks Chart Academy and all six planning modules.`,
    sections: [
      {
        heading: "Bot + education + planning",
        paragraphs: [
          "No separate bot tier. FIRST100 applies to the single Premium subscription that includes everything.",
          "Pair automated execution with manual setup scoring and risk planning from the same account.",
        ],
      },
      premiumUnlockSection("TradeLocker Bot"),
    ],
    faqs: basePromoFaqs("TradeLocker bot access"),
    publishedAt: PUBLISHED_AT,
  },
  {
    slug: promoSlug("prop-firm-tools"),
    title: `${PREMIUM_PROMO_CODE}: Prop Firm Tools — ${PREMIUM_PROMO_FIRST_MONTH} First Month`,
    metaDescription: `Prop Survival Monte Carlo, consistency calculator, challenge planning. ${PREMIUM_PROMO_CODE} = ${PREMIUM_PROMO_DISCOUNT} off Premium. ${PREMIUM_PROMO_FIRST_MONTH} month one.`,
    h1: `${PREMIUM_PROMO_CODE} — Prop Firm Toolkit`,
    variant: "bundle",
    market: null,
    propFirm: null,
    topic: null,
    lessonSlug: null,
    lessonTitle: null,
    demo: "consistency-calc",
    toolSlug: "prop-survival",
    intro: `Prop firm challengers use Quicksilver for consistency tracking, Monte Carlo survival sims, and structured trade planning. ${PREMIUM_PROMO_CODE} unlocks the full toolkit for ${PREMIUM_PROMO_FIRST_MONTH} month one.`,
    sections: [
      {
        heading: "Challenge prep without guesswork",
        paragraphs: [
          "Simulate drawdown paths, cap best-day profit share, and score setups before every session.",
          `${PREMIUM_PROMO_CODE} saves ${PREMIUM_PROMO_DISCOUNT} while you validate edge — limited to 100 users.`,
        ],
      },
      premiumUnlockSection("Prop Survival Engine"),
    ],
    faqs: basePromoFaqs("prop firm tools"),
    publishedAt: PUBLISHED_AT,
  },
  {
    slug: promoSlug("all-tools"),
    title: `${PREMIUM_PROMO_CODE}: All 6 Planning Modules — ${PREMIUM_PROMO_FIRST_MONTH}`,
    metaDescription: `Setup Scorer, Risk Matrix, Prop Survival, Execution Protocol, Regime Oracle, Alpha Durability. ${PREMIUM_PROMO_CODE} = ${PREMIUM_PROMO_DISCOUNT} off. ${PREMIUM_PROMO_FIRST_MONTH} first month.`,
    h1: `${PREMIUM_PROMO_CODE} — Full QS Toolkit`,
    variant: "bundle",
    market: null,
    propFirm: null,
    topic: null,
    lessonSlug: null,
    lessonTitle: null,
    demo: "setup-scorer",
    toolSlug: "edge-confluence",
    intro: `All six QS Planning Modules plus Chart Academy, TradeLocker bot, and VIP Discord — one Premium price. ${PREMIUM_PROMO_CODE} makes month one ${PREMIUM_PROMO_FIRST_MONTH}.`,
    sections: [
      {
        heading: "Six modules, one subscription",
        paragraphs: TOOLS.map(
          (t) => `${t.shortName} — ${t.desc}`
        ),
      },
      premiumUnlockSection(),
    ],
    faqs: basePromoFaqs("all QS planning modules"),
    publishedAt: PUBLISHED_AT,
  },
];

function attachRelatedSlugs(pages: PromoLandingPage[]): PromoLandingPage[] {
  const byMarket = new Map<string, PromoLandingPage[]>();
  const byPropFirm = new Map<string, PromoLandingPage[]>();
  const byTopic = new Map<string, PromoLandingPage[]>();

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
    if (page.topic) {
      const list = byTopic.get(page.topic.slug) ?? [];
      list.push(page);
      byTopic.set(page.topic.slug, list);
    }
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
    if (page.topic) {
      for (const p of byTopic.get(page.topic.slug) ?? []) {
        if (p.slug !== page.slug) related.add(p.slug);
      }
    }

    const bundleSlug = promoSlug("premium");
    if (page.slug !== bundleSlug) related.add(bundleSlug);

    return {
      ...page,
      relatedSlugs: Array.from(related).slice(0, 8),
    };
  });
}

function buildAllPromoLandingPages(): PromoLandingPage[] {
  const pages: PromoLandingPage[] = [];

  for (const market of SEO_MARKETS) {
    for (const topic of SEO_TOPICS) {
      pages.push(buildMarketTopicPromo(market, topic));
    }
  }

  for (const propFirm of SEO_PROP_FIRMS) {
    for (const topic of SEO_TOPICS) {
      pages.push(buildPropTopicPromo(propFirm, topic));
    }
  }

  const propMarketTopics = getPropMarketTopics();
  for (const propFirm of SEO_PROP_FIRMS) {
    for (const market of SEO_MARKETS) {
      for (const topic of propMarketTopics) {
        pages.push(buildPropMarketTopicPromo(propFirm, market, topic));
      }
    }
  }

  for (const market of SEO_MARKETS) {
    for (const lesson of PUBLIC_LESSONS) {
      pages.push(buildMarketLessonPromo(market, lesson));
    }
  }

  for (const propFirm of SEO_PROP_FIRMS) {
    for (const lesson of PUBLIC_LESSONS) {
      pages.push(buildPropLessonPromo(propFirm, lesson));
    }
  }

  for (const topic of SEO_TOPICS) {
    pages.push(buildTopicDealPromo(topic));
  }

  for (const market of SEO_MARKETS) {
    pages.push(buildMarketDealPromo(market));
  }

  for (const propFirm of SEO_PROP_FIRMS) {
    pages.push(buildPropDealPromo(propFirm));
  }

  for (const bundle of BUNDLE_PAGES) {
    pages.push({ ...bundle, relatedSlugs: [] });
  }

  return attachRelatedSlugs(pages);
}

export const PROMO_LANDING_PAGES = buildAllPromoLandingPages();

export const PROMO_LANDING_COUNT = PROMO_LANDING_PAGES.length;

export function getPromoLandingPageBySlug(
  slug: string
): PromoLandingPage | undefined {
  return PROMO_LANDING_PAGES.find((p) => p.slug === slug);
}

export function getPromoPagesByMarket(marketSlug: string): PromoLandingPage[] {
  return PROMO_LANDING_PAGES.filter((p) => p.market?.slug === marketSlug);
}

export function getPromoPagesByPropFirm(
  propFirmSlug: string
): PromoLandingPage[] {
  return PROMO_LANDING_PAGES.filter((p) => p.propFirm?.slug === propFirmSlug);
}