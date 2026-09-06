"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { getCategories, deleteCategory } from "@/lib/api/admin";
import { Category } from "@/lib/api/types";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
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
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories",
        );
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
      setError(
        err instanceof Error ? err.message : "Failed to delete category",
      );
    } finally {
      setDeleting(null);
    }
  };

  const handleCategorySaved = () => {
    setShowForm(false);
    setEditingCategory(null);
    // Refetch categories
    if (token) {
      getCategories(token)
        .then(setCategories)
        .catch((err) =>
          setError(err instanceof Error ? err.message : "Failed to refresh"),
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading categories...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Categories</h1>
          <p className="text-gray-400">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-200">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-300 text-sm mt-2 hover:text-red-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="mb-8">
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center text-gray-400">
              <p className="mb-4">No categories yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-amber-400 hover:text-amber-300"
              >
                Create your first category
              </button>
            </div>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-400">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setShowForm(true);
                    }}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={deleting === category.id || !isOwner()}
                    className="p-2 hover:bg-red-900 rounded-lg transition-colors text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isOwner() ? "Delete category" : "Only owners can delete"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Slug:</span>
                  <code className="text-amber-400 font-mono">
                    {category.slug}
                  </code>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Order:</span>
                  <span>{category.display_order}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status:</span>
                  <span
                    className={category.is_active ? "text-green-400" : "text-red-400"}
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
