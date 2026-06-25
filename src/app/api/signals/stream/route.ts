import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { getSession } from "@/lib/auth";
import { canAccessBot } from "@/lib/tiers";
import { startSignalEngine } from "@/lib/signals/engine";
import {
  getActiveSignals,
  subscribeToSignals,
} from "@/lib/signals/store";
import type { SignalStreamEvent } from "@/lib/signals/types";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!canAccessBot(session.subscriptionTier)) {
    return new Response("Premium required", { status: 403 });
  }

  startSignalEngine();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: SignalStreamEvent) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
        );
      };

      send({ type: "connected", signals: getActiveSignals() });

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