"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FOUNDER } from "@/lib/founder-social";
import { FounderSocialIcons } from "@/components/marketing/FounderSocialIcons";
import { E8_DASHBOARD_PATH, E8_PUBLIC_PATH } from "@/lib/e8-partner";
import { useSession } from "@/providers/SessionProvider";

const PRODUCT_LINKS = [
  { href: E8_PUBLIC_PATH, label: "E8 Execution Center" },
  { href: "/dashboard/live-growth", label: "Live Growth Terminal" },
  { href: "/lessons", label: "Chart Academy" },
  { href: "/launch", label: "7-Day Playbook" },
  { href: "/quant-protocol", label: "Quant Protocol" },
  { href: "/dashboard/journal", label: "Journal" },
];

const LEGAL_NOTES = [
  "Educational tools only.",
  "Trading and prop evaluations are high risk.",
  "You can lose money or the evaluation fee.",
  "No guaranteed pass, payout, or funded account.",
  "Official E8 rules are set by E8 Markets.",
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { user, setUser } = useSession();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }

  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-[#07080C]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-10 lg:px-10">
        <FooterColumn title="Product">
          {PRODUCT_LINKS.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Account">
          <FooterLink href="/dashboard">Dashboard</FooterLink>
          <FooterLink href="/dashboard/upgrade">Upgrade Tier</FooterLink>
          <FooterLink href="/support">Support</FooterLink>
          {user ? (
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="flex h-6 items-center text-[13px] text-[#9AA3B2] transition-colors hover:text-[#7FE7DC]"
            >
              Logout
            </button>
          ) : (
            <FooterLink href="/login">Login</FooterLink>
          )}
        </FooterColumn>

        <FooterColumn title="Partner">
          <FooterLink href={E8_PUBLIC_PATH}>E8 Markets Execution Center</FooterLink>
          <FooterLink href={user ? E8_DASHBOARD_PATH : E8_PUBLIC_PATH}>Direct Signup</FooterLink>
        </FooterColumn>

        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#9AA3B2]">
            Founder
          </p>
          <p className="mt-3 text-[13px] font-medium tracking-tight text-[#F3F5F7]">
            {FOUNDER.legalName}
          </p>
          <p className="mt-0.5 text-xs text-[#9AA3B2]">{FOUNDER.company}</p>
          <FounderSocialIcons className="mt-3 flex-wrap" />
        </div>

        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#9AA3B2]">
            Legal
          </p>
          <ul className="mt-3 space-y-1.5 text-[11px] leading-5 text-[#9AA3B2]">
            {LEGAL_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.08] px-6 py-3.5 sm:px-8 lg:px-10">
        <p className="text-center font-mono text-[10px] tracking-wide text-[#9AA3B2]/70">
          © {year} Quicksilver Algo Systems · Founded by {FOUNDER.legalName} · quicksilveralgo.com
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#9AA3B2]">
        {title}
      </p>
      <div className="mt-3 space-y-1">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex h-6 items-center text-[13px] text-[#9AA3B2] transition-colors hover:text-[#7FE7DC]"
    >
      {children}
    </Link>
  );
}
