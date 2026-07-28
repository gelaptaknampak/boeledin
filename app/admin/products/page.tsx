import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductsManagement from "@/components/admin/ProductsManagement";

export const metadata = {
  title: "Kelola Produk — Admin BOELEDIN",
};

export default async function ProductsManagementPage() {
  const token = (await cookies()).get("wp_token");

  if (!token) {
    redirect("/admin/login");
  }

  console.log(token);

  return (
    <AdminLayout>
      <ProductsManagement />
    </AdminLayout>
  );
}
