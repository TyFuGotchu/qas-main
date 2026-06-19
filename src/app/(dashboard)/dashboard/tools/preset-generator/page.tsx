import { PresetGenerator } from "@/components/tools/PresetGenerator";

export default function PresetGeneratorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono text-2xl font-bold text-slate-200">
          Automated Preset Generator
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          MQL5/Python configuration constructor
        </p>
      </div>
      <PresetGenerator />
    </div>
  );
}