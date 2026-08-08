"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Settings,
  Languages,
} from "lucide-react";
import toast from "react-hot-toast";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const lang = searchParams.get("lang") === "id" ? "id" : "en";

  const navigationItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/pages", label: "Halaman", icon: FileText },
    { href: "/admin/products", label: "Produk", icon: ShoppingCart },
    { href: "/admin/news", label: "Berita", icon: FileText },
    // { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
  ];

  function handleLanguageChange(newLang: "en" | "id") {
    const params = new URLSearchParams(searchParams.toString());

    params.set("lang", newLang);

    router.replace(`${pathname}?${params.toString()}`);
  }

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success("Berhasil logout");

      router.replace("/admin/login");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Gagal logout");
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full bg-card border-r border-border transition-transform duration-300 z-40 ${
          sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:w-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link
              href="/admin/dashboard"
              className="text-xl font-bold text-primary"
            >
              BOELEDIN CMS
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={`${item.href}?lang=${lang}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border p-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <h1 className="text-lg font-semibold flex-1">Admin Dashboard</h1>

          {/* Content Language Switcher */}
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-muted-foreground" />

            <select
              value={lang}
              onChange={(e) =>
                handleLanguageChange(e.target.value as "en" | "id")
              }
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="en">🇬🇧 English</option>
              <option value="id">🇮🇩 Indonesia</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
