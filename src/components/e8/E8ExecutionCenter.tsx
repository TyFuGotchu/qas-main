"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  E8_CARD_TABS,
  E8_CENTER_TABS,
  E8_DASHBOARD_PATH,
  E8_EXCLUSIVE_LINE,
  E8_OVERVIEW,
  E8_PARTNER_LINE,
  E8_PRESETS,
  E8_PUBLIC_PATH,
  E8_RULES,
  E8_SERIES,
  E8_SIGNUP,
  type E8CenterTab,
  getE8ReferralUrl,
  getE8XUrl,
  getE8YoutubeUrl,
  getLiveDiscounts,
  getLiveGiveaways,
} from "@/lib/e8-partner";
import { E8ComplianceNote } from "@/components/e8/E8ComplianceNote";
import { E8SignupButton } from "@/components/e8/E8SignupButton";
import { cn } from "@/lib/utils";

interface E8ExecutionCenterProps {
  variant?: "full" | "card";
  context?: "public" | "dashboard";
}

export function E8ExecutionCenter({
  variant = "full",
  context = "public",
}: E8ExecutionCenterProps) {
  const tabs = variant === "card" ? E8_CENTER_TABS.filter((t) => E8_CARD_TABS.includes(t.id)) : E8_CENTER_TABS;
  const [tab, setTab] = useState<E8CenterTab>("overview");
  const active = useMemo(
    () => (tabs.some((t) => t.id === tab) ? tab : "overview"),
    [tab, tabs]
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-indigo-400/20 bg-[#0a0b12]",
        variant === "card" ? "p-5 sm:p-6" : "p-6 sm:p-8"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="warning">{E8_PARTNER_LINE}</Badge>
            <span className="rounded border border-indigo-400/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-indigo-200">
              Exclusive
            </span>
          </div>
          <h2 className="mt-3 font-mono text-xl font-bold text-white sm:text-2xl">
            {E8_OVERVIEW.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            {E8_OVERVIEW.subtitle}
          </p>
        </div>
        {variant === "card" && (
          <Link
            href={context === "dashboard" ? E8_DASHBOARD_PATH : E8_PUBLIC_PATH}
            className="font-mono text-xs text-indigo-300 hover:underline"
          >
            Open full center →
          </Link>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-white/[0.06] pb-3">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
              active === item.id
                ? "border border-indigo-400/40 bg-indigo-500/15 text-indigo-100"
                : "border border-transparent text-slate-500 hover:text-slate-300"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active === "overview" && <OverviewTab />}
        {active === "rules" && <RulesTab />}
        {active === "signup" && <SignupTab />}
        {active === "presets" && <PresetsTab />}
        {active === "promos" && <PromosTab />}
        {active === "content" && <ContentTab />}
      </div>

      <E8ComplianceNote className="mt-8 border-t border-white/[0.06] pt-5 font-mono text-[11px] leading-relaxed text-slate-500" />
    </div>
  );
}

function OverviewTab() {
  return (
    <div>
      <p className="text-sm leading-relaxed text-slate-200">{E8_EXCLUSIVE_LINE}</p>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {E8_OVERVIEW.stack.map((item) => (
          <li
            key={item}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 font-mono text-xs text-slate-300"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RulesTab() {
  return (
    <div>
      <p className="text-sm leading-relaxed text-slate-400">{E8_RULES.intro}</p>
      <div className="mt-5 grid gap-3">
        {E8_RULES.frames.map((frame) => (
          <article
            key={frame.id}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
          >
            <h3 className="font-mono text-sm font-semibold text-white">{frame.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{frame.text}</p>
          </article>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-400">{E8_RULES.officialClose}</p>
    </div>
  );
}

function SignupTab() {
  const href = getE8ReferralUrl();
  return (
    <div>
      <h3 className="font-mono text-lg font-semibold text-white">{E8_SIGNUP.cta}</h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
        {href ? E8_SIGNUP.liveBody : E8_SIGNUP.pendingBody}
      </p>
      <div className="mt-6">
        <E8SignupButton />
      </div>
    </div>
  );
}

function PresetsTab() {
  return (
    <div>
      <p className="text-sm leading-relaxed text-slate-400">
        Software guardrails and planning tools mapped to E8-style protection. Not a
        guaranteed pass.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {E8_PRESETS.map((preset) => (
          <article
            key={preset.id}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-mono text-sm font-semibold text-white">{preset.name}</h3>
              {!preset.live && (
                <span className="font-mono text-[10px] uppercase tracking-widest text-gold-muted">
                  Coming soon
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{preset.intent}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function PromosTab() {
  const giveaways = getLiveGiveaways();
  const discounts = getLiveDiscounts();
  const hasLive = giveaways.length > 0 || discounts.length > 0;

  if (!hasLive) {
    return (
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-8 text-center">
        <p className="font-mono text-sm text-slate-200">
          No live giveaways or promos right now.
        </p>
        <p className="mt-2 text-sm text-slate-500">Active campaigns will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {giveaways.length > 0 && (
        <section>
          <h3 className="font-mono text-sm uppercase tracking-widest text-indigo-300">
            Giveaways
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {giveaways.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
              >
                <h4 className="font-mono text-sm font-semibold text-white">{item.name}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.blurb}</p>
              </article>
            ))}
          </div>
        </section>
      )}
      {discounts.length > 0 && (
        <section>
          <h3 className="font-mono text-sm uppercase tracking-widest text-indigo-300">
            Discounts
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {discounts.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
              >
                <h4 className="font-mono text-sm font-semibold text-white">{item.name}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.blurb}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ContentTab() {
  const youtube = getE8YoutubeUrl();
  const x = getE8XUrl();
  const hasLinks = Boolean(youtube || x);

  if (!hasLinks) {
    return (
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-8 text-center">
        <p className="text-sm text-slate-400">{E8_SERIES.empty}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-mono text-lg font-semibold text-white">{E8_SERIES.title}</h3>
      <div className="mt-5 flex flex-wrap gap-3">
        {youtube && (
          <a href={youtube} target="_blank" rel="noopener noreferrer">
            <Button variant="gold">
              {E8_SERIES.watchCta} · YouTube
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        )}
        {x && (
          <a href={x} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary">
              {E8_SERIES.watchCta} · X
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
