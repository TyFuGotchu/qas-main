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
  E8_OVERVIEW_CHIPS,
  E8_PARTNER_LINE,
  E8_PRESETS,
  isLiveE8Preset,
  E8_PUBLIC_PATH,
  E8_SERIES,
  E8_SIGNUP,
  type E8CenterTab,
  getE8XUrl,
  getE8YoutubeUrl,
  getLiveDiscounts,
  getLiveGiveaways,
} from "@/lib/e8-partner";
import { E8ComplianceNote } from "@/components/e8/E8ComplianceNote";
import { E8SignupButton } from "@/components/e8/E8SignupButton";
import { E8RulesDesk } from "@/components/e8/E8RulesDesk";
import { E8PresetDesk } from "@/components/e8/E8PresetDesk";
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

  const showChrome = variant === "card";

  return (
    <div
      className={cn(
        "e8-desk overflow-hidden rounded-[8px] border",
        variant === "card" ? "p-5" : "p-0"
      )}
    >
      {showChrome && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="warning">{E8_PARTNER_LINE}</Badge>
              <span className="rounded-[4px] border border-[#B7B0D4]/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#B7B0D4]">
                Exclusive
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-[#9AA3B2]">{E8_OVERVIEW.subtitle}</p>
          </div>
          <Link
            href={context === "dashboard" ? E8_DASHBOARD_PATH : E8_PUBLIC_PATH}
            className="font-mono text-xs text-[#B7B0D4] hover:text-[#7FE7DC]"
          >
            Open full center →
          </Link>
        </div>
      )}

      <div className="flex gap-0 overflow-x-auto border-b border-white/[0.08]">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "-mb-px shrink-0 border-b px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
              active === item.id
                ? "border-[#C8ACFF] text-[#F3F5F7]"
                : "border-transparent text-[#C8ACFF]/70 hover:text-[#F3F5F7]"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={variant === "card" ? "mt-5" : "p-5 sm:p-6"}>
        {active === "overview" && (
          <OverviewTab
            context={context}
            onOpenPresets={() => setTab("presets")}
          />
        )}
        {active === "rules" && <E8RulesDesk />}
        {active === "signup" && <SignupTab />}
        {active === "presets" && <PresetsTab />}
        {active === "promos" && <PromosTab />}
        {active === "content" && <ContentTab />}
      </div>

      <E8ComplianceNote className="border-t border-white/[0.08] px-5 py-4 font-mono text-[11px] leading-relaxed text-[#9AA3B2] sm:px-6" />
    </div>
  );
}

function OverviewTab({
  context,
  onOpenPresets,
}: {
  context: "public" | "dashboard";
  onOpenPresets: () => void;
}) {
  return (
    <div>
      <p className="text-sm leading-relaxed text-[#F3F5F7]">{E8_EXCLUSIVE_LINE}</p>
      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {E8_OVERVIEW_CHIPS.map((chip) => {
          const className =
            "flex min-h-[72px] items-center rounded-[6px] border border-[rgba(199,170,255,0.18)] bg-[#1C122C] px-4 py-3 text-left text-sm text-[#C8ACFF]/80 transition-colors hover:border-[#C8ACFF]/50 hover:text-[#F3F5F7]";
          if ("tab" in chip) {
            return (
              <button key={chip.id} type="button" onClick={onOpenPresets} className={className}>
                {chip.text}
              </button>
            );
          }
          const href = context === "dashboard" ? chip.hrefDash : chip.hrefPublic;
          return (
            <Link key={chip.id} href={href} className={className}>
              {chip.text}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SignupTab() {
  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight text-[#F3F5F7]">{E8_SIGNUP.cta}</h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#9AA3B2]">{E8_SIGNUP.liveBody}</p>
      <div className="mt-6">
        <E8SignupButton />
      </div>
    </div>
  );
}

function PresetsTab() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedRaw = E8_PRESETS.find((p) => p.id === selectedId);
  const selected = selectedRaw && isLiveE8Preset(selectedRaw) ? selectedRaw : null;

  return (
    <div>
      <p className="text-sm leading-relaxed text-[#C8ACFF]/80">
        Software guardrails and planning tools mapped to E8-style protection. Not a
        guaranteed pass.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {E8_PRESETS.map((preset) => {
          const clickable = preset.live;
          const active = selectedId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && setSelectedId(preset.id)}
              className={cn(
                "rounded-[6px] border p-4 text-left transition-colors",
                clickable ? "cursor-pointer" : "cursor-not-allowed opacity-60",
                active
                  ? "border-[#C8ACFF] bg-[#B794FF]/15"
                  : "border-[rgba(199,170,255,0.18)] bg-[#1C122C] hover:border-[#C8ACFF]/60"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{preset.name}</h3>
                {!preset.live && (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#C8ACFF]/70">
                    Coming soon
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#C8ACFF]/75">{preset.intent}</p>
            </button>
          );
        })}
      </div>
      {selected && <E8PresetDesk key={selected.id} preset={selected} />}
    </div>
  );
}

function PromosTab() {
  const giveaways = getLiveGiveaways();
  const discounts = getLiveDiscounts();
  const hasLive = giveaways.length > 0 || discounts.length > 0;

  if (!hasLive) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-[#F3F5F7]">No live giveaways or promos right now.</p>
        <p className="mt-2 text-sm text-[#9AA3B2]">Active campaigns will appear here.</p>
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
                className="rounded-[6px] border border-white/[0.08] bg-[#141A24] p-4"
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
                className="rounded-[6px] border border-white/[0.08] bg-[#141A24] p-4"
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
      <div className="py-8 text-center">
        <p className="text-sm text-[#9AA3B2]">{E8_SERIES.empty}</p>
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
