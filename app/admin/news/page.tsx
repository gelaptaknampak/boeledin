import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import NewsManagement from "@/components/admin/NewsManagement";

export const metadata = {
  title: "Kelola Berita — Admin BOELEDIN",
};

export default async function NewsManagementPage() {
  const token = (await cookies()).get("wp_token");

  if (!token) {
    redirect("/admin/login");
  }

  return (
    <AdminLayout>
      <NewsManagement />
    </AdminLayout>
  );
}
