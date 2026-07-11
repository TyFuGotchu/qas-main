"use client";

import { useEffect, useState } from "react";
import { Radar, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EDGE_RADAR_SPORTS, getSportLabel } from "@/lib/edge-radar";

interface PropAlert {
  id: string;
  sport: string;
  player: string;
  propType: string;
  line: string;
  signal: string;
  detail: string;
  evPercent: number | null;
  active: boolean;
  publishedAt: string;
}

interface NewsItem {
  id: string;
  sport: string;
  headline: string;
  summary: string;
  impactScore: number;
  source: string | null;
  active: boolean;
  publishedAt: string;
}

const sportOptions = EDGE_RADAR_SPORTS.filter((s) => s.id !== "all").map((s) => ({
  value: s.id,
  label: s.label,
}));

const emptyAlertForm = {
  sport: "nba",
  player: "",
  propType: "",
  line: "",
  signal: "LINE LAG",
  detail: "",
  evPercent: "",
};

const emptyNewsForm = {
  sport: "nba",
  headline: "",
  summary: "",
  impactScore: "70",
  source: "",
};

interface IngestStatus {
  activeNews: number;
  activeAlerts: number;
  oddsConfigured: boolean;
  cronPath: string;
  recommendedCron: string;
  lastRun: {
    completedAt: string;
    newsInserted: number;
    alertsInserted: number;
    feedsPolled: number;
    oddsPolled: number;
    errors: string[];
  } | null;
}

