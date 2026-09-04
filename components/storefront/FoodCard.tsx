"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { Food } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart";
import { useFavouritesStore } from "@/lib/store/favourites";

export default function FoodCard({ food }: { food: Food }) {
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
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
      <Link href={`/food/${food.id}`} className="relative block aspect-square bg-tint">
        {food.image_url ? (
          <Image
            src={food.image_url}
            alt={food.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No image
          </div>
        )}
      </Link>
      <button
        aria-label="Toggle favourite"
        onClick={() => toggleFavourite(food.id)}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm"
      >
        <Heart size={16} fill={isFavourite ? "currentColor" : "none"} />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/food/${food.id}`}>
          <h3 className="font-heading font-semibold text-foreground">
            {food.name}
          </h3>
        </Link>
        {food.description && (
          <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">
            {food.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold text-foreground">
            {formatPrice(food.price)}
          </span>
          <button
            aria-label="Add to cart"
            onClick={handleAdd}
            disabled={!food.is_available}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-muted"
          >
            <Plus size={18} />
          </button>
        </div>
        {!food.is_available && (
          <span className="mt-1 text-xs font-medium text-primary">
            Currently unavailable
          </span>
        )}
      </div>
    </div>
  );
}
