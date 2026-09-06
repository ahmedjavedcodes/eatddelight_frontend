"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { createCategory, updateCategory } from "@/lib/api/admin";
import { Category } from "@/lib/api/types";
import { AlertCircle, X } from "lucide-react";

interface CategoryFormProps {
  category?: Category;
  onClose: () => void;
  onSaved: () => void;
}

export default function CategoryForm({
  category,
  onClose,
  onSaved,
}: CategoryFormProps) {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    display_order: category?.display_order || 0,
    is_active: category?.is_active ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!token) throw new Error("Not authenticated");

      const payload = {
        ...formData,
        display_order: Number(formData.display_order),
        description: formData.description || null,
      };

      if (category) {
        await updateCategory(token, category.id, payload);
      } else {
        await createCategory(token, payload as any);
      }

      onSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save category",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
  const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          {category ? "Edit Category" : "Create Category"}
        </h2>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-tint hover:text-foreground"
        >
          <X size={18} />
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-primary/10 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-primary-dark" />
          <p className="text-sm text-primary-dark">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Category Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Rice Dishes"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g., rice-dishes"
              className={inputClass}
              required
            />
            <p className="mt-1 text-xs text-muted">
              URL-friendly identifier (lowercase, hyphens only)
            </p>
          </div>

          <div>
            <label className={labelClass}>Display Order</label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-muted">Lower numbers appear first</p>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 self-start rounded-xl bg-tint/40 px-3 py-2.5 md:mt-8">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary/40"
            />
            <span className="text-sm text-foreground">Active</span>
          </label>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe this category..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="flex gap-3 border-t border-black/5 pt-5">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-muted"
          >
            {loading ? "Saving..." : "Save Category"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-tint py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-tint/70"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
