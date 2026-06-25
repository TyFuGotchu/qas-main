"use client";

import { useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian-950 px-4">
      <div className="max-w-md text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-400" />
        <h1 className="mt-4 font-mono text-xl font-bold text-slate-200">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          We hit an unexpected error loading this page. Try again, or sign in
          from a fresh tab if you were creating a profile.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-[10px] text-slate-600">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="primary" onClick={() => reset()}>
            Try again
          </Button>
          <Link href="/login">
            <Button variant="ghost">Go to login</Button>
          </Link>
          <Link href="/register">
            <Button variant="ghost">Create profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}