import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools-registry";
import { Badge } from "@/components/ui/Badge";
import { ExportModuleButton } from "@/components/tools/ExportModuleButton";
import { ToolLockedOverlay } from "@/components/tools/ToolLockedOverlay";
import { getFreshSession } from "@/lib/access-control";
import { checkResourceAccess } from "@/lib/accessControl";
import { MANUAL_TRADING_DISCLAIMER, MANUAL_TRADING_SHORT } from "@/lib/quicksilver/disclaimer";

interface ToolPageShellProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export async function ToolPageShell({ tool, children }: ToolPageShellProps) {
  const user = await getFreshSession();
  const access = checkResourceAccess(
    user?.subscriptionTier,
    "tool",
    tool.slug
  );

  const Icon = tool.icon;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/tools"
          className="mb-4 inline-flex items-center gap-1 font-mono text-xs text-slate-500 transition-colors hover:text-cyan-accent"
        >
          <ChevronLeft className="h-3 w-3" />
          Back to Toolkit
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-accent/30 bg-cyan-accent/10 shadow-[0_0_20px_rgba(0,229,255,0.15)]">
            <Icon className="h-6 w-6 text-cyan-accent" />
          </div>
          <div className="min-w-0">
            <Badge variant="success" className="mb-2">
              {tool.tag}
            </Badge>
            <h2 className="font-mono text-xl font-bold text-slate-100 sm:text-2xl">
              {tool.name}
            </h2>
            <p className="mt-1 max-w-2xl font-mono text-sm text-slate-500">
              {tool.desc}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-slate-600">
              {MANUAL_TRADING_SHORT}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-slate-700/50 bg-slate-900/40 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-accent/70" />
        <p className="font-mono text-xs leading-relaxed text-slate-400">
          {MANUAL_TRADING_DISCLAIMER}
        </p>
      </div>

      {!access.allowed ? (
        <ToolLockedOverlay
          tool={tool}
          requiredTier={access.requiredTier}
          userTier={access.userTier}
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[10px] text-slate-600">
              Share manually — export adds a QuicksilverAlgo.com watermark
            </p>
            <ExportModuleButton filename={tool.slug} />
          </div>
          <div id="qs-module-export">{children}</div>
        </>
      )}
    </div>
  );
}