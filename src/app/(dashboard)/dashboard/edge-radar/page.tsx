import type { Metadata } from "next";
import Link from "next/link";
import { EdgeRadarDashboard } from "@/components/edge-radar/EdgeRadarDashboard";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { enforceAuthenticatedDashboardAccess } from "@/lib/access-control";
import {
  EDGE_RADAR_CHECKOUT_URL,
  EDGE_RADAR_HOOK,
  EDGE_RADAR_NAME,
  EDGE_RADAR_PATH,
  EDGE_RADAR_PRICE,
  EDGE_RADAR_TAGLINE,
} from "@/lib/edge-radar";
import { sessionHasEdgeRadarAccess } from "@/lib/edge-radar-access";

export const metadata: Metadata = {
  title: `${EDGE_RADAR_NAME} | Quicksilver Dashboard`,
  description: EDGE_RADAR_HOOK,
  robots: { index: false, follow: false },
};

export default async function DashboardEdgeRadarPage() {
  const user = await enforceAuthenticatedDashboardAccess();
  const hasAccess = sessionHasEdgeRadarAccess(user);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="warning">Sports props only</Badge>
          <Badge variant={hasAccess ? "success" : "default"}>
            {hasAccess ? "Full access" : EDGE_RADAR_PRICE}
          </Badge>
        </div>
        <h2 className="mt-3 font-mono text-2xl font-bold text-slate-200">{EDGE_RADAR_NAME}</h2>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-cyan-accent/80">
          {EDGE_RADAR_TAGLINE}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">{EDGE_RADAR_HOOK}</p>
        {!hasAccess && (
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={EDGE_RADAR_CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="md">
                Subscribe — {EDGE_RADAR_PRICE}
              </Button>
            </a>
            <Link href={EDGE_RADAR_PATH}>
              <Button variant="secondary" size="md">
                Product page
              </Button>
            </Link>
          </div>
        )}
      </div>

      <EdgeRadarDashboard />
    </div>
  );
}