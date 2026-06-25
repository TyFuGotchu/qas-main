"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InstitutionalBackdrop } from "@/components/layout/InstitutionalBackdrop";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ToastProvider } from "@/components/ui/Toast";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  return (
    <ToastProvider>
      <div className="qs-environment relative min-h-screen overflow-x-hidden">
        <InstitutionalBackdrop variant="dashboard" />
        {mobileNavOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}
        <Sidebar
          mobileOpen={mobileNavOpen}
          onNavigate={() => setMobileNavOpen(false)}
        />
        <div className="relative z-[1] flex min-h-screen flex-col lg:ml-64">
          <Header
            onMenuToggle={() => setMobileNavOpen((open) => !open)}
            menuOpen={mobileNavOpen}
          />
          <main className="qs-terminal-frame relative flex-1 overflow-x-hidden p-4 sm:p-6">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-emerald-500/[0.05]"
              aria-hidden
            />
            <div className="relative z-[1]">{children}</div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}