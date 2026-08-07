import Link from "next/link";
import { Calendar, Target, Zap } from "lucide-react";
import { PropFirmTimeline } from "@/components/academy/PropFirmTimeline";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  PROP_FIRM_CHALLENGE_DAYS,
  PROP_FIRM_CONSISTENCY_TARGET,
  PROP_FIRM_DAY_PREVIEW,
  PROP_FIRM_MARKETING_HEADLINE,
  PROP_FIRM_MARKETING_SUBHEADLINE,
  PROP_FIRM_PLAYBOOK_CTA,
  PROP_FIRM_PLAYBOOK_DESCRIPTION,
  PROP_FIRM_PLAYBOOK_HIGHLIGHTS,
  PROP_FIRM_PLAYBOOK_HREF,
  PROP_FIRM_PLAYBOOK_TITLE,
  PROP_FIRM_PREMIUM_PITCH,
} from "@/lib/prop-firm-challenge-marketing";
import { getPremiumCheckoutUrl } from "@/lib/pricing-tiers";

interface PropFirmChallengePromoProps {
  variant?: "compact" | "full" | "banner";
  className?: string;
}

export function PropFirmChallengePromo({
  variant = "full",
  className,
}: PropFirmChallengePromoProps) {
  const premiumUrl = getPremiumCheckoutUrl(true);

  if (variant === "compact") {
    return (
      <GlassPanel className={`border-cyan-accent/25 p-4 ${className ?? ""}`}>
        <p className="font-mono text-xs text-slate-400">
          <strong className="text-cyan-accent">{PROP_FIRM_MARKETING_HEADLINE}</strong> —{" "}
          {PROP_FIRM_PLAYBOOK_DESCRIPTION.slice(0, 120)}…{" "}
          <Link href={PROP_FIRM_PLAYBOOK_HREF} className="text-cyan-accent hover:underline">
            Preview playbook →
          </Link>
        </p>
      </GlassPanel>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={`rounded-xl border border-cyan-accent/35 bg-gradient-to-r from-cyan-500/10 to-emerald-500/5 px-6 py-8 text-center ${className ?? ""}`}
      >
        <Badge variant="success" className="mb-3">
          {PROP_FIRM_CHALLENGE_DAYS}-Day Prop Firm Playbook
        </Badge>
        <h3 className="font-mono text-xl font-bold text-cyan-100">
          {PROP_FIRM_MARKETING_HEADLINE}
        </h3>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-cyan-200/80">
          {PROP_FIRM_PREMIUM_PITCH}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <a href={premiumUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="lg">
              <Zap className="h-4 w-4" />
              {PROP_FIRM_PLAYBOOK_CTA}
            </Button>
          </a>
          <Link href={PROP_FIRM_PLAYBOOK_HREF}>
            <Button variant="secondary" size="lg">
              Preview Playbook
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <GlassPanel className={`border-cyan-accent/30 p-6 sm:p-8 ${className ?? ""}`} glow>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <Badge variant="success" className="mb-2">
            Premium Flagship
          </Badge>
          <h3 className="font-mono text-xl font-bold text-slate-100 sm:text-2xl">
            {PROP_FIRM_MARKETING_HEADLINE}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {PROP_FIRM_MARKETING_SUBHEADLINE}
          </p>
          <p className="mt-3 font-mono text-xs text-slate-500">{PROP_FIRM_PLAYBOOK_TITLE}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={PROP_FIRM_PLAYBOOK_HREF}>
            <Button variant="secondary" size="sm">
              <Calendar className="h-3.5 w-3.5" />
              Preview Playbook
            </Button>
          </Link>
          <a href={premiumUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm">
              <Zap className="h-3.5 w-3.5" />
              {PROP_FIRM_PLAYBOOK_CTA}
            </Button>
          </a>
        </div>
      </div>

      <div className="mt-6">
        <PropFirmTimeline days={PROP_FIRM_CHALLENGE_DAYS} />
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {PROP_FIRM_PLAYBOOK_HIGHLIGHTS.map((highlight) => (
          <div
            key={highlight}
            className="flex items-start gap-2 rounded-lg border border-slate-800/60 bg-slate-950/40 px-3 py-2.5"
          >
            <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-accent" />
            <p className="text-xs leading-relaxed text-slate-500">{highlight}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {PROP_FIRM_DAY_PREVIEW.map((day) => (
          <div
            key={day.day}
            className="rounded-lg border border-slate-800/60 bg-slate-950/50 px-3 py-3"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-accent/80">
              Day {day.day}
            </p>
            <p className="mt-1 font-mono text-xs font-semibold text-slate-200">{day.title}</p>
            <p className="mt-1 text-[10px] text-slate-500">{day.focus}</p>
            <p className="mt-2 font-mono text-[10px] text-emerald-400">
              Cap +{day.profitCap}%
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center font-mono text-[10px] text-slate-600">
        Consistency target ≤ {PROP_FIRM_CONSISTENCY_TARGET}% best-day ratio · Premium unlocks full
        daily tasks & tool workflows
      </p>
    </GlassPanel>
  );
}