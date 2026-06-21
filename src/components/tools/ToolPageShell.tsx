import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools-registry";
import { Badge } from "@/components/ui/Badge";

interface ToolPageShellProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export function ToolPageShell({ tool, children }: ToolPageShellProps) {
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
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-accent/30 bg-cyan-accent/10 shadow-[0_0_20px_rgba(0,229,255,0.15)]">
            <Icon className="h-6 w-6 text-cyan-accent" />
          </div>
          <div>
            <Badge variant="success" className="mb-2">
              {tool.tag}
            </Badge>
            <h2 className="font-mono text-2xl font-bold text-slate-100">
              {tool.name}
            </h2>
            <p className="mt-1 max-w-2xl font-mono text-sm text-slate-500">
              {tool.desc}
            </p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}