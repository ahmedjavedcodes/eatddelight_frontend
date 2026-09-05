import Link from "next/link";
import FoodCard from "@/components/storefront/FoodCard";
import { getFullMenu } from "@/lib/api/menu";

export default async function MenuShowcase() {
  const categories = await getFullMenu().catch(() => []);

  // Flatten all foods from categories and limit to 8
  const allFoods = categories
    .flatMap((category) => category.foods)
    .slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-sm font-bold uppercase tracking-wide text-primary">
            Menu
          </span>
          <h2 className="mt-1 font-heading text-3xl font-semibold text-foreground">
            Explore Our Dishes
          </h2>
        </div>
        <Link
          href="/menu"
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark"
        >
          View Full Menu →
        </Link>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/menu?category=${category.id}`}
              className="rounded-full bg-tint px-4 py-2 text-sm font-medium text-black transition hover:bg-tint/70"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      {/* Foods Horizontal Scroll */}
      {allFoods.length > 0 ? (
        <div className="scrollbar-hide mt-8 flex gap-5 overflow-x-auto pb-2">
          {allFoods.map((food) => (
            <div key={food.id} className="w-[42vw] shrink-0 sm:w-56 lg:w-64">
              <FoodCard food={food} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg bg-tint p-8 text-center">
          <p className="text-muted">Menu items coming soon. Check back later!</p>
          <Link
            href="/menu"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
          >
            Browse Full Menu
          </Link>
        </div>
      )}
    </section>
  );
}
