import { HARD_FLAT_RECOMMENDATION } from "@/lib/e8-partner";
import { cn } from "@/lib/utils";

export function HardFlatRecommendation({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const copy = HARD_FLAT_RECOMMENDATION;
  return (
    <div
      className={cn(
        "rounded-[6px] border border-[rgba(199,170,255,0.18)] bg-[#12081A] px-4 py-3",
        className
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89BB8]">
        {copy.title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[#F5F3FA]">{copy.lead}</p>
      {!compact && (
        <>
          <p className="mt-2 text-sm leading-relaxed text-[#C9C2D6]">{copy.buffer}</p>
          <p className="mt-2 text-xs leading-relaxed text-[#C9C2D6]">{copy.caveat}</p>
        </>
      )}
      {compact && (
        <p className="mt-2 text-xs leading-relaxed text-[#C9C2D6]">
          {copy.buffer} {copy.caveat}
        </p>
      )}
    </div>
  );
}
