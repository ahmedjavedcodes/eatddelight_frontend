import Link from "next/link";
import DayCard from "@/components/storefront/DayCard";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getWeeklyMenu } from "@/lib/api/menu";
import { todayDayOfWeek, weekdayLabel } from "@/lib/format";

export default async function HomeWeeklyMenuShowcase() {
  const weeklyMenu = await getWeeklyMenu().catch(() => []);
  const today = todayDayOfWeek();

  if (weeklyMenu.length === 0) return null;

  const todayMenu = weeklyMenu.find((entry) => entry.day_of_week === today);

  return (
    <RevealOnScroll as="section" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-sm font-bold uppercase tracking-wide text-primary">
            Today
          </span>
          <h2 className="mt-1 font-heading text-3xl font-semibold text-foreground">
            Today&rsquo;s Special
          </h2>
        </div>
        <Link
          href="/weekly-menu"
          className="text-sm font-semibold text-primary transition hover:text-primary-dark sm:text-base"
        >
          View Weekly Menu →
        </Link>
      </div>

      {todayMenu ? (
        <div className="mt-8">
          <DayCard
            day={weekdayLabel(todayMenu.day_of_week)}
            food={todayMenu.food}
            highlight
          />
        </div>
      ) : (
        <p className="mt-8 text-muted">Today&rsquo;s special is not available right now.</p>
      )}
    </RevealOnScroll>
  );
}
