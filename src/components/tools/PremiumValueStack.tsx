import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  PREMIUM_VALUE_PILLARS,
  PREMIUM_CTA_LABEL,
  PREMIUM_HEADLINE,
  PREMIUM_SUBHEADLINE,
  PROP_FIRM_PREMIUM_FEATURES_LEAD,
} from "@/lib/premium-value-stack";
import { getPremiumCheckoutUrl } from "@/lib/pricing-tiers";
import { ALL_TOOLS } from "@/lib/tools-registry";

interface PremiumValueStackProps {
  showToolList?: boolean;
  className?: string;
}

export function PremiumValueStack({
  showToolList = false,
  className,
}: PremiumValueStackProps) {
  const premiumUrl = getPremiumCheckoutUrl(true);

  return (
    <GlassPanel className={`border-cyan-accent/25 p-6 sm:p-8 ${className ?? ""}`} glow>
      <div className="text-center">
        <Badge variant="success" className="mb-3">
          Quicksilver Premium
        </Badge>
        <h2 className="font-mono text-xl font-bold text-slate-100 sm:text-2xl">
          {PREMIUM_HEADLINE}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">{PREMIUM_SUBHEADLINE}</p>
      </div>

      <ul className="mx-auto mt-6 max-w-2xl space-y-2">
        {PROP_FIRM_PREMIUM_FEATURES_LEAD.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 font-mono text-xs text-slate-400"
          >
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-terminal" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PREMIUM_VALUE_PILLARS.map((pillar) => {
          const content = (
            <>
              <p className="font-mono text-sm font-semibold text-cyan-accent">{pillar.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{pillar.description}</p>
            </>
          );

          if ("href" in pillar && pillar.href) {
            return (
              <Link
                key={pillar.id}
                href={pillar.href}
                className="rounded-lg border border-cyan-accent/30 bg-cyan-accent/5 px-4 py-4 transition-colors hover:border-cyan-accent/50"
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={pillar.id}
              className="rounded-lg border border-slate-800/60 bg-slate-950/40 px-4 py-4"
            >
              {content}
            </div>
          );
        })}
      </div>

      {showToolList ? (
        <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_TOOLS.map((tool) => (
            <li
              key={tool.slug}
              className="flex items-start gap-2 font-mono text-xs text-slate-400"
            >
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-terminal" />
              {tool.shortName}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a href={premiumUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="lg">
            <Zap className="h-4 w-4" />
            {PREMIUM_CTA_LABEL}
          </Button>
        </a>
        <Link href="/register">
          <Button variant="secondary" size="lg">
            Create Free Account
          </Button>
        </Link>
      </div>
    </GlassPanel>
  );
}