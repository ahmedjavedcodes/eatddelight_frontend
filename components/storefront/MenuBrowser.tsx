"use client";

import { useMemo, useState } from "react";
import FoodCard from "@/components/storefront/FoodCard";
import type { CategoryWithFoods } from "@/lib/api/types";

export default function MenuBrowser({
  categories,
}: {
  categories: CategoryWithFoods[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return categories
      .filter((c) => activeCategory === "all" || c.id === activeCategory)
      .map((c) => ({
        ...c,
        foods: c.foods.filter((f) =>
          query ? f.name.toLowerCase().includes(query) : true,
        ),
      }))
      .filter((c) => c.foods.length > 0);
  }, [categories, search, activeCategory]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search the menu…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setActiveCategory("all")}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            activeCategory === "all"
              ? "bg-tint text-primary-soft"
              : "bg-black/5 text-muted"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeCategory === c.id
                ? "bg-tint text-primary-soft"
                : "bg-black/5 text-muted"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-muted">No dishes match your search.</p>
      ) : (
        filtered.map((category) => (
          <div key={category.id} className="mt-12 first:mt-10">
            <h2 className="border-b-2 border-dotted border-primary/40 pb-2 font-heading text-2xl font-extrabold text-foreground">
              {category.name}
            </h2>
            {category.description && (
              <p className="mt-2 text-sm text-muted">{category.description}</p>
            )}
            <div className="mt-5 grid grid-cols-2 gap-5 lg:grid-cols-4">
              {category.foods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
