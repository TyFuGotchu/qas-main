import Link from "next/link";
import { Radar, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import {
  EDGE_RADAR_CHECKOUT_URL,
  EDGE_RADAR_NAME,
  EDGE_RADAR_PATH,
  EDGE_RADAR_PRICE,
} from "@/lib/edge-radar";

interface EdgeRadarCTAProps {
  pageTitle: string;
  sportLabel?: string | null;
}

export function EdgeRadarCTA({ pageTitle, sportLabel }: EdgeRadarCTAProps) {
  const context = sportLabel ? `${sportLabel} player props` : "player prop line lag";

  return (
    <GlassPanel className="border-amber-500/30 bg-gradient-to-br from-slate-950 to-amber-500/5 p-6 sm:p-8">
      <Badge variant="warning" className="mb-4">
        Live prop scanner
      </Badge>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10">
          <Radar className="h-6 w-6 text-amber-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-mono text-xl font-bold text-slate-100 sm:text-2xl">
            Automate {context} with {EDGE_RADAR_NAME}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            You read <strong className="text-slate-300">{pageTitle}</strong>. Edge Radar
            runs the scan 24/7 — live injury news, cross-book line lag, and +EV alerts in
            one terminal.
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={EDGE_RADAR_CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="lg">
            <Zap className="h-4 w-4" />
            Get Edge Radar — {EDGE_RADAR_PRICE}
          </Button>
        </a>
        <Link href={EDGE_RADAR_PATH}>
          <Button variant="secondary" size="lg">
            View live terminal preview
          </Button>
        </Link>
      </div>
    </GlassPanel>
  );
}