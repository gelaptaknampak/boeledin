import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  return (
    <AdminLayout>
      <ProductForm
        mode="edit"
        productId={Number(id)}
      />
    </AdminLayout>
  );
}