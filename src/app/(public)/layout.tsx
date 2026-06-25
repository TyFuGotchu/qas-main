import { InstitutionalBackdrop } from "@/components/layout/InstitutionalBackdrop";
import { PublicNav } from "@/components/layout/PublicNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="qs-environment relative min-h-screen">
      <InstitutionalBackdrop variant="hero" />
      <div className="relative z-10">
        <PublicNav />
        <main className="overflow-x-hidden pt-14 sm:pt-16">{children}</main>
      </div>
    </div>
  );
}