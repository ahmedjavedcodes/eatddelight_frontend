export default function CategoryPills({
  categories,
  active,
  onChange,
}: {
  categories: { id: number; name: string }[];
  active: number | "all";
  onChange: (value: number | "all") => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onChange("all")}
        className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
          active === "all"
            ? "border-primary bg-primary text-white"
            : "border-black/10 bg-white text-foreground hover:border-primary/40"
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            active === c.id
              ? "border-primary bg-primary text-white"
              : "border-black/10 bg-white text-foreground hover:border-primary/40"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
