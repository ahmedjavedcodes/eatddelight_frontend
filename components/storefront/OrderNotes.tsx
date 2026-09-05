const NOTES = [
  "Minimum order quantity per item: 3",
  "All items are single-serving portions",
  "Subject to availability",
  "Orders must be placed at least one day in advance",
];

export default function OrderNotes() {
  return (
    <div>
      <h2 className="font-heading text-sm font-medium uppercase text-foreground">
        Note
      </h2>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
        {NOTES.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
