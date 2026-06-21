"use client";

import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  label: string;
  grade?: string;
  size?: "sm" | "lg";
}

export function ScoreRing({ score, label, grade, size = "lg" }: ScoreRingProps) {
  const dim = size === "lg" ? 140 : 96;
  const stroke = size === "lg" ? 10 : 7;
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? "text-emerald-400"
      : score >= 60
      ? "text-cyan-accent"
      : score >= 40
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="rgba(148,163,184,0.15)"
            strokeWidth={stroke}
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn("transition-all duration-700", color)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-mono font-bold", color, size === "lg" ? "text-3xl" : "text-xl")}>
            {score}
          </span>
          {grade && (
            <span className="font-mono text-xs text-slate-500">{grade}</span>
          )}
        </div>
      </div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">
        {label}
      </p>
    </div>
  );
}