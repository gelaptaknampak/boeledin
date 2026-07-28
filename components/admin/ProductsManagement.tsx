"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // const [products, setProducts] = useState([
  //   {
  //     id: 1,
  //     name: 'Ultra-Slim 4K Commercial Display',
  //     model: 'FBI-43Q6',
  //     brand: 'FBI',
  //     status: 'publish',
  //     modified: '2024-02-14',
  //   },
  //   {
  //     id: 2,
  //     name: 'Android SOC Digital Signage',
  //     model: 'SR Series (SRAA05)',
  //     brand: 'BOELED',
  //     status: 'publish',
  //     modified: '2024-02-13',
  //   },
  //   {
  //     id: 3,
  //     name: 'Fine-Pitch LED Display',
  //     model: 'BTQ Series (P1.25)',
  //     brand: 'BOE',
  //     status: 'draft',
  //     modified: '2024-02-12',
  //   },
  // ])

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);

      const res = await fetch("/api/wordpress/products");

      const data = await res.json();

      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter((product) => {
    const title = product.title?.rendered ?? "";
    const model = product.acf?.model_produk ?? "";

    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const res = await fetch(`/api/wordpress/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Produk berhasil dihapus");

      fetchProducts();
    } catch {
      toast.error("Gagal menghapus produk");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Kelola Produk</h1>
          <p className="text-muted-foreground">
            Kelola semua produk dari WordPress CMS
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Produk
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">
                  Nama Produk
                </th>
                <th className="px-6 py-4 text-left font-semibold">Model</th>
                <th className="px-6 py-4 text-left font-semibold">Merek</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Diubah</th>
                <th className="px-6 py-4 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-accent/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">
                    {product.acf?.nama_produk}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {product.acf?.model_produk}
                  </td>
                  <td className="px-6 py-4 text-sm">{product.acf?.brand}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        product.status === "publish"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {product.status === "publish"
                        ? "Dipublikasikan"
                        : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(product.modified).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-primary" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada produk ditemukan</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-accent border border-primary/30 rounded-lg p-6">
        <h3 className="font-semibold mb-2">Informasi</h3>
        <p className="text-sm text-muted-foreground">
          Semua data produk disinkronkan dengan WordPress CMS. Anda dapat
          mengedit produk menggunakan editor WordPress juga.
        </p>
      </div>
    </div>
  );
}
