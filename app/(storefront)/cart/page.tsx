"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { cartLineTotal, useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const total = lines.reduce((sum, line) => sum + cartLineTotal(line), 0);

  if (lines.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Your cart is empty
        </h1>
        <p className="mt-2 text-muted">Browse the menu to add something delicious.</p>
        <Link
          href="/menu"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
        >
          Explore Menu
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-extrabold text-foreground">Your Cart</h1>

      <div className="mt-8 space-y-4">
        {lines.map((line) => {
          const belowMinimum = line.quantity < line.minOrderQuantity;
          return (
            <div
              key={line.foodId}
              className="rounded-xl border border-black/10 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading font-semibold text-foreground">
                    {line.name}
                  </h2>
                  {line.addOns.length > 0 && (
                    <ul className="mt-1 text-sm text-muted">
                      {line.addOns.map((a) => (
                        <li key={a.addOnId}>+ {a.name}</li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-2 text-sm text-muted">
                    {formatPrice(line.unitPrice)} each
                  </p>
                </div>
                <button
                  aria-label="Remove item"
                  onClick={() => removeItem(line.foodId)}
                  className="text-muted hover:text-primary"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) =>
                    setQuantity(line.foodId, Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-20 rounded-lg border border-black/10 px-3 py-1.5 focus:border-primary focus:outline-none"
                />
                <span className="font-semibold text-foreground">
                  {formatPrice(cartLineTotal(line))}
                </span>
              </div>
              {belowMinimum && (
                <p className="mt-2 text-xs font-medium text-primary">
                  Minimum order quantity for this item is {line.minOrderQuantity}.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-6">
        <span className="font-heading text-lg font-bold text-foreground">Total</span>
        <span className="font-heading text-lg font-bold text-foreground">
          {formatPrice(total)}
        </span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-lg bg-primary px-6 py-3 text-center font-semibold text-white hover:bg-primary-dark"
      >
        Proceed to Checkout
      </Link>
    </section>
  );
}
