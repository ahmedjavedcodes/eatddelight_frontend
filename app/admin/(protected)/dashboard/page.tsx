"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth";
import { Package, Layers, Users, AlertCircle, ArrowRight } from "lucide-react";
import { getFoods, getCategories, getStaff } from "@/lib/api/admin";
import PageHeading from "@/components/storefront/PageHeading";

export default function Dashboard() {
  const { token, isOwner } = useAuthStore();
  const [stats, setStats] = useState({ products: 0, categories: 0, staff: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        const [foods, categories, staffMembers] = await Promise.all([
          getFoods(token),
          getCategories(token),
          isOwner() ? getStaff(token) : Promise.resolve([]),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const dashboardCards = [
    { title: "Products", icon: Package, count: stats.products, href: "/admin/products" },
    { title: "Categories", icon: Layers, count: stats.categories, href: "/admin/categories" },
    ...(isOwner()
      ? [{ title: "Staff Members", icon: Users, count: stats.staff, href: "/admin/staff" }]
      : []),
  ];

  return (
    <div>
      <PageHeading eyebrow="Admin" title="Dashboard" />
      <p className="mt-2 text-sm text-muted">
        Manage the products your customers see on the storefront.
      </p>

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary/10 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-primary-dark" />
          <p className="text-sm text-primary-dark">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map(({ title, icon: Icon, count, href }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-tint text-primary">
                <Icon size={20} />
              </div>
              <ArrowRight
                size={16}
                className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary"
              />
            </div>
            <p className="mt-4 text-sm text-muted">{title}</p>
            <p className="font-heading text-3xl font-semibold text-foreground">
              {loading ? "—" : count}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Quick actions
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/admin/products"
            className="rounded-xl bg-tint/60 p-4 transition hover:bg-tint"
          >
            <p className="font-medium text-foreground">Add a new product</p>
            <p className="mt-0.5 text-sm text-muted">
              Create a dish to show on the menu
            </p>
          </Link>
          <Link
            href="/admin/categories"
            className="rounded-xl bg-tint/60 p-4 transition hover:bg-tint"
          >
            <p className="font-medium text-foreground">Manage categories</p>
            <p className="mt-0.5 text-sm text-muted">
              Organize the full menu by category
            </p>
          </Link>
          {isOwner() && (
            <Link
              href="/admin/staff"
              className="rounded-xl bg-tint/60 p-4 transition hover:bg-tint sm:col-span-2"
            >
              <p className="font-medium text-foreground">Manage staff</p>
              <p className="mt-0.5 text-sm text-muted">
                Add or deactivate team accounts
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
