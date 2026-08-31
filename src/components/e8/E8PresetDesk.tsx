"use client";

import { useEffect, useMemo, useState } from "react";
import { E8SignupButton } from "@/components/e8/E8SignupButton";
import Button from "@/components/ui/Button";
import { type LiveE8Preset } from "@/lib/e8-partner";
import {
  computePresetGuard,
  signatureDdPctForSize,
  type GuardStatus,
} from "@/lib/e8-preset-math";
import { useConnectedTradeLockerDashboard } from "@/hooks/useConnectedTradeLockerDashboard";
import { TRADELOCKER_LIVE_REFRESH_MS } from "@/lib/tradelocker/constants";
import { cn } from "@/lib/utils";

const SESSION_KEY = "qs-e8-applied-preset";

export function E8PresetDesk({ preset }: { preset: LiveE8Preset }) {
  const { dashboard, tlConnected, lastGoodAt, error } =
    useConnectedTradeLockerDashboard({
      refreshIntervalMs: TRADELOCKER_LIVE_REFRESH_MS,
    });

  const liveEquity =
    dashboard?.metrics
      ? dashboard.metrics.balance + dashboard.metrics.openNetPnL
      : null;
  const liveFloat = dashboard?.metrics.openNetPnL ?? null;

  const defaultSize = preset.eod ? 100_000 : 100_000;
  const defaultDd = preset.eod ? signatureDdPctForSize(defaultSize) : preset.defaultDdPct;

  const [accountSize, setAccountSize] = useState(String(defaultSize));
  const [equity, setEquity] = useState(String(defaultSize));
  const [dailyPct, setDailyPct] = useState(String(preset.defaultDailyPct));
  const [ddPct, setDdPct] = useState(String(defaultDd));
  const [floatPnl, setFloatPnl] = useState("0");
  const [stopDistance, setStopDistance] = useState("50");
  const [dailyCapPct, setDailyCapPct] = useState(
    String(preset.hasDailyCap ? preset.defaultDailyCapPct ?? 2 : "")
  );
  const [applied, setApplied] = useState(false);
  const [journalMsg, setJournalMsg] = useState("");

  useEffect(() => {
    if (liveEquity != null) setEquity(String(Math.round(liveEquity * 100) / 100));
    if (liveFloat != null) setFloatPnl(String(Math.round(liveFloat * 100) / 100));
  }, [liveEquity, liveFloat]);

  useEffect(() => {
    const size = Number(accountSize) || defaultSize;
    if (preset.eod) setDdPct(String(signatureDdPctForSize(size)));
  }, [accountSize, preset.eod, defaultSize]);

  const result = useMemo(() => {
    return computePresetGuard({
      equity: Number(equity) || 0,
      maxDailyPct: Number(dailyPct) || 0,
      maxDdPct: Number(ddPct) || 0,
      floatingPnl: Number(floatPnl) || 0,
      stopDistance: Number(stopDistance) || 0,
      dailyCapPct: preset.hasDailyCap ? Number(dailyCapPct) || 0 : undefined,
    });
  }, [equity, dailyPct, ddPct, floatPnl, stopDistance, dailyCapPct, preset.hasDailyCap]);

  function applySession() {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        presetId: preset.id,
        at: Date.now(),
        equity: Number(equity),
        dailyPct: Number(dailyPct),
        ddPct: Number(ddPct),
        status: result.status,
      })
    );
    setApplied(true);
  }

  async function saveJournal() {
    setJournalMsg("");
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: preset.code,
          direction: "long",
          entryTime: new Date().toISOString(),
          setupType: preset.name,
          notes: `${preset.name} (${preset.code} → ${preset.productName}). Equity ${equity}. Daily ${dailyPct}% / DD ${ddPct}%. Float ${floatPnl}. Status ${result.status}. Software planning guardrail only.`,
        }),
      });
      setJournalMsg(res.ok ? "Saved to journal." : "Sign in to save this planner note.");
    } catch {
      setJournalMsg("Could not save. Try again from a logged-in session.");
    }
  }

  return (
    <div className="mt-5 space-y-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89BB8]">
          {preset.code} · {preset.productName}
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-[#F5F3FA]">{preset.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#F5F3FA]">{preset.warning}</p>
        <p className="mt-2 text-xs text-[#C9C2D6]">
          Software planning guardrail. Not a guaranteed pass. Trader still supervises.
        </p>
      </div>

      {tlConnected && (
        <p className="text-[11px] text-[#C9C2D6]">
          Near-live TradeLocker equity / float · refreshed every few seconds
          {lastGoodAt ? ` · last good ${new Date(lastGoodAt).toLocaleTimeString()}` : ""}
          {error ? ` · ${error}` : ""}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Account size ($)" value={accountSize} onChange={setAccountSize} />
        <Field label="Starting balance / equity ($)" value={equity} onChange={setEquity} />
        <Field label="Max daily loss %" value={dailyPct} onChange={setDailyPct} />
        <Field label="Max DD %" value={ddPct} onChange={setDdPct} />
        <Field label="Current floating P&L ($)" value={floatPnl} onChange={setFloatPnl} />
        <Field label="Planned stop distance ($ / 1.00 lot)" value={stopDistance} onChange={setStopDistance} />
        {preset.hasDailyCap && (
          <Field label="Daily profit cap %" value={dailyCapPct} onChange={setDailyCapPct} />
        )}
      </div>

      {preset.eod && (
        <p className="text-xs text-[#C9C2D6]">
          Signature max DD by size: 25K/50K = 4%, 100K/150K = 3%. Planner uses {ddPct}% for $
          {Number(accountSize).toLocaleString()} size.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Max $ daily room" value={money(result.dailyRoom)} />
        <Stat label="Max $ total DD room" value={money(result.ddRoom)} />
        <Stat label="Remaining room after float" value={money(result.remainingDaily)} />
        <Stat label="Suggested risk / trade" value={money(result.suggestedRisk)} />
        <Stat
          label="Suggested size (lots)"
          value={result.suggestedSize ? result.suggestedSize.toFixed(2) : "Set stop $"}
        />
        <StatusPill status={result.status} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="e8" type="button" onClick={applySession}>
          {applied ? "Applied to session" : "Apply preset to session"}
        </Button>
        <Button variant="secondary" type="button" onClick={() => void saveJournal()}>
          Save to journal
        </Button>
        <E8SignupButton size="md" />
      </div>
      {journalMsg && <p className="text-xs text-[#E4D4FF]">{journalMsg}</p>}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#A89BB8]">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-10 w-full rounded-[6px] border border-[rgba(199,170,255,0.18)] bg-[#12081A] px-3 text-sm text-white placeholder:text-[#A89BB8] outline-none focus:border-[#E4D4FF]"
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[6px] border border-[rgba(199,170,255,0.18)] bg-[#12081A] px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#A89BB8]">{label}</p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: GuardStatus }) {
  return (
    <div className="rounded-[6px] border border-[rgba(199,170,255,0.18)] bg-[#12081A] px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#A89BB8]">Status</p>
      <p
        className={cn(
          "mt-1 text-sm font-semibold",
          status === "SAFE" && "text-emerald-300",
          status === "TIGHT" && "text-amber-200",
          status === "BREACH RISK" && "text-red-300"
        )}
      >
        {status}
      </p>
    </div>
  );
}

function money(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;
}
