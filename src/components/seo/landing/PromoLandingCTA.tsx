"use client";

import Link from "next/link";
import { ArrowRight, Check, ExternalLink, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import {
  getPremiumCheckoutUrl,
  PREMIUM_PRICE,
} from "@/lib/pricing-tiers";

interface PromoLandingCTAProps {
  pageTitle: string;
}

export function PromoLandingCTA({ pageTitle }: PromoLandingCTAProps) {
  const checkoutUrl = getPremiumCheckoutUrl();

  return (
    <GlassPanel className="border-emerald-500/30 bg-gradient-to-br from-slate-950 via-emerald-500/5 to-cyan-accent/5 p-6 sm:p-8">
      <Badge variant="success">Premium Quant</Badge>

      <h2 className="mt-4 font-mono text-xl font-bold text-slate-100 sm:text-2xl">
        Unlock Premium — {PREMIUM_PRICE}/mo
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        You found this page via{" "}
        <strong className="text-slate-300">{pageTitle}</strong>. Subscribe for
        Quant Protocol, the playbook, planning tools, Chart Academy, and live
        terminal access.
      </p>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <span className="font-mono text-3xl font-bold text-emerald-400">
          {PREMIUM_PRICE}
        </span>
        <span className="font-mono text-sm text-slate-500">per month</span>
      </div>

      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {[
          "89 Chart Academy lessons + prop firm guide",
          "All planning engines & Trading Tools",
          "TradeLocker bot + live dashboard",
          "Priority email support",
        ].map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm text-slate-400"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="lg">
            Subscribe — {PREMIUM_PRICE}/mo
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
        <Link href="/register">
          <Button variant="ghost" size="lg">
            <Zap className="h-4 w-4" />
            Start free first
          </Button>
        </Link>
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-slate-600">
        Premium is {PREMIUM_PRICE}/mo · cancel anytime
      </p>
      <Link
        href="/offers"
        className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-cyan-accent hover:underline"
      >
        Browse offers
        <ArrowRight className="h-3 w-3" />
      </Link>
    </GlassPanel>
  );
}
