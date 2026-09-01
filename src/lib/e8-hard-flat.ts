import { TRADELOCKER_LIVE_REFRESH_MS } from "@/lib/tradelocker/constants";
import {
  formatTradeLockerAccountLabel,
  resolveTradeLockerAccount,
  SELECTED_ACCOUNT_CHANGED_EVENT,
  SELECTED_ACCOUNT_STORAGE_KEY,
} from "@/lib/tradelocker/selected-account";
import type {
  TradeLockerAccount,
  TradeLockerDashboardData,
} from "@/lib/tradelocker/types";

export const HARD_FLAT_POLL_MS = TRADELOCKER_LIVE_REFRESH_MS;
export const HARD_FLAT_STALE_MS = 20_000;
export const HARD_FLAT_TIGHT_BUFFER_USD = 25;
export const HARD_FLAT_TIGHT_DAILY_FRACTION = 0.15;
export const HARD_FLAT_BUFFER_TIGHT_USD = 100;
export const HARD_FLAT_BUFFER_SAFE_USD = 200;
export const HARD_FLAT_STORAGE_KEY = "qs-e8-hard-flat";
export const E8_APPLIED_PRESET_KEY = "qs-e8-applied-preset";

export type HardFlatStatus =
  | "DISARMED"
  | "ARMED"
  | "TIGHT"
  | "TRIGGERED"
  | "ERROR";

export interface HardFlatState {
  armed: boolean;
  triggered: boolean;
  flattenFired: boolean;
  flattenConfirmed: boolean | null;
  floor: number | null;
  startingEquity: number | null;
  dailyRoom: number | null;
  lastEquity: number | null;
  lastFloat: number | null;
  lastGoodAt: number | null;
  pollError: string | null;
  flattenError: string | null;
  accountLabel: string | null;
  accountId: string | null;
  accNum: string | null;
  accounts: TradeLockerAccount[];
  tlConnected: boolean;
  positionsClosed: number | null;
  lastTriggerAt: string | null;
  testNote: string | null;
}

export interface HardFlatView extends HardFlatState {
  status: HardFlatStatus;
  distance: number | null;
  distancePct: number | null;
  quoteFresh: boolean;
  quoteAgeMs: number | null;
}

export interface AppliedE8Preset {
  presetId?: string;
  equity?: number;
  dailyPct?: number;
  ddPct?: number;
}

export interface FlattenResult {
  confirmed: boolean;
  closed: number;
  failed: number;
  remaining: number;
  errors: string[];
}

const DEFAULT_STATE: HardFlatState = {
  armed: false,
  triggered: false,
  flattenFired: false,
  flattenConfirmed: null,
  floor: null,
  startingEquity: null,
  dailyRoom: null,
  lastEquity: null,
  lastFloat: null,
  lastGoodAt: null,
  pollError: null,
  flattenError: null,
  accountLabel: null,
  accountId: null,
  accNum: null,
  accounts: [],
  tlConnected: false,
  positionsClosed: null,
  lastTriggerAt: null,
  testNote: null,
};

const listeners = new Set<() => void>();
let state: HardFlatState = { ...DEFAULT_STATE };
let hydrated = false;
let flattenInFlight = false;
let engineCount = 0;
let engineTimer: ReturnType<typeof setInterval> | null = null;
let tickInFlight = false;

function emit() {
  listeners.forEach((fn) => fn());
}

function persistArm() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      HARD_FLAT_STORAGE_KEY,
      JSON.stringify({
        armed: state.armed,
        triggered: state.triggered,
        flattenFired: state.flattenFired,
        flattenConfirmed: state.flattenConfirmed,
        floor: state.floor,
        startingEquity: state.startingEquity,
        dailyRoom: state.dailyRoom,
        positionsClosed: state.positionsClosed,
        lastTriggerAt: state.lastTriggerAt,
        flattenError: state.flattenError,
      })
    );
  } catch {
    // storage blocked
  }
}

