import { InstitutionalBackdrop } from "@/components/layout/InstitutionalBackdrop";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNav } from "@/components/layout/PublicNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="qs-environment relative min-h-screen">
      <InstitutionalBackdrop variant="hero" />
      <div className="relative z-[1] flex min-h-screen flex-col">
        <PublicNav />
        <main className="flex-1 overflow-x-hidden pb-20 pt-28 sm:pt-32 md:pb-0">{children}</main>
        <PublicFooter />
      </div>
    </div>
  );
}
