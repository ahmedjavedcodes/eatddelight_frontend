import { apiFetch } from "./client";
import type { SiteSettings } from "./types";

export function getSettings() {
  return apiFetch<SiteSettings>("/settings", { next: { revalidate: 300 } });
}

export function whatsappUrl(settings: Pick<SiteSettings, "whatsapp_number">, message: string) {
  return `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(message)}`;
}