export function hydrateHardFlat() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = sessionStorage.getItem(HARD_FLAT_STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as Partial<HardFlatState>;
    state = {
      ...state,
      armed: Boolean(saved.armed),
      triggered: Boolean(saved.triggered),
      flattenFired: Boolean(saved.flattenFired),
      flattenConfirmed:
        saved.flattenConfirmed === true
          ? true
          : saved.flattenConfirmed === false
            ? false
            : null,
      floor: typeof saved.floor === "number" ? saved.floor : null,
      startingEquity:
        typeof saved.startingEquity === "number" ? saved.startingEquity : null,
      dailyRoom: typeof saved.dailyRoom === "number" ? saved.dailyRoom : null,
      positionsClosed:
        typeof saved.positionsClosed === "number" ? saved.positionsClosed : null,
      lastTriggerAt:
        typeof saved.lastTriggerAt === "string" ? saved.lastTriggerAt : null,
      flattenError:
        typeof saved.flattenError === "string" ? saved.flattenError : null,
    };
  } catch {
    // ignore corrupt storage
  }
}

export function getHardFlatState(): HardFlatState {
  return state;
}

export function subscribeHardFlat(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function patchHardFlat(patch: Partial<HardFlatState>) {
  state = { ...state, ...patch };
  persistArm();
  emit();
}

export function isQuoteFresh(lastGoodAt: number | null, now = Date.now()): boolean {
  if (lastGoodAt == null) return false;
  return now - lastGoodAt <= HARD_FLAT_STALE_MS;
}

export function readAppliedPreset(): AppliedE8Preset | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(E8_APPLIED_PRESET_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppliedE8Preset;
  } catch {
    return null;
  }
}

export function resolveE8DrawdownLimit(startingEquity: number): {
  dailyPct: number;
  ddPct: number;
  dailyLimit: number;
  maxDdLimit: number;
  e8Limit: number;
} {
  const applied = readAppliedPreset();
  const start = startingEquity > 0 ? startingEquity : 0;
  const dailyPct =
    applied && typeof applied.dailyPct === "number" && applied.dailyPct > 0
      ? applied.dailyPct
      : 4;
  const ddPct =
    applied && typeof applied.ddPct === "number" && applied.ddPct > 0
      ? applied.ddPct
      : 8;
  const dailyLimit = start > 0 ? roundMoney(start * (1 - dailyPct / 100)) : 0;
  const maxDdLimit = start > 0 ? roundMoney(start * (1 - ddPct / 100)) : 0;
  return {
    dailyPct,
    ddPct,
    dailyLimit,
    maxDdLimit,
    e8Limit: roundMoney(Math.max(dailyLimit, maxDdLimit)),
  };
}

export function recommendedFloor(e8Limit: number, bufferUsd: number): number {
  return roundMoney(e8Limit + bufferUsd);
}

export function prefillFloor(currentEquity: number, startingEquity: number): number {
  const start = startingEquity > 0 ? startingEquity : currentEquity;
  const { e8Limit } = resolveE8DrawdownLimit(start);
  if (e8Limit > 0) {
    return recommendedFloor(e8Limit, HARD_FLAT_BUFFER_SAFE_USD);
  }
  if (currentEquity > 0) {
    return roundMoney(currentEquity * 0.96 + HARD_FLAT_BUFFER_SAFE_USD);
  }
  return 0;
}

export function floorFromPct(startingEquity: number, pctOfStart: number): number {
  return roundMoney(startingEquity * (pctOfStart / 100));
}

export function pctFromFloor(startingEquity: number, floor: number): number {
  if (startingEquity <= 0) return 0;
  return roundMoney((floor / startingEquity) * 100);
}

function isTight(distance: number, snapshot: HardFlatState): boolean {
  if (distance <= 0) return false;
  const dailyRoom =
    snapshot.dailyRoom != null && snapshot.dailyRoom > 0
      ? snapshot.dailyRoom
      : snapshot.startingEquity != null && snapshot.floor != null
        ? Math.max(0, snapshot.startingEquity - snapshot.floor)
        : null;
  const tightLine =
    dailyRoom != null && dailyRoom > 0
      ? Math.max(HARD_FLAT_TIGHT_BUFFER_USD, dailyRoom * HARD_FLAT_TIGHT_DAILY_FRACTION)
      : HARD_FLAT_TIGHT_BUFFER_USD;
  return distance <= tightLine;
}

export function deriveHardFlatStatus(
  snapshot: HardFlatState,
  now = Date.now()
): HardFlatStatus {
  if (snapshot.flattenError) return "ERROR";
  if (snapshot.triggered && !snapshot.armed) {
    return snapshot.flattenConfirmed === false ? "ERROR" : "TRIGGERED";
  }
  if (snapshot.pollError) return "ERROR";
  if (!snapshot.armed) return "DISARMED";
  if (!isQuoteFresh(snapshot.lastGoodAt, now)) return "ERROR";
  const equity = snapshot.lastEquity;
  const floor = snapshot.floor;
  if (equity != null && floor != null) {
    const distance = equity - floor;
    if (distance <= 0) return "TRIGGERED";
    if (isTight(distance, snapshot)) return "TIGHT";
  }
  return "ARMED";
}

