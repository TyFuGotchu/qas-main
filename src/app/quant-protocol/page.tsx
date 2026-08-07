import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Check, ExternalLink, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { TrackedCheckoutLink } from "@/components/analytics/TrackedCheckoutLink";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { PremiumEverythingIncluded } from "@/components/marketing/PremiumEverythingIncluded";
import { QuantProtocolDesktopNotice } from "@/components/trading-bots/QuantProtocolDesktopNotice";
import {
  CHART_ACADEMY_STATS,
  LIVE_TERMINAL_TOOLS,
  PREMIUM_INCLUDE_CATEGORIES,
  QUICKSILVER_QUANT_PROTOCOL,
} from "@/lib/premium-includes";
import {
  getPremiumCheckoutUrl,
  PREMIUM_PRICE,
} from "@/lib/pricing-constants";
import { PROP_FIRM_CHALLENGE_DAYS } from "@/lib/prop-firm-challenge-marketing";
import { TOOL_COUNT } from "@/lib/tools-registry";
import { rankingPageMetadata, SEO_CONTENT_REFRESHED } from "@/lib/seo/page-metadata";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  howToJsonLd,
  subscriptionProductJsonLd,
} from "@/lib/seo/json-ld";
import { QUANT_PROTOCOL_LANDING_PATH } from "@/lib/email/bulk-templates";
import { TRADING_BOTS_NAV } from "@/lib/trading-bots";
import { AuthorityCrossLinks } from "@/components/seo/AuthorityCrossLinks";

const PATH = QUANT_PROTOCOL_LANDING_PATH;

export const metadata: Metadata = rankingPageMetadata({
  title: "Quicksilver Quant Protocol — TradeLocker Bot + Premium Stack",
  description:
    "Requested TradeLocker bot access? Premium Quant unlocks Quicksilver Quant Protocol plus the 7-Day Playbook, planning tools, Chart Academy, and live terminal. $149.99/mo.",
  path: PATH,
  modifiedAt: SEO_CONTENT_REFRESHED,
  keywords: [
    "Quicksilver Quant Protocol",
    "TradeLocker bot",
    "prop firm trading bot",
    "Premium Quant",
    "TradeLocker algo",
    "TradeLocker desktop bot",
  ],
});

const FAQS = [
  {
    question: "I requested the bot on TradeLocker — how do I get access?",
    answer: `Premium Quant (${PREMIUM_PRICE}/mo) unlocks the full Quicksilver stack, including the workflow to enable Quicksilver Quant Protocol on your TradeLocker account.`,
  },
  {
    question: "Do I need TradeLocker Desktop, or does the web platform work?",
    answer:
      "Desktop only. To request access and run Quicksilver Quant Protocol you must use the TradeLocker desktop application. The bot is not available on TradeLocker Web — install desktop, log in there, then request or enable the bot from the desktop marketplace.",
  },
  {
    question: "Is the bot a separate purchase from Premium?",
    answer:
      "No. Premium Quant is one subscription: Quant Protocol on TradeLocker, the 7-Day Prop Firm Playbook, planning engines, Chart Academy, live terminal tools, and Prop OS.",
  },
  {
    question: "What do I do after I subscribe?",
    answer:
      "Install TradeLocker Desktop (required) → log into Quicksilver → Trading Bots → Quant Protocol for setup and asset settings → from desktop, open the marketplace hub and enable Quant Protocol on your account.",
  },
  {
    question: "Do I need a specific broker or prop firm?",
    answer:
      "Any TradeLocker-compatible broker or firm works. Our active partner links include Risen FX and HeroFX (brokers) and FunderPro (prop firm) — all allow bots/EAs. On the dashboard, pick bots vs manual first, then open any partner. Premium also includes live terminal tools once an account is linked.",
  },
];

