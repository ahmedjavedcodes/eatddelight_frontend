import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getFoods } from "@/lib/api/menu";

type Entry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/menu", priority: 0.9, changeFrequency: "daily" },
  { path: "/weekly-menu", priority: 0.9, changeFrequency: "daily" },
  { path: "/custom-orders", priority: 0.7, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const foods = await getFoods({ available: true, limit: 200 }).catch(() => []);
  const foodEntries: MetadataRoute.Sitemap = foods.map((food) => ({
    url: `${SITE_URL}/food/${food.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...foodEntries];
}
