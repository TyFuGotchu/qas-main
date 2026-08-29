import { E8_COMPLIANCE_BLOCK } from "@/lib/e8-partner";

export function E8ComplianceNote({ className }: { className?: string }) {
  return (
    <p className={className ?? "mt-6 font-mono text-[11px] leading-relaxed text-slate-500"}>
      {E8_COMPLIANCE_BLOCK}
    </p>
  );
}
