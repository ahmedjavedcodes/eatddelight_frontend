import Link from "next/link";
import FoodCard from "@/components/storefront/FoodCard";
import { getFoods } from "@/lib/api/menu";

export default async function PopularDishes() {
  const foods = await getFoods({ available: true, limit: 4 }).catch(() => []);

  if (foods.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-sm font-bold uppercase tracking-wide text-primary">
            Menu
          </span>
          <h2 className="mt-1 font-heading text-3xl font-semibold text-foreground">
            Our Most Loved Dishes
          </h2>
        </div>
        <Link
          href="/menu"
          className="hidden text-sm font-semibold text-primary hover:underline sm:inline"
        >
          View Full Menu →
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </section>
  );
}
