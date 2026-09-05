import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Food } from "@/lib/api/types";

interface FavouritesState {
  foods: Food[];
  toggle: (food: Food) => void;
  isFavourite: (foodId: number) => boolean;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      foods: [],
      toggle: (food) =>
        set((state) => {
          const exists = state.foods.some((f) => f.id === food.id);
          return {
            foods: exists
              ? state.foods.filter((f) => f.id !== food.id)
              : [...state.foods, food],
          };
        }),
      isFavourite: (foodId) => get().foods.some((f) => f.id === foodId),
    }),
    { name: "dd:favourites:v2" },
  ),
);
