/**
 * Optional standalone Railway worker service.
 * Run: npx tsx scripts/signal-worker.ts
 *
 * Use this if you deploy signals on a dedicated background service instead of
 * the Next.js instrumentation hook.
 */
import { startSignalEngine } from "../src/lib/signals/engine";

console.info("[signal-worker] Starting Quicksilver Pulse signal scanner…");
startSignalEngine();

process.on("SIGINT", () => {
  console.info("[signal-worker] Shutting down");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.info("[signal-worker] Shutting down");
  process.exit(0);
});