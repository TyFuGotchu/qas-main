import { E8ExecutionCenter } from "@/components/e8/E8ExecutionCenter";
import { E8_OVERVIEW, E8_PARTNER_LINE, E8_POSITIONING } from "@/lib/e8-partner";

export default function DashboardE8Page() {
  return (
    <div className="e8-desk space-y-6 rounded-[8px] p-5 sm:p-6">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-[4px] border border-[#B7B0D4]/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#B7B0D4]">
            {E8_PARTNER_LINE}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#F5F3FA]">
          {E8_OVERVIEW.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#C9C2D6]">
          {E8_POSITIONING}
        </p>
      </header>
      <E8ExecutionCenter variant="full" context="dashboard" />
    </div>
  );
}
