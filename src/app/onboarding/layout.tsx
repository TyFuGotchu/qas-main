import { InstitutionalBackdrop } from "@/components/layout/InstitutionalBackdrop";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="qs-environment relative min-h-screen">
      <InstitutionalBackdrop variant="auth" />
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}