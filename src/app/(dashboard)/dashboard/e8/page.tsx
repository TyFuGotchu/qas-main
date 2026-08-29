import { E8ExecutionCenter } from "@/components/e8/E8ExecutionCenter";
import { E8_OVERVIEW, E8_PARTNER_LINE, E8_POSITIONING } from "@/lib/e8-partner";

export default function DashboardE8Page() {
  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-indigo-300">
          {E8_PARTNER_LINE}
        </p>
        <h1 className="mt-2 font-mono text-2xl font-bold text-slate-100">
          {E8_OVERVIEW.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          {E8_POSITIONING}
        </p>
      </header>
      <E8ExecutionCenter variant="full" context="dashboard" />
    </div>
  );
}