export default function QuantProtocolLandingPage() {
  const priceNum = Number.parseFloat(PREMIUM_PRICE.replace(/[^0-9.]/g, "")) || 149.99;
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Quicksilver Quant Protocol", path: PATH },
    ]),
    howToJsonLd({
      name: "How to unlock Quicksilver Quant Protocol on TradeLocker",
      description:
        "Subscribe to Premium Quant, open the bot setup page, and enable Quant Protocol on TradeLocker.",
      path: PATH,
      totalTime: "PT30M",
      steps: [
        {
          name: "Subscribe to Premium Quant",
          text: `Checkout for Premium Quant at ${PREMIUM_PRICE}/mo.`,
        },
        {
          name: "Create or log into Quicksilver",
          text: "Use the same email you can manage billing with.",
        },
        {
          name: "Open Trading Bots → Quant Protocol",
          text: "Copy asset settings (e.g. NAS100) and follow the setup checklist.",
        },
        {
          name: "Install TradeLocker Desktop",
          text: "The bot is not available on TradeLocker Web. Download the desktop app and log in with your broker account.",
        },
        {
          name: "Enable the bot on TradeLocker Desktop",
          text: "From the desktop marketplace hub, subscribe/enable Quicksilver Quant Protocol and run it on your account.",
        },
      ],
    }),
    faqJsonLd(FAQS),
    subscriptionProductJsonLd({
      name: "Quicksilver Quant Protocol — Premium Quant",
      description:
        "TradeLocker Quant Protocol bot access plus 7-Day Playbook, planning tools, Chart Academy, and live terminal.",
      path: PATH,
      price: priceNum,
      checkoutUrl: getPremiumCheckoutUrl(),
      category: "FinanceApplication",
      datePublished: SEO_CONTENT_REFRESHED,
    }),
  ];

  return (
    <article className="space-y-12">
      <JsonLdScript data={jsonLd} />

      <header className="text-center">
        <Badge variant="success" className="mb-4">
          TradeLocker bot access requests
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-50 sm:text-4xl lg:text-5xl">
          You requested Quicksilver Quant Protocol
        </h1>
        <p className="mx-auto mt-3 max-w-2xl font-mono text-sm uppercase tracking-widest text-cyan-400/90">
          {QUICKSILVER_QUANT_PROTOCOL.subtitle} · {QUICKSILVER_QUANT_PROTOCOL.tagline}
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
          Access is included with <strong className="text-slate-300">Premium Quant</strong> —
          the same plan unlocks the bot on TradeLocker <em>and</em> the full prop-firm trader
          stack: playbook, planning engines, Chart Academy, and live terminal tools.
        </p>
        <p className="mt-6 font-mono text-2xl font-bold text-slate-100">
          {PREMIUM_PRICE}
          <span className="text-base font-normal text-slate-500">/mo</span>
        </p>
        <p className="mt-1 font-mono text-xs text-slate-600">
          One plan · full Premium stack
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <TrackedCheckoutLink source="quant_protocol_hero">
            <Button variant="primary" size="lg">
              <Zap className="h-4 w-4" />
              Unlock Premium Quant
            </Button>
          </TrackedCheckoutLink>
          <a
            href={QUICKSILVER_QUANT_PROTOCOL.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="lg">
              <ExternalLink className="h-4 w-4" />
              TradeLocker Hub listing
            </Button>
          </a>
        </div>
        <div className="mx-auto mt-6 max-w-2xl text-left">
          <QuantProtocolDesktopNotice />
        </div>
      </header>

      <section className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-slate-950 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10">
            <Bot className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-mono text-lg font-bold text-slate-100">
              {QUICKSILVER_QUANT_PROTOCOL.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {QUICKSILVER_QUANT_PROTOCOL.description}
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {QUICKSILVER_QUANT_PROTOCOL.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2 font-mono text-xs text-slate-400"
                >
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-center font-mono text-sm font-semibold uppercase tracking-widest text-slate-400">
          Same subscription — full Premium stack
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-slate-500">
          Bot requesters get more than an algo. Premium is the operating system around the bot.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {PREMIUM_INCLUDE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-mono text-sm font-semibold text-slate-200">
                  {cat.title}
                </h3>
                {cat.badge && <Badge variant="warning">{cat.badge}</Badge>}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{cat.description}</p>
              {cat.href && (
                <Link
                  href={cat.href}
                  className="mt-3 inline-block font-mono text-[10px] uppercase tracking-wider text-cyan-400 hover:underline"
                >
                  Learn more →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-400">
          Live terminal tools (with Premium)
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LIVE_TERMINAL_TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="rounded-lg border border-slate-800/50 bg-slate-950/30 px-4 py-3"
            >
              <p className="font-mono text-xs font-semibold text-slate-200">{tool.name}</p>
              <p className="mt-1 text-[11px] text-slate-500">{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <PremiumEverythingIncluded showGuarantee={false} className="!px-0 !py-0" />

      <section className="rounded-xl border border-slate-800/60 bg-slate-950/50 p-6">
        <h2 className="font-mono text-lg font-bold text-slate-100">After you subscribe</h2>
        <ol className="mt-4 space-y-3 font-mono text-sm text-slate-400">
          <li className="flex gap-3">
            <span className="text-cyan-400">01.</span>
            Checkout → {PREMIUM_PRICE}/mo
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400">02.</span>
            Register or log in at quicksilveralgo.com
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400">03.</span>
            Dashboard → Trading Bots → Quant Protocol (NAS100 settings + checklist)
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400">04.</span>
            Enable the bot on TradeLocker and monitor in the live terminal
          </li>
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <TrackedCheckoutLink source="quant_protocol_steps">
            <Button variant="primary" size="md">
              Subscribe
            </Button>
          </TrackedCheckoutLink>
          <Link href={TRADING_BOTS_NAV.quantProtocol}>
            <Button variant="secondary" size="md">
              Open bot settings (members)
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="ghost" size="md">
              Create free account
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-center font-mono text-lg font-bold text-slate-200">
          FAQ — bot access requests
        </h2>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-5"
            >
              <h3 className="font-mono text-sm font-semibold text-slate-200">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 to-slate-950/80 px-6 py-10 text-center">
        <h2 className="font-mono text-2xl font-bold text-slate-100">
          Premium = bot + prop-firm system
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
          {PROP_FIRM_CHALLENGE_DAYS}-day playbook · {TOOL_COUNT} tools ·{" "}
          {CHART_ACADEMY_STATS.lessonCount} lessons · live terminal · Quant Protocol
        </p>
        <TrackedCheckoutLink source="quant_protocol_footer" className="mt-6 inline-block">
          <Button variant="primary" size="lg">
            Get Premium Quant — {PREMIUM_PRICE}/mo
          </Button>
        </TrackedCheckoutLink>
      </section>

      <AuthorityCrossLinks currentPath={PATH} />
    </article>
  );
}
