import { SessionVolatility } from "@/components/tools/SessionVolatility";

export default function SessionVolatilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono text-2xl font-bold text-slate-200">
          Market Session Volatility & Playbook Aggregator
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          London/NY overlap timeline with hourly ATR execution guidance
        </p>
      </div>
      <SessionVolatility />
    </div>
  );
}