const INGEST_INTERVAL_MS =
  Number(process.env.EDGE_RADAR_INGEST_INTERVAL_MS) || 10 * 60 * 1000;
const STARTUP_DELAY_MS = Number(process.env.EDGE_RADAR_INGEST_STARTUP_DELAY_MS) || 20_000;

const globalForIngest = globalThis as unknown as {
  __qsEdgeRadarIngestStarted?: boolean;
  __qsEdgeRadarIngestRunning?: boolean;
  __qsEdgeRadarIngestTimer?: ReturnType<typeof setInterval>;
};

async function runIngestOnce(): Promise<void> {
  if (globalForIngest.__qsEdgeRadarIngestRunning) return;
  globalForIngest.__qsEdgeRadarIngestRunning = true;
  try {
    const { runEdgeRadarIngest } = await import("@/lib/edge-radar/ingest/run");
    const result = await runEdgeRadarIngest();
    console.info(
      `[edge-radar] ingest ok — +${result.newsInserted} news, +${result.alertsInserted} alerts, ${result.feedsPolled} feeds`
    );
    if (result.errors.length > 0) {
      console.warn(`[edge-radar] ingest errors (${result.errors.length}):`, result.errors.slice(0, 5));
    }
  } catch (err) {
    console.error("[edge-radar] ingest failed:", err);
  } finally {
    globalForIngest.__qsEdgeRadarIngestRunning = false;
  }
}

/** Poll RSS + odds on an interval so Railway stays fresh without a separate cron job. */
export function startEdgeRadarIngestScheduler(): void {
  if (process.env.EDGE_RADAR_INGEST_DISABLED === "true") return;
  if (globalForIngest.__qsEdgeRadarIngestStarted) return;
  globalForIngest.__qsEdgeRadarIngestStarted = true;

  setTimeout(() => {
    void runIngestOnce();
  }, STARTUP_DELAY_MS);

  globalForIngest.__qsEdgeRadarIngestTimer = setInterval(() => {
    void runIngestOnce();
  }, INGEST_INTERVAL_MS);

  console.info(
    `[edge-radar] ingest scheduler started (every ${Math.round(INGEST_INTERVAL_MS / 60_000)}m)`
  );
}