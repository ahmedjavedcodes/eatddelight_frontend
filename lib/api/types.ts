export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri";

export interface SiteSettings {
  business_name: string;
  tagline: string | null;
  about_text: string | null;
  contact_phone: string;
  whatsapp_number: string;
  instagram_handle: string;
  address: string | null;
  opening_hours: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

export interface Food {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: string;
  image_url: string | null;
  is_available: boolean;
  min_order_quantity: number;
  is_single_serving: boolean;
  requires_advance_order: boolean;
  day_of_week: DayOfWeek | null;
}

export interface AddOn {
  id: number;
  name: string;
  price: string;
  is_available: boolean;
  is_global: boolean;
}

export interface FoodDetail extends Food {
  addons: AddOn[];
}

export interface CategoryWithFoods extends Category {
  foods: Food[];
}

export interface WeekdayGroup {
  day_of_week: DayOfWeek;
  food: Food;
}

export interface ContactMessageInput {
  name: string;
  phone_or_email: string;
  message: string;
}

export interface ContactMessage extends ContactMessageInput {
  id: number;
  is_read: boolean;
  created_at: string;
}
