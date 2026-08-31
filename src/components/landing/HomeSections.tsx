import type { ReactNode } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { TrackedCheckoutLink } from "@/components/analytics/TrackedCheckoutLink";
import { StartOfferCtas } from "@/components/marketing/StartOfferCtas";
import { TRIAL_REQUEST_COPY, getTrialRequestMailto } from "@/lib/trial-request";
import { TrustBox } from "@/components/marketing/TrustBox";
import {
  HOME_COMPARISON,
  HOME_FAQS,
  HOME_FOR,
  HOME_LIVE_GROWTH,
  HOME_NOT_FOR,
  HOME_PRICING,
  HOME_PROP_MODULE,
  HOME_QUANT,
  HOME_QUANT_CHIPS,
  HOME_TRADELOCKER,
  HOME_WORKFLOW,
} from "@/lib/homepage-copy";
import { PREMIUM_INCLUDES_ANCHOR } from "@/lib/premium-includes";
import { TOOL_COUNT } from "@/lib/tools-registry";
import { CHART_ACADEMY_STATS } from "@/lib/premium-includes";
import { PROP_FIRM_PLAYBOOK_HREF } from "@/lib/prop-firm-challenge-marketing";
import {
  E8_PRESETS,
  E8_PUBLIC_PATH,
  E8_WHY,
  getLiveDiscounts,
  getLiveGiveaways,
} from "@/lib/e8-partner";
import { E8SignupButton } from "@/components/e8/E8SignupButton";
import { cn } from "@/lib/utils";

function SectionFrame({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("px-4 py-20 sm:px-6 sm:py-24 lg:px-8", className)}>
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#9AA3B2]">{children}</p>
  );
}

