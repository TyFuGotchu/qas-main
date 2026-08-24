"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { TrackedCheckoutLink } from "@/components/analytics/TrackedCheckoutLink";
import { HOME_HERO } from "@/lib/homepage-copy";
import { PREMIUM_PRICE } from "@/lib/pricing-tiers";
import { trackViewQuantProtocol } from "@/lib/analytics/ga-events";
import { Bot, Check } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-qs-header-line opacity-90" />
        <div className="absolute left-1/2 top-24 h-48 w-48 -translate-x-1/2 rounded-full border border-cyan-400/20 opacity-40" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-400/90">
          {HOME_HERO.eyebrow}
        </p>
        <h1 className="mt-5 font-mono text-3xl font-bold tracking-tight text-slate-50 sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
          {HOME_HERO.h1}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          {HOME_HERO.subhead}
        </p>
        <ul className="mx-auto mt-8 max-w-xl space-y-2 text-left">
          {HOME_HERO.bullets.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <TrackedCheckoutLink source="homepage_hero">
            <Button variant="primary" size="lg">
              Start Premium — {PREMIUM_PRICE}/mo
            </Button>
          </TrackedCheckoutLink>
          <Link href="/quant-protocol" onClick={() => trackViewQuantProtocol("homepage_hero")}>
            <Button variant="secondary" size="lg">
              <Bot className="h-4 w-4" />
              See Quant Protocol
            </Button>
          </Link>
        </div>
        <p className="mx-auto mt-5 max-w-xl font-mono text-xs leading-relaxed text-slate-500">
          {HOME_HERO.microcopy}
        </p>
      </div>
    </section>
  );
}
