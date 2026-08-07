"use client";

import { useState } from "react";

export function CopyBlock({
  label,
  text,
  mono = true,
}: {
  label?: string;
  text: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-800/70 bg-slate-950/50">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/60 px-4 py-2">
        {label ? (
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            {label}
          </p>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={copy}
          className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-300 hover:bg-cyan-500/20"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className={`max-h-80 overflow-auto whitespace-pre-wrap px-4 py-3 text-sm leading-relaxed text-slate-300 ${
          mono ? "font-mono text-xs sm:text-sm" : ""
        }`}
      >
        {text}
      </pre>
    </div>
  );
}
