"use client";

import { useCallback, useEffect, useState } from "react";
import { Lock, Newspaper, RefreshCw, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import {
  EDGE_RADAR_CHECKOUT_URL,
  EDGE_RADAR_PRICE,
  formatImpactScore,
  getImpactScoreVariant,
  getSportLabel,
} from "@/lib/edge-radar";
import { cn } from "@/lib/utils";

interface FeedSport {
  id: string;
  label: string;
  count: number;
}

interface PropAlert {
  id: string;
  sport: string;
  player: string;
  propType: string;
  line: string;
  signal: string;
  detail: string;
  evPercent: number | null;
  books: unknown;
  publishedAt: string;
}

interface NewsItem {
  id: string;
  sport: string;
  headline: string;
  summary: string;
  impactScore: number;
  source: string | null;
  publishedAt: string;
}

interface FeedResponse {
  hasAccess: boolean;
  sport: string;
  sports: FeedSport[];
  alerts: PropAlert[];
  news: NewsItem[];
  refreshedAt: string;
  lastIngestAt: string | null;
  freshnessHours: { news: number; alerts: number };
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

interface EdgeRadarDashboardProps {
  initialSport?: string;
  compact?: boolean;
}

export function EdgeRadarDashboard({
  initialSport = "all",
  compact = false,
}: EdgeRadarDashboardProps) {
  const [sport, setSport] = useState(initialSport);
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch(`/api/edge-radar/feed?sport=${sport}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = (await res.json()) as FeedResponse;
        setFeed(data);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sport]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    const interval = setInterval(() => loadFeed(true), 30_000);
    return () => clearInterval(interval);
  }, [loadFeed]);

  const hasAccess = feed?.hasAccess ?? false;

  return (
    <div className="space-y-4">
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="flex min-w-max gap-2">
          {(feed?.sports ?? []).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSport(s.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors",
                sport === s.id
                  ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-300"
                  : "border-slate-700/60 bg-slate-900/40 text-slate-500 hover:border-slate-600 hover:text-slate-300"
              )}
            >
              {s.label}
              {s.count > 0 && (
                <span className="ml-1.5 text-slate-600">({s.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
          {hasAccess ? "Live feed" : "Preview mode"} ·{" "}
          {feed?.refreshedAt ? `Updated ${formatTime(feed.refreshedAt)}` : "Loading…"}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => loadFeed(true)}
          disabled={refreshing}
        >
          <RefreshCw className={cn("h-3 w-3", refreshing && "animate-spin")} aria-hidden />
          Refresh
        </Button>
      </div>

      <div className={cn("grid gap-4", compact ? "grid-cols-1" : "lg:grid-cols-5")}>
        <section className={cn(compact ? "" : "lg:col-span-3")}>
          <div className="mb-2 flex items-center gap-2">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-slate-400">
              +EV Prop Alerts
            </h3>
            {!hasAccess && <Badge variant="warning">Preview</Badge>}
          </div>

          <div className="relative">
            <TerminalPanel title="QS Edge Radar · Prop Scanner" status="online" className="!p-0">
              {loading && !feed ? (
                <p className="p-4 font-mono text-xs text-slate-600">Loading alerts…</p>
              ) : feed?.alerts.length === 0 ? (
                <p className="p-4 font-mono text-xs leading-relaxed text-slate-600">
                  No prop alerts in the last {feed.freshnessHours.alerts}h for{" "}
                  {getSportLabel(sport)}.
                  {!feed.lastIngestAt && " Feed is syncing — check back in a few minutes."}
                </p>
              ) : (
                feed?.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="grid gap-2 border-b border-slate-800/50 px-4 py-3 sm:grid-cols-[4.5rem_1fr_auto] sm:items-center sm:gap-4"
                  >
                    <span className="font-mono text-[10px] text-slate-600">
                      {formatTime(alert.publishedAt)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="default">{getSportLabel(alert.sport)}</Badge>
                        <span className="font-mono text-xs font-semibold text-slate-200">
                          {alert.player} {alert.propType} {alert.line}
                        </span>
                        <span className="rounded border border-emerald-500/30 bg-emerald-500/5 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                          {alert.signal}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-[11px] leading-relaxed text-slate-500">
                        {alert.detail}
                      </p>
                    </div>
                    {alert.evPercent != null && (
                      <span className="font-mono text-xs font-semibold text-amber-400 sm:text-right">
                        +{alert.evPercent.toFixed(1)}% EV
                      </span>
                    )}
                  </div>
                ))
              )}
            </TerminalPanel>

            {!hasAccess && (
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent px-4 pb-6 pt-20 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/30 bg-slate-950/90">
                  <Lock className="h-4 w-4 text-cyan-accent" aria-hidden />
                </div>
                <p className="mt-3 font-mono text-sm font-semibold text-slate-200">
                  Subscribe to unlock the full live feed
                </p>
                <a
                  href={EDGE_RADAR_CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4"
                >
                  <Button variant="primary" size="md">
                    <Zap className="h-4 w-4" aria-hidden />
                    Get Edge Radar — {EDGE_RADAR_PRICE}
                  </Button>
                </a>
              </div>
            )}
          </div>
        </section>

        <section className={cn(compact ? "" : "lg:col-span-2")}>
          <div className="mb-2 flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-amber-400" aria-hidden />
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-slate-400">
              News Impact Feed
            </h3>
          </div>

          <div className="max-h-[28rem] space-y-2 overflow-y-auto rounded-lg border border-slate-800/60 bg-slate-950/40 p-3">
            {loading && !feed ? (
              <p className="font-mono text-xs text-slate-600">Loading news…</p>
            ) : feed?.news.length === 0 ? (
              <p className="font-mono text-xs leading-relaxed text-slate-600">
                No news in the last {feed.freshnessHours.news}h for this filter.
                {!feed.lastIngestAt && " Feed is syncing — check back in a few minutes."}
              </p>
            ) : (
              feed?.news.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-lg border border-slate-800/50 bg-slate-900/30 p-3",
                    !hasAccess && "relative"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="default">{getSportLabel(item.sport)}</Badge>
                        {item.source && (
                          <span className="font-mono text-[9px] text-slate-600">{item.source}</span>
                        )}
                      </div>
                      <p className="mt-1 font-mono text-xs font-semibold text-slate-200">
                        {item.headline}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-xs leading-relaxed text-slate-500",
                          !hasAccess && "blur-[2px] select-none"
                        )}
                      >
                        {item.summary}
                      </p>
                    </div>
                    <Badge variant={getImpactScoreVariant(item.impactScore)}>
                      {formatImpactScore(item.impactScore)}
                    </Badge>
                  </div>
                  <p className="mt-2 font-mono text-[9px] text-slate-600">
                    {formatTime(item.publishedAt)} · Impact score
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}