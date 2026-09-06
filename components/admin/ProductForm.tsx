"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { createFood, updateFood } from "@/lib/api/admin";
import { Food, Category, DayOfWeek } from "@/lib/api/types";
import { AlertCircle, X } from "lucide-react";

interface ProductFormProps {
  categories: Category[];
  product?: Food;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductForm({
  categories,
  product,
  onClose,
  onSaved,
}: ProductFormProps) {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category_id: product?.category_id || "",
    description: product?.description || "",
    price: product?.price || "",
    image_url: product?.image_url || "",
    is_available: product?.is_available ?? true,
    min_order_quantity: product?.min_order_quantity || 1,
    is_single_serving: product?.is_single_serving ?? false,
    requires_advance_order: product?.requires_advance_order ?? true,
    day_of_week: (product?.day_of_week || "") as DayOfWeek | "",
  });

  const days = [
    { value: "mon", label: "Monday" },
    { value: "tue", label: "Tuesday" },
    { value: "wed", label: "Wednesday" },
    { value: "thu", label: "Thursday" },
    { value: "fri", label: "Friday" },
  ];

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
        category_id: Number(formData.category_id),
        price: formData.price,
        min_order_quantity: Number(formData.min_order_quantity),
        day_of_week: (formData.day_of_week as DayOfWeek | "") || null,
        image_url: formData.image_url || null,
        description: formData.description || null,
      };

      if (product) {
        await updateFood(token, product.id, payload);
      } else {
        await createFood(token, payload as any);
      }

      onSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save product",
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
          {product ? "Edit Product" : "Create Product"}
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
            <label className={labelClass}>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Chicken Biryani"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Category *</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Price (PKR) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 400"
              step="0.01"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Min Order Quantity</label>
            <input
              type="number"
              name="min_order_quantity"
              value={formData.min_order_quantity}
              onChange={handleChange}
              min="1"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Day of Week (if special)</label>
            <select
              name="day_of_week"
              value={formData.day_of_week}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Not a daily special</option>
              {days.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the dish..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-tint/40 px-3 py-2.5">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleChange}
              className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary/40"
            />
            <span className="text-sm text-foreground">Available</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-tint/40 px-3 py-2.5">
            <input
              type="checkbox"
              name="is_single_serving"
              checked={formData.is_single_serving}
              onChange={handleChange}
              className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary/40"
            />
            <span className="text-sm text-foreground">Single Serving</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-tint/40 px-3 py-2.5">
            <input
              type="checkbox"
              name="requires_advance_order"
              checked={formData.requires_advance_order}
              onChange={handleChange}
              className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary/40"
            />
            <span className="text-sm text-foreground">Advance Order</span>
          </label>
        </div>

        <div className="flex gap-3 border-t border-black/5 pt-5">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-muted"
          >
            {loading ? "Saving..." : "Save Product"}
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
