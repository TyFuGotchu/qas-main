import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session || !isAdminUser(session)) {
    redirect("/dashboard");
  }

  return <AdminDashboard />;
}