import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavouritesState {
  foodIds: number[];
  toggle: (foodId: number) => void;
  isFavourite: (foodId: number) => boolean;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      foodIds: [],
      toggle: (foodId) =>
        set((state) => ({
          foodIds: state.foodIds.includes(foodId)
            ? state.foodIds.filter((id) => id !== foodId)
            : [...state.foodIds, foodId],
        })),
      isFavourite: (foodId) => get().foodIds.includes(foodId),
    }),
    { name: "dd:favourites:v1" },
  ),
);
