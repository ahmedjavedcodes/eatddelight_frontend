"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, Heart } from "lucide-react";
import type { Food } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart";
import { useFavouritesStore } from "@/lib/store/favourites";
import QuickViewModal from "@/components/storefront/QuickViewModal";

export default function FoodCard({ food }: { food: Food }) {
  const isFavourite = useFavouritesStore((s) => s.isFavourite(food.id));
  const toggleFavourite = useFavouritesStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);
  const [showQuickView, setShowQuickView] = useState(false);

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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
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

      <button
        aria-label="Quick view"
        onClick={() => setShowQuickView(true)}
        className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm opacity-0 transition group-hover:opacity-100"
      >
        <Eye size={16} />
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
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-primary">
            From {formatPrice(food.price)}
          </span>
          <button
            aria-label="Add to cart"
            onClick={handleAdd}
            disabled={!food.is_available}
            className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-muted"
          >
            Add to Cart
          </button>
        </div>
        {!food.is_available && (
          <span className="mt-1 text-xs font-medium text-primary">
            Currently unavailable
          </span>
        )}
      </div>

      {showQuickView && (
        <QuickViewModal food={food} onClose={() => setShowQuickView(false)} />
      )}
    </div>
  );
}
