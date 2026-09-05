"use client";

import Link from "next/link";
import FoodCard from "@/components/storefront/FoodCard";
import { useFavouritesStore } from "@/lib/store/favourites";
import { useHasMounted } from "@/lib/hooks/useHasMounted";

export default function FavouritesPage() {
  const hasMounted = useHasMounted();
  const foods = useFavouritesStore((s) => s.foods);
  const hasFavourites = hasMounted && foods.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="text-sm font-bold uppercase tracking-wide text-primary">
        Saved Items
      </span>
      <h1 className="mt-2 font-heading text-4xl font-semibold text-foreground">
        Your Favourites
      </h1>

      {hasFavourites ? (
        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
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
      )}
    </section>
  );
}