export function getHardFlatView(now = Date.now()): HardFlatView {
  const snapshot = state;
  const distance =
    snapshot.lastEquity != null && snapshot.floor != null
      ? snapshot.lastEquity - snapshot.floor
      : null;
  const distancePct =
    distance != null && snapshot.lastEquity != null && snapshot.lastEquity !== 0
      ? (distance / snapshot.lastEquity) * 100
      : null;
  const quoteAgeMs =
    snapshot.lastGoodAt != null ? now - snapshot.lastGoodAt : null;
  return {
    ...snapshot,
    status: deriveHardFlatStatus(snapshot, now),
    distance,
    distancePct,
    quoteFresh: isQuoteFresh(snapshot.lastGoodAt, now),
    quoteAgeMs,
  };
}

export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function writeHardFlatJournal(
  event: "ARMED" | "DISARMED" | "TRIGGERED",
  note: string
): Promise<boolean> {
  try {
    const res = await fetch("/api/journal", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: "HARD-FLAT",
        direction: "long",
        entryTime: new Date().toISOString(),
        setupType: "E8-HARD-FLAT",
        notes: note,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function armHardFlat(input: {
  floor: number;
  startingEquity: number;
  dailyRoom: number | null;
  confirmed: boolean;
}): { ok: boolean; error?: string } {
  hydrateHardFlat();
  const view = getHardFlatView();
  if (!input.confirmed) {
    return { ok: false, error: "Confirm that flatten will close open positions if the floor is hit." };
  }
  if (!Number.isFinite(input.floor) || input.floor <= 0) {
    return { ok: false, error: "Set an equity floor greater than zero." };
  }
  if (view.lastEquity == null) {
    return { ok: false, error: "No live equity yet. Connect TradeLocker and wait for a refresh." };
  }
  if (view.pollError) {
    return { ok: false, error: "TradeLocker data error. Retry before arming." };
  }
  if (!view.quoteFresh) {
    return { ok: false, error: "Quote is stale. Wait for a fresh TradeLocker refresh before arming." };
  }
  if (input.floor >= view.lastEquity) {
    return { ok: false, error: "Floor must be below current equity." };
  }
  if (!view.tlConnected || !view.accountId || !view.accNum) {
    return { ok: false, error: "Connect a TradeLocker account before arming." };
  }

  patchHardFlat({
    armed: true,
    triggered: false,
    flattenFired: false,
    flattenConfirmed: null,
    flattenError: null,
    floor: roundMoney(input.floor),
    startingEquity: roundMoney(input.startingEquity),
    dailyRoom: input.dailyRoom,
    positionsClosed: null,
    lastTriggerAt: null,
    testNote: null,
  });

  void writeHardFlatJournal(
    "ARMED",
    `HARD-FLAT ARMED. Floor $${roundMoney(input.floor)}. Equity $${view.lastEquity}. ${new Date().toISOString()}. Software guardrail. Trader still supervises.`
  );

  return { ok: true };
}

export function disarmHardFlat(): void {
  hydrateHardFlat();
  const shouldJournal = state.armed || state.triggered;
  patchHardFlat({
    armed: false,
    triggered: false,
    flattenFired: false,
    flattenError: null,
    testNote: null,
  });
  if (shouldJournal) {
    void writeHardFlatJournal(
      "DISARMED",
      `HARD-FLAT DISARMED. ${new Date().toISOString()}.`
    );
  }
}

export function testHardFlatCalculation(input?: {
  floor: number;
  startingEquity: number;
}): string {
  const view = getHardFlatView();
  const floor = input?.floor ?? view.floor;
  const equity = view.lastEquity;
  const distance =
    equity != null && floor != null ? roundMoney(equity - floor) : null;
  const distancePct =
    distance != null && equity ? roundMoney((distance / equity) * 100) : null;
  const wouldTrigger =
    equity != null && floor != null && equity <= floor && view.quoteFresh;
  const parts = [
    `TEST CALCULATION (no orders).`,
    equity != null ? `Equity $${roundMoney(equity)}.` : "No equity.",
    view.lastFloat != null ? `Float $${roundMoney(view.lastFloat)}.` : "No float.",
    floor != null ? `Floor $${roundMoney(floor)}.` : "No floor set.",
    distance != null ? `Distance $${distance}.` : "",
    distancePct != null ? `${distancePct}% of equity.` : "",
    `Quote ${view.quoteFresh ? "fresh" : "stale — would not flatten"}.`,
    wouldTrigger ? "Would trigger flatten if armed." : "Would not trigger.",
  ];
  const note = parts.filter(Boolean).join(" ");
  patchHardFlat({ testNote: note });
  return note;
}

export async function requestFlatten(
  accountId: string,
  accNum: string
): Promise<FlattenResult> {
  const res = await fetch("/api/tradelocker/flatten", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountId, accNum }),
  });
  const data = (await res.json().catch(() => ({}))) as Partial<FlattenResult> & {
    error?: string;
  };
  if (!res.ok) {
    return {
      confirmed: false,
      closed: Number(data.closed) || 0,
      failed: Number(data.failed) || 0,
      remaining: Number(data.remaining) || 0,
      errors: [data.error ?? "Flatten not confirmed, check TradeLocker"],
    };
  }
  return {
    confirmed: data.confirmed === true,
    closed: Number(data.closed) || 0,
    failed: Number(data.failed) || 0,
    remaining: Number(data.remaining) || 0,
    errors: Array.isArray(data.errors) ? data.errors.map(String) : [],
  };
}

