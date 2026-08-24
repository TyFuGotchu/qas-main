import Link from "next/link";
import { Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";

function safeReturnPath(path?: string): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/tools";
  return path;
}

export function AccountRequiredPanel({
  title,
  returnTo,
}: {
  title: string;
  returnTo?: string;
}) {
  const next = safeReturnPath(returnTo);
  const q = `?redirect=${encodeURIComponent(next)}`;

  return (
    <GlassPanel className="border-cyan-accent/30 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-accent/30 bg-cyan-accent/10">
        <Lock className="h-5 w-5 text-cyan-accent" />
      </div>
      <h3 className="mt-4 font-mono text-lg font-bold text-slate-100">
        Create a free account to use {title}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
        Planning engines and interactive demos require a Quicksilver profile. Marketing
        pages stay public — the calculator itself does not.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href={`/register${q}`}>
          <Button variant="primary">Create Profile</Button>
        </Link>
        <Link href={`/login${q}`}>
          <Button variant="secondary">Login</Button>
        </Link>
      </div>
    </GlassPanel>
  );
}
