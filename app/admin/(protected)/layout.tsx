"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth";
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  LogOut,
} from "lucide-react";
import Logo from "@/components/storefront/Logo";
import "../admin-styles.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user, clearAuth } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !token) {
      router.push("/admin/login");
    }
  }, [token, router, isClient]);

  if (!isClient) {
    return null;
  }

  if (!token) {
    return null;
  }

  const handleLogout = () => {
    clearAuth();
    router.push("/admin/login");
  };

  const isActive = (href: string) => pathname === href;

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Layers },
    ...(user?.role === "owner"
      ? [{ href: "/admin/staff", label: "Staff", icon: Users }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <Link href="/" className="mb-6 block">
              <Logo size="sm" />
            </Link>

            {/* User Info */}
            <div className="mb-6 rounded-xl bg-tint/60 p-4">
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.name}
              </p>
              <p className="text-xs font-medium capitalize text-primary">
                {user?.role}
              </p>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "bg-primary text-white"
                      : "text-foreground/70 hover:bg-tint/60 hover:text-foreground"
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-6 border-t border-black/5 pt-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-primary/10 hover:text-primary-dark"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-white px-4 py-3 shadow-sm ring-1 ring-black/5 md:hidden">
          <Logo size="sm" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full bg-tint/60 px-3 py-1.5 text-xs font-semibold text-primary-dark"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        {/* Main Content */}
        <main className="min-w-0 flex-1 pt-16 md:pt-0">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-black/5 bg-white py-2 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] md:hidden">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-medium ${
              isActive(href) ? "text-primary" : "text-muted"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
