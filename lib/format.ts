export function formatPrice(value: string | number): string {
  const amount = typeof value === "string" ? Number(value) : value;
  return `Rs. ${amount.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
}

const WEEKDAY_LABELS: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
};

export function weekdayLabel(day: string): string {
  return WEEKDAY_LABELS[day] ?? day;
}

export function todayDayOfWeek(): string | null {
  const map = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return map[new Date().getDay()];
}
