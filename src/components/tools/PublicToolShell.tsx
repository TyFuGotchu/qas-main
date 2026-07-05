import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools-registry";
import { isLocalToolDefinition } from "@/lib/tools-registry";
import { Badge } from "@/components/ui/Badge";
import { ToolLockedOverlay } from "@/components/tools/ToolLockedOverlay";
import { PremiumUpsellBanner } from "@/components/tools/LocalToolsPromo";
import { getFreshSession } from "@/lib/access-control";
import { checkResourceAccess } from "@/lib/accessControl";

interface PublicToolShellProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export async function PublicToolShell({ tool, children }: PublicToolShellProps) {
  const user = await getFreshSession();
  const access = checkResourceAccess(user?.subscriptionTier, "tool", tool.slug);
  const Icon = tool.icon;
  const isLocal = isLocalToolDefinition(tool);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/tools"
          className="mb-4 inline-flex items-center gap-1 font-mono text-xs text-slate-500 transition-colors hover:text-cyan-accent"
        >
          <ChevronLeft className="h-3 w-3" />
          All Local Tools
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-accent/30 bg-cyan-accent/10">
            <Icon className="h-6 w-6 text-cyan-accent" />
          </div>
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant="success">{tool.tag}</Badge>
              {isLocal ? (
                <Badge variant={access.allowed ? "success" : "warning"}>
                  {access.allowed ? "Included with Premium" : "Premium Required"}
                </Badge>
              ) : null}
            </div>
            <h1 className="font-mono text-2xl font-bold text-slate-100">{tool.name}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">{tool.desc}</p>
            {user ? (
              <Link
                href={tool.href}
                className="mt-3 inline-block font-mono text-xs text-cyan-accent hover:underline"
              >
                Open in dashboard →
              </Link>
            ) : (
              <Link
                href="/register"
                className="mt-3 inline-block font-mono text-xs text-cyan-accent hover:underline"
              >
                Create free account →
              </Link>
            )}
          </div>
        </div>
      </div>

      {!access.allowed ? (
        <ToolLockedOverlay
          tool={tool}
          requiredTier={access.requiredTier}
          userTier={access.userTier}
        />
      ) : (
        <div>{children}</div>
      )}

      {isLocal && !access.allowed ? <PremiumUpsellBanner /> : null}
    </div>
  );
}