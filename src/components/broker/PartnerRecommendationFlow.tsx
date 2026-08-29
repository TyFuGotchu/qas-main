"use client";

import { useState } from "react";
import Link from "next/link";
import { E8ExecutionCenter } from "@/components/e8/E8ExecutionCenter";
import { Badge } from "@/components/ui/Badge";
import {
  LIVE_ACCOUNT_BROKERS,
  PARTNER_ROUTING_OPTIONS,
  PARTNER_ROUTING_QUESTION,
  getPartnerFraming,
  type TradingStyle,
} from "@/lib/partners";
import { E8_DASHBOARD_PATH, E8_EXCLUSIVE_LINE } from "@/lib/e8-partner";
import { ExternalLink, Bot, Hand, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * Dashboard partner block: E8 Execution Center first.
 * Bot vs manual is secondary. No competing prop firms.
 */
export function PartnerRecommendationFlow() {
  const [style, setStyle] = useState<TradingStyle | null>(null);

  return (
    <div className="space-y-6">
      <E8ExecutionCenter variant="card" context="dashboard" />

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Secondary routing
        </p>
        <h3 className="mt-2 font-mono text-sm font-semibold text-slate-200">
          Automated / Quant Protocol or manual stack
        </h3>
        <p className="mt-1 text-xs text-slate-500">{E8_EXCLUSIVE_LINE}</p>

        {style === null ? (
          <div className="mt-4">
            <p className="text-sm leading-relaxed text-slate-300">{PARTNER_ROUTING_QUESTION}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setStyle("bots")}
                className="rounded-xl border border-indigo-400/25 bg-indigo-500/5 p-4 text-left transition-colors hover:border-indigo-400/45"
              >
                <div className="flex items-center gap-2 font-mono text-sm font-semibold text-indigo-200">
                  <Bot className="h-4 w-4" />
                  {PARTNER_ROUTING_OPTIONS.bots.label}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {PARTNER_ROUTING_OPTIONS.bots.description}
                </p>
              </button>
              <button
                type="button"
                onClick={() => setStyle("manual")}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-left transition-colors hover:border-gold-soft/35"
              >
                <div className="flex items-center gap-2 font-mono text-sm font-semibold text-gold-bright">
                  <Hand className="h-4 w-4" />
                  {PARTNER_ROUTING_OPTIONS.manual.label}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {PARTNER_ROUTING_OPTIONS.manual.description}
                </p>
              </button>
            </div>
          </div>
        ) : (
          <StyleFollowUp style={style} onChangeStyle={() => setStyle(null)} />
        )}
      </div>
    </div>
  );
}

function StyleFollowUp({
  style,
  onChangeStyle,
}: {
  style: TradingStyle;
  onChangeStyle: () => void;
}) {
  const framing = getPartnerFraming(style);

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={style === "bots" ? "success" : "default"}>
          {style === "bots"
            ? PARTNER_ROUTING_OPTIONS.bots.shortLabel
            : PARTNER_ROUTING_OPTIONS.manual.shortLabel}
        </Badge>
        <button
          type="button"
          onClick={onChangeStyle}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-indigo-300"
        >
          <ArrowLeft className="h-3 w-3" />
          Change workflow
        </button>
      </div>
      <div>
        <h4 className="font-mono text-sm font-semibold text-slate-200">{framing.headline}</h4>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{framing.intro}</p>
        <p className="mt-2 text-sm leading-relaxed text-indigo-200/90">{framing.highlight}</p>
      </div>
      <Link href={E8_DASHBOARD_PATH} className="inline-block font-mono text-xs text-indigo-300 hover:underline">
        Continue in E8 Execution Center →
      </Link>

      <details className="rounded-lg border border-white/[0.06] p-3">
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-widest text-slate-500">
          Live-account brokers (not prop recommendations)
        </summary>
        <ul className="mt-3 space-y-2">
          {LIVE_ACCOUNT_BROKERS.map((broker) => (
            <li key={broker.id} className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-slate-300">
                {broker.name} · {broker.kindLabel}
              </span>
              <a href={broker.href} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  Open
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
