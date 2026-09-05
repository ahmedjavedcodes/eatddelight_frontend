import { UtensilsCrossed } from "lucide-react";
import { getSettings } from "@/lib/api/settings";

export default async function BookingsBox() {
  const settings = await getSettings().catch(() => null);
  if (!settings) return null;

  return (
    <div className="flex items-center gap-5 rounded-2xl bg-primary/5 px-6 py-6 sm:px-8">
      <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-primary sm:flex">
        <UtensilsCrossed size={26} />
      </span>
      <div>
        <h2 className="font-heading text-xl font-semibold uppercase text-foreground sm:text-2xl">
          For Bookings Or Order
        </h2>
        <p className="mt-1 text-lg font-semibold text-primary">
          {settings.contact_phone}
          {" // @"}
          {settings.instagram_handle.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
