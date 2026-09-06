import Link from "next/link";
import HorizontalFoodScroll from "@/components/storefront/HorizontalFoodScroll";
import type { Food } from "@/lib/api/types";

export default function FoodMoreMenuItems({ foods }: { foods: Food[] }) {
  if (foods.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-sm font-bold uppercase tracking-wide text-primary">
            Menu
          </span>
          <h2 className="mt-1 font-heading text-3xl font-semibold text-foreground">
            More Menu Items
          </h2>
        </div>
        <Link
          href="/menu"
          className="hidden text-sm font-semibold text-primary hover:underline sm:inline"
        >
          View Full Menu →
        </Link>
      </div>

      <div className="mt-8">
        <HorizontalFoodScroll foods={foods} />
      </div>
    </section>
  );
}
