"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { createFood, updateFood, uploadImage } from "@/lib/api/admin";
import { resolveMediaUrl } from "@/lib/api/client";
import { Food, Category, DayOfWeek, FoodVariantInput } from "@/lib/api/types";
import { AlertCircle, X, Plus, Trash2, Loader2, ImageOff } from "lucide-react";

interface ProductFormProps {
  categories: Category[];
  product?: Food;
  onClose: () => void;
  onSaved: () => void;
}

const MAX_IMAGE_MB = 5;

export default function ProductForm({
  categories,
  product,
  onClose,
  onSaved,
}: ProductFormProps) {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
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
  const [variants, setVariants] = useState<FoodVariantInput[]>(
    product?.variants?.map((v) => ({ label: v.label, price: v.price })) ?? [],
  );

  const hasVariants = variants.length > 0;

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

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file || !token) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPEG, PNG, and WEBP images are supported");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`Image must be ${MAX_IMAGE_MB}MB or smaller`);
      return;
    }

    setError(null);
    setImageUploading(true);
    try {
      const { url } = await uploadImage(token, file);
      setFormData((prev) => ({ ...prev, image_url: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleVariantChange = (
    index: number,
    field: keyof FoodVariantInput,
    value: string,
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { label: "", price: "" }]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const validateVariants = (): string | null => {
    if (variants.length === 0) return null;
    for (const v of variants) {
      if (!v.label.trim()) return "Every size needs a name";
      if (!v.price || Number(v.price) <= 0) return "Every size needs a price greater than 0";
    }
    const labels = variants.map((v) => v.label.trim().toLowerCase());
    if (new Set(labels).size !== labels.length) {
      return "Size names must be unique (e.g. can't have two \"1kg\" entries)";
    }
    const prices = variants.map((v) => Number(v.price));
    if (new Set(prices).size !== prices.length) {
      return "Each size must have a different price";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const variantError = validateVariants();
    if (variantError) {
      setError(variantError);
      return;
    }

    setLoading(true);

    try {
      if (!token) throw new Error("Not authenticated");

      const cleanedVariants = variants.map((v) => ({
        label: v.label.trim(),
        price: v.price,
      }));
      const price = hasVariants
        ? String(Math.min(...cleanedVariants.map((v) => Number(v.price))))
        : formData.price;

      const payload = {
        ...formData,
        category_id: Number(formData.category_id),
        price,
        min_order_quantity: Number(formData.min_order_quantity),
        day_of_week: (formData.day_of_week as DayOfWeek | "") || null,
        image_url: formData.image_url || null,
        description: formData.description || null,
        variants: cleanedVariants,
      };

      if (product) {
        await updateFood(token, product.id, payload);
      } else {
        await createFood(token, payload);
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
  const previewUrl = resolveMediaUrl(formData.image_url);

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

          {hasVariants ? (
            <div>
              <label className={labelClass}>Price (PKR)</label>
              <div className={`${inputClass} bg-tint/40 text-muted`}>
                From Rs. {Math.min(...variants.map((v) => Number(v.price) || 0)) || "0"}
              </div>
              <p className="mt-1 text-xs text-muted">
                Set automatically from your cheapest size below
              </p>
            </div>
          ) : (
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
          )}

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
        </div>

        {/* Sizes / variants */}
        <div className="rounded-xl bg-tint/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Sizes (optional)</p>
              <p className="text-xs text-muted">
                Add named sizes with their own price, e.g. 500g / 1kg / 2kg
              </p>
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm ring-1 ring-black/5 hover:bg-tint"
            >
              <Plus size={14} />
              Add Size
            </button>
          </div>

          {variants.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 px-1">
                <span className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-wide text-muted">
                  Size
                </span>
                <span className="w-28 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted">
                  Price
                </span>
                <span className="w-9 shrink-0" aria-hidden="true" />
              </div>
              {variants.map((variant, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={variant.label}
                    onChange={(e) => handleVariantChange(index, "label", e.target.value)}
                    placeholder="e.g., 1kg, Small, Family Pack"
                    className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    type="number"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                    placeholder="Price"
                    step="0.01"
                    className="w-28 shrink-0 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-primary/10 hover:text-primary-dark"
                    title="Remove size"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image */}
        <div>
          <label className={labelClass}>Product Image</label>
          <div className="flex items-start gap-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-tint/60">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageOff size={24} className="text-muted" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 bg-white px-4 py-2.5 text-sm font-medium text-foreground hover:bg-tint/30">
                {imageUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload image (max 5MB)"
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  disabled={imageUploading}
                  className="hidden"
                />
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="...or paste an image URL"
                className={inputClass}
              />
            </div>
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
            disabled={loading || imageUploading}
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
