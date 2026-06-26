import { cn } from "@/lib/utils";
import { QuicksilverFlux } from "@/components/layout/QuicksilverFlux";

export type BackdropVariant = "public" | "dashboard" | "hero" | "auth";

interface InstitutionalBackdropProps {
  variant?: BackdropVariant;
  className?: string;
}

const FLUX_INTENSITY = {
  hero: "hero",
  dashboard: "medium",
  public: "medium",
  auth: "subtle",
} as const;

export function InstitutionalBackdrop({
  variant = "public",
  className,
}: InstitutionalBackdropProps) {
  const fluxIntensity = FLUX_INTENSITY[variant];

  return (
    <div
      className={cn(
        "qs-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <div className="qs-backdrop-base absolute inset-0" />
      <div className="qs-backdrop-grid absolute inset-0" />
      <div className="qs-backdrop-grid-fine absolute inset-0" />

      <QuicksilverFlux intensity={fluxIntensity} />

      {variant === "hero" && (
        <>
          <div className="qs-orb qs-orb-cyan absolute -left-20 top-0 h-[800px] w-[800px]" />
          <div className="qs-orb qs-orb-silver absolute left-1/2 top-0 h-[640px] w-[640px] -translate-x-1/2" />
          <div className="qs-orb qs-orb-emerald absolute -right-10 top-1/4 h-[640px] w-[640px]" />
          <div className="qs-backdrop-hero-rays absolute inset-0" />
          <div className="qs-hero-mercury-core absolute left-1/2 top-[18%] h-72 w-72 -translate-x-1/2 sm:h-96 sm:w-96" />
        </>
      )}

      {variant === "dashboard" && (
        <>
          <div className="qs-orb qs-orb-cyan absolute -right-20 top-0 h-[600px] w-[600px]" />
          <div className="qs-orb qs-orb-silver absolute left-1/3 top-1/2 h-[420px] w-[420px]" />
          <div className="qs-orb qs-orb-emerald absolute -left-32 bottom-0 h-[500px] w-[500px]" />
          <div className="qs-backdrop-sidebar-glow absolute left-0 top-0 h-full w-72" />
          <div className="qs-backdrop-dashboard-beam absolute inset-0" />
        </>
      )}

      {variant === "public" && (
        <>
          <div className="qs-orb qs-orb-cyan absolute -left-16 top-16 h-[560px] w-[560px]" />
          <div className="qs-orb qs-orb-silver absolute right-1/4 top-1/3 h-[400px] w-[400px]" />
          <div className="qs-orb qs-orb-emerald absolute -right-24 bottom-16 h-[480px] w-[480px]" />
        </>
      )}

      {variant === "auth" && (
        <>
          <div className="qs-orb qs-orb-cyan absolute left-1/2 top-1/4 h-[700px] w-[700px] -translate-x-1/2" />
          <div className="qs-orb qs-orb-silver absolute left-1/2 top-1/3 h-[480px] w-[480px] -translate-x-1/2" />
        </>
      )}

      <div className="qs-backdrop-chart-lines absolute inset-0" />
      <div className="qs-backdrop-vignette absolute inset-0" />
      <div className="qs-backdrop-noise absolute inset-0" />
    </div>
  );
}