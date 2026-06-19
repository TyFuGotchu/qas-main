import { DrawdownMatrix } from "@/components/tools/DrawdownMatrix";

export default function DrawdownMatrixPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono text-2xl font-bold text-slate-200">
          Prop Firm Drawdown Matrix & Simulator
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          Calculate mathematical breach risk against challenge rules
        </p>
      </div>
      <DrawdownMatrix />
    </div>
  );
}