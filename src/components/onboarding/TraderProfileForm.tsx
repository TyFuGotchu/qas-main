"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TRADER_TIMEZONES } from "@/lib/journal/timezone";
import {
  ACCOUNT_TYPES,
  MARKET_OPTIONS,
  TRADING_STYLES,
  type TraderProfileView,
} from "@/lib/trader-profile";
import { PROP_FIRM_PRESETS, limitsFromPreset } from "@/lib/prop-firms";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useSession } from "@/providers/SessionProvider";
import { cn } from "@/lib/utils";
import { Loader2, Shield } from "lucide-react";

interface TraderProfileFormProps {
  mode?: "onboarding" | "settings";
}

export function TraderProfileForm({ mode = "onboarding" }: TraderProfileFormProps) {
  const router = useRouter();
  const { setUser } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [accountType, setAccountType] = useState("personal");
  const [tradingStyle, setTradingStyle] = useState("day");
  const [primaryMarkets, setPrimaryMarkets] = useState<string[]>(["Forex"]);
  const [propFirmPreset, setPropFirmPreset] = useState("generic");
  const [dailyLossLimitPct, setDailyLossLimitPct] = useState("5");
  const [maxDrawdownPct, setMaxDrawdownPct] = useState("10");
  const [riskPerTradePct, setRiskPerTradePct] = useState("1");
  const [maxTradesPerDay, setMaxTradesPerDay] = useState("10");
  const [strictPreTradeGate, setStrictPreTradeGate] = useState(true);
  const [timezone, setTimezone] = useState("America/New_York");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/trader-profile");
        if (res.ok) {
          const data = await res.json();
          const p = data.profile as TraderProfileView;
          setAccountType(p.accountType);
          setTradingStyle(p.tradingStyle);
          setPrimaryMarkets(p.primaryMarkets);
          setPropFirmPreset(p.propFirmPreset);
          setDailyLossLimitPct(String(p.dailyLossLimitPct));
          setMaxDrawdownPct(String(p.maxDrawdownPct));
          setRiskPerTradePct(String(p.riskPerTradePct));
          setMaxTradesPerDay(String(p.maxTradesPerDay));
          setStrictPreTradeGate(p.strictPreTradeGate);
          setTimezone(p.timezone);
        }
      } catch {
        // use defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function applyPreset(presetId: string) {
    setPropFirmPreset(presetId);
    if (presetId !== "custom") {
      const limits = limitsFromPreset(presetId);
      setDailyLossLimitPct(String(limits.dailyLossLimitPct));
      setMaxDrawdownPct(String(limits.maxDrawdownPct));
      setRiskPerTradePct(String(limits.riskPerTradePct));
      setMaxTradesPerDay(String(limits.maxTradesPerDay));
    }
  }

  function toggleMarket(market: string) {
    setPrimaryMarkets((prev) =>
      prev.includes(market)
        ? prev.filter((m) => m !== market)
        : [...prev, market]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (primaryMarkets.length === 0) {
      setError("Select at least one market");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/trader-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType,
          tradingStyle,
          primaryMarkets,
          propFirmPreset,
          dailyLossLimitPct: Number(dailyLossLimitPct),
          maxDrawdownPct: Number(maxDrawdownPct),
          riskPerTradePct: Number(riskPerTradePct),
          maxTradesPerDay: Number(maxTradesPerDay),
          strictPreTradeGate,
          timezone,
          profileComplete: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save profile");
        return;
      }

      if (data.user) setUser(data.user);

      if (mode === "onboarding") {
        router.refresh();
        router.push("/dashboard");
      } else {
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20">
        <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
        <span className="font-mono text-sm text-slate-500">Loading profile…</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <h1 className="font-mono text-3xl font-bold text-slate-100">
          {mode === "onboarding" ? (
            <>
              Build Your <span className="text-cyan-terminal">Trader Profile</span>
            </>
          ) : (
            "Trader Profile"
          )}
        </h1>
        <p className="mx-auto mt-3 max-w-xl font-mono text-sm text-slate-500">
          Risk limits power Prop Command Center, pre-trade gates, and journal
          analytics. Tune once — trade with discipline.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-slate-400">
            Trading context
          </h3>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Account type"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            options={ACCOUNT_TYPES.map((t) => ({ value: t.id, label: t.label }))}
          />
          <Select
            label="Trading style"
            value={tradingStyle}
            onChange={(e) => setTradingStyle(e.target.value)}
            options={TRADING_STYLES.map((t) => ({
              value: t.id,
              label: t.label,
            }))}
          />
          <Select
            label="Your timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            options={TRADER_TIMEZONES.map((tz) => ({
              value: tz.value,
              label: tz.label,
            }))}
          />
          <p className="sm:col-span-2 text-xs text-slate-500">
            Session edge and journal times display in this timezone. FX session
            classification stays UTC-based.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-slate-400">
            Primary markets
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {MARKET_OPTIONS.map((market) => {
              const active = primaryMarkets.includes(market);
              return (
                <button
                  key={market}
                  type="button"
                  onClick={() => toggleMarket(market)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all",
                    active
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                      : "border-slate-700 text-slate-500 hover:border-slate-600"
                  )}
                >
                  {market}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-400" />
            <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-slate-400">
              Risk & prop rules
            </h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {PROP_FIRM_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left transition-all",
                  propFirmPreset === preset.id
                    ? "border-cyan-500/40 bg-cyan-500/10"
                    : "border-slate-800 hover:border-slate-600"
                )}
              >
                <p className="font-mono text-xs font-semibold text-slate-200">
                  {preset.name}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Daily loss limit (%)"
              type="number"
              min="1"
              max="20"
              step="0.5"
              value={dailyLossLimitPct}
              onChange={(e) => setDailyLossLimitPct(e.target.value)}
            />
            <Input
              label="Max drawdown (%)"
              type="number"
              min="2"
              max="30"
              step="0.5"
              value={maxDrawdownPct}
              onChange={(e) => setMaxDrawdownPct(e.target.value)}
            />
            <Input
              label="Risk per trade (%)"
              type="number"
              min="0.1"
              max="5"
              step="0.1"
              value={riskPerTradePct}
              onChange={(e) => setRiskPerTradePct(e.target.value)}
            />
            <Input
              label="Max trades per day"
              type="number"
              min="1"
              max="50"
              value={maxTradesPerDay}
              onChange={(e) => setMaxTradesPerDay(e.target.value)}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-800/60 bg-slate-900/40 px-4 py-3">
            <input
              type="checkbox"
              checked={strictPreTradeGate}
              onChange={(e) => setStrictPreTradeGate(e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-obsidian-800 text-cyan-500"
            />
            <div>
              <p className="font-mono text-sm text-slate-200">
                Strict pre-trade gate
              </p>
              <p className="text-xs text-slate-500">
                Block or require acknowledgment before manual orders when limits
                are breached.
              </p>
            </div>
          </label>
        </CardContent>
      </Card>

      {error && (
        <p className="rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-center font-mono text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col items-center gap-3">
        <Button type="submit" variant="primary" size="lg" disabled={saving}>
          {saving
            ? "Saving…"
            : mode === "onboarding"
              ? "Save & Enter Dashboard"
              : "Save Profile"}
        </Button>
        {mode === "onboarding" && (
          <Badge variant="success">Step 2 of 2 — after tier selection</Badge>
        )}
      </div>
    </form>
  );
}