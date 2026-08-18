import { TOOLS, TOOL_COUNT } from "@/lib/tools-registry";
import {
 PROP_FIRM_CHALLENGE_DAYS,
 PROP_FIRM_MARKETING_HEADLINE,
 PROP_FIRM_MARKETING_SUBHEADLINE,
 PROP_FIRM_PLAYBOOK_HREF,
} from "@/lib/prop-firm-challenge-marketing";
import {
 PREMIUM_PRICE,
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
 question: `How much is Premium for ${context}?`,
 answer: `Quicksilver Premium is ${PREMIUM_PRICE}/mo and unlocks the full ${PROP_FIRM_CHALLENGE_DAYS}-day prop firm playbook, all ${TOOL_COUNT} planning engines, Chart Academy, TradeLocker bot, and priority email support.`,
 },
 {
 question: `How do I subscribe for ${context}?`,
 answer: `Click Subscribe on this page to open Stripe checkout and unlock Premium instantly — the full ${PROP_FIRM_CHALLENGE_DAYS}-day prop firm playbook, all ${TOOL_COUNT} planning engines, Chart Academy, TradeLocker bot, and priority email support.`,
 },
 {
 question: "What does Premium include?",
 answer:
 `Everything in one subscription: the ${PROP_FIRM_CHALLENGE_DAYS}-Day Prop Firm Playbook (${PROP_FIRM_PLAYBOOK_HREF}), ${TOOL_COUNT} planning engines, 89 Chart Academy lessons, TradeLocker Quicksilver Quant Protocol bot, live dashboard, and priority email support at supportteam@quicksilveralgo.com.`,
 },
 {
 question: "Is there a free tier?",
 answer:
 "Yes. Free accounts get one lesson, one guide, and the Setup Scorer. Upgrade to Premium when you are ready for full access.",
 },
 ];
}

