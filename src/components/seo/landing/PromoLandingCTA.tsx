"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, ExternalLink, Tag, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import {
  getPremiumCheckoutUrl,
  PREMIUM_PRICE,
  PREMIUM_PROMO_CODE,
  PREMIUM_PROMO_DISCOUNT,
  PREMIUM_PROMO_FIRST_MONTH,
  PREMIUM_PROMO_NOTE,
} from "@/lib/pricing-tiers";

interface PromoLandingCTAProps {
  pageTitle: string;
}

export function PromoLandingCTA({ pageTitle }: PromoLandingCTAProps) {
  const [copied, setCopied] = useState(false);
  const checkoutUrl = getPremiumCheckoutUrl(true);

  async function copyPromoCode() {
    try {
      await navigator.clipboard.writeText(PREMIUM_PROMO_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <GlassPanel className="border-emerald-500/30 bg-gradient-to-br from-slate-950 via-emerald-500/5 to-cyan-accent/5 p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="success" className="gap-1">
          <Tag className="h-3 w-3" />
          Limited offer — first 100 users
        </Badge>
        <Badge variant="warning">Code {PREMIUM_PROMO_CODE}</Badge>
      </div>

      <h2 className="mt-4 font-mono text-xl font-bold text-slate-100 sm:text-2xl">
        Get Premium for {PREMIUM_PROMO_FIRST_MONTH} your first month
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        You found this offer via <strong className="text-slate-300">{pageTitle}</strong>.
        Enter code <strong className="text-emerald-400">{PREMIUM_PROMO_CODE}</strong> at
        checkout for {PREMIUM_PROMO_DISCOUNT} off — then pay {PREMIUM_PRICE}/mo after month one.
      </p>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <span className="font-mono text-3xl font-bold text-emerald-400">
          {PREMIUM_PROMO_FIRST_MONTH}
        </span>
        <span className="font-mono text-sm text-slate-500">first month</span>
        <span className="font-mono text-lg text-slate-600 line-through">
          {PREMIUM_PRICE}
        </span>
      </div>

      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {[
          "89 Chart Academy lessons + prop firm guide",
          "All 6 QS Planning Modules",
          "TradeLocker bot + live dashboard",
          "VIP Discord + live guidance",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="lg">
            Subscribe — {PREMIUM_PROMO_FIRST_MONTH} first month
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
        <Button variant="secondary" size="lg" onClick={copyPromoCode}>
          <Copy className="h-4 w-4" />
          {copied ? "Copied!" : `Copy ${PREMIUM_PROMO_CODE}`}
        </Button>
        <Link href="/register">
          <Button variant="ghost" size="lg">
            <Zap className="h-4 w-4" />
            Start free first
          </Button>
        </Link>
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-slate-600">
        {PREMIUM_PROMO_NOTE}
      </p>
      <Link
        href="/offers/first100-premium"
        className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-cyan-accent hover:underline"
      >
        View main FIRST100 offer
        <ArrowRight className="h-3 w-3" />
      </Link>
    </GlassPanel>
  );
}