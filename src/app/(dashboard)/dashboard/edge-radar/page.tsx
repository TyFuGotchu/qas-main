import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Radar, TrendingUp, Zap } from "lucide-react";
import { EdgeRadarTerminalPreview } from "@/components/edge-radar/EdgeRadarTerminalPreview";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  EDGE_RADAR_CHECKOUT_URL,
  EDGE_RADAR_FEATURES,
  EDGE_RADAR_HOOK,
  EDGE_RADAR_NAME,
  EDGE_RADAR_PATH,
  EDGE_RADAR_PRICE,
  EDGE_RADAR_TAGLINE,
} from "@/lib/edge-radar";
export const metadata: Metadata = {
  title: `${EDGE_RADAR_NAME} | Quicksilver Dashboard`,
  description: EDGE_RADAR_HOOK,
  robots: { index: false, follow: false },
};

const FEATURE_ICONS = [TrendingUp, Activity, Radar] as const;

export default function DashboardEdgeRadarPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="warning">Standalone product</Badge>
          <Badge variant="default">{EDGE_RADAR_PRICE}</Badge>
        </div>
        <h2 className="mt-3 font-mono text-2xl font-bold text-slate-200">{EDGE_RADAR_NAME}</h2>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-cyan-accent/80">
          {EDGE_RADAR_TAGLINE}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">{EDGE_RADAR_HOOK}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={EDGE_RADAR_CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="md">
              <Zap className="h-4 w-4" aria-hidden />
              Subscribe — {EDGE_RADAR_PRICE}
            </Button>
          </a>
          <Link href={EDGE_RADAR_PATH}>
            <Button variant="secondary" size="md">
              Full product page
            </Button>
          </Link>
        </div>
      </div>

      <section>
        <h3 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Live Edge Terminal
        </h3>
        <EdgeRadarTerminalPreview />
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {EDGE_RADAR_FEATURES.map((feature, index) => {
          const Icon = FEATURE_ICONS[index];
          return (
            <div
              key={feature.title}
              className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-4"
            >
              <Icon className="h-4 w-4 text-cyan-400" aria-hidden />
              <h4 className="mt-2 font-mono text-xs font-semibold text-slate-200">
                {feature.title}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{feature.description}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}