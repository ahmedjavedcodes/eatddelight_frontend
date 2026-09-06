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

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          {product ? "Edit Product" : "Create Product"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0 mt-0.5" />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Chicken Biryani"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-500 transition-colors"
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price (PKR) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 400"
              step="0.01"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Min Order Quantity
            </label>
            <input
              type="number"
              name="min_order_quantity"
              value={formData.min_order_quantity}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Day of Week (if special)
            </label>
            <select
              name="day_of_week"
              value={formData.day_of_week}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-500 transition-colors"
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the dish..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-300">Available</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_single_serving"
              checked={formData.is_single_serving}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-300">Single Serving</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="requires_advance_order"
              checked={formData.requires_advance_order}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-300">Advance Order</span>
          </label>
        </div>

        <div className="flex gap-4 pt-6 border-t border-gray-700">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-medium py-2 rounded-lg transition-colors"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
