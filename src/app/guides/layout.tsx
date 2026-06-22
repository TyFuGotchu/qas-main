import Link from "next/link";
import { PublicNav } from "@/components/layout/PublicNav";

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-obsidian-950">
      <PublicNav />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">{children}</main>
      <footer className="border-t border-slate-800/60 px-4 py-8 text-center">
        <p className="font-mono text-xs text-slate-600">
          <Link href="/guides" className="text-cyan-accent hover:underline">
            All Guides
          </Link>
          {" · "}
          <Link href="/lessons" className="text-cyan-accent hover:underline">
            Lesson Center
          </Link>
        </p>
      </footer>
    </div>
  );
}