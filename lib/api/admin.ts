import { apiFetch, ApiError } from "./client";
import { Category, Food, AddOn } from "./types";

// Categories
export async function getCategories(token: string): Promise<Category[]> {
  return apiFetch<Category[]>("/admin/categories", { token });
}

export async function createCategory(
  token: string,
  data: Omit<Category, "id">,
): Promise<Category> {
  return apiFetch<Category>("/admin/categories", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export async function updateCategory(
  token: string,
  id: number,
  data: Partial<Omit<Category, "id">>,
): Promise<Category> {
  return apiFetch<Category>(`/admin/categories/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(token: string, id: number): Promise<void> {
  return apiFetch<void>(`/admin/categories/${id}`, {
    method: "DELETE",
    token,
  });
}

// Foods
export async function getFoods(token: string): Promise<Food[]> {
  return apiFetch<Food[]>("/admin/foods", { token });
}

export async function createFood(
  token: string,
  data: Omit<Food, "id">,
): Promise<Food> {
  return apiFetch<Food>("/admin/foods", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export async function updateFood(
  token: string,
  id: number,
  data: Partial<Omit<Food, "id">>,
): Promise<Food> {
  return apiFetch<Food>(`/admin/foods/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

export async function deleteFood(token: string, id: number): Promise<void> {
  return apiFetch<void>(`/admin/foods/${id}`, {
    method: "DELETE",
    token,
  });
}

// Add-ons
export async function getAddOns(token: string): Promise<AddOn[]> {
  return apiFetch<AddOn[]>("/admin/addons", { token });
}

export async function createAddOn(
  token: string,
  data: Omit<AddOn, "id">,
): Promise<AddOn> {
  return apiFetch<AddOn>("/admin/addons", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export async function updateAddOn(
  token: string,
  id: number,
  data: Partial<Omit<AddOn, "id">>,
): Promise<AddOn> {
  return apiFetch<AddOn>(`/admin/addons/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

export async function deleteAddOn(token: string, id: number): Promise<void> {
  return apiFetch<void>(`/admin/addons/${id}`, {
    method: "DELETE",
    token,
  });
}

// Staff
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "owner" | "staff";
  is_active: boolean;
  created_at: string;
}

export async function getStaff(token: string): Promise<AdminUser[]> {
  return apiFetch<AdminUser[]>("/admin/staff", { token });
}

export async function createStaff(
  token: string,
  data: {
    name: string;
    email: string;
    password: string;
    role: "owner" | "staff";
  },
): Promise<AdminUser> {
  return apiFetch<AdminUser>("/admin/staff", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export async function updateStaff(
  token: string,
  id: number,
  data: {
    name?: string;
    email?: string;
    is_active?: boolean;
  },
): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/admin/staff/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}
