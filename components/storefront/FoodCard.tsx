"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Eye, Heart, Plus } from "lucide-react";
import type { Food } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart";
import { useFavouritesStore } from "@/lib/store/favourites";
import { useHasMounted } from "@/lib/hooks/useHasMounted";

// Code-split: only fetched when a user actually opens Quick View, instead
// of shipping in every page's initial bundle just because a FoodCard grid
// is on the page (menu, home, favourites all render many of these).
const QuickViewModal = dynamic(
  () => import("@/components/storefront/QuickViewModal"),
  { ssr: false },
);

export default function FoodCard({ food }: { food: Food }) {
  const hasMounted = useHasMounted();
  const isFavouritePersisted = useFavouritesStore((s) => s.isFavourite(food.id));
  const isFavourite = hasMounted && isFavouritePersisted;
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
        onClick={() => toggleFavourite(food)}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm"
      >
        <Heart size={16} fill={isFavourite ? "currentColor" : "none"} />
      </button>

      <button
        aria-label="Quick view"
        onClick={() => setShowQuickView(true)}
        className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm"
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
          <span className="min-w-0 truncate text-sm font-semibold text-primary">
            From {formatPrice(food.price)}
          </span>
          <button
            aria-label="Add to cart"
            onClick={handleAdd}
            disabled={!food.is_available}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-muted sm:h-auto sm:w-auto sm:px-4 sm:py-2"
          >
            <Plus size={16} className="sm:hidden" />
            <span className="hidden text-xs font-semibold sm:inline">Add to Cart</span>
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
