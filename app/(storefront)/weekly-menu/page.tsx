import type { Metadata } from "next";
import BookingsBox from "@/components/storefront/BookingsBox";
import DayCard from "@/components/storefront/DayCard";
import { getWeeklyMenu } from "@/lib/api/menu";
import { todayDayOfWeek, weekdayLabel } from "@/lib/format";

export const metadata: Metadata = { title: "Weekly Menu | Daughter's Delight" };

const NOTES = [
  "All items are single-serving portions",
  "Orders must be placed at least one day in advance",
  "Daily items are available only on their assigned day",
];

export default async function WeeklyMenuPage() {
  const weeklyMenu = await getWeeklyMenu().catch(() => []);
  const today = todayDayOfWeek();

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="text-sm font-bold uppercase tracking-wide text-primary">
          Daily Special
        </span>
        <h1 className="mt-2 font-heading text-4xl font-semibold text-foreground sm:text-5xl">
          Menu Of The Day
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Enjoy a rotating daily menu with freshly prepared homemade meals.
          Each day features a different item, available only on that specific
          day.
        </p>
      </div>

      {weeklyMenu.length === 0 ? (
        <p className="mt-10 text-center text-muted">
          The weekly menu isn&rsquo;t available right now.
        </p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {weeklyMenu.map((entry) => (
            <DayCard
              key={entry.day_of_week}
              day={weekdayLabel(entry.day_of_week)}
              food={entry.food}
              highlight={entry.day_of_week === today}
            />
          ))}
        </div>
      )}

      <div className="mt-10">
        <BookingsBox />
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-sm font-extrabold uppercase text-foreground">
          Note
        </h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
          {NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
