"use client";

import { useMemo, useState } from "react";
import CategoryPills from "@/components/storefront/CategoryPills";
import HorizontalFoodScroll from "@/components/storefront/HorizontalFoodScroll";
import type { CategoryWithFoods } from "@/lib/api/types";

export default function HomeMenuFilter({
  categories,
}: {
  categories: CategoryWithFoods[];
}) {
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");

  const foods = useMemo(() => {
    return categories
      .filter((c) => activeCategory === "all" || c.id === activeCategory)
      .flatMap((c) => c.foods)
      .slice(0, 8);
  }, [categories, activeCategory]);

  return (
    <div>
      <CategoryPills
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />
      <div className="mt-8">
        <HorizontalFoodScroll foods={foods} />
      </div>
    </div>
  );
}
