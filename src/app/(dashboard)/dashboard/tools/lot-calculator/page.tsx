import { LotCalculator } from "@/components/tools/LotCalculator";

export default function LotCalculatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono text-2xl font-bold text-slate-200">
          Lot-Size & Risk-to-Reward Calculator
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          Advanced execution sizing with spread and commission factors
        </p>
      </div>
      <LotCalculator />
    </div>
  );
}