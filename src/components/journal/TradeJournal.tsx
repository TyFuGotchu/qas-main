"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { TradeJournalEntry } from "@prisma/client";
import type { AlphaDurabilityResult } from "@/lib/quicksilver/alpha-durability";
import type { JournalStats, SessionStatsResult } from "@/lib/journal/stats";
import { formatInTimezone } from "@/lib/journal/timezone";
import {
  getSessionDisplay,
  getSessionLabel,
  resolveEntrySession,
  resolveTradingSession,
  TRADING_SESSIONS,
} from "@/lib/journal/trading-session";
import type { TraderProfileView } from "@/lib/trader-profile";
import { SessionBadge } from "@/components/journal/SessionBadge";
import { SessionBreakdown } from "@/components/journal/SessionBreakdown";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { ScoreRing } from "@/components/tools/qs/ScoreRing";
import { TraderProfileForm } from "@/components/onboarding/TraderProfileForm";
import { PremiumUpgradeNudge } from "@/components/engagement/PremiumUpgradeNudge";
import {
  BookOpen,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function TradeJournal() {
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState<TradeJournalEntry[]>([]);
  const [stats, setStats] = useState<JournalStats | null>(null);
  const [alpha, setAlpha] = useState<AlphaDurabilityResult | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStatsResult | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [message, setMessage] = useState("");

  const [symbol, setSymbol] = useState("EURUSD");
  const [direction, setDirection] = useState("long");
  const [entryTime, setEntryTime] = useState("");
  const [exitTime, setExitTime] = useState("");
  const [pnl, setPnl] = useState("");
  const [rMultiple, setRMultiple] = useState("");
  const [setupType, setSetupType] = useState("");
  const [sessionOverride, setSessionOverride] = useState("auto");
  const [profileTimezone, setProfileTimezone] = useState("America/New_York");

  const detectedSession = useMemo(() => {
    const time = entryTime ? new Date(entryTime) : new Date();
    if (Number.isNaN(time.getTime())) return "off-hours";
    return resolveTradingSession(time);
  }, [entryTime]);

  const loadJournal = useCallback(async () => {
    try {
      const [journalRes, profileRes] = await Promise.all([
        fetch("/api/journal"),
        fetch("/api/trader-profile"),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        const profile = profileData.profile as TraderProfileView | undefined;
        if (profile?.timezone) setProfileTimezone(profile.timezone);
      }

      if (journalRes.ok) {
        const data = await journalRes.json();
        setEntries(data.entries ?? []);
        setStats(data.stats ?? null);
        setAlpha(data.alpha ?? null);
        setSessionStats(data.sessionStats ?? null);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJournal();
  }, [loadJournal]);

  useEffect(() => {
    if (searchParams.get("profile") === "1") {
      setShowProfile(true);
    }
  }, [searchParams]);

  async function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol,
        direction,
        entryTime: entryTime || new Date().toISOString(),
        exitTime: exitTime || null,
        pnl: pnl ? Number(pnl) : null,
        rMultiple: rMultiple ? Number(rMultiple) : null,
        setupType: setupType || null,
        session: sessionOverride === "auto" ? undefined : sessionOverride,
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setSymbol("EURUSD");
      setPnl("");
      setRMultiple("");
      setSetupType("");
      setSessionOverride("auto");
      await loadJournal();
    } else {
      const data = await res.json();
      setMessage(data.error ?? "Failed to add entry");
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/journal?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) await loadJournal();
  }

  async function handleCsvImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setMessage("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/journal/import", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Imported ${data.imported} trades`);
        await loadJournal();
      } else {
        setMessage(data.error ?? "Import failed");
      }
    } catch {
      setMessage("Import failed");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20">
        <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
        <span className="font-mono text-sm text-slate-500">Loading journal…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-mono text-2xl font-bold text-slate-200">
            Trade Journal
          </h2>
          <p className="mt-1 font-mono text-sm text-slate-500">
            Live terminal trades auto-log on open and close — CSV import supported
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-3.5 w-3.5" />
            Add trade
          </Button>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded border border-transparent px-3 py-1.5 font-mono text-xs text-slate-400 transition-all hover:bg-slate-800/50 hover:text-cyan-400">
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleCsvImport}
              disabled={importing}
            />
            <Upload className="h-3.5 w-3.5" />
            {importing ? "Importing…" : "Import CSV"}
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProfile(!showProfile)}
          >
            Edit risk profile
          </Button>
        </div>
      </div>

      <PremiumUpgradeNudge feature="journal analytics & Alpha Durability" />

      {message && (
        <p className="rounded border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 font-mono text-sm text-cyan-300">
          {message}
        </p>
      )}

      {showProfile && (
        <Card>
          <CardContent className="pt-6">
            <TraderProfileForm mode="settings" />
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <h3 className="font-mono text-sm font-semibold text-slate-300">
              New journal entry
            </h3>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleAddEntry}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <Input label="Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
              <Select
                label="Direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                options={[
                  { value: "long", label: "Long" },
                  { value: "short", label: "Short" },
                ]}
              />
              <Input
                label="Entry time"
                type="datetime-local"
                value={entryTime}
                onChange={(e) => setEntryTime(e.target.value)}
              />
              <Input
                label="Exit time"
                type="datetime-local"
                value={exitTime}
                onChange={(e) => setExitTime(e.target.value)}
              />
              <Input
                label="PnL ($)"
                type="number"
                step="0.01"
                value={pnl}
                onChange={(e) => setPnl(e.target.value)}
              />
              <Input
                label="R multiple"
                type="number"
                step="0.1"
                value={rMultiple}
                onChange={(e) => setRMultiple(e.target.value)}
              />
              <Input
                label="Setup type"
                value={setupType}
                onChange={(e) => setSetupType(e.target.value)}
              />
              <Select
                label="Session"
                value={sessionOverride}
                onChange={(e) => setSessionOverride(e.target.value)}
                options={[
                  {
                    value: "auto",
                    label: `Auto (${getSessionLabel(detectedSession)})`,
                  },
                  ...TRADING_SESSIONS.map((s) => {
                    const display = getSessionDisplay(s.id, profileTimezone);
                    return {
                      value: s.id,
                      label: `${s.label} · ${display.window}`,
                    };
                  }),
                ]}
              />
              <div className="flex items-end sm:col-span-2">
                <Button type="submit" variant="primary">
                  Save entry
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {stats && (
          <>
            <Card>
              <CardContent className="py-6 text-center">
                <p className="font-mono text-[10px] uppercase text-slate-600">
                  Closed trades
                </p>
                <p className="mt-2 font-mono text-3xl font-bold text-slate-200">
                  {stats.closedTrades}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Win rate {stats.winRate}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-6 text-center">
                <p className="font-mono text-[10px] uppercase text-slate-600">
                  Total PnL
                </p>
                <p
                  className={cn(
                    "mt-2 font-mono text-3xl font-bold",
                    stats.totalPnl >= 0 ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  ${stats.totalPnl.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Avg R {stats.avgR}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-6 text-center">
                <p className="font-mono text-[10px] uppercase text-slate-600">
                  Sample period
                </p>
                <p className="mt-2 font-mono text-3xl font-bold text-slate-200">
                  {stats.monthsActive}mo
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {stats.totalTrades} total entries
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {sessionStats && (
        <SessionBreakdown stats={sessionStats} timezone={profileTimezone} />
      )}

      {alpha && (
        <TerminalPanel title="Alpha Durability (from journal)" status="online">
          <div className="flex flex-wrap items-center justify-around gap-6">
            <ScoreRing
              score={alpha.qsAlphaIndex}
              label="Alpha Index"
              grade={alpha.durabilityGrade}
            />
            <div className="space-y-2 text-center">
              <Badge variant="success">{alpha.sampleAdequacy}</Badge>
              <p className="font-mono text-xs text-slate-500">
                Edge: {alpha.edgeStatus} · {alpha.expectancyPerTrade}R/trade
              </p>
            </div>
          </div>
        </TerminalPanel>
      )}

      <Card>
        <CardHeader>
          <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-300">
            <BookOpen className="h-4 w-4 text-cyan-400" />
            Recent trades
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            CSV columns: symbol, direction, entryTime, exitTime, pnl, rMultiple,
            session, setupType, notes
          </p>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="py-8 text-center font-mono text-sm text-slate-600">
              No trades yet — add manually or import a CSV export from your
              broker.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-slate-500">
                    <th className="pb-2 pr-4">Symbol</th>
                    <th className="pb-2 pr-4">Dir</th>
                    <th className="pb-2 pr-4">Entry</th>
                    <th className="pb-2 pr-4">Session</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2 pr-4">PnL</th>
                    <th className="pb-2 pr-4">R</th>
                    <th className="pb-2 pr-4">Source</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-slate-800/60 text-slate-300"
                    >
                      <td className="py-2 pr-4">{entry.symbol}</td>
                      <td className="py-2 pr-4 uppercase">{entry.direction}</td>
                      <td className="py-2 pr-4">
                        {formatInTimezone(
                          new Date(entry.entryTime),
                          profileTimezone
                        )}
                      </td>
                      <td className="py-2 pr-4">
                        <SessionBadge sessionId={resolveEntrySession(entry)} />
                      </td>
                      <td className="py-2 pr-4">
                        <Badge
                          variant={entry.exitTime ? "success" : "warning"}
                        >
                          {entry.exitTime ? "Closed" : "Open"}
                        </Badge>
                      </td>
                      <td
                        className={cn(
                          "py-2 pr-4",
                          entry.pnl == null
                            ? "text-slate-500"
                            : (entry.pnl ?? 0) >= 0
                              ? "text-emerald-400"
                              : "text-red-400"
                        )}
                      >
                        {entry.pnl != null ? `$${entry.pnl.toFixed(2)}` : "—"}
                      </td>
                      <td className="py-2 pr-4">
                        {entry.rMultiple != null ? entry.rMultiple : "—"}
                      </td>
                      <td className="py-2 pr-4 text-slate-500">
                        {entry.source}
                      </td>
                      <td className="py-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          className="text-slate-600 hover:text-red-400"
                          aria-label="Delete entry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}