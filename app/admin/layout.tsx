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
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#111827" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "256px",
          backgroundColor: "#1f2937",
          color: "white",
          padding: "24px",
          overflowY: "auto",
          borderRight: "1px solid #374151",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <ChefHat style={{ width: "32px", height: "32px", color: "#f59e0b" }} />
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: "0" }}>Admin Panel</h1>
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0" }}>Daughter's Delight</p>
          </div>
        </div>

        {/* User Info */}
        <div style={{ backgroundColor: "#374151", borderRadius: "8px", padding: "16px", marginBottom: "32px" }}>
          <p style={{ fontSize: "14px", fontWeight: "500", margin: "0" }}>{user?.name}</p>
          <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0", textTransform: "capitalize" }}>
            {user?.role}
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "32px" }}>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "8px",
                transition: "all 0.2s",
                backgroundColor: isActive(href) ? "#b45309" : "transparent",
                color: isActive(href) ? "white" : "#d1d5db",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive(href)) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(href)) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }
              }}
            >
              <Icon style={{ width: "20px", height: "20px" }} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "8px",
            color: "#d1d5db",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            fontSize: "14px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#7f1d1d";
            (e.currentTarget as HTMLElement).style.color = "#fecaca";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#d1d5db";
          }}
        >
          <LogOut style={{ width: "20px", height: "20px" }} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ backgroundColor: "#0f172a", color: "white", padding: "32px", minHeight: "100vh" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
