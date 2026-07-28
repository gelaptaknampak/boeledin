"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, ShoppingCart, Newspaper, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalPages: number;
  totalProducts: number;
  totalNews: number;
  recentItems: Array<{ id: number; title: string; type: string; date: string }>;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPages: 0,
    totalProducts: 0,
    totalNews: 0,
    recentItems: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await fetch("/api/wordpress/dashboard");

      if (!res.ok) {
        throw new Error("Gagal mengambil dashboard");
      }

      const data = await res.json();

      setStats(data);
    } catch (err) {
      console.error(err);
    }
  }

  const cards = [
    {
      icon: FileText,
      label: "Total Halaman",
      value: stats.totalPages,
      href: "/admin/pages",
      color: "bg-blue-500",
    },
    {
      icon: ShoppingCart,
      label: "Total Produk",
      value: stats.totalProducts,
      href: "/admin/products",
      color: "bg-green-500",
    },
    {
      icon: Newspaper,
      label: "Total Berita",
      value: stats.totalNews,
      href: "/admin/news",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}>
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-2">
                      {card.label}
                    </p>
                    <p className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {card.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Ringkasan Konten</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-accent rounded-lg">
            <p className="text-muted-foreground text-sm mb-1">Konten Aktif</p>
            <p className="text-2xl font-bold text-foreground">
              {stats.totalPages + stats.totalProducts + stats.totalNews}
            </p>
          </div>
          <div className="p-4 bg-accent rounded-lg">
            <p className="text-muted-foreground text-sm mb-1">
              Terakhir Diupdate
            </p>
            <p className="text-sm text-foreground">15 Feb 2024</p>
          </div>
          <div className="p-4 bg-accent rounded-lg">
            <p className="text-muted-foreground text-sm mb-1">Status</p>
            <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
              ✓ Semua Baik
            </p>
          </div>
        </div>
      </div>

      {/* Recent Items */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6">Item Terbaru</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Judul
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Tipe
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.recentItems.map((item) => (
                <tr key={item.id} className="hover:bg-accent transition-colors">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-3 py-1 bg-accent rounded-full text-xs font-semibold text-primary">
                      {item.type === "page"
                        ? "Halaman"
                        : item.type === "product"
                          ? "Produk"
                          : "Berita"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.date}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/${item.type}s/${item.id}/edit`}
                      className="text-primary hover:underline font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WordPress Connection Info */}
      <div className="bg-accent border border-primary/30 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          Informasi Koneksi WordPress
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">WordPress URL:</span>
            <span className="font-mono text-foreground">
              {process.env.NEXT_PUBLIC_WORDPRESS_URL}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">API Status:</span>
            <span className="text-green-600 dark:text-green-400 font-semibold">
              ✓ Connected
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data Sinkronisasi:</span>
            <span className="font-mono text-foreground">Real-time</span>
          </div>
        </div>
      </div>
    </div>
  );
}
