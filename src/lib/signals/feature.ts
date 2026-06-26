export function isLiveSignalsEnabled(): boolean {
  return process.env.ENABLE_LIVE_SIGNALS === "true";
}