"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { Food } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart";
import { startScroll, stopScroll } from "@/components/LocomotiveScrollProvider";
import VariantPicker from "@/components/storefront/VariantPicker";

export default function QuickViewModal({
  food,
  onClose,
}: {
  food: Food;
  onClose: () => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  // Favourites are persisted to localStorage; entries saved before variants
  // existed on the Food type won't have this field at all.
  const variants = food.variants ?? [];
  const hasVariants = variants.length > 0;
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const selectedVariant = hasVariants
    ? variants.find((v) => v.id === selectedVariantId)
    : undefined;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    stopScroll();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      startScroll();
    };
  }, [onClose]);

  function handleAdd() {
    if (hasVariants && !selectedVariant) return;

    addItem({
      foodId: food.id,
      variantId: selectedVariant?.id,
      name: selectedVariant ? `${food.name} (${selectedVariant.label})` : food.name,
      unitPrice: selectedVariant ? Number(selectedVariant.price) : Number(food.price),
      quantity: food.min_order_quantity,
      minOrderQuantity: food.min_order_quantity,
      addOns: [],
    });
    onClose();
  }

  // Portaled to <body>: FoodCard (and this modal with it) renders inside
  // the Locomotive Scroll container, which gets a `transform` applied for
  // smooth-scroll simulation. A transformed ancestor becomes the containing
  // block for `fixed` descendants, so without the portal this overlay would
  // be positioned relative to the scrolled content instead of the real
  // viewport.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${food.name} quick view`}
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
              {selectedVariant ? formatPrice(selectedVariant.price) : `From ${formatPrice(food.price)}`}
            </div>

            {hasVariants && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-foreground">Choose a size</p>
                <VariantPicker
                  variants={variants}
                  selectedId={selectedVariantId}
                  onSelect={setSelectedVariantId}
                />
              </div>
            )}

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
                disabled={!food.is_available || (hasVariants && !selectedVariant)}
                className="flex-1 rounded-full text-sm bg-primary px-3 py-2 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-muted"
              >
                {hasVariants && !selectedVariant ? "Select a size" : "Add to Cart"}
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
    </div>,
    document.body,
  );
}
