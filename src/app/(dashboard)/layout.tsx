import { DashboardShell } from "@/components/layout/DashboardShell";
import { enforceAuthenticatedDashboardAccess } from "@/lib/access-control";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await enforceAuthenticatedDashboardAccess();

  return <DashboardShell>{children}</DashboardShell>;
}