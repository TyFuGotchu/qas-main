"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  ACTIVE_PARTNERS,
  PARTNER_ROUTING_OPTIONS,
  PARTNER_ROUTING_QUESTION,
  getPartnerFraming,
  getPartnerKindBadgeVariant,
  type TradingStyle,
} from "@/lib/partners";
import { ExternalLink, Building2, Bot, Hand, ArrowLeft } from "lucide-react";

/**
 * Ask trading style first, then show the universal active partner list
 * with style-specific framing. Never shows pending partners.
 */
export function PartnerRecommendationFlow() {
  const [style, setStyle] = useState<TradingStyle | null>(null);

  return (
    <Card className="border-emerald-500/20 bg-gradient-to-br from-obsidian-900/80 to-emerald-500/5">
      <CardContent className="py-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10">
            <Building2 className="h-7 w-7 text-emerald-terminal" />
          </div>
          <div className="min-w-0 flex-1">
            <Badge variant="success" className="mb-2">
              Recommended platforms
            </Badge>
            <h3 className="font-mono text-lg font-bold text-slate-200">
              Brokers &amp; prop firms
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Verified partners only. We tailor the pitch to your workflow —
              same short list either way.
            </p>
          </div>
        </div>

        {style === null ? (
          <div className="mt-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/90">
              Step 1 — routing
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
              {PARTNER_ROUTING_QUESTION}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setStyle("bots")}
                className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 text-left transition-colors hover:border-cyan-500/50 hover:bg-cyan-500/10"
              >
                <div className="flex items-center gap-2 font-mono text-sm font-semibold text-cyan-300">
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
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-left transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10"
              >
                <div className="flex items-center gap-2 font-mono text-sm font-semibold text-emerald-300">
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
          <PartnerListForStyle
            style={style}
            onChangeStyle={() => setStyle(null)}
          />
        )}
      </CardContent>
    </Card>
  );
}

function PartnerListForStyle({
  style,
  onChangeStyle,
}: {
  style: TradingStyle;
  onChangeStyle: () => void;
}) {
  const framing = getPartnerFraming(style);

  return (
    <div className="mt-6 space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={style === "bots" ? "success" : "default"}>
          {style === "bots"
            ? PARTNER_ROUTING_OPTIONS.bots.shortLabel
            : PARTNER_ROUTING_OPTIONS.manual.shortLabel}
        </Badge>
        <button
          type="button"
          onClick={onChangeStyle}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-cyan-400"
        >
          <ArrowLeft className="h-3 w-3" />
          Change workflow
        </button>
      </div>

      <div>
        <h4 className="font-mono text-sm font-semibold text-slate-200">
          {framing.headline}
        </h4>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          {framing.intro}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-400/90">
          {framing.highlight}
        </p>
      </div>

      <ul className="space-y-3">
        {ACTIVE_PARTNERS.map((partner) => (
          <li
            key={partner.id}
            className="flex flex-col gap-3 rounded-xl border border-slate-800/80 bg-obsidian-950/60 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-semibold text-slate-100">
                  {partner.name}
                </span>
                <Badge variant={getPartnerKindBadgeVariant(partner.kind)}>
                  {partner.kindLabel}
                </Badge>
              </div>
              <p className="mt-1 font-mono text-[10px] text-slate-600 break-all">
                {partner.href}
              </p>
            </div>
            <a
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button variant="primary" size="sm" className="w-full sm:w-auto">
                Open {partner.name}
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          </li>
        ))}
      </ul>

      <p className="text-xs text-slate-600">
        Bot setup (desktop TradeLocker) is separate — see{" "}
        <Link
          href="/dashboard/trading-bots"
          className="text-cyan-500/80 underline-offset-2 hover:text-cyan-400 hover:underline"
        >
          Trading Bots
        </Link>
        . These partners are optional; any compatible account still works with
        our tools.
      </p>
    </div>
  );
}
