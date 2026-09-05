import Link from "next/link";
import HomeMenuFilter from "@/components/storefront/home/HomeMenuFilter";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getFullMenu } from "@/lib/api/menu";

export default async function MenuShowcase() {
  const categories = await getFullMenu().catch(() => []);
  const hasFoods = categories.some((c) => c.foods.length > 0);

  return (
    <RevealOnScroll as="section" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-sm font-bold uppercase tracking-wide text-primary">
            Menu
          </span>
          <h2 className="mt-1 font-heading text-3xl font-semibold text-foreground">
            Explore Our Dishes
          </h2>
        </div>
        <Link
          href="/menu"
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark"
        >
          View Full Menu →
        </Link>
      </div>

      {/* Categories + foods, filterable */}
      {hasFoods ? (
        <div className="mt-6">
          <HomeMenuFilter categories={categories} />
        </div>
      ) : (
        <div className="mt-8 rounded-lg bg-tint p-8 text-center">
          <p className="text-muted">Menu items coming soon. Check back later!</p>
          <Link
            href="/menu"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
          >
            Browse Full Menu
          </Link>
        </div>
      )}
    </RevealOnScroll>
  );
}
