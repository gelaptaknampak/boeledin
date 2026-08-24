import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import EmailSettingsForm from "@/components/admin/EmailSettingsForm";

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
      <EmailSettingsForm />
    </AdminLayout>
  );
}