function premiumUnlockSection(toolName?: string): {
 heading: string;
 paragraphs: string[];
} {
 return {
 heading: `Unlock Premium — ${PREMIUM_PRICE}/mo`,
 paragraphs: [
 `Premium is ${PREMIUM_PRICE}/mo for the full Quicksilver stack.`,
 toolName
 ? `This plan unlocks the full ${toolName} plus every other Premium feature — no upsells, no tier confusion.`
 : "One price unlocks Chart Academy, all planning tools, the TradeLocker bot, and priority email support.",
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
 title: `: ${market.shortName} ${topic.name} — Off Premium | Quicksilver`,
 metaDescription: `${PREMIUM_PRICE}/mo on ${market.name} ${topic.name.toLowerCase()}. Free demo + full ${tool?.shortName ?? "QS"} module, Chart Academy, and TradeLocker bot.`,
 h1: ` — ${market.shortName} ${topic.name}`,
 variant: "market-topic",
 market,
 propFirm: null,
 topic,
 lessonSlug: null,
 lessonTitle: null,
 demo: topic.demo,
 toolSlug: topic.toolSlug,
 intro: `Manual traders on ${market.name} use ${topic.name.toLowerCase()} during the ${market.session}. Start with the free demo below, then subscribe to unlock Premium for ${PREMIUM_PRICE} — full ${tool?.shortName ?? "planning tools"}, Chart Academy, and priority email support included.`,
 sections: [
 {
 heading: `Why ${topic.name} + on ${market.shortName}`,
 paragraphs: [
 `${market.name} moves fast without structured ${topic.keyword}. Quicksilver Premium bundles ${topic.name.toLowerCase()}, risk planning, and prop firm survival tools in one subscription.`,
 `Subscribe so you can test the full ${tool?.name ?? "QS module"} on ${market.shortName} before paying full price.`,
 ],
 },
 {
 heading: `Free demo → upgrade workflow`,
 paragraphs: [
 `Run the ${topic.demo.replace(/-/g, " ")} demo on this page, journal 10–20 ${market.shortName} setups, then subscribe with when you want exportable scorecards and unlimited access.`,
 `Premium members also get the TradeLocker Quicksilver Quant Protocol bot and live dashboard — same code, same ${PREMIUM_PRICE} intro price.`,
 ],
 },
 premiumUnlockSection(tool?.name),
 ],
 faqs: [
 ...basePromoFaqs(context),
 {
 question: `Is the ${market.shortName} ${topic.name.toLowerCase()} demo free?`,
 answer: `Yes. The demo is free for all visitors. unlocks the complete ${tool?.shortName ?? "module"} and all Premium features.`,
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
 title: `: ${propFirm.shortName} ${topic.name} — ${PREMIUM_PRICE} First Month | Quicksilver`,
 metaDescription: `${propFirm.name} traders: Premium. ${topic.name} tools, prop survival sims, Chart Academy — ${PREMIUM_PRICE} Premium.`,
 h1: ` for ${propFirm.shortName} ${topic.name}`,
 variant: "prop-topic",
 market: null,
 propFirm,
 topic,
 lessonSlug: null,
 lessonTitle: null,
 demo: topic.demo,
 toolSlug: topic.toolSlug,
 intro: `${propFirm.name} challengers need ${topic.name.toLowerCase()} that respects ${propFirm.profitTarget}, ${propFirm.maxDrawdown}, and ${propFirm.consistencyRule.toLowerCase()}. ${PREMIUM_PRICE} your first Premium month — full ${tool?.shortName ?? "QS tools"}, Chart Academy, and challenge survival simulations.`,
 sections: [
 {
 heading: `${propFirm.shortName} rules + bundle`,
 paragraphs: [
 `Profit target: ${propFirm.profitTarget}. Max drawdown: ${propFirm.maxDrawdown}. Daily loss: ${propFirm.dailyLossLimit}. Consistency: ${propFirm.consistencyRule}.`,
 `Premium bundles ${topic.name.toLowerCase()}, Prop Survival Monte Carlo, and six planning modules. saves on Premium while you validate edge.`,
 ],
 },
 {
 heading: "Prop firm workflow with Quicksilver Premium",
 paragraphs: [
 `Score every setup with the demo below, log best-day share of profit, then upgrade for exportable reports and unlimited challenge simulations.`,
 `Priority email support at supportteam@quicksilveralgo.com is included — get help while you prep for ${propFirm.shortName}.`,
 ],
 },
 premiumUnlockSection(tool?.name),
 ],
 faqs: [
 ...basePromoFaqs(context),
 {
 question: `Does guarantee a ${propFirm.shortName} pass?`,
 answer:
 "No. Quicksilver is planning and education software. discounts Premium access — you execute trades yourself on any platform.",
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
 title: `: ${propFirm.shortName} ${market.shortName} ${topic.name} | Quicksilver`,
 metaDescription: `${propFirm.name} + ${market.name}: = ${PREMIUM_PRICE}/mo. ${topic.keyword}, prop rules, Chart Academy, and TradeLocker bot.`,
 h1: ` — ${propFirm.shortName} × ${market.shortName} ${topic.name}`,
 variant: "prop-market-topic",
 market,
 propFirm,
 topic,
 lessonSlug: null,
 lessonTitle: null,
 demo: topic.demo,
 toolSlug: topic.toolSlug,
 intro: `Traders targeting ${propFirm.name} on ${market.name} combine ${topic.name.toLowerCase()} with strict risk rules. unlocks Premium for ${PREMIUM_PRICE} Premium — ${tool?.shortName ?? "planning tools"}, prop survival engine, and priority email support.`,
 sections: [
 {
 heading: `${market.shortName} session + ${propFirm.shortName} compliance`,
 paragraphs: [
 `Focus on the ${market.session} for ${market.shortName} liquidity. ${propFirm.consistencyRule} means you cannot rely on one lucky ${market.shortName} day.`,
 `Use the demo to score setups, then apply for full ${topic.name.toLowerCase()} analytics and challenge stress-tests.`,
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
 title: `: ${market.shortName} ${lesson.title} Lesson — Off | Quicksilver`,
 metaDescription: `Learn ${lesson.title.toLowerCase()} on ${market.name}. Premium at ${PREMIUM_PRICE} Premium — full Chart Academy, ${tool?.shortName ?? "tools"}, and priority email support.`,
 h1: ` — ${lesson.title} on ${market.shortName}`,
 variant: "market-lesson",
 market,
 propFirm: null,
 topic: null,
 lessonSlug: lesson.slug,
 lessonTitle: lesson.title,
 demo,
 toolSlug: lesson.relatedToolSlug,
 intro: `Studying ${lesson.title.toLowerCase()} on ${market.name}? Preview the lesson free, then use to unlock all ${PUBLIC_LESSONS.length} Chart Academy lessons for ${PREMIUM_PRICE} — plus ${tool?.shortName ?? "planning modules"} and the TradeLocker bot.`,
 sections: [
 {
 heading: `Why ${lesson.title} matters on ${market.shortName}`,
 paragraphs: [
 lesson.summary,
 `During the ${market.session}, apply ${lesson.sectionTitle} concepts with the free demo, then upgrade with when you want the full ${lesson.categoryTitle} library.`,
 ],
 },
 premiumUnlockSection("Chart Academy"),
 ],
 faqs: [
 ...basePromoFaqs(context),
 {
 question: `Can I preview ${lesson.title} before using ?`,
 answer:
 "Yes. Every lesson has a free preview. applies when you upgrade to Premium for full access.",
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
 title: `: ${propFirm.shortName} ${lesson.title} — Prop Firm Lesson Deal`,
 metaDescription: `${propFirm.name} traders learning ${lesson.title.toLowerCase()}: = ${PREMIUM_PRICE}/mo. Chart Academy + ${tool?.shortName ?? "prop tools"}.`,
 h1: ` — ${lesson.title} for ${propFirm.shortName}`,
 variant: "prop-lesson",
 market: null,
 propFirm,
 topic: null,
 lessonSlug: lesson.slug,
 lessonTitle: lesson.title,
 demo,
 toolSlug: lesson.relatedToolSlug,
 intro: `${propFirm.name} challengers studying ${lesson.title.toLowerCase()} need chart literacy before paying challenge fees. Premium unlocks for ${PREMIUM_PRICE} — all lessons, Prop Survival sims, and priority email support.`,
 sections: [
 {
 heading: `${propFirm.shortName} + ${lesson.categoryTitle}`,
 paragraphs: [
 `${lesson.summary} Pair with ${propFirm.profitTarget} targets and ${propFirm.consistencyRule.toLowerCase()} discipline.`,
 `Subscribe with to unlock the complete ${lesson.categoryTitle} track and six planning modules.`,
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
 title: ` ${topic.name} Deal — ${PREMIUM_PRICE} Premium | Quicksilver`,
 metaDescription: `${topic.keyword} traders: off. Full ${tool?.shortName ?? "QS module"}, Chart Academy, bot access — ${PREMIUM_PRICE} Premium.`,
 h1: ` ${topic.name} Deal`,
 variant: "topic-deal",
 market: null,
 propFirm: null,
 topic,
 lessonSlug: null,
 lessonTitle: null,
 demo: topic.demo,
 toolSlug: topic.toolSlug,
 intro: `Looking for ${topic.keyword} software with a launch discount? takes off your first Premium month (${PREMIUM_PRICE}) and unlocks the full ${tool?.name ?? "QS module"} plus every other Premium feature.`,
 sections: [
 {
 heading: `What ${topic.name} traders get with `,
 paragraphs: [
 `Free demo on this page, then Premium with for exportable scorecards, portfolio heat maps, and unlimited ${topic.name.toLowerCase()} workflows.`,
 "No tier confusion — one subscription includes Chart Academy, TradeLocker bot, and priority email support.",
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
 title: `: ${market.shortName} Trading Premium — ${PREMIUM_PRICE}/mo`,
 metaDescription: `${market.name} traders: use for off Premium. Chart Academy, 6 planning modules, TradeLocker bot — ${PREMIUM_PRICE}/mo.`,
 h1: ` — ${market.shortName} Premium Deal`,
 variant: "market-deal",
 market,
 propFirm: null,
 topic: null,
 lessonSlug: null,
 lessonTitle: null,
 demo: "setup-scorer",
 toolSlug: "edge-confluence",
 intro: `Trading ${market.name} manually? unlocks the full Quicksilver Premium stack for ${PREMIUM_PRICE} — optimized for the ${market.session} with setup scoring, risk planning, and live bot access.`,
 sections: [
 {
 heading: `Built for ${market.shortName} session flow`,
 paragraphs: [
 `Mark bias on ${market.shortName}, wait for ${market.session} liquidity, score setups with QS tools, and journal outcomes.`,
 ` is limited to 100 redemptions — off before you commit to full ${PREMIUM_PRICE}/mo.`,
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
 title: `: ${propFirm.shortName} Prop Firm Premium — ${PREMIUM_PRICE}`,
 metaDescription: `${propFirm.name} challenge prep with code . Premium — Prop Survival, Chart Academy, consistency tools. ${PREMIUM_PRICE}/mo.`,
 h1: ` — ${propFirm.shortName} Challenge Bundle`,
 variant: "prop-deal",
 market: null,
 propFirm,
 topic: null,
 lessonSlug: null,
 lessonTitle: null,
 demo: "consistency-calc",
 toolSlug: "prop-survival",
 intro: `Preparing for ${propFirm.name}? Premium is ${PREMIUM_PRICE}/mo. Get Prop Survival simulations, consistency calculators, Chart Academy, and priority email support in one subscription.`,
 sections: [
 {
 heading: `${propFirm.shortName} rules at a glance`,
 paragraphs: [
 `${propFirm.profitTarget}. ${propFirm.maxDrawdown}. ${propFirm.dailyLossLimit}. ${propFirm.consistencyRule}.`,
 `Stress-test your plan with Premium tools before paying ${propFirm.shortName} challenge fees. makes Premium ${PREMIUM_PRICE}.`,
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
 title: ` Promo — Off Quicksilver Premium | ${PREMIUM_PRICE} First Month`,
 metaDescription: `Limited launch offer: Premium (${PREMIUM_PRICE} Premium). Chart Academy, 6 tools, TradeLocker bot, priority email support. subscribers.`,
 h1: ` — Premium Launch Offer`,
 variant: "bundle",
 market: null,
 propFirm: null,
 topic: null,
 lessonSlug: null,
 lessonTitle: null,
 demo: "setup-scorer",
 toolSlug: "edge-confluence",
 intro: `${PROP_FIRM_MARKETING_HEADLINE}. Quicksilver Premium is ${PREMIUM_PRICE}/mo — is ${PREMIUM_PRICE}/mo. available now.`,
 sections: [
 {
 heading: "What unlocks",
 paragraphs: [
 `${PROP_FIRM_MARKETING_SUBHEADLINE}`,
 `Plus all ${TOOL_COUNT} planning engines, 89 Chart Academy lessons, TradeLocker bot, live dashboard, and priority email support. . Cancel anytime.`,
 ],
 },
 premiumUnlockSection(),
 ],
 faqs: basePromoFaqs("Quicksilver Premium"),
 publishedAt: PUBLISHED_AT,
 },
 {
 slug: promoSlug("prop-firm-one-week"),
 title: `: ${PROP_FIRM_MARKETING_HEADLINE} — ${PREMIUM_PRICE}`,
 metaDescription: `${PROP_FIRM_MARKETING_SUBHEADLINE} Premium. ${PREMIUM_PRICE}/mo.`,
 h1: ` — 7-Day Prop Firm Playbook`,
 variant: "bundle",
 market: null,
 propFirm: null,
 topic: null,
 lessonSlug: "prop-firm-one-week",
 lessonTitle: PROP_FIRM_MARKETING_HEADLINE,
 demo: "consistency-calc",
 toolSlug: "prop-survival",
 intro: `${PROP_FIRM_MARKETING_SUBHEADLINE} Premium unlocks the full execution plan at ${PROP_FIRM_PLAYBOOK_HREF}. makes Premium ${PREMIUM_PRICE}.`,
 sections: [
 {
 heading: "Day-by-day challenge execution",
 paragraphs: [
 "Seven sessions with profit caps, consistency audits, and red-day protocols — built for 8–10% targets and 20% best-day rules.",
 `Pair the playbook with Prop Survival, Edge Confluence, and Risk Matrix from the same Premium dashboard.`,
 ],
 },
 premiumUnlockSection("7-Day Prop Firm Playbook"),
 ],
 faqs: basePromoFaqs("7-day prop firm playbook"),
 publishedAt: PUBLISHED_AT,
 },
 {
 slug: promoSlug("chart-academy"),
 title: `: Chart Academy — ${PREMIUM_PRICE} First Month | Quicksilver`,
 metaDescription: `89 trading lessons + prop firm guide. Premium. ${PREMIUM_PRICE} Premium, subscribers.`,
 h1: ` — Chart Academy Bundle`,
 variant: "bundle",
 market: null,
 propFirm: null,
 topic: null,
 lessonSlug: null,
 lessonTitle: null,
 demo: "setup-scorer",
 toolSlug: "edge-confluence",
 intro: `Chart Academy includes ${PUBLIC_LESSONS.length} interactive lessons across chart reading, candlesticks, market structure, Fibonacci, and more. unlocks the full library for ${PREMIUM_PRICE} your/mo.`,
 sections: [
 {
 heading: "Lessons + tools in one Premium sub",
 paragraphs: [
 "Every lesson pairs with QS Planning Modules — score setups, plan risk, and run prop survival sims from the same dashboard.",
 `Enter at checkout for .`,
 ],
 },
 premiumUnlockSection("Chart Academy"),
 ],
 faqs: basePromoFaqs("Chart Academy"),
 publishedAt: PUBLISHED_AT,
 },
 {
 slug: promoSlug("trading-bot"),
 title: `: TradeLocker Bot Access — ${PREMIUM_PRICE} | Quicksilver`,
 metaDescription: `TradeLocker Quicksilver Quant Protocol bot + live dashboard. Premium. ${PREMIUM_PRICE}/mo.`,
 h1: ` — TradeLocker Bot Deal`,
 variant: "bundle",
 market: null,
 propFirm: null,
 topic: null,
 lessonSlug: null,
 lessonTitle: null,
 demo: "risk-calc",
 toolSlug: "risk-matrix",
 intro: `Premium includes TradeLocker bot access, live dashboard, and open/close position tools. makes ${PREMIUM_PRICE} — also unlocks Chart Academy and all six planning modules.`,
 sections: [
 {
 heading: "Bot + education + planning",
 paragraphs: [
 "No separate bot tier. applies to the single Premium subscription that includes everything.",
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
 title: `: Prop Firm Tools — ${PREMIUM_PRICE} First Month`,
 metaDescription: `Prop Survival Monte Carlo, consistency calculator, challenge planning. = off Premium. ${PREMIUM_PRICE} Premium.`,
 h1: ` — Prop Firm Toolkit`,
 variant: "bundle",
 market: null,
 propFirm: null,
 topic: null,
 lessonSlug: null,
 lessonTitle: null,
 demo: "consistency-calc",
 toolSlug: "prop-survival",
 intro: `${PROP_FIRM_MARKETING_HEADLINE}. unlocks the full day-by-day playbook plus Prop Survival, Risk Matrix, and all ${TOOL_COUNT} engines for ${PREMIUM_PRICE} Premium.`,
 sections: [
 {
 heading: "7-day challenge plan — not guesswork",
 paragraphs: [
 "Daily profit caps keep you under the 20% consistency threshold. Pre-session tasks wire Edge Confluence, Prop Survival, and Risk Matrix into every trading day.",
 ` saves — limited to 100 users.`,
 ],
 },
 premiumUnlockSection("7-Day Prop Firm Playbook"),
 ],
 faqs: basePromoFaqs("prop firm tools"),
 publishedAt: PUBLISHED_AT,
 },
 {
 slug: promoSlug("all-tools"),
 title: `: All 6 Planning Modules — ${PREMIUM_PRICE}`,
 metaDescription: `Setup Scorer, Risk Matrix, Prop Survival, Execution Protocol, Regime Oracle, Alpha Durability. = off. ${PREMIUM_PRICE}/mo.`,
 h1: ` — Full QS Toolkit`,
 variant: "bundle",
 market: null,
 propFirm: null,
 topic: null,
 lessonSlug: null,
 lessonTitle: null,
 demo: "setup-scorer",
 toolSlug: "edge-confluence",
 intro: `All six QS Planning Modules plus Chart Academy, TradeLocker bot, and priority email support — one Premium price. makes Premium ${PREMIUM_PRICE}.`,
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