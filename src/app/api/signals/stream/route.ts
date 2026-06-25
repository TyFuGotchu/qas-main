import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { getSession } from "@/lib/auth";
import { canAccessBot } from "@/lib/tiers";
import { MARKET_SYMBOLS } from "@/lib/market-data/symbols";
import type { MarketSymbol } from "@/lib/market-data/types";
import { startSignalEngine } from "@/lib/signals/engine";
import {
  getActiveSignals,
  getMarketState,
  subscribeToSignals,
} from "@/lib/signals/store";
import type { SignalStreamEvent } from "@/lib/signals/types";

function parseAsset(value: string | null): MarketSymbol | null {
  if (!value) return null;
  const upper = value.toUpperCase() as MarketSymbol;
  return MARKET_SYMBOLS.includes(upper) ? upper : null;
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!canAccessBot(session.subscriptionTier)) {
    return new Response("Premium required", { status: 403 });
  }

  startSignalEngine();

  const asset = parseAsset(request.nextUrl.searchParams.get("asset"));
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: SignalStreamEvent) => {
        if (asset) {
          if (event.type === "signal" || event.type === "signal_update") {
            if (event.signal.asset !== asset) return;
          }
          if (event.type === "market_state" && event.state.asset !== asset) {
            return;
          }
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
        );
      };

      send({
        type: "connected",
        signals: getActiveSignals(asset ?? undefined),
        marketState: asset ? getMarketState(asset) : null,
      });

      const unsubscribe = subscribeToSignals(send);

      const heartbeat = setInterval(() => {
        send({ type: "heartbeat", at: new Date().toISOString() });
      }, 30_000);

      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}