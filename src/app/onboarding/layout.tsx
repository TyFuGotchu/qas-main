export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-obsidian-950 bg-grid-pattern bg-grid">
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}