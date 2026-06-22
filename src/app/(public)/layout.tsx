import { PublicNav } from "@/components/layout/PublicNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-obsidian-950 bg-grid-pattern bg-grid">
      <PublicNav />
      <main className="overflow-x-hidden pt-14 sm:pt-16">{children}</main>
    </div>
  );
}