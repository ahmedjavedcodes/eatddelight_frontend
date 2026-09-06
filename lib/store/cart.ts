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
  name: string;
  unitPrice: number;
  quantity: number;
  minOrderQuantity: number;
  notes?: string;
  addOns: CartAddOn[];
}

interface CartState {
  lines: CartLine[];
  addItem: (line: CartLine) => void;
  removeItem: (foodId: number) => void;
  setQuantity: (foodId: number, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addItem: (line) =>
        set((state) => {
          const existing = state.lines.find((l) => l.foodId === line.foodId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.foodId === line.foodId
                  ? { ...l, quantity: l.quantity + line.quantity }
                  : l,
              ),
            };
          }
          return { lines: [...state.lines, line] };
        }),
      removeItem: (foodId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.foodId !== foodId),
        })),
      setQuantity: (foodId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.foodId === foodId ? { ...l, quantity } : l,
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
