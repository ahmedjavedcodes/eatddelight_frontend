import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartAddOn {
  addOnId: number;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface CartLine {
  foodId: number;
  // Set when the product has size variants; the specific size the
  // customer picked. Two lines for the same food but different variants
  // are kept separate (different prices), never merged into one.
  variantId?: number;
  name: string;
  unitPrice: number;
  quantity: number;
  minOrderQuantity: number;
  notes?: string;
  addOns: CartAddOn[];
}

function isSameLine(a: CartLine, b: { foodId: number; variantId?: number }): boolean {
  return a.foodId === b.foodId && (a.variantId ?? null) === (b.variantId ?? null);
}

interface CartState {
  lines: CartLine[];
  addItem: (line: CartLine) => void;
  removeItem: (foodId: number, variantId?: number) => void;
  setQuantity: (foodId: number, quantity: number, variantId?: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addItem: (line) =>
        set((state) => {
          const existing = state.lines.find((l) => isSameLine(l, line));
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                isSameLine(l, line) ? { ...l, quantity: l.quantity + line.quantity } : l,
              ),
            };
          }
          return { lines: [...state.lines, line] };
        }),
      removeItem: (foodId, variantId) =>
        set((state) => ({
          lines: state.lines.filter((l) => !isSameLine(l, { foodId, variantId })),
        })),
      setQuantity: (foodId, quantity, variantId) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            isSameLine(l, { foodId, variantId }) ? { ...l, quantity } : l,
          ),
        })),
      clear: () => set({ lines: [] }),
    }),
    { name: "dd:cart:v1" },
  ),
);

export function cartLineTotal(line: CartLine): number {
  const addOnsTotal = line.addOns.reduce(
    (sum, a) => sum + a.unitPrice * a.quantity,
    0,
  );
  return (line.unitPrice + addOnsTotal) * line.quantity;
}

export function cartLineKey(line: { foodId: number; variantId?: number }): string {
  return `${line.foodId}:${line.variantId ?? "base"}`;
}
