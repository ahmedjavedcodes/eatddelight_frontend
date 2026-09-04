import Link from "next/link";
import { getWeeklyMenu } from "@/lib/api/menu";
import { formatPrice, todayDayOfWeek, weekdayLabel } from "@/lib/format";

export default async function MenuOfDaySpotlight() {
  const weeklyMenu = await getWeeklyMenu().catch(() => []);
  const today = todayDayOfWeek();
  const todaysSpecial = weeklyMenu.find((entry) => entry.day_of_week === today);

  if (!todaysSpecial) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-primary px-8 py-10 text-white sm:flex-row">
        <div>
          <span className="text-sm font-bold uppercase tracking-wide text-white/80">
            Menu Of The Day
          </span>
          <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">
            {todaysSpecial.food.name}
          </h2>
          <p className="mt-2 max-w-md text-white/85">
            {todaysSpecial.food.description ??
              "Today's single-serving special, ready to order."}
          </p>
          <Link
            href="/weekly-menu"
            className="mt-5 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-primary transition hover:bg-tint"
          >
            See Weekly Menu →
          </Link>
        </div>
        <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-2 border-dashed border-white/70 text-center">
          <span className="text-xs font-semibold uppercase text-white/80">
            {weekdayLabel(todaysSpecial.day_of_week)}
          </span>
          <span className="text-lg font-extrabold">
            {formatPrice(todaysSpecial.food.price)}
          </span>
        </div>
      </div>
    </section>
  );
}