export function EdgeRadarAdminPanel() {
  const [alerts, setAlerts] = useState<PropAlert[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [ingestStatus, setIngestStatus] = useState<IngestStatus | null>(null);
  const [alertForm, setAlertForm] = useState(emptyAlertForm);
  const [newsForm, setNewsForm] = useState(emptyNewsForm);
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(false);
  const [message, setMessage] = useState("");

  async function loadIngestStatus() {
    const res = await fetch("/api/admin/edge-radar/ingest");
    if (res.ok) {
      setIngestStatus(await res.json());
    }
  }

  async function runIngestNow() {
    setIngesting(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/edge-radar/ingest", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setMessage(
          `Ingest complete — +${data.newsInserted} news, +${data.alertsInserted} alerts (${data.feedsPolled} feeds polled)`
        );
        loadData();
        loadIngestStatus();
      } else {
        setMessage(data.error ?? "Ingest failed");
      }
    } finally {
      setIngesting(false);
    }
  }

  async function loadData() {
    setLoading(true);
    try {
      const [alertsRes, newsRes] = await Promise.all([
        fetch("/api/admin/edge-radar/alerts"),
        fetch("/api/admin/edge-radar/news"),
      ]);
      await loadIngestStatus();
      if (alertsRes.ok) {
        const data = await alertsRes.json();
        setAlerts(data.alerts);
      }
      if (newsRes.ok) {
        const data = await newsRes.json();
        setNews(data.news);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function submitAlert(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/edge-radar/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...alertForm,
        evPercent: alertForm.evPercent ? parseFloat(alertForm.evPercent) : undefined,
        books: ["DraftKings", "FanDuel"],
      }),
    });
    if (res.ok) {
      setAlertForm(emptyAlertForm);
      setMessage("Prop alert published");
      loadData();
    }
  }

  async function submitNews(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/edge-radar/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newsForm,
        impactScore: parseInt(newsForm.impactScore, 10),
      }),
    });
    if (res.ok) {
      setNewsForm(emptyNewsForm);
      setMessage("News item published");
      loadData();
    }
  }

  async function toggleAlertActive(id: string, active: boolean) {
    await fetch(`/api/admin/edge-radar/alerts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    loadData();
  }

  async function toggleNewsActive(id: string, active: boolean) {
    await fetch(`/api/admin/edge-radar/news/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    loadData();
  }

  async function deleteAlert(id: string) {
    await fetch(`/api/admin/edge-radar/alerts/${id}`, { method: "DELETE" });
    loadData();
  }

  async function deleteNews(id: string) {
    await fetch(`/api/admin/edge-radar/news/${id}`, { method: "DELETE" });
    loadData();
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-2 font-mono text-lg font-bold text-slate-200">
          <Radar className="h-5 w-5 text-amber-400" />
          Edge Radar Control
        </h3>
        <p className="mt-1 font-mono text-xs text-slate-500">
          Publish prop alerts and news items. Admins always have full dashboard access.
        </p>
      </div>

      {message && (
        <p className="rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 font-mono text-xs text-amber-300">
          {message}
        </p>
      )}

      <Card>
        <CardHeader>
          <h4 className="font-mono text-sm font-semibold text-slate-200">
            Automated ingest (keeps every sport fresh)
          </h4>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs leading-relaxed text-slate-500">
            Polls ESPN + Google News RSS for all 18 sports every run. High-impact headlines
            auto-spawn prop watches. Optional{" "}
            Set <code className="text-cyan-400">SPORTSGAMEODDS_API_KEY</code> in Railway for real
            player prop line lag on DraftKings/FanDuel (4 leagues per ingest run).
          </p>
          {ingestStatus && (
            <div className="grid gap-2 font-mono text-xs text-slate-400 sm:grid-cols-3">
              <p>Active news: {ingestStatus.activeNews}</p>
              <p>Active alerts: {ingestStatus.activeAlerts}</p>
              <p>
                Odds API: {ingestStatus.oddsConfigured ? "SportsGameOdds connected" : "Not set"}
              </p>
            </div>
          )}
          {ingestStatus?.lastRun && (
            <p className="font-mono text-[10px] text-slate-600">
              Last run {new Date(ingestStatus.lastRun.completedAt).toLocaleString()} — +
              {ingestStatus.lastRun.newsInserted} news, +{ingestStatus.lastRun.alertsInserted}{" "}
              alerts, {ingestStatus.lastRun.feedsPolled} feeds
              {ingestStatus.lastRun.errors?.length > 0 &&
                ` · ${ingestStatus.lastRun.errors.length} errors`}
            </p>
          )}
          <p className="font-mono text-[10px] text-slate-600">
            Railway cron: POST {ingestStatus?.cronPath ?? "/api/edge-radar/ingest/run"} every 10m
            with Authorization: Bearer $ONBOARDING_INTERNAL_SECRET
          </p>
          <Button variant="primary" size="sm" onClick={runIngestNow} disabled={ingesting}>
            {ingesting ? "Running ingest…" : "Run ingest now"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h4 className="font-mono text-sm font-semibold text-slate-200">New Prop Alert</h4>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitAlert} className="space-y-3">
              <Select
                label="Sport"
                options={sportOptions}
                value={alertForm.sport}
                onChange={(e) => setAlertForm({ ...alertForm, sport: e.target.value })}
              />
              <Input
                label="Player"
                value={alertForm.player}
                onChange={(e) => setAlertForm({ ...alertForm, player: e.target.value })}
                required
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Prop type"
                  value={alertForm.propType}
                  onChange={(e) => setAlertForm({ ...alertForm, propType: e.target.value })}
                  placeholder="O 28.5 Pts"
                  required
                />
                <Input
                  label="Line"
                  value={alertForm.line}
                  onChange={(e) => setAlertForm({ ...alertForm, line: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Signal"
                value={alertForm.signal}
                onChange={(e) => setAlertForm({ ...alertForm, signal: e.target.value })}
                required
              />
              <Input
                label="Detail"
                value={alertForm.detail}
                onChange={(e) => setAlertForm({ ...alertForm, detail: e.target.value })}
                required
              />
              <Input
                label="EV % (optional)"
                value={alertForm.evPercent}
                onChange={(e) => setAlertForm({ ...alertForm, evPercent: e.target.value })}
              />
              <Button type="submit" variant="primary" size="sm">
                Publish Alert
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="font-mono text-sm font-semibold text-slate-200">New News Item</h4>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitNews} className="space-y-3">
              <Select
                label="Sport"
                options={sportOptions}
                value={newsForm.sport}
                onChange={(e) => setNewsForm({ ...newsForm, sport: e.target.value })}
              />
              <Input
                label="Headline"
                value={newsForm.headline}
                onChange={(e) => setNewsForm({ ...newsForm, headline: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  Summary
                </label>
                <textarea
                  value={newsForm.summary}
                  onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                  required
                  rows={3}
                  className="w-full rounded border border-slate-700 bg-obsidian-800 px-3 py-2 font-mono text-sm text-slate-200 focus:border-cyan-500/50 focus:outline-none"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Impact score (1–100)"
                  type="number"
                  min={1}
                  max={100}
                  value={newsForm.impactScore}
                  onChange={(e) => setNewsForm({ ...newsForm, impactScore: e.target.value })}
                  required
                />
                <Input
                  label="Source (optional)"
                  value={newsForm.source}
                  onChange={(e) => setNewsForm({ ...newsForm, source: e.target.value })}
                />
              </div>
              <Button type="submit" variant="primary" size="sm">
                Publish News
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h4 className="font-mono text-sm font-semibold text-slate-200">
              Active Alerts ({alerts.length})
            </h4>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="font-mono text-xs text-slate-500">Loading…</p>
            ) : (
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {alerts.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start justify-between gap-2 rounded border border-slate-800/60 p-2"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-slate-300">
                        [{getSportLabel(a.sport)}] {a.player} {a.propType}
                      </p>
                      <p className="font-mono text-[10px] text-slate-600">{a.signal}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant={a.active ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => toggleAlertActive(a.id, !a.active)}
                      >
                        {a.active ? "On" : "Off"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteAlert(a.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="font-mono text-sm font-semibold text-slate-200">
              News Feed ({news.length})
            </h4>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="font-mono text-xs text-slate-500">Loading…</p>
            ) : (
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {news.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start justify-between gap-2 rounded border border-slate-800/60 p-2"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-slate-300">{n.headline}</p>
                      <Badge variant="warning" className="mt-1">
                        Impact {n.impactScore}
                      </Badge>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant={n.active ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => toggleNewsActive(n.id, !n.active)}
                      >
                        {n.active ? "On" : "Off"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteNews(n.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}