export function HomeWorkflow() {
  return (
    <SectionFrame className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>One workflow</Eyebrow>
        <h2 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight text-[#F3F5F7] sm:text-4xl">
          Plan → Execute → Enforce → Journal → Review
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
          Structure first, automation second. One desk from pre-trade planning to post-session
          review — not a journal app bolted onto a calculator.
        </p>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {HOME_WORKFLOW.map((item) => (
            <li
              key={item.step}
              className="rounded-[8px] border border-white/[0.07] bg-white/[0.02] p-5"
            >
              <p className="font-mono text-[11px] text-gold-muted">{item.step}</p>
              <h3 className="mt-3 font-mono text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </SectionFrame>
  );
}

export function HomeLiveGrowth() {
  return (
    <SectionFrame className="border-t border-white/[0.05]">
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2">
        <div>
          <Eyebrow>{HOME_LIVE_GROWTH.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#F3F5F7] sm:text-4xl">
            {HOME_LIVE_GROWTH.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            {HOME_LIVE_GROWTH.subhead}
          </p>
        </div>
        <ul className="space-y-3">
          {HOME_LIVE_GROWTH.points.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-[8px] border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-sm text-slate-200"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </SectionFrame>
  );
}

export function HomePropModule() {
  return (
    <SectionFrame className="border-t border-white/[0.05]">
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2">
        <div>
          <Eyebrow>{HOME_PROP_MODULE.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#F3F5F7] sm:text-4xl">
            {HOME_PROP_MODULE.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            {HOME_PROP_MODULE.subhead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={E8_PUBLIC_PATH}>
              <Button variant="gold">Open E8 Execution Center</Button>
            </Link>
            <Link href="/launch">
              <Button variant="secondary">Read the Playbook</Button>
            </Link>
            <Link href={PROP_FIRM_PLAYBOOK_HREF}>
              <Button variant="ghost">Free preview</Button>
            </Link>
          </div>
        </div>
        <ul className="space-y-3">
          {HOME_PROP_MODULE.points.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-[8px] border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-sm text-slate-200"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </SectionFrame>
  );
}

export function HomeWhyE8() {
  return (
    <SectionFrame className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Official E8 Markets Partner</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#F3F5F7] sm:text-4xl">
          {E8_WHY.title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#9AA3B2]">
          E8 Markets is the exclusive recommended prop firm. Map E8 One, E8 Pro, and E8
          Signature evaluations on TradeLocker with Quicksilver risk presets.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {E8_WHY.points.map((item) => (
            <article
              key={item.title}
              className="rounded-[8px] border border-indigo-400/15 bg-indigo-500/[0.04] p-5"
            >
              <h3 className="font-mono text-sm font-semibold text-indigo-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <E8SignupButton />
        </div>
      </div>
    </SectionFrame>
  );
}

export function HomeE8Presets() {
  return (
    <SectionFrame className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Guardrails</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#F3F5F7] sm:text-4xl">
          E8-mapped risk presets
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
          Planning tools for daily-loss and trailing-drawdown awareness. Software
          guardrails — not a guaranteed pass. Official rules live on E8 Markets.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {E8_PRESETS.map((preset) => (
            <article
              key={preset.id}
              className="rounded-[8px] border border-white/[0.07] bg-white/[0.02] p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-mono text-sm font-semibold text-white">{preset.name}</h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-300">
                  {preset.live ? "Live planning" : "Coming soon"}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{preset.intent}</p>
            </article>
          ))}
        </div>
        <Link href={E8_PUBLIC_PATH} className="mt-8 inline-block font-mono text-sm text-indigo-300 hover:underline">
          Open E8 Execution Center →
        </Link>
      </div>
    </SectionFrame>
  );
}

export function HomeE8Promos() {
  const live = [...getLiveGiveaways(), ...getLiveDiscounts()];
  if (live.length === 0) return null;

  return (
    <SectionFrame className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Live campaigns</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#F3F5F7] sm:text-4xl">
          Giveaways and launch offers
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {live.map((item) => (
            <article
              key={item.id}
              className="rounded-[8px] border border-white/[0.07] bg-white/[0.02] p-5"
            >
              <h3 className="font-mono text-sm font-semibold text-white">{item.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.blurb}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

export function HomeTradeLockerNative() {
  return (
    <SectionFrame className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-3xl">
        <Eyebrow>Platform</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#F3F5F7] sm:text-4xl">
          {HOME_TRADELOCKER.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-400">
          {HOME_TRADELOCKER.subhead}
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {HOME_TRADELOCKER.points.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-slate-300">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </SectionFrame>
  );
}

export function HomeQuantProtocol() {
  return (
    <SectionFrame className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <Eyebrow>Optional automation</Eyebrow>
          <span className="rounded border border-gold-soft/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-gold-soft">
            {HOME_QUANT.premiumNote}
          </span>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#F3F5F7] sm:text-4xl">
          {HOME_QUANT.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-400">{HOME_QUANT.subhead}</p>
        <ul className="mt-8 space-y-3">
          {HOME_QUANT.points.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-slate-300">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          {HOME_QUANT_CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 font-mono text-[11px] text-silver-mist"
            >
              {chip}
            </span>
          ))}
        </div>
        <p className="mt-8 font-mono text-sm text-gold-bright">
          Enable Quant Protocol with Premium
        </p>
        <Link
          href="/quant-protocol"
          className="mt-3 inline-block font-mono text-sm text-gold-soft hover:underline"
        >
          See Quant Protocol →
        </Link>
      </div>
    </SectionFrame>
  );
}

export function HomeToolsGrid() {
  return (
    <SectionFrame className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Desk tools</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#F3F5F7] sm:text-3xl">
          Planning, academy, and the live desk
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Link
            href="/tools"
            className="rounded-[8px] border border-white/[0.07] bg-white/[0.02] p-6 transition-colors hover:border-gold-soft/35"
          >
            <h3 className="font-mono text-lg font-bold text-white">
              {TOOL_COUNT} planning engines
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Pre-trade risk calculation, expectancy, and rule-aware sizing — before execution,
              not after.
            </p>
            <p className="mt-4 font-mono text-xs text-gold-soft">Open tools →</p>
          </Link>
          <Link
            href="/lessons"
            className="rounded-[8px] border border-white/[0.07] bg-white/[0.02] p-6 transition-colors hover:border-gold-soft/35"
          >
            <h3 className="font-mono text-lg font-bold text-white">Chart Academy</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {CHART_ACADEMY_STATS.lessonCount} structured lessons — structure, sessions, forex,
              CFDs — so you can read the tape before you automate it.
            </p>
            <p className="mt-4 font-mono text-xs text-gold-soft">Open academy →</p>
          </Link>
          <div className="rounded-[8px] border border-white/[0.07] bg-white/[0.02] p-6">
            <h3 className="font-mono text-lg font-bold text-white">Journal + review</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Emotion, discipline, and habit tracking in the journal. Post-session review so the
              next day starts from the record, not the last tick.
            </p>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}

export function HomeComparison() {
  return (
    <SectionFrame className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-5xl">
        <Eyebrow>Why one stack</Eyebrow>
        <h2 className="mt-4 text-center text-2xl font-semibold tracking-tight text-[#F3F5F7] sm:text-4xl">
          {HOME_COMPARISON.title}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-[8px] border border-white/[0.06] bg-white/[0.015] p-6">
            <h3 className="font-mono text-sm uppercase tracking-widest text-slate-500">
              {HOME_COMPARISON.scattered.label}
            </h3>
            <ul className="mt-5 space-y-3">
              {HOME_COMPARISON.scattered.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-400">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[8px] border border-gold-soft/30 bg-gold-soft/[0.04] p-6">
            <h3 className="font-mono text-sm uppercase tracking-widest text-gold-soft">
              {HOME_COMPARISON.stack.label}
            </h3>
            <ul className="mt-5 space-y-3">
              {HOME_COMPARISON.stack.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}

export function HomePricingChooser() {
  return (
    <SectionFrame
      id={PREMIUM_INCLUDES_ANCHOR}
      className="scroll-mt-28 border-t border-white/[0.05]"
    >
      <div id="pricing" className="mx-auto max-w-5xl scroll-mt-28">
        <Eyebrow>{HOME_PRICING.chooserLabel}</Eyebrow>
        <h2 className="mt-4 text-center text-2xl font-semibold tracking-tight text-[#F3F5F7] sm:text-4xl">
          {HOME_PRICING.title}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <article className="flex flex-col rounded-[8px] border border-gold-soft/35 bg-gold-soft/[0.05] p-7">
            <h3 className="font-mono text-xl font-bold text-white">
              {HOME_PRICING.discount.name}
            </h3>
            <p className="mt-4 font-mono text-4xl font-bold text-white">
              {HOME_PRICING.discount.price}
              <span className="ml-2 text-base font-normal text-slate-500">
                {HOME_PRICING.discount.priceNote}
              </span>
            </p>
            <p className="mt-1 font-mono text-sm text-slate-400">{HOME_PRICING.discount.then}</p>
            <p className="mt-5 text-sm leading-relaxed text-slate-300">
              {HOME_PRICING.discount.body}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              {HOME_PRICING.discount.extra}
            </p>
            <div className="mt-8">
              <TrackedCheckoutLink source="homepage_pricing" offer="discount">
                <Button variant="gold" size="lg" className="w-full">
                  {HOME_PRICING.discount.cta}
                </Button>
              </TrackedCheckoutLink>
            </div>
          </article>

          <article className="flex flex-col rounded-[8px] border border-white/[0.08] bg-white/[0.02] p-7">
            <h3 className="font-mono text-xl font-bold text-white">{HOME_PRICING.trial.name}</h3>
            <p className="mt-4 font-mono text-4xl font-bold text-white">
              {HOME_PRICING.trial.price}
              <span className="ml-2 text-base font-normal text-slate-500">
                {HOME_PRICING.trial.priceNote}
              </span>
            </p>
            <p className="mt-5 text-sm leading-relaxed text-slate-300">{HOME_PRICING.trial.body}</p>
            <p className="mt-4 rounded-lg border border-white/[0.08] px-3 py-2 font-mono text-xs text-slate-400">
              {TRIAL_REQUEST_COPY}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">{HOME_PRICING.trial.extra}</p>
            <div className="mt-8">
              <a href={getTrialRequestMailto()}>
                <Button variant="secondary" size="lg" className="w-full">
                  {HOME_PRICING.trial.cta}
                </Button>
              </a>
            </div>
          </article>
        </div>
        <p className="mx-auto mt-8 max-w-xl text-center font-mono text-xs leading-relaxed text-slate-500">
          {HOME_PRICING.microcopy}
        </p>
      </div>
    </SectionFrame>
  );
}

export function HomeAudience() {
  return (
    <SectionFrame className="border-t border-white/[0.05] py-16 sm:py-20">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <div className="rounded-[8px] border border-white/[0.07] bg-white/[0.02] p-6">
          <h2 className="font-mono text-lg font-bold text-white">Who it’s for</h2>
          <ul className="mt-4 space-y-3">
            {HOME_FOR.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-slate-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[8px] border border-white/[0.06] bg-white/[0.015] p-6">
          <h2 className="font-mono text-lg font-bold text-white">Who it’s not for</h2>
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
    </SectionFrame>
  );
}

export function HomeFaq() {
  return (
    <SectionFrame id="faq" className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-mono text-2xl font-bold text-white">FAQ</h2>
        <dl className="mt-10 space-y-4">
          {HOME_FAQS.map((item) => (
            <div
              key={item.question}
              className="rounded-[8px] border border-white/[0.07] bg-white/[0.02] p-5"
            >
              <dt className="font-mono text-sm font-semibold text-white">{item.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-400">{item.answer}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-center">
          <Link href="/faq" className="font-mono text-xs text-gold-soft hover:underline">
            Full FAQ →
          </Link>
        </p>
      </div>
    </SectionFrame>
  );
}

export function HomeFinalCta() {
  return (
    <SectionFrame className="pb-28 md:pb-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-[#F3F5F7] sm:text-3xl">
          Start with structure. Add automation only if you need it.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
          Open the E8 Execution Center, or start Premium with first month 30% off. 3-day
          trial available on request. Bot not included.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link href={E8_PUBLIC_PATH}>
            <Button variant="gold" size="lg">
              Open E8 Execution Center
            </Button>
          </Link>
          <StartOfferCtas source="homepage_final_cta" />
        </div>
        <p className="mt-5 font-mono text-xs text-slate-500">
          {TRIAL_REQUEST_COPY} Cancel anytime. Educational tools only. Official E8 rules are
          set by E8 Markets. No pass or payout guarantee.
        </p>
        <TrustBox className="mx-auto mt-10 max-w-2xl text-center" />
      </div>
    </SectionFrame>
  );
}

/** Kept for any remaining imports; homepage no longer uses the old single-plan stack. */
export function HomePremiumStack() {
  return <HomePricingChooser />;
}

export function HomePlaybook() {
  return <HomePropModule />;
}

export function HomeToolsAcademy() {
  return <HomeToolsGrid />;
}

export function HomeSocialProof() {
  return null;
}