async function fireFlattenOnce(equity: number, floor: number) {
  if (flattenInFlight || state.flattenFired) return;
  flattenInFlight = true;
  patchHardFlat({ flattenFired: true });

  const accountId = state.accountId;
  const accNum = state.accNum;
  if (!accountId || !accNum) {
    patchHardFlat({
      armed: false,
      triggered: true,
      flattenConfirmed: false,
      flattenError: "ERROR: flatten not confirmed, check TradeLocker",
      lastTriggerAt: new Date().toISOString(),
    });
    flattenInFlight = false;
    return;
  }

  try {
    const result = await requestFlatten(accountId, accNum);
    const confirmed = result.confirmed === true;
    patchHardFlat({
      armed: false,
      triggered: true,
      flattenConfirmed: confirmed,
      flattenError: confirmed
        ? null
        : "ERROR: flatten not confirmed, check TradeLocker",
      positionsClosed: result.closed,
      lastTriggerAt: new Date().toISOString(),
    });
    void writeHardFlatJournal(
      "TRIGGERED",
      `HARD-FLAT TRIGGERED. Equity $${roundMoney(equity)}. Floor $${roundMoney(floor)}. Positions closed: ${result.closed}. Confirmed: ${confirmed ? "yes" : "no"}. ${new Date().toISOString()}.`
    );
  } catch {
    patchHardFlat({
      armed: false,
      triggered: true,
      flattenConfirmed: false,
      flattenError: "ERROR: flatten not confirmed, check TradeLocker",
      lastTriggerAt: new Date().toISOString(),
    });
    void writeHardFlatJournal(
      "TRIGGERED",
      `HARD-FLAT TRIGGERED. Equity $${roundMoney(equity)}. Floor $${roundMoney(floor)}. Flatten not confirmed. ${new Date().toISOString()}.`
    );
  } finally {
    flattenInFlight = false;
  }
}

