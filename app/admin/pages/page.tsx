import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import PagesManagement from "@/components/admin/PagesManagement";

export const metadata = {
  title: "Kelola Halaman — Admin BOELEDIN",
};

export default async function PagesManagementPage() {
  const token = (await cookies()).get("wp_token");

  if (!token) {
    redirect("/admin/login");
  }

  return (
    <AdminLayout>
      <PagesManagement />
    </AdminLayout>
  );
}
