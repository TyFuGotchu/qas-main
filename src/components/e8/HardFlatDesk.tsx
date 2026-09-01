"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { E8SignupButton } from "@/components/e8/E8SignupButton";
import { HardFlatRecommendation } from "@/components/e8/HardFlatRecommendation";
import Button from "@/components/ui/Button";
import { useHardFlat } from "@/hooks/useHardFlat";
import { HARD_FLAT_RECOMMENDATION } from "@/lib/e8-partner";
import {
  armHardFlat,
  disarmHardFlat,
  floorFromPct,
  HARD_FLAT_BUFFER_SAFE_USD,
  HARD_FLAT_BUFFER_TIGHT_USD,
  pctFromFloor,
  prefillFloor,
  readAppliedPreset,
  recommendedFloor,
  resolveE8DrawdownLimit,
  retryHardFlatTick,
  roundMoney,
  testHardFlatCalculation,
  type HardFlatStatus,
} from "@/lib/e8-hard-flat";
import { writeSelectedTradeLockerAccount } from "@/lib/tradelocker/selected-account";
import { cn } from "@/lib/utils";

export function HardFlatDesk() {
  const view = useHardFlat({ watch: true });
  const applied = useMemo(() => readAppliedPreset(), []);

  const [startingEquity, setStartingEquity] = useState("");
  const [floor, setFloor] = useState("");
  const [floorPct, setFloorPct] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [armError, setArmError] = useState("");
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (seeded) return;
    const live = view.lastEquity;
    const storedStart = view.startingEquity;
    const storedFloor = view.floor;
    if (storedStart != null && storedFloor != null) {
      setStartingEquity(String(storedStart));
      setFloor(String(storedFloor));
      setFloorPct(String(pctFromFloor(storedStart, storedFloor)));
      setSeeded(true);
      return;
    }
    if (live == null) return;
    const start = storedStart ?? live;
    const nextFloor = storedFloor ?? prefillFloor(live, start);
    setStartingEquity(String(roundMoney(start)));
    setFloor(String(nextFloor));
    setFloorPct(String(pctFromFloor(start, nextFloor)));
    setSeeded(true);
  }, [seeded, view.lastEquity, view.startingEquity, view.floor]);

  useEffect(() => {
    if (view.lastEquity == null || startingEquity) return;
    setStartingEquity(String(view.lastEquity));
  }, [view.lastEquity, startingEquity]);

  const locked = view.armed;
  const startNum = Number(startingEquity) || 0;
  const floorNum = Number(floor) || 0;
  const displayDistance =
    view.lastEquity != null && floorNum > 0
      ? roundMoney(view.lastEquity - floorNum)
      : null;
  const displayDistancePct =
    displayDistance != null && view.lastEquity
      ? roundMoney((displayDistance / view.lastEquity) * 100)
      : null;
  const e8Limits = resolveE8DrawdownLimit(startNum);
  const rec100 = e8Limits.e8Limit > 0
    ? recommendedFloor(e8Limits.e8Limit, HARD_FLAT_BUFFER_TIGHT_USD)
    : null;
  const rec200 = e8Limits.e8Limit > 0
    ? recommendedFloor(e8Limits.e8Limit, HARD_FLAT_BUFFER_SAFE_USD)
    : null;
  const dailyRoom =
    applied && typeof applied.dailyPct === "number" && applied.dailyPct > 0 && startNum > 0
      ? roundMoney(startNum * (applied.dailyPct / 100))
      : startNum > 0 && floorNum > 0
        ? roundMoney(Math.max(0, startNum - floorNum))
        : null;

  function onFloorChange(value: string) {
    setFloor(value);
    const n = Number(value);
    if (Number.isFinite(n) && startNum > 0) {
      setFloorPct(String(pctFromFloor(startNum, n)));
    }
  }

  function onPctChange(value: string) {
    setFloorPct(value);
    const n = Number(value);
    if (Number.isFinite(n) && startNum > 0) {
      setFloor(String(floorFromPct(startNum, n)));
    }
  }

  function onStartChange(value: string) {
    setStartingEquity(value);
    const start = Number(value) || 0;
    const pct = Number(floorPct);
    if (start > 0 && Number.isFinite(pct) && pct > 0) {
      setFloor(String(floorFromPct(start, pct)));
    }
  }

  function applyBuffer(bufferUsd: number) {
    if (locked || e8Limits.e8Limit <= 0) return;
    const next = recommendedFloor(e8Limits.e8Limit, bufferUsd);
    setFloor(String(next));
    if (startNum > 0) setFloorPct(String(pctFromFloor(startNum, next)));
  }

  function onArm() {
    setArmError("");
    const result = armHardFlat({
      floor: floorNum,
      startingEquity: startNum || view.lastEquity || 0,
      dailyRoom,
      confirmed: confirm,
    });
    if (!result.ok) setArmError(result.error ?? "Could not arm.");
  }

  function onAccountChange(value: string) {
    const account = view.accounts.find(
      (item) => `${item.accountId}:${item.accNum}` === value
    );
    if (!account) return;
    writeSelectedTradeLockerAccount({
      accountId: account.accountId,
      accNum: account.accNum,
    });
  }

  const selectedKey =
    view.accountId && view.accNum ? `${view.accountId}:${view.accNum}` : "";

  return (
    <div className="mt-5 space-y-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89BB8]">
          HARD-FLAT
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-[#F5F3FA]">
          Forced flatten at a desk-defined equity floor
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#F5F3FA]">
          Software guardrail. Trader still supervises.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#C9C2D6]">
          Hard equity-stop flatten is live. Forced flatten at the desk-defined
          equity floor. {HARD_FLAT_RECOMMENDATION.disclaimer}
        </p>
      </div>

      <HardFlatRecommendation />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#A89BB8]">
            Account / connection
          </span>
          {view.tlConnected && view.accounts.length > 0 ? (
            <select
              value={selectedKey}
              disabled={locked}
              onChange={(e) => onAccountChange(e.target.value)}
              className="mt-1 h-10 w-full rounded-[16px] border border-white/15 bg-[#07060C] px-3 text-sm text-white outline-none focus:border-[#7DFFC4] disabled:opacity-60"
            >
              {view.accounts.map((account) => (
                <option
                  key={`${account.accountId}:${account.accNum}`}
                  value={`${account.accountId}:${account.accNum}`}
                >
                  #{account.accountId}
                  {account.currency ? ` · ${account.currency}` : ""}
                  {account.name ? ` · ${account.name}` : ""}
                </option>
              ))}
            </select>
          ) : (
            <div className="mt-1 flex h-10 items-center rounded-[16px] border border-white/15 bg-[#07060C] px-3 text-sm text-[#C9C2D6]">
              {view.accountLabel ?? "No TradeLocker connection"}
            </div>
          )}
        </label>
        <Field
          label="Starting equity ($)"
          value={startingEquity}
          onChange={onStartChange}
          disabled={locked}
        />
        <Field
          label="Equity floor ($)"
          value={floor}
          onChange={onFloorChange}
          disabled={locked}
        />
        <Field
          label="Floor as % of starting equity"
          value={floorPct}
          onChange={onPctChange}
          disabled={locked}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat
          label="E8 limit $"
          value={e8Limits.e8Limit > 0 ? money(e8Limits.e8Limit) : "—"}
        />
        <Stat
          label={`Recommended floor (+$${HARD_FLAT_BUFFER_TIGHT_USD})`}
          value={rec100 != null ? money(rec100) : "—"}
        />
        <Stat
          label={`Recommended floor (+$${HARD_FLAT_BUFFER_SAFE_USD})`}
          value={rec200 != null ? money(rec200) : "—"}
        />
      </div>
      <p className="text-xs text-[#C9C2D6]">
        E8 limit is the nearer of daily {e8Limits.dailyPct}% and max DD {e8Limits.ddPct}%
        from starting equity. Floor = limit + buffer so flatten trips first.
      </p>
      <Button
        variant="e8Secondary"
        type="button"
        onClick={() => applyBuffer(HARD_FLAT_BUFFER_SAFE_USD)}
        disabled={locked || rec200 == null}
      >
        Use $200 buffer
      </Button>

      {!view.tlConnected && (
        <p className="text-xs text-[#C9C2D6]">
          Connect TradeLocker in{" "}
          <Link href="/dashboard/bot" className="text-[#E4D4FF] hover:text-white">
            Live Trading
          </Link>{" "}
          before arming. Near-live equity refreshes every few seconds.
        </p>
      )}

      <label className="flex items-start gap-3 rounded-[18px] border border-white/15 bg-[#0B0912] px-3 py-3">
        <input
          type="checkbox"
          checked={confirm}
          onChange={(e) => setConfirm(e.target.checked)}
          disabled={locked}
          className="mt-0.5 h-4 w-4 accent-[#7DFFC4]"
        />
        <span className="text-sm leading-relaxed text-[#F5F3FA]">
          I understand this will close open positions if the floor is hit.
        </span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat
          label="Current equity"
          value={view.lastEquity != null ? money(view.lastEquity) : "—"}
        />
        <Stat
          label="Current floating P&L"
          value={view.lastFloat != null ? money(view.lastFloat) : "—"}
        />
        <Stat
          label="Distance to floor $"
          value={displayDistance != null ? money(displayDistance) : "—"}
        />
        <Stat
          label="Distance to floor %"
          value={
            displayDistancePct != null ? `${displayDistancePct}%` : "—"
          }
        />
        <Stat
          label="Last refresh"
          value={
            view.lastGoodAt
              ? new Date(view.lastGoodAt).toLocaleTimeString()
              : "—"
          }
        />
        <StatusPill status={view.status} />
      </div>

      {view.pollError && (
        <p className="text-sm text-red-300">
          {view.pollError}. Showing last good values.{" "}
          <button
            type="button"
            onClick={() => retryHardFlatTick()}
            className="font-mono text-[#7DFFC4] hover:text-white"
          >
            Retry
          </button>
        </p>
      )}
      {view.flattenError && (
        <p className="text-sm text-red-300">{view.flattenError}</p>
      )}
      {armError && <p className="text-sm text-red-300">{armError}</p>}
      {view.testNote && (
        <p className="text-xs leading-relaxed text-[#C9C2D6]">{view.testNote}</p>
      )}
      {view.lastTriggerAt && view.triggered && (
        <p className="text-xs text-[#C9C2D6]">
          Last trigger {new Date(view.lastTriggerAt).toLocaleString()}
          {view.positionsClosed != null
            ? ` · positions closed ${view.positionsClosed}`
            : ""}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="e8" type="button" onClick={onArm} disabled={locked}>
          ARM
        </Button>
        <Button
          variant="e8Secondary"
          type="button"
          className="e8-btn-disarm"
          onClick={() => {
            setArmError("");
            disarmHardFlat();
          }}
        >
          DISARM
        </Button>
        <Button
          variant="e8Secondary"
          type="button"
          onClick={() =>
            testHardFlatCalculation({
              floor: floorNum,
              startingEquity: startNum,
            })
          }
        >
          TEST CALCULATION
        </Button>
        <E8SignupButton size="md" />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#A89BB8]">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-1 h-10 w-full rounded-[16px] border border-white/15 bg-[#07060C] px-3 text-sm text-white placeholder:text-[#C9C2D6] outline-none focus:border-[#7DFFC4] disabled:opacity-60"
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="e8-hud-card px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#C9C2D6]">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-[#F5F3FA]">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: HardFlatStatus }) {
  return (
    <div
      className={cn(
        "e8-hud-module px-3 py-2",
        status === "ARMED" && "e8-hud-module",
        status === "TIGHT" && "e8-hud-module--gold",
        (status === "TRIGGERED" || status === "ERROR") && "e8-hud-module--rose",
        status === "DISARMED" && "e8-hud-module--muted"
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#C9C2D6]">
        Status
      </p>
      <p
        className={cn(
          "mt-1 font-mono text-sm font-semibold tracking-[0.08em]",
          status === "DISARMED" && "text-[#C9C2D6]",
          status === "ARMED" && "text-[#7DFFC4]",
          status === "TIGHT" && "text-[#F5C84C]",
          status === "TRIGGERED" && "text-[#FF6B8A]",
          status === "ERROR" && "text-[#FF6B8A]"
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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
