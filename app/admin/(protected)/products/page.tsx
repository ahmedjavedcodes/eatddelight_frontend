"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { getFoods, getCategories, deleteFood } from "@/lib/api/admin";
import { Food, Category } from "@/lib/api/types";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
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
      setError(
        err instanceof Error ? err.message : "Failed to delete product",
      );
    } finally {
      setDeleting(null);
    }
  };

  const handleProductSaved = () => {
    setShowForm(false);
    setEditingProduct(null);
    // Refetch products
    if (token) {
      getFoods(token)
        .then(setProducts)
        .catch((err) =>
          setError(err instanceof Error ? err.message : "Failed to refresh"),
        );
    }
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-gray-400">
            {products.length} product{products.length !== 1 ? "s" : ""} in store
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
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

      {/* Products Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="mb-4">No products yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-amber-400 hover:text-amber-300"
            >
              Create your first product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-900">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Min Order
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.description && (
                          <p className="text-sm text-gray-400">
                            {product.description.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {getCategoryName(product.category_id)}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      Rs. {parseFloat(product.price).toFixed(0)}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {product.min_order_quantity}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.is_available
                            ? "bg-green-900 text-green-200"
                            : "bg-red-900 text-red-200"
                        }`}
                      >
                        {product.is_available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowForm(true);
                          }}
                          className="p-2 hover:bg-gray-600 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id || !isOwner()}
                          className="p-2 hover:bg-red-900 rounded-lg transition-colors text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={isOwner() ? "Delete product" : "Only owners can delete"}
                        >
                          <Trash2 className="w-4 h-4" />
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
