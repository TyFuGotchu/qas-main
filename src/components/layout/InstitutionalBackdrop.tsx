import { cn } from "@/lib/utils";

export type BackdropVariant = "public" | "dashboard" | "hero" | "auth";

interface InstitutionalBackdropProps {
  variant?: BackdropVariant;
  className?: string;
}

export function InstitutionalBackdrop({
  variant = "public",
  className,
}: InstitutionalBackdropProps) {
  return (
    <div
      className={cn("qs-backdrop pointer-events-none fixed inset-0 -z-10", className)}
      aria-hidden
    >
      <div className="qs-backdrop-base absolute inset-0" />

      <div className="qs-backdrop-grid absolute inset-0" />
      <div className="qs-backdrop-grid-fine absolute inset-0" />

      {variant === "hero" && (
        <>
          <div className="qs-orb qs-orb-cyan absolute -left-32 top-0 h-[720px] w-[720px]" />
          <div className="qs-orb qs-orb-emerald absolute -right-24 top-1/4 h-[560px] w-[560px]" />
          <div className="qs-orb qs-orb-violet absolute bottom-0 left-1/3 h-[480px] w-[480px]" />
          <div className="qs-backdrop-hero-rays absolute inset-0" />
        </>
      )}

      {variant === "dashboard" && (
        <>
          <div className="qs-orb qs-orb-cyan absolute -right-32 top-0 h-[520px] w-[520px] opacity-80" />
          <div className="qs-orb qs-orb-emerald absolute -left-40 bottom-0 h-[440px] w-[440px] opacity-70" />
          <div className="qs-backdrop-sidebar-glow absolute left-0 top-0 h-full w-64" />
        </>
      )}

      {variant === "public" && (
        <>
          <div className="qs-orb qs-orb-cyan absolute -left-24 top-20 h-[500px] w-[500px]" />
          <div className="qs-orb qs-orb-emerald absolute -right-32 bottom-20 h-[420px] w-[420px]" />
        </>
      )}

      {variant === "auth" && (
        <>
          <div className="qs-orb qs-orb-cyan absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2" />
          <div className="qs-orb qs-orb-violet absolute bottom-0 right-0 h-[400px] w-[400px]" />
        </>
      )}

      <div className="qs-backdrop-chart-lines absolute inset-0 opacity-40" />
      <div className="qs-backdrop-scanline absolute inset-0" />
      <div className="qs-backdrop-vignette absolute inset-0" />
      <div className="qs-backdrop-noise absolute inset-0" />
    </div>
  );
}