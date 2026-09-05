"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import HorizontalFoodScroll from "@/components/storefront/HorizontalFoodScroll";
import type { CategoryWithFoods } from "@/lib/api/types";

type SortOption = "default" | "price_asc" | "price_desc" | "name_asc";

export default function MenuBrowser({
  categories,
}: {
  categories: CategoryWithFoods[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    let foods = categories
      .filter((c) => activeCategory === "all" || c.id === activeCategory)
      .flatMap((c) => c.foods);

    foods = foods.filter((f) => {
      if (query && !f.name.toLowerCase().includes(query)) return false;
      const price = Number(f.price);
      if (min !== null && price < min) return false;
      if (max !== null && price > max) return false;
      return true;
    });

    if (sortBy === "price_asc") {
      foods = [...foods].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price_desc") {
      foods = [...foods].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name_asc") {
      foods = [...foods].sort((a, b) => a.name.localeCompare(b.name));
    }

    return foods;
  }, [categories, search, activeCategory, minPrice, maxPrice, sortBy]);

  function clearFilters() {
    setMinPrice("");
    setMaxPrice("");
    setActiveCategory("all");
    setSortBy("default");
  }

  return (
    <div>
      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("all")}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            activeCategory === "all"
              ? "border-primary bg-primary text-white"
              : "border-black/10 bg-white text-foreground hover:border-primary/40"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              activeCategory === c.id
                ? "border-primary bg-primary text-white"
                : "border-black/10 bg-white text-foreground hover:border-primary/40"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="relative mt-4 flex gap-3">
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-black/10 px-5 py-3 focus:border-primary focus:outline-none"
        />
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="relative flex shrink-0 items-center gap-2 rounded-full border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-tint"
        >
          <SlidersHorizontal size={16} />
          Filters
          {(minPrice || maxPrice || sortBy !== "default") && (
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />
          )}
        </button>

        {showFilters && (
          <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted">Min price</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted">Max price</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-muted">Category</label>
              <select
                value={activeCategory}
                onChange={(e) =>
                  setActiveCategory(
                    e.target.value === "all" ? "all" : Number(e.target.value),
                  )
                }
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-muted">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="default">Default order</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-muted hover:text-foreground"
              >
                Clear filters
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products horizontal scroll */}
      {filteredFoods.length === 0 ? (
        <p className="mt-12 text-muted">No dishes match your search.</p>
      ) : (
        <div className="mt-8">
          <HorizontalFoodScroll foods={filteredFoods} />
        </div>
      )}
    </div>
  );
}
