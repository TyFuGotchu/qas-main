import { isLiveSignalsEnabled } from "@/lib/signals/feature";

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  if (isLiveSignalsEnabled()) {
    const { startSignalEngine } = await import("@/lib/signals/engine");
    startSignalEngine();
  }
}
