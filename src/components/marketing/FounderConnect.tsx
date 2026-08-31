import { FOUNDER } from "@/lib/founder-social";
import { FounderSocialIcons } from "@/components/marketing/FounderSocialIcons";

export function FounderConnect({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "text-center" : undefined}>
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#9AA3B2]">
        Founder
      </p>
      <p className="mt-1 text-sm font-medium tracking-tight text-[#F3F5F7]">{FOUNDER.legalName}</p>
      <p className="mt-0.5 text-xs text-[#9AA3B2]">{FOUNDER.company}</p>
      <FounderSocialIcons className={compact ? "mt-3 justify-center" : "mt-3"} />
    </div>
  );
}
