import Link from "next/link";
import { PublicPageShell } from "@/components/layout/PublicPageShell";

export default function OffersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicPageShell
      footer={
        <footer className="qs-footer-glass px-4 py-8 text-center">
          <p className="font-mono text-xs text-slate-600">
            <Link href="/offers" className="text-cyan-accent hover:underline">
              Offers
            </Link>
            {" · "}
            <Link href="/solutions" className="text-cyan-accent hover:underline">
              Tools
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