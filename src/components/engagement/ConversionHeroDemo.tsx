"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { MiniSetupScorerDemo } from "@/components/seo/landing/MiniSetupScorerDemo";
import { TierValueProps } from "@/components/engagement/TierValueProps";
import Button from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { PRICING_TIERS } from "@/lib/pricing-tiers";

export function ConversionHeroDemo() {
  const premium = PRICING_TIERS.find((t) => t.recommended);

  return (
    <GlassPanel className="overflow-hidden border-cyan-accent/25 p-0" glow>
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="border-b border-slate-800/60 p-6 lg:border-b-0 lg:border-r">
          <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-accent">
            Try it free — no account required
          </p>
          <h3 className="mt-2 font-mono text-xl font-bold text-slate-100">
            Score your next setup in 30 seconds
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Interactive demos, animated lesson walkthroughs, and live chart overlays —
            then upgrade to unlock all 89 lessons and 6 planning modules.
          </p>
          <div className="mt-4">
            <TierValueProps compact />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={premium?.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary">
                <Zap className="h-4 w-4" />
                Go Premium — {premium?.price}/mo
              </Button>
            </a>
            <Link href="/lessons">
              <Button variant="secondary">
                Explore lessons
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <MiniSetupScorerDemo marketName="XAUUSD" />
        </div>
      </div>
    </GlassPanel>
  );
}