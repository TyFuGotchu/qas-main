import { Monitor } from "lucide-react";
import { QUANT_PROTOCOL } from "@/lib/trading-bots";
import { cn } from "@/lib/utils";

type Variant = "banner" | "compact";

/**
 * Clear notice: Quant Protocol requires TradeLocker Desktop, not the web platform.
 */
export function QuantProtocolDesktopNotice({
  variant = "banner",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <p
        className={cn(
          "rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 font-mono text-xs leading-relaxed text-amber-100/90",
          className
        )}
      >
        <span className="font-semibold text-amber-300">
          {QUANT_PROTOCOL.desktopRequiredTitle}:{" "}
        </span>
        {QUANT_PROTOCOL.desktopRequiredSummary}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-slate-950 p-4 sm:p-5",
        className
      )}
      role="note"
    >
      <div className="flex gap-3 sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10">
          <Monitor className="h-5 w-5 text-amber-400" />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-400/90">
            Important — before you request access
          </p>
          <h3 className="mt-1 font-mono text-sm font-semibold text-slate-100">
            {QUANT_PROTOCOL.desktopRequiredTitle}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {QUANT_PROTOCOL.desktopRequiredSummary}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            {QUANT_PROTOCOL.desktopRequiredDetail}
          </p>
        </div>
      </div>
    </div>
  );
}
