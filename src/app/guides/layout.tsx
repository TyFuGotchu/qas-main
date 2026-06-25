import Link from "next/link";
import { PublicPageShell } from "@/components/layout/PublicPageShell";

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicPageShell
      footer={
        <footer className="qs-footer-glass px-4 py-8 text-center">
          <p className="font-mono text-xs text-slate-600">
            <Link href="/guides" className="text-cyan-accent hover:underline">
              Guides
            </Link>
            {" · "}
            <Link href="/lessons" className="text-cyan-accent hover:underline">
              Lessons
            </Link>
            {" · "}
            <Link href="/register" className="text-cyan-accent hover:underline">
              Get Access
            </Link>
          </p>
        </footer>
      }
    >
      {children}
    </PublicPageShell>
  );
}