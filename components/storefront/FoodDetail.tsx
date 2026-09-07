"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import type { FoodDetail as FoodDetailType } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart";
import { useFavouritesStore } from "@/lib/store/favourites";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import QuantityStepper from "@/components/storefront/QuantityStepper";
import VariantPicker from "@/components/storefront/VariantPicker";

export default function FoodDetail({ food }: { food: FoodDetailType }) {
  const [quantity, setQuantity] = useState(food.min_order_quantity);
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
  const [added, setAdded] = useState(false);
  const variants = food.variants ?? [];
  const hasVariants = variants.length > 0;
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const selectedVariant = hasVariants
    ? variants.find((v) => v.id === selectedVariantId)
    : undefined;

  const hasMounted = useHasMounted();
  const isFavouritePersisted = useFavouritesStore((s) => s.isFavourite(food.id));
  const isFavourite = hasMounted && isFavouritePersisted;
  const toggleFavourite = useFavouritesStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);

  const availableAddOns = food.addons.filter((a) => a.is_available);

  function toggleAddOn(id: number) {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  }

  function handleAdd() {
    if (hasVariants && !selectedVariant) return;

    addItem({
      foodId: food.id,
      variantId: selectedVariant?.id,
      name: selectedVariant ? `${food.name} (${selectedVariant.label})` : food.name,
      unitPrice: selectedVariant ? Number(selectedVariant.price) : Number(food.price),
      quantity,
      minOrderQuantity: food.min_order_quantity,
      addOns: availableAddOns
        .filter((a) => selectedAddOns.includes(a.id))
        .map((a) => ({
          addOnId: a.id,
          name: a.name,
          unitPrice: Number(a.price),
          quantity: 1,
        })),
    });
    setAdded(true);
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-tint">
        {food.image_url ? (
          <Image
            src={food.image_url}
            alt={`${food.name} — homemade dish by Daughter's Delight`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            No image
          </div>
        )}
        <button
          aria-label="Toggle favourite"
          onClick={() => toggleFavourite(food)}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm"
        >
          <Heart size={18} fill={isFavourite ? "currentColor" : "none"} />
        </button>
      </div>

      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {food.name}
        </h1>
        {food.description && <p className="mt-3 text-muted">{food.description}</p>}
        <p className="mt-4 text-2xl font-bold text-primary">
          {selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(food.price)}
        </p>

        {hasVariants && (
          <div className="mt-4">
            <h2 className="font-heading font-semibold text-foreground">Choose a size</h2>
            <div className="mt-3">
              <VariantPicker
                variants={variants}
                selectedId={selectedVariantId}
                onSelect={setSelectedVariantId}
              />
            </div>
          </div>
        )}

        {!food.is_available && (
          <p className="mt-2 text-sm font-semibold text-primary">
            Currently unavailable
          </p>
        )}

        {food.min_order_quantity > 1 && (
          <p className="mt-2 text-sm text-muted">
            Minimum order quantity: {food.min_order_quantity}
          </p>
        )}

        {availableAddOns.length > 0 && (
          <div className="mt-6">
            <h2 className="font-heading font-semibold text-foreground">
              Add-ons
            </h2>
            <div className="mt-3 space-y-2">
              {availableAddOns.map((addOn) => (
                <label
                  key={addOn.id}
                  className="flex items-center justify-between rounded-lg border border-black/10 px-4 py-2.5"
                >
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={selectedAddOns.includes(addOn.id)}
                      onChange={() => toggleAddOn(addOn.id)}
                      className="accent-primary"
                    />
                    {addOn.name}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    +{formatPrice(addOn.price)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Quantity</span>
          <QuantityStepper
            value={quantity}
            min={food.min_order_quantity}
            onChange={setQuantity}
          />
        </div>

        <button
          onClick={handleAdd}
          disabled={!food.is_available || (hasVariants && !selectedVariant)}
          className="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-muted sm:w-auto sm:text-base"
        >
          {added
            ? "Added to Cart ✓"
            : hasVariants && !selectedVariant
              ? "Select a size"
              : "Add to Cart"}
        </button>
      </div>
    </section>
  );
}
