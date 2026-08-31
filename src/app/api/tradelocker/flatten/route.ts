import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { autoLogTradeLockerClose } from "@/lib/journal/auto-log";
import {
  closePosition,
  fetchAccountState,
  fetchOpenPositions,
  fetchTradeConfig,
  TradeLockerApiError,
} from "@/lib/tradelocker/client";
import {
  parseAccountState,
  parsePositions,
} from "@/lib/tradelocker/parsers";
import type { PanelColumn } from "@/lib/tradelocker/types";
import {
  enforceRateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

const FLATTEN_LIMIT = 8;
const FLATTEN_WINDOW_MS = 60 * 1000;

function getColumns(
  config: unknown,
  key: "accountDetailsConfig" | "positionsConfig"
): PanelColumn[] {
  const columns =
    (config as { d?: Record<string, { columns?: PanelColumn[] }> })?.d?.[key]
      ?.columns ?? [];
  return Array.isArray(columns) ? columns : [];
}

async function loadPositions(accountId: string, accNum: string) {
  const [configRaw, stateRaw, positionsRaw] = await Promise.all([
    fetchTradeConfig(accNum),
    fetchAccountState(accountId, accNum),
    fetchOpenPositions(accountId, accNum),
  ]);
  const accountColumns = getColumns(configRaw, "accountDetailsConfig");
  const positionColumns = getColumns(configRaw, "positionsConfig");
  const stateValues =
    (stateRaw as { d?: { accountDetailsData?: number[] } })?.d
      ?.accountDetailsData ?? [];
  const state = parseAccountState(stateValues, accountColumns);
  const positionRows =
    (positionsRaw as { d?: { positions?: string[][] } })?.d?.positions ?? [];
  const positions = parsePositions(positionRows, positionColumns).filter(
    (position) => Boolean(position.id)
  );
  return { positions, balance: state.balance ?? 0 };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = enforceRateLimit(
      request,
      "tradelocker-flatten",
      FLATTEN_LIMIT,
      FLATTEN_WINDOW_MS
    );
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.retryAfterSeconds ?? 60);
    }

    const body = await request.json().catch(() => ({}));
    const accountId =
      typeof body.accountId === "string" ? body.accountId.trim() : "";
    const accNum = typeof body.accNum === "string" ? body.accNum.trim() : "";

    if (!accountId || !accNum) {
      return NextResponse.json(
        { error: "accountId and accNum are required" },
        { status: 400 }
      );
    }

    const initial = await loadPositions(accountId, accNum);
    if (initial.positions.length === 0) {
      return NextResponse.json({
        confirmed: true,
        closed: 0,
        failed: 0,
        remaining: 0,
        errors: [],
      });
    }

    let closed = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const position of initial.positions) {
      try {
        await closePosition(position.id, accNum, 0);
        closed += 1;
        try {
          await autoLogTradeLockerClose({
            userId: session.id,
            symbol: position.instrumentId || position.id,
            side: position.side,
            unrealizedPl: Number(position.unrealizedPl) || 0,
            qty: position.qty,
            balance: initial.balance,
          });
        } catch (autoLogError) {
          console.error("[tradelocker/flatten] auto-log failed:", autoLogError);
        }
      } catch (error) {
        failed += 1;
        const message =
          error instanceof TradeLockerApiError
            ? error.message
            : `Failed to close ${position.id}`;
        errors.push(message);
      }
    }

    const after = await loadPositions(accountId, accNum);
    const remaining = after.positions.length;
    const confirmed = failed === 0 && remaining === 0;

    return NextResponse.json({
      confirmed,
      closed,
      failed,
      remaining,
      errors,
    });
  } catch (error) {
    if (error instanceof TradeLockerApiError) {
      return NextResponse.json(
        {
          error: error.message,
          confirmed: false,
          closed: 0,
          failed: 0,
          remaining: 0,
        },
        { status: error.status }
      );
    }

    console.error("[tradelocker/flatten]", error);
    return NextResponse.json(
      {
        error: "Flatten not confirmed, check TradeLocker",
        confirmed: false,
        closed: 0,
        failed: 0,
        remaining: 0,
      },
      { status: 500 }
    );
  }
}
