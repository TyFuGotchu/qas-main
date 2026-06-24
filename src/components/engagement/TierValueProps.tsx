import { Check, Sparkles } from "lucide-react";
import { PRICING_TIERS } from "@/lib/pricing-tiers";

const PREMIUM_HIGHLIGHTS = [
  "All 89 lessons + prop firm playbook",
  "6 interactive QS Planning Modules",
  "Chart overlays & animated walkthroughs",
  "VIP Discord + live guidance",
  "Exportable scorecards & PNG reports",
];

export function TierValueProps({ compact = false }: { compact?: boolean }) {
  const premium = PRICING_TIERS.find((t) => t.recommended);

  if (compact) {
    return (
      <ul className="space-y-1.5">
        {PREMIUM_HIGHLIGHTS.slice(0, 3).map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-cyan-accent" />
        <p className="font-mono text-sm font-semibold text-slate-200">
          Premium — {premium?.price}
          {premium?.period}
        </p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {PREMIUM_HIGHLIGHTS.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}