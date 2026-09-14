"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TOURNAMENT } from "@/lib/tournaments";

const STORAGE_KEY = "qs-tournament-banner-298434";

export function TournamentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-[#0B0D12] px-4 py-2 sm:px-6">
      <p className="text-xs leading-relaxed text-[#F5F3FA] sm:text-sm">
        {TOURNAMENT.banner}{" "}
        <Link href="/tournaments" className="font-medium text-[#7FE7DC] hover:underline">
          Open tournaments
        </Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[#9AA3B2] hover:text-white"
        aria-label="Dismiss tournament banner"
      >
        Dismiss
      </button>
    </div>
  );
}
