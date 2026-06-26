import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type FluxIntensity = "subtle" | "medium" | "hero";

interface QuicksilverFluxProps {
  intensity?: FluxIntensity;
  className?: string;
}

export function QuicksilverFlux({
  intensity = "medium",
  className,
}: QuicksilverFluxProps) {
  return (
    <div
      className={cn("qs-flux absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div className="qs-mercury-stream qs-mercury-stream-1" />
      <div className="qs-mercury-stream qs-mercury-stream-2" />
      <div className="qs-mercury-stream qs-mercury-stream-3" />

      <div
        className={cn(
          "qs-mercury-blob qs-mercury-blob-1",
          intensity === "subtle" && "opacity-40",
          intensity === "hero" && "opacity-90"
        )}
      />
      <div
        className={cn(
          "qs-mercury-blob qs-mercury-blob-2",
          intensity === "subtle" && "opacity-35",
          intensity === "hero" && "opacity-85"
        )}
      />
      {intensity !== "subtle" && (
        <div
          className={cn(
            "qs-mercury-blob qs-mercury-blob-3",
            intensity === "hero" && "opacity-80"
          )}
        />
      )}

      <svg
        className="qs-electric-svg absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="qs-electric-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="qs-electric-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(192,216,224,0)" />
            <stop offset="35%" stopColor="rgba(102,252,241,0.9)" />
            <stop offset="65%" stopColor="rgba(0,229,255,1)" />
            <stop offset="100%" stopColor="rgba(192,216,224,0)" />
          </linearGradient>
        </defs>
        <path
          className="qs-electric-path qs-electric-path-1"
          d="M-40 420 C 280 380, 420 520, 720 460 S 1180 340, 1480 400"
          stroke="url(#qs-electric-stroke)"
          strokeWidth="1.5"
          filter="url(#qs-electric-glow)"
        />
        <path
          className="qs-electric-path qs-electric-path-2"
          d="M-60 680 C 320 620, 540 740, 860 680 S 1240 580, 1500 640"
          stroke="url(#qs-electric-stroke)"
          strokeWidth="1"
          filter="url(#qs-electric-glow)"
        />
        {intensity === "hero" && (
          <>
            <path
              className="qs-electric-path qs-electric-path-3"
              d="M200 -20 C 400 180, 520 80, 720 200 S 1000 360, 1280 180"
              stroke="url(#qs-electric-stroke)"
              strokeWidth="1.25"
              filter="url(#qs-electric-glow)"
            />
            <path
              className="qs-electric-spark qs-electric-spark-1"
              d="M720 200 L 748 188 L 736 216 Z"
              fill="rgba(0,229,255,0.85)"
            />
            <path
              className="qs-electric-spark qs-electric-spark-2"
              d="M420 520 L 438 508 L 432 532 Z"
              fill="rgba(102,252,241,0.75)"
            />
          </>
        )}
      </svg>

      <div className="qs-flux-particles">
        {Array.from({ length: intensity === "hero" ? 8 : 5 }).map((_, i) => (
          <span
            key={i}
            className="qs-flux-particle"
            style={{ "--particle-i": i } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}