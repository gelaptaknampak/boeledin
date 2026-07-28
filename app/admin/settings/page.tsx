import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import SettingsPage from "@/components/admin/SettingsPage";

export const metadata = {
  title: "Pengaturan — Admin BOELEDIN",
};

export default async function AdminSettingsPage() {
  const token = (await cookies()).get("wp_token");

  if (!token) {
    redirect("/admin/login");
  }

  return (
    <AdminLayout>
      <SettingsPage />
    </AdminLayout>
  );
}
