import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({
  value,
  min = 1,
  onChange,
}: {
  value: number;
  min?: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-black/10 p-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-7 w-7 items-center justify-center rounded-full text-foreground transition hover:bg-tint disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm font-semibold text-foreground">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className="flex h-7 w-7 items-center justify-center rounded-full text-foreground transition hover:bg-tint"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
