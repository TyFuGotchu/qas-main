import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { enforceAuthenticatedDashboardAccess } from "@/lib/access-control";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await enforceAuthenticatedDashboardAccess();

  return (
    <div className="min-h-screen bg-obsidian-950">
      <Sidebar />
      <div className="ml-64 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}