"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import FoodCard from "@/components/storefront/FoodCard";
import { getFoods } from "@/lib/api/menu";
import type { Food } from "@/lib/api/types";
import { useFavouritesStore } from "@/lib/store/favourites";

export default function FavouritesPage() {
  const foodIds = useFavouritesStore((s) => s.foodIds);
  const hasFavourites = foodIds.length > 0;
  const [allFoods, setAllFoods] = useState<Food[] | null>(null);

  useEffect(() => {
    if (!hasFavourites) return;
    getFoods({ limit: 200 })
      .then(setAllFoods)
      .catch(() => setAllFoods([]));
  }, [hasFavourites]);

  const foods = useMemo(() => {
    if (foodIds.length === 0) return [];
    if (allFoods === null) return null;
    return allFoods.filter((f) => foodIds.includes(f.id));
  }, [allFoods, foodIds]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-extrabold text-foreground">
        Your Favourites
      </h1>

      {foods === null ? (
        <p className="mt-10 text-muted">Loading…</p>
      ) : foods.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-muted">
            You haven&rsquo;t saved any dishes yet. Tap the heart icon on any
            dish to save it here.
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
          >
            Explore Menu
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </section>
  );
}
