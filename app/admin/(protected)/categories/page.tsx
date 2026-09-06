"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { getCategories, deleteCategory } from "@/lib/api/admin";
import { Category } from "@/lib/api/types";
import { Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import PageHeading from "@/components/storefront/PageHeading";
import CategoryForm from "@/components/admin/CategoryForm";

export default function CategoriesPage() {
  const { token, isOwner } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) return;

      try {
        const cats = await getCategories(token);
        setCategories(cats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!token || !isOwner()) {
      setError("Only owners can delete categories");
      return;
    }

    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      setDeleting(id);
      await deleteCategory(token, id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
    } finally {
      setDeleting(null);
    }
  };

  const handleCategorySaved = () => {
    setShowForm(false);
    setEditingCategory(null);
    if (token) {
      getCategories(token)
        .then(setCategories)
        .catch((err) => setError(err instanceof Error ? err.message : "Failed to refresh"));
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <PageHeading eyebrow="Admin" title="Categories" />
          <p className="mt-2 text-sm text-muted">
            {loading ? "Loading…" : `${categories.length} categor${categories.length !== 1 ? "ies" : "y"}`}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary/10 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-primary-dark" />
          <div>
            <p className="text-sm text-primary-dark">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-1 text-xs font-medium text-primary-dark underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="mt-6">
          <CategoryForm
            category={editingCategory || undefined}
            onClose={() => {
              setShowForm(false);
              setEditingCategory(null);
            }}
            onSaved={handleCategorySaved}
          />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-2xl bg-white p-10 text-center text-sm text-muted shadow-sm ring-1 ring-black/5">
            Loading categories…
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
            <p className="text-sm text-muted">No categories yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              Create your first category
            </button>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-heading font-semibold text-foreground">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setShowForm(true);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 transition hover:bg-tint hover:text-primary"
                    title="Edit category"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={deleting === category.id || !isOwner()}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 transition hover:bg-primary/10 hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
                    title={isOwner() ? "Delete category" : "Only owners can delete"}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-1.5 border-t border-black/5 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Slug</span>
                  <code className="rounded bg-tint/60 px-1.5 py-0.5 text-xs text-primary-dark">
                    {category.slug}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Order</span>
                  <span className="text-foreground">{category.display_order}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Status</span>
                  <span
                    className={`font-medium ${category.is_active ? "text-green-700" : "text-muted"}`}
                  >
                    {category.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
