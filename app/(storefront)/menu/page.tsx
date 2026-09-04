import type { Metadata } from "next";
import BookingsBox from "@/components/storefront/BookingsBox";
import MenuBrowser from "@/components/storefront/MenuBrowser";
import { getFullMenu } from "@/lib/api/menu";

export const metadata: Metadata = { title: "Menu — Daughter's Delight" };

const NOTES = [
  "Minimum order quantity per item: 3",
  "All items are single-serving portions",
  "Subject to availability",
  "Orders must be placed at least one day in advance",
];

export default async function MenuPage() {
  const categories = await getFullMenu().catch(() => []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
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

      <div className="mx-auto mt-10 max-w-3xl">
        <BookingsBox />
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        <h2 className="font-heading text-sm font-medium uppercase text-foreground">
          Note
        </h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
          {NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <MenuBrowser categories={categories} />
      </div>
    </section>
  );
}
