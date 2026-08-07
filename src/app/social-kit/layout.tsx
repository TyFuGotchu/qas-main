import Link from "next/link";
import { PublicPageShell } from "@/components/layout/PublicPageShell";

export default function SocialKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicPageShell
      footer={
        <footer className="qs-footer-glass px-4 py-8 text-center">
          <p className="font-mono text-xs text-slate-600">
            Internal social kit ·{" "}
            <Link href="/quant-protocol" className="text-cyan-accent hover:underline">
              Quant Protocol
            </Link>
            {" · "}
            <Link href="/" className="text-cyan-accent hover:underline">
              Home
            </Link>
          </p>
        </footer>
      }
    >
      {children}
    </PublicPageShell>
  );
}
