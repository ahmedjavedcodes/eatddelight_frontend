"use client";

import type { FoodVariant } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";

export default function VariantPicker({
  variants,
  selectedId,
  onSelect,
}: {
  variants: FoodVariant[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          onClick={() => onSelect(variant.id)}
          aria-pressed={selectedId === variant.id}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            selectedId === variant.id
              ? "border-primary bg-primary text-white"
              : "border-black/10 bg-white text-foreground hover:border-primary/50"
          }`}
        >
          {variant.label} · {formatPrice(variant.price)}
        </button>
      ))}
    </div>
  );
}
