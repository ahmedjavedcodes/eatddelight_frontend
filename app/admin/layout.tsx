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
  ChefHat,
} from "lucide-react";

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
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/products",
      label: "Products",
      icon: Package,
    },
    {
      href: "/admin/categories",
      label: "Categories",
      icon: Layers,
    },
    ...(user?.role === "owner"
      ? [
          {
            href: "/admin/staff",
            label: "Staff",
            icon: Users,
          },
        ]
      : []),
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6 overflow-y-auto border-r border-gray-700">
        <div className="flex items-center gap-3 mb-8">
          <ChefHat className="w-8 h-8 text-amber-500" />
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-gray-400">Daughter's Delight</p>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-gray-700 rounded-lg p-4 mb-8">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(href)
                  ? "bg-amber-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-900 hover:text-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-gray-950 text-white p-8 min-h-screen">{children}</div>
      </div>
    </div>
  );
}
