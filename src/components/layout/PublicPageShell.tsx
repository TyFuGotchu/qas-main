import { InstitutionalBackdrop } from "@/components/layout/InstitutionalBackdrop";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNav } from "@/components/layout/PublicNav";
import { cn } from "@/lib/utils";

interface PublicPageShellProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  mainClassName?: string;
  variant?: "public" | "hero";
  showFooter?: boolean;
}

export function PublicPageShell({
  children,
  footer,
  mainClassName,
  variant = "public",
  showFooter = true,
}: PublicPageShellProps) {
  return (
    <div className="qs-environment relative min-h-screen">
      <InstitutionalBackdrop variant={variant} />
      <div className="relative z-[1] flex min-h-screen flex-col">
        <PublicNav />
        <main
          className={cn(
            "mx-auto w-full max-w-4xl flex-1 overflow-x-hidden px-4 py-8 pt-28 sm:px-6 sm:py-10 sm:pt-32",
            mainClassName
          )}
        >
          {children}
        </main>
        {footer ?? (showFooter ? <PublicFooter /> : null)}
      </div>
    </div>
  );
}