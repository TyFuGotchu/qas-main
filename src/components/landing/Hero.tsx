"use client";

import { HOME_HERO, HOME_LANDING_CODE_HINT } from "@/lib/homepage-copy";
import { StartOfferCtas } from "@/components/marketing/StartOfferCtas";
import { HomeHeroVideo } from "@/components/landing/HomeHeroVideo";
import { HeroDeskMock } from "@/components/landing/HeroDeskMock";
import Button from "@/components/ui/Button";
import { E8PromoHeroStrip } from "@/components/e8/E8PromoBanners";
import { E8_PUBLIC_PATH } from "@/lib/e8-partner";
import Link from "next/link";
import { Check } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-qs-header-line opacity-90" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-soft">
            {HOME_HERO.eyebrow}
          </p>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#F3F5F7] sm:text-5xl lg:text-[3.15rem] lg:leading-[1.12]">
            {HOME_HERO.h1}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {HOME_HERO.subhead}
          </p>
          <ul className="mt-8 max-w-xl space-y-2.5">
            {HOME_HERO.bullets.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-200">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-start gap-3">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={E8_PUBLIC_PATH}>
                <Button variant="gold" size="lg" className="w-full sm:w-auto">
                  E8 Execution Center
                </Button>
              </Link>
              <StartOfferCtas source="homepage_hero" premiumOnly className="justify-start" />
            </div>
            <p className="font-mono text-xs text-slate-400">{HOME_LANDING_CODE_HINT}</p>
          </div>
          <p className="mt-5 max-w-xl font-mono text-xs leading-relaxed text-slate-500">
            {HOME_HERO.microcopy}
          </p>
        </div>

        <div className="lg:pt-4">
          <HeroDeskMock />
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-6xl">
        <E8PromoHeroStrip />
      </div>

      <div className="relative mx-auto mt-14 max-w-6xl">
        <HomeHeroVideo />
      </div>
    </section>
  );
}
