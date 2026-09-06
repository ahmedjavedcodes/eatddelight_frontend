"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { getFoods, getCategories, deleteFood } from "@/lib/api/admin";
import { Food, Category } from "@/lib/api/types";
import { Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import PageHeading from "@/components/storefront/PageHeading";
import { formatPrice } from "@/lib/format";
import ProductForm from "@/components/admin/ProductForm";

export default function ProductsPage() {
  const { token, isOwner } = useAuthStore();
  const [products, setProducts] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Food | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const [foods, cats] = await Promise.all([
          getFoods(token),
          getCategories(token),
        ]);
        setProducts(foods);
        setCategories(cats);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!token || !isOwner()) {
      setError("Only owners can delete products");
      return;
    }

    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setDeleting(id);
      await deleteFood(token, id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  const handleProductSaved = () => {
    setShowForm(false);
    setEditingProduct(null);
    if (token) {
      getFoods(token)
        .then(setProducts)
        .catch((err) => setError(err instanceof Error ? err.message : "Failed to refresh"));
    }
  };

  const getCategoryName = (categoryId: number) =>
    categories.find((c) => c.id === categoryId)?.name || "Uncategorized";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <PageHeading eyebrow="Admin" title="Products" />
          <p className="mt-2 text-sm text-muted">
            {loading ? "Loading…" : `${products.length} product${products.length !== 1 ? "s" : ""} on the menu`}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <Plus size={16} />
          Add Product
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
          <ProductForm
            categories={categories}
            product={editingProduct || undefined}
            onClose={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
            onSaved={handleProductSaved}
          />
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        {loading ? (
          <div className="p-10 text-center text-sm text-muted">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-muted">No products yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              Create your first product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-tint/40">
                  <th className="px-6 py-3 font-semibold text-foreground">Name</th>
                  <th className="px-6 py-3 font-semibold text-foreground">Category</th>
                  <th className="px-6 py-3 font-semibold text-foreground">Price</th>
                  <th className="px-6 py-3 font-semibold text-foreground">Min Order</th>
                  <th className="px-6 py-3 font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-black/5 last:border-0 hover:bg-tint/20"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{product.name}</p>
                      {product.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                          {product.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {getCategoryName(product.category_id)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-muted">{product.min_order_quantity}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.is_available
                            ? "bg-green-100 text-green-700"
                            : "bg-black/5 text-muted"
                        }`}
                      >
                        {product.is_available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowForm(true);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 transition hover:bg-tint hover:text-primary"
                          title="Edit product"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id || !isOwner()}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 transition hover:bg-primary/10 hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
                          title={isOwner() ? "Delete product" : "Only owners can delete"}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
