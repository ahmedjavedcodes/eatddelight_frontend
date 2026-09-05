import type { Metadata } from "next";
import BookingsBox from "@/components/storefront/BookingsBox";
import MenuBrowser from "@/components/storefront/MenuBrowser";
import OrderNotes from "@/components/storefront/OrderNotes";
import { getFullMenu } from "@/lib/api/menu";

export const metadata: Metadata = { title: "Menu — Daughter's Delight" };

export default async function MenuPage() {
  const categories = await getFullMenu().catch(() => []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      {/* Header and description */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-sm font-bold uppercase tracking-wide text-primary">
          Full Menu
        </span>
        <h1 className="mt-2 font-heading text-4xl font-semibold text-foreground sm:text-5xl">
          Our À La Carte Menu
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          A larger catalog organized into categories &mdash; browse, search,
          and add what you like to your cart.
        </p>
      </div>

      {/* Banner */}
      <div className="mx-auto mt-10 max-w-3xl">
        <BookingsBox />
      </div>

      {/* Search + filters, categories, menu items */}
      <div className="mt-10">
        <MenuBrowser categories={categories} />
      </div>

      {/* Note */}
      <div className="mx-auto mt-12 max-w-3xl">
        <OrderNotes />
      </div>
    </section>
  );
}
