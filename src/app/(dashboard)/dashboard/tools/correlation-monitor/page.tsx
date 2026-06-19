import { CorrelationMonitor } from "@/components/tools/CorrelationMonitor";

export default function CorrelationMonitorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono text-2xl font-bold text-slate-200">
          XAUUSD & Index Volatility Correlation Monitor
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          Dynamic correlation grid with systemic risk alerts
        </p>
      </div>
      <CorrelationMonitor />
    </div>
  );
}