async function loadTick(): Promise<void> {
  try {
    const statusRes = await fetch("/api/tradelocker/status", {
      credentials: "include",
    });
    if (!statusRes.ok) {
      patchHardFlat({
        pollError: "TradeLocker status unavailable",
        tlConnected: false,
      });
      return;
    }

    const status = await statusRes.json();
    const connected = Boolean(status.connected);
    if (!connected) {
      patchHardFlat({
        tlConnected: false,
        pollError: state.armed ? "TradeLocker disconnected" : null,
        accounts: [],
        accountLabel: null,
        accountId: null,
        accNum: null,
      });
      return;
    }

    const accountsRes = await fetch("/api/tradelocker/accounts", {
      credentials: "include",
    });
    if (!accountsRes.ok) {
      patchHardFlat({
        tlConnected: accountsRes.status !== 401,
        pollError: "Failed to load TradeLocker accounts",
      });
      return;
    }

    const { accounts } = (await accountsRes.json()) as {
      accounts?: TradeLockerAccount[];
    };
    const list = accounts ?? [];
    const account = resolveTradeLockerAccount(list);
    if (!account) {
      patchHardFlat({
        tlConnected: true,
        accounts: list,
        pollError: "No TradeLocker account selected",
        accountLabel: null,
        accountId: null,
        accNum: null,
      });
      return;
    }

    const params = new URLSearchParams({
      accountId: account.accountId,
      accNum: account.accNum,
    });
    const dashRes = await fetch(`/api/tradelocker/dashboard?${params}`, {
      credentials: "include",
    });
    if (!dashRes.ok) {
      patchHardFlat({
        tlConnected: dashRes.status !== 401,
        accounts: list,
        accountId: account.accountId,
        accNum: account.accNum,
        accountLabel: formatTradeLockerAccountLabel(account),
        pollError: "Failed to load account dashboard",
      });
      return;
    }

    const dash = (await dashRes.json()) as TradeLockerDashboardData;
    const equity = roundMoney(
      (dash.metrics?.balance ?? 0) + (dash.metrics?.openNetPnL ?? 0)
    );
    const floatPnl = roundMoney(dash.metrics?.openNetPnL ?? 0);
    const emptyQuote =
      equity === 0 &&
      floatPnl === 0 &&
      (dash.metrics?.balance ?? 0) === 0 &&
      (dash.positions?.length ?? 0) === 0 &&
      (dash.metrics?.openPositionsCount ?? 0) === 0;
    if (emptyQuote && state.lastEquity != null && state.lastEquity > 0) {
      patchHardFlat({
        tlConnected: true,
        accounts: list,
        accountId: account.accountId,
        accNum: account.accNum,
        accountLabel: formatTradeLockerAccountLabel(account),
        pollError: "TradeLocker returned empty equity. Last good values held.",
      });
      return;
    }

    patchHardFlat({
      tlConnected: true,
      accounts: list,
      accountId: account.accountId,
      accNum: account.accNum,
      accountLabel: formatTradeLockerAccountLabel(account),
      lastEquity: equity,
      lastFloat: floatPnl,
      lastGoodAt: Date.now(),
      pollError: null,
    });

    const next = getHardFlatState();
    if (
      next.armed &&
      !next.flattenFired &&
      next.floor != null &&
      isQuoteFresh(next.lastGoodAt) &&
      equity <= next.floor
    ) {
      await fireFlattenOnce(equity, next.floor);
    }
  } catch {
    patchHardFlat({
      pollError: "Network error loading TradeLocker data",
    });
  }
}

async function runTick() {
  if (tickInFlight) return;
  tickInFlight = true;
  try {
    await loadTick();
  } finally {
    tickInFlight = false;
  }
}

let onAccountChanged: (() => void) | null = null;
let onStorageChanged: ((event: StorageEvent) => void) | null = null;
let onVisibility: (() => void) | null = null;

function bindEngineListeners() {
  if (typeof window === "undefined" || onAccountChanged) return;
  onAccountChanged = () => {
    void runTick();
  };
  onStorageChanged = (event: StorageEvent) => {
    if (event.key === SELECTED_ACCOUNT_STORAGE_KEY) void runTick();
  };
  onVisibility = () => {
    if (document.visibilityState === "visible") void runTick();
  };
  window.addEventListener(SELECTED_ACCOUNT_CHANGED_EVENT, onAccountChanged);
  window.addEventListener("storage", onStorageChanged);
  document.addEventListener("visibilitychange", onVisibility);
}

function unbindEngineListeners() {
  if (typeof window === "undefined") return;
  if (onAccountChanged) {
    window.removeEventListener(SELECTED_ACCOUNT_CHANGED_EVENT, onAccountChanged);
  }
  if (onStorageChanged) {
    window.removeEventListener("storage", onStorageChanged);
  }
  if (onVisibility) {
    document.removeEventListener("visibilitychange", onVisibility);
  }
  onAccountChanged = null;
  onStorageChanged = null;
  onVisibility = null;
}

export function startHardFlatEngine(): () => void {
  if (typeof window === "undefined") return () => undefined;
  hydrateHardFlat();
  engineCount += 1;
  if (engineCount === 1) {
    void runTick();
    engineTimer = setInterval(() => {
      void runTick();
    }, HARD_FLAT_POLL_MS);
    bindEngineListeners();
  }

  return () => {
    engineCount = Math.max(0, engineCount - 1);
    if (engineCount === 0) {
      if (engineTimer) {
        clearInterval(engineTimer);
        engineTimer = null;
      }
      unbindEngineListeners();
    }
  };
}

export function retryHardFlatTick() {
  void runTick();
}
