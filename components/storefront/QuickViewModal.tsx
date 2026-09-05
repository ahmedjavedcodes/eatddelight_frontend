"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { X } from "lucide-react";
import type { Food } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart";
import { startLenis, stopLenis } from "@/components/SmoothScroll";

export default function QuickViewModal({
  food,
  onClose,
}: {
  food: Food;
  onClose: () => void;
}) {
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    stopLenis();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      startLenis();
    };
  }, [onClose]);

  function handleAdd() {
    addItem({
      foodId: food.id,
      name: food.name,
      unitPrice: Number(food.price),
      quantity: food.min_order_quantity,
      minOrderQuantity: food.min_order_quantity,
      addOns: [],
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close quick view"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground shadow-sm hover:bg-tint"
        >
          <X size={18} />
        </button>

        <div className="grid gap-0 sm:grid-cols-2">
          <div className="relative aspect-square bg-tint">
            {food.image_url ? (
              <Image
                src={food.image_url}
                alt={food.name}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">
                No image
              </div>
            )}
          </div>

          <div className="flex flex-col p-6">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              {food.name}
            </h2>
            {food.description && (
              <p className="mt-2 text-sm text-muted">{food.description}</p>
            )}

            <div className="mt-4 text-lg font-semibold text-primary">
              From {formatPrice(food.price)}
            </div>

            <div className="mt-3 space-y-1 text-xs text-muted">
              <p>Minimum order quantity: {food.min_order_quantity}</p>
              {food.requires_advance_order && (
                <p>Requires at least 1 day advance order</p>
              )}
              {!food.is_available && (
                <p className="font-medium text-primary">Currently unavailable</p>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAdd}
                disabled={!food.is_available}
                className="flex-1 rounded-full text-sm bg-primary px-3 py-2 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-muted"
              >
                Add to Cart
              </button>
              <Link
                href={`/food/${food.id}`}
                onClick={onClose}
                className="flex-1 rounded-full text-sm border border-primary px-3 py-2 text-center font-semibold text-primary transition hover:bg-tint"
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
