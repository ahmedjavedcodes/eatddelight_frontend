import { apiFetch } from "./client";
import type {
  Category,
  CategoryWithFoods,
  DayOfWeek,
  Food,
  FoodDetail,
  WeekdayGroup,
} from "./types";

export function getFullMenu() {
  return apiFetch<CategoryWithFoods[]>("/menu", { next: { revalidate: 60 } });
}

export function getWeeklyMenu() {
  return apiFetch<WeekdayGroup[]>("/weekly-menu", { next: { revalidate: 60 } });
}

export function getCategories(excludeWeekly = false) {
  const query = excludeWeekly ? "?exclude_weekly=true" : "";
  return apiFetch<Category[]>(`/categories${query}`, {
    next: { revalidate: 300 },
  });
}

export interface FoodFilters {
  search?: string;
  category_id?: number;
  day_of_week?: DayOfWeek;
  available?: boolean;
  limit?: number;
  offset?: number;
}

export function getFoods(filters: FoodFilters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined) params.set(key, String(value));
  }
  const query = params.toString();
  return apiFetch<Food[]>(`/foods${query ? `?${query}` : ""}`, {
    cache: "no-store",
  });
}

export function getFood(id: number) {
  return apiFetch<FoodDetail>(`/foods/${id}`, { cache: "no-store" });
}
