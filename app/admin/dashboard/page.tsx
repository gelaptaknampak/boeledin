import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardOverview from "@/components/admin/DashboardOverview";

export const metadata = {
  title: "Admin Dashboard — BOELEDIN CMS",
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("wp_token");

  if (!token) {
    redirect("/admin/login");
  }

  return (
    <AdminLayout>
      <DashboardOverview />
    </AdminLayout>
  );
}
