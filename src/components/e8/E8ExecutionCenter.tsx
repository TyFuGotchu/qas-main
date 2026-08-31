"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { HardFlatDesk } from "@/components/e8/HardFlatDesk";
import { cn } from "@/lib/utils";

interface E8ExecutionCenterProps {
  variant?: "full" | "card";
  context?: "public" | "dashboard";
}

function isCenterTab(value: string | null): value is E8CenterTab {
  return (
    value === "overview" ||
    value === "rules" ||
    value === "signup" ||
    value === "presets" ||
    value === "promos" ||
    value === "content"
  );
}

export function E8ExecutionCenter(props: E8ExecutionCenterProps) {
  return (
    <Suspense fallback={<div className="e8-desk rounded-[8px] p-5 text-sm text-[#C9C2D6]">Loading desk…</div>}>
      <E8ExecutionCenterInner {...props} />
    </Suspense>
  );
}

function E8ExecutionCenterInner({
  variant = "full",
  context = "public",
}: E8ExecutionCenterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabs = variant === "card" ? E8_CENTER_TABS.filter((t) => E8_CARD_TABS.includes(t.id)) : E8_CENTER_TABS;
  const urlTab = searchParams.get("tab");
  const [tab, setTab] = useState<E8CenterTab>(isCenterTab(urlTab) ? urlTab : "overview");

  useEffect(() => {
    if (isCenterTab(urlTab) && urlTab !== tab) setTab(urlTab);
  }, [urlTab, tab]);

  const active = useMemo(
    () => (tabs.some((t) => t.id === tab) ? tab : "overview"),
    [tab, tabs]
  );

  function go(id: E8CenterTab) {
    setTab(id);
    if (variant === "card") return;
    const base = context === "dashboard" ? E8_DASHBOARD_PATH : E8_PUBLIC_PATH;
    router.replace(`${base}?tab=${id}`, { scroll: false });
  }

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
            <p className="mt-2 max-w-2xl text-sm text-[#C9C2D6]">{E8_OVERVIEW.subtitle}</p>
          </div>
          <Link
            href={context === "dashboard" ? E8_DASHBOARD_PATH : E8_PUBLIC_PATH}
            className="font-mono text-xs text-[#E4D4FF] hover:text-white"
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
            onClick={() => go(item.id)}
            className={cn(
              "-mb-px shrink-0 border-b px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
              active === item.id
                ? "border-[#E4D4FF] text-[#E4D4FF]"
                : "border-transparent text-[#A89BB8] hover:text-[#F5F3FA]"
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
            onOpenPresets={() => go("presets")}
          />
        )}
        {active === "rules" && <E8RulesDesk />}
        {active === "signup" && <SignupTab />}
        {active === "presets" && <PresetsTab />}
        {active === "promos" && <PromosTab />}
        {active === "content" && <ContentTab />}
      </div>

      <E8ComplianceNote className="border-t border-[rgba(199,170,255,0.18)] px-5 py-4 font-mono text-[11px] leading-relaxed text-[#C9C2D6] sm:px-6" />
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
            "e8-chip flex min-h-[72px] items-center px-4 py-3 text-left text-sm transition-colors";
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
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#C9C2D6]">{E8_SIGNUP.liveBody}</p>
      <div className="mt-6">
        <E8SignupButton />
      </div>
    </div>
  );
}

function PresetsTab() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedRaw = E8_PRESETS.find((p) => p.id === selectedId);
  const selectedPlanning =
    selectedRaw && selectedRaw.id !== "hard-equity-stop" && isLiveE8Preset(selectedRaw)
      ? selectedRaw
      : null;
  const selectedHardFlat = selectedRaw?.id === "hard-equity-stop" && selectedRaw.live;

  return (
    <div>
      <p className="text-sm leading-relaxed text-[#C9C2D6]">
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
                "e8-chip p-4 text-left transition-colors",
                clickable ? "cursor-pointer" : "cursor-not-allowed opacity-60",
                active && "is-selected"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{preset.name}</h3>
                {!preset.live && (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#A89BB8]">
                    Coming soon
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#C9C2D6]">{preset.intent}</p>
            </button>
          );
        })}
      </div>
      {selectedHardFlat && <HardFlatDesk />}
      {selectedPlanning && <E8PresetDesk key={selectedPlanning.id} preset={selectedPlanning} />}
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
        <p className="text-sm text-[#F5F3FA]">No live giveaways or promos right now.</p>
        <p className="mt-2 text-sm text-[#C9C2D6]">Active campaigns will appear here.</p>
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
        <p className="text-sm text-[#C9C2D6]">{E8_SERIES.empty}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-mono text-lg font-semibold text-white">{E8_SERIES.title}</h3>
      <div className="mt-5 flex flex-wrap gap-3">
        {youtube && (
          <a href={youtube} target="_blank" rel="noopener noreferrer">
            <Button variant="e8">
              {E8_SERIES.watchCta} · YouTube
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        )}
        {x && (
          <a href={x} target="_blank" rel="noopener noreferrer">
            <Button variant="e8Secondary">
              {E8_SERIES.watchCta} · X
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
