"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { Food } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart";
import { useFavouritesStore } from "@/lib/store/favourites";

export default function DayCard({
  day,
  food,
  highlight = false,
}: {
  day: string;
  food: Food;
  highlight?: boolean;
}) {
  const isFavourite = useFavouritesStore((s) => s.isFavourite(food.id));
  const toggleFavourite = useFavouritesStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd() {
    addItem({
      foodId: food.id,
      name: food.name,
      unitPrice: Number(food.price),
      quantity: food.min_order_quantity,
      minOrderQuantity: food.min_order_quantity,
      addOns: [],
    });
  }

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border-2 border-dashed p-4 ${
        highlight ? "border-primary bg-tint/40" : "border-primary/40"
      }`}
    >
      <Link
        href={`/food/${food.id}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-tint sm:h-24 sm:w-24"
      >
        {food.image_url ? (
          <Image src={food.image_url} alt={food.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-muted">
            No image
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <span className="text-xs font-bold uppercase tracking-wide text-primary">
          {day}
        </span>
        <Link href={`/food/${food.id}`}>
          <h3 className="mt-0.5 truncate font-heading font-semibold text-foreground">
            {food.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-semibold text-foreground">{formatPrice(food.price)}</span>
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle favourite"
              onClick={() => toggleFavourite(food)}
              className="text-primary"
            >
              <Heart size={16} fill={isFavourite ? "currentColor" : "none"} />
            </button>
            <button
              aria-label="Add to cart"
              onClick={handleAdd}
              disabled={!food.is_available}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-muted"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
