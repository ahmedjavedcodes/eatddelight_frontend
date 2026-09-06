"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth";
import {
  Package,
  Layers,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { getFoods, getCategories } from "@/lib/api/admin";
import { getStaff } from "@/lib/api/admin";

export default function Dashboard() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    staff: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        const [foods, categories, staffMembers] = await Promise.all([
          getFoods(token),
          getCategories(token),
          getStaff(token),
        ]);

        setStats({
          products: foods.length,
          categories: categories.length,
          staff: staffMembers.length,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch statistics",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const dashboardCards = [
    {
      title: "Products",
      icon: Package,
      count: stats.products,
      href: "/admin/products",
      color: "bg-blue-600",
    },
    {
      title: "Categories",
      icon: Layers,
      count: stats.categories,
      href: "/admin/categories",
      color: "bg-purple-600",
    },
    {
      title: "Staff Members",
      icon: Users,
      count: stats.staff,
      href: "/admin/staff",
      color: "bg-green-600",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to Daughter's Delight Admin</p>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0 mt-0.5" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {dashboardCards.map(({ title, icon: Icon, count, href, color }) => (
          <Link
            key={href}
            href={href}
            className="group bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-gray-900/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <p className="text-3xl font-bold mb-4">
              {loading ? "..." : count}
            </p>
            <p className="text-amber-400 text-sm font-medium group-hover:gap-2 flex items-center gap-1">
              View {title.toLowerCase()} →
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/products"
            className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors"
          >
            <p className="font-medium mb-1">Add New Product</p>
            <p className="text-sm text-gray-400">
              Create and manage food items
            </p>
          </Link>
          <Link
            href="/admin/categories"
            className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors"
          >
            <p className="font-medium mb-1">Manage Categories</p>
            <p className="text-sm text-gray-400">
              Organize products by categories
            </p>
          </Link>
          <Link
            href="/admin/products"
            className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors"
          >
            <p className="font-medium mb-1">View All Products</p>
            <p className="text-sm text-gray-400">
              Update or delete existing products
            </p>
          </Link>
          <Link
            href="/admin/staff"
            className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors"
          >
            <p className="font-medium mb-1">Manage Staff</p>
            <p className="text-sm text-gray-400">Add or update staff members</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
