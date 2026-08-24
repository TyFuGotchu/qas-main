import Link from "next/link";
import { Check, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { TrackedCheckoutLink } from "@/components/analytics/TrackedCheckoutLink";
import { TrustBox } from "@/components/marketing/TrustBox";
import {
  HOME_FAQS,
  HOME_FOR,
  HOME_NOT_FOR,
  HOME_QUANT_CHIPS,
} from "@/lib/homepage-copy";
import { PREMIUM_PRICE } from "@/lib/pricing-constants";
import { CHART_ACADEMY_STATS, PREMIUM_INCLUDES_ANCHOR } from "@/lib/premium-includes";
import { TOOL_COUNT } from "@/lib/tools-registry";
import { PROP_FIRM_PLAYBOOK_HREF } from "@/lib/prop-firm-challenge-marketing";

const PREMIUM_ITEMS = [
  "Quicksilver Quant Protocol",
  "7-Day Prop Firm Playbook + tracker",
  `${TOOL_COUNT} planning engines`,
  "Chart Academy",
  "Live TradeLocker terminal tools",
  "Prop OS + journal",
  "Priority email support",
];

export function HomeSocialProof() {
  const items = [
    "Built for TradeLocker Desktop",
    "One stack: bot + playbook + academy",
    "Designed around consistency and daily-loss rules",
    "Cancel anytime",
    `${TOOL_COUNT} planning engines`,
    `${CHART_ACADEMY_STATS.lessonCount} academy lessons`,
    "7-day challenge framework",
    "Live terminal tools",
  ];
  return (
    <section className="border-y border-slate-800/60 bg-obsidian-900/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-slate-700/50 bg-slate-950/50 px-3 py-1.5 font-mono text-[11px] text-slate-400"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

export function HomeAudience() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-cyan-500/20 bg-slate-950/40 p-6">
          <h2 className="font-mono text-lg font-bold text-slate-100">Who it’s for</h2>
          <ul className="mt-4 space-y-3">
            {HOME_FOR.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-slate-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-6">
          <h2 className="font-mono text-lg font-bold text-slate-100">Who it’s not for</h2>
          <ul className="mt-4 space-y-3">
            {HOME_NOT_FOR.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-slate-400">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function HomePremiumStack() {
  return (
    <section
      id={PREMIUM_INCLUDES_ANCHOR}
      className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-mono text-2xl font-bold text-slate-50 sm:text-3xl">
          One plan. The full Quicksilver stack.
        </h2>
        <p className="mt-3 font-mono text-xl text-cyan-300">
          {PREMIUM_PRICE}
          <span className="text-base text-slate-500">/mo, cancel anytime</span>
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Quant Protocol access is requested on TradeLocker Hub using the same email as
          TradeLocker Desktop.
        </p>
        <ol className="mt-8 space-y-2 text-left">
          {PREMIUM_ITEMS.map((item, i) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-lg border border-slate-800/50 bg-slate-950/40 px-4 py-3 font-mono text-sm text-slate-200"
            >
              <span className="text-cyan-500">{i + 1}.</span>
              {item}
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <TrackedCheckoutLink source="homepage_premium_section">
            <Button variant="primary" size="lg">
              Start Premium — {PREMIUM_PRICE}/mo
            </Button>
          </TrackedCheckoutLink>
        </div>
      </div>
    </section>
  );
}

export function HomeQuantProtocol() {
  return (
    <section className="border-t border-slate-800/60 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-mono text-2xl font-bold text-slate-50 sm:text-3xl">
          Quant Protocol is not a retail set-and-forget bot.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-400">
          It is the automation layer of the Quicksilver stack. It is built to participate in
          real trend/momentum conditions and stay out of dead, choppy tape. You still
          supervise risk, sessions, and prop-firm rules.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {HOME_QUANT_CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-amber-500/25 bg-amber-500/5 px-3 py-1 font-mono text-[11px] text-amber-100/90"
            >
              {chip}
            </span>
          ))}
        </div>
        <details className="mt-8 rounded-lg border border-slate-800/60 bg-slate-950/50 p-4">
          <summary className="cursor-pointer font-mono text-sm text-slate-300">
            Backtest notes (internal snapshot)
          </summary>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Internal backtest snapshot for educational context only. Not typical. Not live
            results. Not a promise. Figures previously shown as marketing banners (e.g. high
            win rate, R-multiple, or tiny drawdown) are not proof of live performance and are
            not used as homepage claims. Any live review should include instrument, timeframe,
            date range, sample size, win rate, average R, and max drawdown.
          </p>
        </details>
        <Link
          href="/quant-protocol"
          className="mt-6 inline-block font-mono text-sm text-cyan-accent hover:underline"
        >
          See Quant Protocol →
        </Link>
      </div>
    </section>
  );
}

export function HomePlaybook() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-mono text-2xl font-bold text-slate-50 sm:text-3xl">
          7-Day Prop Firm Playbook
        </h2>
        <p className="mt-2 font-mono text-sm text-slate-500">
          A day-by-day framework for common evaluation windows
        </p>
        <p className="mt-4 text-base leading-relaxed text-slate-400">
          Daily profit caps, consistency awareness around a ≤20% best-day ratio where
          relevant, daily loss control, and an in-dashboard challenge tracker. This is a
          framework, not a guaranteed pass. Confirm your own firm’s current rules before you
          trade a challenge.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/launch">
            <Button variant="secondary">Read the Playbook</Button>
          </Link>
          <Link href={PROP_FIRM_PLAYBOOK_HREF}>
            <Button variant="ghost">Free preview</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeToolsAcademy() {
  return (
    <section className="border-t border-slate-800/60 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <Link
          href="/tools"
          className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-6 transition-colors hover:border-cyan-500/30"
        >
          <h2 className="font-mono text-lg font-bold text-slate-100">
            {TOOL_COUNT} planning engines
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Risk Matrix, Prop Survival, Edge Confluence, expectancy, and the rest of the desk
            tools — sized around challenge math, not vibes.
          </p>
          <p className="mt-4 font-mono text-xs text-cyan-accent">Open tools →</p>
        </Link>
        <Link
          href="/lessons"
          className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-6 transition-colors hover:border-cyan-500/30"
        >
          <h2 className="font-mono text-lg font-bold text-slate-100">Chart Academy</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {CHART_ACADEMY_STATS.lessonCount} structured lessons — structure, sessions,
            forex, CFDs — so you can read the tape before you automate it.
          </p>
          <p className="mt-4 font-mono text-xs text-cyan-accent">Open academy →</p>
        </Link>
      </div>
    </section>
  );
}

export function HomeFaq() {
  return (
    <section id="faq" className="border-t border-slate-800/60 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-mono text-2xl font-bold text-slate-50">FAQ</h2>
        <dl className="mt-8 space-y-4">
          {HOME_FAQS.map((item) => (
            <div
              key={item.question}
              className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-5"
            >
              <dt className="font-mono text-sm font-semibold text-slate-200">{item.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-400">{item.answer}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-center">
          <Link href="/faq" className="font-mono text-xs text-cyan-accent hover:underline">
            Full FAQ →
          </Link>
        </p>
      </div>
    </section>
  );
}

export function HomeFinalCta() {
  return (
    <section className="px-4 py-20 pb-28 sm:px-6 lg:px-8 md:pb-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-mono text-2xl font-bold text-slate-50 sm:text-3xl">
          Start with the stack, not another reset.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
          Create your Quicksilver profile, subscribe to Premium Quant, then request Quant
          Protocol on TradeLocker Hub with the same Desktop login email.
        </p>
        <p className="mt-3 font-mono text-xs text-slate-500">
          Still resetting accounts? Start with the playbook and risk layer first.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <TrackedCheckoutLink source="homepage_final_cta">
            <Button variant="primary" size="lg">
              Start Premium
            </Button>
          </TrackedCheckoutLink>
          <Link href="/launch">
            <Button variant="secondary" size="lg">
              Read the Playbook
            </Button>
          </Link>
          <Link href="/quant-protocol">
            <Button variant="ghost" size="lg">
              See the Bot
            </Button>
          </Link>
        </div>
        <TrustBox className="mx-auto mt-10 max-w-2xl text-center" />
      </div>
    </section>
  );
}
